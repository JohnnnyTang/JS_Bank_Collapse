<template>
    <div class="total-controller">
        <div class="title">
            <Decoration7 style="width: 30vw; height: 5vh;" :color="['rgb(28,13,106)', 'rgb(88,146,255)']">
                <div class="title-back">
                    <span class="title-text">要素查询</span>
                </div>
            </Decoration7>
            <div class="miniIcon" @click="close"></div>
        </div>
        <hr>

        <div class="content">
            <div class="data-theme">
                <div class="scene-area">
                    <div class="text">数据专题</div>
                    <div class="data-theme-tags">
                        <el-check-tag v-for="(item, i) in Scenes" :key="i" @click="SceneTagClickHandler(i)"
                            :checked="sceneTagChecked[i]">{{ item }}</el-check-tag>
                    </div>
                </div>
                <div class="lg-area sub-data-theme-tags">
                    <el-check-tag :checked="LGroupsTagChecked[i]" type="primary" @change="LGroupsTagClickHandler(i)"
                        v-for="(item, i) in LGroups">
                        {{ item }}
                    </el-check-tag>
                </div>
            </div>

            <div class="e-input">
                <span class="text">要素检索</span>
                <el-input v-model="filterText" style="width: 13vw" placeholder="请输入关键词" />
            </div>
            <div class="tree-container">
                <div class="feature-desc">
                    <div class="text">共有要素 {{ featureCount }} 条</div>
                </div>
                <el-tree ref="treeRef" style="max-width: 16.2vw" :data="data" :props="defaultProps" default-expand-all
                    :filter-node-method="filterNode">

                    <template #default="{ node, data }">
                        <span class="custom-tree-node">
                            <span class="text">{{ node.label }}</span>
                            <el-button type="primary" plain
                                v-if="node.isLeaf && node.label != '长江干堤' && node.label != '里程桩'"
                                @click="detailClickHandler(node, data)">查看详情</el-button>
                            <!-- <el-button type="primary" plain v-else-if="node.level === 2">图例展示</el-button> -->
                        </span>
                    </template>
                </el-tree>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { Decoration7 } from '@kjgl77/datav-vue3'
import { ElTree, ElMessage } from 'element-plus';
import { useMapStore, useNewSceneStore, useHighlightLayerStore } from '../../../../store/mapStore';
import axios from 'axios';
import { sourceNameMap, sourceZoomMap, sourceColumnMap } from '../../js/tilefieldMAP'
import { tree } from '../../js/SCENES'

// data
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
const defaultProps = {
    children: 'children',
    label: 'label',
}
const filterText = ref('')
const treeRef = ref()
const selectedLayer = ref('')
const sceneStore = useNewSceneStore()
const mapStore = useMapStore()
const data = ref([])
const emit = defineEmits(['close', 'featureInfo'])
const Scenes = ref(['全江概貌', '工程情况', '重点岸段'])
const sceneTagChecked = ref([true, false, false])
const LGroups = ref(['行政区划', '河道分段', '流域水系', '湖泊河流', '水文站点'])
const LGroupsTagChecked = ref([true, false, false, false, false])
const featureCount = ref(0)
const highlightLayer = ref([])


watch(filterText, (val) => {
    treeRef.value.filter(val)
})
watch(() => sceneStore.latestScene, (newV, oldV) => {
    let sceneIndex = Scenes.value.indexOf(oldV)
    sceneIndex != -1 && (sceneTagChecked.value[sceneIndex] = false)
    sceneIndex = Scenes.value.indexOf(newV)
    sceneIndex != -1 && (sceneTagChecked.value[sceneIndex] = true)
    updateLgroupTags(newV)
})


const filterNode = (value, data) => {
    if (!value) return true
    return data.label.includes(value)
}
const close = () => {
    emit('close', 0)
}

const SceneTagClickHandler = (i) => {
    for (let i = 0; i < sceneTagChecked.value.length; i++) {
        sceneTagChecked.value[i] = false
    }
    sceneTagChecked.value[i] = true
    featureCount.value = 0
    data.value = []
    updateFeatureCount()
    updateLgroupTags(Scenes.value[i])
}
const updateLgroupTags = (sceneName) => {
    // LGroupsTagChecked.value = [true, false, false, false, false]
    let newLayerGroupTags = []
    for (let i = 0; i < tree.length; i++) {
        if (tree[i].label === sceneName) {
            let children = tree[i].children
            for (let j = 0; j < children.length; j++) {
                newLayerGroupTags.push(children[j].label)
            }
            break
        }
    }
    let falseArray = new Array(newLayerGroupTags.length).fill(false)

    LGroups.value = newLayerGroupTags
    LGroupsTagChecked.value = falseArray
    data.value = []
    updateFeatureCount()
    LGroupsTagClickHandler(0)
}


const LGroupsTagClickHandler = async (i) => {

    LGroupsTagChecked.value[i] = !LGroupsTagChecked.value[i]

    if (LGroups.value[i] === '长江干堤') {
        let featArray1 = await getLayerFeatureArray(mapStore.getMap(), '长江干堤')
        let featArray2 = await getLayerFeatureArray(mapStore.getMap(), '里程桩')

        if (LGroupsTagChecked.value[i]) {
            let treeNode1 = {
                label: '长江干堤', children: []
            }
            let treeNode2 = {
                label: '里程桩', children: []
            }
            data.value.push(treeNode1, treeNode2)
        } else {
            deleteTreeData()
        }
        // updateFeatureCount()
        featureCount.value = (featArray1.length + featArray2.length)

    } else {
        if (LGroupsTagChecked.value[i]) {
            await appednTreeData()
        } else {
            deleteTreeData()
        }
        updateFeatureCount()

    }
}

const appednTreeData = async () => {
    let checkedLayerGroup = []
    for (let i = 0; i < LGroupsTagChecked.value.length; i++) {
        if (LGroupsTagChecked.value[i]) {
            checkedLayerGroup.push(LGroups.value[i])
        }
    }
    // console.log(checkedLayerGroup);

    let layers = []
    for (let i = 0; i < checkedLayerGroup.length; i++) {
        layers.push(...sceneStore.LAYERGROUPMAP.value[checkedLayerGroup[i]].layerIDs)
    }

    let map = mapStore.getMap()
    for (let i = 0; i < layers.length; i++) {
        //tool
        const treeHasNode = (nodeName) => {
            for (let i = 0; i < data.value.length; i++) {
                if (data.value[i].label === nodeName) {
                    return true
                }
            }
            return false
        }

        // 特殊图层
        if (layers[i].includes('注记') || layers[i].includes('省级行政区') ||
            layers[i] === '过江通道-桥墩'
        ) {
            continue
        }
        if (layers[i].includes('过江通道')) {
            let treeNode1 = {
                label: '已建通道',
                children: []
            }
            let treeNode2 = {
                label: '在建通道',
                children: []
            }
            let treeNode3 = {
                label: '规划通道',
                children: []
            }
            let res1 = (await axios.get(tileServer + `/tile/vector/riverPassageLine/info`)).data
            let res2 = (await axios.get(tileServer + `/tile/vector/riverPassagePolygon/info`)).data
            // let res = [...res1, ...res2]
            res1.forEach(item => {
                item.source = 'riverPassageLine'
                if (item.plan === 1) {
                    treeNode1.children.push({
                        label: item.name,
                        property: item
                    })
                } else if (item.plan === 0) {
                    treeNode2.children.push({
                        label: item.name,
                        property: item
                    })
                } else if (item.plan === -1) {
                    treeNode3.children.push({
                        label: item.name,
                        property: item
                    })
                }
            })
            res2.forEach(item => {
                item.source = 'riverPassagePolygon'
                if (item.plan === 1) {
                    treeNode1.children.push({
                        label: item.name,
                        property: item
                    })
                } else if (item.plan === 0) {
                    treeNode2.children.push({
                        label: item.name,
                        property: item
                    })
                } else if (item.plan === -1) {
                    treeNode3.children.push({
                        label: item.name,
                        property: item
                    })
                }
            })
            console.log(treeNode1, treeNode2, treeNode3);
            if (!treeHasNode('已建通道')) data.value.push(treeNode1)
            if (!treeHasNode('在建通道')) data.value.push(treeNode2)
            if (!treeHasNode('规划通道')) data.value.push(treeNode3)

            continue
        }



        let layerid = layers[i]
        if (!map.getLayer(layerid)) {
            ElMessage({
                message: '图层尚未加载，请先加载相应专题数据',
                type: 'warning',
            })

            continue
        }
        let sourceid = map.getLayer(layerid).source
        // 监测当前treeNode是否已经存在Node

        if (treeHasNode(layerid)) continue



        let res = await getLayerFeatureArray(map, layerid)
        let treeNode = {
            label: layerid,
            children: []
        }
        for (let i = 0; i < res.length; i++) {
            treeNode.children.push({
                label: res[i][sourceNameMap[sourceid]],
                property: res[i],
            })
        }
        data.value.push(treeNode)
        updateFeatureCount()
        // featureCount.value = featureCount.value + res.length
    }



}
const deleteTreeData = async () => {
    let noCcheckedLayerGroup = []
    for (let i = 0; i < LGroupsTagChecked.value.length; i++) {
        if (!LGroupsTagChecked.value[i]) {
            noCcheckedLayerGroup.push(LGroups.value[i])
        }
    }
    let noLayers = []

    if (noCcheckedLayerGroup.includes('过江通道')) {
        noLayers = ['已建通道', '在建通道', '规划通道']
    }
    for (let i = 0; i < noCcheckedLayerGroup.length; i++) {
        noLayers.push(...sceneStore.LAYERGROUPMAP.value[noCcheckedLayerGroup[i]].layerIDs)
    }
    for (let i = 0; i < noLayers.length; i++) {

        let index = -1
        for (let j = 0; j < data.value.length; j++) {
            if (data.value[j].label === noLayers[i]) {
                index = j
                break
            }
        }

        index != -1 && data.value.splice(index, 1)
    }
    updateFeatureCount()
}

const detailClickHandler = (node, data) => {
    let layerId = node.parent.data.label
    let featureId = data.label
    let property = data.property

    // 要素高亮
    featureHighLight(layerId, mapStore.getMap(), featureId, property)

}

const updateFeatureCount = () => {
    let num = 0
    for (let i = 0; i < data.value.length; i++) {
        num = num + data.value[i].children.length
    }
    featureCount.value = num
}


onMounted(() => {
    setTimeout(() => {
        appednTreeData()
    }, 2000)
})

//// tools 
const getLayerFeatureArray = async (mapInstance, layerName) => {

    // 特殊图层
    if (layerName.includes('注记') || layerName.includes('地形')) {
        return []
    }

    // 获取要素数组的函数
    let properties = []

    let layer = mapInstance.getLayer(layerName)
    if (!layer) return properties

    let sourceId = layer.source
    let source = mapInstance.getSource(sourceId)
    if (!source) return properties

    if (source.type == 'geojson') {
        let geofeatures = source['_data']['features']
        for (let i = 0; i < geofeatures.length; i++) {
            properties.push(geofeatures[i]['properties'])
        }
    }
    else if (source.type == 'vector') {

        const res = await axios.get(tileServer + `/tile/vector/${sourceId}/info`)
        properties = res.data

        // 此处要注意，有的图层未经分类，有的图层经过分类，需要筛选一波
        // 缓一下，整理一下，整体加一波filter的逻辑，先写个if吧
        // special
        if (sourceId == 'riverSection') {
            let n = []
            for (let i = 0; i < properties.length; i++) {
                if (properties[i].label != '') n.push(properties[i]);
            }
            properties = n
        }
        else if (sourceId == 'importantBank') {
            let warningLevelMap = {
                '一级预警岸段': 1,
                '二级预警岸段': 2,
                '三级预警岸段': 3,
            }
            let n = []
            for (let i = 0; i < properties.length; i++) {
                if (warningLevelMap[layerName] === properties[i].warning_level) n.push(properties[i]);
            }
            properties = n
        }


    }
    return properties;
}

const featureHighLight = (featureLayerid, map, featureName, property) => {

    let layerId
    let featureId
    let featureLayer
    let sourceid

    if (featureLayerid.includes('通道')) {
        // layerId = '过江通道-'
        sourceid = property.source
        layerId = (sourceid === 'riverPassagePolygon' ? '过江通道-桥' : '过江通道-隧道/通道')
        featureId = featureName
        featureLayer = map.getLayer(layerId)

    } else {
        layerId = featureLayerid
        featureId = featureName
        featureLayer = map.getLayer(layerId)
        sourceid = featureLayer.source
    }


    emit('featureInfo', {
        ogData: property,
        sourceId: sourceid,
        column: sourceColumnMap[sourceid]
    })

    let paintMap = {
        'line': {
            'line-color': '#FF5D06',
            'line-width': 5,
        },
        'fill': {
            'fill-color': '#FF5D06',
            'fill-opacity': 0.8
        },
        'circle': {
            'circle-color': '#FF5D06',
            'circle-radius': 8,
        },
        'symbol': {

        },
        'fill-extrusion': {
            'fill-extrusion-color': '#FF5D06',
            'fill-extrusion-base': 200,
            'fill-extrusion-height': 210,
            'fill-extrusion-opacity': 1.0
        }
    }

    // 1  add highlight layer
    map.addLayer({
        id: `${layerId}-highlight-${featureId}`,//自定义
        type: featureLayer.type,
        source: featureLayer.source,
        'source-layer': featureLayer.sourceLayer,
        filter: ['==', ['get', sourceNameMap[sourceid]], featureName],//自定义
        layout: {
        },
        paint: paintMap[featureLayer.type],
    })

    // 2  use expression  但不适用于现在的Map 还是用加图层的办法
    // map.setPaintProperty(layerId, 'fill-color', [
    //     'match',
    //     ['get', sourceNameMap[sourceid]], // 获取要素的'name'属性
    //     'featureName', ['literal', 'rgba(255, 0, 0, 1)'], // 如果'name'是'123'，则使用红色高亮
    //     ['literal', map.getPaintProperty(layerId, 'fill-color')] // 否则保持原有样式
    // ]);


    let lng = property.center_x
    let lat = property.center_y
    map.jumpTo({
        center: [lng, lat],
        zoom: sourceZoomMap[featureLayer.source] ? sourceZoomMap[featureLayer.source] : 10
    });

    highlightLayer.value.push(`${layerId}-highlight-${featureId}`)
    useHighlightLayerStore().highlightLayers = highlightLayer.value;
    // setTimeout(() => {
    //     if (map.getLayer(`${layerId}-highlight-${featureId}`))
    //         map.removeLayer(`${layerId}-highlight-${featureId}`)
    // }, 3000)
}

const getCenterCoord = (coordsArray) => {
    if (coordsArray.length % 2) {
        return coordsArray[Math.floor(coordsArray.length / 2)]
    } else {
        let long =
            (coordsArray[coordsArray.length / 2][0] +
                coordsArray[coordsArray.length / 2 - 1][0]) /
            2
        let lat =
            (coordsArray[coordsArray.length / 2][1] +
                coordsArray[coordsArray.length / 2 - 1][1]) /
            2
        return [long, lat]
    }
}

</script>

<style lang="scss" scoped>
div.total-controller {

    position: relative;
    z-index: 3;
    pointer-events: all;

    width: 20vw;
    height: 50vh;
    background-color: rgb(239, 247, 253);
    border-radius: 1%;
    box-shadow: 0px 0px 10px 1px #b3b2b2ee;

    .title {
        position: relative;
        width: 20vw;
        height: 5vh;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
            cursor: move;
        }

        .title-back {
            padding-left: 1vw;
            padding-right: 1vw;

            // height: 5vh;
            .title-text {
                font-size: calc(0.8vh + 1vw);
                font-weight: 600;
                line-height: 5vh;
                color: rgb(75, 115, 181);
            }
        }

        .miniIcon {
            position: absolute;
            right: 0.5vw;
            width: 4vh;
            height: 4vh;
            background-image: url('/icons/minimize.png');
            background-size: contain;
            background-repeat: no-repeat;

            &:hover {
                cursor: pointer;
            }
        }


    }

    .content {
        position: relative;
        width: 20vw;
        height: 45vh;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;


        .data-theme {
            width: 19vw;
            height: 10vh;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;

            .scene-area {
                height: 3vh;
                display: flex;
                flex-direction: row;
            }

            .lg-area {
                width: 19vw;
                height: 4vh;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-around;
                overflow-x: auto;

                :deep(.el-check-tag.el-check-tag--primary) {
                    // width: 1.5vw;
                    // height: 2.5vh;
                    // margin: calc(0.1vw + 0.3vh);
                    // padding: calc(0.3vw + 0.5vh);
                    // margin: 0;
                    padding: calc(0.1vw + 0.3vh);
                    margin-left: 0.1vw;
                    margin-right: 0.1vw;
                    width: 2vw;
                    height: 3vh;
                    display: block;
                    text-align: center;
                }
            }

        }

        .e-input {
            width: 18vw;
            height: 4vh;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            transform: translateY(-20%);
            scale: 1.0;
        }

        .tree-container {
            position: relative;
            width: 17vw;
            height: 27.5vh;
            padding-left: 1vw;
            padding-bottom: 1vh;
            padding-top: 0.5vh;
            box-shadow: rgb(201, 230, 255) 0px 0px 5px 3px inset;
            border-radius: 1%;
            overflow-y: auto;
            overflow-x: auto;

            .feature-desc {
                height: 3vh;
                text-align: left;
            }

            :deep(.el-tree) {
                background-color: rgb(239, 247, 253);
                height: 24vh;
                overflow-y: auto;
                overflow-x: auto;

                &::-webkit-scrollbar {
                    width: 5px;
                }

                &::-webkit-scrollbar-track {
                    background-color: rgba(162, 168, 168, 0.219);
                }

                &::-webkit-scrollbar-thumb {
                    background-color: rgb(94, 164, 250);
                    border-radius: 5px;
                }

                &::-webkit-scrollbar-thumb:hover {
                    background-color: rgb(48, 136, 243);
                }



            }



            .custom-tree-node {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-right: 8px;

                .text {
                    font-size: calc(0.6vw + 0.4vh);
                    color: rgb(19, 70, 147);
                    font-weight: 500;
                    font-family: 'Microsoft YaHei';
                }

            }

        }
    }

}


.text {
    font-family: 'Microsoft YaHei', Helvetica, sans-serif;
    font-size: calc(0.5vw + 0.7vh);
    padding-right: 1vw;
    font-weight: 600;
    color: rgb(75, 115, 181);
}


hr {
    position: relative;
    margin-top: 0.1vh;
    margin-bottom: 0.1vh;
    border: 0;
    height: 0.4vh;
    width: 90%;
    background-image: linear-gradient(to right, rgb(65, 90, 255), rgb(14, 155, 219), rgb(65, 90, 255));
}

:deep(.el-button) {
    transform: scale(0.8);
    padding: 5px 5px;
    height: 25px;

    span {
        font-size: calc(0.5vw + 0.5vh);
    }
}

:deep(.el-check-tag.el-check-tag--primary) {
    user-select: none;
}
</style>
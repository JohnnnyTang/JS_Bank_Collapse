<template>
    <div class="data-visual-container">
        <div class="sideBar">
            <dv-border-box9>
                <div class="sideBar-container">
                    <dv-decoration-11 style="width:75%;height: 6.5vh;">
                        <div class="title-text">
                            综合数据专题
                        </div>
                    </dv-decoration-11>
                    <hr class="hr_gradient">
                    <div class="scenes-tree-container" v-loading="sideBarLoading">
                        <el-tree style="max-width: 400px" :data="dataSource" :expand-on-click-node="false" node-key="label"
                            :default-expanded-keys="expandKey">
                            <template #default="{ node, data }">
                                <span class="custom-tree-node">
                                    <div class="scene-card" v-if="data.type == 'title1'">
                                        <div class="scene-top-section" :class="{ active: data.active }">
                                            <div class="scene-title">
                                                <div class="scene-title-text">
                                                    {{ data.label }}
                                                </div>
                                            </div>
                                        </div>
                                        <el-switch v-model="data.active" :active-action-icon="View"
                                            :inactive-action-icon="Hide" size="large" @change="viewChange(node, data)" />
                                    </div>
                                    <div class="subScene-container" v-else-if="data.type == 'title2'">
                                        <div class="card" :class="{ active: data.active }">
                                            <div class="top-section">
                                                <div class="title">
                                                    <div class="subScene-title-text">
                                                        {{ data.label }}
                                                    </div>
                                                </div>
                                            </div>
                                            <el-switch v-model="data.active" :active-action-icon="View"
                                                :inactive-action-icon="Hide" size="small"
                                                @change="viewChange(node, data)" />
                                        </div>
                                    </div>
                                    <div class="feature-container" v-else-if="data.type == 'feature'">
                                        <div class="feature-content">
                                            {{ data.label }}
                                        </div>
                                    </div>
                                </span>
                            </template>
                        </el-tree>
                    </div>
                </div>
            </dv-border-box9>
        </div>
        <div class="mapBase">
            <div ref="mapContainer" id="map"></div>
        </div>
        <div class="tools-container">
            <div class="icon-container" v-for="i in 2" :key="i">
                <div class="icon" :style="styles[i - 1]" @click="toolClick(i - 1)"
                    :class="{ 'active': activeStatus[i - 1] }">
                </div>
            </div>
        </div>

        <!-- <div class="search-pos" v-show="activeStatus[0]" v-draggable="{ bounds: 'body', cancel: 'div.content' }">
            <featSearch @close="closeHandler" @featureInfo="selectFeatureHandler"></featSearch>
        </div> -->
        <!-- <div class="layer-pos" v-show="activeStatus[1]" v-draggable="{ bounds: 'body', cancel: 'div.content' }">
            <layerCtrl @close="closeHandler"></layerCtrl>
        </div> -->

        <div class="legend-pos" v-show="activeStatus[0]" v-draggable="{ bounds: 'body', cancel: 'div.content' }">
            <mapLegend @close="closeHandler(0)" :legendList="legendList"></mapLegend>
        </div>

        <div class="featDetail" v-show="showDetail" v-draggable="{ bounds: 'body', cancel: 'div.content' }">
            <featDetail :column="featureInfo.column" :ogData="featureInfo.ogData" :sourceId="featureInfo.sourceId"
                @close="showDetail = false"></featDetail>
        </div>

        <div class="infomation-pannel" v-show="showInfoPannel" v-draggable="{ bounds: 'body', cancel: 'div.content' }"
            v-loading="pannelLoading" v-click-out-side="() => showInfoPannel = false">
            <div class="close" @click="showInfoPannel = false; showDetail = false"></div>
            <div class="important-feature">
                <el-table :data="infoTableData" height="30vh" border>
                    <el-table-column v-for="(item, index) in infoTableHeader" :key="index" :prop="item.prop"
                        :label="item.label"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="80">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="detailClickHandler4Feature(scope.row)">
                                查看详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>


        <div class="hydro-pannel">
            <div class="title"> 实时水文信息</div>
            <el-table :data="waterTableData" border style="width: 100%">
                <el-table-column prop="station" label="站点" />
                <el-table-column prop="flow" label="流量" />
                <el-table-column prop="level" label="水位" />
            </el-table>
        </div>

        <!-- 底图切换 -->
        <div class="radio-container">
            <el-radio-group v-model="baseMapRadio" size="large" @change="baseMapChangeHandler">
                <el-radio-button label="矢量底图" value=1 />
                <el-radio-button label="影像底图" value=0 />
            </el-radio-group>
        </div>
    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"
import { onMounted, ref, watch, onUnmounted } from 'vue';
import { Hide, View } from '@element-plus/icons-vue'
import axios from 'axios';
import { BorderBox9 as DvBorderBox9, Decoration11 as DvDecoration11 } from '@kjgl77/datav-vue3'
import { clickOutSide as vClickOutSide } from '@mahdikhashan/vue3-click-outside'
import mapLegend from '../components/dataVisual/common/tool/legend.vue'
import featDetail from '../components/dataVisual/common/tool/featDetail.vue';

import { initBaseMap, getStyleJson4base, getImageStyleJson } from '../utils/mapUtils';
import { scenes, layerGroups, LayerGroup, lableLayerMap } from '../components/dataVisual/js/SCENES';
import { useMapStore, useNewSceneStore, useHighlightLayerStore } from '../store/mapStore';
import { sourceFieldMap, legendMap, legendStyleMap, sourceColumnMap, sourceZoomMap, legendListt, layerSourceMap, sourceNameMap } from '../components/dataVisual/js/tilefieldMAP';
import { initSortedLayer } from '../components/dataVisual/layerUtil'
import { getSideBarTree, showLayers, hideLayers, DICT } from '../components/dataVisual/js/useful'

// data
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
const mapContainer = ref()
const mapStore = useMapStore()
const activeStatus = ref([false, false])
const styles = [
    { backgroundImage: `url('/icons/legend.png')` },
    { backgroundImage: `url('/icons/full.png')` },
]
const featureInfo = ref({})
let nowSource
const showDetail = ref(false)
const showInfoPannel = ref(false)
const sideBarLoading = ref(true)
const legendList = ref([])
const waterTableData = [
    {
        station: '大通站',
        flow: 'N/A',
        level: 'N/A',
    },
]
const infoTableData = ref([])
const infoTableHeader = ref([])
const pannelLoading = ref(true)
const baseMapRadio = ref(1)
const dataSource = ref([])
const testSwitch = ref(true)

const expandKey = ['重点岸段', '全江概貌']

/////// 

const viewChange = (node, data) => {
    const map = mapStore.getMap()
    const title2processMap = {
        '一级预警岸段': (active) => {
            if (active) {
         
            }
            // let filter1 = ['in', 'warning_level', [1, 2, 3]];
            // map.setFilter('预警岸段', filter1)
            // map.setFilter('预警岸段', filter1)

            // let filter2 = ['==', 'warning_level', 1];
            // map.setFilter('预警岸段', filter2)
            // map.setFilter('预警岸段', filter2)

        },
        '二级预警岸段': () => {

        },
        '三级预警岸段': () => {

        },
        '已建通道': () => {

        },
        '在建通道': () => {

        },
        '规划通道': () => {

        },
        '流域性骨干河道': () => {

        },
        '区域性骨干河道': () => {

        },
        '重要水闸': () => {

        },
        '重要泵站': () => {

        },
        '重要湖泊': () => {

        },
        '行政区划': () => {

        },
        '水文站点': () => {

        },
    }

    const processMap = {
        'title1': () => {
            data.active ? showLayers(map, DICT.T1LayerDict[data.label])
                : hideLayers(map, DICT.T1LayerDict[data.label])
        },
        'title2': () => {
            title2processMap[data.label](data.active)
        }
    }

    console.log(data.label, node.level, ' view status change!! ')
    if (data.type == 'title1') {
        console.log('these layers::', DICT.T1LayerDict[data.label])
        data.active ? showLayers(map, DICT.T1LayerDict[data.label])
            : hideLayers(map, DICT.T1LayerDict[data.label])
        // data.active = !data.active
    }
    else if (data.type == 'title2') {
        console.log('title2 !');
    }
}





const baseMapChangeHandler = async () => {
    let map = mapStore.getMap()
    console.log('base map change', baseMapRadio.value);
    if (baseMapRadio.value == 0) {
        map.setStyle(getImageStyleJson())
        map.addSource('mapRaster22', {
            type: 'raster',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/raster/image/base/{x}/{y}/{z}',
            ],
            tileSize: 256,
            minzoom: 1,
            maxzoom: 14,
            bounds: [
                118.3372672298279582, 30.5615244886408277, 122.3900937696443378,
                32.835981186719593,
            ],
        })
        map.addLayer({
            id: 'ras',
            type: 'raster',
            source: 'mapRaster22',
        })
        await initSortedLayer(map)
    } else {
        map.setStyle(getStyleJson4base())
        await initSortedLayer(map)


    }
}

// const detailClickHandler4layerGroup = async (lable) => {
//     infoTableData.value = []
//     infoTableHeader.value = []
//     pannelLoading.value = true

//     // showInfoPannel.value = true
//     let layers = sceneStore.LAYERGROUPMAP.value[lable].layerIDs
//     let infoLayer = layers.filter((item) => {
//         if (item.includes('注记') || item.includes('重点行政区边界') || item.includes('桥墩') || item.includes('水闸工程-重点')) {
//             return false
//         } return true
//     })
//     let data
//     let thData
//     let map = mapStore.getMap()
//     for (let i = 0; i < infoLayer.length; i++) {
//         if (infoLayer[i].includes('过江通道')) {
//             // let t1 = [] // 已
//             // let t2 = []  // 在
//             // let t3 = [] // 规划
//             let res1 = (await axios.get(tileServer + `/tile/vector/riverPassageLine/info`)).data
//             let res2 = (await axios.get(tileServer + `/tile/vector/riverPassagePolygon/info`)).data
//             data = [...res1, ...res2]
//             thData = {
//                 'name': '名称',
//                 'plan': '类型',
//             }
//             break
//         }
//         else if (infoLayer[i].includes('长江干堤')) {
//             console.log('长江干堤  no data')
//         }
//         else {
//             data = await getLayerFeatureArray(map, infoLayer[i])
//             thData = getTableHeader(map, infoLayer[i])
//         }
//     }
//     const process = (obj) => {
//         let res = []
//         let keys = Object.keys(obj)
//         keys.forEach(item => {
//             res.push({ 'label': obj[item], 'prop': item })
//         })
//         return res
//     }

//     infoTableData.value = data
//     infoTableHeader.value = process(thData)
//     pannelLoading.value = false
//     console.log(infoTableHeader.value);
// }
const detailClickHandler4Feature = async (featInfo, lgId) => {
    console.log(featInfo, lgId)
    // let nowSource = 'importantBank'
    let nowSource = layerSourceMap[lgId]
    let newFeatInfomation = {
        ogData: featInfo,
        sourceId: nowSource,
        column: sourceColumnMap[nowSource],
    }
    featureInfo.value = newFeatInfomation
    showDetail.value = true
    let map = mapStore.getMap()
    map.flyTo({
        center: [featInfo.center_x, featInfo.center_y],
        zoom: sourceZoomMap[nowSource] ? sourceZoomMap[nowSource] : 10,
        speed: 1.0,
        curve: 1,
        easing(t) {
            return t;
        }
    })
}

// methods
const toolClick = (i) => {
    if (i == 1) { //zoom
        mapFlyToRiver(mapStore.getMap())
        return;
    }
    activeStatus.value[i] = !activeStatus.value[i]
}
const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [[118.40770531586725, 31.015473926104463],
        [122.06874017956159, 32.73217294711945],],
        { pitch: 0, duration: 1500, },
    )
}
const closeHandler = (index) => {
    activeStatus.value[index] = false
}

const prepareMap = async () => {
    const mapInstance = await initBaseMap(mapContainer.value)
    mapStore.setMap(mapInstance)
    mapInstance.addControl(new mapboxgl.NavigationControl({
        showZoom: false,
        showCompass: true,
        visualizePitch: true
    }), 'top-right')
    mapInstance.addControl(new mapboxgl.ScaleControl({ maxWidth: 150 }), 'bottom-left');
    mapInstance.dragRotate.disable();
    mapInstance.touchZoomRotate.disableRotation()
    mapFlyToRiver(mapInstance)
    await initSortedLayer(mapInstance)
    return mapInstance
}

onMounted(async () => {
    //////////init map
    let map = await prepareMap()

    //////////add legend
    legendList.value = legendListt
    dataSource.value = await getSideBarTree()

    sideBarLoading.value = false

})

//////////// DEBUG FUNCTIONS
const getLayerFeatureArray = async (mapInstance, layerName) => {

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
        // special 
        if (sourceId == 'importantBank') {
            let warn1 = []
            let warn2 = []
            let warn3 = []
            for (let i = 0; i < properties.length; i++) {
                if (properties[i].warning_level == 1) warn1.push(properties[i])
                else if (properties[i].warning_level == 2) warn2.push(properties[i])
                else if (properties[i].warning_level == 3) warn3.push(properties[i])
            }
            if (layerName == '一级预警岸段') properties = warn1
            else if (layerName == '二级预警岸段') properties = warn2
            else if (layerName == '三级预警岸段') properties = warn3
        }
        // featureInfo.value['sourceId'] = sourceId
        nowSource = sourceId
    }
    return properties;
}
const getTableHeader = (mapInstance, layerName) => {
    let layer = mapInstance.getLayer(layerName)
    if (!layer) return properties

    let sourceId = layer.source
    let source = mapInstance.getSource(sourceId)
    if (!source) return properties
    console.log(layerName, sourceId)
    let title = FieldMap[sourceId]['fieldMap']
    return title
}
const sideBarClickHandler = (node, data) => {
    if (node.level === 1) {
        //必然是全体控制
        if (data.label === '重点岸段') {

        }
        if (data.type == 'title1' && data.label !== '其他') {
            let lgId = data.label
            if (data.active == true) hideLayers(mapStore.getMap(), lableLayerMap[lgId])
            if (data.active == false) showLayers(mapStore.getMap(), lableLayerMap[lgId])
            data.active = !data.active
        }
    } else if (node.level === 2) {
        //可能要素,可能图层
        if (data.type == 'feature') {
            emit('detailClick', data.property, node.parent.data.label)
        }
        if (data.type == 'title2') {
            let lgId = data.label
            if (data.active == true) {
                let lgId = data.label
                hideLayers(mapStore.getMap(), lableLayerMap[lgId])
                data.active = false
            } else {
                let lgId = data.label
                showLayers(mapStore.getMap(), lableLayerMap[lgId])
                data.active = true
            }
        }

    } else if (node.level === 3) {
        //要素
        if (data.type == 'feature') {
            emit('detailClick', data.property, node.parent.data.label)
        }
    }
}

onUnmounted(async () => {
    mapStore.getMap().remove()
    mapStore.destroyMap()
})


</script>

<style lang="scss" scoped>
.data-visual-container {
    width: 100vw;
    height: 92vh;
    position: absolute;
    background-color: rgba(228, 242, 252, 0.6);
    display: flex;
    flex-direction: row;
    overflow: hidden;

    .sideBar {
        position: relative;
        width: 15vw;
        height: 92vh;

        div.sideBar-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;


            .title-text {
                position: relative;
                height: 5vh;
                line-height: 5vh;
                border-radius: 6px;
                font-family: "Microsoft YaHei";
                font-weight: bold;
                font-size: calc(0.8vw + 0.8vh);
                color: #0a72c7;
                text-shadow: 0 0 10px #72c0ff;
            }

            .hr_gradient {
                position: relative;
                margin-top: 0.5vh;
                border: 0;
                height: 0.4vh;
                width: 90%;
                background-image: linear-gradient(to right, rgb(167, 233, 255), rgb(14, 155, 219), rgb(167, 233, 255));
            }

            .scenes-tree-container {
                position: relative;
                width: 90%;
                height: 80vh;
                background-color: #f1fcff;
                overflow-y: auto;

                &::-webkit-scrollbar {
                    width: 3px;
                }

                &::-webkit-scrollbar-track {
                    background-color: rgba(10, 231, 251, 0.219);
                }

                &::-webkit-scrollbar-thumb {
                    background-color: #15a1e294;
                    border-radius: 5px;
                }

                &::-webkit-scrollbar-thumb:hover {
                    background-color: #3af0f781;
                }
            }

            .custom-tree-node {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                padding-right: 8px;
                width: 100%;
                height: 100%;

                &:hover {
                    cursor: default;
                }

                .scene-card {
                    margin: 0.5vh;
                    width: 90%;
                    height: 4vh;
                    border-radius: 5px;
                    background: rgb(20, 115, 196);
                    padding: 4px;
                    overflow: hidden;
                    box-shadow: #cbeafd 10px 7px 20px 0px;
                    display: flex;
                    flex-direction: row;
                    transition: transform 0.5s;
                    user-select: none;

                    .scene-top-section {
                        //   height: 10vh;
                        border-radius: 5px;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        // background: rgb(234, 244, 252);
                        position: relative;
                        width: 70%;

                        .scene-title {
                            width: 100%;
                            height: 4vh;

                            .scene-title-text {
                                color: rgb(234, 244, 252);
                                font-size: calc(0.8vw + 0.8vh);
                                font-style: normal;
                                font-weight: 700;
                                margin-left: 1vw;
                                line-height: 4vh;
                                font-family: 'Microsoft YaHei';

                            }
                        }


                        &:hover {
                            transform: scale(1.02);
                            cursor: pointer;
                        }
                    }

                    .scene-top-section .active {
                        background: linear-gradient(45deg, rgb(255, 255, 255), #C9E1F5);

                        .scene-title {
                            .scene-title-text {
                                color: rgb(27, 116, 193);
                            }
                        }

                    }


                    .checkbox {
                        width: 30%;
                        height: 4vh;
                        transform: translateY(20%) translateX(30%);

                    }
                }


                .subScene-container {
                    // width: 12vw;
                    // height: 4vh;
                    width: 100%;
                    height: 4.5vh;
                    display: flex;
                    flex-direction: row;
                    padding: 4px;
                    padding-left: 0;

                    .card {

                        width: 88%;
                        height: 4vh;
                        border-radius: 5px;
                        background: rgb(20, 115, 196);
                        padding: 4px;
                        overflow: hidden;
                        box-shadow: #cbeafd 10px 7px 20px 0px;
                        display: flex;
                        flex-direction: row;
                        transition: transform 0.5s;
                        user-select: none;
                        transition: .3s linear;

                        &:hover {
                            transform: scale(1.02);
                            cursor: pointer;
                        }


                        .top-section {
                            //   height: 10vh;
                            height: 100%;
                            width: 70%;
                            border-radius: 5px;
                            display: flex;
                            flex-direction: row;
                            justify-content: flex-start;
                            background: rgb(234, 244, 252);
                            position: relative;
                            transition: .3s linear;

                            .icon-container {
                                position: relative;
                                width: 4vh;
                                height: 4vh;

                                .icon {
                                    top: 0;
                                    right: 15%;
                                    transform: translateX(50%) translateY(20%);
                                    width: 3vh;
                                    height: 3vh;
                                    position: absolute;
                                    background-size: contain;
                                }
                            }

                            .title {
                                position: relative;
                                width: 70%;
                                height: 4vh;

                                .subScene-title-text {
                                    color: rgb(20, 115, 196);
                                    font-size: calc(0.7vw + 0.6vh);
                                    font-weight: 600;
                                    font-style: normal;
                                    margin-left: 1vw;
                                    line-height: 4vh;
                                    font-family: 'Microsoft YaHei';
                                }
                            }
                        }
                    }

                    .card.active {
                        // box-shadow: #cbeafd 10px 7px 20px 0px;
                        border: inset #C9E1F5 3px solid;

                        .top-section {
                            background: rgb(26, 143, 245);

                            .title {
                                .subScene-title-text {
                                    color: rgb(234, 244, 252);
                                }
                            }
                        }
                    }


                    .card.expand {
                        width: 100%;
                        height: 4vh;
                        transition: .3s linear;
                    }

                    .button-block {
                        position: relative;
                        width: 25%;
                        height: 5vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        user-select: none;

                        .btn {
                            width: 3.8vh;
                            height: 3.8vh;
                            background-size: contain;
                            background-image: url('/detail.png');
                            transition: .3s linear;

                            &:hover {
                                cursor: pointer;
                                transform: scale(1.05);
                            }
                        }
                    }
                }

                .feature-container {
                    width: 88%;
                    height: 3vh;
                    display: flex;
                    flex-direction: row;
                    margin: 0.2vh;
                    padding-left: 0;
                    background-color: #C9E1F5;
                    border-radius: 5%;
                    border-color: #0a72c7;

                    .feature-content {
                        color: rgb(20, 115, 196);
                        font-size: calc(0.5vw + 0.5vh);
                        font-weight: 600;
                        font-style: normal;
                        margin-left: 0.5vw;
                        line-height: 3vh;
                        font-family: 'Microsoft YaHei';
                    }
                }
            }


        }

        :deep(.el-tree) {

            .el-tree-node__content {
                height: fit-content;
                transform: translateX(-1%);
            }

            .el-tree-node__content>.el-tree-node__expand-icon {
                padding: 0px;
            }

            .el-tree-node__expand-icon {
                font-size: calc(0.8vw + 0.6vh);
                color: #0a72c7;
            }
        }

        :deep(.el-checkbox) {
            width: fit-content;
            height: fit-content;

            .el-checkbox__input {

                .el-checkbox__inner {
                    transform: scale(2.0);

                    &::after {
                        scale: 1.2;
                    }
                }
            }
        }
    }

    .mapBase {
        position: relative;
        width: 85vw;
        height: 92vh;

        #map {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 0;
            background-color: hsl(180, 7%, 94%);
        }

    }

    div.tools-container {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 4vw;
        height: 18vh;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        z-index: 2;

        .icon-container {
            position: relative;
            width: 6vh;
            height: 6vh;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2;
            background-color: rgb(255, 255, 255);

            .icon {
                width: 4vh;
                height: 4vh;
                background-size: contain;
                z-index: 2;

                &:hover {
                    box-shadow: 0px 10px 20px rgb(1, 110, 236), 0px -10px 20px rgb(1, 110, 236);
                    cursor: pointer;
                }
            }

            .active {
                box-shadow: 0px 10px 20px rgb(1, 110, 236), 0px -10px 20px rgb(1, 110, 236);
                cursor: pointer;
                transition: .3s ease-in-out;
            }
        }
    }

    div.search-pos {
        position: absolute;
        z-index: 2;
        right: 1vw;
        top: 10vh;
    }

    div.layer-pos {
        position: absolute;
        z-index: 2;
        right: 1vw;
        top: 10vh;
    }

    div.legend-pos {
        position: absolute;
        z-index: 2;
        right: 5vw;
        bottom: 1vh;
    }

    div.featDetail {
        position: absolute;
        z-index: 2;
        left: 18vw;
        top: 0vh;
    }

    div.infomation-pannel {
        position: absolute;
        z-index: 2;
        left: 20vw;
        top: 20vh;

        div.close {
            position: absolute;
            right: 1vw;
            top: 1vh;
            width: 2.2vh;
            height: 2.2vh;
            background-size: contain;
            background-image: url('/icons/minimize.png');
            z-index: 2;
        }

        div.important-feature {
            // width: 20vw;
            // height: 30vh;
            width: fit-content;
            height: 30vh;
        }

        div.feature-search {
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
                width: 10vw;
                height: 20vh;
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

    div.hydro-pannel {
        position: absolute;
        z-index: 2;
        right: 5vw;
        top: 0vh;
        padding: calc(0.1vw + 0.1vh);
        background-color: aliceblue;

        .title {
            border-bottom: rgb(41, 40, 40) 1px solid;
            font-weight: bold;
            font-size: calc(0.7vw + 0.5vh);
            line-height: 3vh;
        }
    }

    div.radio-container {
        position: absolute;
        top: 2vh;
        right: 20vw;
    }

}


:deep(.mapboxgl-ctrl-group button) {
    width: 5vh;
    height: 5vh;
}

:deep(.mapboxgl-ctrl button.mapboxgl-ctrl-compass .mapboxgl-ctrl-icon) {
    background-image: url('/icons/compass.svg');
}

:deep(.mapboxgl-ctrl.mapboxgl-ctrl-scale) {
    text-align: center;
    font-size: calc(0.5vw + 0.5vh);
}
</style>
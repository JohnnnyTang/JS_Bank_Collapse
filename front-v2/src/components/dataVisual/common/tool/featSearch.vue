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
                        <el-check-tag v-for="(item, i) in Scenes" :key="i" @click="sceneTagClickHandler(i)"
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
                <el-input v-model="filterText" style="width: 10vw" placeholder="请输入关键词" />
            </div>
            <div class="tree-container">
                <div class="feature-desc">
                    <div class="text">共有要素 {{ featureCount }}条</div>
                </div>
                <el-tree ref="treeRef" style="max-width: 600px" :data="data" :props="defaultProps" default-expand-all
                    :filter-node-method="filterNode">

                    <template #default="{ node, data }">
                        <span class="custom-tree-node">
                            <span class="text">{{ node.label }}</span>
                            <el-button type="primary" plain v-if="node.isLeaf">查看详情</el-button>
                            <el-button type="primary" plain v-else-if="node.level === 2">图例展示</el-button>
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
import { ElTree } from 'element-plus';
import { Scene } from '../../Scene';
import { useMapStore, useNewSceneStore } from '../../../../store/mapStore';
import axios from 'axios';

// data
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
const emit = defineEmits(['close'])
const Scenes = ['全江概貌', '涉水工程', '重点岸段']
const sceneTagChecked = ref([true, false, false])
const LGroups = ['行政区划', '河道分段', '流域水系', '湖泊河流', '水文站点']
const LGroupsTagChecked = ref([true, false, false, false, false])
const featureCount = ref(999)

watch(filterText, (val) => {
    treeRef.value.filter(val)
})


const filterNode = (value, data) => {
    if (!value) return true
    return data.label.includes(value)
}
const close = () => {
    console.log('1');
    emit('close', 0)
}
const LGroupsTagClickHandler = async () => {
    await updateTreeData()
}

const updateTreeData = async () => {
    // let checkedLayerGroup = []
    // for (let i = 0; i < LGroupsTagChecked.value.length; i++) {
    //     if (LGroupsTagChecked.value[i]) {
    //         checkedLayerGroup.push(LGroups[i])
    //     }
    // }
    // console.log(checkedLayerGroup);
    let checkedLayerGroupID = '行政区划'
    // let layers = sceneStore.LAYERGROUPMAP.value.layerIDs
    // console.log(sceneStore.LAYERGROUPMAP.value[checkedLayerGroupID].layerIDs);

    let layerid = '市级行政区'
    let map = mapStore.getMap()
    let res = await getLayerFeatureArray(map, layerid)
    console.log(res);

    let treeNode = {
        label: layerid,
        children: []
    }
    for(let i=0;i<res.length;i++){
        treeNode.children.push({
            label: res[i]['name'],
        })
    }
    featureCount.value =  res.length

    data.value.push(treeNode)


}


onMounted(() => {
    setTimeout(()=>{
        updateTreeData()
    },2000)
})  

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
        const res = await axios.get(`http://localhost:5173/api/tile/vector/${sourceId}/info`)
        properties = res.data
    }
    // console.log(properties);
    return properties;
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
            justify-content: center;
            align-items: center;

            .scene-area {
                display: flex;
                flex-direction: row;
            }

            .lg-area {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: flex-start;

                :deep(.el-check-tag.el-check-tag--primary) {
                    width: 1.5vw;
                    margin: 0.5vh;
                }
            }

        }

        .e-input {
            width: 16vw;
            height: 3vh;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: translateY(-20%);
            scale: 1.15;
        }

        .tree-container {
            position: relative;
            width: 17vw;
            height: 27.5vh;
            padding-left: 1vw;
            padding-bottom: 1.5vh;
            padding-top: 1.5vh;
            box-shadow: rgb(255, 255, 255) 0px 0px 25px 3px inset;
            border-radius: 5%;
            overflow-y: auto;

            .feature-desc {
                height: 3vh;
                text-align: left;
            }

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

            .custom-tree-node {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                padding-right: 8px;

                .text {
                    font-size: calc(0.6vw + 0.7vh);
                    color: rgb(19, 70, 147);
                    font-weight: 300;
                }

                .eyes {
                    display: block;
                    width: 2vh;
                    height: 2vh;
                    background-size: contain !important;
                    transform: scale(0.8);
                    // background:url('/data.png')
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
</style>
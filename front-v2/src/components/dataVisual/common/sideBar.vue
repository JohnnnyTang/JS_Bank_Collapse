<template>
    <dv-border-box9>
        <div class="sideBar-container">
            <dv-decoration-11 style="width:75%;height: 6.5vh;">
                <div class="title-text">
                    综合数据专题
                </div>
            </dv-decoration-11>
            <hr class="hr_gradient">

            <div class="scenes-tree-container">
                <el-tree style="max-width: 400px" :data="dataSource" :expand-on-click-node="false" node-key="label"
                    :default-expanded-keys="expandKey">
                    <template #default="{ node, data }">
                        <span class="custom-tree-node" @click="sideBarClickHandler(node, data)">
                            <!-- <sceneContainer v-if="node.level == 1" :title="data.label" :class="{ active: data.active }">
                            </sceneContainer> -->
                            <div class="scene-card" v-if="data.type == 'title1'">
                                <div class="scene-top-section" :class="{ active: data.active }">
                                    <div class="scene-title">
                                        <div class="scene-title-text">
                                            {{ data.label }}
                                        </div>
                                    </div>
                                </div>
                                <!-- <div class="checkbox">
                                    <el-checkbox v-model="data.active" size="large" />
                                </div> -->
                            </div>

                            <div class="subScene-container" v-else-if="data.type == 'title2'">
                                <div class="card" :class="{ active: data.active }">
                                    <div class="top-section">
                                        <!-- <div class="icon-container">
                                            <div class='icon' :style="{ backgroundImage: `url(${data.icon})` }"></div>
                                        </div> -->
                                        <div class="title">
                                            <div class="subScene-title-text">
                                                {{ data.label }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- <div class="button-block" @click="detailClickHandler(node, data)">
                                    <div class="btn">
                                    </div>
                                </div> -->
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

        <!-- <div class="test-zoom">{{ zoomValue }}</div> -->
    </dv-border-box9>
</template>

<script setup>
import { BorderBox9 as DvBorderBox9, Decoration11 as DvDecoration11 } from '@kjgl77/datav-vue3'
import { onMounted, ref, watch, computed } from 'vue';
// import { getSideBarTree, LayerGroup, lableLayerMap } from '../js/SCENES'
import { LayerGroup, lableLayerMap } from '../js/SCENES'

import { useMapStore, useNewSceneStore, useHighlightLayerStore } from '../../../store/mapStore';
import { sourceNameMap, sourceZoomMap, sourceColumnMap } from '../js/tilefieldMAP'

// test 
// import { loadImage } from '../../../utils/mapUtils';
import { initSortedLayer } from '../layerUtil'

const emit = defineEmits(['detailClick'])
const dataSource = ref([])
const mapStore = useMapStore()

const expandKey = ['重点岸段', '全江概貌']


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






onMounted(async () => {
    // sceneStore.SCENEMAP.value = scenes
    // sceneStore.LAYERGROUPMAP.value = layerGroups
    dataSource.value = await getSideBarTree()



    setTimeout(async () => {
        let map = mapStore.getMap()
        let lg = initLayerGroups()
        console.log('LGLGLGLG!', lg);

        await initSortedLayer(map)

    }, 1000)

    // let lg = getFirstShowLayerGroupIds()
    // const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
})

const dict = {
    '行政区划': ['市级行政区', '市级行政区-注记', '重点行政区边界'],
    // '河道分段': ['河道分段', '河道分段-注记', '河道分段点', '河道分段点-注记'],
    '骨干河道': ['骨干河道', '骨干河道-注记'],
    '重要湖泊': ['大型湖泊', '大型湖泊-注记'],
    '水文站点': ['水文站点', '水文站点-注记'],
    // '过江通道': ['过江通道-桥墩', '过江通道-桥', '过江通道-隧道/通道', '过江通道-隧道/通道-注记', '过江通道-桥-注记'],
    '过江通道': ['过江通道-桥', '过江通道-隧道/通道', '过江通道-隧道/通道-注记', '过江通道-桥-注记'],
    // '沿江码头': ['沿江码头', '沿江码头-注记'],
    // '水库大坝': ['水库大坝', '水库大坝-注记'],
    '重要水闸': ['水闸工程', '水闸工程-注记', '水闸工程-重点'],
    '重要泵站': ['泵站工程', '泵站工程-注记'],
    // '枢纽工程': ['枢纽工程', '枢纽工程-注记'],
    '长江堤防': ['长江干堤'],
    // '岸段名录': ['一级预警岸段', '二级预警岸段', '三级预警岸段', '岸段-注记'],
    // '历史崩岸': [],
    // '近岸地形': ['近岸地形', '沙洲', '全江注记'],
    // '近年冲淤': [],
    '一级预警岸段': ['一级预警岸段'],
    '二级预警岸段': ['二级预警岸段'],
    '三级预警岸段': ['三级预警岸段'],
}
const initLayerGroups = () => {
    let map = new Map()
    for (let key in dict) {
        let LGins = new LayerGroup(key, dict[key])
        map.set(key, LGins)
    }
    const mapToObject = (mapObj) => {
        const obj = {}
        mapObj.forEach((value, key) => {
            obj[key] = value
        })
        return obj
    }
    return mapToObject(map)
}

const hideLayers = (map, layersArr) => {
    if (map) {
        for (let i = 0; i < layersArr.length; i++) {
            let layerID = layersArr[i]
            if (map.getLayer(layerID)) {
                // 隐藏
                map.setLayoutProperty(layerID, 'visibility', 'none')
            }
        }
    } else {
        console.log('WARNING:: NOT VALID MAP');
    }
}
const showLayers = (map, layersArr) => {
    if (map) {
        for (let i = 0; i < layersArr.length; i++) {
            let layerID = layersArr[i]
            if (map.getLayer(layerID)) {
                map.setLayoutProperty(layerID, 'visibility', 'visible')
            }
        }
    } else {
        console.log('WARNING:: NOT VALID MAP');
    }
}


</script>

<style lang="scss" scoped>
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
                flex-direction: column;
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
                    width: 100%;
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

.test-zoom {
    position: absolute;
    top: 0;
    left: 20vw;
    z-index: 100;
    width: 5vw;
    height: 3vh;
    background-color: #ffffff;
    color: black;
}
</style>
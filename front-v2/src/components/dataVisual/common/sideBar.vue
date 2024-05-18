<template>
    <dv-border-box9>
        <div class="sideBar-container">
            <dv-decoration-11 style="width:75%;height: 7vh;">
                <div class="title-text">
                    综合数据专题
                </div>
            </dv-decoration-11>
            <hr class="hr_gradient">

            <div class="scenes-tree-container">
                <el-tree style="max-width: 600px" :data="dataSource" :expand-on-click-node="true" node-key="label"
                    :default-expanded-keys="expandKey">
                    <template #default="{ node, data }">
                        <span class="custom-tree-node">
                            <!-- <sceneContainer v-if="node.level == 1" :title="data.label" :class="{ active: data.active }">
                            </sceneContainer> -->
                            <div class="scene-card" v-if="node.level == 1" @click="sceneClickHandler(node, data)">
                                <div class="scene-top-section" :class="{ active: data.active }">
                                    <div class="scene-title">
                                        <div class="scene-title-text">
                                            {{ data.label }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="subScene-container" v-else-if="node.level == 2">
                                <div class="card" :class="{ expand: false }" @click="layerGroupClickHandler(node, data)">
                                    <div class="top-section" :class="{ active: data.active }">
                                        <div class="icon-container">
                                            <div class='icon' :style="{ backgroundImage: `url(${data.icon})` }"></div>
                                        </div>
                                        <div class="title">
                                            <div class="subScene-title-text">
                                                {{ data.label }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="button-block" @click="filterButtonClickHandler(node, data)">
                                    <div class="btn">
                                        {{ buttonText(data) }}
                                    </div>
                                </div>
                            </div>
                        </span>
                    </template>
                </el-tree>
            </div>

        </div>
    </dv-border-box9>
</template>

<script setup>
import { BorderBox9 as DvBorderBox9, Decoration11 as DvDecoration11 } from '@kjgl77/datav-vue3'
import { onMounted, ref, watch, computed } from 'vue';
import { tree, scenes, layerGroups } from '../js/SCENES'
import { useMapStore, useNewSceneStore, useHighlightLayerStore } from '../../../store/mapStore';


const dataSource = ref(tree)
const mapStore = useMapStore()
const sceneStore = useNewSceneStore()
const sceneDict = {
    '全江概貌': 0,
    '工程情况': 1,
    '重点岸段': 2,
}
const expandKey = ['全江概貌']



const buttonText = (data) => {
    return data.filter ? '全体要素' : '重点要素'
}

const sceneClickHandler = (node, data) => {
    if (data.active) {
        data.active = false
        //移除
        let map = mapStore.getMap()


        let selectedSceneID = data.label
        sceneStore.SCENEMAP.value[selectedSceneID].setMap(map)
        sceneStore.SCENEMAP.value[selectedSceneID].hideScene()
        sceneStore.SCENEMAP.value[selectedSceneID].active = false
        for (let i = 0; i < dataSource.value[sceneDict[selectedSceneID]].children.length; i++) {
            dataSource.value[sceneDict[selectedSceneID]].children[i].active = false
        }

        const highlightLayer = useHighlightLayerStore().highlightLayers
        for (let i = 0; i < highlightLayer.length; i++) {
            map.getLayer(highlightLayer[i]) &&
                map.removeLayer(highlightLayer[i])
        }
        return
    }
    else {
        data.active = true
        // 添加
        let map = mapStore.getMap()

        let selectedSceneID = data.label
        sceneStore.SCENEMAP.value[selectedSceneID].setMap(map)
        sceneStore.SCENEMAP.value[selectedSceneID].showScene()
        sceneStore.SCENEMAP.value[selectedSceneID].active = true
        for (let i = 0; i < dataSource.value[sceneDict[selectedSceneID]].children.length; i++) {
            dataSource.value[sceneDict[selectedSceneID]].children[i].active = true
        }
        sceneStore.latestScene = selectedSceneID

    }
}
const layerGroupClickHandler = (node, data) => {
    if (data.active) {
        data.active = false
        //移除
        let map = mapStore.getMap()

        let selectedLayerGroupID = data.label
        sceneStore.LAYERGROUPMAP.value[selectedLayerGroupID].setMap(map)
        sceneStore.LAYERGROUPMAP.value[selectedLayerGroupID].hideLayer()
        sceneStore.LAYERGROUPMAP.value[selectedLayerGroupID].active = false

        const highlightLayer = useHighlightLayerStore().highlightLayers
        for (let i = 0; i < highlightLayer.length; i++) {
            map.getLayer(highlightLayer[i]) &&
                map.removeLayer(highlightLayer[i])
        }
        return
    }
    else {
        data.active = true
        // 添加
        let map = mapStore.getMap()

        let selectedLayerGroupID = data.label
        sceneStore.LAYERGROUPMAP.value[selectedLayerGroupID].setMap(map)
        sceneStore.LAYERGROUPMAP.value[selectedLayerGroupID].showFilteredLayer()
        sceneStore.LAYERGROUPMAP.value[selectedLayerGroupID].active = true
        sceneStore.latestLayerGroup = selectedLayerGroupID

    }
}
const filterButtonClickHandler = (node, data) => {
    data.filter = !data.filter

    let shouldFilter = data.filter
    let selectedLayerGroupID = data.label
    let map = mapStore.getMap()
    sceneStore.LAYERGROUPMAP.value[selectedLayerGroupID].setMap(map)
    if (shouldFilter) {
        sceneStore.LAYERGROUPMAP.value[selectedLayerGroupID].layerFilter()
    } else sceneStore.LAYERGROUPMAP.value[selectedLayerGroupID].layerNoFilter()
}

onMounted(async () => {
    // sceneStore.SCENEMAP.value = scenes
    // sceneStore.LAYERGROUPMAP.value = layerGroups
    // setTimeout(() => {
    //     // wait for map init
    //     dataSource.value[0].active = true
    //     let mapInstance = mapStore.getMap()
    //     let selectedSceneID = '全江概貌'
    //     sceneStore.latestScene = selectedSceneID
    //     sceneStore.SCENEMAP.value[selectedSceneID].setMap(mapInstance)
    //     sceneStore.SCENEMAP.value[selectedSceneID].showScene()
    //     sceneStore.SCENEMAP.value[selectedSceneID].active = true
    //     for (let i = 0; i < dataSource.value[sceneDict[selectedSceneID]].children.length; i++) {
    //         dataSource.value[sceneDict[selectedSceneID]].children[i].active = true
    //     }
    // }, 2000)

    window.addEventListener('keydown', (e) => {
        // if(e.key == '1'){
        //     expand.value = true
        // }else{
        //     expand.value = false
        // }
    })

})


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

        &:hover {
            cursor: default;
        }

        .scene-card {
            margin: 0.5vh;
            width: 13vw;
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

            .scene-top-section {
                //   height: 10vh;
                border-radius: 5px;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                // background: rgb(234, 244, 252);
                position: relative;

                .scene-title {
                    width: 70%;
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
        }


        .subScene-container {
            // width: 12vw;
            // height: 4vh;
            width: 13vw;
            height: 5vh;
            display: flex;
            flex-direction: row;
            padding: 4px;
            padding-left: 0;

            .card {

                width: 75%;
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
                        width: 50%;
                        height: 4vh;

                        .subScene-title-text {
                            color: rgb(20, 115, 196);
                            font-size: calc(0.8vw + 0.8vh);
                            font-style: normal;
                            margin-left: 1vw;
                            line-height: 4vh;
                            font-family: 'Microsoft YaHei';
                        }
                    }



                }

                .top-section.active {
                    background: linear-gradient(45deg, #C9E1F5, #5af4ff);

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
                user-select: none;

                .btn {
                    background-color: rgb(195, 226, 245);
                    border-radius: 10%;
                    margin-left: 0.5vw;
                    width: 90%;
                    height: 90%;
                    // line-height: 2.5vh;
                    letter-spacing: 0.5vh;
                    text-align: center;
                    text-wrap: wrap;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: rgb(20, 115, 196) 2px solid;
                    border-bottom: rgb(20, 115, 196) 4px solid;
                    font-weight: bold;
                    font-size: calc(0.5vw + 0.6vh);
                    color: #0151a0;

                    /* 初始阴影 */
                    &:hover {
                        cursor: pointer;
                        border-right: rgb(20, 115, 196) 2px solid;
                        border-bottom: rgb(20, 115, 196) 4px solid;
                        transition: .3s;

                    }

                    &:active {
                        cursor: pointer;
                        border-right: rgb(20, 115, 196) 1px solid;
                        border-bottom: rgb(20, 115, 196) 1px solid;
                        transition: .3s;
                    }
                }



            }

        }
    }
}

:deep(.el-tree) {

    .el-tree-node__content {
        height: 6vh;
    }

    .el-tree-node__content>.el-tree-node__expand-icon {
        padding: 0px;
    }

    .el-tree-node__expand-icon {
        font-size: calc(0.8vw + 0.6vh);
        color: #0a72c7;
    }


}
</style>
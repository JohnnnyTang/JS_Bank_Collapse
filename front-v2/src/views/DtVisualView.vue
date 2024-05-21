<template>
    <div class="data-visual-container">
        <div class="sideBar">
            <sideBar @detailClick="detailClickHandler4layerGroup"></sideBar>
        </div>
        <div class="mapBase">
            <div ref="mapContainer" id="map"></div>
            <canvas id="GPUFrame"></canvas>
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

        <!-- <div class="featDetail" v-draggable="{ bounds: 'body' }" v-show="showDetail">
            <featDetail :column="featureInfo.column" :ogData="featureInfo.ogData" :sourceId="featureInfo.sourceId"
                @close="closeHandlerr"></featDetail>
        </div> -->


        <div class="infomation-pannel" v-show="true" v-draggable="{ bounds: 'body', cancel: 'div.content' }">
            <el-tabs type="border-card" class="demo-tabs">
                <el-tab-pane label="重点要素">
                    <div class="important-feature">
                        <el-table :data="tableData" style="width: 10vw">
                            <!-- <el-table-column prop="date" label="Date"/>
                            <el-table-column prop="name" label="Name"/>
                            <el-table-column prop="address" label="Address" /> -->
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="要素查询">
                    <div class="feature-search">
                        <div class="e-input">
                            <span class="text">要素检索</span>
                            <el-input v-model="filterText" style="width: 13vw" placeholder="请输入关键词" />
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>


        <div class="hydro-pannel">
            <div class="title"> 实时水文信息</div>
            <el-table :data="waterTableData" border style="width: 100%">
                <el-table-column prop="station" label="站点" />
                <el-table-column prop="flow" label="流量" />
                <el-table-column prop="level" label="水位" />
            </el-table>
        </div>

    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"

import { onMounted, ref, watch, onUnmounted } from 'vue';
import sideBar from '../components/dataVisual/common/sideBar.vue'
import layerCtrl from '../components/dataVisual/common/tool/layerCtrl.vue'
import featSearch from '../components/dataVisual/common/tool/featSearch.vue'
import mapLegend from '../components/dataVisual/common/tool/legend.vue'
import featDetail from '../components/dataVisual/common/tool/featDetail.vue';
import { initScratchMap } from '../utils/mapUtils';
import { useMapStore, useNewSceneStore } from '../store/mapStore';
import { scenes, layerGroups } from '../components/dataVisual/js/SCENES';
import { sourceFieldMap, legendMap, legendStyleMap } from '../components/dataVisual/js/tilefieldMAP';
import axios from 'axios';


// data
const mapContainer = ref()
const mapStore = useMapStore()
const sceneStore = useNewSceneStore()
const activeStatus = ref([false, false])
const styles = [
    // { backgroundImage: `url('/icons/searching.png')` },
    // { backgroundImage: `url('/icons/layers.png')` },
    { backgroundImage: `url('/icons/legend.png')` },
    { backgroundImage: `url('/icons/full.png')` },
]
const featureInfo = ref({})
const showDetail = ref(false)
const legendList = ref([])
const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
]
const waterTableData = [
    {
        station: '大通站',
        flow: '无数据',
        level: '无数据',
    },
]

watch(() => sceneStore.latestScene, (val) => {
    if (val == '重点岸段') {
        activeStatus.value[2] = true
        legendList.value = legendMap['重点岸段']

    } else if (val == '工程情况') {
        activeStatus.value[2] = true
        legendList.value = legendMap['工程情况']
    }
    else if (val == '全江概貌') {
        activeStatus.value[2] = true
        legendList.value = legendMap['全江概貌']
    }
})

const detailClickHandler4layerGroup = (lable) => {
    let layers = sceneStore.LAYERGROUPMAP.value[lable].layerIDs
    let infoLayer = layers.filter((item) => {
        if (item.includes('注记') || item.includes('重点行政区边界') || item.includes('桥墩')) {
            return false
        } return true
    })
    let data = []
    for (let i = 0; i < infoLayer.length; i++) {

    }
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
        [[117.66436591731372, 30.72331549710475],
        [123.46755554741532, 33.43809328513673],],
        { pitch: 0, duration: 1500, },
    )
}
const closeHandler = (index) => {
    activeStatus.value[index] = false
}
// const closeHandlerr = () => {
//     showDetail.value = false
// }
const selectFeatureHandler = (info) => {
    console.log(info);
    let sourceid = info.sourceId
    if (Object.keys(sourceFieldMap).includes(sourceid)) {
        console.log('showDetail!!');
        featureInfo.value = info
        showDetail.value = true
    }
}

onMounted(async () => {

    const mapInstance = await initScratchMap(mapContainer.value)
    mapStore.setMap(mapInstance)
    mapInstance.addControl(new mapboxgl.NavigationControl({
        showZoom: false,
        showCompass: true,
        visualizePitch: true
    }), 'top-right')
    mapInstance.addControl(new mapboxgl.ScaleControl({ maxWidth: 150 }), 'bottom-left');
    mapFlyToRiver(mapInstance)

    sceneStore.SCENEMAP.value = scenes
    sceneStore.LAYERGROUPMAP.value = layerGroups

    // activeStatus.value[0] = true
})

//////////// DEBUG FUNCTIONS
const tempFunction = async (mapInstance, layerName) => {
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
    console.log(properties);
}

onUnmounted(() => {
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
        width: 18vw;
        height: 92vh;
    }

    .mapBase {
        position: relative;
        width: 82vw;
        height: 92vh;

        #map {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 0;
            background-color: hsl(180, 7%, 94%);
        }

        #GPUFrame {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
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
        left: 20vw;
        top: 10vh;
    }

    div.infomation-pannel {
        position: absolute;
        z-index: 2;
        left: 20vw;
        top: 20vh;

        div.important-feature {
            width: 10vw;
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
        .title{
            border-bottom: rgb(41, 40, 40) 1px solid;
            font-weight: bold;
            font-size: calc(0.7vw + 0.5vh);
            line-height: 3vh;
        }
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
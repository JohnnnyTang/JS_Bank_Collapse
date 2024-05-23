<template>
    <div class="data-visual-container">
        <div class="sideBar">
            <sideBar @detailClick="detailClickHandler4Feature"></sideBar>
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

        <div class="featDetail" v-show="showDetail" v-draggable="{ bounds: 'body', cancel: 'div.content' }">
            <featDetail :column="featureInfo.column" :ogData="featureInfo.ogData" :sourceId="featureInfo.sourceId"
                @close="showDetail = false"></featDetail>
        </div>

        <!-- <div class="infomation-pannel" v-show="showInfoPannel" v-draggable="{ bounds: 'body', cancel: 'div.content' }"
            v-loading="pannelLoading" v-click-out-side="() => showInfoPannel = false">
            <div class="close" @click="showInfoPannel = false; showDetail = false"></div>
            <el-tabs type="border-card" class="demo-tabs" style="min-width: 12vw;">
                <el-tab-pane label="重点要素">
                    <div class="important-feature">
                        <el-table :data="infoTableData" height="30vh" border>
                            <el-table-column v-for="(item, index) in infoTableHeader" :key="index" :prop="item.prop"
                                :label="item.label"></el-table-column>
                            <el-table-column fixed="right" label="操作" width="80">
                                <template #default="scope">
                                    <el-button link type="primary" size="small"
                                        @click="detailClickHandler4Feature(scope.row)">
                                        查看详情
                                    </el-button>
                                </template>
                            </el-table-column>
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
        </div> -->


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
import sideBar from '../components/dataVisual/common/sideBar.vue'
// import layerCtrl from '../components/dataVisual/common/tool/layerCtrl.vue'
// import featSearch from '../components/dataVisual/common/tool/featSearch.vue'
import mapLegend from '../components/dataVisual/common/tool/legend.vue'
import featDetail from '../components/dataVisual/common/tool/featDetail.vue';
import { initBaseMap, getStyleJson4base, getImageStyleJson } from '../utils/mapUtils';
import { useMapStore, useNewSceneStore } from '../store/mapStore';
import { scenes, layerGroups } from '../components/dataVisual/js/SCENES';
import { sourceFieldMap, legendMap, legendStyleMap, sourceColumnMap, sourceZoomMap, legendListt,layerSourceMap } from '../components/dataVisual/js/tilefieldMAP';
import axios from 'axios';
import { initSortedLayer } from '../components/dataVisual/layerUtil'
import { clickOutSide as vClickOutSide } from '@mahdikhashan/vue3-click-outside'


// data
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
const mapContainer = ref()
const mapStore = useMapStore()
const sceneStore = useNewSceneStore()
const activeStatus = ref([false, false])
const styles = [
    { backgroundImage: `url('/icons/legend.png')` },
    { backgroundImage: `url('/icons/full.png')` },
]
const featureInfo = ref({})
let nowSource
const showDetail = ref(false)
// const showInfoPannel = ref(false)
const legendList = ref([])
const waterTableData = [
    {
        station: '大通站',
        flow: '无数据',
        level: '无数据',
    },
]
const infoTableData = ref([])
const infoTableHeader = ref([])
const pannelLoading = ref(true)
const baseMapRadio = ref(1)



const baseMapChangeHandler = async() => {
    let map = mapStore.getMap()
    console.log('base map change', baseMapRadio.value);
    if (baseMapRadio.value == 0) {
        map.setStyle(getImageStyleJson())
        await initSortedLayer(map)
    } else {
        map.setStyle(getStyleJson4base())
        await initSortedLayer(map)


    }
}

const detailClickHandler4layerGroup = async (lable) => {
    infoTableData.value = []
    infoTableHeader.value = []
    pannelLoading.value = true


    // showInfoPannel.value = true
    let layers = sceneStore.LAYERGROUPMAP.value[lable].layerIDs
    let infoLayer = layers.filter((item) => {
        if (item.includes('注记') || item.includes('重点行政区边界') || item.includes('桥墩') || item.includes('水闸工程-重点')) {
            return false
        } return true
    })
    let data
    let thData
    let map = mapStore.getMap()
    for (let i = 0; i < infoLayer.length; i++) {
        if (infoLayer[i].includes('过江通道')) {
            // let t1 = [] // 已
            // let t2 = []  // 在
            // let t3 = [] // 规划
            let res1 = (await axios.get(tileServer + `/tile/vector/riverPassageLine/info`)).data
            let res2 = (await axios.get(tileServer + `/tile/vector/riverPassagePolygon/info`)).data
            data = [...res1, ...res2]
            thData = {
                'name': '名称',
                'plan': '类型',
            }
            break
        }
        else if (infoLayer[i].includes('长江干堤')) {
            console.log('长江干堤  no data')
        }
        else {
            data = await getLayerFeatureArray(map, infoLayer[i])
            thData = getTableHeader(map, infoLayer[i])
        }
    }
    const process = (obj) => {
        let res = []
        let keys = Object.keys(obj)
        keys.forEach(item => {
            res.push({ 'label': obj[item], 'prop': item })
        })
        return res
    }

    infoTableData.value = data
    infoTableHeader.value = process(thData)
    pannelLoading.value = false
    console.log(infoTableHeader.value);

}
const detailClickHandler4Feature = async (featInfo,lgId) => {
    console.log(featInfo,lgId);
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

onMounted(async () => {

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

    legendList.value = legendListt

    sceneStore.SCENEMAP.value = scenes
    sceneStore.LAYERGROUPMAP.value = layerGroups

    // activeStatus.value[0] = true

    window.addEventListener('keydown', (e) => {
        if (e.key == 'b') {
            console.log(mapInstance.getBounds())
        }
    })

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

onUnmounted(() => {
    mapStore.getMap().remove()
    mapStore.destroyMap()
})

const FieldMap = {
    "combineProjectPoint": {
        "original": "枢纽工程",
        "fieldMap": {
            "id": "编号",
            "name": "名称"
        }
    },
    "dockArea": {
        "original": "长江码头工程",
        "fieldMap": {
            "new_id": "编号",
            "project_name": "项目名称",
            "dock_type": "码头类型",
            "area_type": "功能区类型",
        }
    },
    "embankmentLine": {
        "original": "堤防工程",
        "fieldMap": {
            "class": "堤防类型",
            "sp_name": "名称",
            "length": "长度",
            "bank": "岸别",
        }
    },
    "hydroStationPoint": {
        "original": "水文水位站",
        "fieldMap": {
            "sp_name": "名称",
            "begin": "设站日期",
            "place": "测站地点"
        }
    },
    "lakeArea": {
        "original": "国普湖泊",
        "fieldMap": {
            "name": "名称",
            "area": "水面面积",
            "height": "正常蓄水位",
        }
    },
    "pumpArea": {
        "original": "泵站工程",
        "fieldMap": {
            "sp_name": "名称",
            "river": "所在河流湖泊水库渠道",
            "level": "级别"
        }
    },
    "reservoirArea": {
        "original": "水库工程",
        "fieldMap": {
            "sp_name": "名称",
            "class": "水库类型",
            "area": "坝址控制流域面积",
            "flow": "坝址多年平均径流量",
        }
    },
    "riverArea": {
        "original": "国普河流",
        "fieldMap": {
            "name": "名称",
            "area": "水面面积",
            "basin": "流域",
            "water": "水系",
        }
    },
    "sluiceArea": {
        "original": "水闸工程",
        "fieldMap": {
            "sp_name": "名称",
            "river": "所在河流湖泊水库渠道",
            "class": "水闸类型",
            "volume": "过闸流量"
        }
    },
    "importantBank": {
        "original": "重点岸段",
        "fieldMap": {
            "bank_name": "名称",
            "river_name": "所属河段",
            "monitoring_length": '岸段长度',
            "warning_level": "预警等级",
        }
    },
    "cityBoundaryLine": {
        "original": "行政区划",
        "fieldMap": {
            'name': '名称',
        }
    },
    "riverPassageLine": {
        "original": "国普河流",
        "fieldMap": {
            'name': '名称',
        }
    },
    "riverPassagePolygon": {
        "original": "国普河流",
        "fieldMap": {

        }
    }
}

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
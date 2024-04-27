<template>
    <div class="section-choose-content model-item-content" ref="containerDom">
        <div id="map" class="map-container"></div>

        <el-dialog
            v-model="sectionConfirmShow"
            title="绘制断面确认"
            width="40vh"
            :before-close="sectionConfirmClose"
        >
            <span>确认使用此断面进行计算</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancelSectionRese">取消</el-button>
                    <el-button type="primary" @click="cancelSectionRese">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <div
            class="section-res-container"
            :class="{ 'in-active': !sectionSliceChartShow }"
        >
            <div class="section-res-title">断面剖面图</div>
            <div class="section-res-content" ref="sectionChartDom"></div>
        </div>
        <div
            class="section-shrink-button"
            :class="{ 'in-active': !sectionSliceChartShow }"
            @click="changeSectionSliceShow"
        ></div>
        <div class="section-selectior-item">
            <el-select
                v-model="rasterYearSelected"
                placeholder="选择地形"
                style="width: 10vw; height: 3.5vh"
                @change="sectionSelectChange"
            >
                <el-option
                    v-for="item in sectionRasterList"
                    :key="item.year"
                    :label="
                        item.year + (item.time == 'before' ? '汛前' : '汛后')
                    "
                    :value="item.year"
                >
                    <span style="float: left" class="section-name-text">{{
                        item.year
                    }}</span>
                    <span style="float: right" class="section-class-text">{{
                        item.time == 'before' ? '汛前' : '汛后'
                    }}</span>
                </el-option>
            </el-select>
        </div>
        <div
            class="all-selector-item"
            :class="[calcEnable ? 'active' : 'in-active']"
        >
            <div class="selector-item-text" @click="calcModel">
                计算坡面形态
            </div>
        </div>
        <div class="current-param-container year">
            <div class="current-year-title">当前选择地形</div>
            <div class="current-year-content">{{ rasterYearLabel === ''?'暂未选择':rasterYearLabel }}</div>
        </div>
        <div class="current-param-container section">
            <div class="current-year-title">当前绘制断面</div>
            <div
                class="current-year-content"
                :class="{ 'two-line': sectionLineLabel != '' }"
            >
                {{
                    sectionLineLabel == ''
                        ? '暂未绘制'
                        : '起点：' + sectionLineLabel
                }}
            </div>
            <div
                class="current-year-content two-line"
                v-if="sectionLineLabel != ''"
            >
                {{ '终点：' + sectionLineLabelSec }}
            </div>
        </div>
        <div class="progress-circle-container" v-if="progressShow">
            <el-progress
                type="circle"
                :percentage="calcProgress"
                :status="progressStatus"
            >
                <el-button
                    type="success"
                    :icon="Check"
                    circle
                    v-if="progressStatus == 'success'"
            /></el-progress>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { drawPlainSectionGraph } from './util.js'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { onMounted, ref, onUnmounted } from 'vue'
import { convertToMercator } from './coordConvert'
import { useMultiIndexStore } from '@/store/multiIndexStore'
import { Check } from '@element-plus/icons-vue'
import axios from 'axios'
mapboxgl.accessToken =
    'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg'

const backendInstance = axios.create({
    // baseURL: Vue.prototype.baseURL,
    baseURL: '/api',
})

const calcProgress = ref(0)
const progressShow = ref(false)
const progressStatus = ref('')

let sectionChart = null
const sectionChartDom = ref()

const sectionTaskNode = {
    modelNode: {
        id: '662a2dafdcbfea190d03b033',
    },
    paramNode: {
        modelId: '662a2dafdcbfea190d03b033',
        params: {
            x1: '',
            y1: '',
            x2: '',
            y2: '',
            year: '', // 2020-2023
            tag: 'before', // 只有2023有after 其他都是只有before
            scene: 'minzhusha', // minzhusha
        },
        name: 'sectionParamItem-xxxx',
        auth: 'all',
        category: 'ModelParamItem',
        path: ',paramNode,multiIndexSectionParamGroup,',
    },
    dataNode: {},
    status: '0',
    result: {
        resultString: '',
        resJsonId: '',
    },
    ifAuto: false,
    name: 'sectionIndexModelTaskItem-1234',
    auth: 'all',
    category: 'ModelTaskItem',
    path: ',taskNode,sectionIndexModelTaskGroup,',
}

const containerDom = ref()
const sectionConfirmShow = ref(false)
const rasterYearSelected = ref('')
const rasterYearLabel = ref('')
const sectionLineLabel = ref('')
const sectionLineLabelSec = ref('')

const sectionSliceChartShow = ref(false)

const calcEnable = ref(false)
const paramFill = [false, false]

const sectionRasterList = ref([
    { year: 2020, time: 'before', layerName: '' },
    { year: 2021, time: 'before', layerName: '' },
    { year: 2022, time: 'before', layerName: '' },
    { year: 2023, time: 'before', layerName: '' },
])

const sectionSelectChange = () => {
    sectionTaskNode.paramNode.params.year = rasterYearSelected.value
    rasterYearLabel.value = rasterYearSelected.value + '汛前'
    paramFill[0] = true
    if (paramFill.includes(false)) {
        return
    } else {
        multiIndexStore.updateSectionStatus(1)
        calcEnable.value = true
    }
}

const sectionConfirmClose = () => {}

const cancelSectionRese = () => {
    sectionConfirmShow.value = false
}

const changeSectionSliceShow = () => {
    sectionSliceChartShow.value = !sectionSliceChartShow.value
}

const multiIndexStore = useMultiIndexStore()

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.47987922676836, 32.03001616423072],
            [120.59589640208264, 32.048171362618625],
        ],
        {
            pitch: 0,
            duration: 1500,
            // zoom: 8,
        },
    )
}

const resizeObserver = new ResizeObserver((entries) => {
    mapFlyToRiver(map)
})

let map = null

const draw = new MapboxDraw({
    displayControlsDefault: false,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
        line_string: true,
        trash: true,
    },
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    // defaultMode: '',
    styles: [
        // ACTIVE (being drawn)
        // line stroke
        {
            id: 'gl-draw-line',
            type: 'line',
            filter: [
                'all',
                ['==', '$type', 'LineString'],
                ['==', 'mode', 'draw_line_string'],
            ],
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-color': '#D20C0C',
                'line-dasharray': [0.2, 2],
                'line-width': 2,
            },
        },
        // vertex point halos
        {
            id: 'gl-draw-polygon-and-line-vertex-halo-active',
            type: 'circle',
            filter: [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['==', 'mode', 'draw_line_string'],
            ],
            paint: {
                'circle-radius': 5,
                'circle-color': '#FFF',
            },
        },
        // vertex points
        {
            id: 'gl-draw-polygon-and-line-vertex-active',
            type: 'circle',
            filter: [
                'all',
                ['==', 'meta', 'vertex'],
                ['==', '$type', 'Point'],
                ['==', 'mode', 'draw_line_string'],
            ],
            paint: {
                'circle-radius': 3,
                'circle-color': '#D20C0C',
            },
        },
        // INACTIVE (static, already drawn)
        // line stroke
        {
            id: 'gl-draw-line-static',
            type: 'line',
            filter: [
                'all',
                ['==', '$type', 'LineString'],
                ['!=', 'mode', 'draw_line_string'],
            ],
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-color': '#000',
                'line-width': 3,
            },
        },
    ],
})

const taskNameBase = 'sectionIndexModelTaskItem'

let taskId = ''

const calcModel = async () => {
    if (calcEnable.value) {
        taskId = (
            await backendInstance.post('/taskNode/start', sectionTaskNode)
        ).data
        progressShow.value = true
        multiIndexStore.taskId = taskId
        let progressInterval = setInterval(() => {
            calcProgress.value += 8
            if (calcProgress.value == 88) {
                clearInterval(progressInterval)
            }
        }, 500)
        console.log(multiIndexStore.taskId)
        let statusCall = setInterval(async () => {
            let status = (
                await backendInstance.get(`/taskNode/${taskId}/status`)
            ).data
            console.log('status', typeof +status)
            if (+status < 0) {
                clearTimeout(statusCall)
                console.log('app went wrong!!!')
            } else if (+status == 2) {
                let jsonRes = (
                    await backendInstance.get(
                        `/fileData/json/jsonStr/id/${taskId}`,
                    )
                ).data
                console.log('succeed', jsonRes)
                multiIndexStore.resJson = jsonRes
                clearInterval(progressInterval)
                calcProgress.value = 100
                progressStatus.value = 'success'
                clearTimeout(statusCall)
                drawPlainSectionGraph(sectionChart, jsonRes.section)
                multiIndexStore.updateSectionStatus(2)
                sectionChart.resize()
            }
        }, 1000)
    }
}

onMounted(() => {
    sectionChart = echarts.init(sectionChartDom.value)
    map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
        center: [120.542, 32.036], // starting position [lng, lat]
        zoom: 7.8, // starting zoom
        bounds: [
            [114.36611654985586, 30.55501729652339],
            [124.5709218840081, 35.31358005439914],
        ],
    })

    map.on('load', () => {
        // console.log('map loaded!!!')
        mapFlyToRiver(map)

        resizeObserver.observe(containerDom.value)
        map.addSource('mzsOverWaterSource', {
            type: 'vector',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/vector/mzsOverWaterBound/{x}/{y}/{z}',
            ],
        })
        map.addSource('mzsUnderWaterSource', {
            type: 'vector',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/vector/mzsUnderWaterBound/{x}/{y}/{z}',
            ],
        })
        map.addSource('mzsPlaceLabelSource', {
            type: 'vector',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/vector/mzsPlaceLabel/{x}/{y}/{z}',
            ],
        })
        map.addSource('mzsPlaceLineSource', {
            type: 'vector',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/vector/mzsPlaceLine/{x}/{y}/{z}',
            ],
        })
        map.addSource('mapRaster2020', {
            type: 'raster',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/raster/mzs/2020/Before/{x}/{y}/{z}',
            ],
            tileSize: 1024,
            minzoom: 10,
            maxzoom: 20,
            bounds: [120.509, 32.023, 120.555, 32.0402],
        })
        map.addSource('mapRaster2021', {
            type: 'raster',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/raster/mzs/2021/Before/{x}/{y}/{z}',
            ],
            tileSize: 1024,
            minzoom: 10,
            maxzoom: 20,
            bounds: [120.5116, 32.02316, 120.555, 32.0402],
        })
        map.addSource('mapRaster2022', {
            type: 'raster',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/raster/mzs/2022/Before/{x}/{y}/{z}',
            ],
            tileSize: 1024,
            minzoom: 10,
            maxzoom: 20,
            bounds: [120.51, 32.02, 120.552, 32.04046],
        })
        map.addSource('mapRaster2023', {
            type: 'raster',
            tiles: [
                'http://127.0.0.1:8989/api/v1/tile/raster/mzs/2023/Before/{x}/{y}/{z}',
            ],
            tileSize: 1024,
            minzoom: 10,
            maxzoom: 20,
            bounds: [120.50548, 32.0224, 120.55304, 32.0415],
        })
        map.addLayer({
            id: 'mzsLine',
            type: 'line',
            source: 'mzsPlaceLineSource',
            'source-layer': 'default',
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-opacity': 1,
                'line-color': 'rgba(26, 87, 138, 0.6)',
                'line-width': 2,
            },
        })
        map.addLayer({
            id: 'mzsLabel',
            type: 'symbol',
            source: 'mzsPlaceLabelSource',
            'source-layer': 'default',
            layout: {
                'text-field': ['get', 'label'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                // 'text-offset': [0, 1.25],
                'text-anchor': 'left',
            },
            paint: {
                'text-color': 'rgba(31, 14, 126, 0.75)',
            },
        })
        // map.addLayer({
        //     id: 'ras',
        //     type: 'raster',
        //     source: 'mapRaster2020',
        // })
        // map.addLayer({
        //     id: 'ras',
        //     type: 'raster',
        //     source: 'mapRaster2021',
        // })
        // map.addLayer({
        //     id: 'ras',
        //     type: 'raster',
        //     source: 'mapRaster2022',
        // })
        // map.addLayer({
        //     id: 'ras',
        //     type: 'raster',
        //     source: 'mapRaster2023',
        // })
        map.addLayer({
            id: 'mzsOverWaterBound',
            type: 'fill',
            source: 'mzsOverWaterSource',
            'source-layer': 'default',
            paint: {
                'fill-color': '#a2800f',
                'fill-opacity': 0.5,
                'fill-outline-color': 'rgba(162, 128, 15, 0.)'
            },
        })
        map.addLayer({
            id: 'mzsUnderWaterBound',
            type: 'fill',
            source: 'mzsUnderWaterSource',
            'source-layer': 'default',
            paint: {
                'fill-color': '#101B94',
                'fill-opacity': 0.5,
                'fill-outline-color': 'rgba(16, 27, 148, 0.)'
            },
        })
        map.addControl(draw)

        map.on('draw.create', function (e) {
            console.log('aaa')
            console.log(e.features[0])
            sectionConfirmShow.value = true
            let lineFeature = e.features[0]
            sectionLineLabel.value =
                lineFeature.geometry.coordinates[0][0].toFixed(6) +
                ',' +
                lineFeature.geometry.coordinates[0][1].toFixed(6)
            sectionLineLabelSec.value =
                lineFeature.geometry.coordinates[1][0].toFixed(6) +
                ',' +
                lineFeature.geometry.coordinates[1][1].toFixed(6)
            let startWebMerCoord = convertToMercator(
                lineFeature.geometry.coordinates[0],
            )
            let endWebMerCoord = convertToMercator(
                lineFeature.geometry.coordinates[1],
            )
            sectionTaskNode.paramNode.params.x1 = startWebMerCoord[0]
            sectionTaskNode.paramNode.params.y1 = startWebMerCoord[1]
            sectionTaskNode.paramNode.params.x2 = endWebMerCoord[0]
            sectionTaskNode.paramNode.params.y2 = endWebMerCoord[1]
            paramFill[1] = true
            if (paramFill.includes(false)) {
                return
            } else {
                multiIndexStore.updateSectionStatus(1)
                calcEnable.value = true
            }
        })
    })
})

onUnmounted(() => {
    resizeObserver.disconnect()
})
</script>

<style lang="scss" scoped>
div.section-choose-content {
    position: relative;
    height: 79vh;
    width: 75vw;
    overflow: hidden;

    background-color: #2a99c9;

    &.section-choose-content {
        div.map-container {
            width: 75vw;
            height: 79vh;
        }
    }

    div.section-res-container {
        position: absolute;
        right: 1.2vw;
        bottom: 4vh;
        width: 28vw;
        height: 30vh;
        border-radius: 8px;

        background-color: #2a99c9;
        overflow: hidden;
        transition: all 0.5s cubic-bezier(0.68, -0.15, 0.265, 1.15);

        div.section-res-title {
            width: 28vw;
            height: 5vh;
            line-height: 5vh;
            text-align: center;
            font-size: calc(0.8vw + 1vh);
            font-weight: bold;

            color: #e6f2ff;
            background-color: #3251be;
        }

        div.section-res-content {
            width: 28vw;
            height: 25vh;

            background-color: #dae6ff;
        }

        &.in-active {
            transform: translateX(29.2vw);
            // right: -29.2vw;
        }
    }

    div.section-shrink-button {
        position: absolute;
        right: 29.2vw;
        bottom: 29vh;

        width: 4vh;
        height: 4vh;

        background-color: #f7f9ff;
        border-radius: 50% 50%;
        background-image: url('/down-arrow.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        transform: rotate(-90deg);
        transition: all 0.5s cubic-bezier(0.68, -0.15, 0.265, 1.15);

        &.in-active {
            transform: translateX(29.2vw) rotate(90deg);
            // transform: rotate(90deg);
        }

        &:hover {
            cursor: pointer;
        }
    }

    div.section-selectior-item {
        position: absolute;
        right: 4vw;
        top: 2.4vh;
        width: 10vw;
        height: 3.3vh;

        line-height: 3.3vh;
        text-align: center;

        // background-color: #eef3ff;
        :deep(.el-select) {
            height: 3.3vh;
            box-shadow:
                rgba(0, 132, 255, 0.8) 1px 1px,
                rgba(0, 119, 255, 0.7) 2px 2px,
                rgba(0, 119, 255, 0.6) 3px 4px;
            border-radius: 6px;
            background-color: rgba(0, 119, 255, 1);
        }

        :deep(.el-select__wrapper) {
            height: 3.3vh;
            line-height: 3.3vh;
            border-radius: 6px;
            font-family: 'Microsoft YaHei';
            font-weight: bold;
            font-size: calc(0.5vw + 0.6vh);
            background-color: #e6f7ff;
        }

        :deep(.el-select__placeholder) {
            color: #738ab6;
        }

        :deep(.el-icon) {
            width: 0.5vw;
            height: 0.5vw;

            svg {
                width: 0.5vw;
                height: 0.5vw;

                path {
                    fill: #001cb8;
                }
            }
        }
    }

    div.all-selector-item {
        position: absolute;
        right: 4vw;
        top: 8vh;
        height: 4vh;
        width: 10vw;
        flex-shrink: 0;
        border-radius: 8px;

        background-color: #b5beca;
        transition: all 0.2s ease-in;

        box-shadow:
            rgba(112, 147, 180, 0.8) 1px 1px,
            rgba(85, 124, 168, 0.7) 3px 3px,
            rgba(0, 119, 255, 0.6) 5px 5px;

        &.active {
            box-shadow:
                rgba(0, 132, 255, 0.8) 1px 1px,
                rgba(0, 119, 255, 0.7) 3px 3px,
                rgba(0, 119, 255, 0.6) 5px 5px;

            background-color: #3155da;

            div.selector-item-text {
                color: #ceebff;
            }

            &:hover {
                transform: translate3d(3px, 3px, 3px);

                box-shadow:
                    rgba(0, 204, 255, 0.8) 1px 1px,
                    rgba(0, 162, 255, 0.7) 3px 3px,
                    rgba(0, 140, 255, 0.6) 5px 5px;
                color: #cefffd;
                background-color: #004faa;
            }
        }

        &:hover {
            cursor: pointer;
        }

        div.selector-item-text {
            position: relative;
            line-height: 4vh;
            text-align: center;
            height: 4vh;
            width: 10vw;
            z-index: 5;
            color: #818181;

            font-size: calc(0.6vw + 0.7vh);
            font-weight: bold;
        }
    }

    div.current-param-container {
        position: absolute;
        left: 1vw;
        top: 2vh;

        width: 10vw;
        height: 12vh;
        // background-color: #004faa;
        text-align: center;
        border-radius: 6px;
        overflow: hidden;
        font-weight: bold;

        border: 2px solid #1735ae;

        &.section {
            left: 12vw;
            width: 16vw;
        }

        div.current-year-title {
            height: 6vh;
            line-height: 6vh;
            background-color: #1753ae;
            font-size: calc(0.6vw + 0.6vh);
            color: #cefffd;
        }

        div.current-year-content {
            height: 6vh;
            line-height: 6vh;
            background-color: #dcebf8;
            color: #001cb8;
            font-size: calc(0.85vw + 0.6vh);

            &.two-line {
                height: 3vh;
                line-height: 3vh;
                font-size: calc(0.65vw + 0.3vh);
                // font-weight: 300;
            }
        }
    }

    div.progress-circle-container {
        position: absolute;
        left: 30vw;
        top: 2vh;

        width: 12vh;
        height: 12vh;
        background-color: #c1dfff2f;
        backdrop-filter: blur(6px);
        border-radius: 40px;

        :deep(.el-progress) {
            width: 12vh;
            height: 12vh;
        }

        :deep(.el-progress-circle) {
            width: 12vh !important;
            height: 12vh !important;
        }

        :deep(.el-button) {
            width: 4vh;
            height: 4vh;
        }
        :deep(.el-icon) {
            width: 3vh;
            height: 3vh;
            svg {
                width: 3vh;
                height: 3vh;
            }
        }
    }
}
:deep(.el-progress__text) {
    // color: rgba(162, 128, 15, 0.5);
    font-size: calc(0.6vw + 0.6vh) !important;
}
</style>

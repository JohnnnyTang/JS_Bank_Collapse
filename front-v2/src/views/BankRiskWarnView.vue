<template>
    <div class="risk-warn-container">
        <div class="map-container" id="map" ref="mapContainer"></div>
        <canvas id="GPUFrame"></canvas>

        <div class="time-shower-container">
            <flowTimeShower :type="'exp'" :time-step="timeStep" :total-count="25"></flowTimeShower>
        </div>

        <div class="selector-container">
            <div class="place-selector-container selector-item-container">
                <div class="place-title selector-title">岸段选择：</div>
                <div class="place selector-content">
                    <el-select v-model="placeValue" placeholder="选择岸段" style="width: 10vw; height: 3.5vh"
                        @change="sceneSelectChange" popper-class="risk-popper">
                        <el-option v-for="item in placeList" :key="item.value" :label="item.label" :value="item.value">
                            <span class="section-name-text">{{
                                item.label
                            }}</span>
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="scene-selector-container selector-item-container">
                <div class="scene-title selector-title">评估情景：</div>
                <div class="scene selector-content">
                    <el-select v-model="sceneValue" placeholder="选择专题" style="width: 10vw; height: 3.5vh"
                        @change="sceneSelectChange" popper-class="risk-popper">
                        <el-option v-for="item in scenceList" :key="item.value" :label="item.label" :value="item.value">
                            <span style="float: left" class="section-name-text">{{ item.place }}</span>
                            <span style="float: right" class="section-class-text">{{ item.year }}</span>
                        </el-option>
                        <template #footer>
                            <div class="add-select-button">新增评估情景</div>
                        </template>
                    </el-select>
                </div>
            </div>
        </div>
        <div class="riskInfo-container">
            <div class="riskInfo-title">
                <dv-border-box2 :color="['rgb(63, 36, 214)', '#0c60af']">
                    断面信息展示
                </dv-border-box2>
            </div>
            <div class="riskInfo-item profileFlowSpeed">
                <div class="item-title">
                    断面流速：
                </div>
                <div ref="flowGraphRef" class="flowspeed graph" element-loading-background="rgba(214, 235, 255,0.8)"></div>
                <div class="graph-container flow">
                    <div 
                        ref="flowGraphRef"
                        class="flowspeed graph"
                        element-loading-background="rgba(214, 235, 255,0.8)"
                    ></div>
                </div>
            </div>
            <div class="riskInfo-item profileShape">
                <div class="item-title">
                    断面形态对比：
                </div>
                <div class="profile-selector-container">
                    <el-select v-model="profileValue" placeholder="选择断面" style="width: 10vw; height: 3.5vh"
                        @change="profileSelectChange" popper-class="profile-popper">
                        <el-option v-for="item in profileList" :key="item.value" :label="item.label" :value="item.value">
                            <span class="profile-name-text">
                                {{ item.label }}
                            </span>
                        </el-option>
                    </el-select>
                </div>
                <div ref="shapeGraphRef" class="shape graph" element-loading-background="rgba(214, 235, 255,0.8)"></div>
                <div class="graph-container shape">
                    <div
                        ref="shapeGraphRef"
                        class="shape graph"
                        element-loading-background="rgba(214, 235, 255,0.8)"
                    ></div>
                </div>
            </div>
        </div>
        <riskResultVue/>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
import router from '../router/index'
import { BorderBox2 as DvBorderBox2 } from '@kjgl77/datav-vue3'
import riskResultVue from '../components/bankRiskWarn/riskResult.vue'
import { drawShapeGraph, drawFlowGraph } from '../components/bankRiskWarn/util.js'
import tempData from '../components/bankRiskWarn/tempData.json'
import flowTimeShower from '../components/bankRiskWarn/flowTimeShower.vue'
import { initScratchMap } from '../utils/mapUtils';
import SteadyFlowLayer from '../utils/m_demLayer/newFlow';
import * as echarts from 'echarts'

let map = null
const mapContainer = ref()
const timeStep = ref(5)

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.46987922676836, 32.03201616423072],
            [120.61089640208264, 32.052171362618625],
        ],
        {
            duration: 1500,
            zoom: 13,
        },
    )
}

const sceneValue = ref('mzs2024')

const scenceList = ref([
    {
        value: 'mzs2019',
        label: '民主沙2019地形',
        year: '2019',
        place: '民主沙右缘',
    },
    {
        value: 'mzs2023',
        label: '民主沙2023地形',
        year: '2023',
        place: '民主沙右缘',
    },
    {
        value: 'mzs2024',
        label: '民主沙2024地形',
        year: '2024',
        place: '民主沙右缘',
    },
])

const placeValue = ref('mzs')

const placeList = ref([{ value: 'mzs', label: '民主沙右缘示范段' }])

const sceneSelectChange = () => { }

const onAddOption = () => { }

const onAddProfileOption = () => { }

const onAddProfile = () => { }


const profileValue = ref(1)
const profileList = ref([
    {
        value: 1,
        label: '断面 JC01',
    },
    {
        value: 2,
        label: '断面 JC02',
    },
    {
        value: 3,
        label: '断面 JC03',
    },
    {
        value: 4,
        label: '断面 JC04',
    },
    {
        value: 5,
        label: '断面 JC05',
    },
    {
        value: 6,
        label: '断面 JC06',
    },
    {
        value: 7,
        label: '断面 JC07',
    },
    {
        value: 8,
        label: '断面 JC08',
    },
    {
        value: 9,
        label: '断面 JC09',
    },
    {
        value: 10,
        label: '断面 JC10',
    },
    {
        value: 11,
        label: '断面 JC11',
    },
    {
        value: 12,
        label: '断面 JC12',
    }
])
const profileSelectChange = (inputValue) => {
    profileValue.value = inputValue
    drawShapeGraph(
        shapeChart,
        tempData[inputValue - 1].section.map((value) => value[2]),
        tempData[inputValue - 1].beforeSection.map((value) => value[2]),
        tempData[inputValue - 1].SA[2],
    )
}

let shapeChart = null
let flowChart = null
const shapeGraphRef = ref(null)
const flowGraphRef = ref(null)
const speed = [2, 3, 5, 1, 2, 3, 5, 1, 6, 9, 11, 4]

onMounted(() => {
    // map = new mapboxgl.Map({
    //     container: 'map', // container ID
    //     accessToken:
    //         'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg',
    //     style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
    //     center: [120.542, 32.036], // starting position [lng, lat]
    //     zoom: 8, // starting zoom
    //     bounds: [
    //         [114.36611654985586, 30.55501729652339],
    //         [124.5709218840081, 35.31358005439914],
    //     ],
    // })
    // mapFlyToRiver(map)
    // map.on('load', async () => {
    //     // console.log('map loaded!!!')
    //     mapFlyToRiver(map)
    //     map.addSource('mzsPlaceLabelSource', {
    //         type: 'vector',
    //         tiles: [tileServer + '/tile/vector/mzsPlaceLabel/{x}/{y}/{z}'],
    //     })
    //     map.addSource('mzsPlaceLineSource', {
    //         type: 'vector',
    //         tiles: [tileServer + '/tile/vector/mzsPlaceLine/{x}/{y}/{z}'],
    //     })
    //     map.addSource('mzsBankAreaSSource', {
    //         type: 'vector',
    //         tiles: [tileServer + '/tile/vector/mzsBankAreaOne/{x}/{y}/{z}'],
    //     })
    //     map.addSource('mzsBankLineSource', {
    //         type: 'vector',
    //         tiles: [tileServer + '/tile/vector/mzsBankLine/{x}/{y}/{z}'],
    //     })
    //     map.addSource('dockAreaSource', {
    //         type: 'vector',
    //         tiles: [tileServer + '/tile/vector/dockArea/{x}/{y}/{z}'],
    //     })
    //     map.addLayer({
    //         id: 'mzsLine',
    //         type: 'line',
    //         source: 'mzsPlaceLineSource',
    //         'source-layer': 'default',
    //         layout: {
    //             'line-cap': 'round',
    //             'line-join': 'round',
    //         },
    //         paint: {
    //             'line-opacity': 1,
    //             'line-color': 'rgba(26, 87, 138, 0.6)',
    //             'line-width': 2,
    //         },
    //     })
    //     // map.addLayer({
    //     //     id: 'mzsLabel',
    //     //     type: 'symbol',
    //     //     source: 'mzsPlaceLabelSource',
    //     //     'source-layer': 'default',
    //     //     layout: {
    //     //         'text-field': ['get', 'label'],
    //     //         'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    //     //         // 'text-offset': [0, 1.25],
    //     //         'text-anchor': 'left',
    //     //     },
    //     //     paint: {
    //     //         'text-color': 'rgba(31, 14, 126, 0.75)',
    //     //     },
    //     // })
    //     map.addLayer({
    //         id: 'dockArea',
    //         type: 'fill',
    //         source: 'dockAreaSource',
    //         'source-layer': 'default',
    //         paint: {
    //             'fill-color': '#18b915',
    //         },
    //     })
    //     map.addLayer({
    //         id: 'mzsSectionArea1',
    //         type: 'fill',
    //         source: 'mzsBankAreaSSource',
    //         'source-layer': 'default',
    //         paint: {
    //             'fill-color': [
    //                 'match',
    //                 ['get', 'stability'],
    //                 '较稳定',
    //                 '#18b915',
    //                 '稳定',
    //                 '#06bef1',
    //                 '不稳定',
    //                 '#df8105',
    //                 '较不稳定',
    //                 '#ee3603',
    //                 '#18b915',
    //             ],
    //         },
    //     })

    //     map.addLayer({
    //         id: 'mzsBankLine',
    //         type: 'line',
    //         source: 'mzsBankLineSource',
    //         'source-layer': 'default',
    //         layout: {
    //             'line-cap': 'round',
    //             'line-join': 'round',
    //         },
    //         paint: {
    //             'line-opacity': 1,
    //             'line-color': 'rgba(31, 14, 223, 0.5)',
    //             'line-width': 4,
    //         },
    //     })
    //     // map.on('click', (e) => {
    //     //     console.log(map.queryRenderedFeatures([e.point.x, e.point.y]))

    //     // })
    // })

    initScratchMap(mapContainer.value).then((map) => {
        mapFlyToRiver(map)
        // console.log('map loaded!!!')
        mapFlyToRiver(map)
        map.addSource('mzsPlaceLabelSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsPlaceLabel/{x}/{y}/{z}'],
        })
        map.addSource('mzsPlaceLineSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsPlaceLine/{x}/{y}/{z}'],
        })
        map.addSource('mzsBankAreaSSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsBankAreaOne/{x}/{y}/{z}'],
        })
        map.addSource('mzsBankLineSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsBankLine/{x}/{y}/{z}'],
        })
        map.addSource('dockAreaSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/dockArea/{x}/{y}/{z}'],
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
        // map.addLayer({
        //     id: 'mzsLabel',
        //     type: 'symbol',
        //     source: 'mzsPlaceLabelSource',
        //     'source-layer': 'default',
        //     layout: {
        //         'text-field': ['get', 'label'],
        //         'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        //         // 'text-offset': [0, 1.25],
        //         'text-anchor': 'left',
        //     },
        //     paint: {
        //         'text-color': 'rgba(31, 14, 126, 0.75)',
        //     },
        // })
        map.addLayer({
            id: 'dockArea',
            type: 'fill',
            source: 'dockAreaSource',
            'source-layer': 'default',
            paint: {
                'fill-color': '#18b915',
            },
        })
        map.addLayer({
            id: 'mzsSectionArea1',
            type: 'fill',
            source: 'mzsBankAreaSSource',
            'source-layer': 'default',
            paint: {
                'fill-color': [
                    'match',
                    ['get', 'stability'],
                    '较稳定',
                    '#18b915',
                    '稳定',
                    '#06bef1',
                    '不稳定',
                    '#df8105',
                    '较不稳定',
                    '#ee3603',
                    '#18b915',
                ],
            },
        })

        map.addLayer({
            id: 'mzsBankLine',
            type: 'line',
            source: 'mzsBankLineSource',
            'source-layer': 'default',
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-opacity': 1,
                'line-color': 'rgba(31, 14, 223, 0.5)',
                'line-width': 4,
            },
        })
        let flowSrc = []
        for (let i = 0; i < 26; i++) {
            flowSrc.push(`/scratchSomething/terrain_flow/json/uv_${i}.bin`)
        }

        let flow = reactive(new SteadyFlowLayer(
            '近岸流场',
            '/scratchSomething/terrain_flow/json/station.bin',
            flowSrc,
            (url) => url.match(/uv_(\d+)\.bin/)[1],
        ))
        flow.particleNum.n = 2800;
        flow.speedFactor.n = 1.0;
        watch(() => flow.currentResourcePointer, (v) => {
            // console.log(flow.currentResourcePointer)
            timeStep.value = flow.currentResourcePointer
        })
        map.addLayer(flow)

    })

    shapeChart = echarts.init(shapeGraphRef.value)
    drawShapeGraph(
        shapeChart,
        tempData[profileValue.value - 1].section.map((value) => value[2]),
        tempData[profileValue.value - 1].beforeSection.map((value) => value[2]),
        tempData[profileValue.value - 1].SA[2],
    )
    flowChart = echarts.init(flowGraphRef.value)
    drawFlowGraph(
        flowChart,
        speed
    )
})
</script>

<style lang="scss" scoped>
div.risk-warn-container {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    left: 0;

    background: rgb(68, 105, 138);

    div.map-container {
        width: 100vw;
        height: 92vh;
        background-color: antiquewhite;
    }

    canvas#GPUFrame {
        position: absolute;
        top: 0;
        width: 100vw;
        height: 92vh;
        z-index: 1;
        pointer-events: none;
    }

    div.time-shower-container{
        position: absolute;
        bottom: 4vh;
        right: 2vw;
    }

    div.selector-container {
        position: absolute;
        top: 2vh;
        left: 1vw;
        height: 16vh;
        width: 24vw;
        border-radius: 8px;
        overflow: hidden;
        z-index: 2;

        background-color: rgba(164, 212, 255, 0.8);
        backdrop-filter: blur(8px);
        border: 1px solid #0049a8;

        div.selector-item-container {
            height: 8vh;
            width: 22vw;
            padding-left: 1vw;
            padding-right: 1vw;
            line-height: 8vh;

            font-size: calc(0.8vw + 0.4vh);
            font-weight: bold;
            display: flex;

            &.place-selector-container {
                border-bottom: 2px solid #116cf5;
            }

            div.selector-title {
                letter-spacing: 0.3rem;
                width: 7vw;
            }

            div.selector-content {
                width: 14vw;
                height: 8vh;

                // background-color: #466ca7;
                :deep(.el-select) {
                    width: 14vw !important;
                    height: 5vh !important;
                    box-shadow:
                        rgba(0, 132, 255, 0.8) 1px 1px,
                        rgba(0, 119, 255, 0.7) 2px 2px,
                        rgba(0, 119, 255, 0.6) 3px 3px;
                    border-radius: 6px;
                }

                :deep(.el-select__wrapper) {
                    height: 5vh;
                    line-height: 5vh;
                    border-radius: 6px;
                    font-family: 'Microsoft YaHei';
                    font-weight: bold;
                    font-size: calc(0.5vw + 0.8vh);
                    background-color: #e6f7ff;
                }

                :deep(.el-select__placeholder) {
                    color: #368dff;
                }

                :deep(.el-icon) {
                    width: 1vw;
                    height: 1vw;

                    svg {
                        width: 1vw;
                        height: 1vw;

                        path {
                            fill: #00098a;
                        }
                    }
                }

                :deep(.el-select__tags-text) {
                    color: #2b61f7;
                    font-size: calc(0.4vw + 0.4vh);
                }
            }
        }
    }

    div.riskInfo-container {
        position: absolute;
        top: 20vh;
        left: 1vw;
        height: 70vh;
        width: 24vw;
        border-radius: 8px;
        border: #167aec 1px solid;
        background-color: rgba(179, 201, 228, 0.6);
        backdrop-filter: blur(10px);
        z-index: 2;

        div.riskInfo-title {
            height: 4.5vh;
            width: 10vw;
            margin-left: 6.5vw;
            margin-top: 0.6vh;
            line-height: 4.5vh;
            border-radius: 6px;
            // background-color: rgba(235, 240, 247, 0.4);
            text-align: center;
            font-family: 'Microsoft YaHei';
            font-weight: bold;
            font-size: calc(0.8vw + 0.8vh);
            color: #0c60af;
            text-shadow:
                #eef3ff 1px 1px,
                #eef3ff 2px 2px,
                #6493ff 3px 3px;

            :deep(.dv-border-box-2) {
                width: 10vw;
                height: 5vh;
            }
        }

        div.riskInfo-item {
            position: absolute;
            width: 23vw;
            left: 0.5vw;
            border-radius: 6px;
            border: #3b85e7 2px solid;

            &.profileFlowSpeed {
                top: 6.1vh;
                height: 22vh;
                // background-color: #b6b9eb;
            }

            &.profileShape {
                top: 29vh;
                height: 40vh;
                // background-color: #c9cad4;
            }

            div.item-title {
                position: absolute;
                top: 0.5vh;
                left: 0.5vw;
                font-size: calc(0.8vh + 0.6vw);
                font-weight: 600;
                font-family: 'Microsoft YaHei';
                // color: #a231e4;
                // text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
            }

            div.profile-selector-container {
                position: absolute;
                width: 10vw;
                height: 4vh;
                left: 13vw;
                // background-color: #d1d2db;

                :deep(.el-select) {
                    left: 4vw;
                    top: 0.4vh;
                    width: 5.5vw !important;
                    height: 3vh !important;
                    box-shadow:
                        rgba(0, 132, 255, 0.8) 1px 1px,
                        rgba(0, 119, 255, 0.7) 1px 1px,
                        rgba(0, 119, 255, 0.6) 2px 2px;
                    border-radius: 6px;
                }

                :deep(.el-select__wrapper) {
                    height: 3vh;
                    line-height: 3vh;
                    border-radius: 6px;
                    font-family: 'Microsoft YaHei';
                    font-weight: bold;
                    font-size: calc(0.4vw + 0.5vh);
                    background-color: rgba(230, 253, 255, 0.7);
                }

                :deep(.el-select__placeholder) {
                    color: #1c68cc;
                }

                :deep(.el-icon) {
                    width: 0.8vw;
                    height: 0.8vw;

                    svg {
                        width: 0.8vw;
                        height: 0.8vw;

                        path {
                            fill: #00098a;
                        }
                    }
                }

                :deep(.el-select__tags-text) {
                    color: #2b61f7;
                    font-size: calc(0.4vw + 0.4vh);
                }
            }

            div.graph-container {
                position: absolute;
                width: 22vw;
                top: 4vh;
                left: 0.5vw;

                &.shape {
                    height: 35vh;
                    backdrop-filter: blur(5px);
                    // background-color: rgba(220, 250, 248, 0.4);
                }

                &.flow {
                    height: 17vh;
                    backdrop-filter: blur(5px);
                    // background-color: #00098a;
                }

                div.graph {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    
                    &.shape {
                        // height: 35vh;
                        // background-color: rgba(220, 250, 248, 0.4);
                    }
                    
                    &.flowspeed {
                        // height: 17vh;
                        // background-color: #00098a;
                    }
                }
            }
        }
    }
}

@keyframes border-dance {
    0% {
        background-position:
            0 0,
            100% 100%,
            0 100%,
            100% 0;
    }

    100% {
        background-position:
            100% 0,
            0 100%,
            0 0,
            100% 100%;
    }
}
</style>

<template>
    <div class="stablityAnalysis-container">
        <ModelTitleVue :ModelName="'土体变形分析模型'" />
        <div class="model-content-container">
            <div class="flow-container">
                <soilFlowChart></soilFlowChart>
            </div>



            <div class="model-run-container">

                <div class="loading-container" v-show="ModelRunningShow">
                    <dv-loading class="loading-icon">
                        <div class="loading-message">{{ ModelRunningMessage }}</div>
                    </dv-loading>
                </div>


                <el-tabs v-model="activeTab" type="card" class="custom-tabs" :before-leave="beforeTabLeave"
                    @tab-click="tabClickCallback">
                    <el-tab-pane label="评估断面选择" name="section-tab">
                        <div class="tab-page-container">
                            <sectionDraw ref="sectionDrawRef" v-on:section-draw="sectionDrawHandler"
                                v-on:dem-select="demSelectHandler"></sectionDraw>
                            <div class="sectionView-run-button one-center">
                                <div class="run-button one-center" @click="sectionViewModelRun">
                                    计算断面形态
                                </div>
                            </div>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane label="断面和土壤分层参数配置" class="custom-tabs" name="chart-tab">
                        <div class="tab-page-container">
                            <div class="model-run-content flex-coloum">
                                <div class="form-block flex-coloum">

                                    <div class="detail-bank-profile">
                                        <div class="title2">断面测点详情</div>
                                        <div class="xz-table flex-row">
                                            <div class="table head">
                                                <div class="row">
                                                    <div class="cell head">Station(m)</div>
                                                </div>
                                                <div class="row">
                                                    <div class="cell head">Elevation(m)</div>
                                                </div>
                                            </div>

                                            <div class="table">
                                                <div class="row">
                                                    <div class="cell" v-for="(item, index) in xzData" :key="index">{{
                                                        keepFloat2(item[0]) }}</div>
                                                </div>
                                                <div class="row">
                                                    <div class="cell" v-for="(item, index) in xzData" :key="index">{{
                                                        keepFloat2(item[1]) }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="soil-layer-profile flex-coloum">
                                        <div class="title2">土壤分层详情</div>

                                        <div class="content flex-row">
                                            <div class="keyValue flex-row" v-for="i in 5">
                                                <div class="key">{{ thicknessName[i - 1] }}</div>
                                                <div class="value">{{ keepFloat2(thicknessData[i - 1]) }}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="right-block flex-coloum">
                                        <div class="half-block flex-coloum">
                                            <div class="title2">潮位参数配置</div>
                                            <div class="content one-center">
                                                <div class="keyValue flex-row">
                                                    <div class="key">elevation of Flow</div>
                                                    <input type="text" class="value" placeholder="请输入潮位"
                                                        v-model="elevationOfFlow">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="half-block one-center">
                                            <div class="run-button one-center" @click="BSTEMModelRun">
                                                运行模型
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="chart-block one-center">
                                    <div ref="chartdom" id="chart"></div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="土地变形分析结果" class="custom-tabs" name="result-tab">
                        <div class="tab-page-container">
                            <div class="map-container" id="resultMap" ref="mapRef">
                            </div>
                            <div class="warn-status-Desc">土体变形分析模型结果显示,当前断面稳定性因子为{{ fosText }}</div>

                            <div class="warn-status-container">
                                <div class="warn-status-title">断面风险状态</div>
                                <div class="warn-status-content middle">较高风险</div>
                            </div>
                            <div class="fos-result-container">
                                <div class="title">稳定性因子</div>
                                <div class="pallete-container">
                                    <div class="pallete">
                                        <div class="color-section green"></div>
                                        <div class="color-section orange"></div>
                                        <div class="color-section red"></div>
                                    </div>
                                    <div class="pallete-text-container">
                                        <div class="pallete-text val15">1.5</div>
                                        <div class="pallete-text val13">1.3</div>
                                        <div class="pallete-text val10">1.0</div>
                                        <div class="pallete-text val00">0.0</div>
                                    </div>
                                    <div class="pointer" id="pointer"></div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script setup>
import ModelTitleVue from '../ModelTitle.vue'
import soilFlowChart from '../soilAnalysis/soilFlowChart.vue';
import sectionDraw from '../soilAnalysis/sectionDraw.vue'
import sectionChart from '../soilAnalysis/chart copy'
import { getTestData } from '../soilAnalysis/chart'
import { onMounted, ref, reactive, watch, nextTick, computed } from 'vue';
import { ElNotification } from 'element-plus';
import { initPureScratchMap } from '../../../utils/mapUtils';
import { useSoilAnalysisStore } from '../../../store/modelStore';
import ModelRunner from '../modelRunner'

const soilAnalysisStore = useSoilAnalysisStore()
const activeTab = ref('section-tab');
const chartdom = ref(null)
const sectionDrawRef = ref(null)
const mapRef = ref(null)
const elevationOfFlow = ref(null)
const ModelRunningShow = ref(false)
const ModelRunningMessage = ref('')

let resultMap = null
let chart = null

const thicknessData = ref([1.93, -4.07, -11.57, -26.57, -36.57])
const thicknessName = ['Layer1', 'Layer2', 'Layer3', 'Layer4', 'Layer5']
const xzData = ref(new Array(23).fill([0, 0]))

// model params -- section view
let selectedDem = null
let sectionGeojson = null
const sectionDrawHandler = (geojson) => {
    console.log(' i got geojson !!', geojson)
    sectionGeojson = geojson
    if (selectedDem)
        soilAnalysisStore.updateSectionStatus(2)
}
const demSelectHandler = (name) => {
    const NameList = {
        '1998': '199801_dem/w001001.adf',
        '2004': '200408_dem/w001001.adf'
    }
    selectedDem = NameList[name]
    if (sectionGeojson)
        soilAnalysisStore.updateSectionStatus(2)
}
let globalSectionJson = null
// let globalFos = null
const globalFos = ref(0.0)
const fosText = computed(() => {
    return globalFos.value.toFixed(2)
})


const beforeTabLeave = (e) => {
    let fromTab = activeTab.value
    let toTab = e

    console.log('before leave', fromTab, toTab)

    // if (fromTab === 'section-tab') {
    //     if (sectionGeojson == null) {
    //         ElNotification({
    //             title: '警告',
    //             message: '请先完成断面绘制',
    //             type: 'warning',
    //             offset: 130
    //         })
    //         return false
    //     }

    //     if (toTab == 'result-tab') {
    //         ElNotification({
    //             title: '警告',
    //             message: '请先完成参数配置',
    //             type: 'warning',
    //             offset: 130
    //         })
    //         return false
    //     }


    //     return true
    // }

    // if (fromTab === '')



    //     if (toTab == 'section-tab') {
    //         sectionDrawRef.value.resizeMap()
    //         return true
    //     }
    // if (toTab == 'chart-tab') {
    //     console.log('chart-tab')
    //     if (chart == null) {
    //         chartInit()
    //     } else {
    //         setTimeout(() => {
    //             chart.myChart.resize()
    //         }, 0);
    //     }
    //     return true
    // }
    // if (toTab == 'result-tab') {
    //     console.log('result-tab')
    // }

    // return true
}

const tabClickCallback = (tab, event) => {
    console.log('tab click', tab.paneName)

    if (tab.paneName === 'section-tab') {
        sectionDrawRef.value.resizeMap()
    } else if (tab.paneName === 'chart-tab') {
        if (!chart) setTimeout(() => {
            chartInit()
        }, 1);
        else setTimeout(() => {
            // chart.myChart.resize()
            chartInit()
        }, 1);
    } else if (tab.paneName === 'result-tab') {
        console.log('result-tab')
        if (!resultMap) {
            setTimeout(() => {
                resultMapInit()
            }, 1)
        }
        else {
            setTimeout(() => {
                resultMap.resize()
                mapFlyToRiver(resultMap)
            }, 1)
        }
        setTimeout(() => {
            if (globalFos.value != 0.0) {
                updateFoSPointer(globalFos.value);
            }
        }, 2000)
    }

}

const BSTEMModelRun = async () => {
    let BSTEMModelParams = {
        "dem-id": selectedDem,
        "section-geometry": sectionGeojson,
        "x-values": xzData.value.map(item => item[0]),
        "z-values": xzData.value.map(item => item[1]),
        "index-toe": "",
        "bool-tension": true,
        "bank-layer-thickness": thicknessData.value,
    }
    console.log(BSTEMModelParams)
    const paramsCheck = () => {
        if (elevationOfFlow.value == null || elevationOfFlow.value == '') {
            ElNotification({
                type: 'warning',
                message: '请完整配置参数后运行',
                title: '警告',
                offset: 130
            })
            return false
        }
        return true
    }
    if (paramsCheck()) {
        ModelRunningShow.value = true
        ModelRunningMessage.value = '正在执行土地变形分析模型'
        soilAnalysisStore.updateBankDetailStatus(2)
        soilAnalysisStore.updateThicknessStatus(2)
        soilAnalysisStore.updateFlowsStatus(2)
        ElNotification({
            type: 'info',
            message: '执行土地变形分析模型',
            title: '提示',
            offset: 130
        })

        let BSTEMModelUrl = '/temp/taskNode/start/erosionModel/calculateBSTEM'
        const BSTEMMR = new ModelRunner(BSTEMModelUrl, BSTEMModelParams)
        const taskId = await BSTEMMR.modelStart()
        console.log('task id', taskId, BSTEMMR.taskId)
        let statusInterval = setInterval(async () => {
            const status = await BSTEMMR.getRunningStatus()
            console.log('status', status)
            switch (status) {
                case 'RUNNING':
                    break
                case 'COMPLETE':
                    clearInterval(statusInterval)
                    const result = await BSTEMMR.getModelResult()
                    console.log('fos result', result)
                    let fos = result['fos']
                    globalFos.value = Number.parseFloat(fos)

                    ModelRunningShow.value = false
                    ModelRunningMessage.value = ''
                    ElNotification({
                        type: 'success',
                        message: '土地变形分析模型执行成功',
                        title: '成功',
                        offset: 130
                    })
                    soilAnalysisStore.updateResultStatus(2)
                    break
                case 'ERROR':
                    clearInterval(statusInterval)
                    let errorLog = BSTEMMR.getErrorLog()
                    console.log('error', errorLog)

                    ModelRunningShow.value = false
                    ModelRunningMessage.value = ''
                    ElNotification({
                        type: 'error',
                        message: '土地变形分析模型执行失败,\n' + errorLog,
                        title: '错误',
                        offset: 130
                    })
                    break
            }
        }, 1000)


    }
}

const sectionViewModelRun = async () => {
    console.log('section view model run 1111111')
    let sectionViewParams = {
        'dem-id': selectedDem,
        'section-geometry': sectionGeojson,
    }
    const paramsCheck = () => {
        if (sectionViewParams['dem-id'] == null || sectionViewParams['section-geometry'] == null) {
            ElNotification({
                type: 'warning',
                message: '请完成断面绘制和地形选择',
                title: '警告',
                offset: 130
            })
            return false
        }
        return true
    }
    if (paramsCheck()) {
        ModelRunningShow.value = true
        ModelRunningMessage.value = '正在计算断面形态'
        let sectionViewModelUrl = '/temp/taskNode/start/riverbedEvolution/calculateSectionView'
        const sectionViewMR = new ModelRunner(sectionViewModelUrl, sectionViewParams)
        const taskId = await sectionViewMR.modelStart()
        console.log('task id', taskId, sectionViewMR.taskId)
        let statusInterval = setInterval(async () => {
            const status = await sectionViewMR.getRunningStatus()
            console.log('status', status)
            switch (status) {
                case 'RUNNING':
                    break
                case 'COMPLETE':
                    clearInterval(statusInterval)
                    const result = await sectionViewMR.getModelResult()
                    console.log('result', result)
                    let sectionFileName = result['raw-json']
                    const sectionJson = await sectionViewMR.getModelResultFile(sectionFileName, 'json')
                    console.log('section json', sectionJson)
                    sectionViewMR.sectionJson = sectionJson
                    globalSectionJson = sectionJson

                    ModelRunningShow.value = false
                    ModelRunningMessage.value = ''
                    ElNotification({
                        type: 'success',
                        message: '计算断面形态成功',
                        title: '成功',
                        offset: 130
                    })
                    break
                case 'ERROR':
                    clearInterval(statusInterval)
                    let errorLog = sectionViewMR.getErrorLog()
                    console.log('error', errorLog)

                    ModelRunningShow.value = false
                    ModelRunningMessage.value = ''
                    ElNotification({
                        type: 'error',
                        message: '计算断面形态失败,\n' + errorLog,
                        title: '错误',
                        offset: 130
                    })
                    break
            }
        }, 1000)
    }
}



const updateFoSPointer = (fos) => {
    const pointer = document.getElementById('pointer');
    const container = document.querySelector('.pallete');
    const containerHeight = container.clientHeight;
    let position;
    position = fos / 1.5 * containerHeight * 0.95 // 1.5 is the max fos value
    console.log('=================')
    console.log(position, containerHeight)
    // pointer.style.bottom = `${position}px`;
    pointer.style.transform = `translateY(${position * -1.0}px)`;
}


const chartInit = () => {
    let data = dataGenerate(globalSectionJson)
    // let data = dataGenerate(test)
    thicknessData.value = data.thicknessData.sort((a, b) => b - a)
    xzData.value = data.pointData.sort((a, b) => a[0] - b[0])
    console.log(data)
    chart = reactive(new sectionChart(chartdom.value, {
        pointData: data.pointData,
        thicknessData: data.thicknessData,
        lineData: data.lineData
    }))
    chart.initBaseChart()
    chart.initGraphic()

    watch(() => chart.newDataInfo, (e) => {
        thicknessData.value = e.thicknessData.sort((a, b) => b - a)
        xzData.value = e.pointData.sort((a, b) => a[0] - b[0])
    }, {
        deep: true
    })
}
const resultMapInit = async () => {
    resultMap = await initPureScratchMap(mapRef.value)
    resultMap.resize()
    attachBaseLayer(resultMap)
    let interval = addHighLightSectionLayer(resultMap, sectionGeojson)
    mapFlyToRiver(resultMap)
}



onMounted(async () => {

    window.addEventListener('keydown', (e) => {
        if (e.key == '1') {
            // console.log(selectedDem)
            globalFos.value = 1.5
            updateFoSPointer(globalFos.value)
        }
        if (e.key == '2') {
            // console.log(sectionGeojson)
            globalFos.value = 0
            updateFoSPointer(globalFos.value)
        }
        if (e.key == '3') {
            // sectionViewModelRun()
            globalFos.value = 1.17
            updateFoSPointer(globalFos.value)
        }
    })
    // /taskNode/result/id?taskId=66ade6c2cb34b50d7075f6a4

})

/// helper
const keepFloat2 = (num) => {
    return Math.round(num * 100) / 100
}
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
const attachBaseLayer = (map) => {
    console.log('attach base layer')
    const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
    map.addSource('mzsOverWaterSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsOverWaterBound/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsUnderWaterSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsUnderWaterBound/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsPlaceLabelSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsPlaceLabel/{x}/{y}/{z}',
        ],
    })
    map.addSource('mzsPlaceLineSource', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/mzsPlaceLine/{x}/{y}/{z}',
        ],
    })
    map.addSource('mapRaster2020', {
        type: 'raster',
        tiles: [
            tileServer + '/tile/raster/mzs/2020/Before/{x}/{y}/{z}',
        ],
        tileSize: 1024,
        minzoom: 10,
        maxzoom: 20,
        bounds: [120.509, 32.023, 120.555, 32.0402],
    })
    map.addSource('mapRaster2021', {
        type: 'raster',
        tiles: [
            tileServer + '/tile/raster/mzs/2021/Before/{x}/{y}/{z}',
        ],
        tileSize: 1024,
        minzoom: 10,
        maxzoom: 20,
        bounds: [120.5116, 32.02316, 120.555, 32.0402],
    })
    map.addSource('mapRaster2022', {
        type: 'raster',
        tiles: [
            tileServer + '/tile/raster/mzs/2022/Before/{x}/{y}/{z}',
        ],
        tileSize: 1024,
        minzoom: 10,
        maxzoom: 20,
        bounds: [120.51, 32.02, 120.552, 32.04046],
    })
    map.addSource('mapRaster2023', {
        type: 'raster',
        tiles: [
            tileServer + '/tile/raster/mzs/2023/Before/{x}/{y}/{z}',
        ],
        tileSize: 1024,
        minzoom: 10,
        maxzoom: 20,
        bounds: [120.50548, 32.0224, 120.55304, 32.0415],
    })
    map.addSource('riverBeachSource', {
        type: 'vector',
        tiles: [tileServer + '/tile/vector/riverBeach/{x}/{y}/{z}'],
    })
    // 民主沙面
    map.addLayer({
        id: 'riverBeachArea',
        type: 'fill',
        source: 'riverBeachSource',
        'source-layer': 'default',
        paint: {
            'fill-color': 'rgba(210,244,247, 1)',
        },
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
}
const addHighLightSectionLayer = (mapIns, sectionGeojson) => {
    mapIns.addSource('sectionSource', {
        type: 'geojson',
        data: sectionGeojson,
        lineMetrics: true,
    })
    mapIns.addLayer({
        id: 'sectionLayer',
        type: 'line',
        source: 'sectionSource',
        'paint': {
            // 'line-color': 'rgba(255, 0, 0, 0.8)',
            'line-width': 7,
            "line-gradient": [
                "interpolate",
                [
                    "linear"
                ],
                [
                    "line-progress"
                ],
                0,
                "#fa8970",
                0.1,
                "#fd7457",
                0.2,
                "#ff5c3e",
                0.3,
                "#ff0000",
                0.4,
                "#ff0000",
                0.5,
                "#ff0000",
                0.6,
                "#ff0000",
                0.7,
                "#ff0000",
                0.8,
                "#ff5c3e",
                0.9,
                "#fd7457",
                1.0,
                "#fa8970",
            ]
        }
    })

    const color0 = [
        "#fd7457",
        "#ff5c3e",
        "#ff0000",
        "#ff0000",
        "#ff0000",
        "#ff0000",
        "#ff0000",
        "#ff0000",
        "#ff0000",
        "#ff5c3e",
        "#fd7457",
    ]
    const color1 = [
        "#fa8970",
        "#fd7457",
        "#ff5c3e",
        "#ff0000",
        "#ff0000",
        "#ff0000",
        "#ff0000",
        "#ff0000",
        "#ff5c3e",
        "#fd7457",
        "#fa8970",
    ]
    const color2 = [
        "#ff9785",
        "#fa8970",
        "#fd7457",
        "#ff5c3e",
        "#ff0000",
        "#ff0000",
        "#ff0000",
        "#ff5c3e",
        "#fd7457",
        "#fa8970",
        "#ff9785",
    ]
    const color3 = [
        "#ffa291",
        "#ff9785",
        "#fa8970",
        "#fd7457",
        "#ff5c3e",
        "#ff0000",
        "#ff5c3e",
        "#fd7457",
        "#fa8970",
        "#ff9785",
        "#ffa291",
    ]

    let cnt = 0
    let interval = setInterval(() => {
        let map = {
            0: color3,
            1: color2,
            2: color1,
            3: color0,
            4: color1,
            5: color2,
            6: color3,
        }
        let color = map[cnt]
        cnt = (cnt + 1) % 7
        mapIns.setPaintProperty('sectionLayer', 'line-gradient', [
            "interpolate",
            [
                "linear"
            ],
            [
                "line-progress"
            ],
            0,
            color[0],
            0.1,
            color[1],
            0.2,
            color[2],
            0.3,
            color[3],
            0.4,
            color[4],
            0.5,
            color[5],
            0.6,
            color[6],
            0.7,
            color[7],
            0.8,
            color[8],
            0.9,
            color[9],
            1.0,
            color[10],
        ])
    }, 500)
    return interval

}
const dataGenerate = (origin) => {
    console.log('origin', origin)
    const lineData = []
    const lineDataStep = origin['step']
    const pointData = []
    const pointDataStep = origin['step_er_verified']
    for (let i = 0; i < origin['points'].length; i++) {
        let point = origin['points'][i]
        lineData.push([lineDataStep * i, point[2]])
    }
    let scatterStart = lineDataStep * origin['deepest_index'] - (origin['points_er_verified'].length - 1) * pointDataStep

    for (let i = 0; i < origin['points_er_verified'].length; i++) {
        let point = origin['points_er_verified'][i]
        // pointData.push([scatterStart + i * pointDataStep, point[2]])
        pointData.push([i * pointDataStep, point[2]])

    }

    return {
        lineData,
        pointData,
        thicknessData: [
            1.93, -4.07, -11.57, -26.57, -36.57
        ]
    }
}

const test = {
    "points": [
        [
            548996.997896606,
            3546474.3938493733,
            -1.4753461601605866
        ],
        [
            548994.6733517199,
            3546468.599127559,
            -1.579914643746663
        ],
        [
            548992.3488068336,
            3546462.804405745,
            -1.679943857649389
        ],
        [
            548990.0242619475,
            3546457.009683931,
            -1.7271396807859367
        ],
        [
            548987.6997170612,
            3546451.2149621164,
            -1.7717713732179021
        ],
        [
            548985.3751721751,
            3546445.4202403026,
            -1.8166420649542436
        ],
        [
            548983.050627289,
            3546439.625518488,
            -1.8617517559996408
        ],
        [
            548980.7260824027,
            3546433.8307966744,
            -1.907100446351496
        ],
        [
            548978.4015375166,
            3546428.03607486,
            -1.9526881360114934
        ],
        [
            548976.0769926304,
            3546422.2413530457,
            -2.0003751003808206
        ],
        [
            548973.7524477442,
            3546416.446631232,
            -2.0882959778505397
        ],
        [
            548971.427902858,
            3546410.6519094175,
            -2.1767959004019346
        ],
        [
            548969.1033579719,
            3546404.857187603,
            -2.2658748680275402
        ],
        [
            548966.7788130858,
            3546399.0624657893,
            -2.3555328747117605
        ],
        [
            548964.4542681995,
            3546393.267743975,
            -2.4457699208771593
        ],
        [
            548962.1297233134,
            3546387.4730221606,
            -2.5365860081023217
        ],
        [
            548959.8051784271,
            3546381.6783003467,
            -2.6281020725987188
        ],
        [
            548957.480633541,
            3546375.8835785324,
            -2.72056911919509
        ],
        [
            548955.1560886549,
            3546370.0888567185,
            -2.8129846610349034
        ],
        [
            548952.8315437686,
            3546364.294134904,
            -2.90534869813019
        ],
        [
            548950.5069988825,
            3546358.49941309,
            -2.997661230473109
        ],
        [
            548948.1824539963,
            3546352.704691276,
            -3.0899222580606893
        ],
        [
            548945.8579091101,
            3546346.9099694616,
            -3.1821317809013134
        ],
        [
            548943.5333642239,
            3546341.1152476473,
            -3.2673840722797474
        ],
        [
            548941.2088193378,
            3546335.3205258334,
            -3.330270764834066
        ],
        [
            548938.8842744516,
            3546329.525804019,
            -3.392586677965669
        ],
        [
            548936.5597295654,
            3546323.7310822047,
            -3.4543318116726454
        ],
        [
            548934.2351846793,
            3546317.936360391,
            -3.515506165949664
        ],
        [
            548931.910639793,
            3546312.1416385765,
            -3.576109740805037
        ],
        [
            548929.5860949069,
            3546306.3469167626,
            -3.636142536230439
        ],
        [
            548927.2615500208,
            3546300.5521949483,
            -3.6946819285322765
        ],
        [
            548924.9370051345,
            3546294.757473134,
            -3.751209666965664
        ],
        [
            548922.6124602484,
            3546288.96275132,
            -3.8077374013807535
        ],
        [
            548920.2879153622,
            3546283.1680295058,
            -3.8642651317853405
        ],
        [
            548917.963370476,
            3546277.3733076914,
            -3.920792858174503
        ],
        [
            548915.6388255899,
            3546271.5785858775,
            -3.9773205805463925
        ],
        [
            548913.3142807037,
            3546265.783864063,
            -4.03384829890778
        ],
        [
            548910.9897358175,
            3546259.989142249,
            -4.0956958134102495
        ],
        [
            548908.6651909313,
            3546254.194420435,
            -4.165050979757834
        ],
        [
            548906.3406460452,
            3546248.3996986207,
            -4.235173703389821
        ],
        [
            548904.0161011589,
            3546242.604976807,
            -4.3060639843009545
        ],
        [
            548901.6915562728,
            3546236.8102549925,
            -4.377721822496425
        ],
        [
            548899.3670113867,
            3546231.015533178,
            -4.450147217973642
        ],
        [
            548897.0424665004,
            3546225.2208113642,
            -4.523340170729979
        ],
        [
            548894.7179216143,
            3546219.42608955,
            -4.590641072858522
        ],
        [
            548892.393376728,
            3546213.6313677356,
            -4.6521663512086615
        ],
        [
            548890.0688318419,
            3546207.8366459217,
            -4.713611654679192
        ],
        [
            548887.7442869558,
            3546202.0419241074,
            -4.775284165476119
        ],
        [
            548885.4197420696,
            3546196.247202293,
            -4.837869055628991
        ],
        [
            548883.0951971834,
            3546190.452480479,
            -4.900909259018157
        ],
        [
            548880.7706522972,
            3546184.657758665,
            -4.964404775652034
        ],
        [
            548878.4461074111,
            3546178.863036851,
            -5.024566305933816
        ],
        [
            548876.1215625248,
            3546173.0683150366,
            -5.083827585118578
        ],
        [
            548873.7970176387,
            3546167.2735932223,
            -5.144640951748517
        ],
        [
            548871.4724727526,
            3546161.4788714084,
            -5.207006405822006
        ],
        [
            548869.1479278663,
            3546155.684149594,
            -5.270923947346105
        ],
        [
            548866.8233829802,
            3546149.8894277797,
            -5.336393576315276
        ],
        [
            548864.498838094,
            3546144.094705966,
            -5.403415292729387
        ],
        [
            548862.1742932078,
            3546138.2999841515,
            -5.4668604681180994
        ],
        [
            548859.8497483217,
            3546132.505262337,
            -5.528548003590279
        ],
        [
            548857.5252034354,
            3546126.7105405233,
            -5.59020780758676
        ],
        [
            548855.2006585493,
            3546120.915818709,
            -5.651839880109336
        ],
        [
            548852.8761136631,
            3546115.121096895,
            -5.713444221156456
        ],
        [
            548850.551568777,
            3546109.3263750807,
            -5.775020830729541
        ],
        [
            548848.2270238907,
            3546103.5316532664,
            -5.836380028055483
        ],
        [
            548845.9024790046,
            3546097.7369314525,
            -5.867835626020252
        ],
        [
            548843.5779341185,
            3546091.942209638,
            -5.8929799977253285
        ],
        [
            548841.2533892322,
            3546086.147487824,
            -5.917984885091808
        ],
        [
            548838.9288443461,
            3546080.35276601,
            -5.942850288117174
        ],
        [
            548836.6042994598,
            3546074.5580441956,
            -5.967576206803447
        ],
        [
            548834.2797545737,
            3546068.7633223813,
            -5.99216264114812
        ],
        [
            548831.9552096876,
            3546062.9686005674,
            -6.0166095911532
        ],
        [
            548829.6306648013,
            3546057.173878753,
            -6.075419865050651
        ],
        [
            548827.3061199152,
            3546051.379156939,
            -6.13573308295789
        ],
        [
            548824.981575029,
            3546045.584435125,
            -6.194454928504952
        ],
        [
            548822.6570301428,
            3546039.7897133105,
            -6.251585401686533
        ],
        [
            548820.3324852567,
            3546033.9949914967,
            -6.307124502501485
        ],
        [
            548818.0079403705,
            3546028.2002696823,
            -6.361072230955947
        ],
        [
            548815.6833954843,
            3546022.405547868,
            -6.413014130321384
        ],
        [
            548813.3588505981,
            3546016.610826054,
            -6.437184020155186
        ],
        [
            548811.034305712,
            3546010.81610424,
            -6.457464381978489
        ],
        [
            548808.7097608257,
            3546005.0213824254,
            -6.473855215793289
        ],
        [
            548806.3852159396,
            3545999.2266606116,
            -6.479934106269031
        ],
        [
            548804.0606710535,
            3545993.4319387972,
            -6.486157028854068
        ],
        [
            548801.7361261672,
            3545987.6372169834,
            -6.493381696770508
        ],
        [
            548799.4115812811,
            3545981.842495169,
            -6.494511924183193
        ],
        [
            548797.0870363949,
            3545976.0477733547,
            -6.443597579577486
        ],
        [
            548794.7624915087,
            3545970.253051541,
            -6.397991540238919
        ],
        [
            548792.4379466226,
            3545964.4583297265,
            -6.357693806158241
        ],
        [
            548790.1134017364,
            3545958.663607912,
            -6.322704377341539
        ],
        [
            548787.7888568502,
            3545952.8688860983,
            -6.2930232537909765
        ],
        [
            548785.464311964,
            3545947.074164284,
            -6.268650435500274
        ],
        [
            548783.1397670779,
            3545941.2794424696,
            -6.257970832782356
        ],
        [
            548780.8152221916,
            3545935.4847206557,
            -6.2822702109326745
        ],
        [
            548778.4906773055,
            3545929.6899988414,
            -6.3089824923341995
        ],
        [
            548776.1661324194,
            3545923.8952770275,
            -6.338107676988807
        ],
        [
            548773.8415875331,
            3545918.100555213,
            -6.369645764897881
        ],
        [
            548771.517042647,
            3545912.305833399,
            -6.403596756058461
        ],
        [
            548769.1924977608,
            3545906.511111585,
            -6.439960650473658
        ],
        [
            548766.8679528746,
            3545900.7163897706,
            -6.54875367733084
        ]
    ],
    "step": 6.243581490734901,
    "Sa_h": [
        -0.016748157086000977,
        -0.01602112730508338,
        -0.007559094600844634,
        -0.007148411932829923,
        -0.007186691132794039,
        -0.00722497033350766,
        -0.007263249533805222,
        -0.007301528734372533,
        -0.007637757982352238,
        -0.014081801863271648,
        -0.014174544319269875,
        -0.014267286774072454,
        -0.014360028265390207,
        -0.014452769824387665,
        -0.014545511636218415,
        -0.014657623133805711,
        -0.014809936689957007,
        -0.014801687457263506,
        -0.014793438226496987,
        -0.014785188994474572,
        -0.014776939761976388,
        -0.01476869053082073,
        -0.01365438915227473,
        -0.010072214585112507,
        -0.009980795994106296,
        -0.009889377402793954,
        -0.009797958810627798,
        -0.009706540219792933,
        -0.009615121627624646,
        -0.009375931488794738,
        -0.009053735987473067,
        -0.009053735343884496,
        -0.009053734701544422,
        -0.009053734058416044,
        -0.009053733414991563,
        -0.00905373277265163,
        -0.009905775169948092,
        -0.011108234344422879,
        -0.01123116975986374,
        -0.01135410517446288,
        -0.011477040589893215,
        -0.011599976004908735,
        -0.011722911419503464,
        -0.010779214178338726,
        -0.009854164383285407,
        -0.0098413552480594,
        -0.009877745791969792,
        -0.010023876559590647,
        -0.01009680156857307,
        -0.010169726578903639,
        -0.009635740379309221,
        -0.009491552128005684,
        -0.009740141410852516,
        -0.009988730693438596,
        -0.0102373199771556,
        -0.01048590925998536,
        -0.010734498542794351,
        -0.010161663699410508,
        -0.009880152211310146,
        -0.009875710613848808,
        -0.009871269016674969,
        -0.009866827419252324,
        -0.009862385822057573,
        -0.009827564101949496,
        -0.005038069577765071,
        -0.004027235288333993,
        -0.004004894851390283,
        -0.003982554414043282,
        -0.0039602139770201945,
        -0.0039378735395955225,
        -0.003915533102492204,
        -0.00941931709944391,
        -0.009660035349380933,
        -0.009405154018443041,
        -0.009150272686655745,
        -0.008895391354684515,
        -0.008640510023696693,
        -0.00831924744515886,
        -0.0038711579034675083,
        -0.003248193661506195,
        -0.0026252294198648124,
        -0.0009736223487692638,
        -0.000996691177054616,
        -0.0011571351999106996,
        -0.00018102228894780508,
        0.008154669668564592,
        0.007304467701149403,
        0.006454265735215795,
        0.005604063768307316,
        0.0047538618010524464,
        0.0039036598348031757,
        0.001710493045340369,
        -0.0038918973327051235,
        -0.0042783587338716495,
        -0.004664820135338618,
        -0.005051281537027219,
        -0.005437742938241542,
        -0.005824204339954469,
        -0.017424778873892176
    ],
    "points_v": [
        [
            548996.997896606,
            3546474.3938493733,
            -1.4753461601605866
        ],
        [
            548879.3953100088,
            3546181.2292484185,
            -5
        ],
        [
            548766.8679528746,
            3545900.7163897706,
            -6.54875367733084
        ]
    ],
    "Sa_v": [
        -0.011158446851782572,
        -0.005124227275453182
    ],
    "deepest_index": 99,
    "slope_foot_index": 1,
    "points_er_verified": [
        [
            548996.997896606,
            3546474.3938493733,
            -1.4753461601605866
        ],
        [
            548986.5374446182,
            3546448.3176012095,
            -1.7941768441726258
        ],
        [
            548976.0769926304,
            3546422.2413530457,
            -2.0003751003808206
        ],
        [
            548965.6165406426,
            3546396.165104882,
            -2.4005790176651343
        ],
        [
            548955.1560886548,
            3546370.0888567185,
            -2.81298466103612
        ],
        [
            548944.6956366671,
            3546344.0126085547,
            -3.2282172280371952
        ],
        [
            548934.2351846793,
            3546317.936360391,
            -3.515506165949664
        ],
        [
            548923.7747326915,
            3546291.860112227,
            -3.7794735346750086
        ],
        [
            548913.3142807037,
            3546265.783864063,
            -4.03384829890778
        ],
        [
            548902.8538287159,
            3546239.7076158994,
            -4.341796958740412
        ],
        [
            548892.3933767282,
            3546213.6313677356,
            -4.652166351207419
        ],
        [
            548881.9329247402,
            3546187.5551195717,
            -4.9326001031821995
        ],
        [
            548871.4724727524,
            3546161.4788714084,
            -5.207006405823474
        ],
        [
            548861.0120207648,
            3546135.4026232446,
            -5.497707702287378
        ],
        [
            548850.551568777,
            3546109.3263750807,
            -5.775020830729541
        ],
        [
            548840.0911167891,
            3546083.250126917,
            -5.930435022146945
        ],
        [
            548829.6306648013,
            3546057.173878753,
            -6.075419865050651
        ],
        [
            548819.1702128135,
            3546031.0976305893,
            -6.334297288276048
        ],
        [
            548808.7097608258,
            3546005.0213824254,
            -6.473855215792379
        ],
        [
            548798.249308838,
            3545978.945134262,
            -6.468391213724662
        ],
        [
            548787.7888568502,
            3545952.8688860983,
            -6.2930232537909765
        ],
        [
            548777.3284048624,
            3545926.7926379344,
            -6.3232434717549
        ],
        [
            548766.8679528746,
            3545900.7163897706,
            -6.54875367733084
        ]
    ],
    "points_er": [
        [
            548996.997896606,
            3546474.3938493733,
            -1.4753461601605866
        ],
        [
            548986.5374446182,
            3546448.3176012095,
            -1.7941768441726258
        ],
        [
            548976.0769926304,
            3546422.2413530457,
            -2.0003751003808206
        ],
        [
            548965.6165406426,
            3546396.165104882,
            -2.4005790176651343
        ],
        [
            548955.1560886548,
            3546370.0888567185,
            -2.81298466103612
        ],
        [
            548944.6956366671,
            3546344.0126085547,
            -3.2282172280371952
        ],
        [
            548934.2351846793,
            3546317.936360391,
            -3.515506165949664
        ],
        [
            548923.7747326915,
            3546291.860112227,
            -3.7794735346750086
        ],
        [
            548913.3142807037,
            3546265.783864063,
            -4.03384829890778
        ],
        [
            548902.8538287159,
            3546239.7076158994,
            -4.341796958740412
        ],
        [
            548892.3933767282,
            3546213.6313677356,
            -4.652166351207419
        ],
        [
            548881.9329247402,
            3546187.5551195717,
            -4.9326001031821995
        ],
        [
            548871.4724727524,
            3546161.4788714084,
            -5.207006405823474
        ],
        [
            548861.0120207648,
            3546135.4026232446,
            -5.497707702287378
        ],
        [
            548850.551568777,
            3546109.3263750807,
            -5.775020830729541
        ],
        [
            548840.0911167891,
            3546083.250126917,
            -5.930435022146945
        ],
        [
            548829.6306648013,
            3546057.173878753,
            -6.075419865050651
        ],
        [
            548819.1702128135,
            3546031.0976305893,
            -6.334297288276048
        ],
        [
            548808.7097608258,
            3546005.0213824254,
            -6.473855215792379
        ],
        [
            548798.249308838,
            3545978.945134262,
            -6.468391213724662
        ],
        [
            548787.7888568502,
            3545952.8688860983,
            -6.2930232537909765
        ],
        [
            548777.3284048624,
            3545926.7926379344,
            -6.3232434717549
        ],
        [
            548766.8679528746,
            3545900.7163897706,
            -6.54875367733084
        ]
    ],
    "step_er_verified": 28.096116708307054,
    "step_er": 28.096116708307054
}


</script>

<style lang="scss" scoped>
div.flex-coloum {
    display: flex;
    flex-direction: column;
}

div.flex-row {
    display: flex;
    flex-direction: row;
}

div.one-center {
    position: relative;
    display: grid;
    place-items: center;
}

div.title2 {
    position: relative;
    width: fit-content;
    font-size: calc(0.7vw + 0.6vh);
    font-weight: bold;
    text-align: left;
    margin-bottom: 2px;
    color: #0e14cf;
    user-select: none;
    text-shadow: 1px 3px 8px rgba(134, 255, 245, 0.71);
}


.stablityAnalysis-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100vw;
    height: 92vh;
    overflow: hidden;
    flex-direction: column;
    background: linear-gradient(to bottom right, rgb(91, 219, 209), rgb(35, 119, 247));
    background-size: 200% 200%;
    animation: slideBackgroundColor 4s ease infinite;

    div.model-content-container {
        width: 100vw;
        height: 85vh;
        padding-top: 1vh;
        overflow: hidden;
        display: flex;
        flex-flow: column wrap;
        justify-content: space-around;
        align-content: space-around;

        div.model-flow-container {
            position: relative;
            width: 24vw;
            height: 85vh;
            // background-color: rgb(255, 255, 255);
        }

        div.flow-container {}



        div.model-run-container {
            position: relative;
            width: 74.4vw;
            height: 85vh;
            // border: 5px solid;
            padding: 3px;
            // border-image: repeating-linear-gradient(to bottom right, #fdfeff81, #97b1ff73, #b0ffe7, rgba(3, 175, 255, 0.459)) 20;
            border-radius: 10px;
            overflow: hidden;

            div.loading-container {
                position: absolute;
                top: 10vh;
                right: 35vw;
                width: 6vw;
                height: 10vh;
                background-color: rgba(249, 254, 255, 0.634);
                backdrop-filter: blur(5px);
                z-index: 5;

                :deep(.dv-loading.loading-icon) {
                    position: absolute;
                    top: -2.5vh;
                    right: 0vw;
                }

                div.loading-message {
                    text-align: center;
                    position: absolute;
                    left: 0vw;
                    width: 6vw;
                    height: 6vh;
                    top: 7.3vh;
                    font-size: calc(0.6vw + 0.4svh);
                    font-weight: bold;
                }
            }

            div.custom-tabs {
                height: 6vh;
                user-select: none;
                // background-color: aqua;

                :deep(.el-tabs__header) {
                    height: 6vh;
                    margin: 0;
                }

                :deep(div.el-tabs__item, div.is-top) {
                    background-color: rgb(67, 167, 243);
                    height: 6vh;
                    color: rgb(255, 255, 255);
                    font-size: calc(0.6vw + 0.6vh);
                    font-weight: 800;
                    border-radius: 5px;
                    margin-right: .5vw;
                    transition: .2s ease-in-out;

                    &.is-active {
                        background-color: rgb(27, 102, 160);
                        font-size: calc(0.6vw + 0.8vh);

                    }
                }

                :deep(div.el-tabs__item, div.is-top, div.is-active) {
                    border: none;
                }

                :deep(div.el-tabs__nav, div.is-top) {
                    border: none;
                }

                :deep(div.el-tabs__nav-scroll) {
                    background-color: rgb(171, 213, 246);
                    // border-bottom: 3px solid #2a4ac9;
                }

            }

            :deep(div.el-tabs__content) {
                position: relative;
                width: 75vw;
                height: 79vh;
            }

            div.tab-page-container {
                position: relative;
                width: 75vw;
                height: 79vh;
                background-color: #03589e;

                div.sectionView-run-button {
                    position: absolute;
                    top: 10vh;
                    right: 4vw;
                    width: 10vw;
                    height: 5vh;
                    background-color: transparent;
                    z-index: 2;

                    .run-button {
                        position: relative;
                        width: 9vw;
                        height: 4vh;
                        background-color: #b8e9ff;
                        border-right: 12px solid rgb(2, 143, 199);
                        border-bottom: 8px solid rgb(87, 179, 216);
                        border-radius: 5px;
                        transition: .1s ease-in-out;
                        cursor: pointer;
                        font-size: calc(0.7vw + 0.6vh);
                        font-weight: 700;

                        color: rgb(23, 87, 112);
                        text-shadow: 0px 0px 5px #b4f1f1;
                        background-color: #b8e9ff;

                        &:active {
                            border-right: 6px solid rgb(2, 143, 199);
                            border-bottom: 4px solid rgb(87, 179, 216);
                        }


                    }
                }

                div.model-run-content {
                    width: 75vw;
                    height: 79vh;

                    .form-block {
                        position: relative;
                        width: 98%;
                        height: 30%;
                        margin-left: 0.1vw;
                        // background-color: #2a4ac9;
                        border: #fdfdfd7a 5px dashed;
                        border-radius: 10px;

                        .detail-bank-profile {

                            position: relative;
                            width: 80%;
                            height: 70%;
                            padding: 10px;
                            margin: 5px;
                            background-color: rgb(212, 239, 254);
                            border-radius: 10px;


                            .title2 {
                                position: relative;
                                width: fit-content;
                                height: 30%;
                            }

                            .xz-table {
                                position: relative;
                                width: 100%;
                                height: 70%;

                                .table {
                                    position: relative;
                                    width: 100%;
                                    height: 100%;
                                    display: flex;
                                    flex-direction: column;

                                    &.head {
                                        width: 4vw;
                                        margin-right: .2vw;
                                    }

                                    .row {
                                        position: relative;
                                        width: 100%;
                                        flex: 1;
                                        display: flex;
                                        flex-direction: row;
                                        justify-content: space-between;
                                        align-items: center;

                                    }

                                    .cell {
                                        height: 2.5vh;
                                        flex: 1;
                                        // border: 1px solid rgb(201, 201, 201);
                                        border-right: 2px solid rgb(2, 143, 199);
                                        border-bottom: 1px solid rgb(5, 88, 121);
                                        border-radius: 5px;

                                        display: grid;
                                        place-items: center;
                                        font-size: calc(0.3vw + 0.3vh);
                                        transition: .3s ease-in-out;

                                        &:nth-child(even) {
                                            color: rgb(44, 61, 212);
                                            background-color: #ffffff;
                                        }

                                        &:nth-child(odd) {
                                            color: white;
                                            background-color: rgba(44, 61, 212, 0.527);
                                        }

                                        &:hover {
                                            background-color: rgb(44, 61, 212);
                                            color: white;
                                            font-weight: bold;
                                        }

                                        &.head {
                                            background-color: #0e14cf;
                                            font-size: calc(0.4vw + 0.3vh);
                                        }
                                    }


                                }
                            }

                        }

                        .soil-layer-profile {

                            position: relative;
                            width: 80%;
                            height: 30%;
                            padding: 10px;
                            margin: 5px;
                            background-color: rgb(212, 239, 254);
                            border-radius: 10px;

                            .content {

                                justify-content: space-evenly;
                                align-items: center;

                                .keyValue {
                                    position: relative;
                                    justify-content: center;
                                    align-items: center;
                                    width: 8vw;
                                    height: 4vh;

                                    .key {
                                        height: 2.5vh;
                                        flex: 0.3;
                                        display: grid;
                                        place-items: center;
                                        font-size: calc(0.3vw + 0.3vh);
                                        transition: .3s ease-in-out;
                                        border-right: 2px solid rgb(2, 143, 199);
                                        border-bottom: 1px solid rgb(5, 88, 121);
                                        border-radius: 5px;
                                        background-color: rgb(44, 61, 212);
                                        font-weight: bold;
                                        color: white;
                                    }

                                    .value {
                                        height: 2.5vh;
                                        flex: 0.7;
                                        border-right: 2px solid rgb(2, 143, 199);
                                        border-bottom: 1px solid rgb(5, 88, 121);
                                        border-radius: 5px;
                                        display: grid;
                                        place-items: center;
                                        font-size: calc(0.4vw + 0.4vh);
                                        transition: .3s ease-in-out;
                                        background-color: #ffffff;
                                        color: rgb(44, 61, 212);

                                    }
                                }

                            }

                        }

                        .right-block {
                            position: absolute;
                            width: 18%;
                            height: 100%;
                            right: 0;
                            top: 0;

                            .half-block {
                                position: relative;
                                width: 90%;
                                height: 50%;
                                padding: 10px;
                                margin: 5px;
                                background-color: rgb(212, 239, 254);
                                border-radius: 10px;

                                .keyValue {
                                    position: relative;
                                    justify-content: center;
                                    align-items: center;
                                    width: 10vw;
                                    height: 4vh;

                                    .key {
                                        height: 2.5vh;
                                        width: 65%;
                                        margin-right: .5vw;
                                        display: grid;
                                        place-items: center;
                                        font-size: calc(0.5vw + 0.3vh);
                                        transition: .3s ease-in-out;
                                        border-right: 2px solid rgb(2, 143, 199);
                                        border-bottom: 1px solid rgb(5, 88, 121);
                                        border-radius: 5px;
                                        background-color: rgb(44, 61, 212);
                                        font-weight: bold;
                                        color: white;
                                    }

                                    .value {
                                        height: 2.5vh;
                                        // flex: 0.4;
                                        width: 33%;

                                        border-right: 2px solid rgb(2, 143, 199);
                                        border-bottom: 1px solid rgb(5, 88, 121);
                                        border-radius: 5px;
                                        display: grid;
                                        place-items: center;
                                        font-size: calc(0.4vw + 0.4vh);
                                        transition: .3s ease-in-out;
                                        background-color: #ffffff;
                                        color: rgb(44, 61, 212);

                                    }
                                }

                                .run-button {
                                    position: relative;
                                    width: 9vw;
                                    height: 7vh;
                                    background-color: #b8e9ff;
                                    border-right: 12px solid rgb(2, 143, 199);
                                    border-bottom: 8px solid rgb(87, 179, 216);
                                    border-radius: 5px;
                                    transition: .1s ease-in-out;
                                    cursor: pointer;
                                    font-size: calc(0.7vw + 0.6vh);
                                    font-weight: 700;

                                    color: rgb(23, 87, 112);
                                    text-shadow: 0px 0px 5px #b4f1f1;
                                    background-color: #b8e9ff;

                                    &:active {
                                        border-right: 6px solid rgb(2, 143, 199);
                                        border-bottom: 4px solid rgb(87, 179, 216);
                                    }


                                }




                            }

                        }


                    }

                    .chart-block {
                        position: relative;
                        width: 99.5%;
                        height: 70%;
                        // background-color: rgb(242, 251, 255);

                        #chart {
                            position: relative;
                            width: 99%;
                            height: 97%;
                            background-color: rgb(242, 251, 255);
                            border-radius: 10px;
                        }
                    }

                }

                div.map-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    background-color: hsl(194, 69%, 91%);
                }

                div.warn-status-Desc {
                    position: absolute;
                    right: 26vw;
                    top: 1vh;
                    height: 4vh;
                    line-height: 4vh;
                    width: 25vw;
                    text-align: center;
                    font-size: calc(0.8vw + 0.3vh);
                    font-weight: bold;
                    color: #e3f9ff;
                    box-shadow: 0px 2px rgb(0, 225, 255);
                    border-radius: 6px;
                    background-color: #0011ffd5;
                }

                div.warn-status-container {
                    position: absolute;
                    right: 32vw;
                    top: 6vh;
                    width: 14vw;
                    height: 10vh;

                    background-color: #0511bbd5;
                    backdrop-filter: blur(8px);
                    z-index: 3;
                    border-radius: 6px;
                    text-align: center;
                    overflow: hidden;

                    box-shadow: 4px 6px 6px -4px rgb(0, 47, 117);


                    div.warn-status-title {
                        height: 4vh;
                        line-height: 4vh;
                        width: 14vw;
                        font-size: calc(0.8vw + 0.3vh);
                        font-weight: bold;
                        color: #e3f9ff;
                        box-shadow: 0px 2px rgb(0, 225, 255);
                    }

                    div.warn-status-content {
                        height: 6vh;
                        line-height: 6vh;
                        width: 14vw;
                        font-size: calc(1.1vw + 0.8vh);
                        font-weight: bold;
                        // background-color: #2688f8;
                        color: #ebf8ff;
                        text-align: cen;
                        letter-spacing: 1rem;
                        text-indent: 1rem;

                        &.low {
                            background-color: rgb(17, 17, 255);

                        }

                        &.middle {
                            background-color: rgb(220, 126, 37);
                        }

                        &.high {
                            background-color: rgb(255, 9, 9);

                        }
                    }
                }

                div.fos-result-container {
                    position: absolute;
                    right: 1vw;
                    bottom: 5vh;
                    width: 6vw;
                    height: 21vh;
                    background-color: rgb(81, 95, 114);
                    color: white;
                    border-radius: 5px;

                    box-shadow: 4px 6px 6px -4px rgb(0, 47, 117);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    .title {
                        position: relative;
                        font-size: calc(0.6vw + 0.6vh);
                        font-weight: bold;
                        line-height: 4vh;
                        margin-bottom: 0.5vh;
                    }

                    .pallete-container {
                        position: relative;
                        height: 15vh;
                        width: 2vw;
                        // border: 1px solid #000;

                        .pallete {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 15vh;

                            .color-section {
                                width: 100%;

                                &.green {
                                    height: 3vh;
                                    background-color: green;
                                    border-top-right-radius: 5px;
                                    border-top-left-radius: 5px;
                                }

                                &.orange {
                                    height: 2vh;
                                    background-color: orange;
                                }

                                &.red {
                                    height: 10vh;
                                    background-color: red;
                                    border-bottom-left-radius: 5px;
                                    border-bottom-right-radius: 5px;
                                }
                            }
                        }

                        .pallete-text-container {
                            position: absolute;
                            top: 0;
                            left: 2.2vw;
                            width: 100%;
                            height: 15vh;

                            .pallete-text {
                                width: 100%;

                                &.val15 {
                                    margin-top: -1vh;
                                }

                                &.val13 {
                                    margin-top: 1vh;
                                }

                                &.val10 {
                                    margin-top: 0vh;
                                }

                                &.val00 {
                                    margin-top: 7vh;
                                }

                            }
                        }

                        .pointer {
                            position: absolute;
                            transition: .3s ease-in-out;
                            left: -1.2vw;
                            bottom: -10px;
                            width: 0;
                            height: 0;
                            border-top: 10px solid transparent;
                            border-bottom: 10px solid transparent;
                            border-left: 20px solid rgb(255, 178, 178);
                            /* 向右指的三角形 */
                        }




                    }







                }


            }
        }
    }
}
</style>
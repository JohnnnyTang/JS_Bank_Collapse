<template>
    <div class="stablityAnalysis-container">
        <ModelTitleVue :ModelName="'土体变形分析模型'" />
        <div class="model-content-container">
            <div class="flow-container">
                <soilFlowChart></soilFlowChart>
            </div>

            <div class="model-run-container">
                <el-tabs v-model="activeTab" type="card" class="custom-tabs" :before-leave="beforeTabLeave"
                    @tab-click="tabClickCallback">
                    <el-tab-pane label="评估断面选择" name="section-tab">
                        <div class="tab-page-container">
                            <sectionDraw ref="sectionDrawRef" v-on:section-draw="sectionDrawHandler"></sectionDraw>
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
                                            <div class="run-button one-center" @click="runModel">
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
                            <div class="warn-status-container">
                                <div class="warn-status-title">当前断面风险状态</div>
                                <div class="warn-status-content high">高风险</div>
                            </div>
                            <div class="fos-result-container">
                                <div class="title">FoS</div>
                                <div class="pallete-container">
                                    <div class="pallete">
                                        <div class="color-section green"></div>
                                        <div class="color-section orange"></div>
                                        <div class="color-section red"></div>
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
import { onMounted, ref, reactive, watch, nextTick } from 'vue';
import { ElNotification } from 'element-plus';
import { initPureScratchMap } from '../../../utils/mapUtils';
import { useSoilAnalysisStore } from '../../../store/modelStore';

const soilAnalysisStore = useSoilAnalysisStore()
const activeTab = ref('section-tab');
const chartdom = ref(null)
const sectionDrawRef = ref(null)
const mapRef = ref(null)
const elevationOfFlow = ref(null)
let resultMap = null
let chart = null
let sectionGeojson = null

const thicknessData = ref([1.93, -4.07, -11.57, -26.57, -36.57])
const thicknessName = ['Layer1', 'Layer2', 'Layer3', 'Layer4', 'Layer5']
const xzData = ref([
    [
        4.558842192636803e-11,
        -1.2148850368295108
    ],
    [
        38.10376216666087,
        -1.2429049979040028
    ],
    [
        76.20752433327615,
        -1.2259330622439175
    ],
    [
        114.31128649989144,
        -1.259806958700206
    ],
    [
        152.41504866650672,
        -1.2611951002238697
    ],
    [
        190.51881083312202,
        -1.3152647034596443
    ],
    [
        228.6225729997373,
        -1.4663700476224946
    ],
    [
        266.72633516635256,
        -1.6060859011160848
    ],
    [
        304.83009733296785,
        -3.032057199133465
    ],
    [
        342.93385949958315,
        -3.3242398937408764
    ],
    [
        381.03762166619845,
        -3.4983403331779157
    ],
    [
        419.1413838328137,
        -4.124987050220527
    ],
    [
        457.245145999429,
        -4.851273410394535
    ],
    [
        495.3489081660443,
        -6.5910771797927366
    ],
    [
        533.4526703326595,
        -8.942828967567108
    ],
    [
        571.5564324992748,
        -12.24843115675129
    ],
    [
        609.6601946658901,
        -16.29660691373699
    ],
    [
        647.7639568325054,
        -20.083224500410033
    ],
    [
        685.8677189991207,
        -23.861599173246326
    ],
    [
        723.971481165736,
        -27.125650170028873
    ],
    [
        762.0752433323513,
        -28.320095015823984
    ],
    [
        800.1790054989665,
        -29.132909224573726
    ],
    [
        838.2827676655818,
        -29.25361011534611
    ]
])

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
        if (!chart) chartInit()
        else setTimeout(() => {
            chart.myChart.resize()
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
            updatePointer(0.67);
        }, 2000)
    }

}

const runModel = () => {

    if (elevationOfFlow.value == null) {
        ElNotification({
            type: 'warning',
            message: '请完整配置参数后运行',
            title: '警告',
            offset: 130
        })
        return
    }

    const check = () => {
        //check all parameters
        return true
    }

    if (check()) {
        soilAnalysisStore.updateBankDetailStatus(2)
        soilAnalysisStore.updateThicknessStatus(2)
        soilAnalysisStore.updateFlowsStatus(2)
        ElNotification({
            type: 'info',
            message: '执行土地变形分析模型',
            title: '提示',
            offset: 130
        })
    } else {
        ElNotification({
            type: 'warning',
            message: '参数校验失败，请配置合理参数',
            title: '警告',
            offset: 130
        })
    }



}

const prepare = (e) => {
    console.log(e)
    console.log('prepare', e.paneName)

    console.log(activeTab.value)

    if (e.paneName === 'chart-tab') {
        // console.log(chart)
        // if (!chart) chartInit()
        // else setTimeout(() => {
        //     chart.myChart.resize()
        // }, 1);

        if (sectionGeojson == null) {
            alert('断面未绘制')
            activeTab.value = 'section-tab'
            sectionDrawRef.value.resizeMap()
        } else {
            if (!chart) chartInit()
            else setTimeout(() => {
                chart.myChart.resize()
            }, 1);
        }
    }
    if (e.paneName === 'section-tab') {
        sectionDrawRef.value.resizeMap()
    }
}
const sectionDrawHandler = (geojson) => {
    console.log(' i got geojson !!', geojson)
    sectionGeojson = geojson
    soilAnalysisStore.updateSectionStatus(2)
}



const updatePointer = (fos) => {
    const pointer = document.getElementById('pointer');
    const container = document.querySelector('.pallete');
    const containerHeight = container.clientHeight;
    let position;

    // if (fos > 1.3) {
    //     position = containerHeight * 0.85; // 85% of the container height
    // } else if (fos > 1) {
    //     position = containerHeight * 0.5; // 50% of the container height
    // } else {
    //     position = containerHeight * 0.15; // 15% of the container height
    // }

    position = fos / 1.5 * containerHeight // 1.5 is the max fos value
    console.log('=================')
    console.log(position, containerHeight)
    pointer.style.bottom = `${position}px`;
}








const chartInit = async () => {
    let data = await getTestData()
    console.log(data)
    chart = (new sectionChart(chartdom.value, {
        pointData: data.pointData,
        thicknessData: data.thicknessData,
        lineData: data.lineData
    }))
    chart.initBaseChart()
    chart.initGraphic()


    // watch(() => chart.newDataInfo, (e) => {
    //     // console.log('new value!', e)
    //     // thicknessData.value = e.thicknessData.map(item => keepFloat2(item))
    //     // xzData.value = e.pointData.map(item => keepFloat2(item))

    //     console.log(e.thicknessData)
    //     thicknessData.value = e.thicknessData.sort((a, b) => b - a)
    //     xzData.value = e.pointData.sort((a, b) => a[0] - b[0])
    // }, {
    //     deep: true
    // })
}
const resultMapInit = async () => {
    resultMap = await initPureScratchMap(mapRef.value)
    resultMap.resize()
    attachBaseLayer(resultMap)
    let interval = addHighLightSectionLayer(resultMap, sectionGeojson)
    mapFlyToRiver(resultMap)
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


    // const color0 = [
    //     "interpolate",
    //     [
    //         "linear"
    //     ],
    //     [
    //         "line-progress"
    //     ],
    //     0,
    //     "#fa8970",
    //     0.1,
    //     "#fd7457",
    //     0.2,
    //     "#ff5c3e",
    //     0.3,
    //     "#ff0000",
    //     0.4,
    //     "#ff0000",
    //     0.5,
    //     "#ff0000",
    //     0.6,
    //     "#ff0000",
    //     0.7,
    //     "#ff0000",
    //     0.8,
    //     "#ff5c3e",
    //     0.9,
    //     "#fd7457",
    //     1.0,
    //     "#fa8970",
    // ]


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



onMounted(async () => {



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

                div.warn-status-container {
                    position: absolute;
                    right: 32vw;
                    top: 3vh;
                    width: 14vw;
                    height: 10vh;

                    background-color: #5a65fdd5;
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
                    width: 5vw;
                    height: 20vh;
                    background-color: rgb(160, 209, 247);
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
                    }

                    .pallete-container {
                        position: relative;
                        height: 200px;
                        width: 50px;
                        // border: 1px solid #000;

                        .pallete {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;

                            .color-section {
                                width: 100%;

                                &.green {
                                    height: 27%;
                                    background-color: green;
                                }

                                &.orange {
                                    height: 13%;
                                    background-color: orange;
                                }

                                &.red {
                                    height: 60%;
                                    background-color: red;
                                }
                            }
                        }

                        .pointer {
                            position: absolute;
                            transition: .3s ease-in-out;
                            left: -20px;
                            width: 0;
                            height: 0;
                            border-top: 10px solid transparent;
                            border-bottom: 10px solid transparent;
                            border-left: 20px solid black;
                            /* 向右指的三角形 */
                        }




                    }







                }


            }
        }
    }
}
</style>
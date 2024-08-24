<template>
    <div class="risk-warning-3">
        <ModelTitleVue :ModelName="'风险预警模型'" v-on:confirm-bank="confirmBankHandler" />
        <div class="flex-row main">
            <div class="left-container one-center">
                <div class="pannel parameters">
                    <div class="title"><span style="margin-left: 1vw;"></span>模型基本参数</div>
                    <div class="content flex-coloum" style="justify-content: space-evenly;">
                        <div class="parameter-card">
                            <div class="title flex-row between">
                                <span><span style="margin-left: 1vw;"></span>土壤参数</span>
                                <el-tag type="success" style="margin-right: 1vw;"
                                    v-if="basicParams['hs'] && basicParams['hc']">已录入</el-tag>
                                <el-tag type="primary" style="margin-right: 1vw;" v-else>待录入</el-tag>
                            </div>
                            <div class="content flex-coloum" style="justify-content: space-evenly; align-items: center;">
                                <div class="key-value">
                                    <div class="key">下伏沙土层厚度</div>
                                    <div class="value flex-row" style="margin-left: .5vw">
                                        <input type="number" name="" :step="0.0001" v-model="basicParams['hs']"><span
                                            style="width: 1.5vw; padding-left: .3vw;">m</span>
                                    </div>
                                </div>
                                <div class="key-value">
                                    <div class="key">上覆粘土层厚度</div>
                                    <div class="value flex-row" style="margin-left: .5vw">
                                        <input type="number" name="" :step="0.0001" v-model="basicParams['hc']"><span
                                            style="width: 1.5vw; padding-left: .3vw;">m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="parameter-card">
                            <div class="title flex-row between">
                                <span><span style="margin-left: 1vw;"></span>地质工程参数</span>
                                <el-tag type="success" style="margin-right: 1vw;"
                                    v-if="basicParams['protection-level'] && basicParams['control-level']">已录入</el-tag>
                                <el-tag type="primary" style="margin-right: 1vw;" v-else>待录入</el-tag>
                            </div>


                            <div class="content flex-coloum" style="justify-content: space-evenly; align-items: center;">
                                <div class="key-value">
                                    <div class="key">岸坡护岸程度</div>
                                    <div class="value">
                                        <el-select style="width: 6.5vw; height: 3.5vh" @change=""
                                            v-model="basicParams['protection-level']">
                                            <el-option v-for="(item, index ) in PROTECTION_VALUE" :key="index"
                                                :label="PROTECTION_LEVEL[index]" :value="item">
                                                <div style="text-align: center;">{{ PROTECTION_LEVEL[index] }}</div>
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="key-value">
                                    <div class="key">突加荷载指标</div>
                                    <div class="value">
                                        <el-select style="width: 6.5vw; height: 3.5vh" @change=""
                                            v-model="basicParams['control-level']">
                                            <el-option v-for="(item, index ) in CONTROL_VALUE" :key="index"
                                                :label="CONTROL_LEVEL[index]" :value="item">
                                                <div style="text-align: center;">{{ CONTROL_LEVEL[index] }}</div>
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="parameter-card">
                            <div class="title flex-row between">
                                <span><span style="margin-left: 1vw;"></span>地形参数</span>
                                <el-tag type="success" style="margin-right: 1vw;"
                                    v-if="basicParams['bench-id'] && basicParams['ref-id']">已录入</el-tag>
                                <el-tag type="primary" style="margin-right: 1vw;" v-else>待录入</el-tag>
                            </div>
                            <div class="content flex-coloum" style="justify-content: space-evenly; align-items: center;">
                                <div class="key-value">
                                    <div class="key">冲淤起算地形</div>
                                    <el-select style="width: 6.5vw; height: 3.5vh" v-model="basicParams['bench-id']"
                                        value-key="name">
                                        <el-option v-for="(item, index) in demResources" :key="index" :value="item"
                                            :label="item.name + '地形'">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="key-value">
                                    <div class="key">判别计算地形</div>
                                    <el-select style="width: 6.5vw; height: 3.5vh" v-model="basicParams['ref-id']"
                                        value-key="name">
                                        <el-option v-for="(item, index ) in demResources" :key="index" :value="item"
                                            :label="item.name + '地形'">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </div>

                        <div class="parameter-card">
                            <div class="title flex-row between">
                                <span><span style="margin-left: 1vw;"></span>水文参数</span>
                                <el-tag type="success" style="margin-right: 1vw;"
                                    v-if="basicParams['water-qs'] && basicParams['tidal-level']">已录入</el-tag>
                                <el-tag type="primary" style="margin-right: 1vw;" v-else>待录入</el-tag>
                            </div>
                            <div class="content flex-coloum" style="justify-content: space-evenly; align-items: center;">
                                <div class="key-value">
                                    <div class="key">流量</div>
                                    <div class="value flex-row">
                                        <input type="number" name="" v-model="basicParams['water-qs']"><span
                                            style="width: 1.5vw; padding-left: .5vw;">m³/s</span>
                                    </div>
                                </div>
                                <div class="key-value">
                                    <div class="key">潮差</div>
                                    <div class="value flex-row">
                                        <input type="number" name="" :step="0.001"
                                            v-model="basicParams['tidal-level']"><span
                                            style="width: 1.5vw; padding-left: .5vw;">m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="parameter-card">
                            <div class="title flex-row between">
                                <span><span style="margin-left: 1vw;"></span>断面几何参数</span>
                                <el-tag type="success" style="margin-right: 1vw;"
                                    v-if="basicParams['section-geometry']">已录入</el-tag>
                                <el-tag type="primary" style="margin-right: 1vw;" v-else>待录入</el-tag>
                            </div>
                            <div class="content flex-row" style="justify-content: space-evenly; align-items: center;">
                                <div class="button one-center">文件上传</div>
                                <div class="button one-center" @click="mapInputVisible = true">地图绘制</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="middle-container one-center">
                <div class="pannel weights">
                    <div class="title"><span style="margin-left: 1vw;"></span>风险阈值和指标权重</div>
                    <div class="content flex-coloum">
                        <ThresholdForm ref="thresholdFormRef" />
                        <div class="" style="height: 20vh;width: 100%; flex-grow:1;">
                            <div id="weight-chart" ref="weightChartRef"
                                style="height: 100%; width: 100%; background-color: aliceblue;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-container one-center">
                <div class="pannel results">
                    <div class="title"><span style="margin-left: 1vw;"></span>模型运行</div>
                    <div class="content">

                        <div class="top-block one-center">
                            <div class="card" style="width:23vw; height:23vh">
                                <div class="title"><span style="margin-left: 1vw;"></span>模型运行状态</div>
                                <div class="content flex-coloum">
                                    <div class="flex-row"
                                        style="justify-content: space-between; align-items: center; height:4vh;width:90%">
                                        <div class="flex-row">
                                            <div class="status">状态</div>
                                            <div class="statustext">{{ statusText[modelStatus] }}</div>
                                        </div>
                                        <div class="button one-center" style="width:5vw; height:4vh">运行模型</div>
                                    </div>
                                    <div style="width:90%;height:4vh;margin-top:4vh">
                                        <el-progress :percentage="modelRunnningProgress" :stroke-width="27" striped
                                            striped-flow :duration="25" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bottom-block one-center">
                            <div class="card" style="width:23vw; height:52vh">
                                <div class="title"><span style="margin-left: 1vw;"></span>模型运行结果</div>
                                <div class="content flex-coloum">
                                    <div class="flex-row">
                                        <div class="keyValue flex-coloum" style="margin-top: .2vh;">
                                            <div class="key">风险计算结果</div>
                                            <div class="value">3.14159</div>
                                        </div>
                                        <div class="keyValue flex-coloum" style="margin-top: .2vh;">
                                            <div class="key">评估断面状态</div>
                                            <div class="value" style="font-weight: 800;font-size: calc(0.6vw + 0.7vh);">高风险
                                            </div>
                                        </div>
                                    </div>
                                    <div id="result-chart" ref="chartRef"
                                        style="width: 100%;flex-grow: 1;background-color: aliceblue;">

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <el-dialog v-model="mapInputVisible" title="基于地图绘制断面" width="41.5vw">
        <div class="main-content">
            <sectionDraw ref="sectionDrawRef" v-on:section-draw="sectionDrawHandler" :demResources="demResources"
                :demListShow=false>
            </sectionDraw>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="mapInputVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmSectionDraw">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import ModelTitleVue from '../ModelTitle.vue'
import { onMounted, onUnmounted, reactive, ref, toRaw } from 'vue'
import sectionDraw from '../soilAnalysis/sectionDraw.vue'
import ThresholdForm from '../riskWarn/ThresholdForm.vue'
import * as echarts from 'echarts';
import { useMapStore } from '../../../store/mapStore'
import { ElNotification } from 'element-plus'
import axios from 'axios'

/////////////// global
const mapStore = useMapStore()

/////////////// 初始 断面选择
const bankEnName = {
    '民主沙': 'Mzs'
}
const demResources = ref([])
const selectedBank = ref('')
const confirmBankHandler = async (bankName) => {
    const _demResource = await getDemResource()
    console.log('demdata', _demResource)
    demResources.value = _demResource
    selectedBank.value = bankName
    ElNotification({
        type: 'success',
        title: '选择岸段',
        message: `已选择岸段——${bankName},模型计算将默认采用${bankName}相关资源`,
        offset: 180
    })
}
const getDemResource = async () => {
    // const ogSource = (await axios.get(`/temp/dataNode/bank/dataType?dataType=DEM&bank=${bankEnName[selectedBank.value]}`)).data
    const ogSource = t
    const _demRes = []
    for (let i = 0; i < ogSource.length; i++) {
        const year = ogSource[i]['year']
        const sets = ogSource[i]['sets']
        for (let j = 0; j < sets.length; j++) {
            const set = sets[j]
            for (let k = 0; k < set['list'].length; k++) {
                const item = set['list'][k]
                const demResourceNode = {
                    year: year,
                    name: item['name'],
                    fileType: item['fileType'],
                    path: item['path'],
                    month: item['month']
                }
                _demRes.push(demResourceNode)
            }
        }
    }
    return _demRes
}


////////////// 断面绘制
const mapInputVisible = ref(false)
const sectionDrawRef = ref(null)
let sectionGeojson = ref(null)
const sectionDrawHandler = (geojson) => {
    console.log(' i got geojson !!', geojson)
    sectionGeojson.value = geojson
    basicParams['section-geometry'] = geojson
}
const confirmSectionDraw = () => {
    const paramsCheck = () => {
        if (sectionGeojson.value === null) {
            ElNotification({
                type: 'warning',
                message: '请完成断面绘制后确认',
                title: '警告',
                offset: 130
            })
            return false
        }
        return true
    }
    if (paramsCheck()) {
        setTimeout(() => {
            mapInputVisible.value = false
        }, 0);
    }
}



////////////// 基本参数
const basicParams = reactive({
    'hs': 1,
    'hc': 2,
    "protection-level": "low",
    "control-level": "strict",
    "section-geometry": null,
    "bench-id": null,
    "ref-id": null,
    "current-timepoint": "yyyy-mm-dd",
    "comparison-timepoint": "yyyy-mm-dd",
    "water-qs": 93000,
    "tidal-level": 1.5,
    "risk-thresholds": "NONE"
})
//岸坡护岸程度
const PROTECTION_LEVEL = ['系统防护', '一般防护', '较弱防护', '无防护']
const PROTECTION_VALUE = ["systemic", "normal", "low", "no"]
//突加荷载指标
const CONTROL_LEVEL = ['严格控制', '一般控制', '宽松控制', '无控制']
const CONTROL_VALUE = ["strict", "normal", "loose", "no"]

// 阈值 \ 权重
const thresholdFormRef = ref(null)
const getThresholdParams = () => {
    return toRaw(thresholdFormRef.value.thresholdParmas)
}
const isParamsReady = () => {
    for (let key in basicParams) {
        if (basicParams[key] === null || basicParams[key] === '' || basicParams[key] === undefined) {
            return false
        }
    }
    return true
}



///////////// 权重图
const weightChartRef = ref(null)
let weightChartIns = null
const drawWeightChart = () => {
    let option = {
        tooltip: {
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                selectedMode: 'single',
                center: ['50%', '90%'],
                radius: [0, '80%'],
                startAngle: 180,
                endAngle: 360,
                label: {
                    position: 'inner',
                    fontSize: 14
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 1548, name: 'Search Engine' },
                    { value: 775, name: 'Direct' },
                    { value: 679, name: 'Marketing', selected: false }
                ]
            },
            {
                name: 'Access From',
                type: 'pie',
                center: ['50%', '90%'],
                radius: ['100%', '140%'],
                startAngle: 180,
                endAngle: 360,
                labelLine: {
                    length: 30,
                },
                // label: {
                //     formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                //     backgroundColor: '#F6F8FC',
                //     borderColor: '#8C8D8E',
                //     borderWidth: 1,
                //     borderRadius: 4,
                //     rich: {
                //         a: {
                //             color: '#6E7079',
                //             lineHeight: 22,
                //             align: 'center'
                //         },
                //         hr: {
                //             borderColor: '#8C8D8E',
                //             width: '100%',
                //             borderWidth: 1,
                //             height: 0
                //         },
                //         b: {
                //             color: '#4C5058',
                //             fontSize: 14,
                //             fontWeight: 'bold',
                //             lineHeight: 33
                //         },
                //         per: {
                //             color: '#fff',
                //             backgroundColor: '#4C5058',
                //             padding: [3, 4],
                //             borderRadius: 4
                //         }
                //     }
                // },
                data: [
                    { value: 1048, name: 'Baidu' },
                    { value: 335, name: 'Direct' },
                    { value: 310, name: 'Email' },
                    { value: 251, name: 'Google' },
                    { value: 234, name: 'Union Ads' },
                    { value: 147, name: 'Bing' },
                    { value: 135, name: 'Video Ads' },
                    { value: 102, name: 'Others' }
                ]
            }
        ]
    };
    weightChartIns.setOption(option)
}




///////////// 模型和参数状态
const modelStatus = ref(0) // 0: 未运行 1: 运行中 2: 运行完成 3: 运行失败
const statusText = ['参数配置中', '待运行', '运行中', '运行成功', '运行失败']
const modelRunnningProgress = ref(50)

///////////// 多指标模型
const run = async () => {
    console.log('run model')

    /// parameters prepare
    const weightandthreshold = getThresholdParams()
    const _basicParams = toRaw(basicParams)
    const comparisonTimepoint = _basicParams['ref-id'].year + '-' + _basicParams['ref-id'].month + '-' + '01'
    const currentTimepoint = _basicParams['bench-id'].year + '-' + _basicParams['bench-id'].month + '-' + '01'
    _basicParams['ref-id'] = _basicParams['ref-id'].path
    _basicParams['bench-id'] = _basicParams['bench-id'].path
    _basicParams['comparison-timepoint'] = comparisonTimepoint
    _basicParams['current-timepoint'] = currentTimepoint

    const requestBody = {
        segment: bankEnName[selectedBank.value],
        set: 'standard',
        ..._basicParams,
        "wRE": weightandthreshold['wRE'],
        "wNM": weightandthreshold['wNM'],
        "wGE": weightandthreshold['wGE'],
        "wRL": weightandthreshold['wRL'],
        "risk-thresholds": {
            "Dsed": weightandthreshold['Dsed'],
            "Zb": weightandthreshold['Zb'],
            "Sa": weightandthreshold['Sa'],
            "Ln": weightandthreshold['Ln'],
            "PQ": weightandthreshold['PQ'],
            "Ky": weightandthreshold['Ky'],
            "Zd": weightandthreshold['Zd'],
            "all": weightandthreshold['all']
        }
    }
    console.log(requestBody)

    const resultParse = async (res) => {
        const riskLevelDesc = (vec4) => {
            let riskLevelIndex
            for (let i = 0; i < vec4.length; i++)
                if (vec4[i] === 1) { riskLevelIndex = i; break; }
            const dict = ['低风险', '较低风险', '较高风险', '高风险']
            return dict[riskLevelIndex]
        }
        // const subIndicatorInfo = res['multi-indicator-ids']
        let subIndicatorInfo = {}
        for (let key in res['multi-indicator-ids']) {
            let indicator = key
            let indicatorTaskId = res['multi-indicator-ids'][key]
            const result = await axios.get(`/temp/taskNode/result/id?taskId=${indicatorTaskId}`)
            console.log('indicator::', indicator)
            console.log('result::', result.data)
            const indicatorRiskLevel = result.data['risk-level']
            subIndicatorInfo[indicator] = indicatorRiskLevel
        }


        return {
            riskLevelNumber: res['result'],
            riskLevelDescription: riskLevelDesc(res['risk-level']),
            ...subIndicatorInfo
        }
    }


    const rrr = async () => {
        const modelUrl = '/temp/taskNode/start/multipleIndicators/calculateRiskLevel'

        const TASK_ID = (await axios.post(modelUrl, requestBody)).data

        console.log('TASK_ID', TASK_ID)
        const interval = setInterval(async () => {
            const status = (await axios.get('/temp/taskNode/status/id?taskId=' + TASK_ID)).data
            console.log('status', status)
            switch (status) {
                case 'RUNNING':
                    break
                case 'COMPLETE':
                    clearInterval(interval)
                    const result = await axios.get(`/temp/taskNode/result/id?taskId=${TASK_ID}`)
                    console.log('result', result.data)

                    const modelResult = await resultParse(result.data)
                    drawChartFromResult(modelResult)

                    ElNotification({
                        type: 'success',
                        message: '成功',
                        title: '成功',
                        offset: 130
                    })
                    break
                case 'ERROR':
                    clearInterval(interval)
                    const err = await axios.get(`/temp/taskNode/result/id?taskId=${TASK_ID}`)
                    console.log('err result', err)
                    // ModelRunningShow.value = false
                    // ModelRunningMessage.value = ''
                    ElNotification({
                        type: 'error',
                        message: '失败,\n' + err.data,
                        title: '错误',
                        offset: 130
                    })
                    break
            }
        }, 1000)

    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'r') {
            // rrr()
            drawChartFromResult({})

        }
    })
}






/////////////// 雷达图
const chartRef = ref(null)
let chartIns = null
const baseIndicators = ['Zb', 'Sa', 'Ln', 'PQ', 'Ky', 'Zd', 'Dsed', 'PL', 'LC']
const IndicatorNameMap = {
    'Zb': '滩槽高差指标',
    'Sa': '岸坡坡比指标',
    'Ln': '近岸冲刷指标',

    'PQ': '造床流量指标',
    'Ky': '抗冲流速指标',
    'Zd': '水位变幅指标',

    'Dsed': '土体组成指标',
    'PL': '岸坡防护指标',
    'LC': '荷载控制指标'
}

const drawChartBase = () => {
    let basicOption = {
        title: {
            text: '多指标风险预警结果图'
        },
        legend: {},
        tooltip: {},
        radar: {
            indicator: baseIndicators.map(name => ({ name: IndicatorNameMap[name], max: 1 })),
            radius: 120,
            startAngle: 90,
            splitNumber: 4,
            // shape: 'circle',
            axisName: {
                formatter: '【{value}】',
                color: '#00478d'
            },
            splitArea: {
                areaStyle: {
                    // color: ['#ffffff', '#ccf4ff', '#ffffff', '#ccf4ff'],
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                    shadowBlur: 10
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(211, 253, 250, 0.8)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(211, 253, 250, 0.8)'
                }
            }
        }
    }
    chartIns.setOption(basicOption)
    window.addEventListener('resize', function () {
        chartIns.resize();
    });
}

const drawChartFromResult = (result) => {
    let radarValues = []
    for (let i = 0; i < baseIndicators.length; i++) {
        const indicator = baseIndicators[i]
        radarValues[i] = result[indicator]
    }
    radarValues = [0.5, 0.5, 0.75, 0.25, 0.5, 0.75, 0.75, 0.5, 0.5]

    let centerColor = ''
    const centerColorMap = {
        '低风险': '#00FF00',
        '较低风险': '#FFFF00',
        '较高风险': '#FFA500',
        '高风险': '#FF0000'
    }
    result.riskLevelDescription = '高风险'
    centerColor = centerColorMap[result.riskLevelDescription]

    let addedOption = {
        series: [
            {
                name: '多指标风险预警结果',
                type: 'radar',
                data: [
                    {
                        value: radarValues,
                        areaStyle: {
                            color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [
                                {
                                    color: centerColorMap[result.riskLevelDescription] + '99',
                                    offset: 0
                                },
                                {
                                    color: centerColorMap[result.riskLevelDescription] + 'FF',
                                    offset: 1
                                }
                            ])
                        }
                    }
                ]
            }
        ]
    }
    chartIns.setOption(addedOption)
}



////////////// life cycle
onMounted(() => {

    weightChartIns = echarts.init(weightChartRef.value)
    chartIns = echarts.init(chartRef.value)

    setTimeout(() => {
        drawWeightChart()
        drawChartBase()
        drawChartFromResult({})
    }, 1000);


    window.addEventListener('keydown', e => {
        if (e.key === 'v') {
            drawChartFromResult({})
        }
        if (e.key === 'b') {
            drawWeightChart()
        }
    })


})
onUnmounted(() => {

})




const t = [
    {
        "year": "1999",
        "sets": [
            {
                "list": [
                    {
                        "name": "199901",
                        "temp": "",
                        "fileType": "tiff",
                        "path": "tiff/Mzs/1999/standard/199901/199901.tif"
                    }
                ],
                "name": "standard"
            }
        ]
    },
    {
        "year": "2012",
        "sets": [
            {
                "list": [
                    {
                        "name": "201210",
                        "temp": "",
                        "fileType": "tiff",
                        "path": "tiff/Mzs/2012/standard/201210/201210.tif"
                    }
                ],
                "name": "standard"
            }
        ]
    },
    {
        "year": "2016",
        "sets": [
            {
                "list": [
                    {
                        "name": "201610",
                        "temp": "",
                        "fileType": "tiff",
                        "path": "tiff/Mzs/2016/standard/201610/201610.tif"
                    }
                ],
                "name": "standard"
            }
        ]
    },
    {
        "year": "2019",
        "sets": [
            {
                "list": [
                    {
                        "name": "201904",
                        "temp": "",
                        "fileType": "tiff",
                        "path": "tiff/Mzs/2019/standard/201904/201904.tif"
                    }
                ],
                "name": "standard"
            }
        ]
    },
    {
        "year": "2023",
        "sets": [
            {
                "list": [
                    {
                        "name": "202304",
                        "temp": "",
                        "fileType": "tiff",
                        "path": "tiff/Mzs/2023/standard/202304/202304.tif"
                    }
                ],
                "name": "standard"
            }
        ]
    }
]
</script>

<style lang="scss" scoped>
div.flex-coloum {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &.evenly {
        justify-content: space-evenly;
        align-items: center;
    }
}

div.flex-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    &.between {
        justify-content: space-between;
        align-items: center;
    }
}

div.one-center {
    position: relative;
    display: grid;
    place-items: center;
}

div.pannel {
    position: relative;
    width: 98%;
    height: 97%;
    border-radius: 3px;

    &.parameters {}

    &.weights {}

    &.results {}

    .title {
        position: relative;
        width: 100%;
        height: 5vh;
        line-height: 5vh;
        background-color: rgb(15, 75, 116);
        color: white;
        font-size: calc(0.8vw + 1vh);
        font-weight: 700;
    }

    .content {
        position: relative;
        width: 100%;
        height: calc(100% - 5vh);
        background-color: rgb(217, 237, 255);
    }



}

div.parameter-card {
    position: relative;
    box-shadow: rgba(0, 72, 131, 0.2) 5px 5px, rgba(0, 72, 131, 0.1) 10px 10px, rgba(0, 72, 131, 0.05) 15px 15px;
    display: flex;
    flex-direction: column;
    width: 18vw;
    margin: 1vh 1vw;

    .title {
        position: relative;
        width: 100%;
        height: 3.5vh;
        line-height: 3.5vh;
        background-color: rgb(39, 113, 161);
        color: white;
        font-size: calc(0.7vw + 0.8vh);
        font-weight: 700;
    }

    .content {
        position: relative;
        width: 100%;
        flex-grow: 1;
        background-color: rgb(211, 232, 250);



        div.key-value {
            padding-top: .5vh;
            padding-left: 1vw;
            padding-right: 1vw;
            padding-bottom: .5vh;
            display: flex;
            flex-direction: row;
            height: 4vh;
            justify-content: center;
            align-items: center;

            div.key {
                border: none !important;
                border-right: 2px solid rgb(2, 143, 199) !important;
                border-bottom: 1px solid rgb(5, 88, 121) !important;
                border-radius: 0px;
                text-align: center;
                height: 3vh;
                line-height: 3vh;
                width: 7vw;
                background-color: rgb(255, 255, 255);

                padding: 0px 10px;
                display: grid;
                place-items: center;
                font-size: calc(0.6vw + 0.7vh);
                transition: .3s ease-in-out;
                margin-right: .5vw;

            }

            div.value {

                div {}

                input {
                    height: 2.8vh;
                    width: 4vw;

                    border: none !important;
                    border-right: 2px solid rgb(2, 143, 199) !important;
                    border-bottom: 1px solid rgb(5, 88, 121) !important;
                    border-radius: 5px;
                    text-align: center;
                    background-color: rgb(170, 224, 255);

                    display: grid;
                    place-items: center;
                    font-size: calc(0.6vw + 0.4vh);
                    transition: .3s ease-in-out;

                    // &:hover {
                    //     background-color: rgb(44, 61, 212);
                    //     color: white;
                    //     font-weight: bold;
                    // }
                    &:focus {
                        background-color: rgb(0, 162, 236);
                        color: white;
                        font-weight: bold;
                    }
                }
            }


        }

        div.button {
            width: 6vw;
            height: 3.8vh;
            border-right: 2px solid rgb(2, 143, 199);
            border-bottom: 3px solid rgb(87, 179, 216);
            border-left: 2px solid rgb(1, 165, 230);
            border-radius: 3px;
            transition: .1s ease-in-out;
            cursor: pointer;
            font-size: calc(0.6vw + 0.6vh);
            font-weight: 700;

            color: rgb(23, 87, 112);
            text-shadow: 0px 0px 5px #b4f1f1;
            background-color: #b8e9ff;

            margin: 1vh 1vw;

            &:hover {
                color: rgb(19, 69, 88);
                background-color: #dff5ff;
            }
        }
    }

}

.keyValue {
    position: relative;
    justify-content: center;
    align-items: center;
    width: 10vw;
    height: 10vh;

    .key {
        height: 4vh;
        width: 8vw;
        display: grid;
        place-items: center;
        font-size: calc(0.6vw + 0.7vh);
        transition: .3s ease-in-out;
        border-right: 2px solid rgb(2, 143, 199);
        border-bottom: 1px solid rgb(5, 88, 121);
        border-radius: 5px;
        background-color: rgb(44, 61, 212);
        font-weight: bold;
        color: white;
    }

    .value {
        position: relative;
        height: 4vh;
        width: 8vw;
        // flex: 1;
        // border: 1px solid rgb(201, 201, 201);
        border: none !important;
        border-right: 2px solid rgb(2, 143, 199) !important;
        border-bottom: 1px solid rgb(5, 88, 121) !important;
        border-radius: 5px;
        text-align: center;

        display: grid;
        place-items: center;
        font-size: calc(0.6vw + 0.5vh);
        transition: .3s ease-in-out;

        &:nth-child(even) {
            color: rgb(44, 61, 212);
            background-color: #ffffff;
        }

        &:nth-child(odd) {
            color: white;
            background-color: rgba(44, 61, 212, 0.527);
        }

        &.head {
            background-color: #0e14cf;
            font-size: calc(0.4vw + 0.3vh);
        }

    }
}

.risk-warning-3 {
    position: relative;
    width: 100vw;
    height: 92vh;
    background: linear-gradient(90deg, rgb(91, 219, 209), rgb(35, 119, 247));
    user-select: none;

    .main {
        position: relative;
        width: 100vw;
        height: 87vh;

        .left-container {
            position: relative;
            width: 23vw;
            height: 88vh;
        }

        .middle-container {
            position: relative;
            width: 52vw;
            height: 88vh;
        }

        .right-container {
            position: relative;
            width: 25vw;
            height: 88vh;

            .pannel {
                .content {
                    div.top-block {
                        position: relative;
                        width: 100%;
                        height: 30%;

                        .status {
                            font-size: calc(0.6vw + 0.7vh);
                            font-weight: 700;
                            padding: .6vh .5vw;
                            margin-right: .3vw;
                            font-size: calc(0.6vw + 0.7vh);
                            border-radius: 5px;
                            color: rgb(228, 247, 255);
                            background-color: rgb(41, 113, 157);

                        }

                        .statustext {
                            padding: .6vh .5vw;
                            font-weight: 400;
                            font-size: calc(0.6vw + 0.7vh);
                            border-radius: 5px;
                            color: rgb(41, 113, 157);
                            background-color: rgb(234, 246, 253);
                            border-right: 2px solid rgb(2, 143, 199);
                            border-bottom: 1px solid rgb(5, 88, 121);
                        }


                    }

                    div.bottom-block {

                        position: relative;
                        width: 100%;
                        height: 70%;
                    }

                    div.card {
                        margin: 1vh .5vw;
                        position: relative;
                        border-radius: 3px;
                        box-shadow: rgba(0, 72, 131, 0.2) 5px 5px, rgba(0, 72, 131, 0.1) 10px 10px, rgba(0, 72, 131, 0.05) 15px 15px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        div.title {
                            position: relative;
                            font-size: calc(0.6vw + 0.8vh);
                            width: 100%;
                            height: 3.8vh;
                            line-height: 3.8vh;
                            background-color: rgb(40, 113, 159);
                            color: white;
                            font-size: calc(0.7vw + 0.8vh);
                            font-weight: 700;
                        }

                        div.content {
                            position: relative;
                            width: 100%;
                            height: calc(100% - 3vh);
                            background-color: rgb(183, 215, 245);


                            div.button {

                                border-right: 2px solid rgb(2, 143, 199);
                                border-bottom: 3px solid rgb(87, 179, 216);
                                border-left: 2px solid rgb(1, 165, 230);
                                border-radius: 3px;
                                transition: .1s ease-in-out;
                                cursor: pointer;
                                font-size: calc(0.6vw + 0.6vh);
                                font-weight: 700;

                                color: rgb(23, 87, 112);
                                text-shadow: 0px 0px 5px #b4f1f1;
                                background-color: #b8e9ff;

                                margin: 1vh 1vw;
                                margin-right: .5vw;

                                &:hover {
                                    color: rgb(19, 69, 88);
                                    background-color: #dff5ff;
                                }
                            }
                        }

                    }
                }
            }
        }
    }



}

div.main-content {
    position: relative;
    width: 40vw;
    height: 50vh;
    background-color: red;

    div.map-container {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: hsl(194, 69%, 91%);
    }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

input[type="number"] {
    -moz-appearance: textfield;
}</style>
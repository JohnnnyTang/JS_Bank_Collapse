<template>
    <div class="riskWarning-container">
        <ModelTitleVue :ModelName="'风险预警模型'" v-on:confirm-bank="confirmBankHandler" />
        <div class="model-content-container flex-coloum">
            <div class="top-block one-center">
                <div class="pannel basic-param-block">
                    <div class="title">基本参数配置</div>
                    <div class="content flex-row" style="justify-content: space-evenly; align-items: center;">
                        <div class="card soil">
                            <div class="content flex-coloum" style="justify-content: space-evenly; align-items: center;">
                                <div class="key-value">
                                    <div class="key">下伏沙土层厚度</div>
                                    <div class="value">
                                        <input type="number" name="" v-model="basicParams['hs']">
                                    </div>
                                </div>
                                <div class="key-value">
                                    <div class="key">上覆粘土层厚度</div>
                                    <div class="value">
                                        <input type="number" name="" v-model="basicParams['hc']">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card level">
                            <div class="content flex-coloum"
                                style="justify-content: space-evenly; align-items: center;background-color: #a86a18;">
                                <div class="key-value">
                                    <div class="key">岸坡护岸程度：</div>
                                    <div class="value">
                                        <el-select style="width: 6vw; height: 3.5vh" @change=""
                                            v-model="basicParams['protection-level']">
                                            <el-option v-for="(item, index ) in PROTECTION_VALUE" :key="index"
                                                :label="PROTECTION_LEVEL[index]" :value="item">
                                                <div style="text-align: center;">{{ PROTECTION_LEVEL[index] }}</div>
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="key-value">
                                    <div class="key">突加荷载指标：</div>
                                    <div class="value">
                                        <el-select style="width: 6vw; height: 3.5vh" @change=""
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
                        <div class="card terrain">
                            <div class="content">
                                <div class="key-value">
                                    <div class="key">冲淤起算地形</div>
                                    <el-select style="width: 8vw; height: 3.5vh" v-model="basicParams['bench-id']"
                                        value-key="name">
                                        <el-option v-for="(item, index) in demResources" :key="index" :value="item"
                                            :label="item.name + '地形'">
                                        </el-option>
                                    </el-select>
                                </div>

                                <div class="key-value">
                                    <div class="key">判别计算地形</div>
                                    <el-select style="width: 8vw; height: 3.5vh" v-model="basicParams['ref-id']"
                                        value-key="name">
                                        <el-option v-for="(item, index ) in demResources" :key="index" :value="item"
                                            :label="item.name + '地形'">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </div>
                        <div class="card hydro">
                            <div class="content">
                                <div class="key-value">
                                    <div class="key">流量</div>
                                    <div class="value">
                                        <input type="number" name="" v-model="basicParams['water-qs']">
                                    </div>
                                </div>
                                <div class="key-value">
                                    <div class="key">潮差</div>
                                    <div class="value">
                                        <input type="number" name="" v-model="basicParams['tidal-level']">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card section" style="flex-direction: row;">
                            <div class="content">
                                <div class="key-value" style="height: fit-content;">
                                    <div class="key" style="height: 7vh;">断面<br>录入</div>
                                    <div class="value">
                                        <div class="button one-center">文件上传</div>
                                        <div class="button one-center" @click="mapInputVisible = true">地图绘制</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bot-block flex-row">

                <div class="left-block one-center">

                    <div class="pannel table-block">
                        <div class="title">各指标阈值和权重配置</div>
                        <div class="content">
                            <ThresholdForm ref="thresholdFormRef"></ThresholdForm>
                        </div>
                    </div>
                </div>

                <div class="right-block one-center">
                    <div class="pannel result-block">
                        <div class="title">风险预警结果</div>
                        <div class="content">
                            <div style="background-color: aqua; padding: 5px 10px;" @click="run">click</div>
                            <div class="chart" ref="chartRef" style="width: 27vw; height: 45vh; background-color: #ffffff;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <el-dialog v-model="mapInputVisible" title="地图选择" width="41.5vw">
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
import { useMultiIndexStore } from '@/store/multiIndexStore'
import { onMounted, onUnmounted, reactive, ref, toRaw } from 'vue'
import ModelTitleVue from '../ModelTitle.vue'
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



// lifecycle
onMounted(() => {

    chartIns = echarts.init(chartRef.value)
    drawChartBase()

    window.addEventListener('keydown', e => {
        if (e.key === 'v') {
            drawChartFromResult({})
        }
    })


})
onUnmounted(() => {

})
// helpers
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

const temp = {
    "result": "0.33109999999999995",
    "risk-level": [
        0,
        1,
        0,
        0
    ],
    "multi-indicator-ids": {
        "Dsed": "2fa0a81f9171b89f2ffb056f976f2589",
        "Ky": "451c43cc47576dae2b2ebe2c76c63e86",
        "LC": "2fb85e3ca4979508b36c5df5bf7c5cc9",
        "Ln": "4c8b1a3bb99c234be4896b67277a3883",
        "PL": "d3715a2bd5d4337f1665533a9d00851e",
        "PQ": "60faa002df2d512c8ad951c33ae63f29",
        "Sa": "009b2b1b965c353fb30ff7e305a6221f",
        "Zb": "8edf72633030280aa13ed020a73d67ac",
        "Zd": "f743bfa3ba3586651dd821c60a36b02f"
    },
    "case-id": "76be26d927aeac8b28fbb4d35b5866b5",
    "model": "Risk Level"
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

div.button {
    width: 4.5vw;
    height: 3.8vh;
    border-right: 2px solid rgb(2, 143, 199);
    border-bottom: 2px solid rgb(87, 179, 216);
    border-radius: 3px;
    transition: .1s ease-in-out;
    cursor: pointer;
    font-size: calc(0.6vw + 0.6vh);
    font-weight: 700;

    color: rgb(23, 87, 112);
    text-shadow: 0px 0px 5px #b4f1f1;
    background-color: #b8e9ff;

    &:hover {
        color: rgb(19, 69, 88);
        background-color: #ddf4ff;
    }
}

div.card {
    position: relative;
    // width: 99%;
    // height: 97%;
    width: fit-content;
    height: fit-content;
    border-radius: 5px;
    margin: 1vh 1vw;
    padding: 1vh 1vw;
    // margin:0;
    // padding: 0;
    display: flex;
    flex-direction: column;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;

    &.border {
        width: 98%;
        border-top: #05527944 solid 1px;
        border-left: #05527950 solid 1px;
        border-right: #05527952 solid 2px;
        border-bottom: #05527952 solid 2px;
        margin-top: .5vh;
    }

    &.soil {
        // position: absolute;
        // left: 0;
        // top: 0;
        position: relative;
        // width: 15vw;
        // height: 20vh;
    }

    &.level {
        // position: absolute;
        // left: 16vw;
        // top: 0;
        position: relative;

    }

    &.terrain {
        position: relative;
    }

    &.hydro {
        position: relative;
    }

    &.section {
        position: relative;
    }

    div.title {
        position: relative;
        width: 100%;
        // height: 20%;
        height: 4vh;
        line-height: 4vh;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        font-size: calc(0.8vw + 0.9vh);
        font-weight: bold;
        text-align: left;
        // margin-left: 1vw;
        color: #366ec2;
        border-bottom: #364f7ea1 solid 2px;
        // background-color: rgb(243, 243, 243);

    }

    div.content {
        position: relative;
        width: 100%;
        // height: 75%;

        // background-color: antiquewhite;
    }

    div.desc {
        position: relative;
        width: 100%;
        height: 100%;
        font-size: calc(0.6vw + 0.8vh);
        font-weight: 600;
        background-color: #ffffffbb;
        backdrop-filter: blur(20px);
    }
}


div.pannel {

    position: relative;
    border: #030000 solid 1px;
    // padding: calc(0.5vw + 0.3vh);
    // margin: calc(0.5vw + 0.3vh);

    display: flex;
    flex-direction: column;

    div.title {
        position: relative;
        width: 100%;
        // height: 20%;
        height: 4vh;
        line-height: 4vh;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        font-size: calc(0.8vw + 0.9vh);
        font-weight: bold;
        text-align: left;
        // margin-left: 1vw;
        color: #00122e;
        border-bottom: #364f7ea1 solid 2px;
    }

    div.content {
        position: relative;
        flex-grow: 1;
    }


    &.basic-param-block {
        position: relative;
        width: 90vw;
    }

    // &.table-block {
    //     position: relative;
    //     width: 58vw;
    // }

    // &.result-block {
    //     position: relative;
    //     width: 25vw;
    // }

}


div.key-value {

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
        background-color: rgb(255, 255, 255);

        padding: 0px 10px;
        display: grid;
        place-items: center;
        font-size: calc(0.6vw + 0.8vh);
        transition: .3s ease-in-out;
        margin-right: .5vw;

    }

    div.value {

        div {}

        input {
            height: 2.8vh;
            width: 3vw;

            border: none !important;
            border-right: 2px solid rgb(2, 143, 199) !important;
            border-bottom: 1px solid rgb(5, 88, 121) !important;
            border-radius: 5px;
            text-align: center;
            background-color: rgb(212, 213, 255);

            display: grid;
            place-items: center;
            font-size: calc(0.4vw + 0.4vh);
            transition: .3s ease-in-out;

            // &:hover {
            //     background-color: rgb(44, 61, 212);
            //     color: white;
            //     font-weight: bold;
            // }
            &:focus {
                background-color: rgb(3, 4, 95);
                color: white;
                font-weight: bold;
            }
        }
    }


}






@keyframes slideBackgroundColor {
    0% {
        background-position: 0% 0%;
    }

    50% {
        background-position: 100% 100%;
    }

    100% {
        background-position: 0% 0%;
    }
}

div.riskWarning-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100vw;
    height: 92vh;
    overflow: hidden;
    flex-direction: column;
    background: linear-gradient(90deg, rgb(91, 219, 209), rgb(35, 119, 247));
    background-size: 150% 150%;
    animation: slideBackgroundColor 4s ease infinite;

    div.model-content-container {
        width: 95vw;
        height: 92vh;
        overflow: hidden;
        background-color: rgb(235, 235, 235);

        // layout
        .top-block {
            position: relative;
            width: 94.8vw;
            height: 23vh;
            // height: 30%;
            // border: #162d50 solid 1px;
        }

        .bot-block {
            position: relative;
            width: 94.8vw;
            height: 61vh;
            // border: #162d50 solid 1px;
            // height: 70%;

            .left-block {
                position: relative;
                width: 64.5vw;
                height: 60.5vh;

                .form-container {
                    position: relative;
                    width: 50vw;
                    height: 52vh;
                }
            }

            .right-block {
                position: relative;
                width: 30vw;
                height: 60.5vh;
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
}
</style>

<template>
    <div class="stablityAnalysis-container">
        <ModelTitleVue :ModelName="'土体变形分析模型'" v-on:confirm-bank="confirmBankHandler" />
        <div class="model-content-container">
            <div class="model-run-container">

                <div class="loading-container" v-show="ModelRunningShow">
                    <dv-loading class="loading-icon">
                        <div class="loading-message">{{ ModelRunningMessage }}</div>
                    </dv-loading>
                </div>

                <div class="tab-page-container">
                    <div class="model-run-content flex-coloum">
                        <div class="form-block flex-coloum">

                            <div class="detail-bank-profile">
                                <div class="title2">断面详情</div>
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
                                        <div class="row" :class="{ 'not-allow': !sectionInited }" @click="checkInited">
                                            <!-- <div class="cell" v-for="(item, index) in xzData" :key="index">{{
                                                keepFloat2(item[0]) }}</div> -->
                                            <input type="number" class="cell" v-for="( item, index ) in  xzData "
                                                v-model="item[0]" :key="index">
                                        </div>
                                        <div class="row" :class="{ 'not-allow': !sectionInited }" @click="checkInited">
                                            <!-- <div class="cell" v-for="(item, index) in xzData" :key="index">{{
                                                keepFloat2(item[1]) }}</div> -->

                                            <input type="number" class="cell" v-for="( item, index ) in  xzData "
                                                v-model="item[1]" :key="index">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="second-row">
                                <div class="soil-layer-profile flex-coloum">
                                    <div class="title2">土壤分层详情</div>

                                    <div class="content flex-row">
                                        <div class="keyValue flex-row" v-for=" i  in  5 ">
                                            <div class="key">{{ thicknessName[i - 1] }}</div>
                                            <!-- <div class="value">{{ keepFloat2(thicknessData[i - 1]) }}</div> -->
                                            <input type="number" class="value" :key="i" v-model="thicknessData[i - 1]">
                                        </div>
                                    </div>
                                </div>


                                <div class="temp-block">
                                    <div class="title2">潮位参数配置</div>
                                    <div class="content one-center">
                                        <div class="keyValue flex-row">
                                            <div class="key">elevation of Flow</div>
                                            <input type="number" class="value" placeholder="请输入潮位"
                                                v-model="elevationOfFlow">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="right-block flex-coloum">
                                <div class="full-block flex-coloum" style="justify-content: flex-start;">
                                    <div class="title2">断面信息录入</div>
                                    <div class="content flex-coloum"
                                        style="align-items: center; justify-content: space-evenly;">
                                        <el-upload class="upload-demo" :file-list="fileList" :before-upload="beforeUpload"
                                            :on-change="handleChange" :limit="1" :on-exceed="handleExceed"
                                            :http-request="handleRequest" :show-file-list="false">
                                            <div class="button one-center" @click="inputData('file')">
                                                文件导入
                                            </div>
                                        </el-upload>
                                        <div class="button one-center" @click="inputData('map')">
                                            地图绘制
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="chart-block flex-row">
                            <div class="null-desc one-center" v-show="showSkeleton">请录入断面和土壤分层参数信息！</div>
                            <div class="redraw-button one-center" @click="redrawChartClickHandler" v-show="!showSkeleton">
                                重绘图表</div>
                            <div ref="chartdom" id="chart" v-show="!showSkeleton"></div>

                            <div class="right-block flex-coloum">
                                <div class="run-container one-center">
                                    <div class="run-button one-center" @click="BSTEMModelRun">
                                        运行模型
                                    </div>
                                </div>
                                <div class="result-container flex-coloum" style="align-items: center;">
                                    <div class="title2">
                                        模型输出结果
                                    </div>
                                    <div class="content flex-coloum" style="align-items: center; ">
                                        <div class="keyValue flex-coloum" style="margin-top: .2vh;">
                                            <div class="key">剪切出现高程</div>
                                            <!-- <input type="text" class="value" placeholder="请输入潮位" v-model="elevationOfFlow"> -->
                                            <div class="value">{{ BSTEMResult.see.toFixed(3) + ' m' }}</div>
                                        </div>
                                        <div class="keyValue flex-coloum" style="margin-top: .2vh;">
                                            <div class="key">剪切出现角度</div>
                                            <!-- <input type="text" class="value" placeholder="请输入潮位" v-model="elevationOfFlow"> -->
                                            <div class="value">{{ BSTEMResult.ssa.toFixed(3) + ' °' }}</div>
                                        </div>
                                        <div class="keyValue flex-coloum" style="margin-top: .2vh;">
                                            <div class="key">稳定性指标</div>
                                            <!-- <input type="text" class="value" placeholder="请输入潮位" v-model="elevationOfFlow"> -->
                                            <div class="value">{{ BSTEMResult.fos.toFixed(3) }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <el-dialog v-model="mapInputVisible" title="地图绘制" width="41.5vw" @opened="showSectionDraw = true">
        <div class="main-content" v-if="showSectionDraw">
            <sectionDraw ref="sectionDrawRef" v-on:section-draw="sectionDrawHandler" v-on:dem-select="demSelectHandler"
                :demResources="demResources">
            </sectionDraw>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="mapInputVisible = false">取消</el-button>
                <el-button type="primary" @click="calSectionViewClickHandler">
                    计算断面形态
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import ModelTitleVue from '../ModelTitle.vue'
import sectionDraw from '../soilAnalysis/sectionDraw.vue'
import sectionChart from '../soilAnalysis/chart copy'
import { onMounted, ref, reactive, watch } from 'vue';
import { ElNotification } from 'element-plus';
import ModelRunner from '../modelRunner'
import BankResourceHelper from './bankResourceHelper';

const chartdom = ref(null)
const sectionDrawRef = ref(null)
const elevationOfFlow = ref(2.8)
const ModelRunningShow = ref(false)
const ModelRunningMessage = ref('请完整配置参数后运行')
const showSkeleton = ref(true)
const mapInputVisible = ref(false)
const showSectionDraw = ref(false)
const BSTEMResult = reactive({
    see: 0,
    ssa: 0,
    fos: 0
})
const fileList = ref([])
const uploadJson = ref({})


let chart = null
let sectionInited = ref(false)
const checkInited = () => {
    if (sectionInited.value === false)
        ElNotification({
            position: 'top-left',
            type: 'warning',
            message: '请先进行断面信息录入！',
            title: '警告',
            offset: 130
        })
}

const thicknessData = ref([1.93, -4.07, -11.57, -26.57, -36.57])
const thicknessName = ['Layer 1', 'Layer 2', 'Layer 3', 'Layer 4', 'Layer 5']
const xzData = ref(new Array(23).fill(['0', '0']))

////////////////// json 模型参数信息上传
const beforeUpload = (file, e) => {
    console.log('beforeUpload', file, e)
    const isJSON = file.type === 'application/json';
    if (!isJSON) {
        return false;
    }
    return isJSON;
}
const handleChange = (file, fileList) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            let fileContent = JSON.parse(event.target.result);
            uploadJson.value = fileContent
            ElNotification({
                position: 'top-left',
                type: 'success',
                title: '参数配置文件上传成功！',
                offset: 130
            })
        } catch (error) {
            ElNotification({
                position: 'top-left',
                type: 'error',
                message: '请上传正确的 JSON 文件！',
                title: '错误',
                offset: 130
            })
        }
    };
    reader.readAsText(file.raw);
}
const handleExceed = (files, fileList) => {
    ElNotification({
        position: 'top-left',
        type: 'error',
        message: '文件超出限制，请上传正确的 JSON 文件！',
        title: '错误',
        offset: 200
    })
}
const handleRequest = (a, b) => {
    console.log('============')
}

watch(uploadJson, async (newValue, oldValue) => {
    console.log('uploadJosn!!', newValue)
    const result = parseUploadJson(newValue)
    console.log('result', result)
    elevationOfFlow.value = result.flowElevation
    thicknessData.value = result.thicknessData
    xzData.value = result.pointData
    sectionInited.value = true
    if (chart) {
        showSkeleton.value = false
        setTimeout(() => {
            const baseOption = chart.getBaseOption2(result.pointData, result.thicknessData)
            chart.myChart.setOption(baseOption)
        }, 1);
    } else {
        showSkeleton.value = false
        setTimeout(() => {
            chart = new sectionChart(chartdom.value, {})
            const baseOption = chart.getBaseOption2(result.pointData, result.thicknessData)
            chart.myChart.setOption(baseOption)
        }, 1);
    }


})

///////////////// 初始，岸段选择
const demResources = ref([])
const selectedBank = reactive({
    name: null,
    bankEnName: null
})
const confirmBankHandler = async (bank) => {

    selectedBank.name = bank.name
    selectedBank.bankEnName = bank.bankEnName

    let demData = (await BankResourceHelper.getBankCalculateResourceList('DEM', selectedBank.bankEnName)).data
    let demList = BankResourceHelper.DEMResourcetoList(demData)
    demResources.value = demList

    ElNotification({
        type: 'success',
        title: '选择岸段',
        message: `已选择岸段——${selectedBank.name},模型计算将采用该岸段相关资源`,
        position: 'top-left',
        offset: 180,
    })
}



// data input
const inputData = (type) => {
    if (type == 'file') {
        console.log('file input')
    }
    else if (type == 'map') {
        console.log('map input')
        if (selectedBank.name == null) {
            ElNotification({
                position: 'top-left',
                type: 'info',
                message: '请先选择岸段',
                title: '警告',
                offset: 130
            })
            return
        }
        mapInputVisible.value = true
    }

    BSTEMResult.see = 0
    BSTEMResult.ssa = 0
    BSTEMResult.fos = 0
}





// model params -- section view
let selectedDem = ref(null)
let sectionGeojson = ref(null)
const sectionDrawHandler = (geojson) => {
    console.log(' i got geojson !!', geojson)
    sectionGeojson.value = geojson
}
const demSelectHandler = (name) => {
    // const NameList = {
    //     '1998': '199801_dem/w001001.adf',
    //     '2004': '200408_dem/w001001.adf'
    // }
    // selectedDem.value = NameList[name]
    selectedDem.value = name
}

const sectionViewModelRun = async (param) => {
    console.log('section view model run')

    ModelRunningShow.value = true
    ModelRunningMessage.value = '正在计算断面形态'
    let sectionViewModelUrl = import.meta.env.VITE_MAP_TILE_SERVER2 + '/taskNode/start/riverbedEvolution/calculateSectionView'
    const sectionViewMR = new ModelRunner(sectionViewModelUrl, param)
    const taskId = await sectionViewMR.modelStart().catch(() => {
        ModelRunningShow.value = false
        ModelRunningMessage.value = ''
        ElNotification({
            position: 'top-left',
            type: 'error',
            title: '断面形态计算模型启动失败',
            offset: 130
        })
    })
    console.log('task id', taskId, sectionViewMR.taskId)
    let statusInterval = setInterval(async () => {
        const status = await sectionViewMR.getRunningStatus()
        console.log('status', status)
        switch (status) {
            case 'RUNNING':
            case 'LOCK':
            case 'UNLOCK':
                break
            case 'COMPLETE':
                clearInterval(statusInterval)
                const result = await sectionViewMR.getModelResult()
                console.log('result', result)
                let sectionFileName = result['raw-json']
                const sectionJson = await sectionViewMR.getModelResultFile(sectionFileName, 'json').catch((err) => {
                    ElNotification({
                        position: 'top-left',
                        offset: 130,
                        type: 'error',
                        title: '错误',
                        message: '断面形态计算完毕，但获取断面信息失败！',
                    })
                    console.log(err)
                })
                console.log('section json', sectionJson)
                sectionViewMR.sectionJson = sectionJson
                globalSectionJson = sectionJson
                sectionInited.value = true
                ModelRunningShow.value = false
                ModelRunningMessage.value = ''
                ElNotification({
                    position: 'top-left',
                    type: 'success',
                    message: '计算断面形态成功',
                    title: '成功',
                    offset: 130
                })
                showSkeleton.value = false
                setTimeout(() => {
                    drawChartFromMap()
                    chart.myChart.resize()
                }, 100);
                break
            case 'ERROR':
                clearInterval(statusInterval)
                let errorLog = await sectionViewMR.getErrorLog()
                console.log('error', errorLog)

                ModelRunningShow.value = false
                ModelRunningMessage.value = ''
                ElNotification({
                    position: 'top-left',
                    type: 'error',
                    message: '计算断面形态失败,\n' + errorLog,
                    title: '错误',
                    offset: 130
                })
                break
        }
    }, 1000)

}





let globalSectionJson = null


const calSectionViewClickHandler = () => {
    mapInputVisible.value = true
    let sectionViewParams = {
        'dem-id': selectedDem.value,
        'section-geometry': sectionGeojson.value,
        // 'section-geometry':{ "type": "Feature", "properties": { "id": 7, "label": "MZ08海事码头" }, "geometry": { "type": "LineString", "coordinates": [ [ 120.541607142803116, 32.03073986301149 ], [ 120.529324527677801, 31.999868738955477 ] ] } }
    }
    const paramsCheck = () => {
        if (sectionViewParams['dem-id'] == null || sectionViewParams['section-geometry'] == null) {
            ElNotification({
                position: 'top-left',
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
        sectionViewModelRun(sectionViewParams)
        setTimeout(() => {
            mapInputVisible.value = false
        }, 500);
    }
}

const findIndexOfMin = (arr) => {
    // // 找到最小值的索引
    // const numbers = [10, 5, 8, 3, 7];
    // const minIndex = findIndexOfMin(numbers);
    if (arr.length === 0) {
        return -1; // 如果数组为空，返回 -1 表示没有最小值
    }
    return arr.reduce((minIndex, currentValue, currentIndex, array) => {
        return currentValue < array[minIndex] ? currentIndex : minIndex;
    }, 0);
}


const BSTEMModelRun = async () => {
    let BSTEMModelParams = {
        "dem-id": selectedDem.value,
        "section-geometry": sectionGeojson.value,
        "x-values": xzData.value.map(item => Math.round(item[0] * 1000) / 1000),
        "z-values": xzData.value.map(item => Math.round(item[1] * 1000) / 1000),
        "index-toe": findIndexOfMin(xzData.value.map(item => Math.round(item[1] * 1000) / 1000)),
        "flow-elevation": elevationOfFlow.value,
        // "bool-tension": false,
        "bank-layer-thickness": thicknessData.value,
    }
    const paramsCheck = () => {
        if (elevationOfFlow.value == null || elevationOfFlow.value == '') {
            ElNotification({
                position: 'top-left',
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
        ElNotification({
            position: 'top-left',
            type: 'info',
            message: '执行土地变形分析模型',
            title: '提示',
            offset: 130
        })

        let BSTEMModelUrl = import.meta.env.VITE_MAP_TILE_SERVER2 + '/taskNode/start/erosionModel/calculateBSTEM'
        const BSTEMMR = new ModelRunner(BSTEMModelUrl, BSTEMModelParams)
        const taskId = await BSTEMMR.modelStart().catch(() => {
            ModelRunningShow.value = false
            ModelRunningMessage.value = ''
            ElNotification({
                position: 'top-left',
                type: 'error',
                title: '土体变形分析模型启动失败',
                offset: 130
            })
        })
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
                    let fos = Number.parseFloat(result['fos'])
                    let see = Number.parseFloat(result['see'])
                    let ssa = Number.parseFloat(result['ssa'])

                    // fos = fos + Math.random() * 0.3
                    // see = see + Math.random() * 5.0
                    // ssa = ssa + Math.random() * 8.0

                    BSTEMResult.fos = fos
                    BSTEMResult.see = see
                    BSTEMResult.ssa = ssa

                    ModelRunningShow.value = false
                    ModelRunningMessage.value = ''
                    ElNotification({
                        position: 'top-left',
                        type: 'success',
                        message: '土地变形分析模型执行成功',
                        title: '成功',
                        offset: 130
                    })
                    break
                case 'ERROR':
                    clearInterval(statusInterval)
                    let errorLog = BSTEMMR.getErrorLog()
                    console.log('error', errorLog)

                    ModelRunningShow.value = false
                    ModelRunningMessage.value = ''
                    ElNotification({
                        position: 'top-left',
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



const redrawChartClickHandler = () => {

    BSTEMResult.see = 0
    BSTEMResult.ssa = 0
    BSTEMResult.fos = 0
    let newOption = chart.getBaseOption2(xzData.value, thicknessData.value)
    chart.myChart.setOption(newOption)
}
const drawChartFromMap = () => {
    let data = dataGenerate(globalSectionJson)
    // let data = dataGenerate(test)
    let thicknessdata = data.thicknessData.sort((a, b) => b - a)
    let xzdata = data.pointData.sort((a, b) => a[0] - b[0])

    thicknessData.value = thicknessdata.map((item) => Math.round(item * 1000) / 1000)
    xzData.value = xzdata.map((item) => [Math.round(item[0] * 1000) / 1000, Math.round(item[1] * 1000) / 1000])
    sectionInited.value = true
    if (chart) {
        let option = chart.getBaseOption2(xzData.value, thicknessData.value)
        chart.myChart.setOption(option)
    }
    else {
        chart = new sectionChart(chartdom.value, {
            pointData: data.pointData,
            thicknessData: data.thicknessData,
            lineData: data.lineData
        })
        chart.initBaseChart(false)
    }
}



onMounted(async () => {
    // do nothing
})

/// helper
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
    const tileServer = `http://${window.location.host}${import.meta.env.VITE_MAP_TILE_SERVER}`
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
const dataGenerate = (origin) => {
    const lineData = []
    const lineDataStep = origin['step']
    const pointData = []
    // const pointDataStep = origin['step_er_verified']
    const pointDataStep = origin['step_er']
    for (let i = 0; i < origin['points'].length; i++) {
        let point = origin['points'][i]
        lineData.push([lineDataStep * i, point[2]])
    }
    // let scatterStart = lineDataStep * origin['deepest_index'] - (origin['points_er_verified'].length - 1) * pointDataStep
    let scatterStart = lineDataStep * origin['deepest_index'] - (origin['points_er'].length - 1) * pointDataStep

    // for (let i = 0; i < origin['points_er_verified'].length; i++) {
    for (let i = 0; i < origin['points_er'].length; i++) {
        // let point = origin['points_er_verified'][i]
        let point = origin['points_er'][i]
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
const parseUploadJson = (jsonData) => {
    try {
        let pointDT = []
        let thicknessDT = []
        for (let i = 0; i < 23; i++) {
            pointDT.push([jsonData['x-values'][i], jsonData['z-values'][i]])
        }
        thicknessDT = jsonData['thickness']
        let flowElevation = jsonData['flow-elevation']

        ElNotification({
            position: 'top-left',
            type: 'success',
            message: '参数配置文件解析完毕',
            title: '成功',
            offset: 200
        })
        return {
            pointData: pointDT,
            thicknessData: thicknessDT,
            flowElevation: flowElevation
        }
    }
    catch (e) {
        ElNotification({
            position: 'top-left',
            type: 'error',
            message: '解析失败，请上传正确的 JSON 文件！',
            title: '错误',
            offset: 200
        })
    }
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
    font-size: calc(0.8vw + 0.7vh);
    font-weight: bold;
    text-align: left;
    margin-bottom: 2px;
    color: #0e14cf;
    user-select: none;
    text-shadow: 1px 3px 8px rgba(134, 255, 245, 0.71);
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

        div.model-run-container {
            position: relative;
            width: 87w;
            height: 85vh;
            // border: 5px solid;
            padding: 3px;
            // border-image: repeating-linear-gradient(to bottom right, #fdfeff81, #97b1ff73, #b0ffe7, rgba(3, 175, 255, 0.459)) 20;
            border-radius: 10px;
            overflow: hidden;

            div.loading-container {
                position: absolute;
                top: 10vh;
                right: 40vw;
                width: 8vw;
                height: 12vh;
                background-color: rgba(255, 255, 255, 0.671);
                border-radius: 5px;
                backdrop-filter: blur(5px);
                z-index: 5;

                :deep(.dv-loading.loading-icon) {
                    position: absolute;
                }

                div.loading-message {
                    text-align: center;
                    position: relative;
                    margin-top: 1vh;
                    width: 6vw;
                    height: 6vh;
                    color: #000357;
                    // top: 7.3vh;
                    font-size: calc(0.6vw + 0.8vh);
                    font-weight: 800;
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
                }

            }

            :deep(div.el-tabs__content) {
                position: relative;
                width: 75vw;
                height: 79vh;
            }

            div.tab-page-container {
                position: relative;
                width: 85vw;
                height: 85vh;
                background-color: #03589e;

                div.model-run-content {
                    width: 85vw;
                    height: 85vh;

                    .form-block {
                        position: relative;
                        width: 98%;
                        height: 30%;
                        margin-left: 0.5vw;
                        margin-top: 1vh;
                        margin-bottom: 1vh;

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

                                        &.not-allow {
                                            cursor: not-allowed;

                                            input {
                                                pointer-events: none;
                                            }
                                        }

                                    }

                                    .cell {
                                        height: 2.5vh;
                                        width: 1vw;
                                        flex: 1;

                                        // border: 1px solid rgb(201, 201, 201);
                                        border: none !important;
                                        border-right: 2px solid rgb(2, 143, 199) !important;
                                        border-bottom: 1px solid rgb(5, 88, 121) !important;
                                        border-radius: 5px;
                                        text-align: center;

                                        display: grid;
                                        place-items: center;
                                        font-size: calc(0.4vw + 0.4vh);
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

                        .second-row {
                            width: 82%;
                            height: 40%;
                            display: flex;
                            flex-direction: row;


                            .soil-layer-profile {

                                position: relative;
                                width: 74%;
                                height: 65%;
                                overflow: hidden;
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
                                        width: 10vw;
                                        height: 4vh;

                                        .key {
                                            height: 2.5vh;
                                            width: 3vw;
                                            margin-right: .2vw;
                                            display: grid;
                                            place-items: center;
                                            font-size: calc(0.4vw + 0.3vh);
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
                                            height: 2.5vh;
                                            width: 3vw;
                                            // flex: 1;
                                            // border: 1px solid rgb(201, 201, 201);
                                            border: none !important;
                                            border-right: 2px solid rgb(2, 143, 199) !important;
                                            border-bottom: 1px solid rgb(5, 88, 121) !important;
                                            border-radius: 5px;
                                            text-align: center;

                                            display: grid;
                                            place-items: center;
                                            font-size: calc(0.4vw + 0.5vh);
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

                            .temp-block {

                                position: relative;
                                width: 21.5%;
                                height: 65%;
                                overflow: hidden;
                                padding: 10px;
                                margin: 5px;
                                background-color: rgb(212, 239, 254);
                                border-radius: 10px;

                                .title2 {
                                    margin-left: .5vw;
                                }

                                .content {


                                    .keyValue {
                                        position: relative;
                                        justify-content: center;
                                        align-items: center;
                                        width: 12vw;
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
                                            text-align: center;
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
                        }


                        .right-block {
                            position: absolute;
                            width: 17%;
                            height: 100%;
                            right: .5vw;
                            bottom: .5vh;
                            // background-color: rgb(212, 239, 254);
                            // border-radius: 10px;
                            justify-content: center;

                            .full-block {

                                position: relative;
                                width: 100%;
                                height: 95%;
                                background-color: rgb(212, 239, 254);
                                border-radius: 10px;
                                margin-top: 1vh;

                                .title2 {
                                    position: relative;
                                    height: 20%;
                                    margin-left: .5vw;
                                    margin-top: 1vh;
                                }

                                .content {
                                    height: 80%;

                                    .button {
                                        position: relative;
                                        width: 8vw;
                                        height: 6vh;
                                        background-color: #b8e9ff;
                                        border-right: 12px solid rgb(2, 143, 199);
                                        border-bottom: 8px solid rgb(87, 179, 216);
                                        border-radius: 5px;
                                        transition: .1s ease-in-out;
                                        cursor: pointer;
                                        font-size: calc(0.8vw + 0.6vh);
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


                    }

                    .chart-block {
                        position: relative;
                        width: 99%;
                        height: 65%;
                        // border:#f7fbff 1px dashed;
                        margin: 10px;
                        // background-color: rgb(242, 251, 255);
                        // border: #fdfdfd7a 5px dashed;

                        #chart {
                            position: relative;
                            width: 81%;
                            height: 100%;
                            background-color: rgb(242, 251, 255);
                            border-radius: 10px;
                        }

                        .redraw-button {
                            position: absolute;
                            z-index: 3;
                            right: 18vw;
                            top: 1vh;
                            width: 5vw;
                            height: 4vh;
                            background-color: #b8e9ff;
                            border-right: 6px solid rgb(2, 143, 199);
                            border-bottom: 4px solid rgb(87, 179, 216);
                            border-radius: 3px;
                            transition: .1s ease-in-out;
                            cursor: pointer;
                            font-size: calc(0.6vw + 0.5vh);
                            font-weight: 700;

                            color: rgb(23, 87, 112);
                            text-shadow: 0px 0px 5px #b4f1f1;
                            background-color: #b8e9ff;

                            &:active {
                                border-right: 6px solid rgb(2, 143, 199);
                                border-bottom: 4px solid rgb(87, 179, 216);
                            }
                        }

                        .right-block {
                            position: relative;
                            width: 18%;
                            height: 100%;
                            // margin-right: .5vw;
                            margin-left: .5vw;
                            background-color: rgb(212, 239, 254);
                            border-radius: 10px;

                            .run-container {
                                position: relative;
                                height: 25%;
                                background-color: rgb(212, 239, 254);

                                border-bottom: #0e14cf 5px dashed;
                                border-top-right-radius: 10px;
                                border-top-left-radius: 10px;

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

                            .result-container {
                                position: relative;
                                height: 70%;
                                background-color: rgb(212, 239, 254);

                                .title2 {
                                    height: 10%;
                                    position: relative;
                                    margin-top: 1vh;
                                    margin-bottom: 1vh;
                                    font-size: calc(0.8vw + 0.8vh);
                                }

                                .content {
                                    flex-grow: 1;
                                    // background-color: red;

                                    .keyValue {
                                        position: relative;
                                        justify-content: center;
                                        align-items: center;
                                        width: 7vw;
                                        padding: 10px;
                                        margin: 10px;
                                        height: fit-content;
                                        // background-color: rgb(255, 255, 255);

                                        .key {
                                            height: 4vh;
                                            width: 6.5vw;
                                            // margin-right: .5vw;
                                            margin-bottom: .2vh;
                                            display: grid;
                                            place-items: center;
                                            font-size: calc(0.5vw + 0.5vh);
                                            transition: .3s ease-in-out;
                                            border-right: 2px solid rgb(2, 143, 199);
                                            border-bottom: 1px solid rgb(5, 88, 121);
                                            border-radius: 5px;
                                            background-color: rgb(44, 61, 212);
                                            font-weight: bold;
                                            color: white;
                                        }

                                        .value {
                                            height: 3vh;
                                            // flex: 0.4;
                                            width: 6.5vw;

                                            border-right: 2px solid rgb(2, 143, 199);
                                            border-bottom: 1px solid rgb(5, 88, 121);
                                            border-radius: 5px;
                                            display: grid;
                                            place-items: center;
                                            font-size: calc(0.5vw + 0.5vh);
                                            font-weight: 700;
                                            transition: .3s ease-in-out;
                                            background-color: #dbfffd;
                                            color: rgb(44, 61, 212);

                                        }
                                    }
                                }
                            }


                        }

                        .null-desc {
                            position: relative;
                            width: 81%;
                            height: 100%;
                            font-size: calc(0.9vw + 1vh);
                            font-weight: 700;
                            color: #b4f1f1;
                            letter-spacing: .2rem;
                            // background-color: red;
                        }
                    }

                }

            }
        }
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
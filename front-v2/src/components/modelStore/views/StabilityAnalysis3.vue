<template>
    <div class="stability-analysis">
        <ModelTitleVue :ModelName="'近岸动力分析模型'" />
        <div class="main-content">
            <div class="map" id="map" ref="mapRef"></div>
            <div class="model-pannel">
                <dv-border-box12 :dur="5" :color="['rgb(28, 75, 187)', 'rgb(140, 255, 255)']">
                    <div class="real-content">
                        <div class="condition-configure flex-row">
                            <div class="title">
                                <div class="title-div">水文条件配置</div>
                                <div class="arrow-up"></div>
                            </div>
                            <div class="content">

                                <el-tabs type="border-card" class="tab-pages" v-model="activeTab">
                                    <el-tab-pane>
                                        <template #label>
                                            <span class="custom-tabs-label">
                                                <el-icon>
                                                    <Histogram />
                                                </el-icon>
                                                <span>匹配工况</span>
                                            </span>
                                        </template>
                                        <!-- <div class="condition-card">
                                            <div class="set-icon"></div>
                                            <div class="center">
                                                实时水文条件
                                            </div>
                                            <el-table :data="tableData" border style="width: 85%;height: 60%;"
                                                :scrollbar-always-on="false">
                                                <el-table-column prop="flow" label="流量" />
                                                <el-table-column prop="maxTide" label="大潮潮位" />
                                                <el-table-column prop="minTide" label="小潮潮位" />
                                            </el-table>
                                            <div class="last-update-time">
                                                <div class="water-condition-item">
                                                    <span class="water-condition-title">上次更新：</span>
                                                    <span class="water-condition-value">{{ updateTime }}</span>
                                                </div>
                                            </div>
                                            <button class="condition-button" @click="conditionClickHandler('realtime')"
                                                :class="{ 'active': true }">
                                                确定
                                            </button>
                                        </div> -->
                                        <div class="condition-card">
                                            <div class="set-icon"></div>
                                            <div class="center">
                                                匹配工况
                                            </div>

                                            <div class="section-selectior-item">
                                                <el-select v-model="flowSelected" placeholder="选择流量"
                                                    style="width: 10vw; height: 3.5vh">
                                                    <el-option v-for="item in selectableFlowList" :key="item" :label="item"
                                                        :value="item"> </el-option>
                                                </el-select>
                                            </div>
                                            <div class="section-selectior-item">
                                                <el-select v-model="tideSelected" placeholder="选择潮型"
                                                    style="width: 10vw; height: 3.5vh">
                                                    <el-option v-for="item in selectableTideList" :key="item" :label="item"
                                                        :value="item"> </el-option>
                                                </el-select>
                                            </div>

                                            <!-- <div class="last-update-time">
                                                <div class="water-condition-item">
                                                    <span class="water-condition-title">上次更新：</span>
                                                    <span class="water-condition-value">{{ updateTime }}</span>
                                                </div>
                                            </div> -->
                                            <button class="condition-button" @click="conditionClickHandler('match')"
                                                :class="{ 'active': true }">
                                                确定
                                            </button>
                                        </div>
                                    </el-tab-pane>
                                    <el-tab-pane>
                                        <template #label>
                                            <span class="custom-tabs-label">
                                                <el-icon>
                                                    <Tools />
                                                </el-icon>
                                                <span>新建工况</span>
                                            </span>
                                        </template>
                                        <div class="condition-card">
                                            <div class="set-icon"></div>
                                            <div class="center">
                                                新建工况
                                            </div>
                                            <div class="realtime-water-condition">
                                                <div class="water-condition-item">
                                                    <span class="water-condition-title">流量：</span>

                                                    <el-input v-model="customParams.flow" style="width: 65%; height: 70%;"
                                                        placeholder="请输入流量" />

                                                </div>
                                                <div class="water-condition-item">
                                                    <span class="water-condition-title">大潮潮位：</span>
                                                    <el-input v-model="customParams.maxTide"
                                                        style="width: 50%; height: 70%;" placeholder="请输入潮位" />
                                                </div>
                                                <div class="water-condition-item">
                                                    <span class="water-condition-title">小潮潮位：</span>
                                                    <el-input v-model="customParams.minTide"
                                                        style="width: 50%; height: 70%;" placeholder="请输入潮位" />
                                                </div>
                                            </div>

                                            <button class="realtime-button" @click="updateRealtimeWaterCondition()">
                                                实时工况
                                            </button>

                                            <button class="condition-button" @click="conditionClickHandler('custom')"
                                                :class="{ 'active': true }">
                                                确定
                                            </button>
                                        </div>
                                    </el-tab-pane>

                                </el-tabs>
                            </div>
                        </div>

                        <div class="model-running flex-row">
                            <div class="title">
                                <div class="title-div">模型计算</div>
                                <div class="arrow-up"></div>

                            </div>
                            <div class="content">
                                <div class="content-box">
                                    <el-row>
                                        <el-col :span="10">
                                            <div class="running-status grid-content">
                                                状态：<span :style="statusStyle">{{ modelRunnningStatusDesc }}</span>
                                            </div>
                                        </el-col>

                                        <el-col :span="6">
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="running-control grid-content">
                                                <div class="run-button" @click="runModelClickHandler">{{ runningText }}
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="24">
                                            <div class="grid-content">
                                                <div class="progress-container">
                                                    <el-progress :percentage="modelRunnningProgress" :stroke-width="15"
                                                        striped />

                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </div>
                        <div class="visulization-result flex-row">
                            <div class="title">
                                <div class="title-div">结果可视化 </div>
                            </div>

                            <div class="content">
                                <div class="slide-control-block">
                                    <label class="switch" :class="{ 'forbbidden': globleVariable.status === false }">
                                        <input type="checkbox" :checked="showFlow == 1"
                                            :disabled="globleVariable.status === false" @click="showFlowClickHandler(1)" />
                                        <span class="slider"></span>
                                    </label>
                                    <div class="text-block">
                                        <div class="text">拉格朗日场</div>
                                    </div>
                                </div>

                                <div class="slide-control-block">
                                    <label class="switch" :class="{ 'forbbidden': globleVariable.status === false }">
                                        <input type="checkbox" :checked="showFlow == 2"
                                            :disabled="globleVariable.status === false" @click="showFlowClickHandler(2)" />
                                        <span class="slider"></span>
                                    </label>
                                    <div class="text-block">
                                        <div class="text">欧拉场</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </dv-border-box12>
            </div>
        </div>
    </div>
</template>

<script setup>
import ModelTitleVue from '../ModelTitle.vue'
import { BorderBox12 as DvBorderBox12 } from '@kjgl77/datav-vue3'
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { initFineMap } from '../../../utils/mapUtils';
import { useMapStore } from '../../../store/mapStore';
import { ElNotification, ElMessageBox } from 'element-plus'
import axios from 'axios';
import dayjs from 'dayjs';
import FlowFieldLayer from '../../../utils/WebGL/flowFieldLayer'
import { EulerFlowLayer } from '../../../utils/WebGL/eulerFlowLayer'
import * as dat from 'dat.gui'
import '../../../utils/WebGL/dat_gui_style.css'



let globleVariable = reactive({
    taskID: null,
    caseID: null,
    pngPrefix: null,
    visualizationJsonUrl: null,
    stationBinUrl: null,
    uvBinUrls: null,
    status: false,
    runningStatus: 'NONE',
    lagrangeLayer: 'flowLayer1',
    eulerLayer: 'flowLayer2',
})
const mapRef = ref(null)
const mapStore = useMapStore()
const updateTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const showFlow = ref(0)
const modelRunnningStatusDesc = ref('未运行')
const modelRunnningProgress = ref(0)
const activeTab = ref('1')
const params = ref({
    flow: null,
    maxTide: null,
    minTide: null,
    tideType: null,
})
const customParams = ref({
    flow: null,
    maxTide: null,
    minTide: null,
})
const tableData = ref([
    {
        flow: 98000,
        maxTide: 5.2,
        minTide: 2.7,
    }
])
const statusStyle = computed(() => {
    switch (modelRunnningStatusDesc.value) {
        case '未运行':
            return { color: 'rgb(255, 2, 2)' }
        case '运行中':
            return { color: 'rgb(255, 165, 0)' }
        case '运行完毕':
            return { color: 'rgb(0, 180, 0)' }
        default:
            return { color: 'rgb(255, 255, 255)' }
    }
})
const flowSelected = ref(null)
const tideSelected = ref(null)
const selectableFlowList = [88000, 98000, 100000, 120000, 130000, 150000]
const selectableTideList = ['大潮', '中潮', '小潮']
const runningText = computed(() => {
    return activeTab.value === '0' ? '匹配' : '运行'
})


const check = (p) => {
    if (p.flow === null || p.flow < 5000 || p.flow > 150000) return false
    if (p.maxTide === null || p.maxTide < 0 || p.maxTide > 100) return false
    if (p.minTide === null || p.minTide < 0 || p.minTide > 100) return false
    return true
}
const conditionClickHandler = (type) => {
    // if (type === 'realtime') {
    //     params.value = tableData.value[0]
    // } 
    if (type === 'match') {
        params.value = {
            flow: flowSelected.value,
            tideType: tideSelected.value,
        }
    } else if (type === 'custom') {
        params.value = {
            flow: Number(customParams.value.flow),
            maxTide: Number(customParams.value.maxTide),
            minTide: Number(customParams.value.minTide),
        }
    }
    if (check(params.value))
        ElNotification({
            title: '水文条件配置成功',
            // message: `流量：${params.value.flow}，大潮潮位：${params.value.maxTide}，小潮潮位：${params.value.minTide}`,
            message: `流量：${params.value.flow}，潮型：${params.value.tideType}`,
            offset: 120,
            type: 'success',
        })
    else
        ElNotification({
            title: '水文条件配置失败',
            message: `流量：${params.value.flow}，大潮潮位：${params.value.maxTide}，小潮潮位：${params.value.minTide}，请检查输入是否合法`,
            offset: 120,
            type: 'error',
        })
    modelRunnningProgress.value = 0
    modelRunnningStatusDesc.value = '未运行'
    globleVariable.status = false
}
const runModelClickHandler = async () => {
    if (!check(params.value)) {
        ElNotification({
            title: '运行失败',
            message: `流量：${params.value.flow}，大潮潮位：${params.value.maxTide}，小潮潮位：${params.value.minTide}，请检查输入是否合法`,
            offset: 120,
            type: 'error',
        })
        return
    }
    const Confirm = {
        'NONE': () => {
            console.log('first run')
            // modelRunnning()
        },
        'RUNNING': () => {
            ElMessageBox.confirm(
                '模型正在运行，请勿重复提交',
                '警告',
                {
                    showConfirmButton: false,
                    showCancelButton: true,
                    // confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
                .catch(() => {
                    console.log('do nothing')
                })
        },
        'COMPLETE': () => {
            ElMessageBox.confirm(
                '已有运行结果，是否采用新工况重新运行？',
                '警告',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
                .then(() => {
                    console.log('run with new condition')
                    // modelRunnning()
                })
                .catch(() => {
                    console.log('do nothing')
                })
        },
        'ERROR': () => {

        }
    }
    Confirm[globleVariable.runningStatus]()
}




const modelRunnning = () => {
    const modelPostUrl = '/temp/taskNode/start/numeric/hydrodynamic'
    const modelParams = {
        "water-qs": params.value.flow,
        "tidal-level": [params.value.minTide, params.value.maxTide]
    }
    // 请求体改成潮型？

    // const TASK_ID = (await axios.post(modelPostUrl, modelParams)).data
    const TASK_ID = '1'
    console.log('TASK_ID ', TASK_ID)// 66a23664bec8e12b68c9ce86
    modelRunnningStatusDesc.value = '运行中'
    modelRunnningProgress.value = 0
    globleVariable.taskID = TASK_ID
    let runningStatusInterval = setInterval(async () => {
        // let runningStatus = (await axios.get('/temp/taskNode/status/id?taskId=' + TASK_ID)).data
        let runningStatus = 'RUNNING'
        modelRunnningStatusDesc.value = '运行中'
        let randomFactor = 3.0
        if (runningStatus === 'RUNNING') {
            globleVariable.runningStatus = 'RUNNING'
            if (modelRunnningProgress.value < 88) randomFactor = 1.0
            if (modelRunnningProgress.value > 88) randomFactor = 0.5
            if (modelRunnningProgress.value > 95) randomFactor = 0.1

            let nextProgress = Math.round((modelRunnningProgress.value + Math.random() * randomFactor) * 100) / 100
            nextProgress = nextProgress > 95 ? 95 : nextProgress
            modelRunnningProgress.value = nextProgress
        }
        else if (runningStatus === 'ERROR') {
            clearInterval(runningStatusInterval)
            globleVariable.runningStatus = 'ERROR'
            ElNotification({
                title: '模型运行失败',
                message: `请检查模型服务`,
                offset: 120,
                type: 'error',
            })
        }
        else if (runningStatus === 'COMPLETE') {
            clearInterval(runningStatusInterval)
            let runningResult = (await axios.get('/temp/taskNode/result/id?taskId=' + TASK_ID)).data
            console.log('runningResult ', runningResult)

            globleVariable.caseID = runningResult['case-id']
            globleVariable.pngPrefix = `/temp/data/modelServer/file/image?caseId=${globleVariable.caseID}&name=`
            globleVariable.binPrefix = `/temp/data/modelServer/file/bin?caseId=${globleVariable.caseID}&name=`
            globleVariable.stationBinUrl = runningResult['visualization-station-bin']
            globleVariable.uvBinUrls = runningResult['visualization-uv-bin']
            let visulizationDescUrl = `/temp/data/modelServer/file/json?caseId=${runningResult['case-id']}&name=${runningResult['visualization-description-json']}`
            globleVariable.visualizationJsonUrl = visulizationDescUrl
            console.log('globle data info::', globleVariable)

            const visualizationJson = (await axios.get(visulizationDescUrl)).data
            console.log('visualizationJson ', visualizationJson)
            globleVariable.status = true
            globleVariable.runningStatus = 'COMPLETE'
            modelRunnningStatusDesc.value = '运行完毕'
            modelRunnningProgress.value = 100

            // showFlowClickHandler(1)
        }
    }, 1000)
}






const flowLayerControl = (type, show) => {
    let map = mapStore.getMap()
    const controlMap = {
        'lagrange': {
            add: () => {
                console.log('add lagrenge');
                let flow = new FlowFieldLayer(globleVariable.lagrangeLayer, globleVariable.visualizationJsonUrl, globleVariable.pngPrefix)
                mapStore.getMap().addLayer(flow, 'mzsLabel')
            },
            remove: () => {
                console.log('rm lagrenge');
                map.getLayer(globleVariable.lagrangeLayer) && map.removeLayer(globleVariable.lagrangeLayer)
            }
        },
        'euler': {
            add: () => {
                console.log('add euler');
                let flow = new EulerFlowLayer(globleVariable.eulerLayer, globleVariable.stationBinUrl, globleVariable.uvBinUrls, globleVariable.binPrefix)
                // let flow = new EulerFlowLayer(globleVariable.eulerLayer, 'station.bin', ['uv_0.bin','uv_1.bin','uv_2.bin'],
                // '/scratchSomething/temp/')

                mapStore.getMap().addLayer(flow, 'mzsLabel')
            },
            remove: () => {
                console.log('rm euler');
                map.getLayer(globleVariable.eulerLayer) && map.removeLayer(globleVariable.eulerLayer)
            }
        }
    }
    controlMap[type][show ? 'add' : 'remove']()
}

const showFlowClickHandler = (id) => {
    console.log(globleVariable)
    if (!globleVariable.status) {
        ElNotification({
            title: '错误',
            message: '模型尚未运行或运行未结束，缺乏可视化依赖数据',
            offset: 120,
            type: 'error',
        })
        showFlow.value = 0
        return
    }
    if (id === 1) {
        showFlow.value = showFlow.value === 1 ? 0 : 1
        flowLayerControl('euler', false)
        if (!showFlow.value) {
            flowLayerControl('lagrange', false)
            return
        }
        flowLayerControl('lagrange', true)
        return
    } else if (id === 2) {
        showFlow.value = showFlow.value === 2 ? 0 : 2
        flowLayerControl('lagrange', false)
        if (!showFlow.value) {
            flowLayerControl('euler', false)
            return
        }
        flowLayerControl('euler', true)
        return
    }
}

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.45997922676836, 32.00001616423072],
            [120.60909640208264, 32.084171362618625],
        ],
        {
            duration: 1500,
        },
    )
}



const updateRealtimeWaterCondition = async () => {
    // async request
    const response = {
        flow: 84000,
        maxTide: 5.2,
        minTide: 2.7,
    }
    // update
    tableData.value = [
        response
    ]
    updateTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')

    customParams.value = response
    ElNotification({
        title: '已更新实时水文条件',
        message: `更新时间：${updateTime.value}`,
        offset: 120,
        type: 'success',
    })
}




let realtimeWaterConditionIntervalID = null
onMounted(async () => {
    let map = await initFineMap(mapRef.value)
    mapStore.setMap(map)
    mapFlyToRiver(map)
    // realtimeWaterConditionIntervalID = setInterval(() => {
    //     updateRealtimeWaterCondition()
    // }, 1000 * 60 * 5)

})



onUnmounted(() => {
    if (useMapStore().getMap()) {
        useMapStore().getMap().remove()
        useMapStore().destroyMap()
    }
    clearInterval(realtimeWaterConditionIntervalID)
})
</script>

<style lang="scss" scoped>
div.stability-analysis {
    position: absolute;
    width: 100vw;
    height: 92vh;
    display: flex;
    flex-direction: column;
    color: #055279;

    div.main-content {
        position: relative;
        flex-grow: 1;

        div.map {
            position: relative;
            z-index: 0;
            width: 100%;
            height: 100%;
            background-color: hsl(194, 69%, 91%);
        }

        div.model-pannel {
            position: absolute;
            z-index: 1;
            top: 1vh;
            left: 1vw;
            width: 20vw;
            height: 47vh;
            background-color: rgb(248, 248, 248);
            // backdrop-filter: blur(20px);
            border-radius: calc(0.1vw + 1vh);

            :deep(.dv-border-box-12) {

                // background-color: rgb(214,216,219);
                border-radius: calc(0.5vw + 1vh);

                // backdrop-filter: blur(8px);
                // border-radius: 6px;
                div.border-box-content {
                    display: flex;

                }
            }

            div.real-content {
                position: relative;
                width: 18.8vw;
                height: 45.5vh;
                transform: translateX(2.5%) translateY(2%);
                z-index: 1;
                display: flex;
                flex-direction: column;

                div.title {
                    width: fit-content;
                    padding: 0 0.3vw;
                    position: relative;
                    writing-mode: vertical-lr;
                    text-align: center;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    background-color: rgb(255, 255, 255);

                    div.title-div {

                        height: fit-content;
                        padding-left: 0.4vw;
                        padding-right: 0.4vw;
                        padding-bottom: 1vh;
                        border-radius: calc(0.2vw + 0.2vh);
                        color: rgb(25, 71, 134);
                        font-weight: 700;
                        font-size: calc(0.6vw + 0.6vh);
                        letter-spacing: 0.3vh;

                    }
                }

                div.content {
                    position: relative;
                    width: 15vw;
                    flex-grow: 1;
                }

                div.condition-configure {
                    position: relative;
                    width: 100%;
                    height: 42%;
                    flex: 1;

                    div.content {
                        .tab-pages {
                            height: 100%;
                            width: 100%;

                            .custom-tabs-label {
                                vertical-align: middle;

                                .el-icon {
                                    vertical-align: middle;
                                }

                                span {
                                    margin-left: 0.2vw;
                                    vertical-align: middle;
                                }
                            }

                            .condition-card {
                                position: relative;
                                width: 100%;
                                height: 14vh;
                                display: flex;
                                flex-direction: column;
                                justify-content: space-evenly;
                                // align-items: center;
                                border-radius: calc(0.4vw + 0.4vh);
                                // box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
                                // margin-right: 2vw;
                                // margin-left: 2vw;


                                .set-icon {
                                    position: absolute;
                                    right: 0.2vw;
                                    top: 0.5vh;
                                    width: 4.5vh;
                                    height: 4.5vh;
                                    background-size: contain;
                                    background-repeat: no-repeat;
                                    background-image: url('/set.png');

                                }

                                .center {
                                    position: relative;
                                    height: 30%;
                                    // background-color: red;
                                    width: 100%;
                                    color: #055279;
                                    font-weight: 800;
                                    font-size: calc(0.8vw + 0.7vh);
                                    padding-left: 0.4vw;
                                    // padding-top: 0.5vh;
                                }

                                div.section-selectior-item {
                                    position: relative;

                                    width: 8vw;
                                    height: 4vh;
                                    margin-left: .5vw;
                                    line-height: 3vh;
                                    text-align: center;

                                    // background-color: #eef3ff;
                                    :deep(.el-select) {
                                        height: 3.3vh;
                                        border-radius: 6px;
                                        // background-color: rgba(0, 119, 255, 1);
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

                                .realtime-water-condition {
                                    position: relative;
                                    height: 100%;
                                    width: 80%;
                                    padding-left: 0.5vw;
                                    font-size: calc(0.45vw + 0.4vh);


                                    .water-condition-item {
                                        position: relative;
                                        width: 85%;
                                        height: 3.2vh;

                                        .water-condition-title {
                                            line-height: 3.2vh;
                                            font-weight: 800;
                                            font-size: calc(0.5vw + 0.6vh);
                                        }

                                        .water-condition-value {
                                            margin-right: 1vw;
                                            font-size: calc(0.5vw + 0.4vh);
                                        }

                                        input.water-condition-input {
                                            width: 50%;
                                        }
                                    }
                                }

                                .last-update-time {
                                    position: relative;
                                    height: 40%;
                                    width: 100%;
                                    padding-left: 0.5vw;

                                    .water-condition-item {
                                        position: relative;
                                        width: 85%;
                                        height: 3.5vh;

                                        .water-condition-title {
                                            line-height: 3.5vh;
                                            font-weight: 800;
                                            font-size: calc(0.5vw + 0.6vh);
                                        }

                                        .water-condition-value {
                                            margin-right: 1vw;
                                            font-size: calc(0.4vw + 0.4vh);
                                        }
                                    }
                                }

                                button.condition-button {
                                    position: absolute;
                                    right: 0.8vw;
                                    bottom: 0.5vh;
                                    width: 3vw;
                                    height: 3vh;
                                    background: #0254bed0;
                                    color: #fff;
                                    font-family: inherit;
                                    font-weight: 900;
                                    font-size: calc(0.3vw + 0.7vh);
                                    border: 1px solid rgb(3, 107, 167);
                                    border-radius: 0.4em;
                                    box-shadow: rgb(0, 68, 114) 0.05em 0.05em;
                                    cursor: pointer;
                                    transition: .1s linear;

                                    &:hover {
                                        background: #1377fad0;
                                        color: #ffffff;
                                    }
                                }

                                button.realtime-button {
                                    position: absolute;
                                    right: 4vw;
                                    top: .5vh;
                                    width: 4vw;
                                    height: 3vh;
                                    background: #76b2ffd0;
                                    color: #fff;
                                    font-family: inherit;
                                    font-weight: 900;
                                    font-size: calc(0.3vw + 0.7vh);
                                    border: 1px solid rgb(3, 107, 167);
                                    border-radius: 0.4em;
                                    box-shadow: rgb(0, 68, 114) 0.05em 0.05em;
                                    cursor: pointer;
                                    transition: .1s linear;

                                    &:hover {
                                        background: #1377fad0;
                                        color: #ffffff;
                                    }
                                }

                            }
                        }

                    }
                }

                div.model-running {
                    position: relative;
                    width: 100%;
                    height: 25%;
                    flex: 1;

                    div.content {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        // border: 1px solid #dcdfe6;
                        // background-color: #ffffff;

                        .content-box {
                            position: relative;
                            width: 100%;
                            height: fit-content;
                            border: 1px solid #dcdfe6;
                            background-color: #ffffff;

                            .running-status {
                                line-height: 3.2vh;
                                font-weight: 800;
                                font-size: calc(0.5vw + 0.6vh);
                                color: #055279;
                            }

                            .run-button {
                                position: relative;
                                text-align: center;
                                line-height: 3vh;
                                width: 3vw;
                                height: 3vh;
                                background: #0254bed0;
                                color: #fff;
                                font-family: inherit;
                                font-weight: 900;
                                font-size: calc(0.3vw + 0.7vh);
                                border: 1px solid rgb(3, 107, 167);
                                border-radius: 0.4em;
                                box-shadow: rgb(0, 68, 114) 0.05em 0.05em;
                                cursor: pointer;
                                transition: .1s linear;

                                &:hover {
                                    background: #1377fad0;
                                    color: #deedfc;
                                }
                            }

                            .progress-container {
                                position: relative;
                                display: block;
                                height: 100%;
                                width: 90%;
                            }

                            .grid-content {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                width: 100%;
                                height: 100%;
                                margin-bottom: 2vh;
                            }

                            .el-row {
                                margin-left: 0vw;
                                margin-top: 1vh;
                            }
                        }
                    }
                }

                div.visulization-result {
                    position: relative;
                    width: 100%;
                    flex: 1;
                    height: 30%;


                    div.content {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-evenly;
                        align-items: center;

                        position: relative;
                        width: 100%;
                        height: fit-content;
                        border: 1px solid #dcdfe6;
                        background-color: #ffffff;

                        div.slide-control-block {
                            position: relative;
                            height: 13vh;
                            width: 6vw;
                            display: flex;
                            flex-direction: row;
                            justify-content: center;
                            align-items: center;
                            z-index: 3;

                            .switch {
                                font-size: 20px;
                                position: relative;
                                display: inline-block;
                                width: 2em;
                                height: 3.5em;

                                input {
                                    display: none;
                                }

                                /* The slider */
                                .slider {
                                    position: absolute;
                                    cursor: pointer;
                                    top: 0;
                                    left: 0;
                                    right: 0;
                                    bottom: 0;
                                    background-color: rgb(197, 232, 253);
                                    transition: 0.4s;
                                    border-radius: 10px;

                                    &:before {
                                        position: absolute;
                                        content: '';
                                        height: 1.4em;
                                        width: 1.4em;
                                        border-radius: 5px;
                                        left: 0.3em;
                                        bottom: 0.3em;
                                        background-color: white;
                                        transition: 0.4s;
                                    }
                                }

                                input:checked {
                                    +.slider {
                                        background-color: rgb(53, 101, 174);
                                    }

                                    +.slider:before {
                                        transform: translateY(-1.5em);
                                    }
                                }
                            }

                            .switch.forbbidden {

                                .slider {
                                    cursor: not-allowed;
                                    // pointer-events: none;
                                }

                            }

                            .text-block {
                                font-size: calc(0.6vw + 0.6vh);
                                width: 3em;
                                height: 5em;
                                display: flex;
                                justify-content: center;
                                align-items: center;

                                .text {
                                    writing-mode: vertical-lr;
                                    color: #055279;
                                    font-family: 'Microsoft YaHei';
                                    font-weight: 700;
                                    user-select: none;
                                }
                            }
                        }
                    }
                }

                div.flex-row {
                    display: flex;
                    flex-direction: row;
                }


            }
        }
    }
}

.arrow-up {
    display: inline-block;
    position: relative;
    width: 10px;
    /* 可以根据需求调整箭头的宽度 */
    height: 10px;
    /* 可以根据需求调整箭头的高度 */
    transform: translateX(-1px);
}

.arrow-up::before,
.arrow-up::after {
    content: '';
    position: absolute;
    width: 2px;
    /* 调整箭头线条的宽度 */
    height: 12px;
    /* 调整箭头线条的高度 */
    background-color: black;
    /* 箭头颜色 */
}

.arrow-up::before {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) rotate(-45deg);
    transform-origin: bottom center;
}

.arrow-up::after {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    transform-origin: bottom center;
}

:deep(.el-tabs--border-card>.el-tabs__content) {
    padding: 8px;
}

:deep(.el-table .el-table__cell) {
    padding: 0;
    text-align: center;
}

:deep(.el-table .cell) {
    padding: 0;
    line-height: 2.5vh;
    font-size: small;
}
</style>
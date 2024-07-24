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

                                <el-tabs type="border-card" class="tab-pages">
                                    <el-tab-pane>
                                        <template #label>
                                            <span class="custom-tabs-label">
                                                <el-icon>
                                                    <Histogram />
                                                </el-icon>
                                                <span>实时</span>
                                            </span>
                                        </template>
                                        <div class="condition-card">
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
                                        </div>
                                    </el-tab-pane>
                                    <el-tab-pane>
                                        <template #label>
                                            <span class="custom-tabs-label">
                                                <el-icon>
                                                    <Tools />
                                                </el-icon>
                                                <span>自定义</span>
                                            </span>
                                        </template>
                                        <div class="condition-card">
                                            <div class="set-icon"></div>
                                            <div class="center">
                                                特定水文条件
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
                                                状态：<span>未运行</span>
                                            </div>
                                        </el-col>

                                        <el-col :span="6">
                                        </el-col>
                                        <el-col :span="8">
                                            <div class="running-control grid-content">
                                                <div class="run-button" @click="runModelClickHandler">运行</div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="24">
                                            <div class="grid-content">
                                                <div class="progress-container">
                                                    <el-progress :percentage="50" :stroke-width="15" striped />

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
                                    <label class="switch">
                                        <input type="checkbox" :checked="showFlow == 1" @click="showFlowClickHandler(1)" />
                                        <span class="slider"></span>
                                    </label>
                                    <div class="text-block">
                                        <div class="text">拉格朗日场</div>
                                    </div>
                                </div>

                                <div class="slide-control-block">
                                    <label class="switch">
                                        <input type="checkbox" :checked="showFlow == 2" @click="showFlowClickHandler(2)" />
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
import { ref, onMounted, onUnmounted } from 'vue'
import { initPureScratchMap } from '../../../utils/mapUtils';
import { useMapStore } from '../../../store/mapStore';
import { ElNotification } from 'element-plus'
import axios from 'axios';
import dayjs from 'dayjs';



const mapRef = ref(null)
const mapStore = useMapStore()
const updateTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const showFlow = ref(0)
const params = ref({
    flow: 0,
    maxTide: 0,
    minTide: 0,
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


const check = (p) => {
    if (p.flow === null || p.flow < 5000 || p.flow > 150000) return false
    if (p.maxTide === null || p.maxTide < 0 || p.maxTide > 100) return false
    if (p.minTide === null || p.minTide < 0 || p.minTide > 100) return false
    return true
}
const conditionClickHandler = (type) => {
    if (type === 'realtime') {
        params.value = tableData.value[0]
    } else if (type === 'custom') {
        params.value = customParams.value
    }

    if (check(params.value))
        ElNotification({
            title: '水文条件配置成功',
            message: `流量：${params.value.flow}，大潮潮位：${params.value.maxTide}，小潮潮位：${params.value.minTide}`,
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

    const modelPostUrl = '/temp/taskNode/start/numeric/hydrodynamic'
    const modelParams = {
        "water-qs": params.value.flow,
        "tidal-level": [params.value.minTide, params.value.maxTide]
    }
    const TASK_ID = (await axios.post(modelPostUrl, modelParams)).data

    let runningStatusInterval = setInterval(async () => {
        let runningStatus = (await axios.get('/temp/taskNode/status/id?taskId=' + TASK_ID)).data
        if (runningStatus === 'COMPLETE') {
            clearInterval(runningStatusInterval)
            let runningResult = (await axios.get('/temp/taskNode/result/id?taskId=' + TASK_ID)).data
            console.log('runningResult ', runningResult)
            let visulizationDescUrl = `/temp/data/modelServer/file?caseId=${runningResult['case-id']}&name=${runningResult['visualization-description-json']}`
            const visualizationJson = (await axios.get(visulizationDescUrl)).data
            console.log('visualizationJson ', visualizationJson);
        }

    }, 1000)


    // const url = `/apiv2/data/modelServer/file?caseId=34aba3372bfd9cf2391b65ee39969381&name=visualization/mask_0.png`
    // const url = `/apiv2/taskNode/status/id?taskId=66a066793fe8f9282c3a2e6d`
    // const test = (await axios.post(url)).data
    // console.log(test)
}


const showFlowClickHandler = (id) => {
    if (id === 1) {
        showFlow.value = showFlow.value === 1 ? 0 : 1
        if (!showFlow.value) {
            // remove flow
            return
        }
        // add flow 
        return
    } else if (id === 2) {
        showFlow.value = showFlow.value === 2 ? 0 : 2
        if (!showFlow.value) {
            // remove flow
            return
        }
        // add flow 
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
            // pitch: 32.45,
            duration: 1000,
            // zoom: 8,
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
}




let realtimeWaterConditionIntervalID = null
onMounted(async () => {
    let map = await initPureScratchMap(mapRef.value)
    mapStore.setMap(map)
    mapFlyToRiver(map)
    realtimeWaterConditionIntervalID = setInterval(() => {
        updateRealtimeWaterCondition()
    }, 1000 * 60 * 5)


    window.addEventListener('keydown', (e) => {
        if (e.key === '1') {
            runModelClickHandler()
        }
    })


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
                                    height: 35%;
                                    // background-color: red;
                                    width: 100%;
                                    color: #055279;
                                    font-weight: 800;
                                    font-size: calc(0.8vw + 0.7vh);
                                    padding-left: 0.4vw;
                                    padding-top: 0.5vh;
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
                                    transition: .3s linear;

                                    &:active {
                                        scale: 1.01;
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
                                transition: .3s linear;

                                &:active {
                                    scale: 1.01;
                                }
                            }

                            .progress-container {
                                position: relative;
                                display: block;
                                height: 100%;
                                width: 85%;
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
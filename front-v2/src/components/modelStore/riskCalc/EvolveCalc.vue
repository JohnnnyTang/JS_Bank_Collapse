<template>
    <div class="velocity-calc-content">
        <div class="model-input">
            <div class="model-params-container card">
                <div class="title-container">指标参数输入</div>
                <el-form
                    ref="paramsFromRef"
                    :model="paramsForm"
                    :rules="rules"
                    class="model-params card"
                    status-icon
                >
                    <el-form-item
                        label="对比时间"
                        prop="year"
                        style="width: 90%; margin: 2%; color: black"
                    >
                        <el-select v-model="paramsForm.year" placeholder="2023">
                            <div v-for="(item, index) in yearList" :key="index">
                                <el-option :label="item" :value="item" />
                            </div>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width: 90%; margin: 4%">
                        <el-button
                            type="primary"
                            @click="submitForm(paramsFromRef)"
                            :disabled="isDisable"
                            color="#2a5fdb"
                        >
                            计算指标
                        </el-button>
                        <el-button @click="resetForm(paramsFromRef)"
                            >重置</el-button
                        >
                    </el-form-item>
                </el-form>
            </div>
            <div class="section-graph-container card">
                <div class="title-container">岸坡坡比</div>
                <div
                    class="card"
                    style="
                        flex: 1 1 0;
                        width: 95%;
                        color: #0953aa;
                        background-color: #d1e7ff;
                        font-size: x-large;
                        font-weight: bold;
                    "
                    v-show="isFinish == false"
                    v-loading="isLoading"
                    element-loading-background="rgba(214, 235, 255,0.8)"
                >
                    目前暂无结果
                </div>
                <div
                    ref="rateGraphRef"
                    class="section-graph card"
                    v-show="isFinish == true"
                    v-loading="isLoading"
                    element-loading-background="rgba(214, 235, 255,0.8)"
                ></div>
            </div>
        </div>
        <div class="model-output">
            <div class="output-graph-container card">
                <div class="title-container">断面对比</div>
                <div
                    class="card"
                    style="
                        flex: 1 1 0;
                        width: 95%;
                        color: #0953aa;
                        background-color: #d1e7ff;
                        font-size: x-large;
                        font-weight: bold;
                    "
                    v-show="isFinish == false"
                    v-loading="isLoading"
                    element-loading-background="rgba(214, 235, 255,0.8)"
                >
                    目前暂无结果
                </div>
                <div
                    v-show="isFinish == true"
                    ref="compareGraphRef"
                    class="output-graph card"
                    v-loading="isLoading"
                    element-loading-background="rgba(214, 235, 255,0.8)"
                ></div>
            </div>
            <div class="output-table-container card device-status-container">
                <div class="small-title-container">
                    <span style="padding-right: 3%"></span>
                    <div class="small-title-text">演变指标计算结果</div>
                </div>
                <div class="device-status-content">
                    <div class="head device-status-row">
                        <div class="device-name device-item head">指标</div>
                        <div class="device-count device-item head">矩阵</div>
                        <div class="device-percent device-item head">风险</div>
                    </div>
                    <div
                        class="device-status-row body"
                        v-for="(item, index) in indexValues"
                        :key="index"
                        v-loading="isLoading"
                        element-loading-background="rgba(214, 235, 255,0.8)"
                    >
                        <div class="device-name device-item body">
                            {{ ['潮滩高差', '岸坡坡比', '冲淤变幅'][index] }}
                        </div>
                        <div class="device-count device-item body">
                            {{ item[0] || '无数据' }}
                        </div>
                        <div class="device-percent device-item body">
                            {{ item[1] || '无数据' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useMultiIndexStore } from '@/store/multiIndexStore'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import { getTaskJsonAPI, getTaskStatusAPI, postTaskStartAPI } from './api.js'
import { drawCompareGraph, drawRateGraph } from './util.js'

const yearList = [2020, 2021, 2022, 2023]
let compareGraphChart = null
let rateChart = null
const sectionPoints = ref(null)
const beforeSectionPoints = ref(null)
const indexValues = ref([[], [], []])
const rateGraphRef = ref(null)
const compareGraphRef = ref(null)
const paramsFromRef = ref(null)
const multiIndexStore = useMultiIndexStore()
const isLoading = ref(false)

const paramsForm = reactive({
    year: null,
})
const rules = reactive({
    year: [
        {
            required: true,
            message: '请输入对比年份',
        },
    ],
})

const isDisable = computed(() => {
    if (paramsForm) {
        return !paramsForm.year
    } else {
        return true
    }
})

const isFinish = computed(() => indexValues.value[0].length !== 0)

const submitForm = async () => {
    if (Number(multiIndexStore.resJson.year) <= paramsForm.year) {
        ElMessage({
            message:
                '对比时间应在当前时间之前, 当前时间为' +
                ' ' +
                paramsForm.year +
                ' 年',
            type: 'warning',
        })
        resetForm(paramsFromRef.value)
        return
    }
    const taskIDResponse = await postTaskStartAPI(
        'evolution',
        multiIndexStore.taskId,
        undefined,
        paramsForm.year,
    )
    if (taskIDResponse.status === 'error') {
        ElMessage({
            message: '演化分析指标计算失败',
            type: 'warning',
        })
    }
    isLoading.value = true

    const intervalID = setInterval(async () => {
        const statusResponse = await getTaskStatusAPI(taskIDResponse.data)
        if (
            statusResponse.status === 'error' ||
            statusResponse.data === '-1' ||
            statusResponse.data === '-2'
        ) {
            clearInterval(intervalID)
            ElMessage({
                message: '演化分析指标计算失败',
                type: 'warning',
            })
            isLoading.value = false
        }
        if (statusResponse.data === '2') {
            const jsonResponse = await getTaskJsonAPI(multiIndexStore.taskId)
            if (jsonResponse.status === 'error') {
                clearInterval(intervalID)
                ElMessage({
                    message: '演化分析指标计算失败',
                    type: 'warning',
                })
                isLoading.value = false
            }
            const json = jsonResponse.data
            multiIndexStore.resJson = json
            indexValues.value = [json.ZB, json.SA, json.LN]
            beforeSectionPoints.value = json.beforeSection

            resetForm(paramsFromRef.value)
            clearInterval(intervalID)

            setTimeout(() => {
                rateChart.clear()
                drawRateGraph(
                    rateChart,
                    sectionPoints.value.map((value) => value[2]),
                    json.SA[2],
                )
                rateChart.resize()

                compareGraphChart.clear()
                drawCompareGraph(
                    compareGraphChart,
                    sectionPoints.value.map((value) => value[2]),
                    beforeSectionPoints.value.map((value) => value[2]),
                )
                compareGraphChart.resize()
            }, 10)

            ElMessage({
                message: '演化分析指标计算成功',
                type: 'success',
            })
            isLoading.value = false
        }
    }, 1000)
}

const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
}

onMounted(() => {
    sectionPoints.value = multiIndexStore.resJson.section
    rateChart = echarts.init(rateGraphRef.value)
    compareGraphChart = echarts.init(compareGraphRef.value)
})
</script>

<style lang="scss" scoped>
div.velocity-calc-content {
    height: 79vh;
    width: 75vw;
    background-color: #2a99c9;
    display: flex;

    .model-input {
        flex: 1 1 0;
        display: flex;
        flex-direction: column;

        .model-params-container {
            flex-direction: column;
            flex: 1 1 0;
        }
        .section-graph-container {
            flex-direction: column;
            flex: 1 1 0;
        }
    }
    .model-output {
        flex: 1 1 0;
        display: flex;
        flex-direction: column;

        .output-graph-container {
            flex-direction: column;
            flex: 1 1 0;
        }

        .output-table-container {
            flex-direction: column;
            flex: 1 1 0;
        }
    }

    .card {
        border-radius: 6px;
        margin: 1%;
        background-color: #abd5f8;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        box-shadow:
            rgba(13, 70, 228, 0.6) 0px 2px 4px,
            rgba(6, 55, 189, 0.4) 0px 7px 13px -3px,
            rgba(9, 61, 204, 0.3) 0px -3px 0px inset;
    }

    .section-graph {
        height: 90%;
        width: 95%;
        background-color: hsla(210, 100%, 92%);
    }

    .model-params {
        height: 90%;
        width: 95%;
        background-color: #d1e7ff;
        display: block;
    }

    .output-graph {
        height: 90%;
        width: 95%;
        background-color: #d1e7ff;
        display: block;
    }
}

div.device-status-container {
    margin-top: 0.5vh;
    height: 24.2vh;

    div.small-title-container {
        width: 95%;
        margin-top: 1vh;
        margin-bottom: 0.5vh;
        left: 5px;
        height: 6vh;
        line-height: 6vh;
        display: flex;
        border-radius: 8px;

        background: linear-gradient(
            90deg,
            rgba(0, 56, 128, 1) 0%,
            rgba(16, 104, 203, 1) 60%,
            rgba(68, 159, 255, 1) 100%
        );

        text-align: left;
        color: #c4fbff;
        font-weight: bold;

        div.small-title-icon {
            height: 3.5vh;
            width: 4vh;

            background-image: url('/project-status.png');
            background-repeat: no-repeat;
            background-size: contain;
            background-position: 50% 50%;
        }
    }

    div.device-status-content {
        top: 5vh;
        width: 95%;
        height: 40vh;

        // background-color: #c4fbff;

        div.device-status-row {
            height: 20%;
            width: 100%;
            border-radius: 8px;
            margin-bottom: 1.2vh;

            // background-color: #2622fd;

            display: flex;
            flex-flow: row nowrap;
            justify-content: space-around;

            &.head {
                padding-bottom: 4px;
            }

            div.device-item {
                width: 28%;
                height: 100%;
                line-height: 6vh;
                text-align: center;
                border-radius: 8px;

                background-color: #d2f2ff;
                font-weight: bold;
                color: #2a5fdb;

                &.device-name {
                    width: 44%;
                }

                &.head {
                    background-color: #2a5fdb;
                    border: 1px solid #aaffff;
                    font-weight: bold;
                    color: #dafdff;
                    box-shadow:
                        rgba(208, 252, 255, 0.6) 0px 2px 4px,
                        rgba(208, 252, 255, 0.4) 0px 7px 13px -3px,
                        rgba(208, 252, 255, 0.3) 0px -3px 0px inset;
                }

                box-shadow:
                    rgba(13, 70, 228, 0.6) 0px 2px 4px,
                    rgba(6, 55, 189, 0.4) 0px 7px 13px -3px,
                    rgba(9, 61, 204, 0.3) 0px -3px 0px inset;
            }
        }
    }
}

.title-container {
    width: 93%;
    margin-top: 1vh;
    margin-bottom: 0.5vh;
    padding-left: 2%;
    height: 6vh;
    line-height: 6vh;
    display: flex;
    border-radius: 8px;

    background: linear-gradient(
        90deg,
        rgba(0, 56, 128, 1) 0%,
        rgba(16, 104, 203, 1) 60%,
        rgba(68, 159, 255, 1) 100%
    );

    text-align: left;
    color: #c4fbff;
    font-weight: bold;
}
:deep(.el-form-item__label) {
    color: #0953aa;
    font-weight: bold;
}
</style>

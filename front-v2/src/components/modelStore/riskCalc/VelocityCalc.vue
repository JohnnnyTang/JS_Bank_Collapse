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
                        label="水文时间"
                        prop="year"
                        style="width: 90%; margin: 2%; color: black"
                    >
                        <el-input v-model="paramsForm.year" color="#abd5f8" />
                    </el-form-item>
                    <el-form-item
                        label="水文条件"
                        prop="condition"
                        style="width: 90%; margin: 2%; color: black"
                    >
                        <el-select
                            v-model="paramsForm.condition"
                            placeholder="枯季"
                        >
                            <el-option label="枯季" value="dry" />
                            <el-option label="洪季" value="flood" />
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
                <div class="title-container">断面形态</div>
                <div ref="sectionGraphRef" class="section-graph card"></div>
            </div>
        </div>
        <div class="model-output">
            <div class="output-graph-container card">
                <div class="title-container">动力计算指标</div>
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
                >
                    目前暂无结果
                </div>
                <div
                    v-show="isFinish == true"
                    ref="outputGraphRef"
                    class="output-graph card"
                ></div>
            </div>
            <div class="output-table-container card device-status-container">
                <div class="small-title-container">
                    <span style="padding-right: 3%"></span>
                    <div class="small-title-text">动力指标计算结果</div>
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
                    >
                        <div class="device-name device-item body">
                            {{ ['造床流量当量', '流速', '水位变化'][index] }}
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
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import { getPowerIndexResult, getSectionPoints } from './api.js'
import { drawOutputGraph, drawSectionGraph } from './util.js'

const sectionPoints = ref(null)
const indexValues = ref([[], [], []])
const sectionGraphRef = ref(null)
const outputGraphRef = ref(null)
const paramsFromRef = ref(null)
let outputGraphChart = null

const paramsForm = reactive({
    year: null,
    condition: null,
})
const rules = reactive({
    year: [
        {
            required: true,
            message: '请输入水文年份',
        },
    ],
    condition: [
        {
            required: true,
            message: '请输入水文条件',
        },
    ],
})
const isDisable = computed(() => {
    if (paramsForm) {
        return !(paramsForm.year && paramsForm.condition)
    } else {
        return true
    }
})

const isFinish = computed(() => indexValues.value[0].length !== 0)

const submitForm = async () => {
    const result = getPowerIndexResult()
    if (result.status === 'success') {
        ElMessage({
            message: '动力指标计算成功',
            type: 'success',
        })
        indexValues.value = [result.data.PQ, result.data.KY, result.data.ZD]
        setTimeout(() => {
            outputGraphChart.clear()
            drawOutputGraph(outputGraphChart, indexValues.value)
            outputGraphChart.resize()
        }, 10)
    } else {
        ElMessage({
            message: '动力指标计算失败',
            type: 'warning',
        })
    }
}

const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
}

onMounted(() => {
    sectionPoints.value = getSectionPoints()
    const sectionChart = echarts.init(sectionGraphRef.value)
    drawSectionGraph(
        sectionChart,
        sectionPoints.value.data.map((value) => value[2]),
    )
    outputGraphChart = echarts.init(outputGraphRef.value)
    drawOutputGraph(outputGraphChart, [null, null, null])
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
            margin-bottom: 1vh;

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

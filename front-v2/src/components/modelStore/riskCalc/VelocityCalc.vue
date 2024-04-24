<template>
    <div class="velocity-calc-content">
        <div class="model-input">
            <div class="model-params-container card">
                <el-form
                    ref="paramsFromRef"
                    :model="paramsForm"
                    class="model-params card"
                    status-icon
                >
                    <el-form-item
                        label="水文时间"
                        prop="year"
                        style="width: 90%; margin: 8px"
                    >
                        <el-input v-model="paramsForm.year" />
                    </el-form-item>
                    <el-form-item
                        label="水文条件"
                        prop="condition"
                        style="width: 90%; margin: 8px"
                    >
                        <el-select
                            v-model="paramsForm.condition"
                            placeholder="枯季"
                        >
                            <el-option label="枯季" value="dry" />
                            <el-option label="洪季" value="flood" />
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width: 90%; margin: 20px 8px">
                        <el-button
                            type="primary"
                            @click="submitForm(paramsFormRef)"
                        >
                            计算指标
                        </el-button>
                        <el-button @click="resetForm(paramsFormRef)"
                            >重置</el-button
                        >
                    </el-form-item>
                </el-form>
            </div>
            <div class="section-graph-container card">
                <div ref="sectionGraphRef" class="section-graph card"></div>
            </div>
        </div>
        <div class="model-output">
            <div class="output-graph-container card">
                <div ref="outputGraphRef" class="output-graph card"></div>
            </div>
            <div class="output-table-container card device-status-container">
                <div class="small-title-container">
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
                        v-for="(item, index) in indexList"
                        :key="index"
                    >
                        <div class="device-name device-item body">
                            {{ ['PQ', 'KY', 'ZD'][index] }}
                        </div>
                        <div class="device-count device-item body">
                            {{ item[0] }}
                        </div>
                        <div class="device-percent device-item body">
                            {{ item[1] }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, reactive, ref } from 'vue'
import { getPowerIndexResult, getSectionPoints } from './api.js'
import { drawOutputGraph, drawSectionGraph } from './util.js'

const sectionPoints = ref(null)
const PQ = ref(null)
const KY = ref(null)
const ZD = ref(null)
const indexList = ref(null)
const sectionGraphRef = ref(null)
const outputGraphRef = ref(null)
const paramsFromRef = ref(null)

const paramsForm = reactive({
    year: 0,
    condition: 'dry',
})

const submitForm = async (formEl) => {
    //
}

const resetForm = (formEl) => {
    //
}

onMounted(() => {
    sectionPoints.value = getSectionPoints()
    const result = getPowerIndexResult()
    PQ.value = result.data.PQ
    KY.value = result.data.KY
    ZD.value = result.data.ZD
    indexList.value = [PQ.value, KY.value, ZD.value]
    console.log(indexList.value)

    const sectionChart = echarts.init(sectionGraphRef.value)
    drawSectionGraph(
        sectionChart,
        sectionPoints.value.data.map((value) => value[2]),
    )
    const outputGraphChart = echarts.init(outputGraphRef.value)
    drawOutputGraph(outputGraphChart, [PQ.value[2], KY.value[2], ZD.value[2]])
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
            flex: 1 1 0;
        }
        .section-graph-container {
            flex: 1 1 0;
        }
    }
    .model-output {
        flex: 1 1 0;
        display: flex;
        flex-direction: column;

        .output-graph-container {
            flex: 1 1 0;
        }

        .output-table-container {
            flex-direction: column;
            flex: 1 1 0;
        }
    }

    .card {
        border-radius: 4px;
        margin: 1px;
        background-color: #abd5f8;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .section-graph {
        height: 90%;
        width: 95%;
        background-color: white;
    }

    .model-params {
        height: 90%;
        width: 95%;
        background-color: white;
        display: block;
    }

    .output-graph {
        height: 90%;
        width: 95%;
        background-color: white;
        display: block;
    }
}

div.device-status-container {
    margin-top: 0.5vh;
    margin-left: 2.5%;
    height: 24.2vh;

    div.small-title-container {
        width: 95%;
        margin-left: 2.5%;
        margin-top: 1vh;
        height: 3.5vh;
        line-height: 3.5vh;
        font-size: calc(0.6vw + 0.8vh);
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
        margin-left: 2.5%;
        height: 18vh;

        // background-color: #c4fbff;

        div.device-status-row {
            height: 16.6%;
            width: 100%;
            border-radius: 8px;

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
                line-height: 3.2vh;
                text-align: center;
                font-size: calc(0.6vw + 0.5vh);
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
    // background-color: #2622fd;
}
</style>

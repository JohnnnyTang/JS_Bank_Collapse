<template>
<div class="riskInfo-container">
    <div class="riskInfo-title">
        <dv-border-box2 :color="['rgb(63, 36, 214)', '#0c60af']">
            断面信息展示
        </dv-border-box2>
    </div>
    <div class="riskInfo-item profileShape">
        <div class="item-title">断面形态对比：</div>
        <div class="profile-selector-container">
            <el-select
                v-model="profileValue"
                placeholder="选择断面"
                style="width: 10vw; height: 3.5vh"
                @change="calProfileData"
                popper-class="profile-popper"
            >
                <el-option
                    v-for="item in props.profileList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                    <span class="profile-name-text">
                        {{ item.label }}
                    </span>
                </el-option>
            </el-select>
        </div>
        <div
            ref="shapeGraphRef"
            class="shape graph"
            element-loading-background="rgba(214, 235, 255,0.8)"
        ></div>
        <div class="graph-container shape">
            <div
                ref="shapeGraphRef"
                class="shape graph"
                v-loading="props.shapeChartLoad"
                element-loading-background="rgba(255, 255, 255, 0.4)"
            ></div>
            <div v-if="shapeGraphNotShow" class="empty-graph1">
                当前暂无地形数据
            </div>
        </div>
    </div>
    <div class="riskInfo-item profileErosion">
        <div class="item-title">近岸冲淤：</div>
        <div
            ref="erosionGraphRef"
            class="erosion graph"
            element-loading-background="rgba(214, 235, 255,0.8)"
        ></div>
        <div class="graph-container erosion">
            <div
                ref="erosionGraphRef"
                class="erosion graph"
                v-loading="props.erosionChartLoad"
                element-loading-background="rgba(255, 255, 255, 0.4)"
            ></div>
            <div v-if="erosionGraphNotShow" class="empty-graph2">
                当前暂无地形数据
            </div>
        </div>
    </div>
</div>]
</template>

<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue'
import { drawShapeSlopeGraph, drawErosionGraph } from './util.js'
import * as echarts from 'echarts'

const shapeGraphNotShow = ref(false)
const erosionGraphNotShow = ref(false)
const shapeGraphRef = ref(null)
const erosionGraphRef = ref(null)
let shapeChart = null
let erosionChart = null
let section;
let beforeSection;
let slopeRate;
let erosion;

const emit = defineEmits(['profileValueChange'])

const profileValue = ref(2)

const props = defineProps({
    profileData: {
        type: Object,
    },
    profileList: {
        type: Object
    },
    shapeChartLoad: {
        type: Boolean
    },
    erosionChartLoad: {
        type: Boolean
    }
})

const calProfileData = () => {
    emit('profileValueChange', profileValue.value)
    shapeGraphNotShow.value = false
    erosionGraphNotShow.value = false
    const profileDataItem = props.profileData[profileValue.value-1]
    try {
        section = profileDataItem
        .section.map((value) => {
            return value[2] < -999 ? null : value[2]
        }),
        beforeSection = profileDataItem
        .beforeSection.map((value) => {
            return value[2] < -999 ? null : value[2]
        })
        slopeRate = profileDataItem.SA[2]
        erosion = section.map((value, index) => {
            if (value !== null && beforeSection[index] !== null) {
                return value - beforeSection[index]
            } else {
                return null
            }
        })
    } catch (error) {
        DrawGraph([],[],[],[])
        shapeGraphNotShow.value = true
        erosionGraphNotShow.value = true
        return
    }
    DrawGraph(section, beforeSection, slopeRate, erosion)
}

const DrawGraph = (section, beforesection, slopeRate, erosion) => {
    // if (shapeChart !== null) {
    //     shapeChart.dispose();
    // }
    // if (erosionChart !== null) {
    //     erosionChart.dispose();
    // }
    shapeChart = echarts.init(shapeGraphRef.value)
    drawShapeSlopeGraph(
        shapeChart,
        section,
        beforesection,
        slopeRate,
    )
    erosionChart = echarts.init(erosionGraphRef.value)
    drawErosionGraph(
        erosionChart,
        erosion
    )
}

onMounted(() => {
    calProfileData()
})

watch(()=>props.profileData, ()=>{
    calProfileData()
})

</script>

<style lang="scss" scoped>
div.riskInfo-container {
        position: absolute;
        top: 20vh;
        left: 1vw;
        height: 70vh;
        width: 24vw;
        border-radius: 8px;
        border: #167aec 1px solid;
        background-color: rgba(179, 201, 228, 0.6);
        backdrop-filter: blur(10px);
        z-index: 2;

        div.riskInfo-title {
            height: 4.5vh;
            width: 10vw;
            margin-left: 6.5vw;
            margin-top: 0.6vh;
            line-height: 4.5vh;
            border-radius: 6px;
            // background-color: rgba(235, 240, 247, 0.4);
            text-align: center;
            font-family: 'Microsoft YaHei';
            font-weight: bold;
            font-size: calc(0.8vw + 0.8vh);
            color: #0c60af;
            text-shadow:
                #eef3ff 1px 1px,
                #eef3ff 2px 2px,
                #6493ff 3px 3px;

            :deep(.dv-border-box-2) {
                width: 10vw;
                height: 5vh;
            }
        }

        div.riskInfo-item {
            position: absolute;
            width: 23vw;
            left: 0.5vw;
            border-radius: 6px;
            border: #3b85e7 2px solid;

            &.profileErosion {
                top: 47vh;
                height: 22vh;
                // background-color: #b6b9eb;
            }

            &.profileShape {
                top: 6.1vh;
                height: 40vh;
                // background-color: #c9cad4;
            }

            div.item-title {
                position: absolute;
                top: 0.5vh;
                left: 0.5vw;
                font-size: calc(0.8vh + 0.6vw);
                font-weight: 600;
                font-family: 'Microsoft YaHei';
                // color: #a231e4;
                // text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
            }

            div.profile-selector-container {
                position: absolute;
                width: 10vw;
                height: 4vh;
                left: 13vw;
                // background-color: #d1d2db;

                :deep(.el-select) {
                    left: 4vw;
                    top: 0.4vh;
                    width: 5.5vw !important;
                    height: 3vh !important;
                    box-shadow:
                        rgba(0, 132, 255, 0.8) 1px 1px,
                        rgba(0, 119, 255, 0.7) 1px 1px,
                        rgba(0, 119, 255, 0.6) 2px 2px;
                    border-radius: 6px;
                }

                :deep(.el-select__wrapper) {
                    height: 3vh;
                    line-height: 3vh;
                    border-radius: 6px;
                    font-family: 'Microsoft YaHei';
                    font-weight: bold;
                    font-size: calc(0.4vw + 0.5vh);
                    background-color: rgba(230, 253, 255, 0.7);
                }

                :deep(.el-select__placeholder) {
                    color: #1c68cc;
                }

                :deep(.el-icon) {
                    width: 0.8vw;
                    height: 0.8vw;

                    svg {
                        width: 0.8vw;
                        height: 0.8vw;

                        path {
                            fill: #00098a;
                        }
                    }
                }

                :deep(.el-select__tags-text) {
                    color: #2b61f7;
                    font-size: calc(0.4vw + 0.4vh);
                }
            }

            div.graph-container {
                position: absolute;
                width: 22.5vw;
                top: 4vh;
                left: 0.25vw;

                &.shape {
                    height: 35vh;
                    backdrop-filter: blur(5px);
                    // background-color: rgba(220, 250, 248, 0.4);
                }

                &.erosion {
                    height: 17vh;
                    backdrop-filter: blur(5px);
                    // background-color: #00098a;
                }

                div.graph {
                    position: relative;
                    width: 100%;
                    height: 100%;

                    &.shape {
                        // height: 35vh;
                        // background-color: rgba(220, 250, 248, 0.4);
                    }

                    &.erosion {
                        // height: 17vh;
                        // background-color: #00098a;
                    }
                    z-index: 99;
                }

                div.empty-graph1 {
                    position: absolute;
                    left: 7vw;
                    top: 13vh;
                    display: flex;
                    align-items: center;
                    color: #1c68cc;
                    font-size: calc(0.7vw + 0.5vh);
                    font-family: 'Microsoft YaHei';
                    font-weight: bold;
                }

                div.empty-graph2 {
                    position: absolute;
                    left: 7vw;
                    top: 6vh;
                    display: flex;
                    align-items: center;
                    color: #1c68cc;
                    font-size: calc(0.7vw + 0.5vh);
                    font-family: 'Microsoft YaHei';
                    font-weight: bold;
                }
            }
        }
    }
</style>

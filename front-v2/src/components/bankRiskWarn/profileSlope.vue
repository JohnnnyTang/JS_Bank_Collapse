<template>
    <div class="riskInfo-container">
        <div class="riskInfo-title">
            <dv-border-box2 :color="['rgb(63, 36, 214)', '#0c60af']">
                岸坡最大坡比
            </dv-border-box2>
        </div>
        <div class="riskInfo-item profileSlope">
            <div class="item-title">{{ profileName }}</div>
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
                ref="slopeGraphRef"
                class="slope graph"
                element-loading-background="rgba(214, 235, 255,0.8)"
            ></div>
            <div class="graph-container slope">
                <div
                    ref="slopeGraphRef"
                    class="slope graph"
                    v-loading="props.slopeChartLoad"
                    element-loading-background="rgba(255, 255, 255, 0.4)"
                ></div>
                <div v-if="slopeGraphNotShow" class="empty-graph">
                    当前暂无地形数据
                </div>
            </div>
        </div>
    </div>
    </template>
    
    <script setup>
    import { ref, onMounted, watch, defineEmits } from 'vue'
    import { drawSlopeGraph } from './util.js'
    import * as echarts from 'echarts'
    
    const slopeGraphNotShow = ref(false)
    const slopeGraphRef = ref(null)
    let slopeChart = null
    let section
    let beforeSection
    let slopeRate;
    
    const emit = defineEmits(['profileValueChange'])
    
    const profileValue = ref(2)
    const profileName = ref('')
    
    const props = defineProps({
        profileData: {
            type: Object,
        },
        profileList: {
            type: Object
        },
        slopeChartLoad: {
            type: Boolean
        }
    })
    
    const calProfileData = () => {
        emit('profileValueChange', profileValue.value)
        slopeGraphNotShow.value = false
        const profileDataItem = props.profileData[profileValue.value-1]
        const profileInfoItem = props.profileList[profileValue.value-1]
        profileName.value = profileInfoItem.name
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
        } catch (error) {
            DrawGraph([],[],[],[])
            slopeGraphNotShow.value = true
            return
        }
        DrawGraph(beforeSection, section, slopeRate)
    }
    
    const DrawGraph = (before, after, slopeRate) => {
        // if (slopeChart !== null) {
        //     slopeChart.dispose();
        // }
        // if (erosionChart !== null) {
        //     erosionChart.dispose();
        // }
        slopeChart = echarts.init(slopeGraphRef.value)
        drawSlopeGraph(
            slopeChart,
            before,
            after,
            slopeRate,
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
        top: 43vh;
        left: 75vw;
        height: 47.5vh;
        width: 24vw;
        border-radius: 8px;
        border: #167aec 1px solid;
        background-color: rgba(179, 201, 228, 0.6);
        backdrop-filter: blur(10px);
        z-index: 2;
    
        div.riskInfo-title {
            height: 4.5vh;
            width: 10vw;
            margin-left: 7.3vw;
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
    
            &.profileSlope {
                top: 6.1vh;
                height: 40vh;
                // background-color: #c9cad4;
            }
    
            div.item-title {
                position: absolute;
                top: 0.5vh;
                left: 0.5vw;
                font-size: calc(0.6vh + 0.6vw);
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
    
                &.slope {
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
    
                    &.slope {
                        // height: 35vh;
                        // background-color: rgba(220, 250, 248, 0.4);
                    }
    
                    &.erosion {
                        // height: 17vh;
                        // background-color: #00098a;
                    }
                    z-index: 99;
                }
    
                div.empty-graph {
                    position: absolute;
                    left: 7vw;
                    top: 18vh;
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
        
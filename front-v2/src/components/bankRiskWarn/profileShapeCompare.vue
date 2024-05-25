<template>
<div class="riskInfo-container">
    <div class="riskInfo-title">
        <dv-border-box2 :color="['rgb(63, 36, 214)', '#0c60af']">
            历史断面变化
        </dv-border-box2>
    </div>
    <div class="riskInfo-item profileShape">
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
            <div v-if="shapeGraphNotShow" class="empty-graph">
                当前暂无地形数据
            </div>
        </div>
    </div>
    <div class="text-info-container">
        <div class="text-info-item">
            该断面近岸冲刷速率值为 <span style="color: red;">{{ speedList[profileValue-1]}}</span> m/年，
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue'
import { drawShapeCompareGraph } from './util.js'
import * as echarts from 'echarts'

const speedList = ref([
    3.575,4.725,2.675,5.025,4.700,5.650,3.375,3.150,4.325,3.850,1.275,0.975 
])

const shapeGraphNotShow = ref(false)
const shapeGraphRef = ref(null)
let shapeChart = null
let section;
let beforeSection;
let compareSection;
let slopeRate;

const emit = defineEmits(['profileValueChange'])

const profileValue = ref(1)
const profileName = ref('')

const props = defineProps({
    profileData: {
        type: Object,
    },
    profileDataCompare: {
        type: Object,
    },
    profileList: {
        type: Object
    },
    shapeChartLoad: {
        type: Boolean
    }
})

const calProfileData = () => {
    emit('profileValueChange', profileValue.value)
    shapeGraphNotShow.value = false
    const profileDataItem = props.profileData[profileValue.value-1]
    const profileDataCompareItem = props.profileDataCompare[profileValue.value-1]
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
        compareSection = profileDataCompareItem
        .beforeSection.map((value) => {
            return value[2] < -999 ? null : value[2]
        })
    } catch (error) {
        DrawGraph([],[],[],[])
        shapeGraphNotShow.value = true
        return
    }
    DrawGraph(section, beforeSection, compareSection)
}

const DrawGraph = (section, beforesection, compareSection) => {
    // if (shapeChart !== null) {
    //     shapeChart.dispose();
    // }
    // if (erosionChart !== null) {
    //     erosionChart.dispose();
    // }
    shapeChart = echarts.init(shapeGraphRef.value)
    drawShapeCompareGraph(
        shapeChart,
        section,
        beforesection,
        compareSection,
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
    top: 46.5vh;
    left: 1vw;
    height: 43vh;
    width: 30vw;
    border-radius: 8px;
    border: #167aec 1px solid;
    background-color: rgba(179, 201, 228, 0.6);
    backdrop-filter: blur(10px);
    z-index: 2;

    div.riskInfo-title {
        height: 2vh;
        width: 10vw;
        margin-left: 10vw;
        margin-top: 0.6vh;
        line-height: 4.3vh;
        border-radius: 6px;
        // background-color: rgba(235, 240, 247, 0.4);
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        font-size: calc(0.8vw + 0.7vh);
        color: #0c60af;
        text-shadow:
            #f1f1ef 1px 1px,
            #eef3ff 2px 2px,
            #6493ff 3px 3px;

        :deep(.dv-border-box-2) {
            width: 10vw;
            height: 4.6vh;
        }
    }

    div.riskInfo-item {
        position: absolute;
        width: 28.9vw;
        left: 0.5vw;
        border-radius: 6px;
        border: #3b85e7 2px solid;

        &.profileShape {
            top: 5.5vh;
            height: 30vh;
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
            left: 19vw;
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
            width: 28.3vw;
            top: 4vh;
            left: 0.25vw;

            &.shape {
                height: 25.5vh;
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

    div.text-info-container {
        position:absolute;
        top: 36.8vh;
        width: 29vw;
        height: 5.25vh;
        left: 0.5vw;
        background-color: rgba(18, 161, 218, 0.5);
        border-radius: 5px;

        div.text-info-item {
            position: absolute;
            left: 6vw;
            top: 1.3vh;
            color: #070707;
            font-size: calc(0.7vw + 0.5vh);
            font-family: 'Microsoft YaHei';
            font-weight: bold;
        }
    }
}
</style>
    
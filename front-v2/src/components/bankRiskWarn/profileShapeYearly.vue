<template>
    <div class="riskInfo-container">
        <div class="riskInfo-title">
            <dv-border-box2 :color="['rgb(63, 36, 214)', '#0c60af']">
                岸坡断面形态变化
            </dv-border-box2>
        </div>
        <div class="riskInfo-item profileShape">
            <div class="item-title">{{ profileName }}</div>
            <div class="profile-selector-container">
                <el-select v-model="profileValue" placeholder="选择断面" style="width: 10vw; height: 3.5vh"
                    @change="calProfileData" popper-class="profile-popper">
                    <el-option v-for="item in props.profileList" :key="item.value" :label="item.label" :value="item.value">
                        <span class="profile-name-text">
                            {{ item.label }}
                        </span>
                    </el-option>
                </el-select>
            </div>
            <div ref="shapeYearlyGraphRef" class="shape graph" element-loading-background="rgba(214, 235, 255,0.8)"></div>
            <div class="graph-container shape">
                <div ref="shapeYearlyGraphRef" class="shape graph" v-loading="props.shapeYearlyChartLoad"
                    element-loading-background="rgba(255, 255, 255, 0.4)"></div>
                <div v-if="shapeYearlyGraphNotShow" class="empty-graph">
                    当前暂无地形数据
                </div>
            </div>
        </div>
        <div class="text-info-container">
            <div class="text-info-item">
                该断面滩槽高差为 <span style="color: red;">{{ gaochaList[profileValue - 1] }}</span> m，
                <!-- 最大岸坡坡比为 <span style="color: red;">{{ pobiList[profileValue-1] }}</span> -->
                最大岸坡坡比为
                <span v-if="profileValue - 1 === 5" style="color: red;">1 / 1.7</span>
                <span v-else-if="profileValue - 1 === 6" style="color: red;">1 / 1.8</span>
                <span v-else-if="profileValue - 1 === 7" style="color: red;">1 / 2.2</span>
                <span v-else style="color: red;">{{ pobiList[profileValue - 1] }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue'
import { drawShapeYearlyGraph } from './util.js'
import * as echarts from 'echarts'

const shapeYearlyGraphNotShow = ref(false)
const shapeYearlyGraphRef = ref(null)
let shapeYearlyChart = null
let section;

const gaochaList = ref([38.27, 32.72, 33.56, 30.84, 34.94, 32.88,
    33.65, 31.45, 28.53, 27.61, 27.01, 25.73])
const pobiList = ref(["1/4.1", "1/3.9", "1/4.0", "1/6.3", "1/3.9", "1/3.3", "1/3.1", "1/3.1", "1/6.5", "1/7.9", "1/11.3", "1/11.0"])

const emit = defineEmits(['profileValueChange'])

const profileValue = ref(3)
const profileName = ref('')

const props = defineProps({
    profileData: {
        type: Object,
    },
    profileList: {
        type: Object
    },
    shapeYearlyChartLoad: {
        type: Boolean
    }
})

const calProfileData = () => {
    emit('profileValueChange', profileValue.value)
    shapeYearlyGraphNotShow.value = false
    const profileDataItem = props.profileData[profileValue.value - 1]
    const profileInfoItem = props.profileList[profileValue.value - 1]
    profileName.value = profileInfoItem.name
    try {
        section = profileDataItem
            .section.map((value) => {
                return value[2] < -999 ? null : value[2]
            })
    } catch (error) {
        DrawGraph([])
        shapeYearlyGraphNotShow.value = true
        return
    }
    DrawGraph(section)
}

const DrawGraph = (section) => {
    // if (shapeYearlyChart !== null) {
    //     shapeYearlyChart.dispose();
    // }
    // if (erosionChart !== null) {
    //     erosionChart.dispose();
    // }
    shapeYearlyChart = echarts.init(shapeYearlyGraphRef.value)
    drawShapeYearlyGraph(
        shapeYearlyChart,
        section
    )
}

onMounted(() => {
    calProfileData()
})

watch(() => props.profileData, () => {
    calProfileData()
})

</script>

<style lang="scss" scoped>
div.riskInfo-container {
    position: absolute;
    top: 16vh;
    left: 0.3vw;
    height: 38vh;
    width: 26vw;
    border-radius: 8px;
    border: #167aec 1px solid;
    background-color: rgba(179, 201, 228, 0.6);
    backdrop-filter: blur(10px);
    z-index: 2;

    div.riskInfo-title {
        height: 2vh;
        width: 10vw;
        margin-left: 7.5vw;
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
            #eef3ff 1px 1px,
            #eef3ff 2px 2px,
            #6493ff 3px 3px;

        :deep(.dv-border-box-2) {
            width: 10vw;
            height: 4.6vh;
        }
    }

    div.riskInfo-item {
        position: absolute;
        width: 25vw;
        left: 0.5vw;
        border-radius: 6px;
        border: #3b85e7 2px solid;

        &.profileShape {
            top: 5.5vh;
            height: 27vh;
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
            left: 15vw;
            // background-color: #d1d2db;

            :deep(.el-select) {
                left: 4vw;
                top: 0.4vh;
                width: 5.5vw !important;
                height: 3vh !important;
                box-shadow:
                    rgba(0, 132, 255, 0.8) 1px 1px,
                    rgba(255, 145, 0, 0.7) 1px 1px,
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
            width: 24vw;
            top: 4vh;
            left: 0.25vw;

            &.shape {
                height: 22.5vh;
                backdrop-filter: blur(5px);
                // background-color: rgba(220, 250, 248, 0.4);
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
                left: 6vw;
                top: 17vh;
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
        position: absolute;
        top: 33vh;
        width: 25vw;
        height: 4.5vh;
        left: 0.5vw;
        bottom: 2vh;
        background-color: rgba(7, 24, 182, 0.5);
        border-radius: 5px;

        div.text-info-item {
            position: absolute;
            left: 2vw;
            top: 1vh;
            color: #f2f4f7;
            font-size: calc(0.6vw + 0.6vh);
            font-family: 'Microsoft YaHei';
            font-weight: bold;
        }
    }
}
</style>
    
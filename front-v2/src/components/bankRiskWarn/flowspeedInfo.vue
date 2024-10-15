<template>
    <div class="flowspeed-content">
        <div class="flowspeed-title">
            近岸计算流速
        </div>
        <div class="profile-selector-container" v-show="false">
            <div class="select-descriptiopn">水文条件选择：</div>
            <el-select v-model="waterConditionValue" placeholder="选择水文条件" style="width: 5vw; height: 3.5vh"
                @change="calFlowspeedData" popper-class="water-condition-popper">
                <el-option v-for="item in waterCondition" :key="item.value" :label="item.label" :value="item.value">
                    <span class="profile-name-text">
                        {{ item.label }}
                    </span>
                </el-option>
            </el-select>
        </div>
        <div class="riskInfo-item flowspeed">
            <!-- <div class="item-title">
                沿岸流速分布：
            </div> -->

            <!-- <div class="profile-condition-container">
                <div class="profile-condition-text">
                    当前水文条件：{{ props.type }}
                </div>
            </div> -->
            <!-- <div ref="flowGraphRef" class="flowspeed graph" element-loading-background="rgba(214, 235, 255,0.8)"></div> -->
            <div class="graph-container flowspeed" id="flowspeed-chart-container">
                <div id="flowspeed-chart" ref="flowspeedGraphRef" class="flowspeed graph" v-loading="props.flowspeedChartLoad"
                    element-loading-background="rgba(255, 255, 255, 0.4)"></div>
            </div>
        </div>
        <div class="riskInfo-item flowfield">
            <div class="item-title">
                流场信息：
            </div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted, watch } from 'vue'
import { drawFlowspeedGraph } from './util.js'
const props = defineProps({
    profileList: {
        type: Object,
    },
    // waterCondition: {
    //     type: Object,
    // },
    flowspeedChartLoad: {
        type: Boolean,
    },
    type: {
        type: String
    }
})
const emit = defineEmits(['conditionChange'])
const waterCondition = [
    {
        value: 1,
        label: "洪季"
    },
    {
        value: 2,
        label: "枯季"
    },
]

let flowspeedChart = null
const flowspeedGraphRef = ref(null)
const waterConditionValue = ref(1)

const calFlowspeedData = (val) => {
    console.log('changed', val)
    let res = waterCondition.find((item) => {
        return item.value === val
    })
    emit('conditionChange', res.label)
    drawFlowspeedGraph(flowspeedChart, flowSpeedList[val - 1])
}

const flowSpeedList = [
    [0.418, 0.452, 0.516, 1.243, 1.547, 1.37, 1.525, 1.167, 0.999, 1.043, 1.21, 0.951],
    [0.218, 0.182, 0.316, 0.543, 0.947, 0.843, 1.125, 1.07, 0.789, 0.643, 0.38, 0.451],
    [0.488, 0.472, 0.632, 0.988, 1.142, 1.623, 1.512, 1.647, 1.199, 1.043, 1.121, 0.843],
]

const DrawGraph = () => {
    flowspeedChart = echarts.init(flowspeedGraphRef.value)
    // const flowspeed = props.profileList.map(item => item.flowspeed)
    const flowspeed = [0.418, 0.452, 0.516, 1.243, 1.547, 1.37, 1.525, 1.167, 0.999, 1.043, 1.21, 0.951]

    drawFlowspeedGraph(flowspeedChart, flowspeed)
}

onMounted(() => {
    DrawGraph()
})

watch(props.profileList, () => {
    DrawGraph()
})
</script>

<style lang="scss" scoped>
div.flowspeed-content {
    position: absolute;
    top: 40.5vh;
    height: 25vh;
    // left: 1vw;
    // width: 30.2vw;
    left: 0.3vw;
    width: 26vw;
    border-radius: 4px;
    // border: #167aec 1px solid;
    box-shadow: 12px 12px 20px -10px rgba(0, 0, 0, 0.8);
    background-color: rgb(208, 236, 255);
    backdrop-filter: blur(5px);
    z-index: 2;

    div.flowspeed-title {
        position: absolute;
        padding-left: 1vw;
        height: 4.2vh;
        width: 25vw;
        line-height: 4.5vh;
        border-radius: 6px;
        // background-color: rgba(235, 240, 247, 0.4);
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        font-size: calc(0.6vw + 0.6vh);
        box-shadow: 0px 3px rgb(49, 121, 255);
        color: rgb(0, 138, 218);
        background-color: rgb(240, 248, 255);
        display: flex;
    }

    div.riskInfo-item {
        position: absolute;
        height: 19.3vh;
        width: 25vw;
        top: 5vh;
        border-radius: 6px;
        border: #3b85e7 2px solid;

        &.flowspeed {
            // right: 9.5vw;
            width: 18vw;
            // background-color: #b6b9eb;
        }

        &.flowfield {
            right: 0.4vw;
            width: 7vw;
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



        div.profile-condition-container {
            position: absolute;
            width: 7.2vw;
            height: 3vh;
            left: 12.6vw;
            top: 0.3vh;
            background-color: rgba(143, 161, 219, 0.4);
            border-radius: 4px;

            div.profile-condition-text {
                position: absolute;
                left: 0.4vw;
                top: 0.5vh;
                width: 8vw;
                height: 2vh;
                font-size: calc(0.6vh + 0.4vw);
                font-weight: 600;
                font-family: 'Microsoft YaHei';
            }
        }

        div.graph-container {
            position: absolute;
            width: 19.5vw;
            top: 0.5vh;
            left: 0.25vw;

            &.flowspeed {
                height: 15vh;
                width: 17vw;
                backdrop-filter: blur(5px);
                // background-color: #00098a;
            }

            div.graph {
                position: relative;
                width: 100%;
                height: 100%;

                &.flowspeed {
                    width: 17vw;
                    height: 15vh;
                    // background-color: #00098a;
                    // height: 17vh;
                    // background-color: #00098a;
                }
            }
        }
    }


}

div.profile-selector-container {
    position: absolute;
    width: 13vw;
    height: 4vh;
    right: 1vw;
    // background-color: #d1d2db;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    .select-descriptiopn {
        width: 6vw;
        margin-right: 0vw;
        line-height: 4vh;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        font-size: calc(0.6vw + 0.4vh);
        box-shadow: 0px 3px rgb(49, 121, 255);
        color: rgb(0, 80, 166);
        display: flex;
    }

    :deep(.el-select) {
        // left: 4vw;
        top: 0.4vh;
        width: 6.5vw !important;
        height: 3vh !important;
        box-shadow:
            rgba(248, 248, 248, 0.3) 1px 1px,
            rgba(171, 184, 211, 0.7) 1px 1px,
            rgba(243, 244, 245, 0.6) 2px 2px;
        border-radius: 6px;
    }

    :deep(.el-select__wrapper) {
        height: 3vh;
        line-height: 3vh;
        border-radius: 6px;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        font-size: calc(0.4vw + 0.5vh);
        background-color: rgba(165, 219, 253, 0.9);
    }

    :deep(.el-select__placeholder) {
        color: rgb(0, 80, 166);
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

div#flowspeed-chart-container{
    margin-top: 0;
}

div#flowspeed-chart{
    width: 17.5vw;
    height: 18vh;
}
</style>

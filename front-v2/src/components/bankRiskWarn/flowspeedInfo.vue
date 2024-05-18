<template>
    <div class="flowspeed-content">
        <div class="flowspeed-title">
            <dv-border-box2 :color="['rgb(63, 36, 214)', '#0c60af']">
                流速信息展示
            </dv-border-box2>
        </div>
        <div class="riskInfo-item flowspeed">
            <div class="item-title">
                沿岸流速分布：
            </div>
            <div ref="flowGraphRef" class="flowspeed graph" element-loading-background="rgba(214, 235, 255,0.8)"></div>
            <div class="graph-container flowspeed">
                <div 
                    ref="flowspeedGraphRef"
                    class="flowspeed graph"
                    v-loading="flowspeedChartLoad"
                    element-loading-background="rgba(255, 255, 255, 0.4)"
                ></div>
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
})
const profileList = ref(props.profileList)

let flowspeedChart = null
const flowspeedGraphRef = ref(null)
const flowspeedChartLoad = ref(true)

const DrawGraph = (profileList) => {
    flowspeedChart = echarts.init(flowspeedGraphRef.value)
    const flowspeed = profileList.map(item => item.flowspeed)
    drawFlowspeedGraph(flowspeedChart, flowspeed)
}

onMounted(() => {
    flowspeedChartLoad.value = true
    DrawGraph(profileList.value)
    flowspeedChartLoad.value = false
})

watch(props.profileList, (newVal) => {
    DrawGraph(newVal)
})
</script>

<style lang="scss" scoped>
div.flowspeed-content{
    position: absolute;
    top: 57vh;
    right: 1vw;
    height: 30vh;
    width: 30.2vw;
    border-radius: 8px;
    border: #167aec 1px solid;
    background-color: rgba(179, 201, 228, 0.6);
    backdrop-filter: blur(5px);
    z-index:2;

    div.flowspeed-title {
        position: absolute;
        left: 9.5vw;
        height: 4.6vh;
        width: 15vw;
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
        display: flex;

        :deep(.dv-border-box-2) {
            width: 10vw;
            height: 4.6vh;
        }
    }

    div.riskInfo-item {
        position: absolute;
        height: 23vh;
        top: 6vh;
        border-radius: 6px;
        border: #3b85e7 2px solid;

        &.flowspeed {
            right: 9.5vw;
            width: 20vw;
            // background-color: #b6b9eb;
        }

        &.flowfield {
            right: 0.4vw;
            width: 8.5vw;
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

        div.graph-container {
            position: absolute;
            width: 19.5vw;
            top: 4vh;
            left: 0.25vw;

            &.flowspeed {
                height: 18.5vh;
                backdrop-filter: blur(5px);
                // background-color: #00098a;
            }

            div.graph {
                position: relative;
                width: 100%;
                height: 100%;
                
                &.flowspeed {
                    // height: 17vh;
                    // background-color: #00098a;
                }
            }
        }
    }
}
</style>

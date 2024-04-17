<template>
    <div class="pure-chart">
        <div class="buttons">
            <div
                class="button"
                :class="{ active: selectedIndex === index }"
                v-for="(name, index) in dataAssitant.chartOptions.names"
                @click="showChart(index)"
                :key="index"
            >
                {{ name }}
            </div>
        </div>

        <div class="chart" id="chart" ref="chartDomRef"></div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'
import { MonitorDataAssistant } from './ChartData'

const props = defineProps({
    selectedFeature: Object,
})

const selectedIndex = ref(1)

let myChart
let chartDomRef
let dataAssitant = ref(new MonitorDataAssistant())

const showChart = (index) => {
    selectedIndex.value = index
    if (myChart) {
        myChart.clear()
        myChart.setOption(dataAssitant.value.chartOptions.options[index])
    } else {
        console.log('chart not prepared')
    }
}

onMounted(async () => {
    // console.log(chartDomRef.style)
    // chartDomRef.style.width = '340px'
    // chartDomRef.style.height = '290px'
    await nextTick()
    console.log("popup !!! feature", props.selectedFeature.value);

    myChart = echarts.init(chartDomRef)
    dataAssitant.value = new MonitorDataAssistant(props.selectedFeature.value)
    await dataAssitant.value.getMonitoringdata()
    dataAssitant.value.getProcessedDataObject()
    dataAssitant.value.getChartOptions()

    myChart.setOption(dataAssitant.value.chartOptions.options[1])
})
</script>

<style lang="scss" scoped>
$Color1: rgb(163, 206, 245);
$Color2: rgb(218, 236, 251);
$Color3: rgb(37, 77, 200);
$Color4: rgb(47, 94, 211);
$Color5: rgb(6, 102, 192);

.pure-chart {
    user-select: none;
    position: relative;
    width: 16vw;
    height: 32vh;
    padding: calc(0.5vh + 0.2vw);
    background-color: $Color1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        width: 100%;
        height: 5vh;
        align-items: center;
        font-size: calc(0.5vh + 0.5vw);
        transition: 1s;

        .button {
            width: auto;
            border-radius: 10px;
            background-color: $Color5;
            color: $Color2;
            padding: 7px;
            margin-bottom: 1vh;

            &:hover {
                cursor: pointer;
            }
            &:active {
                transform: scale(1.02);
            }
        }

        .active {
            background-color: rgb(6, 142, 192);
        }
    }

    .chart {
        width: 16vw;
        height: 34vh;
        background-color: rgb(255, 255, 255);
    }
}
</style>

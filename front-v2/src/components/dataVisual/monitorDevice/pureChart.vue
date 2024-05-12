<template>
    <div class="pure-chart">
        <div class="buttons">
            <div class="button" :class="{ active: selectedIndex === index }"
                v-for="(name, index) in dataAssitant.chartOptions.names" @click="showChart(index)">
                {{ name }}
            </div>
        </div>

        <!-- <div class="chart" id="chart"></div> -->
        <div class="chart" ref="chartRef"></div>

    </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import BackEndRequest from '../../../api/backend';
import * as echarts from 'echarts'
import 'echarts-gl';
import { MonitorDataAssistant } from './ChartData'
import { useSceneStore } from '../../../store/mapStore';

const selectedFeature = computed(() => useSceneStore().selectedFeature)
const selectedIndex = ref(0)
const chartRef = ref()

let myChart
let chartDom
let dataAssitant = ref(new MonitorDataAssistant())

const showChart = (index) => {
    selectedIndex.value = index;
    if (myChart) {
        myChart.clear()
        myChart.setOption(dataAssitant.value.chartOptions.options[index])
    } else {
        console.log('chart not prepared');
    }
}

// watch(selectedFeature, async (newV, oldV) => {
//     selectedIndex.value = 0;
//     myChart && myChart.clear()
//     if (newV) {
//         dataAssitant.value = new MonitorDataAssistant(newV)
//         await dataAssitant.value.getMonitoringdata()
//         dataAssitant.value.getProcessedDataObject()
//         dataAssitant.value.getChartOptions()
//         myChart.setOption(dataAssitant.value.chartOptions.options[0])
//     }
// })




onMounted(async () => {
    // chartDom = document.getElementById('chart');
    myChart = echarts.init(chartRef.value);
    myChart.showLoading()


    if (selectedFeature.value) {
        dataAssitant.value = new MonitorDataAssistant(selectedFeature.value)

        await dataAssitant.value.getMonitoringdata()
        dataAssitant.value.getProcessedDataObject()
        dataAssitant.value.getChartOptions()
        myChart.hideLoading()

        myChart.setOption(dataAssitant.value.chartOptions.options[0])
    }
    window.onresize = function () {
        myChart.resize();
    }
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
            background-color: $Color5 ;
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
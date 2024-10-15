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

        <div class="return-button" @click="clickbuttonHandler">
            返回</div>

    </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import * as echarts from 'echarts'
import { MonitorDataAssistant } from './ChartData'
import { useSceneStore } from '../../../store/mapStore';

const selectedFeature = computed(() => useSceneStore().selectedFeature)
const selectedIndex = ref(0)
const chartRef = ref()
const emit = defineEmits(['close'])


let myChart
let chartDom
let dataAssitant = ref(new MonitorDataAssistant())



const clickbuttonHandler = () => {
    emit('close')
}


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


setTimeout(() => {
    console.log(selectedFeature.value)
}, 1000);



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
    width: 32vw;
    height: 38vh;
    padding: calc(0.5vh + 0.2vw);
    background-color: $Color1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        width: 70%;
        margin-left: 30%;
        height: 5vh;
        align-items: center;
        font-size: calc(0.5vh + 0.5vw);
        transition: 1s;

        .button {
            width: auto;
            height: 3vh;
            line-height: 3vh;
            padding-left: 0.5vw;
            padding-right: 0.5vw;
            border-radius: 10%;

            color: #ffffff;
            box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.5);
       
            background: radial-gradient(ellipse at center, #2692da 0%, #0529ac 100%);
            transition: all ease-in-out 0.3s;

            font-size: calc(0.5vw + 0.7vh);

            &:hover {
                cursor: pointer;
                box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.35);
                color: #ffffff;
            }
        }

        .active {
            background-color: rgb(6, 142, 192);
        }
    }


    .chart {
        width: 100%;
        height: 100%;
        background-color: rgb(255, 255, 255);
    }

    .return-button {
        position: absolute;
        left: 0.5vw;
        margin-top: 0.5vh;
        width: 4vw;
        height: 3vh;
        line-height: 3vh;

        border-radius: 10%;
        text-align: center;
        color: #ffffffe6;
        font-size: calc(0.5vw + 0.7vh);


        box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.35);
        // background: radial-gradient(ellipse at center, #2692da 0%, #0529ac 100%);
        background-color: #2692da;
        transition: all ease-in-out 0.3s;

        &:hover {
            cursor: pointer;
            box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.5);
            color: #ffffff;
        }
    }

}
</style>
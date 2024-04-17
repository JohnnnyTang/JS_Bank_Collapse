<template>
    <div class="pure-chart">
        <div class="buttons">
            <div class="button" :class="{ active: selectedIndex === index }" v-for="(name, index) in dataAssitant.chartOptions.names" @click="showChart(index)">
                {{ name }}
            </div>
        </div>

        <div class="chart" id="chart"></div>
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

watch(selectedFeature, async (newV, oldV) => {
    selectedIndex.value = 0;
    myChart && myChart.clear()
    if (newV) {
        dataAssitant.value = new MonitorDataAssistant(newV)
        await dataAssitant.value.getMonitoringdata()
        dataAssitant.value.getProcessedDataObject()
        dataAssitant.value.getChartOptions()
        myChart.setOption(dataAssitant.value.chartOptions.options[0])
    }


})




onMounted(async () => {
    chartDom = document.getElementById('chart');
    myChart = echarts.init(chartDom);

    console.log('!!!',selectedFeature.value);
    dataAssitant.value = new MonitorDataAssistant(selectedFeature.value)
    
    await dataAssitant.value.getMonitoringdata()
    dataAssitant.value.getProcessedDataObject()
    dataAssitant.value.getChartOptions()

    myChart.setOption(dataAssitant.value.chartOptions.options[0])


    //#region  for test
    //////////for gnss
    // let gnssMonitorInfo = (await BackEndRequest.getSpecMonitorInfo("1")).data
    // let oneGnss = new MonitorDataAssistant(gnssMonitorInfo[0])
    // await oneGnss.getMonitoringdata()
    // oneGnss.getProcessedDataObject()
    // options.value = oneGnss.getChartOptions().options
    // console.log(oneGnss);

    /////////for inclinometer 
    // let inclinometerInfo = (await BackEndRequest.getSpecMonitorInfo("2")).data
    // let oneInclinometer = new MonitorDataAssistant(inclinometerInfo[0])
    // await oneInclinometer.getMonitoringdata()
    // oneInclinometer.getProcessedDataObject()
    // options.value = oneInclinometer.getChartOptions().options
    // console.log(oneInclinometer);



    ///////for manometer
    // let manometerInfo = (await BackEndRequest.getSpecMonitorInfo("3")).data
    // let oneManometer = new MonitorDataAssistant(manometerInfo[0])
    // await oneManometer.getMonitoringdata()
    // oneManometer.getProcessedDataObject()
    // options.value = oneManometer.getChartOptions().options
    // console.log(oneManometer);





    /////////for stress
    // let stressInfo = (await BackEndRequest.getSpecMonitorInfo("4")).data
    // let oneStress = new MonitorDataAssistant(stressInfo[0])
    // await oneStress.getMonitoringdata()
    // oneStress.getProcessedDataObject()
    // options.value = oneStress.getChartOptions().options 
    // console.log(oneStress);



    // function run(i) {
    //     console.log(i);
    //     myChart&&myChart.setOption({
    //         series: [
    //             {
    //                 type: 'bar',
    //                 name: oneManometer.processedData.depth_value_time[i],
    //                 data: oneManometer.processedData.pressureArrBytime[i],
    //             }
    //         ]
    //     });
    // }
    // let count = 1;
    // setInterval(function () {
    //     run(count);
    //     count = (count + 1) % 8
    // }, 3000);

    // window.addEventListener("keydown", (e) => {
    //     if (e.key == '1') {
    //         myChart.clear()
    //         let count = 1
    //         myChart.setOption(oneStress.chartOptions.options[0])

    //         setInterval(function () {
    //             let gaugeData = MonitorDataAssistant.getOnegaugeData(oneStress.processedData.horizontalAngle[count], oneStress.processedData.legendData)
    //             myChart.setOption({
    //                 series: [
    //                     {
    //                         data: gaugeData
    //                     }
    //                 ]
    //             });
    //             count = (count + 1) % 10
    //         }, 2000);
    //     }
    //     if (e.key == '2') {
    //         myChart.clear()
    //         myChart.setOption(oneStress.chartOptions.options[0])
    //     }
    //     if (e.key == '3') {
    //         myChart.clear()
    //         myChart.setOption(oneStress.chartOptions.options[1])
    //     }
    // })

    //#endregion

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
          
            
            &:hover{
                cursor: pointer;
            }
            &:active{
                transform: scale(1.02);
            }
        }

        .active{
            background-color:  rgb(6, 142, 192);
        }
    }


    .chart {
        width: 16vw;
        height: 34vh;
        background-color: rgb(255, 255, 255);
    }

}
</style>
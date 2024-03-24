<template>
    <div class="monitor-chart-container">

        <div class="icon-container" @click="showMainPart = !showMainPart">
            <div class="icon" :style="{ backgroundImage: `url(${iconSrc})` }"></div>
        </div>
        <Transition name="slidefade">
            <div v-show="showMainPart" class="main-part">
                <button v-for="(option, index) in options" @click="showChart(option)" class="btn">
                    {{ index }}
                </button>
                <div class="chart" id="chart"></div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import VueDragResize from 'vue-drag-resize/src'
import { onMounted, watchEffect, ref, computed, watch } from 'vue';
import BackEndRequest from '../../../api/backend';
import * as echarts from 'echarts'
import 'echarts-gl';
import { MonitorDataAssistant } from './ChartData'

const props = defineProps({
    oneSpecMonitorMetaInfo: Object,
})
const options = ref([])
const showMainPart = ref(false)
const iconSrc = computed(() => {
    return showMainPart.value ? './icons/resize.png' : './icons/watching.png'
})

let myChart
let chartDom
let dataAssitant

// watchEffect(async () => {
//     console.log(props);
//     if (props.oneSpecMonitorMetaInfo) {
//         console.log(props.oneSpecMonitorMetaInfo);
//         dataAssitant = new MonitorDataAssistant(props.oneSpecMonitorMetaInfo)
//         await dataAssitant.getMonitoringdata()
//         dataAssitant.getProcessedDataObject()
//         options.value = dataAssitant.getChartOptions()
//     }
// })

watch(props, async (newV, oldV) => {
    if (newV.oneSpecMonitorMetaInfo) {
        myChart && myChart.clear()
        console.log(newV.oneSpecMonitorMetaInfo);
        dataAssitant = new MonitorDataAssistant(newV.oneSpecMonitorMetaInfo)
        await dataAssitant.getMonitoringdata()
        dataAssitant.getProcessedDataObject()
        options.value = dataAssitant.getChartOptions().options
        console.log(options.value);
    }
})

const showChart = (opt) => {
    if (myChart) {
        myChart.clear()
        myChart.setOption(opt)
    } else {
        console.log('chart not prepared');
    }
}


onMounted(async () => {
    //////////for gnss
    // let gnssMonitorInfo = (await BackEndRequest.getSpecMonitorInfo("1")).data
    // let oneGnss = new MonitorDataAssistant(gnssMonitorInfo[0])
    // await oneGnss.getMonitoringdata()
    // oneGnss.getProcessedDataObject()
    // oneGnss.getChartOptions()

    /////////for inclinometer 
    // let inclinometerInfo = (await BackEndRequest.getSpecMonitorInfo("2")).data
    // let oneInclinometer = new MonitorDataAssistant(inclinometerInfo[0])
    // await oneInclinometer.getMonitoringdata()
    // oneInclinometer.getProcessedDataObject()
    // oneInclinometer.getChartOptions()



    /////////for manometer
    // let manometerInfo = (await BackEndRequest.getSpecMonitorInfo("3")).data
    // let oneManometer = new MonitorDataAssistant(manometerInfo[0])
    // await oneManometer.getMonitoringdata()
    // oneManometer.getProcessedDataObject()
    // oneManometer.getChartOptions()


    /////////for stress
    // let stressInfo = (await BackEndRequest.getSpecMonitorInfo("4")).data
    // let oneStress = new MonitorDataAssistant(stressInfo[0])
    // await oneStress.getMonitoringdata()
    // oneStress.getProcessedDataObject()
    // oneStress.getChartOptions()


    chartDom = document.getElementById('chart');
    myChart = echarts.init(chartDom);

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

    window.onresize = function () {
        myChart.resize();
    }
})


/**
=============Monitor Infomation================
{
    "begTime": "2024-01-02 00:00:00",
    "code": "MZS120.529408_32.033683_1",
    "elevation": 89.7,
    "endTime": "2024-01-12 00:00:00",
    "inTime": "2024-01-02 00:00:00",
    "latitude": 32.033683,
    "longitude": 120.529408,
    "machineId": "Machine001",
    "name": "GNSS",
    "operateDesc": "Notes for Device1",
    "operateFlag": 1,
    "operateTime": "2024-01-06 00:00:00",
    "operateUser": "chry",
    "stationCode": "MZS",
    "type": "1"
}
{
    "begTime": "2024-01-02 00:00:00",
    "code": "MZS120.528701_32.034685_2",
    "elevation": 96.2,
    "endTime": "2024-01-12 00:00:00",
    "inTime": "2024-01-02 00:00:00",
    "latitude": 32.034685,
    "longitude": 120.528701,
    "machineId": "Machine002",
    "name": "测斜仪",
    "operateDesc": "Notes for Device2",
    "operateFlag": 1,
    "operateTime": "2024-01-06 00:00:00",
    "operateUser": "chry",
    "stationCode": "MZS",
    "type": "2"
}
{
    "begTime": "2024-01-02 00:00:00",
    "code": "MZS120.531984_32.032682_3",
    "elevation": 98.7,
    "endTime": "2024-01-12 00:00:00",
    "inTime": "2024-01-02 00:00:00",
    "latitude": 32.032682,
    "longitude": 120.531984,
    "machineId": "Machine003",
    "name": "孔隙水压力计",
    "operateDesc": "Notes for Device3",
    "operateFlag": 1,
    "operateTime": "2024-01-06 00:00:00",
    "operateUser": "chry",
    "stationCode": "MZS",
    "type": "3"
}
{
    "begTime": "2024-01-02 00:00:00",
    "code": "MZS120.530415_32.033657_4",
    "elevation": 100.2,
    "endTime": "2024-01-12 00:00:00",
    "inTime": "2024-01-02 00:00:00",
    "latitude": 32.033657,
    "longitude": 120.530415,
    "machineId": "Machine004",
    "name": "应力桩",
    "operateDesc": "Notes for Device4",
    "operateFlag": 1,
    "operateTime": "2024-01-06 00:00:00",
    "operateUser": "chry",
    "stationCode": "MZS",
    "type": "4"
}
 */

</script>

<style lang="scss" scoped>
.monitor-chart-container {

    user-select: none;
    background-color: rgb(0, 217, 255);

    .icon-container {
        position: absolute;
        right: 2vw;
        bottom: 10vh;
        z-index: 10;

        //size and border
        width: 6.5vh;
        height: 6.5vh;
        background-color: rgb(255, 245, 245);
        border-radius: 6vh;
        //center
        display: flex;
        align-items: center;
        justify-content: center;

        .icon {
            width: 5vh;
            height: 5vh;
            background-size: contain;
            transition: 300ms;

            &:hover {
                cursor: pointer;
            }

            &:active {
                transform: rotate3d(0, 1, 1, 15deg);
                cursor: pointer;
            }
        }

    }

    .main-part {
        position: absolute;
        right: 2vw;
        bottom: 10vh;
        //height: 25vh;
        // width: 25vw;
        padding: 10px;
        background: linear-gradient(45deg, #C9E1F5, #E2FFEE);

        .btn {
            border-radius: 10px;
            background-color: white;
            color: rgb(3, 3, 100);
            font-weight: 600;
        }

        .chart {
            width: 25vw;
            height: 25vh;
            background-color: aliceblue;
        }
    }




    .slidefade-enter-active,
    .slidefade-leave-active {
        transition: opacity 300ms linear;
    }

    .slidefade-enter-from,
    .slidefade-leave-to {
        opacity: 0;
    }

}
</style>
<template>
    <div class="monitor-chart-parent">
        <div class="monitor-chart-container" v-draggable="{ 'bounds': 'parent' }">

            <div class="icon-container" @click="showMainPart = !showMainPart">
                <div class="icon" :style="{ backgroundImage: `url(${iconSrc})` }"></div>
            </div>

            <Transition name="slidefade">

                <div v-show="showMainPart" class="main-part">

                    <div class="title">实时监测数据</div>
                    <div class="buttons">
                        <div class="button" v-for="(name, index) in dataAssitant.chartOptions.names"
                            @click="showChart(index)">
                            {{ name }}
                        </div>
                    </div>

                    <div class="chart" id="chart"></div>
                </div>
            </Transition>
        </div>
    </div>

</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import BackEndRequest from '../../../api/backend';
import * as echarts from 'echarts'
import 'echarts-gl';
import { MonitorDataAssistant } from './ChartData'
import { useSceneStore } from '../../../store/mapStore';

const sceneStore = useSceneStore()
const selectedFeature = computed(() => sceneStore.selectedFeature)


const showMainPart = ref(false)
const iconSrc = computed(() => {
    return showMainPart.value ? './icons/resize.png' : './icons/watching.png'
})

let myChart
let chartDom
let dataAssitant = ref(new MonitorDataAssistant())

watch(selectedFeature, async (newV, oldV) => {

    if (sceneStore.selectedScene.title != '实时监测设备') return;
    if (newV) {
        myChart && myChart.clear()
        dataAssitant.value = new MonitorDataAssistant(newV)
        await dataAssitant.value.getMonitoringdata()
        dataAssitant.value.getProcessedDataObject()
        dataAssitant.value.getChartOptions()
        console.log(dataAssitant.value);
    }
})

const showChart = (index) => {
    if (myChart) {
        myChart.clear()
        myChart.setOption(dataAssitant.value.chartOptions.options[index])
    } else {
        console.log('chart not prepared');
    }
}


onMounted(async () => {


    chartDom = document.getElementById('chart');
    myChart = echarts.init(chartDom);

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
.monitor-chart-parent {
    user-select: none;
    position: absolute;
    pointer-events: none;
    width: 90vw;
    left: 10vw;
    height: 90vh;
    top: 1vh;
    bottom: 1vh;
    z-index: 3;

    .monitor-chart-container {

        user-select: none;
        position: absolute;
        pointer-events: all;
        top: 4vh;
        right: 2vw;
        width: auto;
        height: auto;


        //background-color: rgb(0, 217, 255);
        /*
        position: absolute ;
        width: 100%;
        height: 92vh;
        pointer-events: none;
    */
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
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            height: auto;
            width: auto;
            padding: 10px;
            //background: linear-gradient(45deg, #C9E1F5, #E2FFEE);
            background: #FFFFFF;
            box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;


            .title {
                font-size: calc(1vw + 1vh);
                font-weight: 500;
                color: #FFFFFF;
                text-shadow: 2px 2px 0 #4074b5, 2px -2px 0 #4074b5, -2px 2px 0 #4074b5, -2px -2px 0 #4074b5, 2px 0px 0 #4074b5, 0px 2px 0 #4074b5, -2px 0px 0 #4074b5, 0px -2px 0 #4074b5;
                letter-spacing: 0.2vw;
            }

            .buttons {
                display: flex;
                flex-direction: row;
                justify-content: space-evenly;
            }

            .button {
                border-radius: 10px;
                background-color: rgb(236, 234, 234);
                width: auto;
                height: 20px;
                padding: 10px;
                margin: 20px;
                box-shadow: rgb(38, 57, 77) 0px 5px 10px -2px;
                color: rgb(3, 3, 100);
                font-size: 20px;
                line-height: 20px;
                font-weight: 600;
            }

            .chart {
                width: 28vw;
                height: 35vh;
                background-color: rgb(255, 255, 255);
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
}
</style>
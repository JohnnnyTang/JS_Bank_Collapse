<template>
    <div class="monitor-chart-container">
        <h2> GNSS::XMove-YMove-ZMove-TIME </h2>

        <div class="chart" id="chart">

        </div>

    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import BackEndRequest from '../../../api/backend';
import * as echarts from 'echarts'
import 'echarts-gl';
import { MonitorDataAssistant } from '../ChartData'

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

    /////////for stress



    /////////for manometer


    var chartDom = document.getElementById('chart');
    var myChart = echarts.init(chartDom);

    window.addEventListener("keydown", (e) => {
        if (e.key == '1') {
            myChart.clear()
            console.log(oneInclinometer);
            myChart.setOption(oneInclinometer.chartOptions.options[0])
        }
        if (e.key == '2') {
            myChart.clear()
            myChart.setOption(oneInclinometer.chartOptions.options[1])
        }
        if (e.key == '3') {
            myChart.clear()
            myChart.setOption(oneInclinometer.chartOptions.options[2])
        }
    })

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
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgb(164, 236, 247);
    width: 100vw;
    height: 92vh;
    top: 8vh;
    left: 0;

    .chart {
        width: 70vw;
        height: 60vh;
        background-color: aliceblue;
    }

}
</style>
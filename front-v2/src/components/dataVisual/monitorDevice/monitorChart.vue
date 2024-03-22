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
import dayjs from 'dayjs'

onMounted(async () => {
    //////////for gnss

    //request data
    let gnssMonitorInfo = (await BackEndRequest.getMonitorInfoByType_Code("MZS120.529408_32.033683_1", "1")).data
    let gnssMonitorDetail = (await BackEndRequest.getMonitorDetailByType_Code("MZS120.529408_32.033683_1", "1")).data

    /*
    {
        "XMove": 1.4341251,
        "YMove": 1.0788455,
        "ZMove": 0.4170992,
        "deviceCode": "Machine001",
        "deviceId": "MZS120.529408_32.033683_1",
        "inTime": "2024-01-25 18:13:33",
        "measureTime": "2024-01-25 17:43:33",
        "stationId": "MZS"
    }
    */
    // toolset
    const time = (measturetime) => {
        return dayjs(measturetime)
    }
    const timeDif = (starttime, endtime) => {
        return starttime.diff(endtime, 'second')
    }
    const timeFormat = (time) => {
        return time.format('HH-mm-ss')
    }
    const radius = (x, y, z) => {
        return Math.sqrt(x * x + y * y + z * z)
    }


    //data prepare

    const generateData_GNSS = (detail) => {
        let data = []
        let xMoveRange = [999, -999]
        let yMoveRange = [999, -999]
        let radiusRange = [999, -999]
        let showCount = detail.length
        showCount = 50;//100 IS ENOUGH

        let endTime = time(detail[0].measureTime);
        let startTime = time(detail[showCount].measureTime);


        for (let i = 0; i < showCount; i++) {
            if (detail[i].XMove < xMoveRange[0])
                xMoveRange[0] = detail[i].XMove
            if (detail[i].xMoveRange > xMoveRange[1])
                xMoveRange[1] = detail[i].XMove
            if (detail[i].YMove < yMoveRange[0])
                yMoveRange[0] = detail[i].YMove
            if (detail[i].YMove > yMoveRange[1])
                yMoveRange[1] = detail[i].YMove
            let thisradius = radius(detail[i].XMove, detail[i].YMove, detail[i].ZMove)
            if (thisradius < radiusRange[0])
                radiusRange[0] = thisradius
            if (thisradius > radiusRange[1])
                radiusRange[1] = thisradius
            let thistime = time(detail[i].measureTime)
            let deltaSeconds = timeDif(startTime, thistime)
            data.push([detail[i].XMove, detail[i].YMove, detail[i].ZMove, deltaSeconds])
        }

        return {
            xMoveRange,
            yMoveRange,
            radiusRange,
            startTime,
            endTime,
            data
        }
    }
    const chartData = generateData_GNSS(gnssMonitorDetail)
    debugger
    console.log(chartData);

    //chart option

    //draw 
    var chartDom = document.getElementById('chart');
    var myChart = echarts.init(chartDom);

    // 2dline
    const option2dline = {
        gradientColor: ["#00d4ff", "#090979"],
        animation: false,
        grid: {
            top: 40,
            left: 50,
            right: 40,
            bottom: 50
        },
        xAxis: {
            name: 'x',
            minorTick: {
                show: true
            },
            minorSplitLine: {
                show: true
            }
        },
        yAxis: {
            name: 'y',
            min: Math.floor(chartData.yMoveRange[0]),
            max: Math.ceil(chartData.yMoveRange[1]),
            minorTick: {
                show: true
            },
            minorSplitLine: {
                show: true
            }
        },
        dataZoom: [
            {
                show: true,
                type: 'inside',
                filterMode: 'none',
                xAxisIndex: [0],
                startValue: -20,
                endValue: 20
            },
            {
                show: true,
                type: 'inside',
                filterMode: 'none',
                yAxisIndex: [0],
                startValue: -20,
                endValue: 20
            }
        ],
        series: [
            {
                type: 'line',
                showSymbol: false,
                clip: true,
                data: chartData.data,
                smooth: true,
                lineStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                        {
                            offset: 0,
                            color: 'rgb(255, 11, 11)'
                        },
                        {
                            offset: 1,
                            color: '#F6EDED'
                        }
                    ]),
                    width: 3
                },
            }
        ]
    };
    // 3dline
    let option3Dline = {
        tooltip: {},
        backgroundColor: '#fff',
        type: 'continuous',
        visualMap: {
            show: false,
            dimension: 3,
            min: 0,
            max: timeDif(chartData.startTime, chartData.endTime),
            inRange: {
                color: [
                    '#313695',
                    '#4575b4',
                    '#74add1',
                    '#abd9e9',
                    '#e0f3f8',
                    '#ffffbf',
                    '#fee090',
                    '#fdae61',
                    '#f46d43',
                    '#d73027',
                    '#a50026'
                ],
                opacity: [0.5, 1.0]
            }
        },
        xAxis3D: {
            type: 'value'
        },
        yAxis3D: {
            type: 'value'
        },
        zAxis3D: {
            type: 'value'
        },
        grid3D: {
            viewControl: {
                projection: 'orthographic'
            }
        },
        series: [
            {
                type: 'line3D',
                data: chartData.data,
                smooth: true,
                // data,
                lineStyle: {
                    width: 4
                }
            }
        ]
    };
    // 3dcube
    let option3Dcube = {
        // tooltip: {},
        visualMap: {
            show: false,
            dimension: 2,
            min: -1,
            max: 1,
            inRange: {
                opacity: [0.3]
            }
        },
        xAxis3D: {},
        yAxis3D: {},
        zAxis3D: {},
        grid3D: {},
        series: [
            {
                type: 'surface',
                parametric: true,
                color: '#0E0E0E',
                // shading: 'albedo',
                parametricEquation: {
                    u: {
                        min: -Math.PI,
                        max: Math.PI,
                        step: Math.PI / 10
                    },
                    v: {
                        min: 0,
                        max: Math.PI,
                        step: Math.PI / 10
                    },
                    x: function (u, v) {
                        return Math.sin(v) * Math.sin(u) * chartData.radiusRange[0];
                    },
                    y: function (u, v) {
                        return Math.sin(v) * Math.cos(u) * chartData.radiusRange[0];
                    },
                    z: function (u, v) {
                        return Math.cos(v) * chartData.radiusRange[0];
                    }
                }
            },
            {
                type: 'surface',
                parametric: true,
                color: '#D47979',
                // shading: 'albedo',
                parametricEquation: {
                    u: {
                        min: -Math.PI,
                        max: Math.PI,
                        step: Math.PI / 10
                    },
                    v: {
                        min: 0,
                        max: Math.PI,
                        step: Math.PI / 10
                    },
                    x: function (u, v) {
                        return Math.sin(v) * Math.sin(u) * chartData.radiusRange[1];
                    },
                    y: function (u, v) {
                        return Math.sin(v) * Math.cos(u) * chartData.radiusRange[1];
                    },
                    z: function (u, v) {
                        return Math.cos(v) * chartData.radiusRange[1];
                    }
                }
            },
        ]
    };


    myChart.setOption(option3Dcube);

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
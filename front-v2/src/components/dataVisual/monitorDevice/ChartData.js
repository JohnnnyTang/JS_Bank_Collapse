import BackEndRequest from '../../../api/backend'
import * as echarts from 'echarts'
// import 'echarts-gl';
import ecStat from 'echarts-stat';
import dayjs from 'dayjs'

///////////toolset
const time = (measturetime) => {
    return dayjs(measturetime)
}
const timeDif = (starttime, endtime) => {
    return starttime.diff(endtime, 'second')
}
const timeFormat = (time) => {
    return time.format('HH:mm:ss')
}
const radius = (x, y, z) => {
    return Math.sqrt(x * x + y * y + z * z)
}

const value2time = (value, startTime) => {
    let realTime = startTime.add(value, 'second')
    return timeFormat(realTime)
}


//////////data process func
const generateData_GNSS = (ogDataArray) => {

    let time_xMove_scater_data = []
    let time_yMove_scater_data = []
    let time_zMove_scater_data = []
    let gnss3d_data = []
    let gnss_3Df_data = []

    let showCount = ogDataArray.length - 1
    showCount = Math.min(20, showCount)

    let endTime = time(ogDataArray[0].measureTime);
    let startTime = time(ogDataArray[showCount].measureTime);
    for (let i = 0; i < showCount; i++) {

        let thistime = time(ogDataArray[i].measureTime)
        let deltaSeconds = timeDif(startTime, thistime)

        time_xMove_scater_data.push([deltaSeconds, ogDataArray[i].XMove])
        time_yMove_scater_data.push([deltaSeconds, ogDataArray[i].YMove])
        time_zMove_scater_data.push([deltaSeconds, ogDataArray[i].ZMove])

        gnss3d_data.push([ogDataArray[i].measureTime, ogDataArray[i].threeD])
        gnss_3Df_data.push([ogDataArray[i].measureTime, ogDataArray[i].threeDf])
    }
    return {
        startTime,
        endTime,
        gnss3d_data,
        gnss_3Df_data,
        scatterData: {
            time_xMove_scater_data,
            time_yMove_scater_data,
            time_zMove_scater_data
        }
    }
}

const generateData_Incline_new = (ogDataArray) => {
    console.log(ogDataArray);
    let bottomMove = []
    let middleMove = []
    let topMove = []

    let bMoveDay = []
    let mMoveDay = []
    let tMoveDay = []

    ogDataArray.forEach((item) => {
        bottomMove.push([item['measureTime'], item['bottomMove']])
        middleMove.push([item['measureTime'], item['middleMove']])
        topMove.push([item['measureTime'], item['topMove']])

        bMoveDay.push([item['measureTime'], item['bottomMovePerDay']])
        mMoveDay.push([item['measureTime'], item['middleMovePerDay']])
        tMoveDay.push([item['measureTime'], item['topMovePerDay']])
    })

    return {
        bottomMove,
        middleMove,
        topMove,

        bMoveDay,
        mMoveDay,
        tMoveDay
    }
}


const generateData_Manometer_new = (ogDataArray) => {
    let showCount = ogDataArray.length - 1
    showCount = Math.min(20, showCount)

    let timeArray = []
    let heightArray = []
    let temperatureArray = []
    let frequencyArray = []

    ogDataArray.forEach((item) => {
        timeArray.push(item['measureTime'])
        heightArray.push([item['measureTime'], item['height']])
        temperatureArray.push([item['measureTime'], item['temperature']])
        frequencyArray.push([item['measureTime'], item['frequency']])
    })

    return {
        timeArray,
        heightArray,
        temperatureArray,
        frequencyArray
    }
}


const generateData_Stress = (ogDataArray) => {

    let showCount = Math.min(ogDataArray.length, 20)
    let btPower = []
    let btAngle = []
    let btChange = []

    let midPower = []
    let midAngle = []
    let midChange = []

    let topPower = []
    let topAngle = []
    let topChange = []

    // {
    //     "bottomAngle": 90.1106388918919,
    //     "bottomChange": 80.6367641081081,
    //     "bottomPower": 17.152630972973,
    //     "deviceCode": "H231001003",
    //     "deviceId": "MZS120.541648_32.030524_2",
    //     "inTime": "2024-04-27 10:47:03",
    //     "measureTime": "2024-04-27 10:42:00",
    //     "middleAngle": 38.6089878918919,
    //     "middleChange": 8.20612233783783,
    //     "middlePower": 1.05193068378378,
    //     "stationId": "MZS",
    //     "topAngle": 72.627328,
    //     "topChange": 23.0013858378378,
    //     "topPower": 3.86017082162162
    // }

    for (let i = 0; i < showCount; i++) {
        let item = ogDataArray[i]
        btPower.push([item.measureTime, item.bottomPower])
        midPower.push([item.measureTime, item.middlePower])
        topPower.push([item.measureTime, item.topPower])

        btAngle.push([item.measureTime, item.bottomAngle])
        midAngle.push([item.measureTime, item.middleAngle])
        topAngle.push([item.measureTime, item.topAngle])

        btChange.push([item.measureTime, item.bottomChange])
        midChange.push([item.measureTime, item.middleChange])
        topChange.push([item.measureTime, item.topChange])
    }

    return {
        btAngle,
        btChange,
        btPower,
        midAngle,
        midChange,
        midPower,
        topAngle,
        topChange,
        topPower
    }
}




//////////chart options func
const generateOptions_GNSS = (processedData) => {

    // 3dcube
    const regressionX = ecStat.regression("polynomial", processedData.scatterData.time_xMove_scater_data, 7)
    const regressionY = ecStat.regression("polynomial", processedData.scatterData.time_yMove_scater_data, 7)
    const regressionZ = ecStat.regression("polynomial", processedData.scatterData.time_zMove_scater_data, 7)

    // scatter 
    let optionScatter = {
        title: {
            text: 'GNSS-XYZ-位移时间曲线',
            left: 'center',
            top: 5,
        },
        grid: {
            x: 30,
            y: 90,
            x2: 30,
            y2: 30,
            borderWidth: 1
        },
        xAxis: {
            type: 'value',
            show: true,
            max: 'dataMax',
            min: 'dataMin',
            axisLabel: {
                formatter: (value) => {
                    return value2time(value, processedData.startTime)
                }
            }
        },
        yAxis: {
            type: 'value',
            show: true
        },
        legend: {
            orient: 'horizontal',
            top: '40',
            width: 300,
            left: 'center',
            itemGap: 5,
            formatter: (name) => {
                return `{b|${name}} `;
            },
            textStyle: {
                color: '#999999',
                align: 'left',
                backgroundColor: "transparent",
                rich: {
                    b: {
                        width: 20,
                    },
                },
            },
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        series: [
            {
                symbolSize: 10,
                name: 'XMove',
                type: 'scatter',
                data: processedData.scatterData.time_xMove_scater_data,
                itemStyle: {
                    color: '#FFEE58'
                }
            },
            {
                symbolSize: 10,
                name: 'YMove',
                type: 'scatter',
                data: processedData.scatterData.time_yMove_scater_data,
                itemStyle: {
                    color: '#9CCC65'
                }
            },
            {
                symbolSize: 10,
                name: 'ZMove',
                type: 'scatter',
                data: processedData.scatterData.time_zMove_scater_data,
                itemStyle: {
                    color: '#1976D2'
                }
            },
            {
                type: 'line',
                // name: 'XMove回归',
                data: regressionX.points,
                smooth: true,
                symbolSize: 5,
                itemStyle: {
                    color: '#AAA041'
                },
                symbol: 'triangle',
            },
            {
                type: 'line',
                // name: 'YMove回归',
                data: regressionY.points,
                smooth: true,
                symbolSize: 5,
                itemStyle: {
                    color: '#7AA04E'
                },
                symbol: 'triangle',
            },
            {
                type: 'line',
                // name: 'ZMove回归',
                data: regressionZ.points,
                smooth: true,
                symbolSize: 5,
                itemStyle: {
                    color: '#0B437B'
                },
                symbol: 'triangle',
            },
        ]

    }

    // gnss3d_data
    let optionRatio = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            },
            valueFormatter: (value) => {
                return value.toFixed(4)
            }
        },
        title: {
            left: 'center',
            text: 'GNSS-三维累计位移曲线',
            subtext: '近五小时',
            subtextStyle: {
                color: 'rgb(34,45,148)',
                fontSize: 12,
            },
            top: 5
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        // visualMap: [
        //     {
        //         show: true,
        //         itemGap: 0,
        //         top: 'middle',
        //         left: '0%',
        //         itemSymbol: 'rect',
        //         type: 'piecewise',
        //         itemWidth: 15,
        //         itemHeight: 15,
        //         text: ['10.0', '0.0'],
        //         textGap: 100,
        //         realtime: false,
        //         calculable: true,
        //         seriesIndex: 0,
        //         splitNumver: 6,
        //         pieces: [
        //             { gt: 9, lte: 10, label: "", color: "#ff1414" },
        //             { gt: 8, lte: 9, label: "", color: "#fc4b00" },
        //             { gt: 7, lte: 8, label: "", color: "#f46c00" },
        //             { gt: 6, lte: 7, label: "", color: "#e78800" },
        //             { gt: 5, lte: 6, label: "", color: "#d7a000" },
        //             { gt: 4, lte: 5, label: "", color: "#c5b500" },
        //             { gt: 3, lte: 4, label: "", color: "#b0c900" },
        //             { gt: 2, lte: 3, label: "", color: "#93dc00" },
        //             { gt: 1, lte: 2, label: "", color: "#6bee00" },
        //             { gt: 0, lte: 1, label: "", color: "#0fff37" },
        //             /////
        //             // { gt: 0.9, lte: 1.0, label: "", color: "#03071e" },
        //             // { gt: 0.8, lte: 0.9, label: "", color: "#370617" },
        //             // { gt: 0.7, lte: 0.8, label: "", color: "#6a040f" },
        //             // { gt: 0.6, lte: 0.7, label: "", color: "#9d0208" },
        //             // { gt: 0.5, lte: 0.6, label: "", color: "#d00000" },
        //             // { gt: 0.4, lte: 0.5, label: "", color: "#dc2f02" },
        //             // { gt: 0.3, lte: 0.4, label: "", color: "#e85d04" },
        //             // { gt: 0.2, lte: 0.3, label: "", color: "#f48c06" },
        //             // { gt: 0.1, lte: 0.2, label: "", color: "#faa307" },
        //             // { gt: 0, lte: 0.1, label: "", color: "#ffba08" },
        //             // { gt: -0.1, lte: 0, label: "", color: "#ffba08" },
        //             // { gt: -0.2, lte: -0.1, label: "", color: "#faa307" },
        //             // { gt: -0.3, lte: -0.2, label: "", color: "#f48c06" },
        //             // { gt: -0.4, lte: -0.3, label: "", color: "#e85d04" },
        //             // { gt: -0.5, lte: -0.4, label: "", color: "#dc2f02" },
        //             // { gt: -0.6, lte: -0.5, label: "", color: "#d00000" },
        //             // { gt: -0.7, lte: -0.6, label: "", color: "#9d0208" },
        //             // { gt: -0.8, lte: -0.7, label: "", color: "#6a040f" },
        //             // { gt: -0.9, lte: -0.8, label: "", color: "#370617" },
        //             // { gt: -10, lte: -1.0, label: "", color: "#03071e" }
        //         ]
        //     },
        // ],
        // markLine:{
        //     data: [{ 
        //         value:5.0,
        //         lineStyle: {
        //     }]
        // },
        xAxis: {
            type: 'time',
            min: 'dataMin',
            axisLine: {
                show: true
            },
            axisLabel: {
                formatter: function (value, index) {
                    // if (index === 0 || index === dataIndexArray.length - 1) {
                    if (index % 2 === 0) {
                        return echarts.format.formatTime('hh:ss', value);
                    } else {
                        return '';
                    }
                }
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            min: function (v) {
                return Math.floor(v.min)
            },
            max: function (v) {
                return Math.ceil(v.max)
            },
        },
        series: [
            {
                name: '三维位移',
                type: 'line',
                smooth: true,
                symbol: 'emptyCircle',
                symbolSize: 6,
                data: processedData.gnss3d_data
            }
        ]
    };

    let option3 = {
        title: {
            left: 'center',
            top: 5,
            text: 'GNSS-三维相对位移曲线',
            subtext: '近五小时',
            subtextStyle: {
                color: 'rgb(34,45,148)',
                fontSize: 12,
            }
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            valueFormatter: (value) => {
                return value.toFixed(4)
            }
        },
        xAxis: {
            axisLine: {
                show: true
            },
            axisTick: {
                show: true
            },
            type: 'time',
            axisLabel: {
                formatter: function (value, index) {
                    // if (index === 0 || index === dataIndexArray.length - 1) {
                    if (index % 2 === 0) {
                        return echarts.format.formatTime('hh:ss', value);
                    } else {
                        return '';
                    }
                }
            }
        },
        yAxis: {
            type: 'value',
            min: function (v) {
                return Math.floor(v.min)
            },
            max: function (v) {
                return Math.ceil(v.max)
            },
        },
        series: [
            {
                data: processedData.gnss_3Df_data,
                type: 'line'
            }
        ]
    }


    return {
        // options: [option2dline, option3Dline, option3Dcube, optionScatter, optionRatio]
        options: [optionScatter, optionRatio, option3],
        names: ['各维度位移', '三维位移', '相对位移'],
    }
}

const generateOptions_Incline_new = (processedData) => {

    let option1 = {
        title: {
            left: 'center',
            top: 5,
            text: '测斜仪-偏移曲线',
            subtext: '近五小时',
            subtextStyle: {
                color: 'rgb(34,45,148)',
                fontSize: 12,
            }
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
            valueFormatter: (value) => {
                return value.toFixed(4)
            }
        },
        xAxis: {
            axisLine: {
                show: true
            },
            axisTick: {
                show: true
            },
            min: 'dataMin',
            max: 'dataMax',
            type: 'time',
            axisLabel: {
                formatter: function (value, index) {
                    // if (index === 0 || index === dataIndexArray.length - 1) {
                    if (index % 2 === 0) {
                        return echarts.format.formatTime('hh:ss', value);
                    } else {
                        return '';
                    }
                }
            }
        },
        yAxis: {
            type: 'value',
            min: function (value) {
                return Math.floor(value.min)
            },
            max: function (value) {
                return Math.ceil(value.max)
            }
        },
        series: [
            {
                data: processedData.middleMove,
                type: 'line'
            },
            {
                data: processedData.bottomMove,
                type: 'line'
            },
            {
                data: processedData.topMove,
                type: 'line'
            }
        ]
    }

    let option2 = {
        title: {
            left: 'center',
            top: 5,
            text: '测斜仪-相对偏移曲线',
            subtext: '近五小时',
            subtextStyle: {
                color: 'rgb(34,45,148)',
                fontSize: 12,
            }
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            valueFormatter: (value) => {
                return value.toFixed(4)
            }
        },
        xAxis: {
            axisLine: {
                show: true
            },
            axisTick: {
                show: true
            },
            min: 'dataMin',
            max: 'dataMax',
            type: 'time',
            axisLabel: {
                formatter: function (value, index) {
                    // if (index === 0 || index === dataIndexArray.length - 1) {
                    if (index % 2 === 0) {
                        return echarts.format.formatTime('hh:ss', value);
                    } else {
                        return '';
                    }
                }
            }
        },
        yAxis: {
            type: 'value',
            min: function (value) {
                return Math.floor(value.min)
            },
            max: function (value) {
                return Math.ceil(value.max)
            }
        },
        series: [
            {
                data: processedData.mMoveDay,
                name: '中部相对偏移',
                type: 'line'
            },
            {
                name: '底部相对偏移',
                data: processedData.bMoveDay,
                type: 'line'
            },
            {
                name: '顶部相对偏移',
                data: processedData.tMoveDay,
                type: 'line'
            }
        ]
    }

    return {
        options: [option1, option2],
        names: ["偏移曲线", "相对偏移曲线"],
    }
}


const generateOptions_Manometer_new = (processedData) => {
    let option1 = {
        title: {
            text: "水位折线",
            left: 'center',
            top: 5,
            subtext: '近五小时',
            subtextStyle: {
                color: 'rgb(34,45,148)',
                fontSize: 12,
            }
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            axisLine: {
                show: true
            },
            axisTick: {
                show: true
            },
            min: 'dataMin',
            max: 'dataMax',

            type: 'time',
        },
        yAxis: {
            type: 'value',
            min: function (value) {
                return Math.floor(value.min * 10) / 10;
            },
            max: function (value) {
                // return 
                return Math.ceil(value.max * 10) / 10;
            }
        },
        series: [
            {
                data: processedData.heightArray,
                type: 'line'
            }
        ]
    };
    let option2 = {
        title: {
            text: "测温折线",
            left: 'center',
            top: 5,
            subtext: '近五小时',
            subtextStyle: {
                color: 'rgb(34,45,148)',
                fontSize: 12,
            }
        },
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'time',
        },
        yAxis: {
            type: 'value',
            min: function (value) {
                return Math.floor(value.min);
            },
            max: function (value) {
                // return 
                return Math.ceil(value.max);
            }
        },
        series: [
            {
                data: processedData.temperatureArray,
                type: 'line'
            }
        ]
    };
    let option3 = {
        title: {
            text: "频率折线",
            left: 'center',
            top: 5,
            subtext: '近五小时',
            subtextStyle: {
                color: 'rgb(34,45,148)',
                fontSize: 12,
            }
        },
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'time',
        },
        yAxis: {
            type: 'value',
            min: function (value) {
                return Math.floor(value.min);
            },
            max: function (value) {
                // return 
                return Math.ceil(value.max);
            }
        },
        series: [
            {
                data: processedData.frequencyArray,
                type: 'line'
            }
        ]
    }

    return {
        names: ['水位折线图', '测温折线图', '频率折线图'],
        options: [option1, option2, option3]
    }

}
const generateOptions_Stress = (processedData) => {

    let optionPower = {
        title: {
            left: 'center',
            top: 5,
            text: '应力桩-应力折线',
            // subtext: '近五小时',
            // subtextStyle: {
            //     color: 'rgb(34,45,148)',
            //     fontSize: 12,
            // }
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            valueFormatter: (value) => {
                return value.toFixed(4)
            }
        },
        xAxis: {
            axisLine: {
                show: true
            },
            axisTick: {
                show: true
            },
            type: 'time',
            min: 'dataMin',
            max: 'dataMax'
        },
        yAxis: {
            type: 'value',
            min: function (v) {
                return Math.floor(v.min)
            },
            max: function (v) {
                return Math.ceil(v.max)
            },
        },
        series: [
            {
                name: '顶部受力',
                data: processedData.topPower,
                type: 'line'
            },
            {
                name: '中部受力',
                data: processedData.midPower,
                type: 'line'
            },
            {
                name: '底部受力',
                type: 'line',
                data: processedData.btPower
            }
        ]
    }
    let optionAngle = {
        title: {
            left: 'center',
            top: 5,
            text: '应力桩-应力角度',
            // subtext: '近五小时',
            // subtextStyle: {
            //     color: 'rgb(34,45,148)',
            //     fontSize: 12,
            // }
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            valueFormatter: (value) => {
                return value.toFixed(4)
            }
        },
        xAxis: {
            axisLine: {
                show: true
            },
            axisTick: {
                show: true
            },
            type: 'time',
            min: 'dataMin',
            max: 'dataMax'
        },
        yAxis: {
            type: 'value',
            min: function (v) {
                return Math.floor(v.min)
            },
            max: function (v) {
                return Math.ceil(v.max)
            },
        },
        series: [
            {
                name: '顶部应力角',
                data: processedData.topAngle,
                type: 'line'
            },
            {
                name: '中部应力角',
                data: processedData.midAngle,
                type: 'line'
            },
            {
                name: '底部应力角',
                type: 'line',
                data: processedData.btAngle
            }
        ]
    }
    let optionChange = {
        title: {
            left: 'center',
            top: 5,
            text: '应力桩-最大主应变',
            // subtext: '近五小时',
            // subtextStyle: {
            //     color: 'rgb(34,45,148)',
            //     fontSize: 12,
            // }
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            valueFormatter: (value) => {
                return value.toFixed(4)
            }
        },
        xAxis: {
            axisLine: {
                show: true
            },
            axisTick: {
                show: true
            },
            interval: 3,
            type: 'time',
            min: 'dataMin',
            max: 'dataMax'
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: true
            },
            axisTick: {
                show: true
            },
            min: function (v) {
                return Math.floor(v.min)
            },
            max: function (v) {
                return Math.ceil(v.max)
            },
        },
        series: [
            {
                name: '顶部最大主应变',
                data: processedData.topChange,
                type: 'line'
            },
            {
                name: '中部最大主应变',
                data: processedData.midChange,
                type: 'line'
            },
            {
                name: '底部最大主应变',
                type: 'line',
                data: processedData.btChange
            }
        ]
    }


    return {
        options: [optionPower, optionAngle, optionChange],
        names: ['受力折线', '应力角度', '最大主应变']
    }

}




class MonitorDataAssistant {
    /* 
    this.info  .e.g
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
    */
    constructor(specMonitorInfo) {
        this.info = specMonitorInfo ? specMonitorInfo : {};
        this.chartOptions = {
            options: [],
            names: []
        };
        this.monitoringData = [];
        this.processedData = {};
    }

    async getMonitoringdata() {
        //general infomation
        this.monitoringData = (await BackEndRequest.getMonitorDetailByType_Code(this.info["code"], this.info["type"])).data

        console.log('monitoringData in 5 hours', this.monitoringData);
        //meta infomation -- pointnum
        return this.monitoringData
    }

    getProcessedDataObject() {
        switch (this.info["type"]) {
            case "1": //gnss
                this.processedData = generateData_GNSS(this.monitoringData)
                console.log('processed Data !', this.processedData);

                return this.processedData
            case "4":
                this.processedData = generateData_Incline_new(this.monitoringData)
                return this.processedData
            case "3":
                this.processedData = generateData_Manometer_new(this.monitoringData)
                return this.processedData
            case "2":
                //应力桩
                this.processedData = generateData_Stress(this.monitoringData)
                console.log(this.processedData);
                return this.processedData
            default:
                console.warn('ERROR::getProcessedDataObject');
                break;
        }
    }

    getChartOptions() {
        switch (this.info["type"]) {
            case "1": //gnss
                this.chartOptions = generateOptions_GNSS(this.processedData)
                return this.chartOptions
            case "4":
                // this.chartOptions = generateOptions_Incline(this.processedData)
                this.chartOptions = generateOptions_Incline_new(this.processedData)
                return this.chartOptions
            case "3":
                // this.chartOptions = generateOptions_Manometer(this.processedData)
                this.chartOptions = generateOptions_Manometer_new(this.processedData)

                return this.chartOptions
            case "2":
                this.chartOptions = generateOptions_Stress(this.processedData)
                return this.chartOptions
            default:
                console.warn('ERROR::getChartOptions');
                break;
        }
    }


    /// static function for dynamic updateData
    static getOnegaugeData(angleArray, legendData) {

        let offsetXArray = new Array(angleArray.length).fill(0)
        if (offsetXArray.length % 2 === 0) {
            let mid = Math.floor(offsetXArray.length / 2)
            let rightPointer = mid
            let leftPointer = mid - 1
            if (offsetXArray.length >= 2) {
                offsetXArray[rightPointer] = 15
                offsetXArray[leftPointer] = -15
            }
            rightPointer = rightPointer + 1;
            while (rightPointer < offsetXArray.length) {
                offsetXArray[rightPointer] = offsetXArray[rightPointer - 1] + 30
                rightPointer++;
            }
            while (leftPointer >= 0) {
                offsetXArray[leftPointer] = offsetXArray[leftPointer + 1] + (-30)
                leftPointer--;
            }
        } else {

            let mid = Math.floor(offsetXArray.length / 2)
            let rightPointer = mid + 1
            let leftPointer = mid - 1
            while (rightPointer < offsetXArray.length) {
                offsetXArray[rightPointer] = (rightPointer - mid) * 30
                rightPointer++;
            }
            while (leftPointer >= 0) {
                offsetXArray[leftPointer] = (mid - leftPointer) * (-30)
                leftPointer--;
            }
        }
        let gaugeData = []

        for (let i = 0; i < angleArray.length; i++) {
            let gaugeDataItem = {
                value: angleArray[i],
                name: legendData[i],
                title: {
                    offsetCenter: [String(offsetXArray[i]) + '%', '50%']
                },
                detail: {
                    offsetCenter: [String(offsetXArray[i]) + '%', '30%']
                }
            }
            gaugeData.push(gaugeDataItem)
        }
        return gaugeData

    }

}


export {
    MonitorDataAssistant
}
import BackEndRequest from '../../../api/backend'
import * as echarts from 'echarts'
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
    let xMove_data = []
    let yMove_data = []
    let zMove_data = []
 
    //about 50
    let showCount = ogDataArray.length - 1
    let base = ogDataArray.length - showCount
    let gap = 2


    // let endTime = time(ogDataArray[base].measureTime);
    // let startTime = time(ogDataArray[base + showCount].measureTime);
    for (let i = 0; i < showCount; i+=gap) {
        let item = ogDataArray[base + i]
        let thistime = time(item.measureTime)
        // let deltaSeconds = timeDif(startTime, thistime)

        // time_xMove_scater_data.push([deltaSeconds, item.XMove])
        // time_yMove_scater_data.push([deltaSeconds, item.YMove])
        // time_zMove_scater_data.push([deltaSeconds, item.ZMove])

        xMove_data.push([item.measureTime, item.XMove])
        yMove_data.push([item.measureTime, item.YMove])
        zMove_data.push([item.measureTime, item.ZMove])
        gnss3d_data.push([item.measureTime, item.threeD])
        gnss_3Df_data.push([item.measureTime, item.threeDf])
    }
    return {
        // startTime,
        // endTime,
        gnss3d_data,
        gnss_3Df_data,
        xMove_data,
        yMove_data,
        zMove_data,
        scatterData: {
            time_xMove_scater_data,
            time_yMove_scater_data,
            time_zMove_scater_data
        }
    }
}

const generateData_Incline_new = (ogDataArray) => {

    // 每小时一条
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
    // 每小时一条
    let showCount = ogDataArray.length
    let base = ogDataArray.length - showCount

    let heightArray = []
    let temperatureArray = []
    let frequencyArray = []

    let index = base
    while (index < ogDataArray.length) {
        let item = ogDataArray[index]
        heightArray.push([item['measureTime'], item['height']])
        temperatureArray.push([item['measureTime'], item['temperature']])
        frequencyArray.push([item['measureTime'], item['frequency']])
        index++
    }
    return {
        heightArray,
        temperatureArray,
        frequencyArray
    }
}


const generateData_Stress = (ogDataArray) => {
    //about 300
    //show 50
    let gap = 9
    let showCount = ogDataArray.length - 1
    let base = ogDataArray.length - showCount
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

    for (let i = 0; i < showCount; i+= gap) {
        let item = ogDataArray[i + base]
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

    // const regressionX = ecStat.regression("polynomial", processedData.scatterData.time_xMove_scater_data, 7)
    // const regressionY = ecStat.regression("polynomial", processedData.scatterData.time_yMove_scater_data, 7)
    // const regressionZ = ecStat.regression("polynomial", processedData.scatterData.time_zMove_scater_data, 7)

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
            type: 'time',
            show: true,
            max: 'dataMax',
            min: 'dataMin',
            axisLabel: {
                // formatter: (value) => {
                //     return value2time(value, processedData.startTime)
                // }
                show: true
            }
        },
        yAxis: {
            type: 'value',
            show: true,
            min: -30,
            max: 30,
            name: '单位(mm)',
            nameLocation: 'end',
            nameTextStyle: {
                padding: [0, 0, 0, 10]
            }
        },
        legend: {
            orient: 'horizontal',
            top: '40',
            width: 300,
            left: 'center',
            // itemGap: 5,
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
                type: 'line',
                name: 'XMove',
                data: processedData.xMove_data,
                smooth: true,
                symbolSize: 5,
                symbol: 'circle',
            },
            {
                type: 'line',
                name: 'YMove',
                data: processedData.yMove_data,
                smooth: true,
                symbolSize: 5,
                symbol: 'circle',
            },
            {
                type: 'line',
                name: 'ZMove',
                data: processedData.zMove_data,
                smooth: true,
                symbolSize: 5,
                symbol: 'circle',
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
        xAxis: {
            type: 'time',
            min: 'dataMin',
            max: 'dataMax',
            axisLine: {
                show: true
            },
            axisLabel: {
                // formatter: function (value, index) {
                //     // if (index === 0 || index === dataIndexArray.length - 1) {
                //     if (index % 2 === 0) {
                //         return echarts.format.formatTime('hh:ss', value);
                //     } else {
                //         return '';
                //     }
                // }
                show: true,
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            min: 0,
            max: 60,
            name: '单位(mm)',
            nameLocation: 'end',
            nameTextStyle: {
                padding: [0, 0, 0, 10]
            }
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
            type: 'time',
            min: 'dataMin',
            max: 'dataMax',
            axisLine: {
                show: true
            },
            axisLabel: {
                show: true,
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 60,
            name: '单位(mm)',
            nameLocation: 'end',
            nameTextStyle: {
                padding: [0, 0, 0, 10]
            }
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
            subtextStyle: {
                color: 'rgb(34,45,148)',
                fontSize: 12,
            }
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            top: '30%',
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
            min: -20,
            max: 20,
            name: '单位(mm)',
            nameLocation: 'end',
            nameTextStyle: {
                padding: [0, 0, 0, 10]
            }
        },
        legend: {
            orient: 'horizontal',
            top: '30',
            width: 300,
            left: 'center',
            // itemGap: 5,
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
        series: [
            {
                name: '中部偏移',
                data: processedData.middleMove,
                type: 'line',
                smooth: true,
            },
            {
                name: '底部偏移',
                data: processedData.bottomMove,
                type: 'line',
                smooth: true,
            },
            {
                name: '顶部偏移',
                data: processedData.topMove,
                type: 'line',
                smooth: true,
            }
        ]
    }

    let option2 = {
        title: {
            left: 'center',
            top: 5,
            text: '测斜仪-相对偏移曲线',
            subtextStyle: {
                color: 'rgb(34,45,148)',
                fontSize: 12,
            }
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            top: '30%',
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
            min: -20,
            max: 20, 
            name: '单位(mm)',
            nameLocation: 'end',
            nameTextStyle: {
                padding: [0, 0, 0, 10]
            }
        },
        legend: {
            orient: 'horizontal',
            top: '30',
            width: 300,
            left: 'center',
            // itemGap: 5,
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
        series: [
            {
                data: processedData.mMoveDay,
                name: '中部偏移',
                smooth: true,
                type: 'line'
            },
            {
                name: '底部偏移',
                data: processedData.bMoveDay,
                smooth: true,
                type: 'line'
            },
            {
                name: '顶部偏移',
                data: processedData.tMoveDay,
                smooth: true,
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
            min: -8,
            max: 4,
            name: '单位(m)',
            nameLocation: 'end',
            nameTextStyle: {
                padding: [0, 0, 0, 10]
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
            min: 0,
            max: 35,
            name: '单位(°)',
            nameLocation: 'end',
            nameTextStyle: {
                padding: [0, 0, 0, 10]
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
            min: 0,
            max: 4000,
            // name: '单位(°)',
            // nameLocation: 'end',
            // nameTextStyle: {
            //     padding: [0, 0, 0, 10]
            // }
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
            text: '应力桩-应力曲线',
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
            type: 'time',
            min: 'dataMin',
            max: 'dataMax',
            axisLine: {
                show: true,

            },
            axisLabel: {
                show: true,
                rotate: 30
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 300,
            name: '单位(MPa)',
            nameLocation: 'end',
            nameTextStyle: {
                padding: [0, 0, 0, 10]
            }
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
                show: true,
            },
            axisLabel: {
                show: true,
                rotate: 30
            },
            type: 'time',
            min: 'dataMin',
            max: 'dataMax'
        },
        yAxis: {
            type: 'value',
            min: -180,
            max: 180,
            name: '单位(°)',
            nameLocation: 'end',
            nameTextStyle: {
                padding: [0, 0, 0, 10]
            }
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
            axisLabel: {
                show: true,
                rotate: 30
            },
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
            min: 0,
            max: 800,
            name: '单位(με)',
            nameLocation: 'end',
            nameTextStyle: {
                padding: [0, 0, 0, 10]
            }
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
        names: ['应力曲线', '应力角度', '最大主应变']
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
        //meta infomation -- pointnum
        return this.monitoringData
    }

    getProcessedDataObject() {
        switch (this.info["type"]) {
            case "1": //gnss
                this.processedData = generateData_GNSS(this.monitoringData)

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
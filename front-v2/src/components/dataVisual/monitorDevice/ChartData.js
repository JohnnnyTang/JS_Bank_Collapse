import BackEndRequest from '../../../api/backend'
import * as echarts from 'echarts'
import 'echarts-gl';
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
//////////data process func
const generateData_GNSS = (ogDataArray) => {
    let data = []
    let xMoveRange = [999, -999]
    let yMoveRange = [999, -999]
    let radiusRange = [999, -999]
    let showCount = ogDataArray.length
    showCount = 50;//50 IS ENOUGH
    let endTime = time(ogDataArray[0].measureTime);
    let startTime = time(ogDataArray[showCount].measureTime);
    for (let i = 0; i < showCount; i++) {
        if (ogDataArray[i].XMove < xMoveRange[0])
            xMoveRange[0] = ogDataArray[i].XMove
        if (ogDataArray[i].xMoveRange > xMoveRange[1])
            xMoveRange[1] = ogDataArray[i].XMove
        if (ogDataArray[i].YMove < yMoveRange[0])
            yMoveRange[0] = ogDataArray[i].YMove
        if (ogDataArray[i].YMove > yMoveRange[1])
            yMoveRange[1] = ogDataArray[i].YMove
        let thisradius = radius(ogDataArray[i].XMove, ogDataArray[i].YMove, ogDataArray[i].ZMove)
        if (thisradius < radiusRange[0])
            radiusRange[0] = thisradius
        if (thisradius > radiusRange[1])
            radiusRange[1] = thisradius
        let thistime = time(ogDataArray[i].measureTime)
        let deltaSeconds = timeDif(startTime, thistime)
        data.push([ogDataArray[i].XMove, ogDataArray[i].YMove, ogDataArray[i].ZMove, deltaSeconds])
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
const generateData_Incline = (ogDataArray, metaData) => {
    let pointNum = metaData["pointNum"]
    let depthArray = []
    let legendData = []
    let xMovedata = []
    let yMovedata = []

    let showCount = 20   //50enough

    for (let i = 1; i <= pointNum; i++) {
        depthArray.push(metaData[`point${i}Depth`])
        legendData.push(String(metaData[`point${i}Depth`] + 'm'))
    }
    for (let i = 0; i < showCount; i++) {
        for (let j = 0; j < pointNum; j++) {
            let item = []
            item.push(ogDataArray[i][`measureTime`])
            item.push(ogDataArray[i][`XMove${j + 1}`])
            item.push(legendData[j])
            let item2 = []
            item2.push(ogDataArray[i][`measureTime`])
            item2.push(ogDataArray[i][`YMove${j + 1}`])
            item2.push(legendData[j])
            xMovedata.push(item)
            yMovedata.push(item2)
        }
    }

    return {
        legendData,
        xMovedata,
        yMovedata
    }
}
const generateData_Manometer = (ogDataArray, metaData) => {
    let pointNum = metaData["pointNum"]
    let depthArray = []
    let legendData = []
    let pressureData_river = []
    let showCount = 10   //50enough

    let Depth_Data_Map = new Map()
    let Depth_Data = []
    let measureTime = []

    for (let i = 1; i <= pointNum; i++) {
        depthArray.push(metaData[`point${i}Depth`])
        legendData.push(String(metaData[`point${i}Depth`] + 'm'))
        Depth_Data.push([])
    }
    for (let i = 0; i < showCount; i++) {
        for (let j = 0; j < pointNum; j++) {
            let item = []
            item.push(ogDataArray[i][`measureTime`])
            item.push(ogDataArray[i][`pressure${j + 1}`])
            item.push(legendData[j])
            pressureData_river.push(item)
            Depth_Data[j].push(ogDataArray[i][`pressure${j + 1}`])
        }
        measureTime.push(timeFormat(time(ogDataArray[i][`measureTime`])))

    }
    for (let i = 1; i <= pointNum; i++) {
        Depth_Data_Map.set(legendData[i - 1], Depth_Data[i - 1])
    }

    return {
        legendData,
        pressureData_river,
        Depth_Data_Map,
        measureTime
    }
}
const generateData_Stress = (ogDataArray, metaData) => {
    let pointNum = metaData["pointNum"]
    let depthArray = []
    let legendData = []
    let showCount = 20   //50enough
    let horizontalAngle = []

    for (let i = 1; i <= pointNum; i++) {
        depthArray.push(metaData[`point${i}Depth`])
        legendData.push(String(metaData[`point${i}Depth`] + 'm'))
    }

    for (let i = 0; i < showCount; i++) {
        let horizontalAngleItem = []
        for (let j = 0; j < pointNum; j++) {
            horizontalAngleItem.push(ogDataArray[i][`horizontal${j + 1}`])

        }
        horizontalAngle.push(horizontalAngleItem)
    }

    return {
        legendData,
        horizontalAngle
    }
}




//////////chart options func
const generateOptions_GNSS = (processedData) => {

    console.log(processedData);
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
            min: Math.floor(processedData.yMoveRange[0]),
            max: Math.ceil(processedData.yMoveRange[1]),
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
                data: processedData.data,
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
            max: timeDif(processedData.startTime, processedData.endTime),
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
                data: processedData.data,
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
        tooltip: {},
        visualMap: {
            show: false,
            dimension: 2,
            min: -1,
            max: 1,
            inRange: {
                opacity: [0.8]
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
                color: '#2F5499',
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
                        return Math.sin(v) * Math.sin(u) * processedData.radiusRange[1];
                    },
                    y: function (u, v) {
                        return Math.sin(v) * Math.cos(u) * processedData.radiusRange[1];
                    },
                    z: function (u, v) {
                        return Math.cos(v) * processedData.radiusRange[1];
                    }
                }
            },
            {
                type: 'surface',
                parametric: true,
                color: '#007FFF',
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
                        return Math.sin(v) * Math.sin(u) * processedData.radiusRange[0];
                    },
                    y: function (u, v) {
                        return Math.sin(v) * Math.cos(u) * processedData.radiusRange[0];
                    },
                    z: function (u, v) {
                        return Math.cos(v) * processedData.radiusRange[0];
                    }
                }
            },
        ]
    };
    return {
        option2dline,
        option3Dline,
        option3Dcube,
        options: [option2dline, option3Dline, option3Dcube]
    }
}

const generateOptions_Incline = (processedData) => {
    let xMoveOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: 'rgba(0,0,0,0.2)',
                    width: 1,
                    type: 'solid'
                }
            }
        },
        legend: {
            data: processedData.legendData
        },
        singleAxis: {
            top: 50,
            bottom: 50,
            axisTick: {},
            axisLabel: {},
            type: 'time',
            axisPointer: {
                animation: true,
                label: {
                    show: true
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    opacity: 0.2
                }
            }
        },
        series: [
            {
                type: 'themeRiver',
                itemStyle: {
                    opacity: 0.7
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 25,
                        shadowColor: 'rgba(0, 0, 0, 0.8)'
                    }
                },
                data: processedData.xMovedata.slice(0, 25)
            }
        ]
    };
    let yMoveOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: 'rgba(0,0,0,0.2)',
                    width: 1,
                    type: 'solid'
                }
            }
        },
        legend: {
            data: processedData.legendData
        },
        singleAxis: {
            top: 50,
            bottom: 50,
            axisTick: {},
            axisLabel: {},
            type: 'time',
            axisPointer: {
                animation: true,
                label: {
                    show: true
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    opacity: 0.2
                }
            }
        },
        series: [
            {
                type: 'themeRiver',
                itemStyle: {
                    opacity: 0.7
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 25,
                        shadowColor: 'rgba(0, 0, 0, 0.8)'
                    }
                },
                data: processedData.yMovedata.slice(0, 25)
            }
        ]
    };
    // 动态柱状排序？
    return {
        xMoveOption,
        yMoveOption,
        options: [xMoveOption, yMoveOption]
    }
}

const generateOptions_Manometer = (processedData) => {

    // 数据特征，全是正值，数值在10左右，比较稳定
    // 考虑河流图，极坐标面积堆叠图，动态柱状排序

    let optionRiver = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: 'rgba(0,0,0,0.2)',
                    width: 1,
                    type: 'solid'
                }
            }
        },
        legend: {
            data: processedData.legendData
        },
        singleAxis: {
            top: 50,
            bottom: 50,
            axisTick: {},
            axisLabel: {},
            type: 'time',
            axisPointer: {
                animation: true,
                label: {
                    show: true
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    opacity: 0.2
                }
            }
        },
        series: [
            {
                type: 'themeRiver',
                itemStyle: {
                    opacity: 0.9
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 25,
                        shadowColor: 'rgba(0, 0, 0, 0.8)'
                    }
                },
                data: processedData.pressureData_river
            }
        ]
    };


    //极坐标分series处理
    // processedData.Depth_Data_Map.entries
    let optionPolarStack_Seriers = []
    processedData.Depth_Data_Map.keys().forEach((key) => {

        let data = processedData.Depth_Data_Map.get(key)
        let item = {
            type: 'bar',
            data,
            coordinateSystem: 'polar',
            name: key,
            stack: 'a',
            emphasis: {
                focus: 'series'
            }
        }
        optionPolarStack_Seriers.push(item)
    })
    let optionPolarStack = {
        angleAxis: {
            //pressure
        },
        radiusAxis: {
            type: 'category',
            data: processedData.measureTime,
            z: 10
        },
        polar: {},
        series: optionPolarStack_Seriers,
        legend: {
            show: true,
            data: processedData.legendData
        }
    };

    let optionBarSort = {

    }

    return {
        optionRiver,
        optionPolarStack,
        optionBarSort,
        options: [optionRiver, optionPolarStack, optionBarSort]
    }

}
const generateOptions_Stress = (processedData) => {
    // 水平应力和垂直应力的数据联动图表。
    // https://echarts.apache.org/examples/zh/editor.html?c=dataset-link

    //gaugeOption 
    let gaugeData = MonitorDataAssistant.getOnegaugeData(processedData.horizontalAngle[0], processedData.legendData)
    let gaugeOption = {
        title: {
            show: true,
            text: '水平应力角度',
            x: 'center',
            y: 'top',
            textAlign: 'left'
        },
        series: [
            {
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: 90,
                type: 'gauge',
                anchor: {
                    show: true,
                    showAbove: true,
                    size: 18,
                    itemStyle: {
                        color: '#FAC858'
                    }
                },
                pointer: {
                    icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                    width: 8,
                    length: '70%',
                    offsetCenter: [0, '8%']
                },
                progress: {
                    show: true,
                    overlap: true,
                    roundCap: true
                },
                axisLine: {
                    roundCap: true
                },
                data: gaugeData,
                title: {
                    fontSize: 10
                },
                detail: {
                    width: 20,
                    height: 12,
                    fontSize: 12,
                    color: '#fff',
                    backgroundColor: 'inherit',
                    borderRadius: 3,
                    formatter: '{value}%'
                }
            }
        ]
    };


    return {
        gaugeOption,
        options: [gaugeOption]
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
        this.info = specMonitorInfo
    }

    async getMonitoringdata() {
        //general infomation
        this.monitoringData = (await BackEndRequest.getMonitorDetailByType_Code(this.info["code"], this.info["type"])).data

        //meta infomation -- pointnum
        this.monitoringMetaData = (await BackEndRequest.getMonitorInfoByType_Code(this.info["code"], this.info["type"])).data
        return this.monitoringData
    }

    getProcessedDataObject() {
        switch (this.info["type"]) {
            case "1": //gnss
                this.processedData = generateData_GNSS(this.monitoringData)
                return this.processedData
            case "2":
                this.processedData = generateData_Incline(this.monitoringData, this.monitoringMetaData)
                return this.processedData
            case "3":
                this.processedData = generateData_Manometer(this.monitoringData, this.monitoringMetaData)
                return this.processedData
            case "4":
                this.processedData = generateData_Stress(this.monitoringData, this.monitoringMetaData)
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
            case "2":
                this.chartOptions = generateOptions_Incline(this.processedData)
                return this.chartOptions
            case "3":
                this.chartOptions = generateOptions_Manometer(this.processedData)
                return this.chartOptions
            case "4":
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
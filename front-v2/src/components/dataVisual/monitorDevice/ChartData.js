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
    let data = []
    let time_xMove_scater_data = []
    let time_yMove_scater_data = []
    let time_zMove_scater_data = []
    let ratio = []

    let xMoveRange = [999, -999]
    let yMoveRange = [999, -999]
    let zMoveRange = [999, -999]
    let radiusRange = [999, -999]
    let ratioRange = [999, -999]


    let showCount = ogDataArray.length - 1
    showCount = Math.min(20, showCount)
    let endTime = time(ogDataArray[0].measureTime);
    let startTime = time(ogDataArray[showCount].measureTime);
    for (let i = 0; i < showCount; i++) {
        if (ogDataArray[i].XMove < xMoveRange[0])
            xMoveRange[0] = ogDataArray[i].XMove
        if (ogDataArray[i].xMove > xMoveRange[1])
            xMoveRange[1] = ogDataArray[i].XMove
        if (ogDataArray[i].YMove < yMoveRange[0])
            yMoveRange[0] = ogDataArray[i].YMove
        if (ogDataArray[i].YMove > yMoveRange[1])
            yMoveRange[1] = ogDataArray[i].YMove
        if (ogDataArray[i].ZMove < zMoveRange[0])
            zMoveRange[0] = ogDataArray[i].ZMove
        if (ogDataArray[i].zMove > zMoveRange[1])
            zMoveRange[1] = ogDataArray[i].ZMove


        let thisradius = radius(ogDataArray[i].XMove, ogDataArray[i].YMove, ogDataArray[i].ZMove)
        if (thisradius < radiusRange[0])
            radiusRange[0] = thisradius
        if (thisradius > radiusRange[1])
            radiusRange[1] = thisradius
        let thistime = time(ogDataArray[i].measureTime)
        let deltaSeconds = timeDif(startTime, thistime)
        data.push([ogDataArray[i].XMove, ogDataArray[i].YMove, ogDataArray[i].ZMove, deltaSeconds])
        time_xMove_scater_data.push([deltaSeconds, ogDataArray[i].XMove])
        time_yMove_scater_data.push([deltaSeconds, ogDataArray[i].YMove])
        time_zMove_scater_data.push([deltaSeconds, ogDataArray[i].ZMove])
        if (i < showCount - 1) {
            let nxtRadius = radius(ogDataArray[i + 1].XMove, ogDataArray[i + 1].YMove, ogDataArray[i + 1].ZMove)
            let nxtDeletaSeconds = timeDif(startTime, time(ogDataArray[i + 1].measureTime))
            let thisRatio = [ogDataArray[i].measureTime, (nxtRadius - thisradius) / (nxtDeletaSeconds - deltaSeconds)]
            ratio.push(thisRatio)
            if (thisRatio[1] < ratioRange[0])
                ratioRange[0] = thisRatio[1]
            if (thisRatio[1] > ratioRange[1])
                ratioRange[1] = thisRatio[1]
        }
    }
    return {
        xMoveRange,
        yMoveRange,
        zMoveRange,
        ratioRange,
        radiusRange,
        startTime,
        endTime,
        data,
        ratio,
        scatterData: {
            time_xMove_scater_data,
            time_yMove_scater_data,
            time_zMove_scater_data
        }
    }
}
const generateData_Incline = (ogDataArray, metaData) => {
    let pointNum = metaData["pointNum"]
    let depthArray = []
    let legendData = []
    let xMovedata = []
    let yMovedata = []
    let depth_value_data_x = []
    let depth_value_data_y = []
    let depth_value_data_3d = []

    let depth_value_time = []

    let showCount = ogDataArray.length - 1
    showCount = Math.min(5, showCount)

    for (let i = 1; i <= pointNum; i++) {
        depthArray.push(metaData[`point${i}Depth`])
        legendData.push(String(metaData[`point${i}Depth`] + 'm'))
    }
    for (let i = 0; i < showCount; i++) {
        let onetime_depth_value_data_x = []
        let onetime_depth_value_data_y = []
        let onetime_depth_value_time = null
        let onetime_depth_value_data_3d = []
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

            onetime_depth_value_data_x.push([ogDataArray[i][`XMove${j + 1}`], depthArray[j]])
            onetime_depth_value_data_y.push([ogDataArray[i][`YMove${j + 1}`], depthArray[j]])
            onetime_depth_value_data_3d.push([ogDataArray[i][`XMove${j + 1}`], ogDataArray[i][`YMove${j + 1}`], depthArray[j]])
        }
        onetime_depth_value_time = (ogDataArray[i]['measureTime'])

        depth_value_data_x.push(onetime_depth_value_data_x)
        depth_value_data_y.push(onetime_depth_value_data_y)
        depth_value_data_3d.push(onetime_depth_value_data_3d)
        depth_value_time.push(onetime_depth_value_time)
    }

    return {
        legendData,
        xMovedata,
        yMovedata,
        depth_value_data_x,
        depth_value_data_y,
        depth_value_data_3d,
        depth_value_time
    }
}
const generateData_Manometer = (ogDataArray, metaData) => {
    let pointNum = metaData["pointNum"]
    let depthArray = []
    let legendData = []
    let pressureData_river = []
    let showCount = ogDataArray.length - 1
    showCount = Math.min(8, showCount)

    let depth_value_data = []
    let depth_value_time = []

    let Depth_Data_Map = new Map()
    let Depth_Data = []
    let measureTime = []

    let pressureArrBytime = []

    for (let i = 1; i <= pointNum; i++) {
        depthArray.push(metaData[`point${i}Depth`])
        legendData.push(String(metaData[`point${i}Depth`] + 'm'))
        Depth_Data.push([])
    }
    for (let i = 0; i < showCount; i++) {
        let depth_data_item = []
        let pressureOnetime = []
        for (let j = 0; j < pointNum; j++) {
            let item = []
            item.push(ogDataArray[i][`measureTime`])
            item.push(ogDataArray[i][`pressure${j + 1}`])
            item.push(legendData[j])
            pressureData_river.push(item)
            Depth_Data[j].push(ogDataArray[i][`pressure${j + 1}`])
            depth_data_item.push([ogDataArray[i][`pressure${j + 1}`], depthArray[j]])
            pressureOnetime.push(ogDataArray[i][`pressure${j + 1}`])
        }
        measureTime.push(timeFormat(time(ogDataArray[i][`measureTime`])))
        depth_value_time.push(ogDataArray[i][`measureTime`])
        depth_value_data.push(depth_data_item)
        pressureArrBytime.push(pressureOnetime)
    }
    for (let i = 1; i <= pointNum; i++) {
        Depth_Data_Map.set(legendData[i - 1], Depth_Data[i - 1])
    }

    return {
        legendData,
        pressureData_river,
        Depth_Data_Map,
        measureTime,
        depth_value_data,
        depth_value_time,
        pressureArrBytime
    }
}

const generateData_Manometer_new = (ogDataArray) => {
    console.log(ogDataArray);
    let showCount = ogDataArray.length - 1
    showCount = Math.min(20, showCount)

    let timeArray = []
    let heightArray = []
    let temperatureArray = []
    let frequencyArray = []

    ogDataArray.forEach((item) => {
        timeArray.push(timeFormat(time(item['measureTime'])))
        heightArray.push(item['height'])
        temperatureArray.push(item['temperature'])
        frequencyArray.push(item['frequency'])
    })
    return {
        timeArray,
        heightArray,
        temperatureArray,
        frequencyArray
    }
}


const generateData_Stress = (ogDataArray, metaData) => {
    let pointNum = metaData["pointNum"]
    let depthArray = []
    let legendData = []
    let showCount = ogDataArray.length - 1
    showCount = Math.min(5, showCount)
    let horizontalAngle = []
    let depth_value_hori_data = []
    let depth_value_vert_data = []

    let depth_value_time = []

    for (let i = 1; i <= pointNum; i++) {
        depthArray.push(metaData[`point${i}Depth`])
        legendData.push(String(metaData[`point${i}Depth`] + 'm'))
    }

    for (let i = 0; i < showCount; i++) {
        let horizontalAngleItem = []
        let depth_value_hori_data_item = []
        let depth_value_vert_data_item = []
        for (let j = 0; j < pointNum; j++) {
            horizontalAngleItem.push(ogDataArray[i][`horizontal${j + 1}`])
            depth_value_hori_data_item.push([ogDataArray[i][`horizontal_stress${j + 1}`], depthArray[j]])
            depth_value_vert_data_item.push([ogDataArray[i][`vertical_stress${j + 1}`], depthArray[j]])
        }
        horizontalAngle.push(horizontalAngleItem)
        depth_value_hori_data.push(depth_value_hori_data_item)
        depth_value_vert_data.push(depth_value_vert_data_item)
        depth_value_time.push(ogDataArray[i][`measureTime`])
    }

    return {
        legendData,
        horizontalAngle,
        depth_value_time,
        depth_value_hori_data,
        depth_value_vert_data,
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
            top: '30',
            width: 300,
            left: 0,
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
                symbolSize: 15,
                name: 'XMove',
                type: 'scatter',
                data: processedData.scatterData.time_xMove_scater_data,
                itemStyle: {
                    color: '#FFEE58'
                }
            },
            {
                symbolSize: 15,
                name: 'YMove',
                type: 'scatter',
                data: processedData.scatterData.time_yMove_scater_data,
                itemStyle: {
                    color: '#9CCC65'
                }
            },
            {
                symbolSize: 15,
                name: 'ZMove',
                type: 'scatter',
                data: processedData.scatterData.time_zMove_scater_data,
                itemStyle: {
                    color: '#1976D2'
                }
            },
            {
                type: 'line',
                name: 'XMove回归',
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
                name: 'YMove回归',
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
                name: 'ZMove回归',
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

    // ratio
    let optionRatio = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: 'GNSS综合位移变率'
        },
        grid: {
            show: false,
            left: '25%'
        },
        visualMap: [
            {
                show: true,
                itemGap: 0,
                top: 'middle',
                left: '0%',
                itemSymbol: 'rect',
                type: 'piecewise',
                itemWidth: 15,
                itemHeight: 10,
                //text: [`${processedData.ratioRange[1].toFixed(4)}`, `${processedData.ratioRange[0].toFixed(4)}`],
                text: ['1.0', '-1.0'],
                textGap: 20,
                realtime: false,
                calculable: true,
                seriesIndex: 0,
                splitNumver: 6,
                pieces: [
                    { gt: 0.9, lte: 10, label: "", color: "#03071e" },
                    { gt: 0.8, lte: 0.9, label: "", color: "#370617" },
                    { gt: 0.7, lte: 0.8, label: "", color: "#6a040f" },
                    { gt: 0.6, lte: 0.7, label: "", color: "#9d0208" },
                    { gt: 0.5, lte: 0.6, label: "", color: "#d00000" },
                    { gt: 0.4, lte: 0.5, label: "", color: "#dc2f02" },
                    { gt: 0.3, lte: 0.4, label: "", color: "#e85d04" },
                    { gt: 0.2, lte: 0.3, label: "", color: "#f48c06" },
                    { gt: 0.1, lte: 0.2, label: "", color: "#faa307" },
                    { gt: 0, lte: 0.1, label: "", color: "#ffba08" },
                    { gt: -0.1, lte: 0, label: "", color: "#ffba08" },
                    { gt: -0.2, lte: -0.1, label: "", color: "#faa307" },
                    { gt: -0.3, lte: -0.2, label: "", color: "#f48c06" },
                    { gt: -0.4, lte: -0.3, label: "", color: "#e85d04" },
                    { gt: -0.5, lte: -0.4, label: "", color: "#dc2f02" },
                    { gt: -0.6, lte: -0.5, label: "", color: "#d00000" },
                    { gt: -0.7, lte: -0.6, label: "", color: "#9d0208" },
                    { gt: -0.8, lte: -0.7, label: "", color: "#6a040f" },
                    { gt: -0.9, lte: -0.8, label: "", color: "#370617" },
                    { gt: -10, lte: -0.9, label: "", color: "#03071e" }
                ]
            },
        ],
        xAxis: {
            type: 'time',
            min: 'dataMin',
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
            boundaryGap: [0, '100%']
        },
        series: [
            {
                name: '位移变率',
                type: 'line',
                smooth: true,
                symbol: 'none',
                data: processedData.ratio
            }
        ]
    };


    return {
        // options: [option2dline, option3Dline, option3Dcube, optionScatter, optionRatio]
        options: [optionScatter, optionRatio],
        names: ['位移时间曲线', '综合位移变率'],
    }
}

const generateOptions_Incline = (processedData) => {
    let depth_value_x_series = []
    let depth_value_y_series = []
    let depth_value_3d_series = []
    for (let i = 0; i < processedData.depth_value_time.length; i++) {
        let seriesItemX = {
            name: `${processedData.depth_value_time[i]}`,
            type: 'line',
            smooth: true,
            symbolSize: 10,
            symbol: 'circle',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: processedData.depth_value_data_x[i]
        }
        depth_value_x_series.push(seriesItemX)
        let seriesItemY = {
            name: `${processedData.depth_value_time[i]}`,
            type: 'line',
            smooth: true,
            symbolSize: 10,
            symbol: 'circle',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: processedData.depth_value_data_y[i]
        }
        depth_value_y_series.push(seriesItemY)
        let serieItem3d = {
            name: `${processedData.depth_value_time[i]}`,
            type: 'line3D',
            data: processedData.depth_value_data_3d[i],
            smooth: true,
            lineStyle: {
                width: 3
            }
        }
        depth_value_3d_series.push(serieItem3d)
    }

    let depth_value_x_y_Option = {
        color: ['#106776', '#3185fc', '#cbff8c', '#f2bac9', '#229631'],
        title: [{
            text: 'X向偏移曲线',
            left: '10%'
        }, {
            text: 'Y向偏移曲线',
            right: '10%' // 设置第二个标题在右边
        }],
        grid: [{
            left: '5%',
            right: '50%',
            top: 80,
            bottom: 20,
            containLabel: true
        }, {
            left: '55%',
            right: '5%',
            top: 80,
            bottom: 20,
            containLabel: true
        }],
        legend: {
            top: 30,
            itemGap: 5,
            itemWidth: 15,
            itemHeight: 6,
            formatter: function (value) {
                return echarts.format.formatTime('hh:ss', value);
            }
        },
        xAxis: [
            {
                type: 'value',
                gridIndex: 0,
                name: '偏移量',
                position: 'top',
                nameLocation: 'middle',
                axisLabel: {
                    margin: 1,
                    interval: 2,
                }
            },
            {
                type: 'value',
                gridIndex: 1,
                name: '偏移量',
                position: 'top',
                nameLocation: 'middle',
                axisLabel: {
                    margin: 1,
                    interval: 2,
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                gridIndex: 0,
                inverse: true,
                name: '深度',
                nameLocation: 'middle',
                axisLabel: {
                    margin: 1,
                }
            },
            {
                type: 'value',
                scale: true,
                gridIndex: 1,
                inverse: true,
                name: '深度',
                nameLocation: 'middle',
                axisLabel: {
                    margin: 1,
                }

            }
        ],
        tooltip: {
            trigger: 'axis',
        },
        series: depth_value_x_series
    };
    depth_value_x_y_Option.series.push(...depth_value_y_series)


    //3d 深度偏移曲线
    let option3Dline = {
        title: {
            text: "三维偏移曲线",
            left: 'center'
        },
        legend: {
            top: 25,
            left: '2%',
            orient: 'horizontal',
            itemGap: 5,
            itemWidth: 15,
            itemHeight: 6,

            formatter: function (value) {
                return echarts.format.formatTime('hh:ss', value);
            }
        },
        tooltip: {},
        type: 'continuous',
        // visualMap: {
        //     show: false,
        //     dimension: 3,
        //     min: 0,
        //     max: timeDif(processedData.startTime, processedData.endTime),
        //     inRange: {
        //         color: [
        //             '#313695',
        //             '#4575b4',
        //             '#74add1',
        //             '#abd9e9',
        //             '#e0f3f8',
        //             '#ffffbf',
        //             '#fee090',
        //             '#fdae61',
        //             '#f46d43',
        //             '#d73027',
        //             '#a50026'
        //         ],
        //         opacity: [0.5, 1.0]
        //     }
        // },
        xAxis3D: {
            type: 'value',
            min: 'dataMin'
        },
        yAxis3D: {
            type: 'value',
            min: 'dataMin'
        },
        zAxis3D: {
            type: 'value',
            min: 'dataMin'
        },
        grid3D: {
            top: 35, // 调整上边距
            bottom: 0,
            height: 210,
            viewControl: {
                projection: 'orthographic'
            }
        },
        series: depth_value_3d_series
    };
    return {
        options: [option3Dline, depth_value_x_y_Option],
        names: ["三维偏移曲线", "X-Y偏移曲线"],
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
        title: {
            text: "水压力河流图",
            left: 'center'
        },
        legend: {
            top: 40,
            data: processedData.legendData
        },
        singleAxis: {
            top: 50,
            bottom: 50,
            max: 'dataMax',
            axisTick: {},
            axisLabel: {
                formatter: function (value, index) {
                    // if (index === 0 || index === dataIndexArray.length - 1) {
                    if (index % 2 === 0) {
                        return echarts.format.formatTime('hh:ss', value);
                    }
                }
            },
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
    let optionPolarStack_Seriers = []

    processedData.Depth_Data_Map.forEach((value, key) => {
        let data = value
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
        title: {
            text: "水压力极坐标堆叠图",
            left: 'center'
        },
        angleAxis: {
            //pressure
        },
        radiusAxis: {
            type: 'category',
            data: processedData.measureTime,
            z: 10
        },
        polar: {
            center: ['50%', '60%'],
            radius: '65%'
        },
        series: optionPolarStack_Seriers,
        legend: {
            show: true,
            top: 25,
            data: processedData.legendData
        }
    };

    let optionDepthSeries = []
    for (let i = 0; i < processedData.depth_value_time.length; i++) {
        let seriesItem = {
            name: `${processedData.depth_value_time[i]}`,
            type: 'line',
            smooth: true,
            symbolSize: 10,
            symbol: 'circle',
            data: processedData.depth_value_data[i]
        }
        optionDepthSeries.push(seriesItem)
    }


    let optionDepthValue = {
        title: {
            text: "压力深度曲线",
            left: 'center'
        },
        grid: {
            x: 30,
            y: 100,
            x2: 30,
            y2: 10,
            borderWidth: 1
        },
        legend: {
            top: 25,
            itemWidth: 18,
            itemHeight: 5,
            formatter: function (value) {
                return echarts.format.formatTime('hh:ss', value);
            }
        },
        xAxis: {
            type: 'value',
            position: 'top',
            nameLocation: 'middle',
            name: '水压力(mPa)',
            scale: true,
            axisLabel: {
                margin: 3,
            }
        },
        yAxis: {
            type: 'value',
            scale: true,
            inverse: true,
            nameLocation: 'middle',
            name: '深度(m)',
            axisLabel: {
                margin: 3,
            }
        },
        tooltip: {
            trigger: 'axis',
        },
        series: optionDepthSeries
    }

    let optionDynamicBar = {
        grid: {
            top: 70,
            left: 50,
            right: 50,
            bottom: 50
        },
        title: {
            text: "压力深度柱状图",
            left: 'center'
        },
        xAxis: {
            name: '水压力(mPa)',
            nameLocation: 'middle',
            axisLabel: {
                margin: 3
            }
        },
        yAxis: {
            type: 'category',
            name: '深度(m)',
            nameLocation: 'start',
            data: processedData.legendData,
            inverse: true,
            animationDuration: 300,
            animationDurationUpdate: 300,
        },
        series: [
            {
                realtimeSort: true,
                name: processedData.depth_value_time[0],
                type: 'bar',
                data: processedData.pressureArrBytime[0],
                label: {
                    show: true,
                    position: 'right',
                    valueAnimation: true
                },
                showBackground: true,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: '#83bff6' },
                        { offset: 0.8, color: '#188df0' },
                        { offset: 1, color: '#188df0' }
                    ])
                },
            }
        ],
        tooltip: {

        },
        legend: {
            top: 36,
            show: true
        },
        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
    };

    return {
        options: [optionRiver, optionPolarStack, optionDepthValue, optionDynamicBar],
        names: ['河流图', '极坐标堆叠图', '压力深度曲线'],
    }

}
const generateOptions_Manometer_new = (processedData) => {
    let option1 = {
        xAxis: {
            type: time,
            data: processedData.timeArray
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: processedData.heightArray,
                type: 'line'
            }
        ]
    };
    let option2 = {
        xAxis: {
            type: time,
            data: processedData.timeArray
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: processedData.temperatureArray,
                type: 'line'
            }
        ]
    };
    return {
        names: ['水位折线图', '测温折线图'],
        options: [option1,option2]
    }

}
const generateOptions_Stress = (processedData) => {

    //gaugeOption 
    let gaugeData = MonitorDataAssistant.getOnegaugeData(processedData.horizontalAngle[0], processedData.legendData)
    let gaugeOption = {
        tooltip: {},
        grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        title: {
            show: true,
            text: '水平应力角度',
            x: 'center',
            y: 'top',
            textAlign: 'left'
        },
        series: [
            {
                center: ["50%", "64%"],
                radius: "100%",
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
                    formatter: '{value}°'
                }
            }
        ]
    };

    let depth_value_hori_series = []
    let depth_value_vert_series = []
    for (let i = 0; i < processedData.depth_value_time.length; i++) {
        let seriesItemX = {
            name: `${processedData.depth_value_time[i]}`,
            type: 'line',
            smooth: true,
            symbolSize: 10,
            symbol: 'circle',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: processedData.depth_value_hori_data[i]
        }
        depth_value_hori_series.push(seriesItemX)
        let seriesItemY = {
            name: `${processedData.depth_value_time[i]}`,
            type: 'line',
            smooth: true,
            symbolSize: 10,
            symbol: 'circle',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: processedData.depth_value_vert_data[i]
        }
        depth_value_vert_series.push(seriesItemY)
    }
    let depth_value_hori_vert_Option = {
        // color: ['#106776', '#3185fc', '#cbff8c', '#f2bac9', '#229631'],
        title: [{
            text: '水平-垂直受力偏移曲线',
            left: '18%'
        }],
        grid: [{
            left: '5%',
            right: '55%',
            top: 70,
            bottom: 20,
            containLabel: true
        }, {
            left: '55%',
            right: '5%',
            top: 70,
            bottom: 20,
            containLabel: true
        }],
        legend: {
            top: 30,
            itemWidth: 10,
            itemHeight: 8,
            formatter: function (value) {
                return echarts.format.formatTime('hh:ss', value);
            }
        },
        xAxis: [
            {
                type: 'value',
                gridIndex: 0,
                name: '水平受力(N)',
                position: 'top',
                nameLocation: 'middle',
                axisTick: {
                    show: false // 不展示刻度线
                },
                axisLabel: {
                    margin: 1,
                    interval: 2,
                }
            },
            {
                type: 'value',
                gridIndex: 1,
                name: '垂直受力(N)',
                position: 'top',
                nameLocation: 'middle',
                axisTick: {
                    show: false // 不展示刻度线
                },
                axisLabel: {
                    margin: 1,
                    interval: 2,
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                gridIndex: 0,
                inverse: true,
                name: '深度',
                nameLocation: 'middle',
                axisTick: {
                    show: false // 不展示刻度线
                },
                axisLabel: {
                    margin: 1,
                }
            },
            {
                type: 'value',
                scale: true,
                gridIndex: 1,
                inverse: true,
                name: '深度',
                nameLocation: 'middle',
                axisTick: {
                    show: false // 不展示刻度线
                },
                axisLabel: {
                    margin: 1,
                }

            }
        ],
        tooltip: {
            trigger: 'axis',
        },
        series: depth_value_vert_series
    };
    depth_value_hori_vert_Option.series.push(...depth_value_hori_series)


    // test doble-bar
    const xData = processedData.legendData
    const horiDataOneTime = []
    const vertDataOneTime = []
    for (let i = 0; i < processedData.legendData.length; i++) {
        horiDataOneTime.push(processedData.depth_value_hori_data[0][i][0])
        vertDataOneTime.push(processedData.depth_value_vert_data[0][i][0])
    }
    const timeLineData = [1];
    let colors = [
        {
            borderColor: "#0096c7",
            start: "#90e0ef",
            end: "#0096c7"
        },
        {
            borderColor: "#49A179",
            start: "#49A179",
            end: "#95d5b2"
        },
    ];
    let doubleBarOption = {
        baseOption: {
            //timeline::在多个option 间进行切换、播放等操作 ::baseOption 和一个 switchableOption 会用来计算最终的 finalOption
            timeline: {
                show: false,
                top: 0,
                data: []
            },
            title: {
                text: `应力桩-水平垂直受力图`,
                left: 'center',
                fontSize: 20,

            },
            grid: [
                // 3个grid
                {
                    show: false,
                    left: '14%',
                    top: '20%',
                    bottom: '2%',
                    containLabel: true,
                    width: '30%'
                },
                {
                    show: false,
                    left: '52.5%',
                    top: '19%',
                    bottom: '7%',
                    width: '0%'
                },
                {
                    show: false,
                    right: '12%',
                    top: '20%',
                    bottom: '2%',
                    containLabel: true,
                    width: '30%'
                }
            ],
            xAxis: [
                {
                    type: 'value',
                    inverse: true,
                    axisLine: {
                        show: true,
                        onZero: true, // X 轴或者 Y 轴的轴线是否在另一个轴的 0 刻度上
                        lineStyle: {
                            color: colors[0].borderColor,
                        }
                    },
                    axisTick: {
                        show: true
                    },
                    position: 'bottom',// bottom 且 inverse ==>朝左
                    axisLabel: {
                        show: true,
                        color: colors[0].borderColor,
                        fontSize: 10,
                        fontFamily: "DINPro-Regular"
                    },
                    splitLine: {
                        show: false
                    },
                },
                {
                    //中间不展示，只做轴
                    gridIndex: 1,
                    show: false
                },
                {
                    gridIndex: 2,
                    inverse: false,//正常向右，no inverse
                    axisLine: {
                        show: true,
                        onZero: true,
                        lineStyle: {
                            color: colors[1].borderColor
                        }
                    },
                    axisTick: {
                        show: true
                    },
                    position: 'bottom',
                    axisLabel: {
                        show: true,
                        color: colors[1].borderColor,
                        fontSize: 10,
                        fontFamily: "DINPro-Regular"
                    },
                    splitLine: {
                        show: false
                    },
                }
            ],
            yAxis: [
                {
                    type: 'category',//按深度 category 
                    inverse: true,
                    position: 'right',//轴放右边，bar朝左边
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#00A5CA45'
                        }
                    },
                    //不显示y轴线
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    data: xData,//深度
                },
                {
                    //注意中间这个空图表的操作,左右图共享轴线
                    gridIndex: 1,
                    type: 'category',
                    inverse: true,
                    // position: 'left',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    // 只显示 居中的label, 不显示轴线,刻度线
                    axisLabel: {
                        show: true,
                        margin: 5,
                        // padding:[-5,0,20,0],
                        textStyle: {
                            color: '#00425C',
                            fontWeight: 'bolder',
                            fontSize: 12,
                        },
                        align: "center"
                    },
                    data: xData.map(function (value) {
                        return {
                            value: value,
                            textStyle: {
                                align: 'center',
                            }
                        }
                    })
                },
                {
                    gridIndex: 2,
                    type: 'category',
                    inverse: true,
                    position: 'left',
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#00A5CA45'
                        }
                    },
                    //不显示y轴线
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    data: xData
                }
            ],
            legend: {
                top: '10%',
                itemGap: 30,
                left: '16%'
            },
            tooltip: {},
            series: []
        },
        options: []
    }
    doubleBarOption.baseOption.timeline.data.push(timeLineData[0])
    doubleBarOption.options.push({
        series: [
            {
                name: "水平受力(N)",
                type: "bar",
                xAxisIndex: 0,
                yAxisIndex: 0,
                itemStyle: {
                    normal: {
                        label: {
                            //bar的数值显示
                            show: true,
                            position: 'left',
                            textStyle: {
                                color: colors[0].borderColor,
                                fontSize: 10
                            }
                        },
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: colors[0].start
                        },
                        {
                            offset: 1,
                            color: colors[0].end
                        }
                        ]),
                        borderColor: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: colors[0].borderColor
                        },
                        {
                            offset: 1,
                            color: colors[0].end
                        }
                        ]),
                        borderWidth: 1
                    }
                },
                data: horiDataOneTime,
                animationEasing: "elasticOut"
            },
            {
                name: "垂直受力(N)",
                type: "bar",
                stack: "2",
                // barWidth: 25,
                xAxisIndex: 2,
                yAxisIndex: 2,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                color: colors[1].borderColor,
                                fontSize: 10
                            }
                        },
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: colors[1].start
                        },
                        {
                            offset: 1,
                            color: colors[1].end
                        }
                        ]),
                        borderColor: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: colors[1].start
                        },
                        {
                            offset: 1,
                            color: colors[1].borderColor
                        }
                        ]),
                        borderWidth: 1
                    }
                },
                data: vertDataOneTime,
                animationEasing: "elasticOut"
            }
        ]
    })
    return {
        options: [gaugeOption, depth_value_hori_vert_Option, doubleBarOption],
        names: ['水平应力角度', '受力偏移曲线', '受力柱状图']
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
        this.monitoringMetaData = {};
        this.processedData = {};
    }

    async getMonitoringdata() {
        console.log(this.info);
        //general infomation
        this.monitoringData = (await BackEndRequest.getMonitorDetailByType_Code(this.info["code"], this.info["type"])).data
        console.log(this.monitoringData);
        //meta infomation -- pointnum
        this.monitoringMetaData = (await BackEndRequest.getMonitorInfoByType_Code(this.info["code"], this.info["type"])).data
        console.log(this.monitoringMetaData);
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
                // this.processedData = generateData_Manometer_new(this.monitoringData)
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
                // this.chartOptions = generateOptions_Manometer_new(this.processedData)

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
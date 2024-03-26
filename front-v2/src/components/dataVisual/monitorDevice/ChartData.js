import BackEndRequest from '../../../api/backend'
import * as echarts from 'echarts'
import 'echarts-gl';
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


    let showCount = ogDataArray.length
    showCount = 20;//50 IS ENOUGH
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

    let showCount = 5   //50enough

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
    let showCount = 8   //50enough

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
            align: 'left',
            top: '40',
            itemWidth: 8,
            itemHeight: 8,
            y: '20',
            x: 'center',
            formatter: (name) => {
                return `{b|${name}} `;
            },
            textStyle: {
                color: '#999999',
                fontSize: 12,
                align: 'left',
                backgroundColor: "transparent",
                rich: {
                    b: {
                        width: 150,
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
            left: '15%'
        },
        visualMap: [
            {
                show: true,
                itemGap: 0,
                top: 'middle',
                left: '2%',
                itemSymbol: 'rect',
                type: 'piecewise',
                text: [`${processedData.ratioRange[1].toFixed(4)}`, `${processedData.ratioRange[0].toFixed(4)}`],
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
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'time',
            axisLabel: {
                formatter: function (value) {
                    return echarts.format.formatTime('hh:ss', value);
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
        options: [option2dline, option3Dline, option3Dcube, optionScatter, optionRatio]
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

    // 深度 偏移曲线
    let depth_value_xOption = {
        title: {
            text: "测斜仪-X向偏移曲线",
            left: 'center'
        },
        grid: {
            x: 30,
            y: 90,
            x2: 30,
            y2: 30,
            borderWidth: 1
        },
        legend: {
            top: 30,
            formatter: function (value) {
                return echarts.format.formatTime('hh:ss', value);
            }
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'value',
            scale: true,
        },
        tooltip: {
            trigger: 'axis',
        },
        series: depth_value_x_series

    }
    let depth_value_yOption = {
        title: {
            text: "测斜仪-Y向偏移曲线",
            left: 'center'
        },
        grid: {
            x: 30,
            y: 90,
            x2: 30,
            y2: 30,
            borderWidth: 1
        },
        legend: {
            top: 30,
            formatter: function (value) {
                return echarts.format.formatTime('hh:ss', value);
            }
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'value',
            scale: true,
        },
        tooltip: {
            trigger: 'axis',
        },
        series: depth_value_y_series
    }
    let depth_value_x_y_Option = {
        color: ['#106776', '#3185fc', '#cbff8c', '#f2bac9', '#229631'],
        title: [{
            text: '测斜仪-X向偏移曲线',
            left: '10%'
        }, {
            text: '测斜仪-Y向偏移曲线',
            right: '10%' // 设置第二个标题在右边
        }],
        grid: [{
            left: '3%',
            right: '55%',
            top: 90,
            bottom: 30,
            containLabel: true
        }, {
            left: '58%',
            right: '5%',
            top: 90,
            bottom: 30,
            containLabel: true
        }],
        legend: {
            top: 30,
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

    // 合并另一个图表的 series 到 option 中
    depth_value_x_y_Option.series.push(...depth_value_y_series);


    //3d 深度偏移曲线
    let option3Dline = {
        title: {
            text: "测斜仪-三维偏移曲线",
            left: 'center'
        },
        legend: {
            top: 30,
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
            top: 40, // 调整上边距
            bottom: 0,
            height: 300,
            viewControl: {
                projection: 'orthographic'
            }
        },
        series: depth_value_3d_series
    };


    return {
        xMoveOption,
        yMoveOption,
        options: [xMoveOption, yMoveOption, option3Dline, depth_value_x_y_Option]
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
            text: "孔隙水压力计-压力深度曲线",
            left: 'center'
        },
        grid: {
            x: 30,
            y: 90,
            x2: 30,
            y2: 10,
            borderWidth: 1
        },
        legend: {
            top: 30,
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
            top: 40,
            left: 50,
            right: 70,
            bottom: 50
        },
        xAxis: {
            max: 'dataMax',
            name: '水压力(mPa)',
            nameLocation:'middle',
            axisLabel:{
                margin:3
            }
        },
        yAxis: {
            type: 'category',
            name: '深度(m)',
            nameLocation:'start',
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
            show: true
        },
        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
    };


    return {
        options: [optionRiver, optionPolarStack, optionDepthValue, optionDynamicBar]
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
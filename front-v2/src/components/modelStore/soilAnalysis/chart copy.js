import * as echarts from 'echarts'


export default class sectionChart {


    constructor(dom, dataInfo) {
        this.dom = dom
        this.dataInfo = dataInfo
        this.newDataInfo = dataInfo

    }

    resizeChart() {
        this.myChart.resize()
    }


    initGraphic() {
        console.log('init graphic')
        let ogPointData = this.dataInfo.pointData
        let ogThicknessData = this.dataInfo.thicknessData
        let ogLineData = this.dataInfo.lineData
        let graphicOpt = this.getGraphicOption(ogPointData, ogThicknessData, ogLineData)
        this.myChart.setOption({
            graphic: graphicOpt
        })

        // this.myChart.on('datazoom', () => {
        //     this.onDataZoom()
        // })

    }

    initBaseChart() {
        this.myChart = echarts.init(this.dom)
        let ogLineData = this.dataInfo.lineData
        let ogPointData = this.dataInfo.pointData
        let ogThicknessData = this.dataInfo.thicknessData
        let baseOption = this.getBaseOption(ogLineData, ogPointData, ogThicknessData)
        this.myChart.setOption(baseOption)
    }


    getGraphicOption(pointData, thicknessData, lineData) {
        //data 
        var showWidth = 2000;
        showWidth = window.innerWidth || document.documentElement.clientWidth;
        showWidth = showWidth
        let graphic = [];
        for (let i = 0; i < pointData.length; i++) {
            let item = pointData[i];
            let dataIndex = i;
            graphic.push({
                type: 'circle',
                x: this.myChart.convertToPixel('grid', item)[0],
                y: this.myChart.convertToPixel('grid', item)[1],
                shape: { r: 15 / 2 },
                invisible: false,
                draggable: dataIndex > 0 && dataIndex < pointData.length - 1,
                style: {
                    fill: '#ffb004d0',
                    borderColor: '#25f0ff7e',
                },
                ondrag: echarts.util.curry(this.onPointDragging, {
                    dataIndex: dataIndex,
                    pointData: pointData,
                    lineData: lineData,
                    chartIns: this
                }),
                ondragend: echarts.util.curry(this.onPointDragEnd, {
                    dataIndex: dataIndex,
                    pointData: pointData,
                    lineData: lineData,
                    chartIns: this
                }),
                z: 100
            })
        }

        for (let i = 0; i < thicknessData.length; i++) {
            let value = thicknessData[i];
            let dataIndex = i;
            graphic.push(
                {
                    type: 'rect',
                    z: 100,
                    shape: {
                        width: showWidth,
                        height: 0
                    },
                    invisible: true,
                    position: [0, this.myChart.convertToPixel({ yAxisId: 'y' }, value)],
                    draggable: true,
                    style: {
                        fill: 'rgba(0, 0, 0, 1)',
                        stroke: 'rgba(0,0,0,1)',
                        lineWidth: 4
                    },
                    cursor: 'move',
                    ondrag: echarts.util.curry(this.onLineDrag, {
                        thicknessData: thicknessData,
                        dataIndex: dataIndex,
                        chartIns: this
                    }),
                }
            )
        }
        return graphic;

    }


    getBaseOption(lineData, pointData, thicknessData) {
        // data 
        let markLineData = this.getMarkLineData(thicknessData)
        // console.log(thicknessData)
        let baseOption = {
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                top: '10%',
                containLabel: true,
            },
            // tooltip: {
            // },
            toolbox: {
                right: 10,
                feature: {
                    // dataZoom: {
                    //     // yAxisIndex: 'none',
                    // },
                    restore: {},
                    saveAsImage: {},
                },
            },
            dataZoom: [
                // {
                //     type: 'slider',
                //     height: 25,
                //     bottom: 5,
                // },
                // {
                //     type: 'inside',
                // }
            ],
            xAxis: {
                type: 'value', min: 0, max: 'dataMax',
                name: 'Station(m)',
                nameLocation: 'middle',
                nameGap: 25,
                nameTextStyle: {
                    fontSize: 20,
                    // align: 'left',
                    // verticalAlign: 'top',
                    fontWeight: 'bold',
                },
            },
            yAxis: {
                type: 'value', id: 'y',
                min: -39,
                max: 4,
                name: 'Elevation(m)',
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    // align: 'left',
                    // verticalAlign: 'top',
                },
            },
            series: [
                {
                    id: 'line',
                    type: 'line',
                    smooth: false,
                    data: lineData,
                    symbol: 'none',
                    z: 1,
                    lineStyle: {
                        color: '#746800',
                        opacity: 1,
                        width: 5,
                    },
                    markLine: {
                        animation: false,
                        symbol: ['triangle', 'arrow'],
                        data: markLineData
                    }

                },
                // {
                //     id: 'point',
                //     type: 'scatter',
                //     smooth: false,
                //     data: pointData,
                //     symbol: 'circle',
                //     symbolSize: 15,
                //     z: 2,
                //     itemStyle: {
                //         color: '#0051ff60',
                //         opacity: 1,
                //         borderColor: '#25f0ff7e',
                //         borderWidth: 2,

                //     },
                // }
            ]
        }
        return baseOption
    }


    getMarkLineData(thicknessData) {
        let colorArray = ['#15ff00', '#3700ff', '#a200ff', '#FF8E00', '#009bb6']
        let markLineData = []
        thicknessData.forEach((value, index) => {
            let item = {
                name: `Layer ${index + 1}`,
                yAxis: value,
                lineStyle: {
                    color: colorArray[index],
                    width: 3,
                },
                label: {
                    show: true,
                    position: 'insideEndBottom',
                    fontSize: 15,
                    formatter: (params) => { return `Layer ${index + 1}` + Math.round(params.value * 100) / 100 + ' M' }
                },
            }
            markLineData.push(item)
        })
        return markLineData
    }


    // tool 
    findAdjacentIndices(points, x) {
        let left = 0;
        let right = points.length - 1;

        // 使用二分查找找到插入点
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (points[mid][0] > x) {
                right = mid - 1;
            } else if (points[mid][0] < x) {
                left = mid + 1;
            } else {
                // 如果找到了确切的x值，返回这个点的索引
                return [mid, mid];
            }
        }

        // 如果x不在数组中，left是x应该插入的位置
        if (left > 0) {
            // x在两个点之间
            return [left - 1, left];
        } else {
            // x在第一个点之前
            return [-1, 0];
        }
    }

    getYFromLine(x1, y1, x2, y2, x) {
        if (x1 === x2) {
            if (x === x1) {
                return y1;
            }
            else {
                console.log('x1 === x2 && x !== x1');
                return null;
            }
        } else {
            return y1 + (x - x1) * ((y2 - y1) / (x2 - x1));
        }
    }

    onPointDragging(dataInfo) {
        const { dataIndex, pointData, lineData, chartIns } = dataInfo
        let myChart = chartIns.myChart
        let dragPos = myChart.convertFromPixel('grid', this.position)
        let startPoint = pointData[0]
        let endPoint = pointData[pointData.length - 1]

        let adjacentIndex = chartIns.findAdjacentIndices(lineData, dragPos[0])
        let lastPoint = lineData[adjacentIndex[0]]
        let nextPoint = lineData[adjacentIndex[1]]


        if (dragPos[0] < startPoint[0]) {
            let graphicOptionItem = myChart.getOption().graphic[0].elements[dataIndex]
            let posIn2d = myChart.convertToPixel('grid', startPoint)
            graphicOptionItem.x = posIn2d[0] + 0.1
            graphicOptionItem.y = posIn2d[1]
            let ogOption = myChart.getOption();
            ogOption.graphic[0].elements[dataIndex] = graphicOptionItem;
            myChart.setOption(ogOption);
        }
        else if (dragPos[0] > endPoint[0]) {
            let graphicOptionItem = myChart.getOption().graphic[0].elements[dataIndex]
            let posIn2d = myChart.convertToPixel('grid', endPoint)
            graphicOptionItem.x = posIn2d[0] - 0.1
            graphicOptionItem.y = posIn2d[1]
            let ogOption = myChart.getOption();
            ogOption.graphic[0].elements[dataIndex] = graphicOptionItem;
            myChart.setOption(ogOption);
        }
        else {
            let y = chartIns.getYFromLine(lastPoint[0], lastPoint[1], nextPoint[0], nextPoint[1], dragPos[0])
            let graphicOptionItem = myChart.getOption().graphic[0].elements[dataIndex]
            graphicOptionItem.x = myChart.convertToPixel('grid', [dragPos[0], y])[0]
            graphicOptionItem.y = myChart.convertToPixel('grid', [dragPos[0], y])[1]
            let ogOption = myChart.getOption();
            ogOption.graphic[0].elements[dataIndex] = graphicOptionItem;
            myChart.setOption(ogOption);
        }
    }

    onPointDragEnd(dataInfo) {
        let myChart = dataInfo.chartIns.myChart
        let el = myChart.getOption().graphic[0].elements
        for (let i = 0; i < 23; i++) {
            dataInfo.chartIns.newDataInfo.pointData[i] = myChart.convertFromPixel('grid', [el[i].x, el[i].y])
        }
        // console.log('drag end', dataInfo.chartIns.newDataInfo.pointData)
    }

    onLineDrag(dataInfo) {
        const { thicknessData, dataIndex } = dataInfo
        let myChart = dataInfo.chartIns.myChart
        let yAxisValue = myChart.convertFromPixel({ yAxisId: 'y' }, this.position[1]);

        dataInfo.chartIns.newDataInfo.thicknessData[dataIndex] = yAxisValue

        const updateMarkLine = (newData) => {
            let newMarkLineData = dataInfo.chartIns.getMarkLineData(newData)
            // console.log('update mark line', newData, newMarkLineData)
            myChart.setOption({
                series: [{
                    id: 'line',
                    markLine: {
                        data: newMarkLineData
                    }
                }]
            });
        }
        updateMarkLine(dataInfo.chartIns.newDataInfo.thicknessData)
        // console.log('line drag end', dataInfo.chartIns.newDataInfo.thicknessData)
    }

    reset() {

    }

    onDataZoom() {
        console.log(this.newDataInfo)
        let myChart = this.myChart

        const updateGraphicOpt = (newData) => {
            let graphic = myChart.getOption().graphic
            let el = graphic[0].elements
            for (let i = 0; i < 23; i++) {
                let pixelPos = myChart.convertToPixel('grid', newData[i])
                el[i].x = pixelPos[0]
                el[i].y = pixelPos[1]
                // el[i].invisible = true
            }
            graphic[0].elements = el
            myChart.setOption({
                graphic: graphic
            })
            // setTimeout(() => {
            //     for (let i = 0; i < 23; i++) {
            //         el[i].invisible = false
            //     }
            //     myChart.setOption({
            //         graphic: graphic
            //     })
            // }, 500);
        }
        updateGraphicOpt(this.newDataInfo.pointData)
    }


}

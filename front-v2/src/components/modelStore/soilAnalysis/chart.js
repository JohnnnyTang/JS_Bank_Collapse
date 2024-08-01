import section from './section.json'
import * as echarts from 'echarts'


export const getData = async () => {
    return new Promise((resolve, reject) => {
        resolve(section)
    })
}

export const dataGenerate = (origin) => {
    const lineData = []
    const lineDataStep = origin['step']
    const pointData = []
    const pointDataStep = origin['step_er']
    for (let i = 0; i < origin['points'].length; i++) {
        let point = origin['points'][i]
        lineData.push([lineDataStep * i, point[2]])
    }
    // let offsetIndex = origin['deepest_index'] - 23
    let scatterStart = lineDataStep * origin['deepest_index'] - (origin['points_er'].length - 1) * pointDataStep

    for (let i = 0; i < origin['points_er'].length; i++) {
        let point = origin['points_er'][i]
        pointData.push([scatterStart + i * pointDataStep, point[2]])
    }

    return {
        lineData,
        pointData,
        thicknessData: [
            1.93, -4.07, -11.57, -26.57, -36.57
        ]
    }
}

export const getTestData = async () => {
    const ogdata = await getData()
    const data = dataGenerate(ogdata)
    return data
}




// const drawChart = (lineData, pointData, thicknessData, dom) => {

//     let newPointData = pointData//23
//     let newThicknessData = thicknessData//5

//     let myChart = echarts.init(dom);



//     let baseOption = {
//         grid: {
//             left: '2%',
//             right: '4%',
//             bottom: '10%',
//             top: '10%',
//             containLabel: true,
//         },
//         // tooltip: {

//         // },
//         toolbox: {
//             right: 10,
//             feature: {
//                 dataZoom: {
//                     yAxisIndex: 'none',
//                 },
//                 restore: {},
//                 saveAsImage: {},
//             },
//         },
//         dataZoom: [
//             {
//                 type: 'slider',
//                 height: 25,
//                 bottom: 5,
//             },
//         ],
//         xAxis: {
//             type: 'value', min: 0, max: 'dataMax',
//             name: 'Station(m)',
//             nameLocation: 'middle',
//             nameGap: 25,
//             nameTextStyle: {
//                 fontSize: 20,
//                 // align: 'left',
//                 // verticalAlign: 'top',
//                 fontWeight: 'bold',
//             },
//         },
//         yAxis: {
//             type: 'value', id: 'y',
//             min: -39,
//             max: 4,
//             name: 'Elevation(m)',
//             nameLocation: 'middle',
//             nameGap: 30,
//             nameTextStyle: {
//                 fontSize: 20,
//                 fontWeight: 'bold',
//                 // align: 'left',
//                 // verticalAlign: 'top',
//             },
//         },
//         series: [
//             {
//                 id: 'line',
//                 type: 'line',
//                 smooth: false,
//                 data: lineData,
//                 symbol: 'none',
//                 z: 1,
//                 lineStyle: {
//                     color: '#746800',
//                     opacity: 1,
//                     width: 5,
//                 },
//                 markLine: {
//                     animation: false,
//                     symbol: ['triangle', 'arrow'],
//                     data: markLineData
//                 }

//             },
//             {
//                 id: 'point',
//                 type: 'scatter',
//                 smooth: false,
//                 data: pointData,
//                 symbol: 'circle',
//                 symbolSize: 15,
//                 z: 2,
//                 itemStyle: {
//                     color: '#0051ff2a',
//                     opacity: 1,
//                     borderColor: '#25f0ff50',
//                     borderWidth: 2,

//                 },
//             }
//         ]
//     }

//     myChart.setOption(baseOption);

//     function findAdjacentIndices(points, x) {
//         let left = 0;
//         let right = points.length - 1;

//         // 使用二分查找找到插入点
//         while (left <= right) {
//             let mid = Math.floor((left + right) / 2);
//             if (points[mid][0] > x) {
//                 right = mid - 1;
//             } else if (points[mid][0] < x) {
//                 left = mid + 1;
//             } else {
//                 // 如果找到了确切的x值，返回这个点的索引
//                 return [mid, mid];
//             }
//         }

//         // 如果x不在数组中，left是x应该插入的位置
//         if (left > 0) {
//             // x在两个点之间
//             return [left - 1, left];
//         } else {
//             // x在第一个点之前
//             return [-1, 0];
//         }
//     }

//     function getYFromLine(x1, y1, x2, y2, x) {
//         if (x1 === x2) {
//             if (x === x1) {
//                 return y1;
//             }
//             else {
//                 console.log('x1 === x2 && x !== x1');
//                 return null;
//             }
//         } else {
//             return y1 + (x - x1) * ((y2 - y1) / (x2 - x1));
//         }
//     }

//     function onPointDragging(dataInfo) {

//         const { dataIndex, pointData, lineData } = dataInfo
//         let dragPos = myChart.convertFromPixel('grid', this.position)
//         let startPoint = pointData[0]
//         let endPoint = pointData[pointData.length - 1]

//         let adjacentIndex = findAdjacentIndices(lineData, dragPos[0])
//         let lastPoint = lineData[adjacentIndex[0]]
//         let nextPoint = lineData[adjacentIndex[1]]


//         if (dragPos[0] < startPoint[0]) {
//             let graphicOptionItem = myChart.getOption().graphic[0].elements[dataIndex]
//             let posIn2d = myChart.convertToPixel('grid', startPoint)
//             graphicOptionItem.x = posIn2d[0] + 0.1
//             graphicOptionItem.y = posIn2d[1]
//             let ogOption = myChart.getOption();
//             ogOption.graphic[0].elements[dataIndex] = graphicOptionItem;
//             myChart.setOption(ogOption);
//         }
//         else if (dragPos[0] > endPoint[0]) {
//             let graphicOptionItem = myChart.getOption().graphic[0].elements[dataIndex]
//             let posIn2d = myChart.convertToPixel('grid', endPoint)
//             graphicOptionItem.x = posIn2d[0] - 0.1
//             graphicOptionItem.y = posIn2d[1]
//             let ogOption = myChart.getOption();
//             ogOption.graphic[0].elements[dataIndex] = graphicOptionItem;
//             myChart.setOption(ogOption);
//         }
//         else {
//             let y = getYFromLine(lastPoint[0], lastPoint[1], nextPoint[0], nextPoint[1], dragPos[0])
//             let graphicOptionItem = myChart.getOption().graphic[0].elements[dataIndex]
//             graphicOptionItem.x = myChart.convertToPixel('grid', [dragPos[0], y])[0]
//             graphicOptionItem.y = myChart.convertToPixel('grid', [dragPos[0], y])[1]
//             let ogOption = myChart.getOption();
//             ogOption.graphic[0].elements[dataIndex] = graphicOptionItem;
//             myChart.setOption(ogOption);
//         }
//     }

//     function onPointDragEnd(dataIndex, pointData) {
//         let el = myChart.getOption().graphic[0].elements
//         for (let i = 0; i < 23; i++) {
//             newPointData[i] = myChart.convertFromPixel('grid', [el[i].x, el[i].y])
//         }
//         newPointData = newPointData
//     }

//     function onLineDrag(dataInfo) {
//         const { thicknessData, dataIndex } = dataInfo

//         let yAxisValue = myChart.convertFromPixel({ yAxisId: 'y' }, this.position[1]);

//         // const check = () => {
//         //     if (dataIndex === 0) {
//         //         if (yAxisValue > 3 || yAxisValue < 0) {
//         //             return false
//         //         }
//         //     }
//         //     if (dataIndex === 4) {
//         //         if (yAxisValue < 50) {
//         //             return false
//         //         }
//         //     }
//         //     if (yAxisValue > 10 || yAxisValue < -60) {
//         //         return false
//         //     }
//         // }
//         // if (!check()) {
//         //     // 复原
//         //     resetMarkLine()
//         // }


//         newThicknessData[dataIndex] = yAxisValue

//         const updateMarkLine = (newData) => {

//             let newMarkLineData = markLineData
//             for (let i = 0; i < newData.length; i++) {
//                 newMarkLineData[i].yAxis = newData[i]
//             }
//             myChart.setOption({
//                 series: [{
//                     id: 'line',
//                     markLine: {
//                         data: newMarkLineData
//                     }
//                 }]
//             });
//         }
//         updateMarkLine(newThicknessData)


//     }

//     function resetMarkLine() {
//         let graphicOpt = getGraphic(newPointData, thicknessData)
//         myChart.setOption({
//             graphic: graphicOpt
//         })
//     }


//     const getGraphic = (pointData, thicknessData) => {
//         var showWidth = 2000;
//         showWidth = window.innerWidth || document.documentElement.clientWidth;
//         showWidth = showWidth
//         let graphic = [];
//         for (let i = 0; i < pointData.length; i++) {
//             let item = pointData[i];
//             let dataIndex = i;
//             graphic.push({
//                 type: 'circle',
//                 x: myChart.convertToPixel('grid', item)[0],
//                 y: myChart.convertToPixel('grid', item)[1],
//                 shape: { r: 15 / 2 },
//                 invisible: false,
//                 draggable: dataIndex > 0 && dataIndex < pointData.length - 1,
//                 ondrag: echarts.util.curry(onPointDragging, {
//                     dataIndex: dataIndex,
//                     pointData: pointData,
//                     lineData: lineData,
//                 }),
//                 ondragend: echarts.util.curry(onPointDragEnd, {
//                     dataIndex: dataIndex,
//                     pointData: pointData,
//                     lineData: lineData,
//                 }),
//                 z: 100
//             })
//         }

//         for (let i = 0; i < thicknessData.length; i++) {
//             console.log(thicknessData[i])
//             let value = thicknessData[i];
//             let dataIndex = i;
//             graphic.push(
//                 {
//                     type: 'rect',
//                     z: 100,
//                     shape: {
//                         width: showWidth,
//                         height: 0
//                     },
//                     invisible: true,
//                     position: [0, myChart.convertToPixel({ yAxisId: 'y' }, value)],
//                     draggable: true,
//                     style: {
//                         fill: 'rgba(0,0,0,1)',
//                         stroke: 'rgba(0,0,0,1)',
//                         lineWidth: 4
//                     },
//                     cursor: 'move',
//                     ondrag: echarts.util.curry(onLineDrag, {
//                         thicknessData: thicknessData,
//                         dataIndex: dataIndex,
//                     }),
//                 }
//             )
//         }

//         return graphic;
//     }

//     let graphicOpt = getGraphic(pointData, thicknessData)
//     myChart.setOption({
//         graphic: graphicOpt
//     })

//     myChart.on('dataZoom', function (params) {
//         // console.log(params)
//         // console.log(newPointData)
//         const updateGraphicOpt = (newData) => {
//             let graphic = myChart.getOption().graphic
//             let el = graphic[0].elements
//             for (let i = 0; i < 23; i++) {
//                 let pixelPos = myChart.convertToPixel('grid', newData[i])
//                 el[i].x = pixelPos[0]
//                 el[i].y = pixelPos[1]
//                 el[i].invisible = true
//             }
//             graphic[0].elements = el
//             myChart.setOption({
//                 graphic: graphic
//             })
//             setTimeout(() => {
//                 for (let i = 0; i < 23; i++) {
//                     el[i].invisible = false
//                 }
//                 myChart.setOption({
//                     graphic: graphic
//                 })
//             }, 500);
//         }
//         updateGraphicOpt(newPointData)
//     })

// }

// export const m = async (dom) => {
//     const origin = await getData()
//     const { lineData, pointData, thicknessData } = dataGenerate(origin)

//     drawChart(lineData, pointData, thicknessData, dom)
// }



// const test = () => {

//     var symbolSize = 20;
//     var data = [
//         [0, 3],
//         [20, 2],
//         [30, -13],
//         [45, -18],
//         [55, -23],
//         [65, -30],
//         [80, -33],
//         [90, -35],
//         [92, -37],
//         [100, -37]
//     ];
//     var thicknessData = [
//         1.93,
//         -4.07,
//         -11.57,
//         -26.57,
//         -36.57

//     ]
//     var markLineYAxis = -10;
//     var myChart = echarts.init(chartdom.value);
//     myChart.setOption({
//         tooltip: {
//             triggerOn: 'none',
//             formatter: function (params) {
//                 return (
//                     'X: ' +
//                     params.data[0].toFixed(2) +
//                     '<br />Y: ' +
//                     params.data[1].toFixed(2)
//                 );
//             }
//         },
//         xAxis: { type: 'value', },
//         yAxis: { type: 'value', id: 'y' },
//         series: [
//             {
//                 id: 'a',
//                 type: 'line',
//                 smooth: false,
//                 symbolSize: symbolSize,
//                 data: data,
//                 symbol: 'none',
//                 // 这里是标线的展示形式
//                 markLine: {
//                     animation: false,
//                     symbol: ['none', 'none'],
//                     label: {
//                         show: true,
//                         position: 'insideEndBottom',
//                         color: '#FF0000',
//                         formatter: (params) => { return "粘土层:" + params.value }
//                     },
//                     lineStyle: {
//                         color: '#FF0000',
//                         width: 4,
//                         type: 'solid'
//                     },
//                     data: [{ yAxis: markLineYAxis }]
//                 }
//             }
//         ]
//     });
//     var showWidth = 2000;
//     showWidth = window.innerWidth || document.documentElement.clientWidth;
//     showWidth = showWidth
//     const getGraphic = (pointData) => {
//         let graphic = [];
//         for (let i = 0; i < data.length; i++) {
//             let item = data[i];
//             let dataIndex = i;
//             graphic.push({
//                 type: 'circle',
//                 x: myChart.convertToPixel('grid', item)[0],
//                 y: myChart.convertToPixel('grid', item)[1],
//                 shape: { r: symbolSize / 2 },
//                 invisible: false,
//                 draggable: dataIndex > 0 && dataIndex < data.length - 1,
//                 ondrag: echarts.util.curry(onPointDragging, dataIndex),
//                 ondragend: echarts.util.curry(onPointDragEnd, dataIndex),
//                 z: 100
//             })
//         }
//         graphic.push(
//             {
//                 type: 'rect',
//                 z: 100,
//                 shape: {
//                     width: showWidth,
//                     height: 0
//                 },

//                 //构造坐标扔进去
//                 position: [0, myChart.convertToPixel({ yAxisId: 'y' }, markLineYAxis)],
//                 draggable: true,
//                 style: {
//                     fill: 'rgba(0,0,0,0)',
//                     stroke: 'rgba(0,0,0,0)',
//                     lineWidth: 10
//                 },
//                 cursor: 'move',
//                 ondrag: onPointDragging2
//             }
//         )
//         return graphic;

//         // return [{
//         //     type: 'rect',
//         //     z: 100,
//         //     shape: {
//         //         width: showWidth,
//         //         height: 0
//         //     },

//         //     //构造坐标扔进去
//         //     position: [0, myChart.convertToPixel({ yAxisId: 'y' }, markLineYAxis)],
//         //     draggable: true,
//         //     style: {
//         //         fill: 'rgba(0,0,0,0)',
//         //         stroke: 'rgba(0,0,0,0)',
//         //         lineWidth: 10
//         //     },
//         //     cursor: 'move',
//         //     ondrag: onPointDragging2
//         // }
//         // ]
//     }

//     const graphicOpt = getGraphic(data)
//     myChart.setOption({
//         graphic: graphicOpt

//     });

//     function onPointDragging(dataIndex, dx, dy) {
//         if (dataIndex === 0 || dataIndex === data.length - 1) return

//         let dragPos = myChart.convertFromPixel('grid', this.position)
//         let lastPoint = data[dataIndex - 1]
//         let nextPoint = data[dataIndex]

//         if (dragPos[0] < lastPoint[0]) {
//             let graphicOptionItem = myChart.getOption().graphic[0].elements[dataIndex]
//             let posIn2d = myChart.convertToPixel('grid', lastPoint)
//             graphicOptionItem.x = posIn2d[0] + 0.1
//             graphicOptionItem.y = posIn2d[1]
//             let ogOption = myChart.getOption();
//             ogOption.graphic[0].elements[dataIndex] = graphicOptionItem;
//             myChart.setOption(ogOption);
//         }
//         else if (dragPos[0] > nextPoint[0]) {
//             let graphicOptionItem = myChart.getOption().graphic[0].elements[dataIndex]
//             let posIn2d = myChart.convertToPixel('grid', nextPoint)
//             graphicOptionItem.x = posIn2d[0] - 0.1
//             graphicOptionItem.y = posIn2d[1]
//             let ogOption = myChart.getOption();
//             ogOption.graphic[0].elements[dataIndex] = graphicOptionItem;
//             myChart.setOption(ogOption);
//         }
//         else {
//             let y = getYFromLine(lastPoint[0], lastPoint[1], nextPoint[0], nextPoint[1], dragPos[0])
//             let graphicOptionItem = myChart.getOption().graphic[0].elements[dataIndex]
//             graphicOptionItem.x = myChart.convertToPixel('grid', [dragPos[0], y])[0]
//             graphicOptionItem.y = myChart.convertToPixel('grid', [dragPos[0], y])[1]
//             let ogOption = myChart.getOption();
//             ogOption.graphic[0].elements[dataIndex] = graphicOptionItem;
//             myChart.setOption(ogOption);
//         }
//     }
//     function isPointOnLine(px, py, lx1, ly1, lx2, ly2, threshold = 1e-10) {
//         // 计算线段的向量
//         const lineVectorX = lx2 - lx1;
//         const lineVectorY = ly2 - ly1;

//         // 计算点到线段起点的向量
//         const pointVectorX = px - lx1;
//         const pointVectorY = py - ly1;

//         // 计算向量的点积
//         const dotProduct = pointVectorX * lineVectorX + pointVectorY * lineVectorY;

//         // 计算线段向量的长度平方
//         const lineLengthSquared = lineVectorX * lineVectorX + lineVectorY * lineVectorY;

//         // 计算投影长度
//         const projectionLength = dotProduct / lineLengthSquared;

//         // 判断点是否在线段上
//         if (projectionLength >= 0 && projectionLength <= 1) {
//             // 计算点到线段的垂直距离
//             const distanceToLine = Math.abs(pointVectorX * lineVectorY - pointVectorY * lineVectorX) / Math.sqrt(lineLengthSquared);

//             // 判断距离是否小于阈值
//             return distanceToLine < threshold;
//         }

//         return false;
//     }
//     function getYFromLine(x1, y1, x2, y2, x) {
//         if (x1 === x2) {
//             if (x === x1) {
//                 return y1;
//             }
//             else {
//                 console.log('x1 === x2 && x !== x1');
//                 return null;
//             }
//         } else {
//             return y1 + (x - x1) * ((y2 - y1) / (x2 - x1));
//         }
//     }
//     function onPointDragEnd(dataIndex, dx, dy) {
//         let dragPos = myChart.convertFromPixel('grid', this.position)
//         console.log(dragPos)
//     }

//     function onPointDragging2() {
//         console.log(this.position)
//         let yAxis = myChart.convertFromPixel({ yAxisId: 'y' }, this.position[1]);
//         console.log(yAxis)
//         myChart.setOption({
//             series: [{
//                 id: 'a',
//                 markLine: {
//                     data: [
//                         { yAxis: yAxis },
//                     ],
//                 }
//             }]
//         });
//     }


// }


// export class sectionChart {

//     newDataInfo = {}
//     myChart = null


//     constructor(dom, dataInfo) {
//         this.dom = dom
//         this.dataInfo = dataInfo
//     }

//     initGraphic() {
//         let ogPointData = this.dataInfo.pointData
//         let ogThicknessData = this.dataInfo.thicknessData
//         let graphicOpt = this.getGraphicOption(ogPointData, ogThicknessData)
//         this.myChart.setOption({
//             graphic: graphicOpt
//         })

//     }

//     initBaseChart() {
//         this.myChart = echarts.init(this.dom)
//         let ogLineData = this.dataInfo.lineData
//         let ogPointData = this.dataInfo.pointData
//         let ogThicknessData = this.dataInfo.thicknessData
//         let baseOption = this.getBaseOption(ogLineData, ogPointData, ogThicknessData)
//         this.myChart.setOption(baseOption)
//     }


//     getGraphicOption(pointData, thicknessData) {
//         //data 
//         var showWidth = 2000;
//         showWidth = window.innerWidth || document.documentElement.clientWidth;
//         showWidth = showWidth
//         let graphic = [];
//         for (let i = 0; i < pointData.length; i++) {
//             let item = pointData[i];
//             let dataIndex = i;
//             graphic.push({
//                 type: 'circle',
//                 x: myChart.convertToPixel('grid', item)[0],
//                 y: myChart.convertToPixel('grid', item)[1],
//                 shape: { r: 15 / 2 },
//                 invisible: false,
//                 draggable: dataIndex > 0 && dataIndex < pointData.length - 1,
//                 ondrag: echarts.util.curry(onPointDragging, {
//                     dataIndex: dataIndex,
//                     pointData: pointData,
//                     lineData: lineData,
//                 }),
//                 ondragend: echarts.util.curry(onPointDragEnd, {
//                     dataIndex: dataIndex,
//                     pointData: pointData,
//                     lineData: lineData,
//                 }),
//                 z: 100
//             })
//         }

//         for (let i = 0; i < thicknessData.length; i++) {
//             console.log(thicknessData[i])
//             let value = thicknessData[i];
//             let dataIndex = i;
//             graphic.push(
//                 {
//                     type: 'rect',
//                     z: 100,
//                     shape: {
//                         width: showWidth,
//                         height: 0
//                     },
//                     invisible: true,
//                     position: [0, myChart.convertToPixel({ yAxisId: 'y' }, value)],
//                     draggable: true,
//                     style: {
//                         fill: 'rgba(0,0,0,1)',
//                         stroke: 'rgba(0,0,0,1)',
//                         lineWidth: 4
//                     },
//                     cursor: 'move',
//                     ondrag: echarts.util.curry(onLineDrag, {
//                         thicknessData: thicknessData,
//                         dataIndex: dataIndex,
//                     }),
//                 }
//             )
//             return graphic;
//         }

//     }


//     getBaseOption(lineData, pointData, thicknessData) {
//         // data 
//         let markLineData = this.getMarkLineData(thicknessData)

//         let baseOption = {
//             grid: {
//                 left: '2%',
//                 right: '4%',
//                 bottom: '10%',
//                 top: '10%',
//                 containLabel: true,
//             },
//             // tooltip: {
//             // },
//             toolbox: {
//                 right: 10,
//                 feature: {
//                     dataZoom: {
//                         yAxisIndex: 'none',
//                     },
//                     restore: {},
//                     saveAsImage: {},
//                 },
//             },
//             dataZoom: [
//                 {
//                     type: 'slider',
//                     height: 25,
//                     bottom: 5,
//                 },
//             ],
//             xAxis: {
//                 type: 'value', min: 0, max: 'dataMax',
//                 name: 'Station(m)',
//                 nameLocation: 'middle',
//                 nameGap: 25,
//                 nameTextStyle: {
//                     fontSize: 20,
//                     // align: 'left',
//                     // verticalAlign: 'top',
//                     fontWeight: 'bold',
//                 },
//             },
//             yAxis: {
//                 type: 'value', id: 'y',
//                 min: -39,
//                 max: 4,
//                 name: 'Elevation(m)',
//                 nameLocation: 'middle',
//                 nameGap: 30,
//                 nameTextStyle: {
//                     fontSize: 20,
//                     fontWeight: 'bold',
//                     // align: 'left',
//                     // verticalAlign: 'top',
//                 },
//             },
//             series: [
//                 {
//                     id: 'line',
//                     type: 'line',
//                     smooth: false,
//                     data: lineData,
//                     symbol: 'none',
//                     z: 1,
//                     lineStyle: {
//                         color: '#746800',
//                         opacity: 1,
//                         width: 5,
//                     },
//                     markLine: {
//                         animation: false,
//                         symbol: ['triangle', 'arrow'],
//                         data: markLineData
//                     }

//                 },
//                 {
//                     id: 'point',
//                     type: 'scatter',
//                     smooth: false,
//                     data: pointData,
//                     symbol: 'circle',
//                     symbolSize: 15,
//                     z: 2,
//                     itemStyle: {
//                         color: '#0051ff60',
//                         opacity: 1,
//                         borderColor: '#25f0ff7e',
//                         borderWidth: 2,

//                     },
//                 }
//             ]
//         }
//         return baseOption
//     }


//     getMarkLineData(thicknessData) {
//         let colorArray = ['#15ff00', '#3700ff', '#a200ff', '#FF8E00', '#009bb6']
//         let markLineData = []
//         thicknessData.forEach((value, index) => {
//             let item = {
//                 name: `Layer ${index + 1}`,
//                 yAxis: thicknessData[index],
//                 lineStyle: {
//                     color: colorArray[index],
//                     width: 3,
//                 },
//                 label: {
//                     show: true,
//                     position: 'insideEndBottom',
//                     fontSize: 15,
//                     formatter: (params) => { return `Layer ${index + 1}` + Math.round(params.value * 100) / 100 + ' M' }
//                 },
//             }
//             markLineData.push(item)
//         })
//     }


//     // tool 
//     findAdjacentIndices(points, x) {
//         let left = 0;
//         let right = points.length - 1;

//         // 使用二分查找找到插入点
//         while (left <= right) {
//             let mid = Math.floor((left + right) / 2);
//             if (points[mid][0] > x) {
//                 right = mid - 1;
//             } else if (points[mid][0] < x) {
//                 left = mid + 1;
//             } else {
//                 // 如果找到了确切的x值，返回这个点的索引
//                 return [mid, mid];
//             }
//         }

//         // 如果x不在数组中，left是x应该插入的位置
//         if (left > 0) {
//             // x在两个点之间
//             return [left - 1, left];
//         } else {
//             // x在第一个点之前
//             return [-1, 0];
//         }
//     }

//     getYFromLine(x1, y1, x2, y2, x) {
//         if (x1 === x2) {
//             if (x === x1) {
//                 return y1;
//             }
//             else {
//                 console.log('x1 === x2 && x !== x1');
//                 return null;
//             }
//         } else {
//             return y1 + (x - x1) * ((y2 - y1) / (x2 - x1));
//         }
//     }

//     onPointDragging(dataInfo) {

//         const { dataIndex, pointData, lineData } = dataInfo
//         let dragPos = myChart.convertFromPixel('grid', this.position)
//         let startPoint = pointData[0]
//         let endPoint = pointData[pointData.length - 1]

//         let adjacentIndex = findAdjacentIndices(lineData, dragPos[0])
//         let lastPoint = lineData[adjacentIndex[0]]
//         let nextPoint = lineData[adjacentIndex[1]]


//         if (dragPos[0] < startPoint[0]) {
//             let graphicOptionItem = myChart.getOption().graphic[0].elements[dataIndex]
//             let posIn2d = myChart.convertToPixel('grid', startPoint)
//             graphicOptionItem.x = posIn2d[0] + 0.1
//             graphicOptionItem.y = posIn2d[1]
//             let ogOption = myChart.getOption();
//             ogOption.graphic[0].elements[dataIndex] = graphicOptionItem;
//             myChart.setOption(ogOption);
//         }
//         else if (dragPos[0] > endPoint[0]) {
//             let graphicOptionItem = myChart.getOption().graphic[0].elements[dataIndex]
//             let posIn2d = myChart.convertToPixel('grid', endPoint)
//             graphicOptionItem.x = posIn2d[0] - 0.1
//             graphicOptionItem.y = posIn2d[1]
//             let ogOption = myChart.getOption();
//             ogOption.graphic[0].elements[dataIndex] = graphicOptionItem;
//             myChart.setOption(ogOption);
//         }
//         else {
//             let y = getYFromLine(lastPoint[0], lastPoint[1], nextPoint[0], nextPoint[1], dragPos[0])
//             let graphicOptionItem = myChart.getOption().graphic[0].elements[dataIndex]
//             graphicOptionItem.x = myChart.convertToPixel('grid', [dragPos[0], y])[0]
//             graphicOptionItem.y = myChart.convertToPixel('grid', [dragPos[0], y])[1]
//             let ogOption = myChart.getOption();
//             ogOption.graphic[0].elements[dataIndex] = graphicOptionItem;
//             myChart.setOption(ogOption);
//         }
//     }

//     onPointDragEnd(dataIndex, pointData) {
//         let el = myChart.getOption().graphic[0].elements
//         for (let i = 0; i < 23; i++) {
//             newPointData[i] = myChart.convertFromPixel('grid', [el[i].x, el[i].y])
//         }
//         newPointData = newPointData
//     }

//     onLineDrag(dataInfo) {
//         const { thicknessData, dataIndex } = dataInfo

//         let yAxisValue = myChart.convertFromPixel({ yAxisId: 'y' }, this.position[1]);

//         // const check = () => {
//         //     if (dataIndex === 0) {
//         //         if (yAxisValue > 3 || yAxisValue < 0) {
//         //             return false
//         //         }
//         //     }
//         //     if (dataIndex === 4) {
//         //         if (yAxisValue < 50) {
//         //             return false
//         //         }
//         //     }
//         //     if (yAxisValue > 10 || yAxisValue < -60) {
//         //         return false
//         //     }
//         // }
//         // if (!check()) {
//         //     // 复原
//         //     resetMarkLine()
//         // }


//         newThicknessData[dataIndex] = yAxisValue

//         const updateMarkLine = (newData) => {

//             let newMarkLineData = markLineData
//             for (let i = 0; i < newData.length; i++) {
//                 newMarkLineData[i].yAxis = newData[i]
//             }
//             myChart.setOption({
//                 series: [{
//                     id: 'line',
//                     markLine: {
//                         data: newMarkLineData
//                     }
//                 }]
//             });
//         }
//         updateMarkLine(newThicknessData)


//     }

//     resetMarkLine() {
//         let graphicOpt = getGraphic(newPointData, thicknessData)
//         myChart.setOption({
//             graphic: graphicOpt
//         })
//     }



// }
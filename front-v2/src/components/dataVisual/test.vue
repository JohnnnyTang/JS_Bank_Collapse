<template>
    <div class="main">
        <!-- <sectionDraw></sectionDraw> -->
        <div class="chartdom" ref="chartdom">

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import sectionDraw from '../modelStore/soilAnalysis/sectionDraw.vue';
import * as echarts from 'echarts';

const chartdom = ref(null)

onMounted(async () => {

    var symbolSize = 20;
    var data = [
        [0, 3],
        [20, 2],
        [30, -13],
        [45, -18],
        [55, -23],
        [65, -30],
        [80, -33],
        [90, -35],
        [92, -37],
        [100, -37]
    ];
    var thicknessData = [
        1.93,
        -4.07,
        -11.57,
        -26.57,
        -36.57

    ]
    var markLineYAxis = -10;
    var myChart = echarts.init(chartdom.value);
    myChart.setOption({
        tooltip: {
            triggerOn: 'none',
            formatter: function (params) {
                return (
                    'X: ' +
                    params.data[0].toFixed(2) +
                    '<br />Y: ' +
                    params.data[1].toFixed(2)
                );
            }
        },
        xAxis: { type: 'value', },
        yAxis: { type: 'value', id: 'y' },
        series: [
            {
                id: 'a',
                type: 'line',
                smooth: false,
                symbolSize: symbolSize,
                data: data,
                symbol: 'none',
                // 这里是标线的展示形式
                markLine: {
                    animation: false,
                    symbol: ['none', 'none'],
                    label: {
                        show: true,
                        position: 'insideEndBottom',
                        color: '#FF0000',
                        formatter: (params) => { return "粘土层:" + params.value }
                    },
                    lineStyle: {
                        color: '#FF0000',
                        width: 4,
                        type: 'solid'
                    },
                    data: [{ yAxis: markLineYAxis }]
                }
            }
        ]
    });
    var showWidth = 2000;
    showWidth = window.innerWidth || document.documentElement.clientWidth;
    showWidth = showWidth
    const getGraphic = (pointData) => {
        let graphic = [];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let dataIndex = i;
            graphic.push({
                type: 'circle',
                x: myChart.convertToPixel('grid', item)[0],
                y: myChart.convertToPixel('grid', item)[1],
                shape: { r: symbolSize / 2 },
                invisible: false,
                draggable: dataIndex > 0 && dataIndex < data.length - 1,
                ondrag: echarts.util.curry(onPointDragging, dataIndex),
                ondragend: echarts.util.curry(onPointDragEnd, dataIndex),
                z: 100
            })
        }
        graphic.push(
            {
                type: 'rect',
                z: 100,
                shape: {
                    width: showWidth,
                    height: 0
                },

                //构造坐标扔进去
                position: [0, myChart.convertToPixel({ yAxisId: 'y' }, markLineYAxis)],
                draggable: true,
                style: {
                    fill: 'rgba(0,0,0,0)',
                    stroke: 'rgba(0,0,0,0)',
                    lineWidth: 10
                },
                cursor: 'move',
                ondrag: onPointDragging2
            }
        )
        return graphic;

        // return [{
        //     type: 'rect',
        //     z: 100,
        //     shape: {
        //         width: showWidth,
        //         height: 0
        //     },

        //     //构造坐标扔进去
        //     position: [0, myChart.convertToPixel({ yAxisId: 'y' }, markLineYAxis)],
        //     draggable: true,
        //     style: {
        //         fill: 'rgba(0,0,0,0)',
        //         stroke: 'rgba(0,0,0,0)',
        //         lineWidth: 10
        //     },
        //     cursor: 'move',
        //     ondrag: onPointDragging2
        // }
        // ]
    }

    const graphicOpt = getGraphic(data)
    myChart.setOption({
        graphic: graphicOpt

    });

    function onPointDragging(dataIndex, dx, dy) {
        if (dataIndex === 0 || dataIndex === data.length - 1) return

        let dragPos = myChart.convertFromPixel('grid', this.position)
        let lastPoint = data[dataIndex - 1]
        let nextPoint = data[dataIndex]

        if (dragPos[0] < lastPoint[0]) {
            let graphicOptionItem = myChart.getOption().graphic[0].elements[dataIndex]
            let posIn2d = myChart.convertToPixel('grid', lastPoint)
            graphicOptionItem.x = posIn2d[0] + 0.1
            graphicOptionItem.y = posIn2d[1]
            let ogOption = myChart.getOption();
            ogOption.graphic[0].elements[dataIndex] = graphicOptionItem;
            myChart.setOption(ogOption);
        }
        else if (dragPos[0] > nextPoint[0]) {
            let graphicOptionItem = myChart.getOption().graphic[0].elements[dataIndex]
            let posIn2d = myChart.convertToPixel('grid', nextPoint)
            graphicOptionItem.x = posIn2d[0] - 0.1
            graphicOptionItem.y = posIn2d[1]
            let ogOption = myChart.getOption();
            ogOption.graphic[0].elements[dataIndex] = graphicOptionItem;
            myChart.setOption(ogOption);
        }
        else {
            let y = getYFromLine(lastPoint[0], lastPoint[1], nextPoint[0], nextPoint[1], dragPos[0])
            let graphicOptionItem = myChart.getOption().graphic[0].elements[dataIndex]
            graphicOptionItem.x = myChart.convertToPixel('grid', [dragPos[0], y])[0]
            graphicOptionItem.y = myChart.convertToPixel('grid', [dragPos[0], y])[1]
            let ogOption = myChart.getOption();
            ogOption.graphic[0].elements[dataIndex] = graphicOptionItem;
            myChart.setOption(ogOption);
        }
    }
    function isPointOnLine(px, py, lx1, ly1, lx2, ly2, threshold = 1e-10) {
        // 计算线段的向量
        const lineVectorX = lx2 - lx1;
        const lineVectorY = ly2 - ly1;

        // 计算点到线段起点的向量
        const pointVectorX = px - lx1;
        const pointVectorY = py - ly1;

        // 计算向量的点积
        const dotProduct = pointVectorX * lineVectorX + pointVectorY * lineVectorY;

        // 计算线段向量的长度平方
        const lineLengthSquared = lineVectorX * lineVectorX + lineVectorY * lineVectorY;

        // 计算投影长度
        const projectionLength = dotProduct / lineLengthSquared;

        // 判断点是否在线段上
        if (projectionLength >= 0 && projectionLength <= 1) {
            // 计算点到线段的垂直距离
            const distanceToLine = Math.abs(pointVectorX * lineVectorY - pointVectorY * lineVectorX) / Math.sqrt(lineLengthSquared);

            // 判断距离是否小于阈值
            return distanceToLine < threshold;
        }

        return false;
    }
    function getYFromLine(x1, y1, x2, y2, x) {
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
    function onPointDragEnd(dataIndex, dx, dy) {
        let dragPos = myChart.convertFromPixel('grid', this.position)
        console.log(dragPos)
    }

    function onPointDragging2() {
        //阈值变动
        //取动态值，设置进去
        console.log(this.position)
        let yAxis = myChart.convertFromPixel({ yAxisId: 'y' }, this.position[1]);
        console.log(yAxis)
        myChart.setOption({
            series: [{
                id: 'a',
                markLine: {
                    data: [
                        { yAxis: yAxis },
                    ],
                }
            }]
        });
    }



})
</script>

<style lang="scss" scoped>
.main {
    position: absolute;
    width: 100vw;
    height: 92vh;
    display: flex;
    align-items: center;
    justify-content: center;

    .chartdom {
        position: relative;
        width: 30vw;
        height: 45vh;
        background-color: rgb(241, 249, 255);
    }

}
</style>
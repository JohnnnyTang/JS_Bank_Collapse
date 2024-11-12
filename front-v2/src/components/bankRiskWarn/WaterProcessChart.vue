<template>
    <div class="water-chart-container">
        <div class="water-chart-title">计算潮位过程</div>
        <div
            class="graph-container"
            id="water-chart-container"
            v-loading="props.waterProcessChartLoad"
            v-show="hasData === true"
        >
            <div id="water-chart" class="graph" ref="chartDom"></div>
        </div>
        <div class="blank-graph" v-show="hasData === false">
            <span v-if="true" style="z-index: 10"
                >请在计算模型后绘制潮位点以提取潮位线</span
            >
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps(['waterProcessChartLoad', 'timeStep'])

const chartDom = ref()

const hasData = ref(false)

const hour = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25,
]

const updateData = (data) => {
    hasData.value = true
    let us = data.result[0].us
    let vs = data.result[0].vs
    waterProcessData.flood = []

    us.forEach((u, i) => {
        let v = vs[i]
        let w = Math.sqrt(u * u + v * v)
        waterProcessData.flood.push([i, w])
    })
    console.log(waterProcessData.flood)
    option.series[0].data = waterProcessData['flood']
    chart.setOption(option)
}

const waterProcessData = {
    flood: [
        [0, 1.90906518],
        [1, 1.625544928],
        [2, 1.361989229],
        [3, 1.15482551],
        [4, 1.002231171],
        [5, 1.430845246],
        [6, 2.648756158],
        [7, 3.300643076],
        [8, 3.213302443],
        [9, 2.918754921],
        [10, 2.497299605],
        [11, 2.090891478],
        [12, 1.860660024],
        [13, 1.618100393],
        [14, 1.366590593],
        [15, 1.15848487],
        [16, 1.010662534],
        [17, 1.412416559],
        [18, 2.708489015],
        [19, 3.495843863],
        [20, 3.470899626],
        [21, 3.164357677],
        [22, 2.729099025],
        [23, 2.275285539],
        [24, 2.016365196],
        [25, 1.75218237],
    ],
}

const option = {
    tooltip: {
        trigger: 'axis',
    },
    xAxis: {
        type: 'value',
        // data: hour,
        boundaryGap: false,
        min: 0,
        max: 25,
        axisLabel: {
            fontSize: 14,
            formatter: '{value}小时',
        },
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        name: '米',
        nameTextStyle: {
            fontSize: 15,
            fontWeight: 'bold',
        },
        splitLine: {
            lineStyle: {
                color: 'rgb(12, 22, 86)',
                opacity: 0.4,
            },
        },
        axisLabel: {
            fontSize: 14,
        },
    },
    // dataZoom: [
    //     {
    //         type: 'inside',
    //     },
    //     {},
    // ],
    grid: {
        left: '2%',
        right: '4%',
        bottom: '5%',
        top: '18%',
        containLabel: true,
    },
    series: [
        {
            name: '洪季潮位过程',
            markLine: {
                symbolSize: 5,
                itemStyle: {
                    normal: {
                        color: 'rgb(94, 208, 251)',
                        borderColor: 'black',
                        borderWidth: 0.5,
                    },
                },
                lineStyle: {
                    color: 'red',
                    opacity: 0.8,
                    width: 3,
                },
                data: [
                    {
                        name: 'timeStep',
                        xAxis: parseFloat(props.timeStep),
                        label: {
                            formatter: `${parseFloat(props.timeStep)}小时`,
                            backgroundColor: 'rgb(208, 236, 255)',
                            color: 'red',
                            fontSize: '15px',
                            position: 'end',
                            offset: [0, 10],
                        },
                    },
                ],
            },
            type: 'line',
            smooth: true,
            data: waterProcessData['flood'],
            lineStyle: {
                color: 'rgb(12, 22, 226)',
                opacity: 1,
                width: 4,
            },
        },
    ],
}

let chart
let maxVal
let minVal

onMounted(() => {
    chart = echarts.init(chartDom.value)
    maxVal = Math.max(...waterProcessData['flood'])
    minVal = Math.min(...waterProcessData['flood'])
    chart.setOption(option)
})

watch(
    // 监视timeStep变量移动
    () => props.timeStep,
    (newVal) => {
        option.series[0].markLine.data[0].xAxis = parseFloat(newVal)
        option.series[0].markLine.data[0].label.formatter = `${parseFloat(newVal)}小时`
        chart.setOption(option)
    },
)

defineExpose({
    updateData,
})
</script>

<style lang="scss" scoped>
div.water-chart-container {
    position: absolute;
    top: 66vh;
    left: 0.3vw;
    width: 26vw;
    height: 25vh;
    z-index: 10;

    background-color: aliceblue;
    border-radius: 4px;
    box-shadow: 12px 12px 20px -10px rgba(0, 0, 0, 0.8);
    overflow: hidden;

    div.water-chart-title {
        // position: absolute;
        position: relative;
        padding-left: 1vw;
        height: 4.2vh;
        width: 25vw;
        line-height: 4.5vh;
        border-radius: 6px;
        // background-color: rgba(235, 240, 247, 0.4);
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        font-size: calc(0.6vw + 0.6vh);
        box-shadow: 0px 3px rgb(49, 121, 255);
        color: rgb(0, 138, 218);
        background-color: rgb(240, 248, 255);
        display: flex;
        align-items: center;
    }

    div.graph-container {
        height: calc(100% - 4.5vh);
        margin-top: 0.5vh;
        width: 100%;
        background-color: rgb(208, 236, 255);
        padding: 0.5vh 0.5vw;

        div.graph {
            position: relative;
            width: 100%;
            height: 100%;
        }

        #water-chart {
            width: 25vw;
            height: 20.5vh;
            
        }
    }

    div.blank-graph {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #055279;
        display: flex;
        width: 100%;
        height: calc(100% - 4.2vh);
        background: rgb(208, 236, 255);
    }
}
</style>

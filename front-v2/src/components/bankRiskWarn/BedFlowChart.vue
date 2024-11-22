<template>
    <div class="bed-chart-container">
        <div class="bed-chart-title">年径流过程</div>
        <div class="bed-chart-content" ref="chartDom"></div>
        <div class="blank-graph" v-show="hasData === false">
            <span v-if="true" style="z-index: 10">暂无数据</span>
        </div>
        <!-- <div class="bed-desc-text">2023年无超过造床流量(45000)时期</div> -->
        <!-- <div class="bed-desc-equa"></div> -->
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { bedFlowTime, bedFlowValue, bedResData } from './staticData'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useBankNameStore } from '../../store/bankNameStore'

const chartDom = ref()
const hasData = ref(false)
const route = useRoute()

document.addEventListener('keydown', function (event) {
    if (event.key === '1') {
        console.log(hasData.value)
    }
})

const option = {
    tooltip: {
        trigger: 'axis',
    },
    xAxis: {
        // data: bedFlowTime,
        type: 'time',
        boundaryGap: false,
        axisLabel: {
            fontSize: 12,
            formatter: function (value, index) {
                // 坐标轴文字展示样式处理
                const date = new Date(value)
                const year = date.getFullYear().toString()
                const texts = [
                    year.substring(2, year.length),
                    date.getMonth() + 1,
                    date.getDate(),
                ]
                return texts.join('/')
                // echarts自带的日期格式化方法
                // return echarts.format.formatTime('yyyy-MM-dd', value)
            },
        },
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 90000,
        boundaryGap: [0, '100%'],
        name: 'm3/s',
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
    dataZoom: [
        {
            type: 'inside',
            startValue: '2023/01/01 00:00:00',
            endValue: '2023/12/31 23:00:00',
        },
        {
            startValue: '2023/01/01 00:00:00',
            endValue: '2023/12/31 23:00:00',
        },
    ],
    grid: {
        left: '2%',
        right: '4%',
        bottom: '18%',
        top: '20%',
        containLabel: true,
    },
    series: [
        {
            name: '大通流量',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: bedResData,
        },
        {
            name: 'SplitLine',
            type: 'line',
            silent: true,
            markLine: {
                lineStyle: {
                    // color: '#333',
                    width: 2,
                    opacity: 0.75,
                },
                data: [
                    {
                        yAxis: 45000,
                        lineStyle: {
                            color: '#FF0000',
                            width: 3,
                        },
                    },
                ],
                label: {
                    position: 'middle',
                    color: '#FF0000',
                    fontSize: 14,
                },
            },
        },
    ],
}

let chart

// 切换岸段时会重载组件
onMounted(() => {
    chart = echarts.init(chartDom.value)
    let bk = useBankNameStore().globalBankName

    if (bk === 'Mzs') {
        hasData.value = true
        setTimeout(() => {
            chart.setOption(option)
        }, 0)
    } else {
        hasData.value = false
    }
})

// onBeforeRouteUpdate((to, from) => {
//     let bk = to.params.id // 切换前岸段
//     console.log('bk', bk)
//     if (bk === 'Mzs') {
//         chart.setOption(option)
//         hasData.value = true
//     } else {
//         hasData.value = false
//     }
// })
</script>

<style lang="scss" scoped>
div.bed-chart-container {
    position: absolute;
    width: 100%;
    height: 100%;

    background-color: aliceblue;
    border-radius: 4px;
    box-shadow: 12px 12px 20px -10px rgba(0, 0, 0, 0.8);
    overflow: hidden;

    div.bed-chart-title {
        height: 4vh;
        line-height: 4vh;
        padding-left: 1vw;
        font-size: calc(0.6vw + 0.6vh);
        font-weight: bold;

        box-shadow: 0px 3px rgb(49, 121, 255);
        color: rgb(0, 138, 218);
    }

    div.bed-chart-content {
        height: calc(100% - 4.5vh);
        margin-top: 0.5vh;
        width: 100%;

        background-color: rgb(208, 236, 255);
    }

    div.blank-graph {
        position: absolute;
        top: 4.2vh;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #055279;
        display: flex;
        width: 100%;
        height: calc(100% - 4.2vh);
        background: rgb(208, 236, 255);
    }

    div.bed-desc-text {
        position: absolute;
        height: 2vh;
        line-height: 2vh;
        top: 4.5vh;
        right: 0.2vw;
        padding: 0.2vh 0.2vw;

        background-color: rgb(42, 117, 255);
        color: aliceblue;
    }

    div.bed-desc-equa {
        position: absolute;
        top: 4.8vh;
        left: 20%;
        width: 20%;
        height: 10%;

        // background-color: aqua;
        background-image: url('/math.png');
        background-size: contain;
        background-repeat: no-repeat;
    }
}
</style>

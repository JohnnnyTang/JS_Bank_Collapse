<template>
    <div class="bed-chart-container">
        <div class="bed-chart-title">造床流量当量指标</div>
        <div class="bed-chart-content" ref="chartDom"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { bedFlowTime, bedFlowValue } from './staticData'

const chartDom = ref()

const option = {
    tooltip: {
        trigger: 'axis',
    },
    xAxis: {
        data: bedFlowTime,
        boundaryGap: false,
        axisLabel: {
            fontSize: 14,
        },
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 50000,
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
        },
        {},
    ],
    grid: {
        left: '2%',
        right: '4%',
        bottom: '14%',
        top: '14%',
        containLabel: true,
    },
    series: [
        {
            name: '大通流量',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: bedFlowValue,
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
                    fontSize: 14
                }
            },
        },
    ],
}

onMounted(() => {
    let chart = echarts.init(chartDom.value)
    chart.setOption(option)
})
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
}
</style>

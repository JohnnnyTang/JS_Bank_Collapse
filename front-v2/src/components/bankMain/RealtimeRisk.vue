<template>
    <div class="realtime-risk-container">
        <div class="realtime-risk-title">
            <div class="realtime-risk-icon"></div>
            <div class="risk-title-text">实时预警监测</div>
        </div>
        <div
            class="risk-content-container"
            :class="{ 'pie-show': pieChartShow }"
        >
            <div class="risk-type-container">
                <div class="risk-type-item" v-for="i in 4" :key="i">
                    <div class="risk-type-icon" :id="'icon-' + i"></div>
                    <div class="risk-type-text" :id="'text-' + i">
                        {{ riskTypeList[i - 1] }}
                    </div>
                </div>
            </div>
            <div class="risk-chart-container">
                <div class="risk-chart" ref="chartDom"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

const riskTypeList = ref(['正常', '关注', '警告', '危险'])
const chartDom = ref(null)
const pieChartShow = ref(false)

const dataset = {
    dimensions: ['name', 'score'],
    source: [
        ['危险', 3],
        ['警告', 2],
        ['关注', 5],
        ['正常', 16],
    ],
}
const pieOption = {
    dataset: [dataset],
    color: ['#da1a1a', '#F07A2C', 'rgb(20, 92, 248)', '#6be071'],
    legend: {
        bottom: '0%',
        left: 'center',
        height: '5%',
        textStyle: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
    },
    series: [
        {
            type: 'pie',
            // associate the series to be animated by id
            id: 'Score',
            center: ['50%', '45%'],
            radius: ['20%', '90%'],
            label: {
                show: true,
                formatter: '{@name}\n{d}%',
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff',
                position: 'inside',
                bleedMargin: 0,
                distanceToLabelLine: 0,
            },
            labelLayout: {
                hideOverlap: false,
            },
            itemStyle: {
                borderRadius: 10,
                borderColor: 'transparent',
                borderWidth: 2,
            },
            percentPrecision: 1,
            universalTransition: true,
            animationDurationUpdate: 1500,
        },
    ],
}
const barOption = {
    dataset: [dataset],
    color: ['#da1a1a', '#F07A2C', 'rgb(20, 92, 248)', '#6be071'],
    grid: {
        left: '0%',
        right: '30%',
        bottom: '1%',
        top: '2.4%',
        containLabel: true,
    },
    xAxis: {
        type: 'value',
        axisLabel: {
            show: false,
        },
        splitLine: {
            show: false,
        },
    },
    yAxis: {
        type: 'category',
        axisLabel: {
            show: false,
        },
        axisLine: {
            show: false,
        },
    },
    series: [
        {
            type: 'bar',
            // associate the series to be animated by id
            id: 'Score',
            // Each data will have a different color
            colorBy: 'data',
            encode: { y: 'name', x: 'score' },
            itemStyle: {
                borderRadius: 8,
            },
            label: {
                show: true,
                formatter: '{@score}个',
                fontSize: 16,
                fontFamily: 'Impact',
                // fontWeight: 'bold',
                color: '#fff',
                position: 'insideRight'
            },
            universalTransition: true,
            animationDurationUpdate: 1500,
        },
    ],
}

let option = barOption

onMounted(() => {
    const riskChart = echarts.init(chartDom.value)
    riskChart.setOption(option)

    setInterval(() => {
        pieChartShow.value = !pieChartShow.value
        option = pieChartShow.value ? pieOption : barOption
        // Use the notMerge form to remove the axes
        riskChart.setOption(option, true)
    }, 4000)
})
</script>

<style lang="scss" scoped>
$shadowGreen: #6be071;
$shadowBlue: #6ba7e0;
$shadowOrange: #e0a96b;
$shadowRed: #e06b6b;
// $shadowBlue: rgb(20, 92, 248);

div.realtime-risk-container {
    position: absolute;
    top: 12.6vh;
    right: 1vw;
    width: 20vw;
    height: 36vh;

    background-color: rgba(54, 100, 226, 0.4);
    backdrop-filter: blur(5px);

    border-radius: 0.6rem;
    overflow: hidden;
    border: solid 3px #d3fff9;

    div.realtime-risk-title {
        width: 20vw;
        height: 6vh;

        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 0.4vw;

        // border-style: solid;
        border-bottom: inset 2px #daf1ff;

        background-color: rgba(215, 228, 255, 0.6);

        div.realtime-risk-icon {
            height: 4vh;
            width: 4vh;
            background-image: url('/measurement.png');
            background-size: contain;
        }

        div.risk-title-text {
            width: fit-content;
            height: 6vh;
            line-height: 6vh;
            text-align: center;
            font-size: calc(1vw + 0.3vh);
            font-weight: 600;
            color: #173eaa;
            text-shadow:
                #e3f4ff 1px 1px,
                #e3f4ff 2px 2px,
                #e3f4ff 3px 3px;
        }
    }

    div.risk-content-container {
        height: 30vh;
        width: 20vw;

        display: flex;
        justify-content: flex-start;
        align-items: center;

        transition: all 1s cubic-bezier(0.68, -0.25, 0.265, 1.15);

        &.pie-show {
            transform: translateX(-5vw);
        }

        div.risk-type-container {
            height: 28.4vh;
            width: 5vw;

            // background-color: #173eaa;

            div.risk-type-item {
                height: 7.1vh;
                width: 5vw;

                display: flex;
                align-items: center;
                justify-content: center;

                div.risk-type-icon {
                    width: 3vh;
                    height: 3vh;

                    // background-color: #d3fff9;
                    background-size: contain;
                    background-repeat: no-repeat;

                    &[id='icon-1'] {
                        background-image: url('/accept.png');
                    }
                    &[id='icon-2'] {
                        background-image: url('/announcement.png');
                    }
                    &[id='icon-3'] {
                        background-image: url('/warning.png');
                    }
                    &[id='icon-4'] {
                        background-image: url('/alert.png');
                    }
                }

                div.risk-type-text {
                    width: calc(5vw - 3.4vh);
                    height: 4vh;
                    line-height: 4vh;
                    text-align: center;
                    font-size: calc(0.9vw + 0.3vh);
                    font-weight: 600;
                    color: #e3f4ff;

                    // background-color: #d3fff9;
                    &[id='text-1'] {
                        text-shadow:
                            $shadowGreen 1px 1px,
                            $shadowGreen 2px 2px;
                    }
                    &[id='text-2'] {
                        text-shadow:
                            $shadowBlue 1px 1px,
                            $shadowBlue 2px 2px;
                    }
                    &[id='text-3'] {
                        text-shadow:
                            $shadowOrange 1px 1px,
                            $shadowOrange 2px 2px;
                    }
                    &[id='text-4'] {
                        text-shadow:
                            $shadowRed 1px 1px,
                            $shadowRed 2px 2px;
                    }
                }
            }
        }

        div.risk-chart-container {
            width: 15vw;
            height: 28.4vh;

            // background-color: #d3fff9;
            // overflow: visible;

            div.risk-chart {
                width: 20vw;
                height: 100%;
                // background-color: #d3ffd9;
            }
        }
    }
}
</style>

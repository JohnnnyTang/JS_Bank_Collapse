<template>
    <div class="realtime-risk-container">
        <dv-border-box9
            backgroundColor="rgba(156, 195, 255, 0.4)"
            :color="['rgb(28, 75, 247)', 'rgb(150, 255, 255)']"
        >
            <div class="realtime-risk-title">
                <div class="risk-title-text">实时风险监测</div>
            </div>
            <div class="splitter-container">
                <dv-decoration6
                    :color="['rgb(28, 75, 247)', 'rgb(22,101,255)']"
                />
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
        </dv-border-box9>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
import { BorderBox9 as DvBorderBox9 } from '@kjgl77/datav-vue3'

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
    // color: ['#F26052', '#EBE8A1', '#6FBEEE', '#6be071'],
    // '#13a500', '#003a92', '#be7200', '#a50101'
    // color: ['#0056af', '#257ac5', '#5eb0e8', '#84d5ff'],
    // color: ['#a50101', '#be7200', '#003a92', '#13a500'],
    visualMap: {
        type: 'continuous',
        min: 0,
        max: 8,
        inRange: {
            color: ['rgb(188,208,254)', 'rgb(10,20,208)'],
        },
        show: false
    },
    legend: {
        bottom: '0%',
        left: 'center',
        height: '5%',
        textStyle: {
            color: 'rgb(11, 70, 146)',
            fontSize: 16,
            fontWeight: 'bold',
        },
    },
    series: [
        {
            type: 'pie',
            // associate the series to be animated by id
            id: 'Score',
            center: ['52%', '45%'],
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
                borderRadius: 6,
                borderColor: '#fff',
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
    // color: ['#F26052', '#EBE8A1', '#6FBEEE', '#97ED8A'],
    // color: ['#a50101', '#be7200', '#003a92', '#13a500'],
    grid: {
        left: '0%',
        right: '35%',
        bottom: '1%',
        top: '2.4%',
        containLabel: true,
    },
    visualMap: {
        type: 'continuous',
        min: 0,
        max: 8,
        inRange: {
            color: ['rgb(188,208,254)', 'rgb(10,20,208)'],
        },
        show: false
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
                borderRadius: 6,
            },
            label: {
                show: true,
                formatter: '{@score}个',
                fontSize: 24,
                fontFamily: 'Impact',
                // fontWeight: 'bold',
                color: '#fff',
                position: 'insideRight',
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
    right: 1vw;
    top: 10vh;
    z-index: 3;
    height: 40vh;
    width: 20vw;
    box-shadow: 6px 8px 10px -4px rgb(11, 70, 146);

    // background-color: rgba(54, 100, 226, 0.4);
    // backdrop-filter: blur(5px);

    border-radius: 0.6rem;
    overflow: hidden;
    // border: solid 3px #d3fff9;

    div.realtime-risk-title {
        width: 20vw;
        height: 4vh;

        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 0.4vw;
        letter-spacing: 0.3rem;

        // border-style: solid;
        // border-bottom: inset 2px #daf1ff;

        // background-color: rgba(215, 228, 255, 0.6);

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
            font-size: calc(0.8vw + 0.8vh);
            font-weight: 600;
            color: #0400fd;
            text-shadow:
                #eef3ff 1px 1px,
                #eef3ff 2px 2px,
                #6493ff 3px 3px;
        }
    }

    div.splitter-container {
        margin-left: 2.5%;
        width: 96%;
        height: 2vh;

        // background-color: #0400fd;
    }

    div.risk-content-container {
        height: 34vh;
        width: 20vw;

        display: flex;
        justify-content: flex-start;
        align-items: center;

        transition: all 1s cubic-bezier(0.68, -0.25, 0.265, 1.15);

        &.pie-show {
            transform: translateX(-6.5vw);
        }

        div.risk-type-container {
            height: 32.4vh;
            width: 6vw;

            // background-color: #173eaa;

            div.risk-type-item {
                height: 6.1vh;
                width: 5vw;
                margin-top: 1.75vh;
                // margin-bottom: 1vh;
                margin-left: 0.7vw;

                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #003391;
                box-shadow:
                    rgba(0, 132, 255, 0.8) 1px 1px,
                    rgba(0, 119, 255, 0.7) 3px 3px,
                    rgba(0, 119, 255, 0.6) 4px 4px;
                    // rgba(240, 46, 170, 0.05) 25px 25px;
                border-radius: 8px;

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
                    height: 6vh;
                    line-height: 6vh;
                    text-align: center;
                    font-size: calc(0.8vw + 0.7vh);
                    // font-weight: 600;
                    color: #c3f3fc;
                    letter-spacing: 0.2rem;

                    // background-color: #d3fff9;
                    &[id='text-1'] {
                        color: #d1ffd4;
                        text-shadow:
                            $shadowGreen 1px 1px,
                            $shadowGreen 2px 2px;
                    }
                    &[id='text-2'] {
                        color: #dfedff;
                        text-shadow:
                            $shadowBlue 1px 1px,
                            $shadowBlue 2px 2px;
                    }
                    &[id='text-3'] {
                        color: #fff3e6;
                        text-shadow:
                            $shadowOrange 1px 1px,
                            $shadowOrange 2px 2px;
                    }
                    &[id='text-4'] {
                        color: #ffeeee;
                        text-shadow:
                            $shadowRed 1px 1px,
                            $shadowRed 2px 2px;
                    }
                }
            }
        }

        div.risk-chart-container {
            width: 13vw;
            height: 32.4vh;

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

:deep(.dv-border-box-9) {
    backdrop-filter: blur(12px);
    // box-shadow: 4px 8px 8px -4px rgb(0, 47, 117);
    // background-color: rgba(156, 195, 255, 0.4);
    // border-radius: 8px;
    // border: 2px solid rgb(28, 105, 247);
}
</style>

<template>
    <div class="stable-status-conatainer">
        <div class="stable-status-title">
            <div class="stable-status-icon"></div>
            <div class="status-title-text">
                {{ '预警状态评估-' + stableStatusTitle }}
            </div>
        </div>
        <div
            class="stable-status-item"
            v-for="i in 4"
            :key="i"
            :id="'status-item-' + i"
        >
            <div
                class="status-small-item"
                v-for="m in 4"
                :key="m"
                :class="{
                    'detail-status-show': statusDetailShow && !lineStatusShow,
                    'detail-status-state': m == 4 && smallCurrentStatus,
                    'current-status-item': m == 4,
                }"
                :statusId="'status-' + m"
                :style="genStatusLinearBg(i, m)"
            >
                <div
                    class="wave-container"
                    :style="{
                        height: stableStatus[i - 1][m - 1] * 1.2 + 28 + '%',
                    }"
                    v-if="m == 4 && !smallCurrentStatus"
                >
                    <svg
                        class="waves"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 24 150 28"
                        preserveAspectRatio="xMinYMax slice"
                        shape-rendering="auto"
                    >
                        <defs>
                            <path
                                id="gentle-wave"
                                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v84h-352z"
                            />
                            <!-- <path
                                    id="gentle-wave"
                                    d="M-160 44c50 0 48-38 78-38s 38 38 88 38 48-38 78-38 38 38 78 38 v44h-322z"
                                /> -->
                        </defs>
                        <g class="parallax">
                            <use
                                xlink:href="#gentle-wave"
                                x="48"
                                y="0"
                                :fill="fade(statusColorMap[i - 1], 50)"
                            />
                            <use
                                xlink:href="#gentle-wave"
                                x="48"
                                y="3"
                                :fill="fade(statusColorMap[i - 1], 70)"
                            />
                            <use
                                xlink:href="#gentle-wave"
                                x="48"
                                y="5"
                                :fill="fade(statusColorMap[i - 1], 90)"
                            />
                            <!-- <use
                                    xlink:href="#gentle-wave"
                                    x="48"
                                    y="5"
                                    fill="rgba(255,205,255,0.2)"
                                /> -->
                        </g>
                    </svg>
                </div>
                <div
                    class="stable-status-text"
                    :class="{ 'no-name': beforeSmallCurrentStatus }"
                >
                    <div class="stable-status-name">
                        {{ statusTextMap[i - 1] }}
                    </div>
                    <div class="stable-status-value">
                        {{ stableStatus[i - 1][m - 1] + '%' }}
                    </div>
                </div>
            </div>
            <div
                class="horizontal-arrow-container up"
                :class="{ show: statusDetailShow }"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="horizontal-arrow-svg right"
                >
                    <path
                        d="M21 8H11V5a1 1 0 0 0-1.707-.707l-7 7a1 1 0 0 0 0 1.414l7 7A1 1 0 0 0 11 19v-3h10a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"
                        style="fill: #fff"
                        preserveAspectRatio="none"
                        shape-rendering="auto"
                    />
                </svg>
            </div>
            <div
                class="horizontal-arrow-container down"
                :class="{ show: statusDetailShow }"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="horizontal-arrow-svg left"
                >
                    <path
                        d="M21 8H11V5a1 1 0 0 0-1.707-.707l-7 7a1 1 0 0 0 0 1.414l7 7A1 1 0 0 0 11 19v-3h10a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"
                        style="fill: #fff"
                        preserveAspectRatio="none"
                        shape-rendering="auto"
                    />
                </svg>
            </div>
            <div
                class="horizontal-arrow-container mid"
                :class="{ show: statusDetailShow }"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="horizontal-arrow-svg down"
                >
                    <path
                        d="M21 8H11V5a1 1 0 0 0-1.707-.707l-7 7a1 1 0 0 0 0 1.414l7 7A1 1 0 0 0 11 19v-3h10a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"
                        style="fill: #fff"
                        preserveAspectRatio="none"
                        shape-rendering="auto"
                    />
                </svg>
            </div>
        </div>
        <div class="status-line-container" :class="{ show: lineStatusShow }">
            <div
                class="stable-status-item"
                v-for="i in 4"
                :key="i"
                ref="statusLineDom"
            ></div>
            <div
                class="stable-status-item text-item"
                v-for="i in 4"
                :key="i"
                :style="{ color: fade(statusColorMap[i - 1], 50) }"
            >
                {{ statusTextMap[i - 1] }}
            </div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { fade } from '../../utils/colorUtils'
import { onMounted, ref, onUnmounted } from 'vue'
import { getHoursBackIn } from '../../utils/timeUtils'

const stableStatus = ref([
    [42, 38, 34, 29],
    [30, 26, 39, 42],
    [24, 24, 19, 21],
    [4, 12, 9, 8],
])
const stableStatusTitle = ref('当前状态')
const statusTextMap = ref(['稳定', '较稳定', '较不稳定', '不稳定'])
const statusColorMap = ref(['#0cb444', '#0212a1', '#e48b18', '#b11a06'])
const beforeSmallCurrentStatus = ref(false)
const statusDetailShow = ref(false)
const smallCurrentStatus = ref(false)
const lineStatusShow = ref(false)
const statusLineDom = ref([])
const lineTextColorMap = ref(['#D1FFE0', '#D1FDFF', '#FFF3D1', '#FFE3E3'])

function genStatusLinearBg(statusIndex, itemIndex) {
    if (!statusDetailShow.value) return 'transparent'

    let baseColor = statusColorMap.value[statusIndex - 1]
    let percent = stableStatus.value[statusIndex - 1][itemIndex - 1] * 0.93 + 2
    let gradText =
        'linear-gradient(0deg, ' +
        baseColor +
        ' 0%, ' +
        baseColor +
        ' ' +
        String(percent + 5) +
        '%, ' +
        fade(baseColor, 40) +
        ' ' +
        String(percent + 6) +
        '%, ' +
        fade(baseColor, 10)
    ;('100%)')
    return {
        background: gradText,
        // '-webkit-background-clip': 'text',
        // 'background-clip': 'text',
    }
}

const stableStatusLineData = [
    [39, 41, 47, 48, 40, 42, 45, 36, 42, 38, 34, 29],
    [21, 24, 18, 18, 13, 16, 25, 25, 30, 26, 39, 42],
    [23, 25, 6, 16, 36, 25, 21, 24, 24, 24, 19, 21],
    [17, 10, 29, 18, 11, 17, 9, 15, 4, 12, 9, 8],
]

function getR() {
    let a = Math.floor(Math.random() * 50)
    let b = Math.floor(Math.random() * 35)
    let c = Math.floor(Math.random() * (100 - a - b))
    let d = 100 - a - b - c
    return [a, b, c, d]
}

const colorGradientMap = [
    ['#A7EBBC', '#12A734'],
    ['#00ACFF', '#0212a1'],
    ['#FFE56C', '#e48b18'],
    ['#FF8629', '#b11a06'],
]
const areaColorGradientMap = [
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
            offset: 0,
            color: '#42EB77',
        },
        {
            offset: 1,
            color: '#D5EBDC',
        },
    ]),
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
            offset: 0,
            color: '#00ACFF',
        },
        {
            offset: 1,
            color: '#C7ECFF',
        },
    ]),
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
            offset: 0,
            color: '#F0AB51',
        },
        {
            offset: 1,
            color: '#E6CDAC',
        },
    ]),
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
            offset: 0,
            color: '#FF3636',
        },
        {
            offset: 1,
            color: '#FFDBDB',
        },
    ]),
]

const hoursBackList = getHoursBackIn(24, 2)
// console.log(getHoursBackIn(24, 2))

const baseChartOption = {
    visualMap: {
        show: false,
        type: 'continuous',
        seriesIndex: 0,
        min: 0,
        max: 100,
        inRange: {
            color: ['#fff', '#123'],
        },
    },
    tooltip: {
        trigger: 'axis',
    },
    xAxis: {
        data: hoursBackList,
        axisLabel: {
            fontWeight: 'bold',
            color: '#fff',
        },
    },
    yAxis: {
        min: 'dataMin',
        // max: 'dataMax',
        max: function (val) {
            if (val.max * 1.2 >= 100) {
                return 100
            } else return val.max * 1.2
        },
        axisLabel: {
            formatter: '{value}%',
            fontFamily: 'Impact',
            color: '#E3FEFF',
        },
        splitLine: {
            lineStyle: {
                color: '#ccc',
                opacity: 0.5,
            },
        },
    },
    grid: {
        top: '4%',
        left: '3%',
        right: '2%',
        bottom: '2%',
        containLabel: true,
    },
    series: {
        type: 'line',
        showSymbol: true,
        lineStyle: {
            width: 4,
        },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                    offset: 0,
                    color: 'rgb(255, 158, 68)',
                },
                {
                    offset: 1,
                    color: 'rgb(255, 70, 131)',
                },
            ]),
        },
        data: stableStatusLineData[0],
    },
}

function genChartOption(index) {
    let chartOption = JSON.parse(JSON.stringify(baseChartOption))
    chartOption.visualMap.inRange.color = colorGradientMap[index]
    chartOption.series.data = stableStatusLineData[index]
    chartOption.series.areaStyle.color = areaColorGradientMap[index]
    chartOption.xAxis.axisLabel.color = statusColorMap.value[index]
    chartOption.yAxis.axisLabel.color = statusColorMap.value[index]
    return chartOption
}

// let b = JSON.parse(JSON.stringify(baseChartOption))
// console.log(b, baseChartOption)

function iterateStatus(interval) {
    setTimeout(() => {
        beforeSmallCurrentStatus.value = true
    }, interval)

    setTimeout(() => {
        smallCurrentStatus.value = true
    }, interval + 1000)

    setTimeout(() => {
        statusDetailShow.value = true
        stableStatusTitle.value = '近四次评估'
    }, interval + 2000)

    setTimeout(() => {
        lineStatusShow.value = true
        stableStatusTitle.value = '近一日内评估'
    }, interval + 5000)

    setTimeout(() => {
        beforeSmallCurrentStatus.value = false
    }, interval + 10000)

    setTimeout(() => {
        smallCurrentStatus.value = false
    }, interval + 9000)

    setTimeout(() => {
        statusDetailShow.value = false
    }, interval + 8000)

    setTimeout(() => {
        lineStatusShow.value = false
        stableStatusTitle.value = '当前状态'
    }, interval + 12000)
}

onMounted(() => {
    for (let i = 0; i < 4; i++) {
        // console.log(i)
        let aChart = echarts.init(statusLineDom.value[i])
        aChart.setOption(genChartOption(i))
    }

    iterateStatus(3000)

    setInterval(() => {
        iterateStatus(3000)
    }, 15000)
})
</script>

<style lang="scss" scoped>
$shadow: #6b94e0;
$shadowGreen: #6be071;
$shadowBlue: #6ba7e0;
$shadowOrange: #e0a96b;
$shadowRed: #e06b6b;

div.stable-status-conatainer {
    position: absolute;
    top: 53vh;
    right: 1vw;
    width: 20vw;
    height: 36vh;
    border-radius: 0.6rem;
    overflow: hidden;

    background-color: rgba(54, 100, 226, 0.4);
    backdrop-filter: blur(5px);

    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;

    border: solid 3px #d3fff9;

    div.stable-status-title {
        width: 20vw;
        height: 6vh;

        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 0.4vw;

        // border-style: solid;
        border-bottom: inset 2px #daf1ff;

        background-color: rgba(215, 228, 255, 0.6);

        div.stable-status-icon {
            height: 4vh;
            width: 4vh;
            background-image: url('/landslide.png');
            background-size: contain;
        }

        div.status-title-text {
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

    div.stable-status-item {
        width: 9.6vw;
        height: 14vh;

        border-radius: 1rem;

        background-color: rgba(234, 241, 255, 0.8);

        transition: all 2s ease-in-out;

        &[id='status-item-1'] {
            div.status-small-item {
                background-color: #e3ffed;
                div.stable-status-text {
                    text-shadow:
                        $shadowGreen 1px 1px,
                        $shadowGreen 2px 2px,
                        $shadowGreen 3px 3px;
                }
            }
        }
        &[id='status-item-2'] {
            div.status-small-item {
                background-color: #dbe7ff;
                color: #fff;
                div.stable-status-text {
                    text-shadow:
                        $shadowBlue 1px 1px,
                        $shadowBlue 2px 2px,
                        $shadowBlue 3px 3px;
                }
            }
        }
        &[id='status-item-3'] {
            div.status-small-item {
                background-color: #fff0dc;
                div.stable-status-text {
                    text-shadow:
                        $shadowOrange 1px 1px,
                        $shadowOrange 2px 2px,
                        $shadowOrange 3px 3px;
                }
            }
        }
        &[id='status-item-4'] {
            div.status-small-item {
                background-color: #ffe2e1;
                color: #fff;
                div.stable-status-text {
                    text-shadow:
                        $shadowRed 1px 1px,
                        $shadowRed 2px 2px,
                        $shadowRed 3px 3px;
                }
            }
        }

        div.status-small-item {
            position: relative;
            // margin-left: 0.2vw;
            // margin-top: 0.2vh;
            width: 4.5vw;
            line-height: 6.5vh;
            height: 6.7vh;
            border-radius: 1rem;

            background-color: #0cb444;
            // display: inline-block;
            text-align: center;
            transition: all 1s ease-in-out;
            opacity: 0;
            overflow: hidden;
            // transform-style: preserve-3d;
            // backface-visibility: hidden;

            &[statusId='status-1'] {
                left: 0.2vw;
                top: 0.2vh;
            }
            &[statusId='status-2'] {
                left: 4.9vw;
                top: -6.5vh;
            }
            &[statusId='status-3'] {
                left: 0.2vw;
                top: -6.3vh;
            }

            &.detail-status-show {
                opacity: 1;

                div.stable-status-text {
                    font-size: calc(0.8vw + 0.4vh);
                    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold',
                        sans-serif;
                    // text-shadow:
                    //     $shadow 1px 1px,
                    //     $shadow 2px 2px,
                    //     $shadow 3px 3px;

                    z-index: 5;

                    div.stable-status-value {
                        height: 100%;
                        line-height: 6.5vh;
                        // background: #000744;
                        // -webkit-background-clip: text;
                        // background-clip: text;
                        // text-shadow:
                        //     $shadow 1px 1px,
                        //     $shadow 2px 2px,
                        //     $shadow 3px 3px;
                        // color: transparent;
                    }
                }
            }

            &.current-status-item {
                height: 14vh;
                width: 9.6vw;
                left: 0vw;
                top: -20.1vh;
                line-height: 13.6vh;
                transition: all 1s cubic-bezier(0.68, -0.15, 0.265, 1.15);
                opacity: 1;
                &.detail-status-state {
                    width: 4.5vw;
                    line-height: 6.5vh;
                    height: 6.5vh;
                    left: 4.9vw;
                    top: -13vh;
                    // transform: translate(100%, 100%);

                    div.wave-container {
                        height: 6.5vh;
                        width: 4.5vw;
                    }
                }

                div.wave-container {
                    height: 8vh;
                    width: 9.6vw;
                }
            }

            div.stable-status-text {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-flow: column nowrap;
                justify-content: center;
                align-content: center;

                font-size: calc(1.4vw + 0.4vh);
                font-weight: 600;
                font-family: Impact, Haettenschweiler, 'Arial Narrow Bold',
                    sans-serif;
                // text-shadow:
                //     $shadow 1px 1px,
                //     $shadow 2px 2px,
                //     $shadow 3px 3px;

                z-index: 5;
                transition: all 1s cubic-bezier(0.68, -0.15, 0.265, 1.15);

                div.stable-status-name {
                    height: 45%;
                    line-height: 100%;
                    color: #000744;
                    transition: all 1s cubic-bezier(0.68, -0.15, 0.265, 1.15);
                }

                div.stable-status-value {
                    height: fit-content;
                    line-height: 100%;
                    font-size: calc(1.8vw + 0.8vh);
                    font-weight: 500;
                    // text-shadow:
                    //     $shadow 1px 1px,
                    //     $shadow 2px 2px,
                    //     $shadow 3px 3px,
                    //     $shadow 4px 4px;
                    color: #ffffff;
                }

                &.no-name {
                    div.stable-status-name {
                        transform: translateX(-10vw);
                        height: 0px;
                    }

                    div.stable-status-value {
                        height: 100%;
                        line-height: 6.5vh;
                        font-size: calc(1.2vw + 0.6vh);
                        // line-height: 4vh;
                        // transform: translateY(-30%);
                    }
                }
            }

            div.wave-container {
                position: absolute;
                height: 50%;
                width: 4.5vw;
                bottom: 0;
                z-index: 4;

                .waves {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    bottom: 0;
                    z-index: 4;
                    // margin-bottom: -7px; /*Fix for safari gap*/

                    .parallax > use {
                        animation: move-forever 15s
                            cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
                    }
                    .parallax > use:nth-child(1) {
                        animation-delay: -2s;
                        animation-duration: 7s;
                    }
                    .parallax > use:nth-child(2) {
                        animation-delay: -3s;
                        animation-duration: 10s;
                    }
                    .parallax > use:nth-child(3) {
                        animation-delay: -4s;
                        animation-duration: 13s;
                    }
                    .parallax > use:nth-child(4) {
                        animation-delay: -5s;
                        animation-duration: 20s;
                    }
                    @keyframes move-forever {
                        0% {
                            transform: translate3d(-90px, 0, 0);
                        }
                        100% {
                            transform: translate3d(85px, 0, 0);
                        }
                    }
                }
            }
        }

        div.horizontal-arrow-container {
            position: relative;
            width: 2vw;
            height: 2vh;
            top: -24vh;
            left: 3.8vw;
            // background-color: #000744;
            z-index: 6;
            opacity: 0;
            transition: all 1s cubic-bezier(0.68, -0.15, 0.265, 1.15);

            &.down {
                top: -19vh;
            }

            &.mid {
                top: -24.8vh;
                left: 6.1vw;
            }

            .horizontal-arrow-svg {
                width: 100%;
                height: 100%;
                bottom: 0;

                &.right {
                    transform: rotate(180deg);
                }

                &.down {
                    transform: rotate(-90deg);
                }
            }

            &.show {
                opacity: 0.8;
            }
        }

        div.status-line-item {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #0cb444;
        }
    }

    div.status-line-container {
        position: absolute;
        top: calc(6vh + 1px);
        height: 60vh;
        width: 20vw;
        transform: translateY(40vh);
        transition: all 1s cubic-bezier(0.68, -0.15, 0.265, 1.15);

        &.show {
            transform: translateY(0vh);
        }

        // background-color: #0cb444;

        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
        align-content: space-around;
        z-index: 11;

        div.stable-status-item {
            background-color: #e9f2ff;
            backdrop-filter: blur(10px);
            text-align: center;
            color: #dbe7ff;
            z-index: 12;

            &.text-item {
                transform: translateY(-30vh);
                background-color: transparent;
                backdrop-filter: none;
                text-align: center;
                font-weight: 600;

                line-height: 14vh;
                font-size: 1.2vw;
                z-index: 13;
            }
        }
    }
}
</style>

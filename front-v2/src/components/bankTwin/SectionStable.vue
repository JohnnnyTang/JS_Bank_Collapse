<template>
    <div class="stable-status-container">
        <dv-border-box12
            :color="['rgb(28, 75, 247)', 'rgb(150, 255, 255)']"
            class="stable-border-box"
        >
            <div class="stable-status-header">岸段风险评估</div>
            <div class="splitter-container">
                <dv-decoration3
                    class="status-splitter"
                    :color="['rgb(28, 75, 247)', 'rgb(150, 255, 255)']"
                />
                <dv-decoration3
                    class="status-splitter"
                    :color="['rgb(28, 75, 247)', 'rgb(150, 255, 255)']"
                />
                <dv-decoration3
                    class="status-splitter"
                    :color="['rgb(28, 75, 247)', 'rgb(150, 255, 255)']"
                />
                <dv-decoration3
                    class="status-splitter"
                    :color="['rgb(28, 75, 247)', 'rgb(150, 255, 255)']"
                />
            </div>
            <div class="section-selector">
                <div class="section-selectior-label">选择断面</div>
                <div class="section-selectior-item">
                    <el-select
                        v-model="value"
                        placeholder="全部断面"
                        style="width: 10vw; height: 3.5vh"
                        @change="sectionSelectChange"
                    >
                        <el-option
                            v-for="item in sectionList"
                            :key="item.value"
                            :label="
                                item.label == '全部断面状态比例'
                                    ? item.label
                                    : item.label + '断面风险'
                            "
                            :value="item.label"
                        >
                            <span
                                style="float: left"
                                class="section-name-text"
                                >{{ item.label }}</span
                            >
                            <span
                                style="float: right"
                                class="section-class-text"
                                :id="sectionClassColorMap[item.value]"
                                >{{ item.value }}</span
                            >
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div
                class="section-status-content"
                :class="{ 'single-section': singleSectionShow }"
            >
                <div class="section-statistic-content section-content">
                    <div class="status-all-selector">
                        <div
                            class="all-selector-item"
                            :class="[
                                allSelectorStatusId == 1
                                    ? 'active'
                                    : 'not-active',
                            ]"
                        >
                            <div
                                class="selector-item-text"
                                @click="allSelectorClick(1)"
                            >
                                当前状态
                            </div>
                        </div>
                        <div
                            class="all-selector-item"
                            :class="[
                                allSelectorStatusId == 2
                                    ? 'active'
                                    : 'not-active',
                            ]"
                        >
                            <div
                                class="selector-item-text"
                                @click="allSelectorClick(2)"
                            >
                                近期趋势
                            </div>
                        </div>
                        <div
                            class="all-selector-item active-bg"
                            :active-id="allSelectorStatusId"
                        ></div>
                    </div>
                    <div
                        class="stable-status-item"
                        v-for="i in 4"
                        :key="i"
                        :id="'status-item-' + i"
                        :class="{ 'not-show': lineStatusShow }"
                    >
                        <div
                            class="status-small-item"
                            v-for="m in 4"
                            :key="m"
                            :class="{
                                'current-status-item': m == 4,
                            }"
                            :statusId="'status-' + m"
                        >
                            <div
                                class="wave-container"
                                :style="{
                                    height:
                                        stableStatus[i - 1][m - 1] * 1.2 +
                                        28 +
                                        '%',
                                }"
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
                                            :fill="
                                                fade(statusColorMap[i - 1], 50)
                                            "
                                        />
                                        <use
                                            xlink:href="#gentle-wave"
                                            x="48"
                                            y="3"
                                            :fill="
                                                fade(statusColorMap[i - 1], 70)
                                            "
                                        />
                                        <use
                                            xlink:href="#gentle-wave"
                                            x="48"
                                            y="5"
                                            :fill="
                                                fade(statusColorMap[i - 1], 90)
                                            "
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
                            <div class="stable-status-text">
                                <div class="stable-status-name">
                                    {{ statusTextMap[i - 1] }}
                                </div>
                                <div class="stable-status-value">
                                    {{ stableStatus[i - 1][m - 1] + '%' }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="status-line-container"
                        :class="{ show: lineStatusShow }"
                    >
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
                <div class="section-single-content section-content">
                    <div
                        class="section-chart-container"
                        ref="sectionChartDom"
                    ></div>
                </div>
            </div>
        </dv-border-box12>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { fade } from '../../utils/colorUtils'
import { getDatesBefore } from '../../utils/timeUtils'
import { sectionList, sectionStableDataMap, genChartSeries } from './data'

const stableStatus = ref([
    [3, 0, 0, 0],
    [8, 6, 0, 0],
    [48, 48, 47, 36],
    [42, 46, 53, 64],
])

const changeData = (index) => {
    if (index == 1) {
        stableStatus.value[2][3] = 47
        stableStatus.value[3][3] = 53
    }
    else {
        stableStatus.value[2][3] = 36
        stableStatus.value[3][3] = 64
    }
}
defineExpose({ changeData })
const stableStatusLineData = [
    [8, 6, 5, 5, 3, 0, 0, 0],
    [13, 13, 12, 10, 8, 6, 0, 0],
    [52, 48, 48, 48, 48, 48, 47, 36],
    [27, 33, 35, 37, 41, 46, 53, 64],
]

const sectionChartDom = ref()
const value = ref('全部断面状态比例')
const singleSectionShow = ref(false)
const sectionClassColorMap = {
    警告: 'warning',
    预警: 'pre-warning',
    关注: 'attention',
    普通: 'normal',
    统计: 'all',
}

const sectionSelectChange = (val) => {
    console.log(val)
    if (val === '全部断面状态比例') singleSectionShow.value = false
    else {
        singleSectionShow.value = true
    }
}

const statusTextMap = ref(['较稳定', '稳定', '不稳定', '较不稳定'])
// const statusColorMap = ref(['#0cb444', '#0212a1', '#e48b18', '#b11a06'])
const statusColorMap = ref(['#13a500', '#003a92', '#be7200', '#a50101'])
const lineStatusShow = ref(false)
const statusLineDom = ref([])

const allSelectorStatusId = ref(1)

const allSelectorClick = (id) => {
    if (id == allSelectorStatusId.value) return
    else {
        allSelectorStatusId.value = id
        if (id == 1) {
            lineStatusShow.value = false
        } else {
            lineStatusShow.value = true
        }
    }
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

const hoursBackList = getDatesBefore(8, 15)
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

let sectionChartOption = {}

onMounted(() => {
    for (let i = 0; i < 4; i++) {
        // console.log(i)
        let aChart = echarts.init(statusLineDom.value[i])
        aChart.setOption(genChartOption(i))
    }

    let sectionChart = echarts.init(sectionChartDom.value)
    sectionChartOption = genChartSeries(
        sectionChart,
        ['#42EB77', '#00ACFF', '#F0AB51', '#FF3636'],
        sectionStableDataMap['JC01'],
        4,
    )
    sectionChart.setOption(sectionChartOption)
})
</script>

<style lang="scss" scoped>
$shadowWhite: #accad8;
$shadowGreen: #00ca22;
$shadowBlue: #005ae0;
$shadowOrange: #c54f00;
$shadowRed: #cf0000;

$flowGreen: #13a500;
$flowBlue: #003a92;
$flowOrange: #be7200;
$flowRed: #a50101;

div.stable-status-container {
    position: absolute;
    top: 53vh;
    right: 1vw;
    height: 36vh;
    width: 20vw;

    // background-color: aliceblue;
    z-index: 3;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 6px 8px 10px -4px rgb(11, 70, 146);

    div.stable-status-header {
        height: 4vh;
        line-height: 4vh;
        width: 20vw;

        font-size: calc(0.8vw + 0.8vh);
        font-weight: bold;
        text-align: center;
        letter-spacing: 0.3rem;

        color: rgb(23, 95, 163);
        text-shadow:
            #c7dcec 1px 1px,
            #c7dcec 2px 2px,
            #6493ff 3px 3px;
    }

    div.splitter-container {
        position: relative;
        height: 2vh;
        width: 19vw;
        margin-left: 0.5vw;
        overflow: hidden;

        display: flex;

        :deep(.status-splitter) {
            position: relative;
            width: 25%;
            height: 100%;
            flex-shrink: 0;
            flex-grow: 0;
        }
    }

    div.section-selector {
        height: 3.5vh;
        width: 18vw;
        margin-left: 1vw;

        // background-color: #6493ff;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        column-gap: 0.25vw;

        div.section-selectior-label {
            width: 6vw;
            height: 3.5vh;

            line-height: 3.5vh;
            text-align: center;
            background-color: #cee9ff;
            color: #001cb8;
            font-size: calc(0.6vw + 0.7vh);

            border-radius: 8px;

            box-shadow:
                rgba(0, 132, 255, 0.8) 1px 1px,
                rgba(0, 119, 255, 0.7) 3px 3px,
                rgba(0, 119, 255, 0.6) 4px 4px;
        }

        div.section-selectior-item {
            width: 10vw;
            height: 3.3vh;

            line-height: 3.3vh;
            text-align: center;

            // background-color: #eef3ff;
            :deep(.el-select) {
                height: 3.3vh;
                box-shadow:
                    rgba(0, 132, 255, 0.8) 1px 1px,
                    rgba(0, 119, 255, 0.7) 2px 2px,
                    rgba(0, 119, 255, 0.6) 3px 4px;
                border-radius: 6px;
            }

            :deep(.el-select__wrapper) {
                height: 3.3vh;
                line-height: 3.3vh;
                border-radius: 6px;
                font-family: 'Microsoft YaHei';
                font-weight: bold;
                font-size: calc(0.5vw + 0.6vh);
                background-color: #e6f7ff;
            }

            :deep(.el-select__placeholder) {
                color: #738ab6;
            }

            :deep(.el-icon) {
                width: 0.5vw;
                height: 0.5vw;

                svg {
                    width: 0.5vw;
                    height: 0.5vw;

                    path {
                        fill: #001cb8;
                    }
                }
            }
        }
    }
    div.section-status-content {
        width: 41vw;
        height: 24vh;
        margin-left: 0.5vw;
        margin-top: 1vh;

        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        column-gap: 3vw;
        transition: all 0.4s cubic-bezier(0.68, -0.15, 0.265, 1.15);

        &.single-section {
            transform: translateX(-22vw);
        }
        // background-color: #005ae0;

        div.section-content {
            height: 24.5vh;
            width: 19vw;

            // background-color: #cee9ff;
            display: flex;
            flex-flow: column wrap;
            justify-content: space-between;
            align-items: center;
            align-content: space-around;
            overflow: hidden;
            // row-gap: 0.2vw;

            div.status-all-selector {
                height: 24vh;
                width: 2.2vw;
                padding-top: 0.25vh;
                overflow: hidden;
                display: flex;
                flex-flow: column nowrap;
                row-gap: 0.6vh;
                // justify-content: space-between;
                border-radius: 8px;

                // background-color: #001cb8;

                div.all-selector-item {
                    height: 11.5vh;
                    width: 2vw;
                    flex-shrink: 0;
                    border-radius: 8px;

                    background-color: #bad6ff;
                    transition: all 0.2s ease-in;

                    box-shadow:
                        rgba(0, 132, 255, 0.8) 1px 1px,
                        rgba(0, 119, 255, 0.7) 3px 3px,
                        rgba(0, 119, 255, 0.6) 5px 5px;

                    &.active {
                        box-shadow:
                            rgba(0, 204, 255, 0.8) 1px 1px,
                            rgba(0, 162, 255, 0.7) 3px 3px,
                            rgba(0, 140, 255, 0.6) 5px 5px;

                        // background-color: #002daa;

                        div.selector-item-text {
                            color: #cefffd;
                        }
                    }

                    &.active-bg {
                        background-color: #002daa;
                        z-index: 4;
                        box-shadow: none;
                        transition: all 0.4s
                            cubic-bezier(0.68, -0.15, 0.265, 1.15);

                        &[active-id='1'] {
                            transform: translateY(-24.2vh);
                        }

                        &[active-id='2'] {
                            transform: translateY(-12.1vh);
                        }
                    }

                    &.not-active {
                        &:hover {
                            transform: translate3d(3px, 3px, 3px);

                            box-shadow:
                                rgba(0, 204, 255, 0.8) 1px 1px,
                                rgba(0, 162, 255, 0.7) 3px 3px,
                                rgba(0, 140, 255, 0.6) 5px 5px;
                            color: #cefffd;
                            background-color: #004faa;
                        }
                    }
                    &:hover {
                        cursor: pointer;
                    }

                    div.selector-item-text {
                        position: relative;
                        writing-mode: vertical-lr;
                        line-height: 2vw;
                        text-align: center;
                        height: 11.5vh;
                        width: 2vw;
                        z-index: 5;

                        font-size: calc(0.6vw + 0.6vh);
                        font-weight: bold;
                    }
                }
            }

            div.stable-status-item {
                width: 8vw;
                height: 12vh;

                border-radius: 0.5rem;

                background-color: rgba(234, 241, 255, 0.8);

                transition: all 0.6s cubic-bezier(0.68, -0.15, 0.265, 1.15);

                &.not-show {
                    transform: translateY(-25vh);
                }

                &[id='status-item-1'] {
                    order: 2;
                    div.status-small-item {
                        background-color: #e3ffed;
                        div.stable-status-text {
                            color: $flowGreen;
                            text-shadow:
                                $shadowWhite 1px 1px,
                                $shadowWhite 2px 2px,
                                $shadowWhite 3px 3px;
                        }
                    }
                }
                &[id='status-item-2'] {
                    order: 4;
                    div.status-small-item {
                        background-color: #dbe7ff;
                        // color: #fff;
                        div.stable-status-text {
                            color: $flowBlue;
                            text-shadow:
                                $shadowWhite 1px 1px,
                                $shadowWhite 2px 2px,
                                $shadowWhite 3px 3px;
                        }
                    }
                }
                &[id='status-item-3'] {
                    order: 3;
                    div.status-small-item {
                        background-color: #fff0dc;
                        div.stable-status-text {
                            color: $flowOrange;
                            text-shadow:
                                $shadowWhite 1px 1px,
                                $shadowWhite 2px 2px,
                                $shadowWhite 3px 3px;
                        }
                    }
                }

                &[id='status-item-4'] {
                    order: 5;
                    div.status-small-item {
                        background-color: #ffe2e1;
                        // color: #fff;
                        div.stable-status-text {
                            color: $flowRed;
                            text-shadow:
                                $shadowWhite 1px 1px,
                                $shadowWhite 2px 2px,
                                $shadowWhite 3px 3px;
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
                    overflow: hidden;
                    border-radius: 0.5rem;
                    box-shadow:
                        rgb(2, 50, 138) 3px 3px 6px 0px inset,
                        rgba(2, 38, 138, 0.7) -3px -3px 6px 1px inset;

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

                    &.current-status-item {
                        height: 12vh;
                        width: 8vw;
                        left: 0vw;
                        top: -20.1vh;
                        line-height: 13.6vh;
                        transition: all 1s
                            cubic-bezier(0.68, -0.15, 0.265, 1.15);
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

                        font-size: calc(0.8vw + 0.8vh);
                        font-weight: 600;
                        font-family: Impact, Haettenschweiler,
                            'Arial Narrow Bold', sans-serif;
                        // text-shadow:
                        //     $shadow 1px 1px,
                        //     $shadow 2px 2px,
                        //     $shadow 3px 3px;

                        z-index: 5;
                        transition: all 1s
                            cubic-bezier(0.68, -0.15, 0.265, 1.15);

                        div.stable-status-name {
                            height: 45%;
                            line-height: 100%;
                            // color: #000744;
                            transition: all 1s
                                cubic-bezier(0.68, -0.15, 0.265, 1.15);
                        }

                        div.stable-status-value {
                            height: fit-content;
                            line-height: 100%;
                            font-size: calc(1.2vw + 1.2vh);
                            font-weight: 500;
                            // text-shadow:
                            //     $shadow 1px 1px,
                            //     $shadow 2px 2px,
                            //     $shadow 3px 3px,
                            //     $shadow 4px 4px;
                            color: #ffffff;
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
                top: calc(5.1vh);
                height: 60vh;
                width: 16.2vw;
                margin-left: 2.5vw;
                transform: translateY(40vh);
                transition: all 0.8s cubic-bezier(0.68, -0.15, 0.265, 1.15);

                &.show {
                    transform: translateY(0vh);
                }

                // background-color: #0cb444;

                display: flex;
                flex-flow: row wrap;
                justify-content: space-between;
                align-content: center;
                row-gap: 0.4vh;
                z-index: 11;

                div.stable-status-item {
                    background-color: transparent;
                    // backdrop-filter: blur(10px);
                    text-align: center;
                    color: #dbe7ff;
                    z-index: 14;
                    box-shadow:
                        rgba(0, 40, 116, 0.4) 0px 2px 4px,
                        rgba(0, 50, 124, 0.3) 0px 7px 13px -3px,
                        rgba(0, 56, 121, 0.2) 0px -3px 0px inset;

                    &.text-item {
                        background-color: #e9f2ff;
                        transform: translateY(-24.8vh);
                        // background-color: transparent;
                        backdrop-filter: none;
                        text-align: right;
                        font-weight: 600;

                        line-height: 3vh;
                        font-size: calc(0.8vw + 0.4vh);
                        z-index: 13;
                    }
                }
            }

            div.section-chart-container {
                width: 18vw;
                height: 24vh;
                padding-left: 0.5vw;
                padding-top: 0.25vh;

                // background-color: #001cb8;
            }
        }
    }
}

:deep(.stable-border-box) {
    backdrop-filter: blur(12px);
    // box-shadow: 4px 8px 8px -4px rgb(0, 47, 117);
    border-radius: 12px;
    background-color: rgba(156, 195, 255, 0.4);
}

:deep(.section-name-text) {
    font-weight: bold;
    font-size: calc(0.4vw + 0.4vh);
}

:deep(.section-class-text) {
    font-size: calc(0.4vw + 0.4vh);
    &[id='warning'] {
        color: $shadowRed;
    }
    &[id='pre-warning'] {
        color: $shadowOrange;
    }
    &[id='attention'] {
        color: $shadowBlue;
    }
    &[id='normal'] {
        color: $shadowGreen;
    }
    &[id='all'] {
        color: #3d00ad;
    }
}

// :deep(.el-select-dropdown__item) {
//     background-color: #6ba7e0;
// }
</style>

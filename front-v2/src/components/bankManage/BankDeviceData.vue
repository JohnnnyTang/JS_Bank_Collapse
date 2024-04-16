<template>
    <div class="device-data-container">
        <dv-border-box12 backgroundColor="rgb(233, 247, 255)">
            <div class="device-selector">
                <el-scrollbar>
                    <el-menu
                        :default-active="defaultActiveMap[curDevice]"
                        class="el-menu-vertical-demo"
                        @select="selectDevice"
                    >
                        <el-menu-item disabled class="title">
                            <span>选择设备</span>
                        </el-menu-item>
                        <el-menu-item
                            v-for="(device, index) in deviceListMap[curDevice]"
                            :index="device"
                            :key="index"
                            :disabled="device.split('-')[0] === 'JZ'"
                        >
                            <span>{{ device }}</span>
                        </el-menu-item>
                    </el-menu>
                </el-scrollbar>
            </div>
            <div class="data-table-container">
                <el-table
                    :data="deviceDataManageMap[curDevice][deviceSelection].data"
                    stripe
                    style="width: 100%"
                    height="43.5vh"
                >
                    <el-table-column
                        v-for="(key, index) in deviceTableKeyListMap[curDevice]"
                        :key="index"
                        :prop="key.name"
                        :label="key.label"
                    />
                </el-table>
            </div>
            <div class="data-chart-container">
                <div class="change-button-group">
                    <el-segmented
                        v-model="chartSelection"
                        :options="optionsMap[curDevice]"
                        @change="changeSeries"
                    />
                </div>
                <div class="chart-box" ref="chartDom"></div>
            </div>
        </dv-border-box12>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { BorderBox12 as DvBorderBox12 } from '@kjgl77/datav-vue3'
import * as echarts from 'echarts'
import axios from 'axios'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'

const props = defineProps({
    initDevice: {
        type: String,
        default: 'gnss',
    },
})
// console.log("init", props.initDevice)

const curDevice = ref(props.initDevice)

const backendInstance = axios.create({
    // baseURL: Vue.prototype.baseURL,
    baseURL: '/api',
})

const chartDom = ref()

const defaultActiveMap = ref({
    gnss: 'CL-01',
})

const optionsMap = {
    gnss: ['X位移', 'Y位移', 'Z位移', '三维累积位移', '五小时相对变化'],
}

const deviceSelection = ref(defaultActiveMap.value[curDevice.value])

const chartSelection = ref(optionsMap[curDevice.value][0])

const deviceNameMap = {
    gnss: {
        X位移: 'x_move',
        Y位移: 'y_move',
        Z位移: 'z_move',
        三维累积位移: 'threeD',
        五小时相对变化: 'threeDF',
    },
    inclinometer: {},
    manometer: {},
    stress: {},
}

const deviceListMap = ref({
    gnss: [
        'JZ-01',
        'JZ-02',
        'JZ-03',
        'CL-01',
        'CL-02',
        'CL-03',
        'CL-04',
        'CL-05',
        'CL-06',
        'CL-07',
        'CL-08',
        'CL-09',
        'CL-10',
    ],
    inclinometer: [],
    manometer: [],
    stress: [],
})

const deviceIdMap = {
    gnss: {
        'CL-01': 'MZS120.51749289_32.04059243_1',
        'CL-02': 'MZS120.51977143_32.04001152_1',
        'CL-03': 'MZS120.52557975_32.03825056_1',
        'CL-04': 'MZS120.52660704_32.03676583_1',
        'CL-05': 'MZS120.53334877_32.03227055_1',
        'CL-06': 'MZS120.54599538_32.02837993_1',
        'CL-07': 'MZS120.55327892_32.02707923_1',
        'CL-08': 'MZS120.55649757_32.02592404_1',
        'CL-09': 'MZS120.56334257_32.02298144_1',
        'CL-10': 'MZS120.56944728_32.02070961_1',
    },
}

const deviceTableKeyListMap = ref({
    gnss: [
        { name: 'XMove', label: 'X位移' },
        { name: 'YMove', label: 'Y位移' },
        { name: 'ZMove', label: 'Z位移' },
        { name: 'threeD', label: '三维累积位移' },
        { name: 'threeDf', label: '五小时相对变化' },
        { name: 'inTime', label: '时间' },
    ],
    inclinometer: [],
    manometer: [],
    stress: [],
})

const deviceDataManageMap = ref({
    gnss: {
        'CL-01': {
            updateTime: null,
            data: [],
            chartData: {},
        },
        'CL-02': {
            updateTime: null,
            data: [],
            chartData: {},
        },
        'CL-03': {
            updateTime: null,
            data: [],
            chartData: {},
        },
        'CL-04': {
            updateTime: null,
            data: [],
            chartData: {},
        },
        'CL-05': {
            updateTime: null,
            data: [],
            chartData: {},
        },
        'CL-06': {
            updateTime: null,
            data: [],
            chartData: {},
        },
        'CL-07': {
            updateTime: null,
            data: [],
            chartData: {},
        },
        'CL-08': {
            updateTime: null,
            data: [],
            chartData: {},
        },
        'CL-09': {
            updateTime: null,
            data: [],
            chartData: {},
        },
        'CL-10': {
            updateTime: null,
            data: [],
            chartData: {},
        },
    },
    inclinometer: {},
    manometer: {},
    stress: {},
})

const chartOption = {
    tooltip: {
        trigger: 'axis',
    },
    grid: {
        left: '2%',
        right: '4%',
        bottom: '10%',
        top: '10%',
        containLabel: true,
    },
    xAxis: {
        // data: data.map(function (item) {
        //   return item[0];
        // })
    },
    yAxis: {},
    toolbox: {
        right: 10,
        feature: {
            dataZoom: {
                yAxisIndex: 'none',
            },
            restore: {},
            saveAsImage: {},
        },
    },
    dataZoom: [
        {
            type: 'inside',
        },
        {
            type: 'slider',
        },
    ],
    visualMap: {
        top: '4%',
        right: '8%',
        itemHeight: '20',
        itemWidth: '28',
        pieces: [
            {
                gt: -18,
                lte: -10,
                color: '#FD0100',
            },
            {
                gt: -10,
                lte: -5,
                color: '#FC7D02',
            },
            {
                gt: -5,
                lte: -3,
                color: '#FBDB0F',
            },
            {
                gt: -3,
                lte: 3,
                color: '#93CE07',
            },
            {
                gt: 3,
                lte: 5,
                color: '#FBDB0F',
            },
            {
                gt: 5,
                lte: 10,
                color: '#FC7D02',
            },
            {
                gt: 10,
                lte: 18,
                color: '#FD0100',
            },
        ],
        outOfRange: {
            color: '#999',
        },
        formatter: '{value}~{value2}',
        orient: 'horizontal',
        align: 'left',
        // textGap: 20,
        itemGap: 30,
        textStyle: {
            fontFamily: 'Times',
            fontWeight: 'bold',
        },
    },
    series: [
        {
            name: 'SplitLine',
            type: 'line',
            // data: data.map(function (item) {
            //   return item[1];
            // }),
            markLine: {
                silent: true,
                lineStyle: {
                    // color: '#333',
                    width: 2,
                    opacity: 0.75,
                },
                data: [
                    {
                        yAxis: 3,
                        lineStyle: {
                            color: '#93CE07',
                        },
                    },
                    {
                        yAxis: -3,
                        lineStyle: {
                            color: '#93CE07',
                        },
                    },
                    {
                        yAxis: 5,
                        lineStyle: {
                            color: '#FBDB0F',
                        },
                    },
                    {
                        yAxis: -5,
                        lineStyle: {
                            color: '#FBDB0F',
                        },
                    },
                    {
                        yAxis: 10,
                        lineStyle: {
                            color: '#FC7D02',
                        },
                    },
                    {
                        yAxis: -10,
                        lineStyle: {
                            color: '#FC7D02',
                        },
                    },
                    {
                        yAxis: 18,
                        lineStyle: {
                            color: '#FD0100',
                        },
                    },
                    {
                        yAxis: -18,
                        lineStyle: {
                            color: '#FD0100',
                        },
                    },
                ],
            },
        },
    ],
}

function buildSeries(dataList) {
    return {
        time: dataList.map(function (item) {
            return item['inTime'].replace(' ', '\n')
        }),
        series: {
            x_move: {
                name: 'x_move',
                type: 'line',
                data: dataList.map(function (item) {
                    return item['XMove']
                }),
            },
            y_move: {
                name: 'y_move',
                type: 'line',
                data: dataList.map(function (item) {
                    return item['YMove']
                }),
            },
            z_move: {
                name: 'z_move',
                type: 'line',
                data: dataList.map(function (item) {
                    return item['ZMove']
                }),
            },
            threeD: {
                name: 'threeD',
                type: 'line',
                data: dataList.map(function (item) {
                    return item['threeD']
                }),
            },
            threeDF: {
                name: 'threeDF',
                type: 'line',
                data: dataList.map(function (item) {
                    return item['threeDf']
                }),
            },
        },
    }
}

let myChart = null

const changeSeries = async (val) => {
    chartOption.series[1] =
        deviceDataManageMap.value[curDevice.value][
            deviceSelection.value
        ].chartData.series[deviceNameMap[curDevice.value][val]]
    console.log(chartOption.series[1])
    myChart.setOption(chartOption)
}

const selectDevice = async (index, indexPath) => {
    if (deviceDataManageMap.value[curDevice.value][index].data.length == 0) {
        deviceDataManageMap.value[curDevice.value][index].data = (
            await backendInstance.get(
                `/data/${curDevice.value}Data/day/1/device/${deviceIdMap[curDevice.value][index]}`,
            )
        ).data
        // console.log(
        //     `/data/${curDevice.value}Data/day/1/device/${deviceIdMap[curDevice.value][index]}`,
        // )
        // console.log(deviceDataManageMap.value[curDevice.value][index].data)
        deviceDataManageMap.value[curDevice.value][index].chartData =
            buildSeries(deviceDataManageMap.value[curDevice.value][index].data)
    }
    deviceSelection.value = index
    // console.log(deviceNameMap[curDevice.value][chartSelection.value])
    chartOption.series[1] =
        deviceDataManageMap.value[curDevice.value][index].chartData.series[
            deviceNameMap[curDevice.value][chartSelection.value]
        ]
    chartOption.xAxis.data =
        deviceDataManageMap.value[curDevice.value][index].chartData.time
    myChart.setOption(chartOption)
    console.log('select device', index, chartOption)
}

onBeforeRouteUpdate((to, from) => {
    // console.log(to, from)
    // console.log(to)
    curDevice.value = to.params.id
})

onMounted(async () => {
    console.log(
        `/data/${curDevice.value}Data/day/1/device/${deviceIdMap[curDevice.value][defaultActiveMap.value[curDevice.value]]}`,
    )
    const deviceData = (
        await backendInstance.get(
            `/data/${curDevice.value}Data/day/1/device/${deviceIdMap[curDevice.value][defaultActiveMap.value[curDevice.value]]}`,
        )
    ).data
    deviceDataManageMap.value[curDevice.value][
        defaultActiveMap.value[curDevice.value]
    ].data = deviceData
    deviceDataManageMap.value[curDevice.value][
        defaultActiveMap.value[curDevice.value]
    ].chartData = buildSeries(
        deviceDataManageMap.value[curDevice.value][
            defaultActiveMap.value[curDevice.value]
        ].data,
    )
    // console.log(deviceDataManageMap.value[curDevice.value][defaultActiveMap.value[curDevice.value]].chartData.series)
    chartOption.series.push(
        deviceDataManageMap.value[curDevice.value][
            defaultActiveMap.value[curDevice.value]
        ].chartData.series[
            deviceNameMap[curDevice.value][chartSelection.value]
        ],
    )
    chartOption.xAxis.data =
        deviceDataManageMap.value[curDevice.value][
            defaultActiveMap.value[curDevice.value]
        ].chartData.time
    // console.log(chartOption)
    myChart = echarts.init(chartDom.value)

    myChart.setOption(chartOption)
})
</script>

<style lang="scss" scoped>
$openMenuColor: rgba(35, 75, 206, 0.6);

div.device-data-container {
    width: 87vw;
    height: 90vh;
    // padding-top: 1vh;
    // padding-bottom: 1vh;
    // margin-left: 0.5vw;
    // padding-right: 0.5vw;

    border-radius: 12px;
    // margin-bottom: 1vh;
    overflow: hidden;
    display: flex;
    flex-flow: column wrap;
    justify-content: space-between;

    // background-color: rgb(233, 247, 255);

    :deep(.border-box-content) {
        overflow: hidden;
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
        row-gap: 1vh;
    }

    div.device-selector {
        // margin-top: 1vh;
        margin-left: 0.5vw;
        height: 88vh;
        width: 12vw;

        background-color: antiquewhite;
        border-radius: 6px;
        overflow: hidden;
        font-weight: bold;

        border: 2px solid;
    }

    div.data-table-container {
        width: 73.5vw;
        height: 43.5vh;

        background-color: #447eca;
    }

    div.data-chart-container {
        width: 73.5vw;
        height: 43.5vh;
        border: 2px solid #000a63;

        // background-color: #4499ca;

        div.chart-box {
            width: 100%;
            height: 100%;
            position: relative;
            top: -4vh;

            background-color: #f1f8ff;
        }

        div.change-button-group {
            width: fit-content;
            height: 4vh;
            position: relative;
            top: 1vh;
            left: 4vw;
            z-index: 8;
            // background-color: #0c0052;

            --el-segmented-item-selected-color: var(--el-text-color-primary);
            --el-segmented-item-selected-bg-color: #ffd100;
            --el-border-radius-base: 8px;

            :deep(.el-segmented) {
                height: 3.5vh;
                --el-segmented-bg-color: #fff;
                border: 2px solid rgb(17, 76, 163);
                font-weight: bold;
                font-size: calc(0.4vw + 0.4vh);
            }
        }
    }
}

:deep(.el-menu) {
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
    letter-spacing: 0.2rem;
    border-right: none;
    text-align: center;
}

:deep(.el-sub-menu__title) {
    font-weight: 600;
    --el-menu-item-font-size: calc(0.7vw + 0.5vh);
    // border-radius: 10px;
}

:deep(.el-menu-item) {
    text-align: center;
    background-color: rgb(222, 240, 255);
    border: 1px solid #447eca;
}

:deep(.el-menu-item.is-active) {
    background-color: rgb(3, 102, 231);
    color: aliceblue;
}

:deep(.el-menu-item.is-disabled) {
    background-color: rgb(151, 151, 151) !important;
    opacity: 1;
    color: #e7f6ff;
    // font-size: calc(0.8vw + 0.6vh);
}

:deep(.el-menu-item.title) {
    background-color: rgb(108, 136, 189) !important;
    opacity: 1;
    color: #e7f6ff;
    font-size: calc(0.8vw + 0.6vh);
}

:deep(.el-table__inner-wrapper::before) {
    background: hsl(210, 70%, 30%);
}

:deep(.el-table__border-left-patch) {
    background: transparent;
}

:deep(.el-table .el-table__cell) {
    border: 1px solid #c0cfff;
}

:deep(.el-table thead th.el-table__cell) {
    color: #032b99;
    background: rgba(161, 194, 255, 0.8);
    font-size: calc(0.6vw + 0.3vh);
    height: 2vh;
    border: 1px solid #1339b8;
    div.cell {
        height: 2vh;
        line-height: 2vh;
    }
}

:deep(.el-table tbody tr) {
    transition: all 0.6s cubic-bezier(0.68, -0.15, 0.265, 1.15);
    height: fit-content;
    div.cell {
        height: fit-content;
        line-height: 2vh;
        font-size: calc(0.6vw + 0.2vh);
        font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
        font-weight: bold;
        color: #044999;
    }
}

:deep(.el-table__body tr:hover td) {
    background: hsl(210, 100%, 16%);
    color: #0c0052;
    font-weight: bold;
}
</style>

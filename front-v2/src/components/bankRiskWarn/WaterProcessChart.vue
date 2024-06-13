<template>
    <div class="water-chart-container">
        <div class="water-chart-title">潮位过程</div>
        <div class="water-chart-content" ref="chartDom"></div>
        <!-- <div class="selector-container">
            <el-select
                v-model="value"
                size="large"
                style="width: 100%"
                @change="selectChange"
            >
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
        </div> -->
        <div class="profile-condition-container">
            <div class="profile-condition-text">
                当前水文条件：{{ props.type }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
    timeStep: Number,
    type: String,
})

const chartDom = ref()

const value = ref('flood')

const options = [
    {
        value: 'flood',
        label: '洪季潮位过程',
    },
    {
        value: 'dry',
        label: '枯季潮位过程',
    },
    // {
    //     value: '20',
    //     label: '20年一遇潮位过程',
    // },
]

const nameMap = {
    // '20': '20年一遇潮位过程',
    dry: '枯季潮位过程',
    flood: '洪季潮位过程',
}

// const hour = [
//     '0',
//     '1',
//     '2',
//     '3',
//     '4',
//     '5',
//     '6',
//     '7',
//     '8',
//     '9',
//     '10',
//     '11',
//     '12',
//     '13',
//     '14',
//     '15',
//     '16',
//     '17',
//     '18',
//     '19',
//     '20',
//     '21',
//     '22',
//     '23',
//     '24',
//     '25',
// ]
const hour = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25
]

// const waterProcessData = {
//     flood: [
//         1.90906518, 1.625544928, 1.361989229, 1.15482551, 1.002231171,
//         1.430845246, 2.648756158, 3.300643076, 3.213302443, 2.918754921,
//         2.497299605, 2.090891478, 1.860660024, 1.618100393, 1.366590593,
//         1.15848487, 1.010662534, 1.412416559, 2.708489015, 3.495843863,
//         3.470899626, 3.164357677, 2.729099025, 2.275285539, 2.016365196,
//         1.75218237,
//     ],
//     dry: [
//         1.186513249, 0.867004195, 0.536603072, 0.213683936, -0.037491099,
//         -0.213509241, 0.053436696, 1.065266977, 1.781537597, 1.742699741,
//         1.390458846, 1.066486912, 0.738369155, 0.440214079, 0.132082845,
//         -0.204865766, -0.41561528, -0.471333948, -0.156295014, 0.955454428,
//         1.977743514, 2.400311668, 2.367541318, 2.274514032, 1.749968685,
//         1.184949338,
//     ],
//     20: [
//         '2.718320324',
//         '2.405213691',
//         '2.129342398',
//         '1.887915706',
//         '1.665092311',
//         '1.420051594',
//         '1.908550187',
//         '3.601622395',
//         '4.454313183',
//         '4.927803446',
//         '4.436033672',
//         '3.936237178',
//         '3.420383312',
//         '2.946323993',
//         '2.602597168',
//         '2.314328424',
//         '2.069559849',
//         '1.844114412',
//         '1.630332015',
//         '2.060659194',
//         '3.28851721',
//         '3.758974053',
//         '3.833966546',
//         '3.415545756',
//         '3.09880555',
//         '2.690577369',
//     ],
// }

const waterProcessData = {
    flood: [
        [0, 1.90906518], [1, 1.625544928], [2, 1.361989229], [3, 1.15482551], [4, 1.002231171],
        [5, 1.430845246], [6, 2.648756158], [7, 3.300643076], [8, 3.213302443], [9, 2.918754921],
        [10, 2.497299605], [11, 2.090891478], [12, 1.860660024], [13, 1.618100393], [14, 1.366590593],
        [15, 1.15848487], [16, 1.010662534], [17, 1.412416559], [18, 2.708489015], [19, 3.495843863],
        [20, 3.470899626], [21, 3.164357677], [22, 2.729099025], [23, 2.275285539], [24, 2.016365196],
        [25, 1.75218237]
    ],
    dry: [
        [0, 1.186513249], [1, 0.867004195], [2, 0.536603072], [3, 0.213683936], [4, -0.037491099],
        [5, -0.213509241], [6, 0.053436696], [7, 1.065266977], [8, 1.781537597], [9, 1.742699741],
        [10, 1.390458846], [11, 1.066486912], [12, 0.738369155], [13, 0.440214079], [14, 0.132082845],
        [15, -0.204865766], [16, -0.41561528], [17, -0.471333948], [18, -0.156295014], [19, 0.955454428],
        [20, 1.977743514], [21, 2.400311668], [22, 2.367541318], [23, 2.274514032], [24, 1.749968685],
        [25, 1.184949338]
    ]
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
        min: -2,
        max: 8,
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
            markPoint: {
                symbol: 'circle',
                symbolSize: 5,
                data: [
                    {
                        name: '最高潮位',
                        type: 'max',
                        itemStyle: {
                            color: 'red',
                            borderColor: 'black',
                            borderWidth: 0.5,
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: () => {
                                    return (
                                        '最高潮位: ' + '3.495' + ' 米'
                                    )
                                },
                                textStyle: {
                                    color: 'black',
                                    fontSize: 13,
                                },
                            },
                        },
                    },
                    {
                        name: '最低潮位',
                        type: 'min',
                        itemStyle: {
                            color: 'rgb(94, 208, 251)',
                            borderColor: 'black',
                            borderWidth: 0.5,
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'bottom',
                                formatter: () => {
                                    return (
                                        '最低潮位: ' + '1.00' + ' 米'
                                    )
                                },
                                textStyle: {
                                    color: 'black',
                                    fontSize: 13,
                                },
                            },
                        },
                    },
                ],
            },
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

watch(
    () => props.type,
    (val) => {
        const dict = {
            洪季: 'flood',
            枯季: 'dry',
        }
        selectChange(dict[val])
    },
)

const selectChange = (val) => {
    option.series[0].data = waterProcessData[val]
    option.series[0].name = nameMap[val]
    maxVal = Math.max(...waterProcessData[val])
    minVal = Math.min(...waterProcessData[val])
    chart.setOption(option)
}

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
        // console.log(newVal, 'inner');

        option.series[0].markLine.data[0].xAxis = parseFloat(newVal)
        option.series[0].markLine.data[0].label.formatter = `${parseFloat(newVal)}小时`
        chart.setOption(option)
    },
)

// setInterval(() => {
//     option.series[0].markLine.data[0].xAxis = Math.floor(Math.random() * 24);
//     chart.setOption(option);
// }, 1000);
</script>

<style lang="scss" scoped>
div.water-chart-container {
    position: absolute;
    width: 100%;
    height: 100%;

    background-color: aliceblue;
    border-radius: 4px;
    box-shadow: 12px 12px 20px -10px rgba(0, 0, 0, 0.8);
    overflow: hidden;

    div.water-chart-title {
        height: 4vh;
        line-height: 4vh;
        padding-left: 1vw;
        font-size: calc(0.6vw + 0.6vh);
        font-weight: bold;

        box-shadow: 0px 3px rgb(49, 121, 255);
        color: rgb(0, 138, 218);
    }

    div.water-chart-content {
        height: calc(100% - 4.5vh);
        margin-top: 0.5vh;
        width: 100%;

        background-color: rgb(208, 236, 255);
    }

    div.profile-condition-container {
        position: absolute;
        width: 7.2vw;
        height: 3vh;
        left: 17vw;
        top: 0.5vh;
        background-color: rgba(208, 236, 255, 1);
        border-radius: 4px;

        div.profile-condition-text {
            position: absolute;
            left: 0.4vw;
            top: 0.6vh;
            width: 8vw;
            height: 2vh;
            font-size: calc(0.6vh + 0.4vw);
            font-weight: 600;
            font-family: 'Microsoft YaHei';
        }
    }

    div.selector-container {
        position: absolute;
        top: 0.2vh;
        right: 1vw;
        width: 30%;

        :deep(.el-select) {
            width: 100% !important;
            // height: 3.3vh;
            box-shadow:
                rgba(0, 132, 255, 0.8) 1px 1px,
                rgba(0, 119, 255, 0.7) 2px 2px,
                rgba(0, 119, 255, 0.6) 3px 4px;
            border-radius: 4px;
        }

        :deep(.el-select__wrapper) {
            // height: 3.3vh;
            // line-height: 3.3vh;
            border-radius: 4px;
            font-family: 'Microsoft YaHei';
            font-weight: bold;
            font-size: calc(0.4vw + 0.3vh);
            background-color: #e6f7ff;
        }

        :deep(.el-select__placeholder) {
            color: #738ab6;
        }

        :deep(.el-select__tags-text) {
            color: #2b61f7;
            font-size: calc(0.4vw + 0.2vh);
        }
    }
}
</style>

<template>
    <div class="water-chart-container">
        <div class="water-chart-title">潮位过程</div>
        <div class="water-chart-content" ref="chartDom"></div>
        <div class="selector-container">
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
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

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
    {
        value: '20',
        label: '20年一遇潮位过程',
    },
]

const nameMap = {
    '20': '20年一遇潮位过程',
    'dry': '枯季潮位过程',
    'flood': '洪季潮位过程'
}

const hour = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
]

const waterProcessData = {
    flood: [
        '1.687756028',
        '1.403791161',
        '1.153940074',
        '0.92732185',
        '0.826905988',
        '1.583252162',
        '2.747398922',
        '3.221304463',
        '3.180745574',
        '2.743348652',
        '2.264949734',
        '1.89491576',
        '1.658672306',
        '1.39994264',
        '1.160212943',
        '0.939572993',
        '0.836240868',
        '1.557370359',
        '2.845002378',
        '3.421596391',
        '3.44471478',
        '3.000204964',
        '2.496461676',
        '2.072330987',
        '1.81079441',
        '1.531233169',
    ],
    dry: [
        '1.106195237',
        '0.706215671',
        '0.358130906',
        '0.055177195',
        '-0.208548689',
        '-0.333371308',
        '0.171433644',
        '1.216706321',
        '1.767564546',
        '1.751372008',
        '1.319272777',
        '0.92601579',
        '0.60374053',
        '0.28991355',
        '-0.050594428',
        '-0.380382074',
        '-0.549582882',
        '-0.552715338',
        '-0.046699077',
        '1.166519982',
        '2.024183722',
        '2.428786547',
        '2.384532782',
        '2.170962186',
        '1.605904582',
        '1.100772415',
    ],
    20: [
        '2.718320324',
        '2.405213691',
        '2.129342398',
        '1.887915706',
        '1.665092311',
        '1.420051594',
        '1.908550187',
        '3.601622395',
        '4.454313183',
        '4.927803446',
        '4.436033672',
        '3.936237178',
        '3.420383312',
        '2.946323993',
        '2.602597168',
        '2.314328424',
        '2.069559849',
        '1.844114412',
        '1.630332015',
        '2.060659194',
        '3.28851721',
        '3.758974053',
        '3.833966546',
        '3.415545756',
        '3.09880555',
        '2.690577369',
    ],
}

const option = {
    tooltip: {
        trigger: 'axis',
    },
    xAxis: {
        data: hour,
        boundaryGap: false,
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
                                    return "最高潮位: " + maxVal.toFixed(3)  + ' 米';
                                },
                                textStyle: {
                                    color: 'black',
                                    fontSize: 13
                                }
                            }
                        }
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
                                    return "最低潮位: " + minVal.toFixed(3)  + ' 米';
                                },
                                textStyle: {
                                    color: 'black',
                                    fontSize: 13
                                }
                            }
                        }
                    }
                ]
            },
            type: 'line',
            smooth: true,
            data: waterProcessData['20'],
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

const selectChange = (val) => {
    option.series[0].data = waterProcessData[val]
    option.series[0].name = nameMap[val]
    maxVal = Math.max(...waterProcessData[val]);
    minVal = Math.min(...waterProcessData[val]);
    chart.setOption(option)
}

onMounted(() => {
    chart = echarts.init(chartDom.value)
    maxVal = Math.max(...waterProcessData['20']);
    minVal = Math.min(...waterProcessData['20']);
    chart.setOption(option)
})
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

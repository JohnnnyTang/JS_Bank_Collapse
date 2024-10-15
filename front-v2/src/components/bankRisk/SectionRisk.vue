<template>
    <div class="stable-length-container">
        <div class="stable-length-title">断面风险专题对比</div>
        <div class="stable-length-content" v-loading="lengthChartLoading">
            <div class="section-selectior-item">
                <el-select
                    v-model="value"
                    placeholder="选择专题"
                    style="width: 10vw; height: 3.5vh"
                    @change="sectionSelectChange"
                    multiple
                >
                    <el-option
                        v-for="item in scenceList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                        <span style="float: left" class="section-name-text">{{
                            item.place
                        }}</span>
                        <span style="float: right" class="section-class-text">{{
                            item.year
                        }}</span>
                    </el-option>
                </el-select>
            </div>
            <div class="length-chart-container" ref="chartDom"></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const value = ref('')
const chartDom = ref()
const lengthChartLoading = ref(false)

let option = {
    grid: {
        containLabel: true,
        top: '8%',
        bottom: '2%',
        left: '3%',
        right: '1%',
    },
    legend: {
        textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: 'rgb(77, 82, 246)',
        },
    },
    tooltip: {},
    dataset: {
        source: [
            ['状态', '民主沙2019', '民主沙2023'],
            ['较稳定', 0, 0],
            ['稳定', 0, 0],
            ['不稳定', 3431, 2616],
            ['较不稳定', 3857, 4672],
        ],
    },
    xAxis: {
        type: 'category',
        axisLabel: {
            fontSize: 16,
            fontWeight: 'bold',
            color: 'rgb(37, 72, 146)',
        },
    },
    yAxis: {
        axisLabel: {
            fontSize: 14,
            fontWeight: 'bold',
            color: 'rgb(37, 72, 146)',
            fontFamily: 'Cambria',
        },
    },
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
    ],
}

let aChart = null

let oneSeries = {
    type: 'bar',
    label: {
        show: true,
        fontSize: 14,
        fontWeight: 'bold',
        formatter: '{@[1]}m',
    },
    color: ['rgb(22, 114, 201)'],
}

let twoSeries = {
    type: 'bar',
    label: {
        show: true,
        fontSize: 14,
        fontWeight: 'bold',
        formatter: '{@[2]}m',
    },
    color: ['rgb(133, 195, 247)'],
}

const sectionSelectChange = (val) => {
    console.log('multi', val)
    if (val.length == 2) {
        lengthChartLoading.value = true
        setTimeout(() => {
            option.series = [oneSeries, twoSeries]
            aChart.setOption(option)
            lengthChartLoading.value = false
        }, 1000)
    } else if(val[0] == 'mzs2019') {
        // console.log(111)
        lengthChartLoading.value = true
        setTimeout(() => {
            option.series = [oneSeries]
            aChart.setOption(option)
            console.log('00', option)
            lengthChartLoading.value = false
        }, 1000)
    } else if(val[0] == 'mzs2023') {
        // console.log(111)
        lengthChartLoading.value = true
        setTimeout(() => {
            option.series = [twoSeries]
            aChart.setOption(option)
            lengthChartLoading.value = false
        }, 1000)
    }
}

const scenceList = ref([
    { value: 'mzs2019', label: '民主沙2019', year: '2019', place: '民主沙' },
    { value: 'mzs2023', label: '民主沙2023', year: '2023', place: '民主沙' },
])

onMounted(() => {
    // setTimeout(() => {
    //     lengthChartLoading.value = false
    // }, 1500)
    aChart = echarts.init(chartDom.value)
    aChart.setOption(option)
})
</script>

<style lang="scss" scoped>
div.stable-length-container {
    position: absolute;
    right: 1vw;
    top: 14vh;

    height: 36vh;
    width: 20vw;
    border: rgb(23, 95, 163) 2px solid;

    background-color: rgba(37, 72, 146, 0.671);
    background-color: rgba(184, 226, 253, 0.671);
    backdrop-filter: blur(8px);

    border-radius: 12px;
    overflow: hidden;
    // box-shadow: 6px 8px 10px -4px rgb(133, 195, 247);
    box-shadow: 6px 8px 10px -4px rgb(11, 70, 146);

    div.stable-length-title {
        height: 4vh;
        width: 20vw;

        text-align: center;
        line-height: 4vh;

        font-size: calc(0.8vw + 0.8vh);
        font-weight: bold;
        text-align: center;
        letter-spacing: 0.3rem;

        color: rgb(22, 114, 201);
        text-shadow:
            #c7dcec 1px 1px,
            #c7dcec 2px 2px,
            #6493ff 3px 3px;
        border-bottom: 2px solid;
    }

    div.stable-length-content {
        height: calc(32vh - 2px);
        width: 20vw;

        // background-color: #738ab6;

        div.section-selectior-item {
            width: 20vw;
            height: 3.3vh;

            line-height: 3.3vh;
            text-align: center;

            // background-color: #eef3ff;
            :deep(.el-select) {
                width: 14vw !important;
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
            :deep(.el-select__tags-text) {
                color: #2b61f7;
                font-size: calc(0.4vw + 0.2vh);
            }
        }

        div.length-chart-container {
            margin-top: 0.5vh;
            height: 28vh;
            width: 20vw;

            // background-color: #6493ff;
        }
    }
}
</style>

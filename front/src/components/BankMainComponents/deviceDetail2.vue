<template>
    <div class="monitorDeviceDetail">
        <div class="text large title">{{ deviceInfo.name }}</div>
        <div class="text">仪器编号：{{ deviceInfo.code }}</div>
        <div class="text">测量周期：{{ deviceInfo.begTime }} -- {{ deviceInfo.endTime }}</div>
        <div class="text">海拔：{{ deviceInfo.elevation }}</div>
        <div class="text">站点编号：{{ deviceInfo.stationCode }}</div>
        <el-button type="primary" @click="showC1">{{ nameMap[deviceInfo.type][0] }}</el-button>
        <el-button type="primary" @click="showC2" v-if="deviceInfo.type === '2' || deviceInfo.type === '4'">{{nameMap[deviceInfo.type][1] }}</el-button>

        <div class="chart" id="chart" v-if="showChart1" ref="chart1DOM"></div>
    </div>
</template>
  
<script setup>
import { onMounted, ref, onBeforeMount, watch } from 'vue';
import BackEndRequest from "../../api/backendIns"
import * as echarts from 'echarts'

const showChart1 = ref(false)
const chart1DOM = ref()

const nameMap = ref({
    '1': ['GNSS', ''],
    '2': ['水平偏移图表', '垂向偏移图表'],
    '3': ['水压力图表', ''],
    '4': ['水平受力图表', '垂向受力图表']
})

const props = defineProps({
    deviceInfo: {
        type: Object,
        default: {},
    },
})

let myChart;
let myDom
let myOptions = new Array(2);
let chartBeshowed

watch(chart1DOM, async (val) => {
    if (val) {
        myDom = val
        myChart = echarts.init(val)
        myChart.showLoading()
        await chartDataProcess(props.deviceInfo.code, props.deviceInfo.type, chartBeshowed)
    } else {
        myChart && myChart.clear()
    }
})

const showC1 = async () => {
    showChart1.value = true;
    chartBeshowed = 0;
    if (myChart) {
        myChart.showLoading()
        await chartDataProcess(props.deviceInfo.code, props.deviceInfo.type, chartBeshowed)
    }
}
const showC2 = async () => {
    showChart1.value = true;
    chartBeshowed = 1;
    if (myChart) {
        myChart.showLoading()
        await chartDataProcess(props.deviceInfo.code, props.deviceInfo.type, chartBeshowed)
    }
}

watch(props,(val)=>{
    myChart&&myChart.clear()
})


const chartDataProcess = async (deviceID, deviceType, chartID) => {
    switch (deviceType) {
        case '1':
            {
                myOptions = await type1process(deviceID, deviceType)
                myChart && myChart.hideLoading()
                myChart && myChart.clear()
                break;
            }
        case '2': {

            myOptions = await type2process(deviceID, deviceType)
            myChart && myChart.hideLoading()
            myChart && myChart.clear()
            myChart && myChart.setOption(myOptions[chartID]);
            break;
        }
        case '3': {

            myChart && myChart.clear()
            var option = await type3process(deviceID, deviceType);
            myChart && myChart.hideLoading()
            myChart && myChart.setOption(option);
            break;
        }
        case '4': {

            myChart && myChart.clear()
            myOptions = await type4process(deviceID, deviceType)
            myChart && myChart.hideLoading()
            myChart && myChart.setOption(myOptions[chartID]);
            break;
        }
    }

}

const type1process = async (id, type) => {
    let deviceDetail = (await BackEndRequest.getMonitorDetailByType_Code(id, type)).data
    let monitorInfo = (await BackEndRequest.getMonitorInfoByType_Code(id, type)).data

    console.log('GNSS deviceDetail', deviceDetail);
    console.log('GNSS monitorInfo', monitorInfo);
    // var optionX
    // var optionY
    // let pointNum = monitorInfo.pointNum
    // let pointDepthArr = [];
    // let i = 1
    // while (i <= pointNum) {
    //     pointDepthArr.push(monitorInfo[`point${i}Depth`])
    //     i++;
    // }
    // let defaultColor = ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00', '#FF0000']
    // let color = []
    // let legendData = []
    // for (let i = 0; i < pointNum; i++) {
    //     legendData.push(pointDepthArr[i] + 'm')
    //     color.push(defaultColor[i])
    // }


    // let fieldmap = new Map()
    // fieldmap.set(0, ['XMove1', 'YMove1'])
    // fieldmap.set(1, ['XMove2', 'YMove2'])
    // fieldmap.set(2, ['XMove3', 'YMove3'])
    // fieldmap.set(3, ['XMove4', 'YMove4'])
    // fieldmap.set(4, ['XMove5', 'YMove5'])
    // fieldmap.set(5, ['XMove6', 'YMove6'])



    // let seriesArr4XMOVE = []
    // let seriesArr4YMOVE = []

    // for (let i = 0; i < pointNum; i++) {

    //     let seriesData4XMVOE = []
    //     let seriesData4YMVOE = []
    //     deviceDetail.forEach((item) => {
    //         seriesData4XMVOE.push(item[(fieldmap.get(i)[0])])
    //         seriesData4YMVOE.push(item[(fieldmap.get(i)[1])])
    //     })

    //     let seriestItem4X = {
    //         name: legendData[i],
    //         type: 'line',
    //         stack: 'Total',
    //         smooth: true,
    //         lineStyle: {
    //             width: 2,
    //             color: color[i]
    //         },
    //         showSymbol: false,
    //         emphasis: {
    //             focus: 'series'
    //         },
    //         data: seriesData4XMVOE
    //     }
    //     seriesArr4XMOVE.push(seriestItem4X)

    //     let seriestItem4Y = {
    //         name: legendData[i],
    //         type: 'line',
    //         stack: 'Total',
    //         smooth: true,
    //         lineStyle: {
    //             width: 2,
    //             color: color[i]
    //         },
    //         showSymbol: false,
    //         emphasis: {
    //             focus: 'series'
    //         },
    //         data: seriesData4YMVOE
    //     }
    //     seriesArr4YMOVE.push(seriestItem4Y)

    // }

    // let xAxisData4XY = []
    // deviceDetail.forEach((item) => {
    //     xAxisData4XY.push(item["measureTime"])
    // })
    // optionX = {
    //     color: color,
    //     title: {
    //         text: '测斜仪XMove',
    //         textStyle: {
    //             color: '#FFFFFF',
    //             fontSize: 15
    //         }
    //     },

    //     tooltip: {
    //         trigger: 'axis',
    //         axisPointer: {
    //             type: 'cross',
    //             label: {
    //                 backgroundColor: '#6a7985'
    //             }
    //         }
    //     },
    //     legend: {
    //         data: legendData,
    //         textStyle: {
    //             color: '#FFFFFF',
    //             fontSize: 8
    //         }
    //     },
    //     grid: {
    //         // left: '0%',
    //         // right: '4%',
    //         // bottom: '3%',
    //         containLabel: true
    //     },
    //     xAxis: [
    //         {
    //             type: 'category',
    //             boundaryGap: false,
    //             axisLabel: {
    //                 color: '#FFFFFF',
    //                 interval: xAxisData4XY.length - 2,
    //                 fontSize: 10
    //                 // padding: [0, 50, 0, 0]
    //             },
    //             data: xAxisData4XY,

    //         }
    //     ],
    //     dataZoom: [
    //         {
    //             start: 0,
    //             end: 20
    //         }
    //     ],
    //     yAxis: [
    //         {
    //             type: 'value',
    //             axisLabel: {
    //                 color: '#FFFFFF',
    //             }
    //         }
    //     ],
    //     series: seriesArr4XMOVE
    // };
    // optionY = {
    //     color: color,
    //     title: {
    //         text: '测斜仪YMove',
    //         textStyle: {
    //             color: '#FFFFFF',
    //             fontSize: 15
    //         }
    //     },

    //     tooltip: {
    //         trigger: 'axis',
    //         axisPointer: {
    //             type: 'cross',
    //             label: {
    //                 backgroundColor: '#6a7985'
    //             }
    //         }
    //     },
    //     legend: {
    //         data: legendData,
    //         textStyle: {
    //             color: '#FFFFFF',
    //             fontSize: 8
    //         }
    //     },
    //     grid: {
    //         // left: '0%',
    //         // right: '4%',
    //         // bottom: '3%',
    //         containLabel: true
    //     },
    //     xAxis: [
    //         {
    //             type: 'category',
    //             boundaryGap: false,
    //             axisLabel: {
    //                 color: '#FFFFFF',
    //                 interval: xAxisData4XY.length - 2,
    //                 fontSize: 10
    //                 // padding: [0, 50, 0, 0]
    //             },
    //             data: xAxisData4XY,

    //         }
    //     ],
    //     dataZoom: [
    //         {
    //             start: 0,
    //             end: 20
    //         }
    //     ],
    //     yAxis: [
    //         {
    //             type: 'value',
    //             axisLabel: {
    //                 color: '#FFFFFF',
    //             }
    //         }
    //     ],
    //     series: seriesArr4YMOVE
    // };
    // return [optionX, optionY]
}


const type2process = async (id, type) => {
    let deviceDetail = (await BackEndRequest.getMonitorDetailByType_Code(id, type)).data
    let monitorInfo = (await BackEndRequest.getMonitorInfoByType_Code(id, type)).data

    var optionX
    var optionY
    let pointNum = monitorInfo.pointNum
    let pointDepthArr = [];
    let i = 1
    while (i <= pointNum) {
        pointDepthArr.push(monitorInfo[`point${i}Depth`])
        i++;
    }
    let defaultColor = ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00', '#FF0000']
    let color = []
    let legendData = []
    for (let i = 0; i < pointNum; i++) {
        legendData.push(pointDepthArr[i] + 'm')
        color.push(defaultColor[i])
    }


    let fieldmap = new Map()
    fieldmap.set(0, ['XMove1', 'YMove1'])
    fieldmap.set(1, ['XMove2', 'YMove2'])
    fieldmap.set(2, ['XMove3', 'YMove3'])
    fieldmap.set(3, ['XMove4', 'YMove4'])
    fieldmap.set(4, ['XMove5', 'YMove5'])
    fieldmap.set(5, ['XMove6', 'YMove6'])



    let seriesArr4XMOVE = []
    let seriesArr4YMOVE = []

    for (let i = 0; i < pointNum; i++) {

        let seriesData4XMVOE = []
        let seriesData4YMVOE = []
        deviceDetail.forEach((item) => {
            seriesData4XMVOE.push(item[(fieldmap.get(i)[0])])
            seriesData4YMVOE.push(item[(fieldmap.get(i)[1])])
        })

        let seriestItem4X = {
            name: legendData[i],
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
                width: 2,
                color: color[i]
            },
            showSymbol: false,
            emphasis: {
                focus: 'series'
            },
            data: seriesData4XMVOE
        }
        seriesArr4XMOVE.push(seriestItem4X)

        let seriestItem4Y = {
            name: legendData[i],
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
                width: 2,
                color: color[i]
            },
            showSymbol: false,
            emphasis: {
                focus: 'series'
            },
            data: seriesData4YMVOE
        }
        seriesArr4YMOVE.push(seriestItem4Y)

    }

    let xAxisData4XY = []
    deviceDetail.forEach((item) => {
        xAxisData4XY.push(item["measureTime"])
    })
    optionX = {
        color: color,
        title: {
            text: '测斜仪XMove',
            textStyle: {
                color: '#FFFFFF',
                fontSize: 15
            }
        },

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: legendData,
            textStyle: {
                color: '#FFFFFF',
                fontSize: 8
            }
        },
        grid: {
            // left: '0%',
            // right: '4%',
            // bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    color: '#FFFFFF',
                    interval: xAxisData4XY.length - 2,
                    fontSize: 10
                    // padding: [0, 50, 0, 0]
                },
                data: xAxisData4XY,

            }
        ],
        dataZoom: [
            {
                start: 0,
                end: 20
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    color: '#FFFFFF',
                }
            }
        ],
        series: seriesArr4XMOVE
    };
    optionY = {
        color: color,
        title: {
            text: '测斜仪YMove',
            textStyle: {
                color: '#FFFFFF',
                fontSize: 15
            }
        },

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: legendData,
            textStyle: {
                color: '#FFFFFF',
                fontSize: 8
            }
        },
        grid: {
            // left: '0%',
            // right: '4%',
            // bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    color: '#FFFFFF',
                    interval: xAxisData4XY.length - 2,
                    fontSize: 10
                    // padding: [0, 50, 0, 0]
                },
                data: xAxisData4XY,

            }
        ],
        dataZoom: [
            {
                start: 0,
                end: 20
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    color: '#FFFFFF',
                }
            }
        ],
        series: seriesArr4YMOVE
    };
    return [optionX, optionY]
}

const type3process = async (id, type) => {
    //水压力
    let deviceDetail = (await BackEndRequest.getMonitorDetailByType_Code(id, type)).data
    let monitorInfo = (await BackEndRequest.getMonitorInfoByType_Code(id, type)).data

    let pointNum = monitorInfo.pointNum
    let pointDepthArr = [];
    let i = 1
    while (i <= pointNum) {
        pointDepthArr.push(monitorInfo[`point${i}Depth`])
        i++;
    }
    let defaultColor = ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00', '#FF0000']
    let color = []
    let legendData = []
    for (let i = 0; i < pointNum; i++) {
        legendData.push(pointDepthArr[i] + 'm')
        color.push(defaultColor[i])
    }

    let fieldmap = new Map()
    fieldmap.set(0, 'pressure1')
    fieldmap.set(1, 'pressure2')
    fieldmap.set(2, 'pressure3')
    fieldmap.set(3, 'pressure4')
    fieldmap.set(4, 'pressure5')
    fieldmap.set(5, 'pressure6')

    let seriesArr = []
    for (let i = 0; i < pointNum; i++) {

        let seriesData = []
        deviceDetail.forEach((item) => {
            seriesData.push(item[fieldmap.get(i)])
        })

        let seriestItem = {
            name: legendData[i],
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
                width: 2,
                color: color[i]
            },
            showSymbol: false,
            emphasis: {
                focus: 'series'
            },
            data: seriesData
        }
        seriesArr.push(seriestItem)
    }

    let xAxisData = []
    deviceDetail.forEach((item) => {
        xAxisData.push(item["measureTime"])
    })
    let option = {
        color: color,
        title: {
            text: '孔隙水压力',
            textStyle: {
                color: '#FFFFFF',
                fontSize: 15
            },
            left: '5%'
        },

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            backgroundColor: 'rgba(50,50,50,0.7)'
        },
        legend: {
            data: legendData,
            textStyle: {
                color: '#FFFFFF',
                fontSize: 8
            },
            left: '40%'
        },
        grid: {
            top: '13%',
            // left: '0%',
            right: '15%',
            // bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    color: '#FFFFFF',
                    interval: xAxisData.length - 2,
                    fontSize: 8
                    // padding: [0, 50, 0, 0]
                },
                data: xAxisData,

            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    color: '#FFFFFF',
                    fontSize: 8
                }
            }
        ],
        series: seriesArr
    };
    return option
}

const type4process = async (id, type) => {

    let deviceDetail = (await BackEndRequest.getMonitorDetailByType_Code(id, type)).data
    let monitorInfo = (await BackEndRequest.getMonitorInfoByType_Code(id, type)).data

    var optionX // hori
    var optionY // vert
    let pointNum = monitorInfo.pointNum
    let pointDepthArr = [];
    let i = 1
    while (i <= pointNum) {
        pointDepthArr.push(monitorInfo[`point${i}Depth`])
        i++;
    }

    let legendData = []
    let defaultColor = ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00', '#FF0000']
    let color = []
    for (let i = 0; i < pointNum; i++) {
        legendData.push(pointDepthArr[i] + 'm')
        color.push(defaultColor[i])
    }


    let fieldmap = new Map()
    fieldmap.set(0, ['horizontal_stress1', 'vertical_stress1'])
    fieldmap.set(1, ['horizontal_stress2', 'vertical_stress2'])
    fieldmap.set(2, ['horizontal_stress3', 'vertical_stress3'])
    fieldmap.set(3, ['horizontal_stress4', 'vertical_stress4'])
    fieldmap.set(4, ['horizontal_stress5', 'vertical_stress5'])
    fieldmap.set(5, ['horizontal_stress6', 'vertical_stress6'])


    let seriesArr4XMOVE = []
    let seriesArr4YMOVE = []

    let xAxisData4XY = []
    deviceDetail.forEach((item) => {
        xAxisData4XY.push(item["measureTime"])
    })

    for (let i = 0; i < pointNum; i++) {

        let seriesData4XMVOE = []
        let seriesData4YMVOE = []
        deviceDetail.forEach((item) => {
            seriesData4XMVOE.push(item[(fieldmap.get(i)[0])])
            seriesData4YMVOE.push(item[(fieldmap.get(i)[1])])
        })

        let seriestItem4X = {
            name: legendData[i],
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
                width: 2,
                color: color[i]
            },
            showSymbol: false,
            emphasis: {
                focus: 'series'
            },
            data: seriesData4XMVOE
        }
        seriesArr4XMOVE.push(seriestItem4X)

        let seriestItem4Y = {
            name: legendData[i],
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
                width: 2,
                color: color[i]
            },
            showSymbol: false,
            emphasis: {
                focus: 'series'
            },
            data: seriesData4YMVOE
        }
        seriesArr4YMOVE.push(seriestItem4Y)

    }


    optionX = {
        color: color,
        title: {
            text: '应力桩水平压力',
            textStyle: {
                color: '#FFFFFF',
                fontSize: 15
            },
            left: 50,
            top: 20,
        },

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: legendData,
            textStyle: {
                color: '#FFFFFF',
                fontSize: 8
            },
            itemWidth: 5,
            left: 200
        },
        grid: {
            // left: '0%',
            // right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    color: '#FFFFFF',
                    interval: xAxisData4XY.length - 2,
                    fontSize: 10
                    // padding: [0, 50, 0, 0]
                },
                data: xAxisData4XY,

            }
        ],
        dataZoom: [
            {
                start: 0,
                end: 20
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    color: '#FFFFFF',
                }
            }
        ],
        series: seriesArr4XMOVE
    };
    optionY = {
        color: color,
        title: {
            text: '应力桩垂向压力',
            textStyle: {
                color: '#FFFFFF',
                fontSize: 15
            },
            left: 50
        },

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: legendData,
            textStyle: {
                color: '#FFFFFF',
                fontSize: 8
            },
            left: 200
        },
        grid: {

            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    color: '#FFFFFF',
                    interval: xAxisData4XY.length - 2,
                    fontSize: 10
                    // padding: [0, 50, 0, 0]
                },
                data: xAxisData4XY,

            }
        ],
        dataZoom: [
            {
                start: 0,
                end: 20
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    color: '#FFFFFF',
                }
            }
        ],
        series: seriesArr4YMOVE
    };
    return [optionX, optionY]
}


onBeforeMount(async () => {

})




onMounted(async () => {


})







</script>
  
<style lang="scss" scoped>
.monitorDeviceDetail {
    width: 30vw;
    height: 60vh;
    background: linear-gradient(#81b5d38f, #848ef8a8);

    .text {
        font-size: 2vh;
        display: flex;
        padding: 1vh;
    }

    .large {
        font-size: larger;
        font-weight: bolder;
    }

    .title {
        text-align: center;
    }

    .medium {
        font-size: medium;
    }

    .small {
        font-size: small;
    }

    .chart {
        width: 370px;
        height: 230px;
        background-color: rgba(65, 110, 155, 0.911);
    }
}
</style>
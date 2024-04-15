<template>
    <div class="device-data-container">
        <dv-border-box12 backgroundColor="rgb(233, 247, 255)">
            <div class="device-selector">
                <el-scrollbar>
                    <el-menu
                        :default-active="deviceList[0]"
                        class="el-menu-vertical-demo"
                    >
                        <el-menu-item disabled>
                            <span>选择设备</span>
                        </el-menu-item>
                        <el-menu-item
                            :index="device"
                            v-for="(device, index) in deviceList"
                            :key="index"
                        >
                            <span>{{ device }}</span>
                        </el-menu-item>
                    </el-menu>
                </el-scrollbar>
            </div>
            <div class="data-table-container">
                <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%"
                    height="43.5vh"
                >
                    <el-table-column
                        v-for="(key, index) in tableKeyList"
                        :key="index"
                        :prop="key.name"
                        :label="key.label"
                    />
                </el-table>
            </div>
            <div class="data-chart-container">
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

const chartDom = ref()

const deviceList = ref([
    'JZ01',
    'JZ02',
    'JZ03',
    'CL04',
    'CL05',
    'CL06',
    'CL07',
    'CL08',
    'CL09',
    'CL10',
    'CL11',
    'CL12',
    'CL13',
])

const tableKeyList = ref([
    { name: 'date', label: '数据' },
    { name: 'name', label: '名称' },
    { name: 'address', label: '地址' },
])

const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-08',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-06',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-07',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-07',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-07',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-07',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-07',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-07',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-07',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-07',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-07',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
]

const chartOption = {
    tooltip: {
        trigger: 'axis',
    },
    grid: {
        left: '2%',
        right: '10%',
        bottom: '10%',
        top:'4%',
        containLabel: true
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
            startValue: '2014-06-01',
        },
        {
            type: 'inside',
        },
    ],
    visualMap: {
        top: "7%",
        right: "0%",
        pieces: [
            {
                gt: 0,
                lte: 50,
                color: '#93CE07',
            },
            {
                gt: 50,
                lte: 100,
                color: '#FBDB0F',
            },
            {
                gt: 100,
                lte: 150,
                color: '#FC7D02',
            },
            {
                gt: 150,
                lte: 200,
                color: '#FD0100',
            },
            {
                gt: 200,
                lte: 300,
                color: '#AA069F',
            },
            {
                gt: 300,
                color: '#AC3B2A',
            },
        ],
        outOfRange: {
            color: '#999',
        },
    },
    series: {
        name: 'Beijing AQI',
        type: 'line',
        // data: data.map(function (item) {
        //   return item[1];
        // }),
        markLine: {
            silent: true,
            lineStyle: {
                // color: '#333',
                width: 2,
                opacity: 0.75
            },
            data: [
                {
                    yAxis: 50,
                    lineStyle: {
                        color: '#93CE07',
                        
                    }
                },
                {
                    yAxis: 100,
                    lineStyle: {
                        color: '#FBDB0F',
                    }
                },
                {
                    yAxis: 150,
                    lineStyle: {
                        color: '#FC7D02',
                    }
                },
                {
                    yAxis: 200,
                    lineStyle: {
                        color: '#FD0100',
                    }
                },
                {
                    yAxis: 300,
                    lineStyle: {
                        color: '#AA069F',
                    }
                },
            ],
        },
    },
}

onMounted(async () => {
    const myChart = echarts.init(chartDom.value)

    const data = (
        await axios.get(
            '/testData.json',
        )
    ).data
    console.log(data)
    chartOption.xAxis.data = data.map(function (item) {
        return item[0]
    })
    chartOption.series.data = data.map(function (item) {
        return item[1]
    })

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

            background-color: #f1f8ff;
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
        color: #1666c2;
    }
}

:deep(.el-table__body tr:hover td) {
    background: hsl(210, 100%, 16%);
    color: #0c0052;
    font-weight: bold;
}
</style>

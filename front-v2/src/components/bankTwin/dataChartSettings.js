let gnssOption = {
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
    yAxis: {
        scale: true,
        min: 0,
        max: 60,
        name: '土体表面累积位移(mm)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 16,
            align: 'left',
            verticalAlign: 'top',
            fontWeight: 'bold',
        },
    },
    // toolbox: {
    //     right: 10,
    //     feature: {
    //         dataZoom: {
    //             yAxisIndex: 'none',
    //         },
    //         restore: {},
    //         saveAsImage: {},
    //     },
    // },
    dataZoom: [
        {
            type: 'inside',
        },
        {
            type: 'slider',
        },
    ],
    backgroundColor: 'rgba(255,255,255,1)',
    visualMap: [
        {
            top: '4%',
            right: '2%',
            itemHeight: '20',
            itemWidth: '28',
            seriesIndex: 2,
            pieces: [
                {
                    gt: 0,
                    lte: 35,
                    color: '#45BF55',
                },
                {
                    gt: 35,
                    lte: 50,
                    color: '#FF8E00',
                },
                {
                    gt: 50,
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
            itemGap: 20,
            textStyle: {
                fontFamily: 'Times',
                fontWeight: 'bold',
            },
        },
        {
            show: false,
            seriesIndex: 1,
            pieces: [
                {
                    gt: 35,
                    lte: 50,
                    color: '#FF8E00',
                },
                {
                    gt: 50,
                    color: '#FD0100',
                },
            ],
            outOfRange: {
                color: 'rgb(133,133,133)',
            },
        },
    ],
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
                        yAxis: 35,
                        lineStyle: {
                            color: '#FF8E00',
                            width: 3,
                        },
                    },
                    {
                        yAxis: 50,
                        lineStyle: {
                            color: '#FD0100',
                            width: 3,
                        },
                    },
                ],
            },
        },
        {},
        {},
        {},
        {},
    ],
}

const genGnssOptionOfDevice = (deviceDataList, halfError) => {
    gnssOption.xAxis.data = []
    let gnssDataInterval = [[], [], [], []]
    deviceDataList.map(function (item) {
        gnssOption.xAxis.data.push(
            item['measureTime'] ? item['measureTime'].replace(' ', '\n') : null,
        )
        gnssDataInterval[0].push(
            item['threeD'] ? +item['threeD'].toFixed(2) : null,
        )
        gnssDataInterval[1].push(item['movingAvg'] ? item['movingAvg'] : null)
        gnssDataInterval[2].push(
            item['movingAvg']
                ? +(item['movingAvg'] - halfError).toFixed(2)
                : null,
        )
        gnssDataInterval[3].push(halfError * 2)
    })
    gnssOption.series[1] = {
        name: '累积位移',
        type: 'scatter',
        data: gnssDataInterval[0],
        symbolSize: 7,
        itemStyle: {
            color: 'rgb(133,133,133)',
            opacity: 0.4,
        },
    }
    gnssOption.series[2] = {
        name: '累积位移滑动平均',
        type: 'line',
        data: gnssDataInterval[1],
        lineStyle: {
            opacity: 1,
            width: 4,
        },
    }
    gnssOption.series[3] = {
        name: '累积位移滑动误差区间下限',
        type: 'line',
        stack: 'error',
        lineStyle: {
            color: '#38D0F2',
            opacity: 0.4,
        },
        itemStyle: {
            color: '#38D0F2',
            borderColor: '#38D0F2',
            opacity: 0.4,
        },
        symbol: 'none',
        tooltip: {
            formatter: '累积位移滑动误差区间±5mm',
        },
        data: gnssDataInterval[2],
    }
    gnssOption.series[4] = {
        name: '累积位移误差区间',
        type: 'line',
        stack: 'error',
        areaStyle: {
            color: '#A7C5C5',
            opacity: 0.2,
        },
        lineStyle: {
            color: '#38D0F2',
            opacity: 0.4,
        },
        symbol: 'none',
        data: gnssDataInterval[3],
    }
    return gnssOption
}

let stressOption = {
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
    legend: {
        right: '1%',
        width: '60%',
        data: [
            { name: '下层主应变' },
            { name: '中层主应变' },
            { name: '上层主应变' },
            { name: '下层主应变滑动平均' },
            { name: '中层主应变滑动平均' },
            { name: '上层主应变滑动平均' },
        ],
    },
    xAxis: {
        // data: data.map(function (item) {
        //   return item[0];
        // })
    },
    yAxis: {
        scale: true,
        min: 0,
        max: 800,
        name: '土体内部应变值(με)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 16,
            align: 'left',
            verticalAlign: 'top',
            fontWeight: 'bold',
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
    backgroundColor: 'rgba(255,255,255,1)',
    series: [{}, {}, {}, {}, {}, {}, {}, {}],
}

const genStressOptionOfDevice = (deviceDataList, halfError) => {
    stressOption.xAxis.data = []
    let dataInterval = [[], [], [], [], [], [], [], []]
    deviceDataList.map(function (item) {
        stressOption.xAxis.data.push(
            item['measureTime'] ? item['measureTime'].replace(' ', '\n') : null,
        )
        dataInterval[0].push(
            item['bottomChange'] ? +item['bottomChange'].toFixed(2) : null,
        )
        dataInterval[1].push(
            item['middleChange'] ? +item['middleChange'].toFixed(2) : null,
        )
        dataInterval[2].push(
            item['topChange'] ? +item['topChange'].toFixed(2) : null,
        )
        dataInterval[3].push(
            item['bottomChangeAvg'] ? item['bottomChangeAvg'] : null,
        )
        dataInterval[4].push(
            item['middleChangeAvg'] ? item['middleChangeAvg'] : null,
        )
        dataInterval[5].push(item['topChangeAvg'] ? item['topChangeAvg'] : null)
        dataInterval[6].push(
            item['topChangeAvg']
                ? +(item['topChangeAvg'] - halfError).toFixed(2)
                : null,
        )
        dataInterval[7].push(halfError * 2)
    })
    stressOption.series[0] = {
        name: '下层主应变',
        type: 'scatter',
        data: dataInterval[0],
        symbolSize: 7,
        itemStyle: {
            color: 'rgb(73,73,73)',
            opacity: 0.4,
        },
    }
    stressOption.series[1] = {
        name: '中层主应变',
        type: 'scatter',
        data: dataInterval[1],
        symbolSize: 7,
        itemStyle: {
            color: 'rgb(133,133,133)',
            opacity: 0.4,
        },
    }
    stressOption.series[2] = {
        name: '上层主应变',
        type: 'scatter',
        data: dataInterval[2],
        symbolSize: 7,
        itemStyle: {
            color: 'rgb(183,183,183)',
            opacity: 0.4,
        },
    }
    stressOption.series[3] = {
        name: '下层主应变滑动平均',
        type: 'line',
        data: dataInterval[3],
        lineStyle: {
            opacity: 1,
            width: 4,
            color: '#FFA378',
        },
        itemStyle: {
            color: '#FFA378',
            opacity: 0.4,
        },
    }
    stressOption.series[4] = {
        name: '中层主应变滑动平均',
        type: 'line',
        data: dataInterval[4],
        lineStyle: {
            opacity: 1,
            width: 4,
            color: '#05AFF2',
        },
        itemStyle: {
            color: '#05AFF2',
            opacity: 0.4,
        },
    }
    stressOption.series[5] = {
        name: '上层主应变滑动平均',
        type: 'line',
        data: dataInterval[5],
        lineStyle: {
            opacity: 1,
            width: 4,
            color: '#45BF55',
        },
        itemStyle: {
            color: '#45BF55',
            opacity: 0.4,
        },
    }
    stressOption.series[6] = {
        name: '上层主应变滑动平均误差区间下限',
        type: 'line',
        stack: 'error',
        lineStyle: {
            color: '#38D0F2',
            opacity: 0.4,
        },
        itemStyle: {
            color: '#38D0F2',
            borderColor: '#38D0F2',
            opacity: 0.4,
        },
        symbol: 'none',
        data: dataInterval[6],
    }
    stressOption.series[7] = {
        name: '上层主应变滑动平均误差区间',
        type: 'line',
        stack: 'error',
        areaStyle: {
            color: '#A7C5C5',
            opacity: 0.2,
        },
        lineStyle: {
            color: '#38D0F2',
            opacity: 0.4,
        },
        symbol: 'none',
        data: dataInterval[7],
    }
    return stressOption
}

let incinometerOption = {
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
    legend: {
        right: '1%',
        width: '60%',
        data: [
            { name: '下层内部位移' },
            { name: '中层内部位移' },
            { name: '上层内部位移' },
            { name: '下层内部位移滑动平均' },
        ],
    },
    xAxis: {
        // data: data.map(function (item) {
        //   return item[0];
        // })
    },
    yAxis: {
        scale: true,
        min: -10,
        max: 10,
        name: '土体体内部位移(με)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 16,
            align: 'left',
            verticalAlign: 'top',
            fontWeight: 'bold',
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
    backgroundColor: 'rgba(255,255,255,1)',
    series: [{}, {}, {}, {}, {}, {}],
}

const genIncinometerOptionOfDevice = (deviceDataList, halfError) => {
    incinometerOption.xAxis.data = []
    let dataInterval = [[], [], [], [], [], []]
    let noArea = false
    deviceDataList.map(function (item) {
        incinometerOption.xAxis.data.push(
            item['measureTime'].replace(' ', '\n'),
        )
        dataInterval[0].push(+item['bottomMove'].toFixed(2))
        dataInterval[1].push(+item['middleMove'].toFixed(2))
        dataInterval[2].push(+item['topMove'].toFixed(2))
        dataInterval[3].push(item['bottomMoveAvg'])
        dataInterval[4].push(+(item['bottomMoveAvg'] - halfError).toFixed(2))
        if (Math.abs(item['bottomMoveAvg']) > halfError) {
            noArea = true
        }
        dataInterval[5].push(+(item['bottomMoveAvg'] + halfError).toFixed(2))
    })
    // console.log('12313', dataInterval[4])
    incinometerOption.series[0] = {
        name: '下层内部位移',
        type: 'scatter',
        data: dataInterval[0],
        symbolSize: 7,
        itemStyle: {
            color: 'rgb(133,133,133)',
            opacity: 0.6,
        },
    }
    incinometerOption.series[1] = {
        name: '中层内部位移',
        type: 'scatter',
        data: dataInterval[1],
        symbolSize: 7,
        itemStyle: {
            color: '#38D0F2',
            opacity: 0.6,
        },
    }
    incinometerOption.series[2] = {
        name: '上层内部位移',
        type: 'scatter',
        data: dataInterval[2],
        symbolSize: 7,
        itemStyle: {
            color: '#FFA378',
            opacity: 0.6,
        },
    }
    incinometerOption.series[3] = {
        name: '下层内部位移滑动平均',
        type: 'line',
        data: dataInterval[3],
        lineStyle: {
            opacity: 1,
            width: 4,
            color: '#45BF55',
        },
        itemStyle: {
            color: '#45BF55',
            opacity: 0.4,
        },
    }
    incinometerOption.series[4] = {
        name: '下层内部位移滑动平均误差区间下限',
        type: 'line',
        // stack: 'error',
        lineStyle: {
            color: '#38D0F2',
            opacity: 0.4,
        },
        areaStyle: {
            color: '#A7C5C5',
            opacity: 0.2,
        },
        itemStyle: {
            color: '#38D0F2',
            borderColor: '#38D0F2',
            opacity: 0.4,
        },
        symbol: 'none',
        data: dataInterval[4],
    }
    incinometerOption.series[5] = {
        name: '下层内部位移滑动平均误差区间上限',
        type: 'line',
        // stack: 'error',
        areaStyle: {
            color: '#A7C5C5',
            opacity: 0.2,
        },
        lineStyle: {
            color: '#38D0F2',
            opacity: 0.4,
        },
        symbol: 'none',
        data: dataInterval[5],
    }
    return incinometerOption
}

let manometerOption = {
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
    legend: {
        right: '1%',
        width: '60%',
        data: [
            { name: '潜水位土体孔隙水压力' },
            { name: '潜水位土体孔隙水压力误差上限' },
            { name: '潜水位土体孔隙水压力误差下限' },
        ],
    },
    xAxis: {
        // data: data.map(function (item) {
        //   return item[0];
        // })
    },
    yAxis: {
        scale: true,
        min: -6,
        max: 2,
        name: '潜水位土体孔隙水压力(m)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 16,
            align: 'left',
            verticalAlign: 'top',
            fontWeight: 'bold',
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
    backgroundColor: 'rgba(255,255,255,1)',
    series: [{}, {}, {}],
}

const genManometerOptionOfDevice = (deviceDataList, halfError) => {
    manometerOption.xAxis.data = []
    let dataInterval = [[], [], []]
    let noArea = false
    deviceDataList.map(function (item) {
        manometerOption.xAxis.data.push(item['measureTime'].replace(' ', '\n'))
        dataInterval[0].push(+item['height'].toFixed(2))
        dataInterval[1].push(+(item['height'] + halfError).toFixed(2))
        if (Math.abs(item['height']) > halfError) {
            noArea = true
        }
        dataInterval[2].push(+(item['height'] - halfError).toFixed(2))
    })
    // console.log('12313', dataInterval[4])
    manometerOption.series[0] = {
        name: '潜水位土体孔隙水压力',
        type: 'line',
        data: dataInterval[0],
        lineStyle: {
            opacity: 1,
            width: 4,
            color: '#45BF55',
        },
        itemStyle: {
            color: '#45BF55',
            opacity: 0.4,
        },
    }
    manometerOption.series[1] = {
        name: '潜水位土体孔隙水压力误差下限',
        type: 'line',
        // stack: 'error',
        lineStyle: {
            color: '#38D0F2',
            opacity: 0.4,
        },
        // areaStyle: {
        //     color: '#A7C5C5',
        //     opacity: 0.2
        // },
        itemStyle: {
            color: '#38D0F2',
            borderColor: '#38D0F2',
            opacity: 0.4,
        },
        symbol: 'none',
        data: dataInterval[1],
    }
    manometerOption.series[2] = {
        name: '潜水位土体孔隙水压力误差上限',
        type: 'line',
        // stack: 'error',
        // areaStyle: {
        //     color: '#A7C5C5',
        //     opacity: 0.2
        // },
        lineStyle: {
            color: '#38D0F2',
            opacity: 0.4,
        },
        symbol: 'none',
        data: dataInterval[2],
    }
    return manometerOption
}

export {
    genGnssOptionOfDevice,
    genStressOptionOfDevice,
    genIncinometerOptionOfDevice,
    genManometerOptionOfDevice,
}

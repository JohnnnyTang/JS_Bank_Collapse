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
        max: function (value) {
            return parseInt((value.max * 1.5)/10+1) * 10;
        },
        name: '土体表面累积位移(mm)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 13,
            align: 'left',
            verticalAlign: 'top',
            fontWeight: 'bold',
        },
    },
    legend: {
        right: '1%',
        width: '60%',
        data: [
            { name: '土体表面位移' },
            { name: '位移滑动平均' },
            { name: '位移滑动误差区间下限' },
            { name: '位移误差区间' },
        ],
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
            start: 98,
            end: 100,
        },
        {
            type: 'slider',
            start: 98,
            end: 100,
        },
    ],
    backgroundColor: 'rgba(255,255,255,1)',
    visualMap: [
        {
            show: false,
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
                color: 'rgb(163,163,163)',
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
                    // {
                    //     yAxis: 35,
                    //     lineStyle: {
                    //         color: '#FF8E00',
                    //         width: 3,
                    //     },
                    // },
                    // {
                    //     yAxis: 50,
                    //     lineStyle: {
                    //         color: '#FD0100',
                    //         width: 3,
                    //     },
                    // },
                ],
            },
        },
        {},
        {},
        {},
        {},
    ],
}

let gnssRealTimeSetting = {
    yAxis: {
        scale: true,
        min: function (value) {
            let i = parseInt((value.min / 1.1)/2-1) * 2
            return (i<0)?0:i
        },
        max: function (value) {
            return parseInt((value.max * 1.1)/2+1) * 2
        },
        name: '土体表面累积位移(mm)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 13,
            align: 'left',
            verticalAlign: 'top',
            fontWeight: 'bold',
        },
    },
    dataZoom: [
        {
            type: 'inside',
            start: 98,
            end: 100,
        },
        {
            type: 'slider',
            start: 98,
            end: 100,
        },
    ],
}

let gnssLongTimeSetting = {
    yAxis: {
        scale: true,
        min: 0,
        max: function (value) {
            return parseInt((value.max * 1.5)/10+1) * 10;
        },
        name: '土体表面累积位移(mm)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 13,
            align: 'left',
            verticalAlign: 'top',
            fontWeight: 'bold',
        },
    },
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 100,
        },
        {
            type: 'slider',
            start: 0,
            end: 100,
        },
    ],
}

const genGnssOptionOfDevice = (deviceDataList, halfError, dataMode) => {
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
        name: '土体表面位移',
        type: 'scatter',
        data: gnssDataInterval[0],
        symbolSize: 4,
        itemStyle: {
            color: 'rgb(163,163,163)',
            opacity: 0.4,
        },
    }
    gnssOption.series[2] = {
        name: '位移滑动平均',
        type: 'line',
        data: gnssDataInterval[1],
        lineStyle: {
            opacity: 1,
            width: 2,
        },
    }
    gnssOption.series[3] = {
        name: '位移滑动误差区间下限',
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
        name: '位移误差区间',
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
    if(dataMode === "实时"){
        gnssOption.yAxis = gnssRealTimeSetting.yAxis
        gnssOption.dataZoom = gnssRealTimeSetting.dataZoom
        // console.log("shishi sdada")
    }
    else {
        gnssOption.yAxis = gnssLongTimeSetting.yAxis
        gnssOption.dataZoom = gnssLongTimeSetting.dataZoom
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
        max: function (value) {
            return parseInt((value.max * 1.2)/100+1) * 100;
        },
        name: '土体内部应变值(με)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 13,
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

let stressRealTimeSetting = {
    yAxis: {
        scale: true,
        min: 0,
        max: function (value) {
            return parseInt((value.max * 1.1)/50+1) * 50;
        },
        name: '土体表面累积位移(mm)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 13,
            align: 'left',
            verticalAlign: 'top',
            fontWeight: 'bold',
        },
    },
    dataZoom: [
        {
            type: 'inside',
            start: 98,
            end: 100,
        },
        {
            type: 'slider',
            start: 98,
            end: 100,
        },
    ],
}

let stressLongTimeSetting = {
    yAxis: {
        scale: true,
        min: 0,
        max: function (value) {
            return parseInt((value.max * 1.2)/100+1) * 100;
        },
        name: '土体内部应变值(με)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 13,
            align: 'left',
            verticalAlign: 'top',
            fontWeight: 'bold',
        },
    },
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 100,
        },
        {
            type: 'slider',
            start: 0,
            end: 100,
        },
    ],
}

const genStressOptionOfDevice = (deviceDataList, halfError, dataMode) => {
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
        symbolSize: 4,
        itemStyle: {
            color: 'rgb(73,73,73)',
            opacity: 0.4,
        },
    }
    stressOption.series[1] = {
        name: '中层主应变',
        type: 'scatter',
        data: dataInterval[1],
        symbolSize: 4,
        itemStyle: {
            color: 'rgb(163,163,163)',
            opacity: 0.4,
        },
    }
    stressOption.series[2] = {
        name: '上层主应变',
        type: 'scatter',
        data: dataInterval[2],
        symbolSize: 4,
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
            width: 2,
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
            width: 2,
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
            width: 2,
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
    if(dataMode === "实时"){
        stressOption.yAxis = stressRealTimeSetting.yAxis
        stressOption.dataZoom = stressRealTimeSetting.dataZoom
        // console.log("shishi sdada")
    }
    else {
        stressOption.yAxis = stressLongTimeSetting.yAxis
        stressOption.dataZoom = stressLongTimeSetting.dataZoom
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
        min: function (value) {
            if(value.min > 0) return -10
            return parseInt((value.min * 1.5)/4-1) * 4;
        },
        max: function (value) {
            if(value.max < 2) return 10
            return parseInt((value.max * 1.5)/4+1) * 4;
        },
        name: '土体体内部位移(με)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 13,
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

let incinometerRealTimeSetting = {
    yAxis: {
        scale: true,
        min: function (value) {
            if(value.min > 0) return -4
            return parseInt((value.min * 1.2)/2-1) * 2;
        },
        max: function (value) {
            if(value.max < 2) return 4
            return parseInt((value.max * 1.2)/2+1) * 2;
        },
        name: '土体体内部位移(με)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 13,
            align: 'left',
            verticalAlign: 'top',
            fontWeight: 'bold',
        },
    },
    dataZoom: [
        {
            type: 'inside',
            start: 90,
            end: 100,
        },
        {
            type: 'slider',
            start: 90,
            end: 100,
        },
    ],
}

let incinometerLongTimeSetting = {
    yAxis: {
        scale: true,
        min: function (value) {
            if(value.min > 0) return -10
            return parseInt((value.min * 1.5)/4-1) * 4;
        },
        max: function (value) {
            if(value.max < 2) return 10
            return parseInt((value.max * 1.5)/4+1) * 4;
        },
        name: '土体体内部位移(με)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 13,
            align: 'left',
            verticalAlign: 'top',
            fontWeight: 'bold',
        },
    },
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 100,
        },
        {
            type: 'slider',
            start: 0,
            end: 100,
        },
    ],
}

const genIncinometerOptionOfDevice = (deviceDataList, halfError, dataMode) => {
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
        symbolSize: 4,
        itemStyle: {
            color: 'rgb(163,163,163)',
            opacity: 0.6,
        },
    }
    incinometerOption.series[1] = {
        name: '中层内部位移',
        type: 'scatter',
        data: dataInterval[1],
        symbolSize: 4,
        itemStyle: {
            color: '#38D0F2',
            opacity: 0.6,
        },
    }
    incinometerOption.series[2] = {
        name: '上层内部位移',
        type: 'scatter',
        data: dataInterval[2],
        symbolSize: 4,
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
            width: 2,
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
    
    if(dataMode === "实时"){
        incinometerOption.yAxis = incinometerRealTimeSetting.yAxis
        incinometerOption.dataZoom = incinometerRealTimeSetting.dataZoom
        // console.log("shishi sdada")
    }
    else {
        incinometerOption.yAxis = incinometerLongTimeSetting.yAxis
        incinometerOption.dataZoom = incinometerLongTimeSetting.dataZoom
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
        min: function (value) {
            if(value.min > 0) return -2
            return parseInt((value.min * 1.5)/2-1) * 2;
        },
        max: function (value) {
            if(value.max < 2) return 2
            return parseInt((value.max * 1.5)/2+1) * 2;
        },
        name: '潜水位土体孔隙水压力(m)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 13,
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

let manometerRealTimeSetting = {
    yAxis: {
        scale: true,
        min: function (value) {
            if(value.min > 0) return 0
            return Math.floor(value.min)-0.5;
        },
        max: function (value) {
            return Math.floor(value.max + 1)+0.5;
        },
        name: '土体体内部位移(με)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 13,
            align: 'left',
            verticalAlign: 'top',
            fontWeight: 'bold',
        },
    },
    dataZoom: [
        {
            type: 'inside',
            start: 90,
            end: 100,
        },
        {
            type: 'slider',
            start: 90,
            end: 100,
        },
    ],
}

let manometerLongTimeSetting = {
    yAxis: {
        scale: true,
        min: function (value) {
            if(value.min > 0) return -10
            return parseInt((value.min * 1.5)/4-1) * 4;
        },
        max: function (value) {
            if(value.max < 2) return 10
            return parseInt((value.max * 1.5)/4+1) * 4;
        },
        name: '土体体内部位移(με)',
        nameLocation: 'end',
        nameTextStyle: {
            fontSize: 13,
            align: 'left',
            verticalAlign: 'top',
            fontWeight: 'bold',
        },
    },
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 100,
        },
        {
            type: 'slider',
            start: 0,
            end: 100,
        },
    ],
}

const genManometerOptionOfDevice = (deviceDataList, halfError, dataMode) => {
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
            width: 2,
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
    
    if(dataMode === "实时"){
        manometerOption.yAxis = manometerRealTimeSetting.yAxis
        manometerOption.dataZoom = manometerRealTimeSetting.dataZoom
    }
    else {
        manometerOption.yAxis = manometerLongTimeSetting.yAxis
        manometerOption.dataZoom = manometerLongTimeSetting.dataZoom
    }
    return manometerOption
}

export {
    genGnssOptionOfDevice,
    genStressOptionOfDevice,
    genIncinometerOptionOfDevice,
    genManometerOptionOfDevice,
}

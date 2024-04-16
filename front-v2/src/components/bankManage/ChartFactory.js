const gnssBaseOption = {
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

function buildGnssSeries(dataList) {
    return {
        time: dataList.map(function (item) {
            return item['in_time'].split('.')[0].replace('T', '\n')
        }),
        series: {
            x_move: {
                name: 'x_move',
                type: 'line',
                data: dataList.map(function (item) {
                    return item['x_move']
                }),
            },
            y_move: {
                name: 'y_move',
                type: 'line',
                data: dataList.map(function (item) {
                    return item['y_move']
                }),
            },
            z_move: {
                name: 'z_move',
                type: 'line',
                data: dataList.map(function (item) {
                    return item['z_move']
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
                    return item['threeDF']
                }),
            },
        },
    }
}

class ChartFactory {
    deviceTableDataMap = ref({
        gnss: {
            'CL-01': {
                updateTime: null,
                data: [],
                chartData: {}
            },
            'CL-02': {
                updateTime: null,
                data: [],
                chartData: {}
            },
            'CL-03': {
                updateTime: null,
                data: [],
                chartData: {}
            },
            'CL-04': {
                updateTime: null,
                data: [],
                chartData: {}
            },
            'CL-05': {
                updateTime: null,
                data: [],
                chartData: {}
            },
            'CL-06': {
                updateTime: null,
                data: [],
                chartData: {}
            },
            'CL-07': {
                updateTime: null,
                data: [],
                chartData: {}
            },
            'CL-08': {
                updateTime: null,
                data: [],
                chartData: {}
            },
            'CL-09': {
                updateTime: null,
                data: [],
                chartData: {}
            },
            'CL-10': {
                updateTime: null,
                data: [],
                chartData: {}
            },
        },
        inclinometer: {},
        manometer: {},
        stress: {},
    })
    
}


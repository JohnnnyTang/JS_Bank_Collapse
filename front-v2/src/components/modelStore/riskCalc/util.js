/**
 *
 * @param {any} echarts
 * @param {number[]} points
 * @param {number} deepestPoint
 */
export const drawSectionGraph = (echarts, points) => {
    const min = Math.min(...points)
    const index = points.indexOf(min)
    const option = {
        title: {
            text: '断面',
            top: 2,
            left: 6,
        },
        grid: {
            width: '80%',
            height: '50%',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985',
                },
            },
        },
        legend: {
            data: ['断面深度'],
            top: 2,
            right: 10,
        },
        xAxis: {
            type: 'category',
            data: points.map((_, index) => index),
            position: 'bottom',
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: true,
            },
            scale: true,
        },
        series: [
            {
                name: '断面深度',
                data: points.map((value) => value.toFixed(2)),
                type: 'line',
                smooth: true,
                symbol: 'circle',
                itemStyle: {
                    color: function (data) {
                        if (data.dataIndex === index) {
                            return 'red'
                        }
                    },
                },
            },
        ],
    }

    echarts.setOption(option)
}

/**
 *
 * @param {any} echarts
 * @param {number[]} indexValues
 */
export const drawOutputGraph = (echarts, indexValues) => {
    const option = {
        title: {
            text: '断面',
            top: 2,
            left: 6,
        },
        grid: {
            width: '80%',
            height: '50%',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985',
                },
            },
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
        },
        xAxis: [
            {
                type: 'category',
                data: ['造床流量当量', '流速', '水位变幅'],
            },
        ],
        yAxis: [
            {
                type: 'value',
            },
        ],
        series: [
            {
                name: 'Forest',
                type: 'bar',
                emphasis: {
                    focus: 'series',
                },
                data: indexValues.map((value) => value.toFixed(2)),
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = [
                                '#C33531',
                                '#EFE42A',
                                '#64BD3D',
                                '#EE9201',
                                '#29AAE3',
                                '#B74AE5',
                                '#0AAF9F',
                                '#E89589',
                            ]
                            return colorList[params.dataIndex]
                        },
                        label: {
                            show: false,
                        },
                    },
                },
            },
        ],
    }

    echarts.setOption(option)
}

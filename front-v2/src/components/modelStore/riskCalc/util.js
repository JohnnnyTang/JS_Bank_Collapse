/**
 *
 * @param {any} echarts
 * @param {number[]} points
 * @param {number} deepestPoint
 */
export const drawSectionGraph = (echarts, points) => {
    const min = Math.min(...points)
    const max = Math.max(...points)
    const index = points.indexOf(min)
    const option = {
        grid: {
            width: '80%',
            height: '70%',
            top: '10%',
            show: true,
            backgroundColor: '#2a5fdb',
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
        xAxis: {
            type: 'category',
            data: points.map((_, index) => index),
            position: 'bottom',
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            scale: true,
            max: Math.round(max + 2),
            min: Math.round(min - 2),
        },
        series: [
            {
                name: '断面深度',
                data: points.map((value) => value.toFixed(2)),
                type: 'line',
                smooth: true,
                // symbol: 'circle',
                areaStyle: {
                    opacity: 0.8,
                    color: '#d2f2ff',
                },
            },
        ],
    }

    echarts.setOption(option)
}

export const drawPlainSectionGraph = (echarts, points) => {
    const min = Math.min(...(points.map((value) => value[2])))
    const max = Math.max(...(points.map((value) => value[2])))
    const index = points.indexOf(min)
    const option = {
        grid: {
            left: '3%',
            right: '3%',
            top: '5%',
            bottom: '5%',
            show: true,
            backgroundColor: '#dff2ff',
            containLabel: true
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
        xAxis: {
            type: 'category',
            data: points.map((_, index) => index),
            position: 'bottom',
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            scale: true,
            max: Math.round(max + 2),
            min: Math.round(min - 2),
        },
        series: [
            {
                name: '断面深度',
                data: points.map((value) => value[2].toFixed(2)),
                type: 'line',
                smooth: true,
                // symbol: 'circle',
                areaStyle: {
                    opacity: 0.8,
                    color: '#0046C2',
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
    if (indexValues[0] === null) {
        return
    } else {
        const option = {
            grid: {
                top: '10%',
                width: '80%',
                height: '70%',
                show: true,
                backgroundColor: 'hsl(210, 90%, 70%)',
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
                    data: indexValues.map((value) => value[2].toFixed(2)),
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
}

/**
 *
 * @param {any} echarts
 * @param {number[]} points
 * @param {number[]} rates
 */
export const drawRateGraph = (echarts, points, rates) => {
    const min = Math.min(...points)
    const max = Math.max(...points)

    const length = points.length
    const splitPoint = []
    for (let index = 0; index < length; index += 10) {
        splitPoint.push(index)
    }
    splitPoint.push(length - 1)

    const ratePoints = []
    for (
        let index = 0, rateIndex = 0;
        index < splitPoint.length;
        index++, rateIndex++
    ) {
        if (index !== splitPoint.length - 1) {
            const start = splitPoint[index]
            const end = splitPoint[index + 1]
            for (let j = start; j < end; j++) {
                console.log(rateIndex)
                ratePoints.push(rates[rateIndex])
            }
        }
    }

    const colors = ['#5c7bd9', '#ff7070']
    const pieces = (() => {
        const result = []
        const length = splitPoint.length
        splitPoint.forEach((value, index) => {
            if (index !== length - 1) {
                result.push({
                    gt: value,
                    lt: splitPoint[index + 1],
                    color: colors[index % 2],
                })
            }
        })
        return result
    })()

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985',
                },
            },
        },
        grid: {
            width: '80%',
            height: '70%',
            top: '10%',
            show: true,
        },
        visualMap: {
            type: 'piecewise',
            show: false,
            dimension: 0,
            seriesIndex: 0,
            pieces: pieces,
        },
        xAxis: {
            type: 'category',
            data: points.map((_, index) => index),
            position: 'bottom',
            axisLine: {
                show: true,
                onZero: false,
            },
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: false,
            },
            scale: true,
            max: Math.round(max + 1),
            min: Math.round(min - 1),
        },
        series: [
            {
                name: '选择时间横截面',
                type: 'line',
                smooth: true,
                data: points.map((value) => value.toFixed(2)),
            },
            {
                name: '坡比',
                type: 'line',
                smooth: true,
                data: ratePoints.map((value) => value.toFixed(6)),
            },
        ],
    }
    echarts.setOption(option)
}

/**
 *
 * @param {any} echarts
 * @param {number[]} after
 * @param {number[]} before
 */
export const drawCompareGraph = (echarts, after, before) => {
    const min = Math.min(...after, ...before)
    const max = Math.max(...after, ...before)
    const option = {
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
            data: ['选择时间横截面', '对比时间横截面'],
        },
        grid: {
            width: '80%',
            height: '70%',
            top: '10%',
            show: true,
        },
        xAxis: {
            type: 'category',
            data: before.map((_, index) => index),
            position: 'bottom',
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            scale: true,
            max: Math.round(max + 2),
            min: Math.round(min - 2),
        },
        series: [
            {
                name: '选择时间横截面',
                type: 'line',
                smooth: true,
                data: after.map((value) => value.toFixed(2)),
            },
            {
                name: '对比时间横截面',
                type: 'line',
                smooth: true,
                data: before.map((value) => value.toFixed(2)),
                lineStyle: {
                    color: '#ff7070',
                },
                itemStyle: {
                    color: '#ff7070',
                },
            },
        ],
    }
    echarts.setOption(option)
}

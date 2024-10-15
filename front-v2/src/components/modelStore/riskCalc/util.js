/**
 *
 * @param {any} echarts
 * @param {number[]} points
 * @param {number} deepestPoint
 */
export const drawSectionGraph = (echarts, points) => {
    const min = Math.min(...points)
    const max = Math.max(...points)
    const option = {
        grid: {
            width: '80%',
            height: '70%',
            top: '10%',
            show: true,
            backgroundColor: '#d2f2ff',
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
            data: points.map((_, index) => index * 5),
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
                    color: '#2a5fdb',
                },
            },
        ],
    }

    echarts.setOption(option)
}

export const drawPlainSectionGraph = (echarts, points) => {
    const min = Math.min(...points.map((value) => value[2]))
    const max = Math.max(...points.map((value) => value[2]))
    const index = points.indexOf(min)
    const option = {
        grid: {
            left: '3%',
            right: '3%',
            top: '5%',
            bottom: '5%',
            show: true,
            backgroundColor: '#dff2ff',
            containLabel: true,
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
                    name: '动力计算指标',
                    type: 'bar',
                    emphasis: {
                        focus: 'series',
                    },
                    data: indexValues.map((value) => value[2].toFixed(2)),
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = [
                                    '#ef4444',
                                    '#f59e0b',
                                    '#22c55e',
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
 * @param {number[]} before
 *  @param {number[]} after
 * @param {number[]} rates
 */
export const drawRateGraph = (echarts, after, before, rates) => {
    const min = Math.min(...after, ...before)
    const max = Math.max(...after, ...before)

    const length = Math.min(after.length, before.length)
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
        grid: [
            {
                top: '10%',
                height: '40%',
                show: true,
            },
            {
                top: '58%',
                height: '35%',
                show: true,
            },
        ],
        legend: {
            data: ['当前横截面', '对比横截面', '坡比'],
            right: '10%',
            top: '2%',
        },
        axisPointer: {
            link: [
                {
                    xAxisIndex: 'all',
                },
            ],
        },
        xAxis: [
            {
                type: 'category',
                data: before.map((_, index) => index * 5),
                position: 'bottom',
                //  axisLabel:{
                //     show:false
                //  }
            },
            {
                gridIndex: 1,
                type: 'category',
                data: ratePoints.map((_, index) => index * 5),
                position: 'bottom',
                axisLine: {
                    show: true,
                    onZero: false,
                },
            },
        ],
        yAxis: [
            {
                type: 'value',
                splitLine: {
                    show: false,
                },
                scale: true,
                max: Math.round(max + 1),
                min: Math.round(min - 1),
            },
            {
                type: 'value',
                splitLine: {
                    show: false,
                },
                gridIndex: 1,
                axisLine: {
                    show: false,
                },
                scale: true,
            },
        ],
        series: [
            {
                name: '当前横截面',
                type: 'line',
                smooth: true,
                data: after.map((value) => value.toFixed(2)),
            },
            {
                name: '对比横截面',
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
            {
                name: '坡比',
                type: 'bar',
                smooth: true,
                data: ratePoints.map((value) => value.toFixed(4)),
                yAxisIndex: 1,
                xAxisIndex: 1,
                barCategoryGap: '0%',
                itemStyle: {
                    normal: {
                        color: function (params) {
                            let tempIndex = 0
                            splitPoint.some((value, index) => {
                                if (params.dataIndex < value) {
                                    tempIndex = index - 1
                                    return true
                                }
                            })
                            const colorList = ['#059669', '#84cc16']
                            return colorList[tempIndex % 2]
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

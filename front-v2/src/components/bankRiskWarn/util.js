const fix2OrNull = (value) => {
    if (value === null) {
        return null
    } else {
        return value.toFixed(2)
    }
}

/**
 *
 * @param {any} echarts
 * @param {number[]} flowspeed
 */
export const drawFlowspeedGraph = (echarts, flowspeed) => {
    const option = {
        backgroundColor: "rgba(220, 250, 248, 0.3)",
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
                top: '15%',
                height: '75%',
                width: '85%',
                show: true,
            }
        ],
        legend: {
            data: ['流速'],
            right: '10%',
            top: '4%',
        },
        xAxis: [
            {
              type: 'category',
              data: flowspeed.map((_, index) => `断面${index + 1}`),
              axisLine:{
                lineStyle:{
                    color:'black'
                }
              }
            }
        ],
        yAxis: [
            {
              name: "单位：m/s",
              max: 3,
              min: 0,
              type: 'value',
              axisLine:{
                lineStyle:{
                    color:'black'
                }
              }
            }
        ],
        series: [
            {
              name: '流速',
              type: 'line',
              data: flowspeed
            }
        ],
    }
    echarts.setOption(option)
}

/**
 *
 * @param {any} echarts
 * @param {number[]} before
 *  @param {number[]} after
 * @param {number[]} rates
 */
export const drawShapeGraph = (echarts, after, before, rates) => {
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
        backgroundColor: "rgba(220, 250, 248, 0.3)",
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
                width: '78%',
                show: true,
            },
            {
                top: '58%',
                height: '35%',
                width: '78%',
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
                axisLine:{
                    lineStyle:{
                        color:'black'
                    }
                  }
            },
            {
                name: '单位: m',
                gridIndex: 1,
                type: 'category',
                data: ratePoints.map((_, index) => index * 5),
                position: 'bottom',
                axisLine: {
                    show: true,
                    onZero: false,
                    lineStyle:{
                        color:'black'
                    }
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
                max: 8,
                min: -40,
                axisLine:{
                    lineStyle:{
                        color:'black'
                    }
                  }
            },
            {
                type: 'value',
                splitLine: {
                    show: false,
                },
                gridIndex: 1,
                axisLine: {
                    show: false,
                    lineStyle:{
                        color:'black'
                    }
                },
                scale: true,
                max: 0.5,
                min: -0.5,
            },
        ],
        series: [
            {
                name: '当前横截面',
                type: 'line',
                smooth: true,
                data: after.map((value) => fix2OrNull(value)),
                lineStyle: {
                    color: '#ff7070',
                },
                itemStyle: {
                    color: '#ff7070',
                },
            },
            {
                name: '对比横截面',
                type: 'line',
                smooth: true,
                data: before.map((value) => fix2OrNull(value)),
            },
            {
                name: '坡比',
                type: 'bar',
                smooth: true,
                data: ratePoints.map((value) => fix2OrNull(value)),
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

/**
 *
 * @param {any} echarts
 * @param {number[]} erosion
 */
export const drawErosionGraph = (echarts, erosion) => {
    const option = {
        backgroundColor: "rgba(220, 250, 248, 0.3)",
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
                top: '12%',
                height: '75%',
                width: '78%',
                show: true,
            }
        ],
        legend: {
            data: ['冲淤'],
            right: '10%',
            top: '4%',
        },
        xAxis: [
            {
                name: '单位: m',
                type: 'category',
                data: erosion.map((_, index) => index * 5),
                position: 'bottom',
                //  axisLabel:{
                //     show:false
                //  }
                axisLine:{
                    lineStyle:{
                        color:'black'
                    }
                  }
            },
        ],
        yAxis: [
            {
              type: 'value',
              axisLine:{
                lineStyle:{
                    color:'black'
                }
              }
            }
        ],
        series: [
            {
              name: '冲淤',
              type: 'line',
              data: erosion
            }
        ],
    }
    echarts.setOption(option)
}

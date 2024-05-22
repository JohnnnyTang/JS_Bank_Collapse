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
 * @param {number[]} before
 *  @param {number[]} after
 * @param {number[]} rates
 */
export const drawShapeSlopeGraph = (echarts, after, before, rates) => {
    const min = Math.min(...after, ...before)
    const max = Math.max(...after, ...before)

    const length = Math.min(after.length, before.length)
    const splitPoint = []
    for (let index = 0; index < length; index += 4) {
        splitPoint.push(index)
    }
    splitPoint.push(length - 1)
    // console.log('213123', after, before, rates)

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
                // console.log(rates[rateIndex])
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
                top: '20%',
                height: '70%',
                width: '78%',
                show: true,
            },
        ],
        legend: {
            data: ['冲淤'],
            right: '40%',
            top: '2%',
        },
        xAxis: [
            {
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
        graphic: {
            elements: [
                {
                    type: 'text',
                    style: {
                        text: '民主沙右缘岸滩',
                        x: 70,
                        y: 25,
                        textFill: 'black',
                        fontSize: 15,
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '浏海沙水道右岸',
                        x: 350,
                        y: 25,
                        textFill: 'black',
                        fontSize: 15,
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '高程(m)',
                        x: 20,
                        y: 8,
                        textFill: 'black',
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '距离(m)',
                        x: 475,
                        y: 165,
                        textFill: 'black',
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                },
            ]
        },
    }
    echarts.setOption(option)
}

/**
 *
 * @param {any} echarts
 * @param {number[]} before
 *  @param {number[]} after
 */
export const drawShapeGraph = (echarts, after, before) => {
    const min = Math.min(...after, ...before)
    const max = Math.max(...after, ...before)

    const length = Math.min(after.length, before.length)
    const splitPoint = []
    for (let index = 0; index < length; index += 4) {
        splitPoint.push(index)
    }
    splitPoint.push(length - 1)

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
                top: '20%',
                height: '70%',
                width: '78%',
                show: true,
            },
        ],
        legend: {
            data: ['当前横截面', '对比横截面', '坡比'],
            right: '30%',
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
                    },
                    onZero: false,
                  }
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
                },
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
        ],
        graphic: {
            elements: [
                {
                    type: 'text',
                    style: {
                        text: '民主沙右缘岸滩',
                        x: 70,
                        y: 60,
                        textFill: 'black',
                        fontSize: 15,
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '浏海沙水道右岸',
                        x: 350,
                        y: 60,
                        textFill: 'black',
                        fontSize: 15,
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '高程(m)',
                        x: 20,
                        y: 40,
                        textFill: 'black',
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '距离(m)',
                        x: 470,
                        y: 370,
                        textFill: 'black',
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                },
            ]
        },
    }
    echarts.setOption(option)
}

/**
 *
 * @param {any} echarts
 * @param {number[]} before
 *  @param {number[]} after
 */
export const drawShapeYearlyGraph = (echarts, yearly) => {

    const length = yearly.length
    const splitPoint = []
    for (let index = 0; index < length; index += 4) {
        splitPoint.push(index)
    }
    splitPoint.push(length - 1)

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
                top: '20%',
                height: '70%',
                width: '78%',
                show: true,
            },
        ],
        legend: {
            data: ['2023年地形'],
            right: '40%',
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
                data: yearly.map((_, index) => index * 5),
                position: 'bottom',
                //  axisLabel:{
                //     show:false
                //  }
                axisLine:{
                    lineStyle:{
                        color:'black'
                    },
                    onZero: false,
                  }
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
                },
            },
        ],
        series: [
            {
                name: '2023年地形',
                type: 'line',
                smooth: true,
                data: yearly.map((value) => fix2OrNull(value)),
                lineStyle: {
                    color: '#ff7070',
                },
                itemStyle: {
                    color: '#ff7070',
                },
            }
        ],
        graphic: {
            elements: [
                {
                    type: 'text',
                    style: {
                        text: '民主沙右缘岸滩',
                        x: 70,
                        y: 40,
                        textFill: 'black',
                        fontSize: 15,
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '浏海沙水道右岸',
                        x: 350,
                        y: 40,
                        textFill: 'black',
                        fontSize: 15,
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '高程(m)',
                        x: 20,
                        y: 20,
                        textFill: 'black',
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '距离(m)',
                        x: 470,
                        y: 268,
                        textFill: 'black',
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                },
            ]
        },
    }
    echarts.setOption(option)
}

/**
 *
 * @param {any} echarts
 * @param {number[]} before
 *  @param {number[]} after
 * @param {number[]} compare
 */
export const drawShapeCompareGraph = (echarts, after, before, compare) => {
    const min = Math.min(...after, ...before)
    const max = Math.max(...after, ...before)

    const length = Math.min(after.length, before.length, compare.length)
    const splitPoint = []
    for (let index = 0; index < length; index += 4) {
        splitPoint.push(index)
    }
    splitPoint.push(length - 1)

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
                top: '20%',
                height: '70%',
                width: '78%',
                show: true,
            },
        ],
        legend: {
            data: ['2012年地形', '2022年地形', '2023年地形'],
            right: '20%',
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
                    },
                    onZero: false,
                  }
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
                },
            },
        ],
        series: [
            {
                name: '2012年地形',
                type: 'line',
                smooth: true,
                data: compare.map((value) => fix2OrNull(value)),
            },
            {
                name: '2022年地形',
                type: 'line',
                smooth: true,
                data: before.map((value) => fix2OrNull(value)),
            },
            {
                name: '2023年地形',
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
        ],
        graphic: {
            elements: [
                {
                    type: 'text',
                    style: {
                        text: '民主沙右缘岸滩',
                        x: 70,
                        y: 40,
                        textFill: 'black',
                        fontSize: 15,
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '浏海沙水道右岸',
                        x: 350,
                        y: 40,
                        textFill: 'black',
                        fontSize: 15,
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '高程(m)',
                        x: 20,
                        y: 20,
                        textFill: 'black',
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '距离(m)',
                        x: 470,
                        y: 268,
                        textFill: 'black',
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                },
            ]
        },
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
export const drawSlopeGraph = (echarts, before, after, rates) => {
    const length = Math.min(after.length, before.length)
    const splitPoint = []
    for (let index = 0; index < length; index += 4) {
        splitPoint.push(index)
    }
    splitPoint.push(length - 1)
    // console.log('213123', after, before, rates)

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
                // console.log(rates[rateIndex])
                ratePoints.push(rates[rateIndex])
            }
        }
    }
    let slope_x = ratePoints.map((_, index) => index * 5)
    let slope_y = ratePoints.map((value) => fix2OrNull(value))
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
                top: '20%',
                height: '70%',
                width: '78%',
                show: true,
            },
        ],
        legend: {
            data: [
                {
                    name:'坡比',
                    itemStyle: {
                        color: 'green'
                    }
                }
            ],
            right: '40%',
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
                gridIndex: 0,
                type: 'category',
                data: slope_x,
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
                gridIndex: 0,
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
                name: '坡比',
                type: 'bar',
                smooth: true,
                data: slope_y,
                yAxisIndex: 0,
                xAxisIndex: 0,
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
                markPoint: {
                    symbol: 'circle',
                    symbolSize: 5, 
                    data: [
                        {
                            name: '最大值',
                            type: 'max',
                            itemStyle: {
                                color: 'red',
                                borderColor: 'black',
                                borderWidth: 0.5,
                            },
                            label: {
                              normal: {
                                show: true,
                                position: 'top',
                                formatter: () => {
                                  return "最大值: "+Math.max(...slope_y).toFixed(2);
                                },
                                textStyle: {
                                  color: '#333',
                                  fontSize: 12
                                }
                              }
                            }
                        },
                        {
                            name: '最小值',
                            type: 'min',
                            itemStyle: {
                                color: 'rgb(82, 163, 235)',
                                borderColor: 'black',
                                borderWidth: 0.5,
                            },
                            label: {
                              normal: {
                                show: true,
                                position: 'bottom',
                                formatter: () => {
                                  return "最小值: "+Math.min(...slope_y).toFixed(2);
                                },
                                textStyle: {
                                  color: '#333',
                                  fontSize: 12
                                }
                              }
                            }
                        }
                    ]
                }
            },
        ],
        graphic: {
            elements: [
                {
                    type: 'text',
                    style: {
                        text: '民主沙右缘岸滩',
                        x: 70,
                        y: 60,
                        textFill: 'black',
                        fontSize: 15,
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '浏海沙水道右岸',
                        x: 350,
                        y: 60,
                        textFill: 'black',
                        fontSize: 15,
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '坡比(%)',
                        x: 20,
                        y: 40,
                        textFill: 'black',
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                },
                {
                    type: 'text',
                    style: {
                        text: '距离(m)',
                        x: 470,
                        y: 370,
                        textFill: 'black',
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                },
            ]
        },
    }
    echarts.setOption(option)
}
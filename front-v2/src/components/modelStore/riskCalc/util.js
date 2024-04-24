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
        // legend: {
        //     data: ['断面深度'],
        //     top: 2,
        //     right: 10,
        // },
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
                areaStyle: {
                    opacity: 0.8,
                    color: '#d2f2ff',
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
        let option = {
            backgroundColor: '#d1e7ff',
        }
        option.graphic = {
            type: 'text', // 类型：文本
            left: 'center',
            top: 'middle',
            silent: true, // 不响应事件
            invisible: false, // 有数据就隐藏
            style: {
                fill: '#2a5fdb',
                fontWeight: 'bold',
                text: '该时间段暂无数据',
                fontFamily: 'Microsoft YaHei',
                fontSize: '25px',
            },
        }
        echarts.setOption(option)
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

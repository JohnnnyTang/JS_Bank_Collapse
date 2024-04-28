import { getHoursBackIn, getDatesBefore } from '../../utils/timeUtils'

const deviceStatusData = [
    {
        name: 'GNSS',
        children: [
            {
                name: '正常运行',
                value: 13,
            },
            {
                name: '无法连接',
                value: 0,
            },
            {
                name: '数据断更',
                value: 0,
            },
        ],
    },
    {
        name: '测斜仪',
        children: [
            {
                name: '正常运行',
                value: 9,
            },
            {
                name: '无法连接',
                value: 0,
            },
            {
                name: '数据断更',
                value: 0,
            },
        ],
    },
    {
        name: '孔隙水压力计',
        children: [
            {
                name: '正常运行',
                value: 9,
            },
            {
                name: '无法连接',
                value: 0,
            },
            {
                name: '数据断更',
                value: 0,
            },
        ],
    },
    {
        name: '应力桩',
        children: [
            {
                name: '正常运行',
                value: 7,
            },
            {
                name: '无法连接',
                value: 0,
            },
            {
                name: '数据断更',
                value: 0,
            },
        ],
    },
    {
        name: '视频监控',
        children: [
            {
                name: '正常运行',
                value: 3,
            },
            {
                name: '无法连接',
                value: 0,
            },
            {
                name: '数据断更',
                value: 0,
            },
        ],
    },
]

const stableStatus = [
    [3, 0, 0,  0],
    [8, 6, 0, 0],
    [48, 48, 47, 36],
    [42, 46, 53, 64],
]

const sectionList = [
    {
        value: '统计',
        label: '全部断面状态比例',
    },
    {
        value: '警告',
        label: 'JC01',
    },
    {
        value: '警告',
        label: 'JC02',
    },
    {
        value: '警告',
        label: 'JC03',
    },
    {
        value: '预警',
        label: 'JC04',
    },
    {
        value: '预警',
        label: 'JC05',
    },
    {
        value: '预警',
        label: 'JC06',
    },
    {
        value: '关注',
        label: 'JC07',
    },
    {
        value: '关注',
        label: 'JC08',
    },
    {
        value: '关注',
        label: 'JC09',
    },
    {
        value: '关注',
        label: 'JC10',
    },
    {
        value: '关注',
        label: 'JC11',
    },
    {
        value: '普通',
        label: 'JC12',
    },
    {
        value: '普通',
        label: 'JC13',
    },
]

const deviceList = [
    {
        value: '统计',
        label: '全部设备统计',
    },
    {
        value: '关注',
        label: 'CL-01',
    },
    {
        value: '关注',
        label: 'CL-02',
    },
    {
        value: '关注',
        label: 'CL-03',
    },
    {
        value: '关注',
        label: 'CL-04',
    },
    {
        value: '预警',
        label: 'CL-05',
    },
    {
        value: '预警',
        label: 'CL-06',
    },
    {
        value: '警告',
        label: 'CL-07',
    },
    {
        value: '警告',
        label: 'CL-08',
    },
    {
        value: '警告',
        label: 'CL-09',
    },
    {
        value: '警告',
        label: 'CL-10',
    }
]

const stableStatusLineData = [
    [8,  6,  5,  5,  3,  0,  0,  0],
    [13, 13, 12, 10, 8,  6,  0,  0],
    [52, 48, 48, 48, 48, 48, 47, 36],
    [27, 33, 35, 37, 41, 46, 53, 64],
]

const hoursBackList = getHoursBackIn(24, 3)
const daysBackList = getDatesBefore(8, 15)

function genRandomStableData(num) {
    let res = [[], [], [], []]
    for (let i = 0; i < num; i++) {
        let a = Math.round(Math.random() * 55)
        let b = Math.round(Math.random() * 25)
        let c = Math.round(Math.random() * (100 - a - b))
        let d = 100 - a - b - c
        res[0].push(a)
        res[1].push(b)
        res[2].push(c)
        res[3].push(d)
    }
    return res
}

const sectionStableDataMap = {
    JC01: stableStatusLineData,
    JC02: stableStatusLineData,
    JC03: stableStatusLineData,
    JC04: stableStatusLineData,
    JC05: stableStatusLineData,
    JC06: stableStatusLineData,
    JC07: stableStatusLineData,
    JC08: stableStatusLineData,
    JC09: stableStatusLineData,
    JC10: stableStatusLineData,
    JC11: stableStatusLineData,
    JC12: stableStatusLineData,
    JC13: stableStatusLineData,
}

// There should not be negative values in rawData
// const rawData = [
//     [100, 302, 301, 334, 390, 330, 320],
//     [320, 132, 101, 134, 90, 230, 210],
//     [220, 182, 191, 234, 290, 330, 310],
//     [150, 212, 201, 154, 190, 330, 410],
//     [820, 832, 901, 934, 1290, 1330, 1320],
// ]
// const totalData = []
// const grid = {
//     left: 100,
//     right: 100,
//     top: 50,
//     bottom: 50,
// }

function genLinkElementsOfChart(chartIns, colors, dataList, seriesNum, grid) {
    const gridLeft = (chartIns.getWidth() * +grid.left.split('%')[0]) / 100
    const gridRight = (chartIns.getWidth() * +grid.right.split('%')[0]) / 100
    const gridTop = (chartIns.getHeight() * +grid.top.split('%')[0]) / 100
    const gridBottom = (chartIns.getHeight() * +grid.bottom.split('%')[0]) / 100
    console.log(gridLeft, gridRight, gridBottom, gridTop)
    const gridWidth = chartIns.getWidth() - gridLeft - gridRight
    // const gridWidth = chartIns.getWidth()
    // const gridHeight = chartIns.getHeight()
    const gridHeight = chartIns.getHeight() - gridBottom - gridTop
    const categoryWidth = gridWidth / dataList[0].length
    const barWidth = categoryWidth * 0.6
    const barPadding = (categoryWidth - barWidth) / 2

    const elements = []
    for (let j = 1, jlen = dataList[0].length; j < jlen; ++j) {
        // console.log(j)
        // const leftX = categoryWidth * j - barPadding
        const leftX = gridLeft + categoryWidth * j - barPadding
        const rightX = leftX + barPadding * 2
        let leftY = gridTop + gridHeight
        // let leftY = gridHeight
        let rightY = leftY
        // console.log(seriesNum)
        for (let i = 0; i < seriesNum; ++i) {
            // console.log(i)
            const points = []
            const leftBarHeight = (dataList[i][j - 1] / 100) * gridHeight
            points.push([leftX, leftY])
            points.push([leftX, leftY - leftBarHeight])
            const rightBarHeight = (dataList[i][j] / 100) * gridHeight
            points.push([rightX, rightY - rightBarHeight])
            points.push([rightX, rightY])
            points.push([leftX, leftY])
            leftY -= leftBarHeight
            rightY -= rightBarHeight
            elements.push({
                type: 'polygon',
                shape: {
                    points,
                },
                style: {
                    fill: colors[i],
                    opacity: 0.4,
                },
            })
        }
    }
    return elements
}

function genChartSeries(chartIns, colors, dataList, seriesNum) {
    const grid = {
        left: '1%',
        right: '1%',
        top: '8%',
        bottom: '8%',
        // containLabel: true,
    }

    const series = ['稳定', '较稳定', '较不稳定', '不稳定'].map((name, sid) => {
        console.log(name, dataList[sid])
        return {
            name,
            type: 'bar',
            stack: 'total',
            barWidth: '60%',
            label: {
                show: true,
                formatter: (params) => params.value + '%',
                fontFamily: 'Impact',
                fontSize: 16,
            },
            data: dataList[sid],
            emphasis: {
                focus: 'series',
                blurScope: 'coordinateSystem',
            },
        }
    })
    let option = {
        color: colors,
        legend: {
            selectedMode: false,
            textStyle: {
                color: 'rgb(11, 20, 86)',
                fontSize: 16,
                fontWeight: 'bold',
            },
        },
        grid,
        yAxis: {
            type: 'value',
            axisLabel: {
                show: false,
            },
        },
        xAxis: {
            type: 'category',
            data: daysBackList,
            axisLabel: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#fff',
            },
            axisLine: {
                lineStyle: {
                    color: '#fff',
                    width: 2,
                },
            },
        },
        series,
        graphic: {
            elements: genLinkElementsOfChart(
                chartIns,
                colors,
                dataList,
                seriesNum,
                grid,
            ),
        },
    }
    console.log(option)
    return option
}

function genDeviceWarnChart(chartIns, colors, dataList, seriesNum) {
    const grid = {
        left: '1%',
        right: '1%',
        top: '8%',
        bottom: '8%',
        // containLabel: true,
    }

    const series = ['警告', '危险'].map((name, sid) => {
        console.log(name, dataList[sid])
        return {
            name,
            type: 'bar',
            stack: 'total',
            barWidth: '60%',
            label: {
                show: true,
                formatter: (params) => params.value + '次',
                fontFamily: 'Impact',
                fontSize: 16,
            },
            data: dataList[sid],
            emphasis: {
                focus: 'series',
                blurScope: 'coordinateSystem',
            },
        }
    })
    let option = {
        color: colors,
        legend: {
            selectedMode: false,
            textStyle: {
                color: 'rgb(11, 20, 86)',
                fontSize: 16,
                fontWeight: 'bold',
            },
        },
        grid,
        yAxis: {
            type: 'value',
            axisLabel: {
                show: false,
            },
        },
        xAxis: {
            type: 'category',
            data: getHoursBackIn(7, 1),
            axisLabel: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#fff',
            },
            axisLine: {
                lineStyle: {
                    color: '#fff',
                    width: 2,
                },
            },
        },
        series,
        graphic: {
            elements: genLinkElementsOfChart(
                chartIns,
                colors,
                dataList,
                seriesNum,
                grid,
            ),
        },
    }
    console.log(option)
    return option
}

export {
    deviceStatusData,
    stableStatus,
    sectionList,
    stableStatusLineData,
    sectionStableDataMap,
    genChartSeries,
    deviceList,
    genDeviceWarnChart
}

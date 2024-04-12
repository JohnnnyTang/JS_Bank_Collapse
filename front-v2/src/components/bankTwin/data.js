import { getHoursBackIn } from '../../utils/timeUtils'

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
    [42, 38, 34, 29],
    [30, 26, 39, 42],
    [24, 24, 19, 21],
    [4, 12, 9, 8],
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

const stableStatusLineData = [
    [39, 41, 47, 48, 40, 42, 45, 36, 42, 38, 34, 29],
    [21, 24, 18, 18, 13, 16, 25, 25, 30, 26, 39, 42],
    [23, 25, 6, 16, 36, 25, 21, 24, 24, 24, 19, 21],
    [17, 10, 29, 18, 11, 17, 9, 15, 4, 12, 9, 8],
]

const hoursBackList = getHoursBackIn(24, 3)

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
    JC01: genRandomStableData(9),
    JC02: genRandomStableData(9),
    JC03: genRandomStableData(9),
    JC04: genRandomStableData(9),
    JC05: genRandomStableData(9),
    JC06: genRandomStableData(9),
    JC07: genRandomStableData(9),
    JC08: genRandomStableData(9),
    JC09: genRandomStableData(9),
    JC10: genRandomStableData(9),
    JC11: genRandomStableData(9),
    JC12: genRandomStableData(9),
    JC13: genRandomStableData(9),
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
    const gridLeft = chartIns.getWidth() * (+grid.left.split('%')[0]) / 100
    const gridRight = chartIns.getWidth() * (+grid.right.split('%')[0]) / 100
    const gridTop = chartIns.getHeight() * (+grid.top.split('%')[0]) / 100
    const gridBottom = chartIns.getHeight() * (+grid.bottom.split('%')[0]) / 100
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
                blurScope: 'coordinateSystem'
            }
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
                show: false
            }
        },
        xAxis: {
            type: 'category',
            data: hoursBackList,
            axisLabel: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#fff',
            }, 
            axisLine: {
                lineStyle: {
                    color: '#fff',
                    width: 2
                }
            },
        },
        series,
        graphic: {
            elements: genLinkElementsOfChart(chartIns, colors, dataList, seriesNum, grid),
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
}

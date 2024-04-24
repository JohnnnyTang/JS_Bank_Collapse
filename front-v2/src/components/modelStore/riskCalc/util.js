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
            height: 100,
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
                itemStyle: {
                    color: function (data) {
                        console.log(data)
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

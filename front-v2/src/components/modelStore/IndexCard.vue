<template>
    <div class="card">
        <div class="index-content">
            <div class="index-content-title">
                <div class="content-title-icon">
                    <img src="/index.png" alt="index">
                </div>
                <div class="content-title-text">
                    {{ title }}
                </div>
            </div>
            <div class="index-content-description">
                <div class="content-description-text">
                    这里是指标描述#这里是指标描述#这里是指标描述
                </div>
            </div>
            <div class="index-content-chart">
                <div ref="main" style="width: 100%; height: 100%;"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title:String,
    data:Object
})
const title=props.title

import * as echarts from "echarts";
import { onMounted, ref } from "vue";

const main = ref(null);

onMounted(async () => {
    var myChart = echarts.init(main.value);
    const option = {
        tooltip: {
            show: false,
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                // snap: true,
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            excludeComponets:['stage3-5']
            // formatter: function(params) {
            //     const xValue = params.xAxis.data[1];
            //     const yValue = params.yAxis.data[1];
            //     return `横坐标：${xValue}<br>纵坐标：${yValue}`;
            // }
        },
        grid: {
            show: false,
            borderWidth: 0
        },
        xAxis: {
            name: '时间',
            nameTextStyle: {
                fontSize:16
            },
            // nameLocation: 'middle',
            type: 'value',
            // data:[0,2,10,12,14,16],
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 0, 0, 0.8)',
                    width: 2
                },
                symbol: ['none', 'arrow'],
                symbolSize: [8, 16]
            },
            axisLabel: {
                show:false,
                // formatter: function (value, index) {
                //     return 't' + (index);
                // },
                // fontSize: 15,
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show:false
            }
        },
        yAxis: {
            name: '位移',
            nameTextStyle: {
                fontSize:16
            },
            nameLocation: 'middle',
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 0, 0, 0.8)', // x 轴颜色
                    width: 2 // x 轴粗细
                },
                symbol: ['none', 'arrow'], // x 轴箭头样式，第一个值表示起点箭头样式，第二个值表示终点箭头样式
                symbolSize: [8, 16] // x 轴箭头大小，第一个值表示起点箭头大小，第二个值表示终点箭头大小
            },
            axisLabel: {
                show:false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show:false
            }
        },
        series: [
            {
                name: 't1',
                type: 'line',
                markLine: {
                    symbol: 'none',
                    data: [
                        {
                            xAxis: 2,
                            lineStyle: {
                                type: 'dashed',
                                color: 'black',
                                width: 1.5,
                            },
                            label:{
                                formatter:'t1',
                                position: 'start',
                                color:'black',
                                borderColor:'black',
                                fontSize: 15
                            }
                        }
                    ]
                },
            },
            {
                name: 't2',
                type: 'line',
                markLine: {
                    symbol: 'none',
                    data: [
                        {
                            xAxis: 10,
                            lineStyle: {
                                type: 'dashed',
                                color: 'black',
                                width: 1.5,
                            },
                            label:{
                                formatter:'t2',
                                position: 'start',
                                color:'black',
                                borderColor:'black',
                                fontSize: 15
                            }
                        }
                    ]
                },
            },
            {
                name: 't3',
                type: 'line',
                markLine: {
                    symbol: 'none',
                    data: [
                        {
                            xAxis: 12,
                            lineStyle: {
                                type: 'dashed',
                                color: 'black',
                                width: 1.5,
                            },
                            label:{
                                formatter:'t3',
                                position: 'start',
                                color:'black',
                                borderColor:'black',
                                fontSize: 15
                            }
                        }
                    ]
                },
            },
            {
                name: 't4',
                type: 'line',
                markLine: {
                    symbol: 'none',
                    data: [
                        {
                            xAxis: 14,
                            lineStyle: {
                                type: 'dashed',
                                color: 'black',
                                width: 1.5,
                            },
                            label:{
                                formatter:'t4',
                                position: 'start',
                                color:'black',
                                borderColor:'black',
                                fontSize: 15
                            }
                        }
                    ]
                },
            },
            {
                name: 't5',
                type: 'line',
                markLine: {
                    symbol: 'none',
                    data: [
                        {
                            xAxis: 16,
                            lineStyle: {
                                type: 'dashed',
                                color: 'black',
                                width: 1.5,
                            },
                            label:{
                                formatter:'t5',
                                position: 'start',
                                color:'black',
                                borderColor:'black',
                                fontSize: 15
                            }
                        }
                    ]
                },
            },
            {
                // name: 'stage-line',
                type: 'line',
                markLine: {
                    symbol: 'triangle',
                    data: [
                        [
                            {xAxis: '0', yAxis: 25},
                            {xAxis: '2', yAxis: 25}
                        ],
                        [
                            {xAxis: '2', yAxis: 25},
                            {xAxis: '10', yAxis: 25}
                        ],
                        [
                            {xAxis: '10', yAxis: 25},
                            {xAxis: '16', yAxis: 25}
                        ]
                    ],
                    lineStyle: {
                        type: 'solied',
                        color:'black',
                        width: 2,
                        opacity: 0.7,
                    },
                }
            },
            {
                name: 'stage1',
                smooth: true,
                // symbol: ['circle', 'none', 'none', 'none', 'circle'],
                symbol: 'circle',
                symbolSize: 7,
                symbolSize: 7,
                type: 'line',
                color:'rgba(0,0,0,1)',
                lineStyle: {
                    width: 3.5
                },
                areaStyle: {
                    color:'rgba(255, 255, 255, 1)'
                },
                data:[[0,2],[2,3],'-','-','-','-'],
                markArea: {
                    silent: true,
                    itemStyle: {
                        color: 'rgba(255,229,229,0.6)'
                    },
                    label: {
                        show: true,
                        position: ['-25%','-10%'],
                        formatter: function(params) {
                            return "初始变形阶段"
                        },
                        textStyle: {
                            color: 'black',
                            textBorderColor: 'black',
                            textBorderWidth: 0.5
                        },
                    },
                    data: [
                        [{
                            xAxis: 0
                        }, {
                            xAxis: 2
                        }]
                    ]
                }
            },
            {
                name: 'stage2',
                smooth: true,
                // symbol: ['circle', 'none', 'none', 'none', 'circle'],
                symbol: 'circle',
                symbolSize: 7,
                type: 'line',
                color:'rgba(0,0,0,1)',
                lineStyle: {
                    width: 3.5
                },
                areaStyle: {
                    color:'rgba(0, 153, 231, 1)'
                },
                data:['-',[2,3],[10,5],'-','-','-'],
                markArea: {
                    silent: true,
                    itemStyle: {
                        color: 'rgba(255,191,191,0.6)'
                    },
                    label: {
                        show: true,
                        position:['30%', '-10%'],
                        formatter: function(params) {
                            return "等速变形阶段"
                        },
                        textStyle: {
                            color: 'black',
                            textBorderColor: 'black',
                            textBorderWidth: 0.5
                        },
                    },
                    data: [
                        [{
                            xAxis: 2
                        }, {
                            xAxis: 10
                        }]
                    ]
                }
            },
            {
                name: 'stage3-5',
                type: 'line',
                symbol: 'none',
                lineStyle: {
                    width: 0
                },
                areaStyle: {
                    color:'rgba(236, 216, 77, 1)'
                },
                data:['-','-',[10,5],[12,7],[14,12],[16,22]],
                markArea: {
                    silent: true,
                    itemStyle: {
                        color: 'rgba(255,153,153,0.7)'
                    },
                    label: {
                        show: true,
                        position: ['25%','-10%'],
                        formatter: function(params) {
                            return "加速变形阶段"
                        },
                        textStyle: {
                            color: 'black',
                            textBorderColor: 'black',
                            textBorderWidth: 0.5
                        },
                    },
                    data: [
                        [{
                            xAxis: 10
                        }, {
                            xAxis: 16
                        }]
                    ]
                }
            },
            {
                name: 'stage3',
                smooth: true,
                // symbol: ['circle', 'none', 'none', 'none', 'circle'],
                symbol: 'circle',
                symbolSize: 7,
                type: 'line',
                color:'rgba(0,0,0,1)',
                lineStyle: {
                    width: 3.5
                },
                areaStyle: {
                    color:'rgba(236, 216, 77, 1)'
                },
                data:['-','-',[10,5],[12,7],'-','-'],
                markArea: {
                    silent: true,
                    itemStyle: {
                        color: 'transparent'
                    },
                    label: {
                        show: true,
                        position: ['10%','110%'],
                        formatter: function(params) {
                            return "初加速"
                        },
                        textStyle: {
                            color: 'red',
                            textBorderColor: 'red',
                            textBorderWidth: 0.5
                        },
                    },
                    data: [
                        [{
                            xAxis: 10
                        }, {
                            xAxis: 12
                        }]
                    ]
                }
            },
            {
                name: 'stage4',
                smooth: true,
                // symbol: ['circle', 'none', 'none', 'none', 'circle'],
                symbol: 'circle',
                symbolSize: 7,
                type: 'line',
                color:'rgba(0,0,0,1)',
                lineStyle: {
                    width: 3.5
                },
                areaStyle: {
                    color:'rgba(226, 143, 14, 1)'
                },
                data:['-','-','-',[12,7],[14,12],'-'],
                markArea: {
                    silent: true,
                    itemStyle: {
                        color: 'transparent'
                    },
                    label: {
                        show: true,
                        position: ['10%','110%'],
                        formatter: function(params) {
                            return "匀加速"
                        },
                        textStyle: {
                            color: 'red',
                            textBorderColor: 'red',
                            textBorderWidth: 0.5
                        },
                    },
                    data: [
                        [{
                            xAxis: 12
                        }, {
                            xAxis: 14
                        }]
                    ]
                }
            },
            {
                name: 'stage5',
                smooth: true,
                // symbol: ['circle', 'none', 'none', 'none', 'circle'],
                symbol: 'circle',
                symbolSize: 7,
                type: 'line',
                color:'rgba(0,0,0,1)',
                lineStyle: {
                    width: 3.5
                },
                areaStyle: {
                    color:'rgba(217, 36, 11, 1)'
                },
                data:['-','-','-','-',[14,12],[16,22]],
                markArea: {
                    silent: true,
                    itemStyle: {
                        color: 'transparent'
                    },
                    label: {
                        show: true,
                        position: ['10%','110%'],
                        formatter: function(params) {
                            return "加加速"
                        },
                        textStyle: {
                            color: 'red',
                            textBorderColor: 'red',
                            textBorderWidth: 0.5
                        },
                    },
                    data: [
                        [{
                            xAxis: 14
                        }, {
                            xAxis: 16
                        }]
                    ]
                }
            },
        ]
    };
    myChart.setOption(option);
})
    


</script>

<style lang="scss" scoped>
div.card {
    min-width: 23vw;
    height: 90%;
    margin: 15px;
    padding: 8px;
    border: 4px solid #6e9bc7;
    border-radius: 10px;
    background: rgba(220,250,239,0.4);
    overflow: hidden;
    box-shadow: #b4c8fc 5px 1px 8px 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: transform 0.5s;
    user-select: none;
    &:hover {
        transform: scale(1.01);
        cursor: pointer;
    }

    div.index-content {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        border-radius: 10px;

        div.index-content-title {
            display: flex;
            flex-direction: row;
            margin-left: 5px;
            width: 35%;
            height: 10%;
            border-bottom: #a231e4 3px solid;

            div.content-title-icon {
                width: 40px;
                height: 40px;

                img {
                    width: 100%;
                    height: 100%;
                    margin-left: 2px;
                    margin-top: 2px;
                }
            }

            div.content-title-text {
                margin-left: 12px;
                font-size: calc(1vh + 1vw);
                font-weight: 600;
                font-family: 'Microsoft YaHei';
                color: #a231e4;
                text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
            }
        }

        div.index-content-description {
            width: 100%;
            height: 10%;
            border: #a9dce2 2px solid;
            border-radius: 10px;
            margin-top: 7px;
            margin-bottom: -10px;

            div.content-description-text {
                width:100%;
                height: 100%;
                margin-left: 5px;
                margin-top: 2px;
                margin-right: 5px;
                margin-bottom: 2px;
                font-size: calc(0.5vh + 0.5vw);
                font-weight: 600;
                font-family: 'Microsoft YaHei';
                color: #a231e4;
            }
        }

        div.index-content-chart {
            width: 100%;
            height: 80%;
        }
    }
}
</style>

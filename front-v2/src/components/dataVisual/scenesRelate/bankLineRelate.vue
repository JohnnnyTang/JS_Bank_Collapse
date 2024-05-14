<template>
    <div class="bankLineRelate-contaniner">
        <div class="titlebox">
            <div class="icon"></div>
            <div class="title">典型岸段场景</div>
        </div>
        <div class="card">
            <div class="content">
                <div class="back">
                    <div class="real-content">

                        <div class="desc-content">
                            <div class="in-db-bank-container">
                                <div class="in-db-bank">在库岸段</div>
                                <div class="in-db-bank-num">{{ Info.banklineNum }}</div>
                            </div>
                            <div class="bank-desc">
                                <div class="bank-desc-text">
                                    典型岸段场景涵盖了的南京、扬中、镇扬、澄通、河口等各河段及河口段的典型岸段信息以及基础地理信息。
                                </div>
                            </div>

                            <div class="last-update-containter">
                                <div class="last-update">上次更新</div>
                                <div class="last-update-text">{{ Info.updateTime }}</div>
                            </div>
                        </div>
                        <div class="chart" id="chart"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import BackEndRequest from '../../../api/backend';
import * as echarts from 'echarts'
import dayjs from 'dayjs';

const Info = ref({})
let myChart = null


const chartProcess = (data) => {
    let dataMapByRiver = {}
    let dataMapByWarning = {}

    for (let i = 0; i < data.length; i++) {
        let item = data[i]
        if (!dataMapByRiver[item["riverName"]]) {
            dataMapByRiver[item["riverName"]] = []
            dataMapByRiver[item["riverName"]].push(item)
        } else {
            dataMapByRiver[item["riverName"]].push(item)
        }

        if (!dataMapByWarning[item["warningLevel"]]) {
            dataMapByWarning[item["warningLevel"]] = []
            dataMapByWarning[item["warningLevel"]].push(item)
        } else {
            dataMapByWarning[item["warningLevel"]].push(item)
        }
    }

    let warningByRiver = {
        '一级预警': [],
        '二级预警': [],
        '三级预警': [],
    }

    const sum = (arr) => {
        let total = 0
        for (let i = 0; i < arr.length; i++) {
            total += arr[i]
        }
        return total
    }

    for (let riverName in dataMapByRiver) {
        let level1, level2, level3
        level1 = level2 = level3 = 0
        let oneRiverData = dataMapByRiver[riverName]
        for (let i = 0; i < oneRiverData.length; i++) {
            oneRiverData[i]["warningLevel"] === 1 && level1++;
            oneRiverData[i]["warningLevel"] === 2 && level2++;
            oneRiverData[i]["warningLevel"] === 3 && level3++;
        }
        warningByRiver['一级预警'].push(level1)
        warningByRiver['二级预警'].push(level2)
        warningByRiver['三级预警'].push(level3)
    }

    // 分河段 柱状按预警堆叠图
    let series1 = []

    for (let i = 0; i < Object.keys(warningByRiver).length; i++) {

        let item = {
            name: Object.keys(warningByRiver)[i],
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: warningByRiver[Object.keys(warningByRiver)[i]]
        }
        series1.push(item)
    }

    let option1 = {
        color:
            ['rgb(219,25,35)', 'rgb(240,122,56)', 'rgb(35,94,243)']
        ,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // Use axis to trigger tooltip
                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: Object.keys(dataMapByRiver)
        },
        series: series1
    };

    let option2 = {
        color:
            ['rgb(219,25,35)', 'rgb(240,122,56)', 'rgb(35,94,243)']
        ,
        grid: {
            top: 50
        },
        // tooltip: {
        //     trigger: 'item'
        // },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '55%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    normal: {
                        formatter: '{b}:{c}',
                        show: true,
                        position: 'outside'
                    },

                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 15,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: sum(warningByRiver['一级预警']), name: '一级预警' },
                    { value: sum(warningByRiver['二级预警']), name: '二级预警' },
                    { value: sum(warningByRiver['三级预警']), name: '三级预警' },
                ]
            }
        ]
    }
    return [option1, option2]

}
let index = 0
const update = async() => {

    const data = (await BackEndRequest.getbankLineData()).data
    Info.value.banklineNum = data.length
    var now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    Info.value.updateTime = now;

    let optons = chartProcess(data)

    if (index === 0) {
        index = 1
    }
    else if (index === 1) {
        index = 0
    }
    var now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    Info.value.updateTime = now;
    myChart.clear()
    myChart.setOption(optons[index])
}


let updateInterval = null

onMounted(async () => {

    let chartdom = document.querySelector('#chart')
    myChart = echarts.init(chartdom);

    setTimeout(() => {
        update()
    }, 0);
    updateInterval= setInterval(() => {
        update()
    }, 6000);
})

onUnmounted(()=>{
    clearInterval(updateInterval)
})



</script>

<style lang="scss" scoped>
.bankLineRelate-contaniner {

    position: absolute;
    right: 1vw;
    top: 1vh;
    z-index: 5;
    width: 30vw;
    height: 35vh;
    background-color: rgb(229, 233, 236);
    box-shadow: 0px 0px 10px 1px #5e5d5dee;
    border-radius: 5px;

    .titlebox {
        width: 30vw;
        height: 7vh;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: #4074b5;


        .icon {
            width: 5vh;
            height: 5vh;
            margin-right: 1vw;
            background-image: url('/icons/collapse.png');
            background-size: contain;
            background-repeat: no-repeat
        }

        .title {
            line-height: 7vh;
            font-size: calc(1.0vh + 1.0vw);
            color: aliceblue;
            font-weight: 700;
            text-shadow: 2px 2px 0 #4074b5, 2px -2px 0 #4074b5, -2px 2px 0 #4074b5, -2px -2px 0 #4074b5, 2px 0px 0 #4074b5, 0px 2px 0 #4074b5, -2px 0px 0 #4074b5, 0px -2px 0 #4074b5;
        }
    }


    .card {
        width: 30vw;
        height: 28vh;

        .content {
            width: 30vw;
            height: 28vh;
            transform-style: preserve-3d;
            transition: transform 300ms;

            .back {
                background-color: rgb(229, 233, 236);
                position: absolute;
                width: 30vw;
                height: 28vh;
                border-radius: 5px;
                overflow: hidden;
                justify-content: center;
                display: flex;
                align-items: center;
                overflow: hidden;

                // &::before {
                //     position: absolute;
                //     content: " ";
                //     display: block;
                //     width: 60vw;
                //     height: 14vh;
                //     background: rgb(104, 175, 235);
                //     animation: rotation_481 5000ms infinite linear;
                // }

                .real-content {
                    position: absolute;
                    width: 29.5vw;
                    height: 27vh;
                    background-color: #eaebec;
                    border-radius: 5px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;

                    .desc-content {
                        width: 12vw;
                        height: 27vh;

                        .in-db-bank-container {
                            width: 12vw;
                            height: 6vh;
                            background-color: #eaebec;
                            display: flex;
                            flex-direction: row;
                            justify-content: space-evenly;

                            .in-db-bank {
                                line-height: 6vh;
                                font-size: calc(0.9vh + 0.8vw);
                                font-weight: 800;
                                color: #4074b5;

                            }

                            .in-db-bank-num {
                                line-height: 6vh;
                                font-size: calc(1.0vh + 1.0vw);
                                font-weight: 700;
                                color: #4074b5;
                                text-shadow: 2px 2px 0 #2fd0f8, 2px 2px 0 #d3d3d3;
                                transform: rotate(1deg)
                            }


                        }

                        .bank-desc {
                            width: 11.5vw;
                            height: 13vh;
                            background-color: #eff6ff;
                            color: #4074b5;
                            border-width: 2ps;
                            border-style: double;
                            border-color: #4074b5;
                            border-radius: 5px;


                            .bank-desc-text {
                                padding: 10px;
                                padding-top: 3px;
                                font-size: calc(0.8vh + 0.5vw);
                                font-weight: 600;
                                text-indent: 1em;
                            }
                        }

                        .last-update-containter {
                            width: 12vw;
                            height: 7vh;
                            background-color: #eaebec;
                            color: #4074b5;
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            align-items: center;

                            .last-update {
                                margin-left: 1vw;
                                line-height: 8vh;
                                font-size: calc(0.8vh + 0.6vw);
                                font-weight: 600;
                            }

                            .last-update-text {
                                width: 6vw;
                                text-align: center;
                                font-weight: 600;
                                color: #2e5381;
                                font-size: calc(0.6vh + 0.4vw);
                            }
                        }

                    }

                    .chart {
                        width: 17.5vw;
                        height: 27vh;
                        background-color: rgb(255, 255, 255);
                        border-radius: 10px;
                    }




                }
            }
        }


    }

}



@keyframes rotation_481 {
    0% {
        transform: rotateZ(0deg);
    }

    50% {
        transform: rotateZ(120deg);
    }

    100% {
        transform: rotateZ(180deg);
    }
}
</style>
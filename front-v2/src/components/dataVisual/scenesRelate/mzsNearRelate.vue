<template>
    <div class="bankLineRelate-contaniner">
        <div class="titlebox">
            <div class="icon"></div>
            <div class="title">民主沙近岸场景</div>
        </div>
        <div class="card">
            <div class="content">
                <div class="back">
                    <div class="real-content">

                        <div class="desc-content">
                            <div class="bank-desc">
                                <div class="bank-desc-text">
                                    民主沙近岸场景涵盖民主沙基础区划信息、重点岸段以及守护工程断面信息、沙洲南侧的预警分区信息以及近岸流场、三维地形的可视效果
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

    let option1 = {
        title: {
            left: 'center',
            text: '重点岸段和断面数量'
        },
        grid:{
          top:'45',
          bottom:'30',
          left:'25',  
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: ['守护工程断面', '重点岸段']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [10, 13],
                type: 'bar'
            }
        ]
    };

    return [option1]

}
let index = 0
const update = async () => {

    const data = (await BackEndRequest.getbankLineData()).data
    Info.value.banklineNum = data.length
    var now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    Info.value.updateTime = now;

    let optons = chartProcess(data)

    var now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    Info.value.updateTime = now;
    myChart.clear()
    myChart.setOption(optons[0])
}


let updateInterval = null

onMounted(async () => {

    let chartdom = document.querySelector('#chart')
    myChart = echarts.init(chartdom);


    update()

    // updateInterval = setInterval(() => {
    //     update()
    // }, 6000);
})

onUnmounted(() => {
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
            background-image: url('/icons/terrain.png');
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
                        width: 15vw;
                        height: 27vh;
                        scale: 1.1;
                        transform: translateX(10%) translateY(5%);

                        .bank-desc {
                            width: 12vw;
                            height: 17vh;
                            background-color: #eff6ff;
                            color: #4074b5;
                            border-width: 2ps;
                            border-style: double;
                            border-color: #4074b5;
                            border-radius: 5px;


                            .bank-desc-text {
                                padding: 10px;
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
                        width: 13.5vw;
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
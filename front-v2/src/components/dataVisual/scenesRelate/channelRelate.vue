<template>
    <div class="bankLineRelate-contaniner">
        <div class="titlebox">
            <div class="icon"></div>
            <div class="title">全江概貌场景</div>
        </div>
        <div class="card">
            <div class="content">
                <div class="back">
                    <div class="real-content">

                        <div class="desc-content">
                            <div class="in-db-bank-container">
                                <div class="in-db-bank">在库通道</div>
                                <div class="in-db-bank-num">{{ Info.channelNum + 1 }}</div>
                            </div>
                            <div class="bank-desc">
                                <div class="bank-desc-text">
                                    全江概貌场景涵盖长江江苏段已建成、在建以及规划中的三类过江通道以及全江基础地理信息。
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

    let builtNum = 0
    let buildingNum = 0
    let planningNum = 0
    for (let i = 0; i < data.length; i++) {
        let item = data[i]
        if (item.type === '规划通道') {
            planningNum++
        } else if (item.type === '已建通道') {
            builtNum++
        } else if (item.type === '在建通道') {
            buildingNum++
        }
    }


    let option = {
        legend: {
            top: 'bottom'
        },
        series: [
            {
                name: 'Nightingale Chart',
                type: 'pie',
                radius: [15, 80],
                center: ['50%', '40%'],
                roseType: 'area',
                itemStyle: {
                    borderRadius: 5
                },

                label: {
                    normal: {
                        fontSize: 15,
                        formatter: (params) => {
                            switch (params.name) {
                                case '规划通道':
                                    return "{planning|}" + '\n' + params.data.value + ' 条'
                                case '已建通道':
                                    return "{built|}" + '\n' + params.data.value + ' 条'
                                case '在建通道':
                                    return "{building|}" + '\n' + params.data.value + ' 条'
                            }
                        },
                        show: true,
                        position: 'outside',
                        rich: {
                            planning: {
                                height: 35,
                                align: 'left',
                                backgroundColor: {
                                    image: '/icons/planing.png'
                                }
                            },
                            built: {
                                height: 35,
                                align: 'left',
                                backgroundColor: {
                                    image: '/icons/gate.png'
                                }
                            },
                            building: {
                                height: 35,
                                align: 'left',
                                backgroundColor: {
                                    image: '/icons/building.png'
                                }
                            }
                        }
                    }
                },
                labelLine: {
                    showAbove: false,
                    length2: 5,
                },
                data: [
                    { value: builtNum, name: '已建通道' },
                    { value: buildingNum, name: '在建通道' },
                    { value: planningNum, name: '规划通道' },
                ]
            }
        ]
    };

    return option

}

const update = async () => {
    const data = (await BackEndRequest.getChannelData()).data
    Info.value.channelNum = data.length

    var now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    Info.value.updateTime = now;

    let opton = chartProcess(data)
    myChart.clear()
    myChart.setOption(opton)

}

let updateInterval = null
onMounted(async () => {

    let chartdom = document.querySelector('#chart')
    myChart = echarts.init(chartdom);


    update()


    updateInterval = setInterval(() => {
        update()
    }, 10 * 1000);

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
    height: 20vh;
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
            background-image: url('/river.png');
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

                &::before {
                    position: absolute;
                    content: " ";
                    display: block;
                    width: 60vw;
                    height: 14vh;
                    background: rgb(104, 175, 235);
                    animation: rotation_481 5000ms infinite linear;
                }

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
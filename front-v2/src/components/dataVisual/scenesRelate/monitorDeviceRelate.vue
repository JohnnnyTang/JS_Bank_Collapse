<template>
    <div class="monitorDevice-contaniner">
        <div class="titlebox">
            <div class="icon"></div>
            <div class="title">民主沙预警监测场景</div>
        </div>
        <div class="card">
            <div class="content">
                <div class="back">
                    <div class="real-content">
                        <div class="total-desc">
                            <div class="indb-device">
                                <div class="indb-device-title">已接入设备</div>
                                <div class="indb-device-num">{{ DeviceSum }}</div>
                            </div>
                            <div class="last-update">
                                <div class="last-update-title">上次更新</div>
                                <div class="last-update-text">{{ deviceInfos.updateTime }}</div>
                            </div>
                        </div>
                        <div class="content-content">
                            <div class="grid-container">

                                <div class="grid-item" v-for="(i) in 4" :key="i">
                                    <div class="device-detail-container">
                                        <div class="device-name-text">{{ DEVICETYPEMAP[i - 1] }} x {{ DEVICECOUNT[i - 1]
                                            }}</div>
                                        <div class="device-type-text"></div>
                                        <div class="device-pic">
                                            <img class="device-pic-img" :src="DEVICEPICMAP[i - 1]" alt>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="chart" class="chart" ref="chartDom">

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import BackEndRequest from '../../../api/backend';
import * as echarts from 'echarts'
import dayjs from 'dayjs';


const DEVICETYPEMAP = ['GNSS', '测斜仪', '水压力计', '应力桩']
const DEVICEPICMAP = ['/gnssBase.png', '/inclino.png', '/waterPress.png', '/changePress.png']
var DEVICECOUNT = [0, 0, 0, 0]
const deviceInfos = ref([])
const DeviceSum = ref(0)
let myChart = null
const chartDom = ref()

const countingStar = (arr) => {
    DEVICECOUNT = [0, 0, 0, 0]
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (item.type === '1') {
            DEVICECOUNT[0]++
        } else if (item.type === '4') {//4 是 测斜仪
            DEVICECOUNT[1]++
        } else if (item.type === '3') {
            DEVICECOUNT[2]++
        } else if (item.type === '2') {
            DEVICECOUNT[3]++
        }
        // else{
        //     // console.log('未知设备类型');
        //     console.log(item.type);
        // }
    }
    // console.log('sum of DEVICECOUNT', DEVICECOUNT[0]+DEVICECOUNT[1]+DEVICECOUNT[2]+DEVICECOUNT[3]);
    DeviceSum.value = DEVICECOUNT[0] + DEVICECOUNT[1] + DEVICECOUNT[2] + DEVICECOUNT[3]
}

const chartOption = () => {
    let option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: '已接入设备',
                type: 'pie',
                radius: ['20%', '70%'],
                center: ['50%', '55%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: DEVICECOUNT[0], name: 'GNSS' },
                    { value: DEVICECOUNT[1], name: '测斜仪' },
                    { value: DEVICECOUNT[2], name: '水压力计' },
                    { value: DEVICECOUNT[3], name: '应力桩' },
                ]
            }
        ]
    };
    return option
}


const updateInfo = async () => {
    const data = (await BackEndRequest.getMonitorInfo()).data
    countingStar(data)
    deviceInfos.value = data
    var now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    deviceInfos.value.updateTime = now;

    let option = chartOption()
    myChart.clear()
    myChart.setOption(option)

}


let updateInterval = null
onMounted(async () => {
    // console.log("123123");
    nextTick(async() => {

        myChart = echarts.init(chartDom.value)
        await updateInfo();
        myChart.hideLoading()

        updateInterval = setInterval(async () => {
            await updateInfo();
        }, 10 * 1000);
    })


})

onUnmounted(() => {
    clearInterval(updateInterval)
})

</script>

<style lang="scss" scoped>
.monitorDevice-contaniner {

    position: absolute;
    right: 1vw;
    top: 1vh;
    height: 20vh;
    z-index: 5;
    width: 30vw;
    height: 35vh;
    background-color: rgb(205, 211, 216);
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
            background-image: url('/icons/watching.png');
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
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;

                    .total-desc {
                        width: 29vw;
                        height: 5vh;
                        line-height: 5vh;
                        background-color: rgb(255, 255, 255);
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;

                        .indb-device {

                            width: 12vw;
                            height: 5vh;
                            display: flex;
                            flex-direction: row;
                            line-height: 5vh;

                            .indb-device-title {
                                text-align: center;
                                width: 6vw;
                                margin-left: 2vw;
                                font-size: calc(0.6vh + 0.8vw);
                                font-weight: 700;
                                color: #2668b9;
                            }

                            .indb-device-num {
                                text-align: center;
                                width: 2vw;
                                font-size: calc(0.6vh + 1vw);
                                font-weight: 600;
                                color: #0b4783;
                                text-shadow: 2px 2px 0 #1ed6ff, 2px 2px 0 #d3d3d3;
                                transform: rotate(1deg)
                            }


                        }

                        .last-update {

                            width: 12vw;
                            height: 5vh;
                            display: flex;
                            flex-direction: row;
                            line-height: 5vh;

                            .last-update-title {
                                width: 5vw;
                                font-size: calc(0.6vh + 0.8vw);
                                font-weight: 700;
                                color: #2668b9;

                            }

                            .last-update-text {
                                width: 6vw;
                                line-height: 2.5vh;
                                text-align: center;
                                font-size: calc(0.6vh + 0.4vw);
                                font-weight: 700;
                                color: #4b87cf;

                            }

                        }

                    }

                    .content-content {
                        width: 29vw;
                        height: 21vh;
                        background-color: #9c9c9c;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;

                        .grid-container {
                            width: 12vw;
                            height: 21vh;
                            background-color: bisque;
                            display: grid;
                            grid-template-columns: auto auto;
                            grid-template-rows: auto auto;

                            .grid-item {
                                border: 1px solid rgba(255, 255, 255, 0.8);
                                background-color: rgba(255, 255, 255, 0.8);
                                width: 6vw;
                                height: 10.5vh;

                                div.device-detail-container {
                                    width: 6vw;
                                    height: 10vh;
                                    position: relative;
                                    padding-top: 5px;
                                    padding-bottom: 5px;
                                    background-color: rgb(255, 255, 255);
                                    // flex: 1;
                                    box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.35);
                                    z-index: 1;
                                    color: rgb(37, 77, 200);

                                    div.device-name-text {
                                        position: relative;
                                        height: 1vh;
                                        line-height: 1vh;
                                        width: 6vw;
                                        // background-color: antiquewhite;
                                        text-align: center;

                                        font-family: "Trebuchet MS", Helvetica, sans-serif;
                                        font-size: calc(1.2vh + 0.2vw);
                                        text-shadow: 1px 1px 0 #bcbcbc;
                                        font-weight: 600;
                                    }

                                    div.device-pic {
                                        width: 6vw;
                                        height: 8vh;
                                        top: 0vh;
                                        left: 0.5vw;
                                        position: absolute;

                                        // padding-top: 56.25%;
                                        // margin-left: 7%;
                                        img.device-pic-img {
                                            pointer-events: none;
                                            position: absolute;
                                            top: 80%;
                                            left: 50%;
                                            width: 100%;
                                            height: 100%;
                                            transform: translate(-58%, -50%);
                                            transform-origin: 50%;
                                            z-index: 1;
                                        }
                                    }

                                }
                            }

                        }

                        .chart {
                            width: 17vw;
                            height: 22vh;
                            background-color: rgb(250, 250, 250);
                        }
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

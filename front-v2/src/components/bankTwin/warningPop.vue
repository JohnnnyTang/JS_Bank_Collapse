<template>
    <div class="warning-card">

        <div class="main">
            <div class="title">
                <div class="icon"></div>
                <div class="text titletext">警告！</div>
            </div>

            <hr>

            <div class="content">
                <div class="deviceType">
                    <div class="desc">设备信息</div>
                    <div class="text">{{ info.deviceType }}</div>
                </div>
                <div class="deviceID">
                    <div class="text">{{ info.deviceID }}</div>
                </div>
                <div class="reason">
                    <div class="desc">报警原因</div>
                    <div class="text">
                        <span
                            style="font-size: calc(0.5vh + 0.4vw); display: block; height: 40%; line-height:  calc(0.5vh + 0.4vw);">累计位移</span>
                        <span style="color: red; height: 60%;">{{ info.dif+' m' }}</span>
                    </div>
                </div>

                <div class="time">
                    <div class="desc">报警时间</div>
                    <!-- <div class="text">{{ time }}</div> -->
                    <div class="text">
                        <div class="date">{{ info.yymmdd }}</div>
                        <div class="second">{{ info.hhmmss }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="arrow"></div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import dayjs from 'dayjs'

const props = defineProps({
    warningInfo: Object
})

const deviceType = 'GNSS'
const deviceID = 'MZS1234567_7654321cm'
const reason = '14.684m'
// const yymmdd = dayjs().format('YYYY-MM-DD')
// const hhmmss = dayjs().format('HH:mm:ss')
const DEVICETYPEMAP = ['GNSS', '测斜仪', '水压力计', '应力桩']

const info = computed(() => {
    let infom = props.warningInfo.warningInfo
    let type ='GNSS'
    let time = dayjs(infom.warnTime)


    return {
        deviceType: type,
        yymmdd: time.format('YYYY-MM-DD'),
        hhmmss: time.format('HH:mm:ss'),
        deviceID: infom.deviceId,
        dif: infom.threeDiff.toFixed(4)

    }
})

onMounted(() => {
})


</script>

<style lang="scss" scoped>
.warning-card {
    // position: absolute;
    // left: 50%;
    // top: 50%;
    // transform: translateX(-50%) translateY(-50%);


    position: relative;
    width: 12vw;
    height: 18.5vh;
    user-select: none;

    div.main {
        position: relative;
        margin-top: 0.5vh;
        margin-left: 1vw;
        width: 11vw;
        height: 18vh;
        background-color: rgb(237, 239, 224);
        box-shadow: rgb(255, 193, 160) 0px 0px 25px 3px inset;
        border-radius: 5%;

        .title {
            width: 11vw;
            height: 5vh;
            display: flex;
            flex-direction: row;
            justify-content: center;
            // background-color: #e1c39b;

            .icon {
                width: 4vh;
                height: 4vh;
                background-size: contain;
                background-image: url('/alarm.png');
                margin-right: 1vw;
                margin-top: 0.5vh;
                line-height: 5vh;
                animation: warn .8s linear infinite;
            }

            .titletext {
                line-height: 5vh;
                font-size: calc(1.0vw + 0.8vh);
                color: rgb(253, 75, 75);
            }

        }

        hr {
            margin: 0;
            border-top-width: 2px;
            border-color: rgb(255, 0, 0);
        }

        .content {
            margin-top: 0.5vh;
            width: 11vw;
            height: 12vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;

            div.desc {
                width: 4vw;
                height: 2.5vh;
                font-size: calc(0.7vh + 0.5vw);
                font-weight: 600;
                background-color: rgba(255, 135, 111, 0.586);
                text-align: center;
                transform: translateX(-0.5vw) skew(-10deg);
            }

            div.text {
                height: 2.5vh;
                line-height: 2.5vh;
                font-size: calc(0.8vh + 0.6vw);
                font-family: "Trebuchet MS";
                color: rgba(54, 25, 92, 0.902);
            }

            .deviceType {
                height: 2.5vh;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                width: 11vw;

                .text {
                    width: 6vw;
                    text-align: right;
                }
            }

            .deviceID {
                height: 1.5vh;
                width: 11vw;
                transform: translateY(-20%);

                .text {
                    width: 11vw;
                    margin-left: 0vw;
                    font-size: calc(0.3vh + 0.4vw);
                    font-weight: 600;
                    text-align: center;

                }
            }

            .reason {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                margin-top: 1vh;
                text-align: right;

                .text {
                    width: 6vw;
                    font-size: calc(0.5vh + 0.5vw);

                }
            }

            .time {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                margin-top: 1.3vh;

                .text {
                    width: 5vw;
                    height: 3vh;
                    margin-left: 1.5vw;
                    text-align: center;
                    transform: translateY(-10%);

                    // line-height: 1.5vh;
                    // font-size: calc(0.3vh + 0.5vw);
                    .date {
                        width: 5vw;
                        height: 1.3vh;
                        line-height: 1.3vh;
                        font-size: 1.2vh;
                        // font-size: calc(0.3vh + 0.5vw);
                    }

                    .second {
                        width: 5vw;
                        height: 1.7vh;
                        line-height: 1.7vh;
                        font-size: 1.6vh;
                        color: red;
                    }
                }
            }

        }

    }


    div.text {
        line-height: 4vh;
        font-family: "Trebuchet MS", Helvetica, sans-serif;
        font-weight: 600;


    }

    div.arrow {
        position: absolute;
        left: 45%;
        bottom: -0.5vh;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 15px solid rgb(244, 215, 190);
    }
}


@keyframes warn {

    0%,
    100% {
        margin-top: 0.5vh;
        transform: scale(1.0);
    }

    50% {
        margin-top: 0;
        transform: scale(1.1);
    }
}
</style>
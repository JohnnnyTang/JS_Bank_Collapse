<template>
    <div class="container" v-show="true">
        <div class="info-content-container">
            <div class="device-detail-container">
                <div class="device-name-text">{{ DEVICETYPEMAP[(+deviceInfo.type) - 1] }}</div>
                <div class="device-pic">
                    <img class="device-pic-img" :src="imgSrcPrefix + deviceInfo.code + '.jpg'" alt>
                </div>
                <div class="bank-status-container">
                    <div class="device-bank-info">
                        <div class="device-bank-title">监测岸段</div>
                        <div class="device-bank-text">{{ STATIONMAP[deviceInfo.stationCode] }}</div>
                    </div>
                </div>
                <div class="device-button-container" v-show="buttonShow">
                    <div class="device-status-button" @click="clickbuttonHandler">
                        查看图表 </div>
                </div>
            </div>
            <div class="detail-info-container">
                <div class="detail-info-flex">
                    <div class="device-id">{{ deviceInfo.code }}</div>
                    <div class="device-type-container detail-double-container">
                        <div class="device-type-title detail-title-item">设备编号</div>
                        <div class="device-type-content detail-content-item">
                            {{ deviceInfo.machineId }}</div>
                    </div>
                    <div class="device-user-container detail-double-container">
                        <div class="device-user-title detail-title-item">监测岸段</div>
                        <div class="device-user-content detail-content-item">
                            {{ getBankName(deviceInfo.stationCode) }}</div>
                    </div>
                    <div class="device-loc-container detail-single-container">
                        <div class="device-loc-title detail-title-item">安装位置</div>
                        <div class="device-loc-content detail-content-item">{{ deviceInfo.longitude
                            +
                            ',' + deviceInfo.latitude }}</div>
                    </div>
                    <div class="device-time-container detail-double-container">
                        <div class="device-time-title detail-title-item">安装时间</div>
                        <div class="device-time-content detail-content-item">{{ deviceInfo.inTime }}
                        </div>
                    </div>
                    <div class="device-ele-container detail-double-container">
                        <div class="device-elevation-title detail-title-item">安装高程</div>
                        <div class="device-elevation-content detail-content-item">
                            {{ elevation }}m</div>
                    </div>
                </div>
            </div>

            <div class="chart" v-if="showChart">
                <pureChart @close="showChart = false"></pureChart>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, onBeforeMount, watch } from 'vue';
import pureChart from '../monitorDevice/pureChart.vue';
import { useBankInfoStore } from '../../../store/bankInfoStore';
import { useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps({
    deviceInfo: Object,
    zoom: Object
})


const getBankName = () => {
    const bankEnName = route.params.id
    console.log('getBankName:', useBankInfoStore().bankList, bankEnName)
    let bankItem = useBankInfoStore().bankList.find(item => item.bank === bankEnName)
    return bankItem.name
}



const showChart = ref(false)
const buttonShow = ref(false)
const buttonTxt = ref("查看图表")
const elevation = ref((5 + Math.random()).toFixed(1))
const show = computed(() => {
    if (props.zoom.value > 10)
        return true
    return false
})
// const imgSrcPrefix = 'http://localhost:5173//device/all/'
const imgSrcPrefix = 'http://' + window.location.host + '//monitorImg/all/'

console.log('imgSrcPrefix:', imgSrcPrefix)



const deviceInfo = props.deviceInfo
const STATIONMAP = {
    'MZS': '民主沙'
}
const DEVICETYPEMAP = ['GNSS', '应力桩', '水压力计', '测斜仪', '', '摄像头']
const DEVICEPICMAP = ['/gnssBase.png', '/changePress.png', '/waterPress.png', '/inclino.png']

const clickbuttonHandler = () => {
    showChart.value = !showChart.value
    buttonTxt.value = showChart.value ? "设备概要" : "查看图表"
}

onBeforeMount(() => {
    // console.log('monitorDetailV2 onBeforeMount!!!');
})
onMounted(async () => {
    // console.log('monitorDetailV2 onMounted!!!');
    deviceInfo.value["status"] = '正常运行';
    deviceInfo.value["updating"] = false;

    if (deviceInfo.value.type === '6') {
        buttonShow.value = false
    } else {
        buttonShow.value = true
    }

})


</script>

<style lang="scss" scoped>
.container {
    position: relative;
    display: block;
    // width: 25vw;
    width: 24vw;
    height: 30vh;
    transform: scale(0.7) translateY(15%);
    background-color: #ffffff;
}

div.info-content-container {
    user-select: none;
    width: 24vw;
    height: 30vh;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // transform: translateY(-2%) scale(0.9);

    div.device-detail-container {
        width: 10vw;
        height: calc(37vh - 10px);
        position: relative;
        padding-top: 5px;
        padding-bottom: 5px;
        background-color: rgb(218, 236, 251);
        // flex: 1;
        box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.35);
        z-index: 1;
        color: rgb(37, 77, 200);

        div.device-name-text {
            position: relative;
            height: 6vh;
            line-height: 6vh;
            width: 10vw;
            // background-color: antiquewhite;
            text-align: center;

            font-family: "Trebuchet MS", Helvetica, sans-serif;
            font-size: calc(1.2vh + 1.0vw);
            text-shadow: 1px 1px 0 #bcbcbc, 2px 2px 0 #9c9c9c;
            font-weight: 600;
        }

        div.device-pic {
            position: relative;
            margin-bottom: 10%;
            width: 10vw;
            height: 12vh;
            // background-color: rgb(127, 138, 255);

            img.device-pic-img {
                pointer-events: none;
                position: absolute;
                height: calc(9vh + 5.8vw);
                width: calc((9vh + 5.8vw) * 0.76);
                transform: scale(1.05) translateX(10%);
                transform-origin: 50%;
                z-index: 1;
                box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
            }
        }

        div.bank-status-container {
            position: relative;
            width: 9.5vw;
            margin-top: 10vh;

            display: flex;
            justify-content: center;
            // align-items: start;

            div.device-bank-info {
                font-family: "Trebuchet MS", Helvetica, sans-serif;
                font-size: calc(0.5vh + 0.5vw);
                font-weight: 400;
                font-family: 'Microsoft YaHei';
                text-align: center;

                div.device-bank-title {
                    text-align: center;
                    font-size: calc(0.7vh + 0.5vw);
                    font-weight: 600;
                    margin-bottom: 0.1vh;
                }
            }
        }


        div.device-button-container {
            position: absolute;
            left: 2vw;
            width: 8vw;
            bottom: -1.5vh;
            height: 3vh;
            font-size: calc(0.2vh + 0.75vw);
            font-weight: 600;
            transform: translateY(-50%);

            div.device-status-button {
                margin-top: 0vh;
                height: 3vh !important;
                width: 6vw;
                line-height: 3vh;
                text-align: center;
                // background-color: aliceblue;
                color: #ffffffe6;

                box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.35);
                background: radial-gradient(ellipse at center, #2692da 0%, #0529ac 100%);
                transition: all ease-in-out 0.3s;

                &:hover {
                    cursor: pointer;
                    box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.5);
                    color: #ffffff;
                }
            }
        }
    }

    div.detail-info-container {
        width: 20vw;
        height: 33vh;
        background-color: rgb(163, 206, 245);
        box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.35);
        position: relative;
        padding-left: .5vw;
        padding-right: .5vw;
        padding-top: 0vh;
        color: rgb(47, 94, 211);

        div.detail-info-flex {
            width: 21.5vw;
            height: 29vh;
            margin-top: 2vh;
            // background-color: aliceblue;

            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            align-items: center;
            align-content: center;

            div.device-id {
                height: 4vh;
                width: 23vw;
                // background-color: antiquewhite;
                text-align: center;

                // line-height: 3vh;
                font-family: "Microsoft YaHei", sans-serif;
                font-size: calc(0.6vh + 0.75vw);
                font-weight: 600;
                color: rgb(0, 0, 0);
                transform: translateX(-5%);
                // padding-bottom: 0.3vh;
            }

            div.detail-double-container {
                width: 9vw;
                height: 8vh;
                // background-color: aqua;
                display: flex;
                flex-flow: column nowrap;
                font-family: 'Microsoft YaHei';

                &.device-time-container {
                    width: 12vw;
                }
            }

            div.detail-single-container {
                width: 20vw;
                height: 8vh;
                // background-color: aqua;
                display: flex;
                flex-flow: column nowrap;
                font-family: 'Microsoft YaHei';
            }

            div.detail-title-item {
                height: 3.5vh;
                width: 6vw;
                line-height: 3.5vh;

                font-size: calc(1vh + 0.5vw);
                font-weight: 600;

                &.device-user-title,
                &.device-elevation-title {
                    text-align: right;
                }
            }

            div.detail-content-item {
                height: 2.5vh;
                width: 6vw;
                line-height: 2.5vh;
                font-size: calc(0.8vh + 0.6vw);
                font-family: "Trebuchet MS";
                color: rgba(54, 25, 92, 0.902);

                &.device-user-content,
                &.device-elevation-content {
                    text-align: right;
                }

                &.device-user-content {
                    width: 6vw;
                }

                &.device-time-content {
                    width: 12vw;
                }
            }
        }

    }

    div.chart {
        width: 32vw;
        height: 38vh;
        position: absolute;
        z-index: 1;
        // left: 8vw;
        left: 0;
    }

}
</style>
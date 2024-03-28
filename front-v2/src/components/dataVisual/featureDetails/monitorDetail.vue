<template>
    <div class="container">
        <!-- <div class="device-info-container"> -->
        <div class="info-content-container">
            <div class="device-detail-container">
                <div class="device-name-text">{{ DEVICETYPEMAP[(+deviceInfo.type) - 1] }}</div>
                <div class="device-type-text"></div>
                <div class="device-pic">
                    <img class="device-pic-img" :src="DEVICEPICMAP[(+deviceInfo.type) - 1]" alt>
                </div>
                <div class="bank-status-container">
                    <div class="device-bank-info">
                        <div class="device-bank-title">监测岸段</div>
                        <div class="device-bank-text">{{ STATIONMAP[deviceInfo.stationCode] }}</div>
                    </div>
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
                        <div class="device-user-title detail-title-item">录入人员</div>
                        <div class="device-user-content detail-content-item">
                            {{ deviceInfo.operateUser }}</div>
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
                            {{ deviceInfo.elevation }}</div>
                    </div>
                </div>
                <div class="device-button-container">
                    <div class="device-status-button"
                        @click="updateDeviceStatus((+deviceInfo.type) - 1, deviceInfo.code, index)">
                        查看图表</div>
                </div>
            </div>
        </div>
        <!-- </div> -->
    </div>


</template>

<script setup>
import { onMounted, ref } from 'vue';
import BackEndRequest from '../../../api/backend';

const deviceInfo = ref({})
const STATIONMAP = {
    'MZS': '民主沙'
}
const DEVICETYPEMAP = ['GNSS', '测斜仪', '水压力计', '应力桩']
const DEVICEPICMAP = ['/device/gnssBase.png', '/device/inclino.png', '/device/waterPress.png', '/device/changePress.png']

onMounted(async () => {

    deviceInfo.value = (await BackEndRequest.getMonitorInfo()).data[3];

    deviceInfo.value["status"] = '正常运行';
    deviceInfo.value["updating"] = false;

})

</script>

<style lang="scss" scoped>

div.info-content-container {
    user-select: none;
    width: 25vw;
    position: relative;
    margin-left: 2vw;
    height: 34vh;
    display: flex;
    justify-content: space-between;
    align-items: center;

    div.device-detail-container {
        width: 8vw;
        height: calc(34vh - 10px);
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
            width: 8vw;
            // background-color: antiquewhite;
            text-align: center;

            font-family: "Trebuchet MS", Helvetica, sans-serif;
            font-size: calc(1.2vh + 1.0vw);
            text-shadow: 1px 1px 0 #bcbcbc, 2px 2px 0 #9c9c9c;
            font-weight: 600;
        }

        div.device-type-text {
            position: relative;
            height: 2vh;
            line-height: 2vh;
            width: 8vw;
            left: 0.5vw;
            text-align: center;

            font-family: "Trebuchet MS", Helvetica, sans-serif;
            font-size: calc(0.6vh + 0.4vw);
            font-weight: 400;
        }

        div.device-pic {
            position: relative;
            padding-top: 56.25%;
            margin-bottom: 40%;
            // background-color: rgb(127, 138, 255);

            img.device-pic-img {
                position: absolute;
                top: 80%;
                left: 50%;
                width: 125%;
                height: 135%;
                transform: translate(-58%, -50%);
                transform-origin: 50%;
                z-index: 1;
            }
        }

        div.bank-status-container {
            position: relative;
            width: 8.5vw;
            margin-top: 8.5vh;

            display: flex;
            justify-content: center;

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
                    margin-bottom: 0.75vh;
                }
            }
        }
    }

    div.detail-info-container {
        width: 16vw;
        height: 31vh;
        background-color: rgb(163, 206, 245);
        box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.35);
        position: relative;
        padding-left: 1.5vw;
        padding-top: 0vh;
        color: rgb(47, 94, 211);

        div.detail-info-flex {
            width: 14vw;
            height: 29vh;
            // background-color: aliceblue;

            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            align-items: center;
            align-content: center;

            div.device-id {
                height: 4vh;
                width: 14vw;
                // background-color: antiquewhite;
                text-align: center;

                // line-height: 3vh;
                font-family: "Trebuchet MS", Helvetica, sans-serif;
                font-size: calc(0.4vh + 0.7vw);
                font-weight: 600;
                color: rgb(103, 129, 201);
                // padding-bottom: 0.3vh;
            }

            div.detail-double-container {
                width: 6vw;
                height: 8vh;
                // background-color: aqua;
                display: flex;
                flex-flow: column nowrap;
                font-family: 'Microsoft YaHei';

                &.device-time-container {
                    width: 8vw;
                }
            }

            div.detail-single-container {
                width: 14vw;
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

                &.device-time-content {
                    width: 8vw;
                }
            }
        }

        div.device-button-container {
            position: absolute;
            width: 10vw;
            height: 3.8vh;
            right: 1vw;
            font-size: calc(0.2vh + 0.75vw);
            font-weight: 600;
            div.device-status-button {
                height: 3.8vh !important;
                width: 8vw;
                line-height: 3.5vh;
                text-align: center;
                // background-color: aliceblue;
                color: #ffffffe6;

                box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.35);
                background: radial-gradient(ellipse at center, #2692da 0%, #0529ac 100%);
                transition: all ease-in-out 0.3s;

                &:hover {
                    cursor: pointer;
                    height: 4vh !important;
                    box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.5);
                    color: #ffffff;
                }
            }
        }
    }
}
</style>
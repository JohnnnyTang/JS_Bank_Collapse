<template>
    <div class="deviceManage-container">
        <div class="device-content-container">
            <el-skeleton style="width: 88vw; height: 90vh;" :loading="loading" animated>
                <template #template>
                    <div class="skeleton-container">
                        <el-skeleton-item v-for="i in 12" :key="i" variant="rect" style="width: 20vw; height: 28vh;" />
                    </div>
                </template>
                <template #default>
                    <el-scrollbar height="90vh">
                        <div class="device-scroll-container">
                            <div class="device-info-container" v-for="(deviceInfo, index) in deviceCardInfoList">
                                <div class="info-content-container">
                                    <div class="device-detail-container">
                                        <div class="device-name-text">{{ deviceInfo.machineId }}</div>
                                        <div class="device-type-text">{{ deviceInfo.code }}</div>
                                        <div class="device-pic">
                                            <img class="device-pic-img" :src="DEVICEPICMAP[(+deviceInfo.type) - 1]" alt>
                                        </div>
                                        <div class="bank-status-container">
                                            <div class="device-bank-info">
                                                <div class="device-bank-title">监测岸段</div>
                                                <div class="device-bank-text">{{ STATIONMAP[deviceInfo.stationCode] }}</div>
                                            </div>
                                            <div class="device-status-info">
                                                <div class="device-status-title">运行状态</div>
                                                <svg v-if="deviceInfo.updating" version="1.1" id="Layer_1"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="3.6vw"
                                                    height="3vh" viewBox="0 0 18 24"
                                                    style="enable-background:new 0 0 50 50;" xml:space="preserve">
                                                    <rect x="0" y="0" width="4" height="16" fill="#333">
                                                        <animate attributeName="opacity" attributeType="XML"
                                                            values="1; .2; 1" begin="0s" dur="0.8s"
                                                            repeatCount="indefinite" />
                                                    </rect>
                                                    <rect x="7" y="0" width="4" height="16" fill="#333">
                                                        <animate attributeName="opacity" attributeType="XML"
                                                            values="1; .2; 1" begin="0.4s" dur="0.8s"
                                                            repeatCount="indefinite" />
                                                    </rect>
                                                    <rect x="14" y="0" width="4" height="16" fill="#333">
                                                        <animate attributeName="opacity" attributeType="XML"
                                                            values="1; .2; 1" begin="0.6s" dur="0.8s"
                                                            repeatCount="indefinite" />
                                                    </rect>
                                                </svg>
                                                <div class="device-status-text"
                                                    :class="[(deviceInfo.status == '正常运行') ? greenStatus : redStatus]" v-else>
                                                    {{ deviceInfo.status }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="detail-info-container">
                                        <div class="detail-info-flex">
                                            <div class="device-id">{{ deviceInfo.code }}</div>
                                            <div class="device-type-container detail-double-container">
                                                <div class="device-type-title detail-title-item">设备类别</div>
                                                <div class="device-type-content detail-content-item">
                                                    {{ DEVICETYPEMAP[(+deviceInfo.type) - 1] }}</div>
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
                                                更新状态</div>
                                            <div class="device-log-button"
                                                @click="genDeviceDataLog((+deviceInfo.type) - 1, deviceInfo.code, index)">
                                                生成报表</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </template>
            </el-skeleton>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { saveAs } from 'file-saver';
import axios from "axios";
const loading = ref(true);
// const updatingStatus = ref(false);
const STATIONMAP = {
    'MZS': '民主沙'
}
const DEVICETYPEMAP = ['GNSS', '测斜仪', '水压力计', '应力桩']
const DEVICETYPEREQUESTMAP = ['data/gnssData', 'data/inclinometerData', 'data/manometerData', 'data/stressData']
const DEVICETYPEREQUESTINFOMAP = ['data/gnssInfo', 'data/inclinometerInfo', 'data/manometerInfo', 'data/stressInfo']
const DEVICEPICMAP = ['/gnssBase.png', '/inclino.png', '/waterPress.png', '/changePress.png']
// const statusText = ref('正常运行');
const greenStatus = ref('green-text');
const redStatus = ref('red-text');

const backendInstance = axios.create({
    // baseURL: Vue.prototype.baseURL,
    baseURL: '/api',
})

const deviceCardInfoList = ref([]);
const updateDeviceStatus = async (deviceTypeCode, deviceId, deviceIndex) => {
    deviceCardInfoList.value[deviceIndex]["updating"] = true;
    // console.log(deviceTypeCode, deviceId);
    const status = (await backendInstance.get(DEVICETYPEREQUESTMAP[deviceTypeCode] + '/checkDevice/minute/' + '60/' + deviceId)).data;
    // console.log(status);
    deviceCardInfoList.value[deviceIndex].status = status ? '正常运行' : '无数据';
    setTimeout(() => {
        deviceCardInfoList.value[deviceIndex]["updating"] = false;
    }, 800);
}

const genDeviceDataLog = async (deviceTypeCode, deviceId, index) => {
    // deviceCardInfoList.value[deviceIndex]["updating"] = true;
    // console.log(deviceTypeCode, deviceId);
    let outputText = '设备报表\n';
    for(let key in deviceCardInfoList.value[index]) {
        outputText += (key+ ":" + deviceCardInfoList.value[index][key] + '\n');
    }
    if (deviceTypeCode != 0) {
        const detailInfo = (await backendInstance.get(DEVICETYPEREQUESTINFOMAP[deviceTypeCode] + '/id/' + deviceId)).data;
        for (let key in detailInfo) {
            outputText += (key + ': ' + detailInfo[key] + '\n');
        }
    }
    const deviceData = (await backendInstance.get(DEVICETYPEREQUESTMAP[deviceTypeCode] + '/hour/12/device/' + deviceId)).data;
    // console.log(status);
    for (let key in deviceData[0]) {
        outputText += (key + ',');
    }
    outputText += '\n';
    for (let aData of deviceData) {
        console.log(aData)
        for (let val of Object.values(aData)) {
            outputText += (val + ',')
        }
        outputText += '\n';
    }
    const blob = new Blob(["\uFEFF" + outputText], {
        //加bom头
        type: "text/plain;charset=utf-8",
    });
    saveAs(blob, deviceId+'log.txt');
}


onMounted(async () => {
    deviceCardInfoList.value = (await backendInstance.get('/data/monitorInfo')).data;
    for (let deviceInfo of deviceCardInfoList.value) {
        deviceInfo["status"] = '正常运行';
        deviceInfo["updating"] = false;
    }
    // console.log(deviceCardInfoList.value);
    loading.value = false;
})


</script>

<style lang="scss" scoped>
div.deviceManage-container {
    height: 93vh;
    width: 100vw;
    // background-color: aquamarine;
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("/wave-bg.png");

    div.device-content-container {
        position: relative;
        width: 88vw;
        height: 90vh;
        background-color: rgba(125, 163, 198, 0.664);
        left: 6vw;
        top: 1.5vh;
        // display: flex;
        // flex-flow: row wrap;

        // justify-content: space-around;
        // align-content: space-around;

        border-radius: 8px;
        backdrop-filter: blur(6px);
        box-shadow: 0.5vh 0.5vh 0.3vh 0.2px #68aed197;
        border-style: solid;
        border-color: rgba(125, 163, 198, 0.8);


        div.skeleton-container {
            width: 88vw;
            height: 90vh;
            display: flex;
            flex-flow: row wrap;
            justify-content: space-around;
            align-content: space-around;
        }

        div.device-scroll-container {
            width: 86vw;
            height: fit-content;
            padding-top: 2vh;
            display: flex;
            flex-flow: row wrap;
            justify-content: flex-start;
            align-content: space-around;
            padding-left: 1.6vw;

            row-gap: 12vh;

            // background-color: aqua;

            div.device-info-container {
                width: 28vw;
                height: 29vh;
                // background-color: aliceblue;

                div.info-content-container {
                    width: 25vw;
                    position: relative;
                    left: 2vw;
                    height: 34vh;

                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    div.device-detail-container {
                        width: 9vw;
                        height: calc(34vh - 10px);
                        position: relative;
                        padding-top: 5px;
                        padding-bottom: 5px;
                        background-color: rgb(20, 49, 77);
                        // flex: 1;
                        box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.35);
                        z-index: 1;
                        color: aliceblue;

                        div.device-name-text {
                            position: relative;
                            height: 4vh;
                            line-height: 4vh;
                            width: 8vw;
                            left: 0.5vw;
                            // background-color: antiquewhite;
                            text-align: center;

                            font-family: "Trebuchet MS", Helvetica, sans-serif;
                            font-size: calc(0.5vh + 0.7vw);
                            font-weight: 600;
                        }

                        div.device-type-text {
                            position: relative;
                            height: 4vh;
                            // line-height: 3vh;
                            width: 8vw;
                            left: 0.5vw;
                            // background-color: antiquewhite;
                            text-align: center;

                            font-family: "Trebuchet MS", Helvetica, sans-serif;
                            font-size: calc(0.4vh + 0.3vw);
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
                                width: 155%;
                                height: 165%;
                                // transform: rotate(-5deg) translate(-50%, -50%);
                                transform: translate(-58%, -50%);
                                transform-origin: 50%;
                                z-index: 1;
                            }
                        }

                        div.bank-status-container {
                            position: relative;
                            width: 8.5vw;
                            margin-top: 8.5vh;
                            left: 0.25vw;

                            display: flex;
                            justify-content: space-between;

                            div.device-bank-info {
                                font-family: "Trebuchet MS", Helvetica, sans-serif;
                                font-size: calc(0.5vh + 0.5vw);
                                font-weight: 400;
                                font-family: 'Microsoft YaHei';

                                div.device-bank-title {
                                    font-size: calc(0.7vh + 0.5vw);
                                    font-weight: 600;
                                    margin-bottom: 0.75vh;
                                }
                            }

                            div.device-status-info {
                                font-family: "Trebuchet MS", Helvetica, sans-serif;
                                font-size: calc(0.7vh + 0.5vw);
                                font-weight: 400;
                                font-family: 'Microsoft YaHei';

                                div.device-status-title {
                                    font-size: calc(0.7vh + 0.5vw);
                                    font-weight: 600;
                                    margin-bottom: 0.75vh;
                                    text-align: right;
                                }

                                div.device-status-text {
                                    text-align: right;
                                    font-size: calc(0.5vh + 0.5vw);

                                    &.green-text {
                                        color: rgb(95, 222, 45);
                                    }

                                    &.red-text {
                                        color: rgb(215, 65, 0);
                                    }
                                }

                                svg path,
                                svg rect {
                                    fill: #00c3ff;
                                }
                            }
                        }
                    }

                    div.detail-info-container {
                        width: 14.5vw;
                        height: 31vh;
                        background-color: rgb(30, 65, 97);
                        box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.35);

                        padding-left: 1.5vw;
                        padding-top: 0vh;
                        color: rgba(206, 232, 255, 0.932);

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
                                color: rgb(255, 255, 255);
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
                                color: rgba(255, 219, 197, 0.902);

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
                            right: 0.6vw;
                            // background-color: aqua;

                            display: flex;
                            flex-flow: row nowrap;
                            justify-content: space-between;
                            text-align: center;

                            font-size: calc(0.2vh + 0.75vw);
                            font-weight: 600;


                            div.device-status-button {
                                height: 3.8vh !important;
                                width: 4.3vw;
                                line-height: 3.5vh;
                                // background-color: aliceblue;
                                color: #ffffffe6;

                                box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.35);
                                background: radial-gradient(ellipse at center, #2692da 0%, #0529ac 100%);
                                transition: all ease-in-out 0.3s;

                                &:hover {
                                    cursor: pointer;
                                    height: 3.6vh !important;
                                    width: 4.2vw;
                                    box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.5);
                                    color: #ffffff;
                                }
                            }

                            div.device-log-button {
                                height: 3.8vh !important;
                                width: 4.3vw;
                                line-height: 3.5vh;
                                // background-color: aliceblue;
                                color: #ffffffe6;

                                box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.35);
                                background: radial-gradient(ellipse at center, #2692da 0%, #0529ac 100%);
                                transition: all ease-in-out 0.3s;

                                &:hover {
                                    cursor: pointer;
                                    height: 3.6vh !important;
                                    width: 4.2vw;
                                    box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.5);
                                    color: #ffffff;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// :deep(.el-skeleton__item) {
//     background: rgb(88, 105, 121) !important;
//     background-size: 400% 100%;
// }</style>
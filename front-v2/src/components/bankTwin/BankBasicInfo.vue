<template>
    <div class="basic-info-container">
        <e-border-box-3 text="基本信息" background-color="#0446a8">
            <div class="basic-info-content">
                <div class="title-container">{{ info["name"] }}示范段</div>
                <!-- <div class="splitter-container">
                    <dv-decoration5
                        :dur="4"
                        :color="['#0446a8', 'rgb(28, 105, 247)']"
                        style="height: 2vh; background-color: transparent"
                    />
                </div> -->
                <div class="key-val-container">
                    <div class="key-text">预警级别：</div>
                    <div class="val-text">{{ info["riskLevel"] }}</div>
                </div>
                <div class="key-val-container">
                    <div class="key-text">监测长度：</div>
                    <div class="val-text">全长{{ info["monitorLength"] }}</div>
                </div>
                <div class="key-val-container">
                    <div class="key-text">布设监测设备：</div>
                    <div class="val-text"> {{ info["deviceNum"] }} 台</div>
                </div>
                <div class="key-val-container">
                    <div class="key-text">持续监测时间：</div>
                    <div class="val-text">{{ distanceOpenTime(info['monitorStartTime']) }}</div>
                </div>
            </div>
        </e-border-box-3>
    </div>
</template>

<script setup>
import { EBorderBox3 } from 'e-datav-vue3'
import axios from 'axios';
import BackEndRequest from '../../api/backend';
import { onMounted, reactive, watch } from 'vue';
import { useBankNameStore } from '../../store/bankNameStore';

const bankNameStore = useBankNameStore()
const info = reactive({
    "name": '',
    "riskLevel": '',
    "monitorLength": '',
    "monitorStartTime": '2024-04-20',
    "deviceNum": 0
})



function distanceOpenTime(showTime) {
    //   let timer = showTime

    const currentTime = new Date()
    const targetTime = new Date(showTime)

    // 计算时间差（以毫秒为单位）
    const timeDiff = currentTime.getTime() - targetTime.getTime()

    // 将时间差转换为小时、分钟和秒数
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    //   const hours = Math.floor(timeDiff / (1000 * 60 * 60) % 24)
    //   const minutes = Math.floor((timeDiff / (1000 * 60)) % 60)
    //   const seconds = Math.floor((timeDiff / 1000) % 60)

    //   let ret = `${days} 天 ${hours} 小时 ${minutes} 分`
    let ret = `${days} 天`

    return ret
}

const updateInfo = async () => {
    BackEndRequest.getBankBasicInfo().then(res => {
        info.name = res.data.name
        info.riskLevel = res.data.riskLevel
        info.monitorLength = res.data.monitorLength
        info.monitorStartTime = res.data.monitorStartTime

        BackEndRequest.getMonitorInfo().then(res => {
            // console.log('device NUm is ', res.length)
            info.deviceNum = res.length
        })
    })
}

watch(() => bankNameStore.globalBankName, (newV, oldV) => {
    updateInfo()
})

onMounted(() => {
    updateInfo()
})




</script>

<style lang="scss" scoped>
div.basic-info-container {
    position: absolute;
    z-index: 3;
    left: 1vw;
    top: 3vh;
    width: 26vw;
    height: 14vh;

    // background-color: aliceblue;

    div.basic-info-content {
        width: 100%;
        height: 100%;
        border-radius: 16px;
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        justify-content: center;

        div.title-container {
            margin-top: 1.4vh;
            height: 3.6vh;
            line-height: 3.6vh;
            width: 100%;
            background-color: transparent;
            text-align: center;
            font-size: calc(0.8vw + 0.8vh);
            font-weight: bold;
            color: #0400fd;
            text-shadow:
                #eef3ff 1px 1px,
                #eef3ff 2px 2px,
                #6493ff 3px 3px;
            letter-spacing: 0.4rem;
        }

        div.splitter-container {
            height: 2vh;
            width: 100%;
            background-color: transparent;
        }

        div.key-val-container {
            // margin-top: 0.4vh;
            width: 48%;
            height: 4vh;
            display: flex;
            flex-flow: row wrap;
            // background-color: #0446a8;
            text-align: center;
            border-bottom: 2px solid rgb(0, 32, 175);
            letter-spacing: 0.2rem;


            div.icon {
                width: 20%;
                height: 3vh;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: 50% 50%;
                background-color: transparent;

                &#warning-icon {
                    background-image: url('/warning.png');
                }

                &#length-icon {
                    background-image: url('/distance.png');
                }
            }

            div.key-text {
                width: fit-content;
                line-height: 4vh;
                background-color: transparent;
                font-size: calc(0.7vw + 0.6vh);
                color: #0043fd;
            }

            div.val-text {
                line-height: 4vh;
                font-size: calc(0.7vw + 0.5vh);
                font-weight: bold;
                color: #1d00be;
                // text-align: center;
            }

            &:nth-child(2n) {
                text-align: left;

                // padding-left: 6%;
                // border-right: 2px solid rgb(0, 32, 175);
            }

            &:nth-child(2n + 1) {
                text-align: right;
                justify-content: flex-end;
                // padding-right: 6%;
                // border-left: 2px solid rgb(0, 32, 175);
            }
        }

        // background-color: aliceblue;
    }
}

:deep(.e-border-box-3) {
    backdrop-filter: blur(12px);
    box-shadow: 4px 8px 8px -4px rgb(0, 47, 117);
    background-color: rgba(156, 195, 255, 0.4);
    border-radius: 8px;
    border: 2px solid rgb(28, 105, 247);
}

:deep(.e-border-box-3 div:first-of-type) {
    --height: 3vh;
    font-size: calc(0.6vw + 0.6vh);
    color: rgb(212, 255, 253);
    --color: #0446a8;
    background-color: var(--color);
}
</style>

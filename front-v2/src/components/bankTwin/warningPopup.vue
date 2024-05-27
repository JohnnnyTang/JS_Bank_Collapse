<template>
    <div class="warning-card">
        <div class="main">
            <div class="icon"></div>
            <div class="text title-text">{{props.index}}</div>
            <div class="text time-text">{{ props.warningInfo.warnTime }}</div>
            <div class="button-group">
                <div class="data button-item" @click="clickHandler">数据</div>
                <div class="deat button-item" @click="confrmDealWithWarn(props.index)">处置</div>
            </div>
        </div>

        <div class="arrow"></div>

        <dv-border-box10
            :color="['rgb(84,163,232)', 'rgb(64,150,242)']"
            v-show="showChart"
        >
            <div class="warning-chart">
                <!-- <div class="tabs"></div> -->
                <div class="chart" ref="chartDom"></div>
            </div>
            <div class="up-arrow" :id="deviceType" :class="{'active': arrowActive}">
            </div>
        </dv-border-box10>

        <!-- <div v-show="showFakeStressPic" class="fake-stress-pic"></div> -->
    </div>
</template>

<script setup>
import { computed, onMounted, ref, nextTick } from 'vue'
import * as echarts from 'echarts'
import { BorderBox10 as DvBorderBox10 } from '@kjgl77/datav-vue3'
import { getGNSSoption, getInclineoption, getStressoption } from './data'
import { useMapStore, useWarnInfoStore } from '../../store/mapStore'
import { removeWarningDeviceStyle } from '../bankManage/mapInit.js'

const props = defineProps({
    warningInfo: {
        type: Object,
    },
    index: {
        type: Number
    }
})
const DEVICETYPEMAP = ['GNSS', '测斜仪', '水压力计', '应力桩']
const chartDom = ref()
const showChart = ref(false)
const chartDataLoading = ref(true)
const showFakeStressPic = ref(false)
const fakeWarnCodeList = [
    'MZS120.55327892_32.02707923_1',
    'MZS120.51967889_32.04004108_4',
    'MZS120.541648_32.030524_2',
    'MZS120.54599538_32.02837993_1'
]
const warnInfoStore = useWarnInfoStore()
const deviceTypeList = ['GNSS', '应力桩', '水压力计', '测斜仪']
let myChart = undefined
const deviceType = ref('')
const arrowActive = ref(false)

const clickHandler = () => {
    /*
    {
        "deviceCode": "DVI3010425438293",
        "deviceId": "MZS120.51726088_32.04054582_3",
        "id": "c6ae8d58-a506-4acc-ad86-998db55195a4",
        "ifDealt": null,
        "threeDiff": 31.4255215,
        "warnTime": "2024-05-22 21:35:27"
    }
    */
    nextTick(() => {
        const daviceMap = ['GNSS', '应力桩', '水压力计', '测斜仪']
        if (fakeWarnCodeList.includes(props.warningInfo.deviceId)) {
            showChart.value = !showChart.value
            deviceType.value =
                daviceMap[props.warningInfo.deviceId.split('_').pop() - 1]
            chartConfig(deviceType.value)
            // if (deviceType.value === '应力桩') {
            //     showFakeStressPic.value = true
            // }
            setTimeout(() => {
                arrowActive.value = true
            }, 800)
        }
    })
}

const chartConfig = (deviceType) => {
    let optionMap = {
        GNSS: getGNSSoption,
        测斜仪: getInclineoption,
        应力桩: getStressoption,
    }

    myChart = echarts.init(chartDom.value)
    myChart.clear()
    myChart.setOption(optionMap[deviceType]())
    chartDataLoading.value = false
}

const confrmDealWithWarn = (index) => {
    warnInfoStore.curDealId = index
    console.log('confirm deal with...', index)
    // warnItem.ifDealt = 1
    // historyRowLoading.value[warnIndex] = false
}

onMounted(() => {

})
</script>

<style lang="scss" scoped>
.warning-card {
    position: relative;
    width: 4vw;
    height: fit-content;
    // bottom: 0.2vh;
    user-select: none;
    z-index: 2;

    div.main {
        position: relative;
        width: 4vw;
        height: fit-content;
        background-color: rgb(237, 239, 224);
        box-shadow: rgb(255, 193, 160) 0px 0px 25px 3px inset;
        border-radius: 5%;
        padding-bottom: 0.5vh;
        // display: flex;
        // flex-direction: column;
        // align-items: center;
        // justify-content: center;

        // &:hover {
        //     cursor: pointer;
        // }

        // background-color: #e1c39b;

        .icon {
            width: 3vh;
            height: 3vh;
            margin-left: calc(2vw - 1.5vh);
            // flex-shrink: 0;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url('/alarm.png');
            background-position: 50% 50%;
            animation: warn 1s linear infinite;
        }

        .title-text {
            position: absolute;
            top: 0vh;
            width: 3vh;
            margin-left: calc(2vw - 1.5vh);
            // top: -3vh;
            line-height: 2.6vh;
            text-align: center;
            height: 2.6vh;
            font-weight: bold;
            font-size: calc(0.6vw + 0.6vh);
            color: rgb(255, 255, 255);

            animation: warn 1s linear infinite;
        }

        .time-text {
            line-height: 1.2vh;
            height: 2.4vh;
            // margin-top: 0.2vh;
            text-align: center;
            color: rgb(253, 75, 75);
            font-size: calc(0.35vw + 0.4vh);
            font-weight: bold;
        }

        div.button-group {
            height: 2vh;
            width: 100%;

            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            column-gap: 0.5vw;

            div.button-item {
                background-color: rgb(255, 177, 177);
                height: 2vh;
                line-height: 2vh;
                padding-left: 0.2vw;
                padding-right: 0.2vw;
                border-radius: 3px;

                color: rgb(255, 0, 0);

                &:hover {
                    cursor: pointer;
                    font-weight: bold;
                    background-color: rgb(255, 61, 61);
                    color: rgb(248, 252, 255);
                }
                
            }
        }
    }

    :deep(.dv-border-box-10) {
        width: 22vw;
        height: 27vh;
        position: absolute;
        bottom: 6vh;
        left: -9vw;

        background-color: rgb(255, 255, 255);

        div.warning-chart {
            position: absolute;
            width: 95%;
            height: 95%;
            // background-color: aliceblue;

            .tabs {
                width: 20vw;
                height: 3vh;
            }

            .chart {
                width: 22vw;
                height: 27vh;
                // background-color: antiquewhite;
            }
            z-index: 2;
        }

        div.up-arrow {
            position: absolute;
            right: 0.5vw;
            top: 14.5vh;

            width: 3vh;
            height: 3vh;
            // background-color: antiquewhite;
            background-image: url('/arrow-up-red.png');
            background-size: contain;
            background-repeat: no-repeat;
            z-index: 3;
            opacity: 0;
            transition: all 0.8s ease-in;

            &[id="应力桩"] {
                top: 15.4vh;
            }

            &[id="GNSS"] {
                top: 11vh;
            }

            &.active {
                opacity: 1;
            }
        }
    }

    div.arrow {
        position: absolute;
        left: 45%;
        bottom: -0.5vh;
        // width: 1vh;
        // height: 1vh;
        border-left: calc(0.1vw + 0.3vh) solid transparent;
        border-right: calc(0.1vw + 0.3vh) solid transparent;
        border-top: calc(0.2vw + 0.3vh) solid rgb(252, 0, 0);
    }
}

div.fake-stress-pic {
    position: absolute;
    width: 5vw;
    height: 13vh;
    bottom: 15vh;
    left: -6vw;
    background-image: url('/fakeStressPic.png');
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 2;
}

@keyframes warn {
    0%,
    100% {
        // margin-top: 0.5vh;
        transform: scale(1);
    }

    50% {
        // margin-top: 0.3vh;
        transform: scale(0.9);
    }
}
</style>

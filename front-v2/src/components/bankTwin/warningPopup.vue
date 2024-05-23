<template>
    <div class="warning-card">

        <div class="main" @click="clickHandler">
            <div class="icon"></div>
            <div class="text title-text">报警</div>
            <div class="text time-text">{{ props.warningInfo.warnTime }}</div>
        </div>

        <div class="arrow"></div>



        <dv-border-box10 :color="['rgb(84,163,232)', 'rgb(64,150,242)']" v-show="showChart">
            <div class="warning-chart">
                <!-- <div class="tabs"></div> -->
                <div class="chart" ref="chartDom"></div>
            </div>
        </dv-border-box10>

        <!-- <div v-show="showFakeStressPic" class="fake-stress-pic"></div> -->

    </div>
</template>

<script setup>
import { computed, onMounted, ref, nextTick } from 'vue';
import * as echarts from 'echarts'
import { BorderBox10 as DvBorderBox10 } from '@kjgl77/datav-vue3'
import {
    getGNSSoption,
    getInclineoption,
    getStressoption,
} from './data'

const props = defineProps({
    warningInfo: {
        type: Object
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
    'MZS120.541648_32.030524_2'
]

let myChart = undefined


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
        const daviceMap = ["GNSS", "应力桩", "水压力计", "测斜仪"]
        if (fakeWarnCodeList.includes(props.warningInfo.deviceId)) {
            showChart.value = !showChart.value
            let deviceType = daviceMap[props.warningInfo.deviceId.split('_').pop() - 1]
            chartConfig(deviceType)
            if(deviceType === '应力桩'){
                showFakeStressPic.value = true
            }
        }
    })
}

const chartConfig = (deviceType) => {
    let optionMap = {
        'GNSS': getGNSSoption,
        '测斜仪': getInclineoption,
        '应力桩': getStressoption
    }

    myChart = echarts.init(chartDom.value);
    myChart.setOption(optionMap[deviceType]());
    chartDataLoading.value = false
}

onMounted(() => {
})



</script>

<style lang="scss" scoped>
.warning-card {
    position: relative;
    width: 4vw;
    height: 6vh;
    // bottom: 0.2vh;
    user-select: none;
    z-index: 4;

    div.main {
        position: relative;
        width: 4vw;
        height: 8vh;
        background-color: rgb(237, 239, 224);
        box-shadow: rgb(255, 193, 160) 0px 0px 25px 3px inset;
        border-radius: 5%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &:hover {
            cursor: pointer;
        }

        // background-color: #e1c39b;

        .icon {
            width: 3vh;
            height: 3vh;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url('/alarm.png');
            background-position: 50% 50%;
            animation: warn .8s linear infinite;
        }

        .title-text {
            line-height: 2.6vh;
            height: 2, 6vh;
            font-weight: bold;
            font-size: calc(0.6vw + 0.6vh);
            color: rgb(255, 0, 0);
        }

        .time-text {
            line-height: 1vh;
            height: 2vh;
            text-align: center;
            color: rgb(253, 75, 75);
            font-size: calc(0.4vw + 0.2vh);
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
        }

        div.arrow {
            position: absolute;
            left: 45%;
            bottom: -2.7vh;
            width: 0;
            height: 0;
            border-left: calc(0.1vw + 0.3vh) solid transparent;
            border-right: calc(0.1vw + 0.3vh) solid transparent;
            border-top: calc(0.2vw + 0.3vh) solid rgb(244, 215, 190);
        }

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
    z-index: 4;
}



@keyframes warn {

    0%,
    100% {
        // margin-top: 0.5vh;
        transform: scale(1.0);
    }

    50% {
        // margin-top: 0.3vh;
        transform: scale(0.9);
    }
}
</style>
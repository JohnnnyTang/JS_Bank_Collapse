<template>
    <div class="warning-card">

        <div class="main">
            <div class="icon"></div>
            <div class="text title-text">报警</div>
            <div class="text time-text">{{ props.warningInfo.warnTime }}</div>
        </div>

        <div class="arrow"></div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
const DEVICETYPEMAP = ['GNSS', '测斜仪', '水压力计', '应力桩']

const props = defineProps({
    warningInfo: {
        type: Object
    }
})

onMounted(() => {
    console.log('wqe123', props.warningInfo)
})


</script>

<style lang="scss" scoped>
.warning-card {
    position: relative;
    width: 4vw;
    height: 6vh;
    // bottom: 0.2vh;
    user-select: none;

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
            height: 2,6vh;
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


    div.arrow {
        position: absolute;
        left: 36%;
        bottom: -3vh;
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
        // margin-top: 0.5vh;
        transform: scale(1.0);
    }

    50% {
        // margin-top: 0.3vh;
        transform: scale(0.9);
    }
}
</style>
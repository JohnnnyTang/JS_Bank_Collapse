<template>
    <div class="warning-card">

        <div class="main">
            <div class="icon"></div>
            <div class="text titletext">警告</div>
        </div>

        <div class="arrow"></div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
const DEVICETYPEMAP = ['GNSS', '测斜仪', '水压力计', '应力桩']

onMounted(() => {
})


</script>

<style lang="scss" scoped>
.warning-card {
    position: relative;
    width: 3vw;
    height: 6vh;
    user-select: none;

    div.main {
        position: relative;
        width: 3vw;
        height: 6vh;
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
            animation: warn .8s linear infinite;
        }

        .titletext {
            line-height: 3vh;
            font-size: calc(0.6vw + 0.6vh);
            color: rgb(253, 75, 75);
        }



    }


    div.text {
        line-height: 4vh;
        font-family: "Trebuchet MS", Helvetica, sans-serif;
        font-weight: 600;


    }

    div.arrow {
        position: absolute;
        left: 30%;
        bottom: -1vh;
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
        // margin-top: 0.3vh;
        transform: scale(1.1);
    }
}
</style>
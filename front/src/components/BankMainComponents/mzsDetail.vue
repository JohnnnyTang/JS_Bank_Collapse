<template>
    <div class="mzsDetailDIV">
        <div class="icon" @click="closeClick"></div>
        <h3>民主沙崩岸</h3>
        <hr>
        <p>
            民主沙右缘位于长江澄通河段，分属泰州市的靖江市和南通市的如皋市，是水利部长江委、省市县的Ⅰ级预警岸段。近年民主沙南侧的浏海沙水道深槽坐弯、深泓左偏，致来民主沙右缘持续冲退，影响局部河势稳定。同时民主沙为张皋过江通道拟建桥址所在地。为保障民主沙、张皋过江通道防洪安全，选取民主沙右缘作为近期崩岸监测预警工程示范段。
        </p>
        <div class="img"></div>

    </div>
</template>

<script setup>
import { onMounted } from 'vue';

const emit = defineEmits(['closeMzsDetail'])
const closeClick = () => {
    emit('closeMzsDetail', {
        showmzsDetail: false
    })
}

onMounted(async () => {
});
</script>

<style lang="scss" scoped>
.mzsDetailDIV {
    width: 20vw;
    height: 56vh;
    background-color: hsla(210, 70%, 24%, 0.5);
    border-radius: 1vh;
    box-shadow: 0px 0px 8px 4px hsla(210, 70%, 12%, 0.5);

    h3 {
        text-align: center;
        margin-top: 2vh;
        font-size: 2.4vh;
        margin-bottom: 1vh;
        color: hsl(210, 70%, 90%);
    }

    p {
        padding: 0vh 3vh;
        font-size: 2vh;
        color: hsl(210, 70%, 90%);
    }

    .img {
        margin-left: 4vw;
        width: 135px;
        height: 100px;
        background-image: url('/img/mzs.png');
        background-size: contain;
        background-repeat: no-repeat;
    }

    .icon {
        position: absolute;
        right: 1vw;
        top: 1vh;
        background-image: url('/close.svg');
        width: calc(1vh + 1vw);
        height: calc(1vh + 1vw);
        background-size: contain;
        background-repeat: no-repeat;
        cursor: pointer;

    }
}
</style>

<template>
    <div class="bankListDIV">
        <div class="icon" @click="Click"></div>
        <!-- <div @click="Click" class="button">返回</div> -->

        <h2>崩岸预警信息</h2>
        <hr>
        <div class="text">崩岸名称：{{ info.bankName }}</div>
        <div class="text">所属城市：{{ info.cityName }}</div>
        <div class="text">所属河段：{{ info.riverName }}</div>
        <div class="text">测点深度：{{ info.monitoringLength }} m</div>
        <div class="text">崩岸描述：{{ info.description }}</div>

        <div @click="Click2" class="button" v-show="info.bankName === '民主沙'">
            查看详情<span class="button-border"></span>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

//childData
const emit = defineEmits(['showChange', 'showDetail']);


const props = defineProps({
    info: {
        type: Object,
        default: {},
    },
});


const Click = () => {
    emit('showChange', {
        showFather: true,
        showChild: false,
    });
};
const Click2 = () => {
    emit('showDetail', {
        showFather: false,
        showChild: false,
        showDetail: true
    })
}

onMounted(async () => {
    // tableData.value = (await BackEndRequest.getbankLineData()).data
});
</script>

<style lang="scss" scoped>
.bankListDIV {
    width: 20vw;
    height: 50vh;
    background-color: hsl(210, 30%, 14%);
    border-radius: 1vh;
    box-shadow: 0px 0px 8px 4px hsla(210, 70%, 12%, 0.7);

    h2 {
        text-align: center;
        margin-top: 1vh;
        margin-bottom: 1vh;
        color: aliceblue;
    }

    .text {
        padding: 1vh;
        color: aliceblue;
        left: 1vw;
    }

    .button {
        position: absolute;
        bottom: 1vh;
        left: 30%;
        padding: 1rem 2rem;
        border-radius: .5rem;
        border: none;
        font-size: 1rem;
        font-weight: 400;
        color: #f4f0ff;
        text-align: center;
        backdrop-filter: blur(10px);
        cursor: pointer;
    }

    .button::before {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        border-radius: .5rem;
        background: linear-gradient(180deg, rgba(8, 77, 126, 0) 0%, rgba(8, 77, 126, 0.42) 100%), rgba(47, 255, 255, .24);
        box-shadow: inset 0 0 12px rgba(151, 200, 255, .44);
        z-index: -1;
    }

    .button::after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, rgba(8, 77, 126, 0) 0%, rgba(8, 77, 126, 0.42) 100%), rgba(47, 255, 255, .24);
        box-shadow: inset 0 0 12px rgba(151, 200, 255, .44);
        border-radius: .5rem;
        opacity: 0;
        z-index: -1;
        transition: all .3s ease-in;
    }

    .button:hover::after {
        opacity: 1;
    }

    .button-border {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        border-radius: .5rem;
        z-index: -1;
    }

    .button-border::before {
        content: "";
        position: absolute;
        border-radius: .5rem;
        padding: 1px;
        inset: 0;
        background: linear-gradient(180deg, rgba(184, 238, 255, 0.24) 0%, rgba(184, 238, 255, 0) 100%), linear-gradient(0deg, rgba(184, 238, 255, 0.32), rgba(184, 238, 255, 0.32));
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        pointer-events: none;
    }

    .icon {
        position: absolute;
        left: 1vw;
        top: 1vh;
        background-image: url('/back.svg');
        width: calc(1vh + 1vw);
        height: calc(1vh + 1vw);
        background-size: contain;
        background-repeat: no-repeat;

        :hover {
            cursor: pointer;
        }
    }
}
</style>

<template>
    <div class="bankListDIV">

        <div @click="Click" class="button">返回</div>

        <h3>崩岸预警信息</h3>
        <div class="text">{{ info.bankName }}</div>
        <div class="text">{{ info.cityName }}</div>
        <div class="text">{{ info.riverName }}</div>
        <div class="text">{{ info.description }}</div>

        <div @click="Click2" class="button" v-show="info.bankName === '民主沙'">查看详情</div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

let tableData = ref([]);
const loading = ref(true);
//childData
const emit = defineEmits(['showChange','showDetail']);


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
const Click2 = ()=>{
    emit('showDetail',{
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
    background-color: rgba(144, 175, 194, 0.418);
    border-radius: 1vh;

    h3 {
        text-align: center;
        margin-top: 1vh;
        margin-bottom: 1vh;
        color: aliceblue;
    }

    .text {
        padding: 1vh;
        color: aliceblue;
    }

    .button {
        flex: 1;
        cursor: pointer;
        padding: calc(0.5vw + 0.5vh);
        border: 2px solid rgb(197, 173, 173);
    }
}
</style>

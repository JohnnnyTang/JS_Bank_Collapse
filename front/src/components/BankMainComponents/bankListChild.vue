<template>
    <div class="bankListDIV">
        <div @click="Click">返回</div>
        <h3>崩岸预警信息</h3>
        <div class="text">{{ info.bankName }}</div>
        <div class="text">{{ info.cityName }}</div>
        <div class="text">{{ info.riverName }}</div>
        <div class="text">{{ info.description }}</div>

    </div>
</template>

<script setup>
import { onMounted, ref, onBeforeMount, watch, } from 'vue';
import BackEndRequest from "../../api/backendIns"

let tableData = ref([])
const loading = ref(true)
//childData
const emit = defineEmits(['showChange'])
const Click = () => {
    emit('showChange', {
        showFather: true,
        showChild: false,
    })
}

const props = defineProps({
    info: {
        type: Object,
        default: {},
    },
})



onMounted(async () => {
    // tableData.value = (await BackEndRequest.getbankLineData()).data
})




</script>

<style lang="scss" scoped>
.bankListDIV {
    width: 20vw;
    height: 50vh;
    background-color: rgba(144, 175, 194, 0.418);
    border-radius: 2vh;

    h3 {
        text-align: center;
        margin-top: 1vh;
        margin-bottom: 1vh;
    }

    .text{
        padding: 1vh;
    }

}
</style>
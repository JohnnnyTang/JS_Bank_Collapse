<template>
    <div class="bank-monitor-container">
        <BankVideo v-if="curPage=='video'"/>
        <BankDevice v-else :initDevice="initDevice"/>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import BankVideo from './BankVideo.vue'
import BankDevice from './BankDeviceData.vue'

const route = useRoute()
const curPage = ref("video")
const initDevice = ref("gnss")

onBeforeRouteUpdate((to, from) => {
    // console.log('111', to, from)
    curPage.value = to.params.id
    if(to.params.id == 'video') return
    else initDevice.value = to.params.id
})

onMounted(() => {
    // console.log(route.params)
    curPage.value = route.params.id
    initDevice.value = route.fullPath.split("/").pop()
    // initDevice.value = curPage.value
})
</script>

<style lang="scss" scoped>
div.bank-monitor-container {
    position: absolute;
    left: 12vw;
    top: 0vh;

    width: 87vw;
    height: 90vh;
    padding-top: 1vh;
    padding-bottom: 1vh;
    margin-left: 0.5vw;
    padding-right: 0.5vw;

    border-radius: 12px;
    // margin-bottom: 1vh;
    overflow: hidden;
    display: flex;
    justify-content: space-between;

    // background-color: rgb(240, 255, 240);

}
</style>

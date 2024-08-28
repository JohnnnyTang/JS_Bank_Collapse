<template>
    <div class="bank-resouce-preview-container">
        
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, onBeforeRouteLeave } from 'vue-router';

///////////// global
const route = useRoute();




//////////// basic Info of Bank
const BankBasicInfo = ref({})



onMounted(()=>{
    console.log('preview ___ ', route.params.id);
})

</script>

<style lang="scss" scoped>
div.bank-resouce-preview-container {
    position: absolute;
    left: 12vw;
    top: 1vh;

    width: 87vw;
    height: 88.5vh;
    padding-top: 1vh;
    padding-bottom: 1vh;
    margin-left: 0.5vw;
    padding-right: 0.5vw;

    border-radius: 12px;
    // margin-bottom: 1vh;
    overflow: hidden;
    display: flex;
    justify-content: space-between;

    background-color: rgb(1, 155, 175)
}
</style>
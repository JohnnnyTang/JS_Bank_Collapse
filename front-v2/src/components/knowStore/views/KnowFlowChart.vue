<template>
    <div class="expert-know-container">
        <div class="history-nav" @click="routeHistory"></div>
        <div class="plan-nav" @click="routePlan"></div>
    </div>
</template>

<script setup>
import router from '../../../router/index'

const routeHistory = () => {
    console.log(1233)
    router.push('/knowledgeStore/history')
}

const routePlan = () => {
    console.log(1233)
    router.push('/knowledgeStore/plan')
}
</script>

<style lang="scss" scoped>
div.expert-know-container {
    position: absolute;
    width: 70vw;
    height: 80vh;
    left: 18vw;
    top: 12vh;
    z-index: 10;

    // background-color: rgb(231, 249, 255);

    background-image: url('/knowFlowChart.png');
    background-size: contain;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    z-index: 10;

    div.history-nav {
        position: relative;
        top: 36vh;
        left: 25vw;

        width: 15vw;
        height: 9vh;

        // background-color: aqua;
        &:hover {
            cursor: pointer;
        }
    }

    div.plan-nav {
        position: relative;
        top: 60vh;
        left: 25vw;

        width: 15vw;
        height: 9vh;

        // background-color: aqua;
        &:hover {
            cursor: pointer;
        }
    }
}
</style>
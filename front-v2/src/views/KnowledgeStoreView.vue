<template>
    <div class="bankKnowledge-container" ref="knowledgeContainer">
        <VerticalNavVue />
        <!-- <div class="selector-container"></div> -->
        <router-view></router-view>
        <ScrollHistoryVue :knowledgeContainerWidth="knowledgeContainerWidth" ref="scrollDom"/>
        <!-- <bottomWaveVue /> -->
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import bottomWaveVue from '../components/knowStore/BottomWave.vue';
import VerticalNavVue from '../components/knowStore/VerticalNav.vue';

// const knowledgeContainerWidth = ref(0)
// const knowledgeContainer = ref();
// const scrollDom = ref(null)

// onMounted(async () => {
//     knowledgeContainerWidth.value = knowledgeContainer.value.clientWidth;
// });

</script>

<style lang="scss" scoped>
div.bankKnowledge-container {
    width: 100vw;
    height: 92vh;
    overflow: hidden;

    // background-color: rgb(129, 143, 156);
    background: linear-gradient(
        60deg,
        rgb(216, 233, 255) 0%,
        rgb(208, 230, 255) 100%
    );

    div.selector-container {
        height: 4vh;
        width: 80vw;
        left: 10vw;
        margin-top: 1vh;
        position: fixed;
        background-color: antiquewhite;
    }
}

</style>

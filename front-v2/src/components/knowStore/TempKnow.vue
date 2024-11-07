<template>
    <div class="bankKnowledge-container" ref="knowledgeContainer">
        <VerticalNavVue />
        <router-view />
        <bottomWaveVue />
    </div>
</template>

<script setup>
import bottomWaveVue from './BottomWave.vue';
import VerticalNavVue from './VerticalNav.vue';
import { onMounted } from 'vue';
onMounted(() => {
})
</script>

<style lang="scss" scoped>
div.bankKnowledge-container {
    width: 100vw;
    height: 92vh;
    overflow: hidden;

    // background-color: rgb(129, 143, 156);
    background: linear-gradient(60deg,
            rgb(45, 30, 109) 0%,
            rgb(5, 80, 165) 100%);

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
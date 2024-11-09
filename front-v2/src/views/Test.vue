<template>
    <div class="container">
        <!-- <GlobalGraph></GlobalGraph> -->

        <!-- <div class="navs">
            <NavCard v-for="(item, index) in navInfo" :navInfo="item" :key="index"></NavCard>
        </div>

        <bottomWaveVue></bottomWaveVue> -->
        <FileView></FileView>

    </div>
</template>

<script setup>
// import GlobalGraph from '../components/knowStore/globalGraph/GlobalGraph.vue'
// import NavCard from '../components/knowStore/globalGraph/NavCard.vue';
// import bottomWaveVue from '../components/knowStore/BottomWave.vue';
import FileView from '../components/knowStore/globalGraph/FileView.vue';

</script>

<style lang="scss" scoped>
.container {
    position: absolute;
    top: 8vh;
    left: 0vw;
    width: 100vw;
    height: 92vh;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: rgb(29, 97, 157);
    overflow: auto;



}
</style>
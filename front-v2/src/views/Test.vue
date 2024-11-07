<template>
    <div class="container">
        <GlobalGraph></GlobalGraph>
    </div>
</template>

<script setup>
import GlobalGraph from '../components/knowStore/globalGraph/GlobalGraph.vue'
</script>

<style lang="scss" scoped>
.container{
    position: absolute;
    top: 8vh;
    left: 0vw;
    width: 100vw;
    height: 92vh;
}
</style>
<template>
    <div class="model-param-container">
        <ParamTreeVue />
        <ParamMatrixVue />
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ParamTreeVue from '../ParamTree.vue'
import ParamMatrixVue from '../ParamMatrix.vue';

onMounted(() => {})
</script>

<style lang="scss" scoped>
div.model-param-container {
    position: relative;
    width: 88vw;
    height: 80vh;
    left: 12vw;
    top: 4vh;
    z-index: 8;
    display: flex;
    flex-flow: row nowrap;
}
</style>

<template>
    <div class="section-detail">
        <canvas id="dwg-canvas"></canvas>
    </div>
</template>

<script setup>
import Mx from 'mxdraw'
import { computed, onMounted, watch } from 'vue';

const props = defineProps({
    sectionName: Object
})

watch(props, async () => {
    Mx.MxFun.createMxObject({
            canvasId: "dwg-canvas",
            cadFile: `/dwg/守护工程断面图/${props.sectionName.value[0]}.dwg`,
            
        });
}, {
    once: false
})

onMounted(() => {


})
</script>

<style lang="scss" scoped>
.section-detail {
    width: 31vw;
    height: 30vh;
    overflow: hidden;
    position: relative;

    #dwg-canvas {
    }

}
</style>
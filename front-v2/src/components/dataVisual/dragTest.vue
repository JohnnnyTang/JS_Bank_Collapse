<template>
    <div></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';


const mapContainerRef = ref();
let flowlayer;

onMounted(async () => {

})

</script>

<style lang="scss" scoped>
#GPUFrame {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    z-index: 1;
    pointer-events: none;
}

#map {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    z-index: 0;
}
</style>
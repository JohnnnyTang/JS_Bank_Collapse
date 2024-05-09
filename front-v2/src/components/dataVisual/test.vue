<template>
    <div class="main">
        <subSceneContainer :title="123" :icon-src="'/崩岸0.png'"></subSceneContainer>
    </div>
</template>

<script setup>
import subSceneContainer from '../dataVisual/common/subSceneContainer.vue'

const test = {
    title: '民主沙近岸',
    desc: '展示民主沙近岸场景,助力有关规划决策.',
    iconSrc: '/icons/terrain.png'
}


</script>

<style lang="scss" scoped>
.main {
    position: absolute;
    width: 100vw;
    height: 92vh;




}
</style>
<template>

    <div class="p">
        <channelRelate v-if="selectedScene.title === '全江概貌'"></channelRelate>
        <bankLineRelate v-if="selectedScene.title === '典型崩岸'"></bankLineRelate>
        <monitorDeviceRelate v-if="selectedScene.title === '民主沙预警监测'"></monitorDeviceRelate>
    </div>

</template>

<script setup>
import bankLineRelate from './bankLineRelate.vue';
import channelRelate from './channelRelate.vue';
import monitorDeviceRelate from './monitorDeviceRelate.vue';
import { useSceneStore } from '../../../store/mapStore';
import { computed } from 'vue';

const selectedScene = computed(() => useSceneStore().selectedScene)

</script>

<style lang="scss" scoped>
.p{
    pointer-events: all;
}
</style>
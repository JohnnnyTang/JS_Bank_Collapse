<template>

    <bankLineRelate v-if="selectedScene.title === '预警岸段'"></bankLineRelate>
    <channelRelate v-if="selectedScene.title === '过江通道'"></channelRelate>
    <monitorDeviceRelate v-if="selectedScene.title === '实时监测设备'"></monitorDeviceRelate>

</template>

<script setup>
import bankLineRelate from './bankLineRelate.vue';
import channelRelate from './channelRelate.vue';
import monitorDeviceRelate from './monitorDeviceRelate.vue';
import { useSceneStore } from '../../../store/mapStore';
import { computed } from 'vue';

const selectedScene = computed(() => useSceneStore().selectedScene)

</script>

<style lang="scss" scoped></style>
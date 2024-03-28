<template>

    <bankLineDetail v-if="selectedScene.title === '预警岸段'"></bankLineDetail>
    <channelDetail v-else-if="selectedScene.title === '过江通道'"></channelDetail>
    <monitorDetail v-else-if="selectedScene.title === '实时监测设备'"></monitorDetail>

</template>

<script setup>
import bankLineDetail from './bankLineDetail.vue';
import channelDetail from './channelDetail.vue';
import monitorDetail from './monitorDetail.vue';

import { onMounted, ref, computed, watch } from 'vue';
import { useSceneStore } from '../../../store/mapStore';

const sceneStore = useSceneStore()
const selectedScene = computed(() => sceneStore.selectedScene)

onMounted(async () => {


})

</script>

<style lang="scss" scoped>
$Color1: rgb(163, 206, 245);
$Color2: rgb(218, 236, 251);
$Color3: rgb(37, 77, 200);
$Color4: rgb(47, 94, 211);
$Color5: rgb(6, 102, 192);
</style>
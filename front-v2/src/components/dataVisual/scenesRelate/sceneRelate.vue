<template>

    <div class="p">
        <channelRelate v-if="selectedScene.title === '全江概貌'"></channelRelate>
        <bankLineRelate v-else-if="selectedScene.title === '典型岸段'"></bankLineRelate>
        <monitorDeviceRelate v-else-if="selectedScene.title === '民主沙预警监测'"></monitorDeviceRelate>
        <mzsNearRelate v-else-if="selectedScene.title === '民主沙近岸'"></mzsNearRelate>
    </div>

</template>

<script setup>
import bankLineRelate from './bankLineRelate.vue';
import channelRelate from './channelRelate.vue';
import monitorDeviceRelate from './monitorDeviceRelate.vue';
import mzsNearRelate from './mzsNearRelate.vue';
import { useSceneStore } from '../../../store/mapStore';
import { computed } from 'vue';

const selectedScene = computed(() => useSceneStore().selectedScene)

</script>

<style lang="scss" scoped>
.p{
    pointer-events: all;
}
</style>
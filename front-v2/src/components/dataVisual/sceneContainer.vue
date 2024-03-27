<template>
    <div class="scene-container">

        <div class="scene-title"> {{ sceneContainerInfo.sceneTitle }} </div>
        <div class="switch-icon" @click="switchHandler"></div>
        <div class="card-container">
            <sceneCard v-for="(info, index) in sceneContainerInfo.sceneCardInfo" :key="index" :title="info.title"
                :desc="info.desc" :iconSrc="info.iconSrc" @click="clickSceneHandler(info)"></sceneCard>
            <hr>
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import sceneCard from './sceneCard.vue'
import { ElMessage } from "element-plus"
import { Scene, getBigRangeScenes, getSmallRangeScenes } from './Scene.js'
import { flytoLarge, flytoSmall } from '../../utils/mapUtils'
import { useMapStore, useSceneStore } from '../../store/mapStore';

const mapStore = useMapStore()
const sceneStore = useSceneStore()

// const emit = defineEmits(['selectScene'])

const clickSceneHandler = (scene) => {
    sceneStore.setSelectedScene(scene)
    // emit('selectScene', scene)
}

const switchHandler = () => {

    //layer remove

    if (sceneContainerInfo.value.sceneTitle === '长江江苏段') {
        flytoSmall(mapStore.getMap())

        sceneContainerInfo.value = sceneContainerInfo2

    }
    else {
        flytoLarge(mapStore.getMap())
        sceneContainerInfo.value = sceneContainerInfo1

    }
}

const sceneCardInfo1 = getBigRangeScenes()
const sceneCardInfo2 = getSmallRangeScenes()
const sceneContainerInfo1 = {
    sceneTitle: '长江江苏段',
    sceneCardInfo: sceneCardInfo1
}
const sceneContainerInfo2 = {
    sceneTitle: '民主沙示范段',
    sceneCardInfo: sceneCardInfo2
}
const sceneContainerInfo = ref(sceneContainerInfo1)


onMounted(async () => {

})

</script>

<style lang="scss">
.scene-container {
    position: absolute;
    background: linear-gradient(45deg, #C9E1F5, #E2FFEE);
    height: 92vh;
    overflow: hidden;



    .scene-title {
        height: 4.5vh;
        margin-top: 0.5vh;
        font-size: calc(1vw + 1vh);
        font-weight: 800;
        text-align: center;
        margin-right: 3vw;

        color: #0663bb;
        text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 3px 2px 1px #CCCCCC, 2px 3px 1px #EEEEEE, 4px 3px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 5px 4px 1px #CCCCCC, 4px 5px 1px #EEEEEE, 6px 5px 1px #CCCCCC, 5px 6px 1px #EEEEEE, 7px 6px 1px #0f41e7;

    }

    .switch-icon {
        position: absolute;
        top: 0.8vh;
        right: 1vw;
        height: 4vh;
        width: 4vh;
        background-image: url('./icons/switch.png');
        background-size: contain;
        animation: scaleAnim 1000ms infinite;

        &:hover {
            cursor: pointer;
        }
    }

    @keyframes scaleAnim {
        0% {
            transform: scale(1.0);
        }

        50% {
            transform: scale(1.1);
        }

        100% {
            transform: scale(1.0);
        }
    }


    .card-container {
        height: 85vh;
        overflow-y: scroll;
        overflow-x: hidden;

        &::-webkit-scrollbar {
            width: 5px;
        }

        &::-webkit-scrollbar-track {
            background-color: rgba(6, 181, 197, 0.219);
        }

        &::-webkit-scrollbar-thumb {
            background-color: #15a1e294;
            border-radius: 5px;
        }

        &::-webkit-scrollbar-thumb:hover {
            background-color: #3af0f781;
        }
    }




}
</style>
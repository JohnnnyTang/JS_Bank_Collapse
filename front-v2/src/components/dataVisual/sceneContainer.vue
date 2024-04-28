<template>
    <div class="scene-container">
        <div class="scene-title"> 典型数据场景 </div>
        <hr>
        <div class="card-container">
            <sceneCard v-for="(info, index) in  sceneCardInfo " :key="index" :title="info.title"
                :desc="info.desc" :iconSrc="info.iconSrc" 
                @click="clickSceneHandler(info, index)"
                :class="{ active: selectedIndex === index }">
            </sceneCard>
            <hr>
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import sceneCard from './sceneCard.vue'
import { ElMessage } from "element-plus"
import { Scene } from './Scene.js'
import { flytoFeature, flytoLarge, flytoSmall } from '../../utils/mapUtils'
import { useMapStore, useSceneStore } from '../../store/mapStore';

const sceneStore = useSceneStore()
const selectedIndex = ref(0)

const clickSceneHandler = (scene, index) => {
    sceneStore.setSelectedScene(scene)
    selectedIndex.value = index;
    // if(scene.type === '全江'){
    //     flytoLarge(map)
    // }else{
    //     flytoSmall(map)
    // }
}



const sceneCardInfo = Scene.getScnens()
onMounted(async () => {


})

</script>

<style lang="scss" scoped>
.scene-container {
    position: absolute;
    pointer-events: all;
    background: rgb(228, 247, 243);
    height: 92vh;
    overflow: hidden;
    z-index: 3;

    .scene-title {
        height: 4.5vh;
        margin-top: 0.5vh;
        font-size: calc(1vw + 1vh);
        font-weight: 800;
        text-align: center;
        margin-right: 0vw;

        color: #0663bb;
        text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 3px 2px 1px #CCCCCC, 2px 3px 1px #EEEEEE, 4px 3px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 5px 4px 1px #CCCCCC, 4px 5px 1px #EEEEEE, 6px 5px 1px #CCCCCC, 5px 6px 1px #EEEEEE, 7px 6px 1px #0f41e7;

    }

    hr{
        margin-top: 0.5vh;
        margin-bottom: 0.8vh;
    }

    // .switch-icon {
    //     position: absolute;
    //     top: 0.8vh;
    //     right: 1vw;
    //     height: 4vh;
    //     width: 4vh;
    //     background-image: url('/icons/switch.png');
    //     background-size: contain;
    //     animation: scaleAnim 1000ms infinite;

    //     &:hover {
    //         cursor: pointer;
    //     }
    // }

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

.active {
    box-shadow: 0 0 5px 5px rgba(27, 96, 160, 0.623);
    transform: scale(1.02);
    /* 选中项的背景色为黄色 */
}
</style>
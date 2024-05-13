<template>
    <div class="legend-container">
        <div class="title">
            <Decoration7 style="width: 15vw; height: 4vh;" :color="['rgb(28,13,106)', 'rgb(88,146,255)']">
                <div class="title-back">
                    <span class="title-text">图例</span>
                </div>
            </Decoration7>
            <div class="miniIcon" @click="close"></div>
        </div>
        <hr>
        <div class="content">
            <legendItem v-for="(legendItem, i) in props.legendList" :key="i" :style="legendItem.style"
                :text="legendItem.text">
            </legendItem>
        </div>
    </div>
</template>

<script setup>
import { Decoration7 } from '@kjgl77/datav-vue3'
import legendItem from './legendItem.vue'
import { onMounted, watch } from 'vue';

const emit = defineEmits(['close'])


const props = defineProps({
    legendList: Array,
})

watch(props, (newV, oldV) => {
    console.log(newV, oldV)
})


const close = () => {
    emit('close', 2)
}

</script>

<style lang="scss" scoped>
div.legend-container {
    // position: absolute;
    // right: 1vw;
    // top: 40vh;
    position: relative;
    z-index: 3;
    pointer-events: all;

    width: 12vw;
    height: 30vh;
    background-color: rgb(239, 247, 253);
    border-radius: 1%;
    box-shadow: 0px 0px 10px 1px #b3b2b2ee;

    .title {
        position: relative;
        width: 12vw;
        height: 4vh;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
            cursor: move;
        }

        .title-back {
            padding-left: 1vw;
            padding-right: 1vw;

            // height: 5vh;
            .title-text {
                font-size: calc(0.8vh + 1vw);
                font-weight: 600;
                line-height: 4vh;
                color: rgb(75, 115, 181);
            }
        }

        .miniIcon {
            position: absolute;
            right: 0.5vw;
            width: 4vh;
            height: 4vh;
            background-image: url('/icons/minimize.png');
            background-size: contain;
            background-repeat: no-repeat;

            &:hover {
                cursor: pointer;
            }
        }
    }

    hr {
        position: relative;
        margin-top: 0.1vh;
        margin-bottom: 0.1vh;
        border: 0;
        height: 0.4vh;
        width: 90%;
        background-image: linear-gradient(to right, rgb(65, 90, 255), rgb(14, 155, 219), rgb(65, 90, 255));
    }

    .content {
        position: relative;
        width: 12vw;
        height: 24vh;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        background-color: rgb(254, 254, 254);
        transform: scale(0.95);
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
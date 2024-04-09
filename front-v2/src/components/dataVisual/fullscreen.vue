<template>
    <div class="icon-container" @click="fullClick">
        <div class="icon"></div>
    </div>

</template>

<script setup>
import { useMapStore } from '../../store/mapStore';
import { flytoLarge } from '../../utils/mapUtils';
const fullClick = () => {
    flytoLarge(useMapStore().getMap())
}


</script>

<style lang="scss" scoped>
.icon-container {
    position: absolute;
    z-index: 2;
    right: 2vw;
    top: 56vh;
    width: 6.5vh;
    height: 6.5vh;
    background-color: rgb(255, 255, 255);
    border-radius: 6vh;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: all;

    .icon {
        width: 5vh;
        height: 5vh;
        background-size: contain;
        transition: 300ms;
        background-image: url('/icons/full.png');

        &:hover {
            cursor: pointer;
        }

        &:active {
            transform: rotate3d(0, 1, 1, 15deg);
            background-color: rgba(255, 255, 255, 0)
        }
    }
}
</style>
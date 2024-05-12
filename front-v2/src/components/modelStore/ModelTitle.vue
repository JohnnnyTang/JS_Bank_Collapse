<template>
    <div class="model-title-container">
        <div
            class="return-arrow"
            @click="returnMain"
        >
        </div>
        <div class="title-text">
            {{ ModelName }}
        </div>
    </div>
</template>

<script setup>

import { useRouter } from 'vue-router'
const router = useRouter()
const returnMain = () => {
    router.push('/modelStore')
}

const props = defineProps({
    ModelName: String,
})

</script >

<style lang="scss" scoped>
div.model-title-container {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: calc(100% - 20px);
    height: 5%;
    text-align: left;
    // padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 20px;

    background: linear-gradient(45deg, rgb(91, 219, 209), rgb(35, 119, 247));


    div.return-arrow {
        width: 2vw;
        height: 4vh;
        margin-top: 0.5vh;
        background-image: url('/left-arrow.png');
        background-size: contain;
        transition: transform 0.25s ease;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        &:hover {
            cursor: pointer;
            transform: scale(1.1);
        }

    }

    div.title-text {

        width: 20vw;
        padding-left: 1%;
        font-size: calc(1vh + 1vw);
        font-weight: 600;
        font-family: 'Microsoft YaHei';
        color:aliceblue;
        text-shadow: #4bb0f3 1px 1px;
    }
}
</style>

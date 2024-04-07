<template>
    <div class="twin-main-container">
        <div class="nav-manage-button" @click="navToManage">
            <div class="nav-manage-icon"></div>
            <div class="nav-manage-text">系统管理</div>
        </div>
    </div>
</template>

<script setup>
import router from '../router'


const navToManage = () => {
    router.push('/bankTwin/manage')
}
</script>

<style lang="scss" scoped>
div.twin-main-container {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    left: 0;

    background-color: rgb(100, 154, 202);

    div.nav-manage-button {
        position: absolute;
        right: 0;
        top: 2vh;

        width: 6vh;
        height: 6vh;
        background-color: rgb(0, 42, 105);
        transition: all 0.4s cubic-bezier(0.68, -0.15, 0.265, 1.15);
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;

        display: flex;
        flex-flow: row nowrap;
        overflow: hidden;

        &:hover {
            width: 16vh;
            cursor: pointer;
        }

        div.nav-manage-icon {
            width: 6vh;
            height: 6vh;
            flex-shrink: 0;

            background-image: url('/settings.png');
            background-size: 80%;
            background-position: 50% 50%;
            background-repeat: no-repeat;
        }

        div.nav-manage-text {
            width: 10vh;
            height: 6vh;
            line-height: 6vh;
            text-align: center;

            font-size: calc(0.9vw + 0.4vh);
            font-weight: bold;
            color: rgb(140, 255, 255);
        }
    }
}
</style>
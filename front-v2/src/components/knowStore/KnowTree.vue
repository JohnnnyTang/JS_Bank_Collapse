<template>
    <div class="param-tree-container">
        <div class="param-tree-title">
            <div class="tree-title-icon"></div>
            <div class="tree-title-text">崩岸知识管理</div>
        </div>
        <div class="param-tree-graph">
            <FileView></FileView>
        </div>

    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import FileView from './globalGraph/FileView.vue'



onMounted(() => {

})
</script>

<style lang="scss" scoped>
div.param-tree-container {
    position: relative;
    width: 80vw;
    height: 80vh;
    left: 12vw;
    top: 4vh;
    z-index: 8;

    // background-color: aliceblue;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 8px 40px -10px rgba(0, 0, 0, 0.8);

    div.param-tree-title {
        position: relative;
        height: 6vh;
        line-height: 6vh;
        width: 80vw;
        left: 50%;
        transform: translateX(-50%);
        font-size: calc(1vw + 0.8vh);
        font-weight: 600;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        column-gap: 1vw;

        background-color: rgba(204, 233, 252, 0.9);
        backdrop-filter: blur(6px);

        border-bottom: 3px solid rgb(15, 83, 230);

        div.tree-title-icon {
            height: 4vh;
            width: 4vh;
            background-image: url('/admin-panel.png');
            background-size: contain;
            background-repeat: no-repeat;
        }
    }

    div.param-tree-graph {
        height: 74vh;
        width: 80vw;
        background-color: rgba(88, 158, 250, 0.6);
        backdrop-filter: blur(6px);

        &:hover {
            cursor: pointer;
        }

        // background-color: aqua;
    }
}
</style>

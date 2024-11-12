<template>
    <div class="container" @click="download">
        <GlobalGraph></GlobalGraph>

        <!-- <div class="navs">
            <NavCard v-for="(item, index) in navInfo" :navInfo="item" :key="index"></NavCard>
        </div>

        <bottomWaveVue></bottomWaveVue> -->
        <!-- <FileView></FileView> -->
        <!-- <FileUpload v-model:uploadShow="uploadShow"></FileUpload> -->
        <!-- <el-tree :data="treeStructure" :props="defaultProps">

        </el-tree> -->
    </div>
</template>

<script setup>
import GlobalGraph from '../components/knowStore/globalGraph/GlobalGraph.vue'
import FileView from '../components/knowStore/globalGraph/FileView.vue';
import FileUpload from '../components/knowStore/globalGraph/FileUpload.vue';
import axios from 'axios'
// import { ref } from 'vue'

// const uploadShow = ref(true)
// window.addEventListener('keydown', e => {
//     if (e.key === '1') {
//         uploadShow.value = true
//     }
//     if (e.key === '2') {
//         uploadShow.value = false
//     }
//     if (e.key === '3')
//         console.log(uploadShow.value)

// })

</script>

<style lang="scss" scoped>
.container {
    position: absolute;
    top: 8vh;
    left: 0vw;
    width: 100vw;
    height: 92vh;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: rgb(29, 97, 157);
    overflow: auto;



}
</style>
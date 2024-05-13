<template>
    <div class="main">
        <featDetail></featDetail>
    </div>
</template>

<script setup>
import featDetail from './common/tool/featDetail.vue';
import { onMounted, watch } from 'vue';
import axios from 'axios';

onMounted(async () => {
    let data = (await axios.get(`http://localhost:5173/api/tile/vector/embankmentLine/info`)).data
    console.log(data)
})

</script>

<style lang="scss" scoped>
.main {
    position: absolute;
    width: 100vw;
    height: 92vh;


    div.featDetail {
        position: absolute;
        z-index: 2;
        left: 20vw;
        top: 10vh;
    }


}
</style>
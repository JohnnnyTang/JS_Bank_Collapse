<template>
    <div class="main">
        <div class="featDetail">

        </div>
        <featDetail></featDetail>
    </div>
</template>

<script setup>
import featDetail from './common/tool/featDetail.vue';

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
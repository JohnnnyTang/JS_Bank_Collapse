<template>
    <div class="report-container">
        <el-carousel height="90vh" :autoplay="auto">
            <el-carousel-item v-for="item in picList" :key="item">
                <el-image
                    :src="item"
                    :fit="fit"
                    style="width: 82vw; height: 90vh; padding-left: 2.5vw;"
                    :preview-src-list="[item]"
                />
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const fit = ref('contain')
const auto = ref(false)
const picList = ref(['/temp-1.png', '/temp-2.png', '/temp-3.png'])
</script>

<style lang="scss" scoped>
div.report-container {
    position: absolute;
    left: 12.5vw;
    top: 1vh;

    width: 87vw;
    height: 90vh;

    background-color: rgb(210, 239, 255);
    border-radius: 12px;
}
</style>

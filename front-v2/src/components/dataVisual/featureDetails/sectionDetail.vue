<template>
    <div class="section-detail">
        <canvas id="dwg-canvas"></canvas>
        <!-- <h1>{{ realName }}</h1> -->
    </div>
</template>

<script setup>
import Mx from 'mxdraw'
import { computed, onMounted, watch } from 'vue';

const props = defineProps({
    sectionName: Object
})

watch(props, async () => {
    setTimeout(() => {
        Mx.MxFun.createMxObject({
            canvasId: "dwg-canvas",
            //cadFile: "http://localhost:8080/demo/buf/test.dwg.mxb1.wgh",
            // cadFile:"/dwg/民主沙近岸测量范围-20240226-整体-展示版本2/buf/民主沙近岸测量范围-20240226-整体-展示版本2.dwg",
            cadFile: "/dwg/守护工程断面图/7.dwg",
            callback(mxDrawObject, { canvas, canvasParent }) {
                canvasParent.className = "section-detail";

                mxDrawObject.addEvent("loadComplete", () => {
                    console.log("mx loadComplete");
                });
            },
        });
    }, 1000)
}, {
    once: true
})

onMounted(() => {


})
</script>

<style lang="scss" scoped>
.section-detail {
    width: 600px;
    height: 500px;

    #dwg-canvas {
        width: 600px;
        height: 500px;
    }
}
</style>
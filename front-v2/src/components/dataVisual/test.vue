<template>
    <div class="main">
        <!-- <featDetail></featDetail> -->
    </div>
</template>

<script setup>
// import featDetail from './common/tool/featDetail.vue';
import { onMounted, watch } from 'vue';
import { useWarnInfoStore } from '../../store/mapStore'
const warnInfoStore = useWarnInfoStore()

watch(() => warnInfoStore.warnInfo, (newV, oldV) => {
    console.log(newV, oldV);
})

onMounted(() => {
    window.addEventListener('keydown', (e) => {
        if (e.key == '1') {
            warnInfoStore.warnInfo = [123, 123]
        }
        if (e.key == '2') {
            warnInfoStore.warnInfo = [123, 123, 12312]
        }
        if (e.key == '3') {
            warnInfoStore.warnInfo = []
        }
    })
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
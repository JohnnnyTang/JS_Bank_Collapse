<template>
    <div class="stParams">
        <div class="head">
            <div class="head-text">模型运行状况</div>
        </div>
        <div class="status-container">
            <div v-if="modelStore.modelStatus === 'pending'">
                <div class="slider-demo-block">
                    <div class="demonstration" style="padding-bottom: 10px;">{{ `当前进度: ${progress}%` }}</div>
                    <el-slider v-model="progress" :show-tooltip="false" />
                </div>
                <div style="padding-top: 10px;">{{ time }}</div>
            </div>
            <div v-else-if="modelStore.modelStatus === 'undefined'"
                style="width: 100%; display:flex;justify-content: center;">
                <div>模型尚未运行</div>
            </div>
            <div v-else-if="modelStore.modelStatus === 'success'">
                <div>模型运行完成</div>
            </div>
        </div>
        <div class="button-container">
            <el-button type="primary" @click="onSubmit">确定</el-button>
        </div>
    </div>




</template>

<script setup>
import { computed } from 'vue';
import { useStabilityStore } from '../../../store/stabilityStore';

const modelStore = useStabilityStore()
const progress = computed(() => {
    return Number(modelStore.modelProgress.toFixed(3))
})
const time = computed(() => {
    const temp = (Date.now() - modelStore.modelStartTime) / 1000 / modelStore.modelProgress * (100 - modelStore.modelProgress)
    const hours = Math.floor(temp / 3600);
    const minutes = Math.floor((temp % 3600) / 60);
    const seconds = Math.floor(temp % 60);
    if (minutes) {
        return `预计${hours}小时${minutes}分${seconds}秒完成`
    } else {
        return '预计时间正在计算中'
    }

})

const emit = defineEmits(['close']);
const onSubmit = () => {
    emit('close')
}
</script>

<style lang="scss" scoped>
.stParams {
    position: absolute;
    top: 15vh;
    left: 50vw;
    transform: translateX(-50%);
    height: 35vh;
    width: 20vw;
    z-index: 3;
    background-color: aliceblue;

    .head {
        height: 5vh;
        width: 100%;
        background-color: rgb(140, 213, 247);

        .head-text {
            color: rgb(2, 51, 124);
            font-size: calc(0.5vh + 1vw);
            font-weight: 800;
            text-align: center;
            line-height: 5vh;
        }
    }

    .status-container {
        margin: 2vw;
        font-size: larger;
    }

    .button-container {
        position: absolute;
        bottom: 1vw;
        right: 2vw;
    }
}
</style>
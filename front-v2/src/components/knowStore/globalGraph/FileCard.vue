<template>
    <div class="file-card">
        <div class="fileImg" :style="{ backgroundImage: 'url(' + fimg || '/knowledge/pdf.png' + ')' }">
        </div>
        <div class="border"></div>
        <div class="fileName">{{ fname }}</div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    fileInfo: {
        type: Object,
        default: {
            label: '',
            filePath: '',
        },
    }
})

const imgPath = {
    'pdf': '/knowledge/pdf.png',
    'png': '/knowledge/png.png',
    'picture': '/knowledge/png.png',
    'mp4': '/knowledge/mp4.png',
    'video': '/knowledge/mp4.png',

}

const fname = computed(() => props.fileInfo.label.length > 10 ? props.fileInfo.label.slice(0, 10) + '...' : props.fileInfo.label)
const fimg = computed(() => imgPath[props.fileInfo.type])



</script>

<style lang="scss" scoped>
.file-card {
    position: relative;
    width: 10vw;
    height: 19vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 2vh 2vw;
    transition: all 0.3s ease-in-out;

    &:hover {
        cursor: pointer;
        transform: scale(1.03);
    }

    .fileImg {
        position: relative;
        margin: 1vh 0;
        width: 6.6vw;
        height: 12vh;
        background-size: contain;
        background-repeat: no-repeat;
    }

    .fileName {
        position: relative;
        height: 5vh;
        text-align: center;
        font-size: calc(0.7vh + 0.5vw);
        font-weight: 600;
        font-family: 'Microsoft YaHei';
        text-wrap: pretty;
        line-height: 2.5vh;
    }

}
</style>
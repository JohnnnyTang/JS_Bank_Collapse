<template>
    <el-dialog v-model="show" :title="previewInfo.title" width="fit-content" :append-to-body="true">

        <div class="video-container preview-container" v-if="previewInfo.fileType === 'mp4'">
            <video autoplay controls width="100%" height="100%" ref="videoRef">
                <source :src="previewInfo.filePath" type="video/mp4" />
            </video>
        </div>

        <div class="image-preview" v-else-if="previewInfo.fileType === 'png'">
            <el-image :src="previewInfo.filePath" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
                :preview-src-list="previewInfo.srcList" :initial-index="0" fit="cover" />
        </div>

        <div class="pdf-preview" v-else-if="previewInfo.fileType === 'pdf'">
            <div class="loading" v-show="pdfLoading">
                <div class="loadingIcon"></div>
            </div>
            <VuePDF v-show="!pdfLoading" :pdf="PDF.pdf" :page="curPage"  @loaded="pdfLoadedHandler" />
            <el-pagination v-show="!pdfLoading" layout="prev, pager, next" background :page-count="PDF.pages"
                v-model:current-page="curPage" style="justify-content: center" />
        </div>
        <div class="other-preview preview-container" v-else>
            <p>暂不支持该文件类型预览</p>
        </div>
    </el-dialog>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import { VuePDF, usePDF } from '@tato30/vue-pdf'

///////// Props ///////////
const props = defineProps({
    fileInfo: {
        type: Object,
        default: {
            label: '',
            filePath: '',
        }
    }
})
const show = defineModel('show')
const previewInfo = computed(() => {
    return {
        title: props.fileInfo.label,
        fileType: props.fileInfo.label.slice(-3),//pdf, png, mp4,
        filePath: props.fileInfo.filePath,
        srcList: [props.fileInfo.filePath],
    }
})

///////// Video ///////////
const videoRef = ref(null)



///////// PDF ///////////
const curPage = ref(1)
const PDF = ref({})
const pdfLoading = ref(true)
const pdfLoadedHandler = () => {
    pdfLoading.value = false
}
watch(show, (newVal, oldVal) => {
    // when close
    if (oldVal) {
        if (videoRef.value) {
            videoRef.value.pause()
        }
    }
    // when open
    else {
        if (previewInfo.value.fileType === 'pdf') {
            pdfLoading.value = true
            curPage.value = 1
            PDF.value = usePDF(previewInfo.value.filePath)
        }
    }
})



</script>

<style lang="scss" scoped>
.preview-container {
    position: relative;
    width: 50vw;
    height: 65vh;
}

.pdf-preview {
    position: relative;
    width: 30vw;
    height: 90vh;

    .loading {
        position: absolute;
        top: 0vh;
        left: 0vw;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);

        display: flex;
        justify-content: center;
        align-items: center;

        @keyframes load {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        .loadingIcon {
            animation: load 3s linear infinite;
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            margin: auto;
        }
    }
}
</style>
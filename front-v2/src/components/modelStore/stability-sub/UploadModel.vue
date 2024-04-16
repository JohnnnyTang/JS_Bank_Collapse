<template>
    <div class='uploadModel'>
        <div class="head">
            <div class="head-text">上传模型文件</div>
        </div>

        <div class="form">

            <el-upload v-model:file-list="fileList" class="upload-demo" 
                action="#" 
                :http-request="handleUpload"
                :auto-upload="false">
                <el-button type="primary">上传水动力模型文件</el-button>
                <!-- <template #tip>
                    <div class="el-upload__tip">
                        jpg/png files with a size less than 500kb
                    </div>
                </template> -->
            </el-upload>

            <div class="button-container">
                <el-button type="primary" @click="onSubmit">确定</el-button>
                <el-button @click="emit('close')">取消</el-button>
            </div>
        </div>
    </div>

</template>

<script setup>

import { ref } from 'vue'
const emit = defineEmits(['close','files'])


///////////file//////////////
const fileList = ref([
])
const handleUpload = (uploadFile) => {
    console.log('handle upload');
}

const onSubmit = () => {
    /////just name
    let filenamelist = []
    fileList.value.forEach(file => {
        filenamelist.push(file.name)
    })
    emit('files', filenamelist)
    emit('close');
}

</script>

<style lang="scss" scoped>
.uploadModel {
    position: absolute;
    top: 15vh;
    left: 50vw;
    transform: translateX(-50%);
    height: 30vh;
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

    .form {
        height: 25vh;
        width: 15vw;
        padding-top: 2vh;
        padding-left: 2vw;
        padding-right: 2vw;


        .button-container {
            position: absolute;
            right: 4vw;
            bottom: 1vh;
        }

    }

}
</style>
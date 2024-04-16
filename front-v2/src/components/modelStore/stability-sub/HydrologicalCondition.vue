<template>
    <div class="conditions">

        <div class="head">
            <div class="head-text">水文条件选择</div>
        </div>

        <div class="form">
            <el-form :model="form" label-width="auto" style="max-width: 600px">
                <el-form-item label="水文条件">
                    <el-select v-model="form.condition" placeholder="请选择水文条件">
                        <el-option label="洪季大潮" value="洪季大潮" />
                        <el-option label="枯季小潮" value="枯季小潮" />
                        <el-option label="20年一遇" value="20年一遇" />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <div class="button-container">
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                        <el-button @click=" emit('closeHyCondition')">取消</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>

import { ElMessage } from 'element-plus';
import { reactive } from 'vue'

// do not use same name with ref
const form = reactive({
    condition: ''
})
const emit = defineEmits(['closeHyCondition']);

const onSubmit = () => {
    console.log(form);
    if(form.condition === ''){
        ElMessage({
            type:'warning',
            offset:100,
            message:"请选择水文条件后再确定！"
        })
        return;
    }

    emit('closeHyCondition',);
}


</script>

<style lang="scss" scoped>
.conditions {
    position: absolute;
    top: 15vh;
    left: 50vw;
    transform: translateX(-50%);
    height: 18vh;
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
        padding-top: 2vh;
        padding-left: 2vw;
        padding-right: 2vw;



        .button-container {
            position: absolute;
            right: 1vw;
            top: 1vh;
        }
    }

}
</style>
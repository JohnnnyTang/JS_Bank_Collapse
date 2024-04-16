<template>
    <div class="stParams">
        <div class="head">
            <div class="head-text">模型参数设置</div>
        </div>
        <div class="form">

            <el-form :model="form" label-width="auto" style="max-width: 600px">
                <el-form-item label="模拟时间(小时)">
                    <el-input v-model="form.simulateHour" />
                </el-form-item>
                <el-form-item label="模拟步长(分钟)">
                    <el-input v-model="form.simulateStep" />
                </el-form-item>
                <el-form-item label="底摩擦系数(曼宁系数)">
                    <el-input v-model="form.frictionParam" />
                </el-form-item>
                <el-form-item label="最小水深(m)">
                    <el-input v-model="form.minWaterDepth" />
                </el-form-item>
                <el-form-item label="水平涡动粘性系数">
                    <el-input v-model="form.SmagorinskyParam" />
                </el-form-item>

                <el-form-item>
                    <div class="button-container">
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                        <el-button @click=" emit('close')">取消</el-button>
                    </div>
                </el-form-item>
            </el-form>

        </div>
    </div>




</template>

<script setup>
import { reactive } from 'vue'



const emit = defineEmits(['close','params']);



// do not use same name with ref
const form = reactive({
    simulateHour: '72',
    simulateStep: '10',
    frictionParam: '0.013',
    minWaterDepth: '0.05',
    SmagorinskyParam: '0.23',
})

const onSubmit = () => {
    emit('params',form)
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

    .form {
        padding-top: 2vh;
        padding-left: 2vw;
        padding-right: 2vw;



        .button-container {
            position: absolute;
            right: 1vw;
            top: 0.3vh;
        }
    }
}
</style>
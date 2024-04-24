<template>
    <div class="velocity-calc-content">
        <div class="model-input">
            <div class="model-params-container card">
                <el-form
                    ref="ruleFormRef"
                    :model="ruleForm"
                    :rules="rules"
                    label-width="auto"
                    class="model-params card"
                    status-icon
                >
                    <el-form-item label="Activity name" prop="name">
                        <el-input v-model="ruleForm.name" />
                    </el-form-item>
                    <el-form-item label="Activity zone" prop="region">
                        <el-select
                            v-model="ruleForm.region"
                            placeholder="Activity zone"
                        >
                            <el-option label="Zone one" value="shanghai" />
                            <el-option label="Zone two" value="beijing" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            @click="submitForm(ruleFormRef)"
                        >
                            Create
                        </el-button>
                        <el-button @click="resetForm(ruleFormRef)"
                            >Reset</el-button
                        >
                    </el-form-item>
                </el-form>
            </div>
            <div class="section-graph-container card">
                <div ref="sectionGraphRef" class="section-graph card"></div>
            </div>
        </div>
        <div class="model-output">
            <div class="output-graph card"></div>
            <div class="output-table card"></div>
        </div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import { getSectionPoints } from './api.js'
import { drawSectionGraph } from './util.js'

const sectionGraphRef = ref(null)
const ruleFormRef = ref()

const ruleForm = {
    name: 'Hello',
}
const rules = {
    name: [
        {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur',
        },
        {
            min: 3,
            max: 5,
            message: 'Length should be 3 to 5',
            trigger: 'blur',
        },
    ],
}

const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
        } else {
            console.log('error submit!', fields)
        }
    })
}

const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
}

const options = Array.from({ length: 10000 }).map((_, idx) => ({
    value: `${idx + 1}`,
    label: `${idx + 1}`,
}))

onMounted(() => {
    const sectionPoints = getSectionPoints()
    const sectionChart = echarts.init(sectionGraphRef.value)
    drawSectionGraph(
        sectionChart,
        sectionPoints.data.map((value) => value[2]),
    )
})
</script>

<style lang="scss" scoped>
div.velocity-calc-content {
    height: 79vh;
    width: 75vw;
    background-color: #2a99c9;
    display: flex;

    .model-input {
        flex: 1 1 0;
        display: flex;
        flex-direction: column;

        .model-params-container {
            flex: 1 1 0;
        }
        .section-graph-container {
            flex: 1 1 0;
        }
    }
    .model-output {
        flex: 1 1 0;
        display: flex;
        flex-direction: column;

        .output-graph {
            flex: 1 1 0;
        }

        .output-table {
            flex: 1 1 0;
        }
    }

    .card {
        border-radius: 4px;
        margin: 1px;
        background-color: #abd5f8;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .section-graph {
        height: 90%;
        width: 95%;
        background-color: white;
    }

    .model-params {
        height: 90%;
        width: 95%;
        background-color: white;
        display: block;
    }
}
</style>

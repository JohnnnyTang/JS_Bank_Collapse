<template>
    <div class="model-flow-container">
        <div class="model-flow-title">风险预警模型工作流</div>
        <div class="model-flow-content">
            <VueFlow v-model="elements"> </VueFlow>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { VueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'

const elements = ref([
    // nodes

    // an input node, specified by using `type: 'input'`
    {
        id: '1',
        type: 'input',
        label: '计算断面选择',
        position: { x: 150, y: 5 },
    },

    // default node, you can omit `type: 'default'` as it's the fallback type
    { id: '2', label: '动力指标计算', position: { x: 50, y: 200 } },

    // An output node, specified by using `type: 'output'`
    { id: '3', label: '演变分析指标计算', position: { x: 250, y: 200 } },

    {
        id: '4',
        type: 'output',
        label: '多指标因子配置',
        position: { x: 150, y: 400 },
    },

    // A custom node, specified by using a custom type name
    // we choose `type: 'special'` for this example

    // edges

    // simple default bezier edge
    // consists of an id, source-id and target-id
    { id: 'e1-3', source: '1', target: '3', animated: true },

    // an animated edge, specified by using `animated: true`
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-4', source: '2', target: '4', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },

    // a custom edge, specified by using a custom type name
    // we choose `type: 'special'` for this example
])
</script>

<style lang="scss" scoped>

div.model-flow-container {
    width: 24vw;
    height: 85vh;
    border-radius: 8px;

    background-color: #abd5f8;
    overflow: hidden;

    div.model-flow-title {
        width: 23vw;
        height: 6vh;
        line-height: 6vh;
        margin-left: 0.5vw;

        text-align: center;
        font-size: calc(0.8vw + 0.9vh);
        font-weight: bold;

        // background-color: #477ab1;
        color: rgb(10, 0, 147);
        border-bottom: 3px solid #2a4ac9;
    }

    div.model-flow-content {
        width: 24vw;
        height: 79vh;

        background-color: #d4efff;
    }
}
</style>

<template>
    <div class="model-flow-container">
        <div class="model-flow-title">风险预警模型工作流</div>
        <div class="model-flow-content" ref="modelFlowDom">
            <VueFlow
                :nodes="multiIndexStore.flowNode"
                :edges="multiIndexStore.flowEdge"
                @node-click="FlowNodeClick"
                fit-view-on-init
            >
                <template #node-flow="props">
                    <FlowNode :data="props.data" />
                </template>
                <!-- <template #edge-flow="customEdgeProps">
                    <FlowEdge
                        :id="customEdgeProps.id"
                        :source-x="customEdgeProps.sourceX"
                        :source-y="customEdgeProps.sourceY"
                        :target-x="customEdgeProps.targetX"
                        :target-y="customEdgeProps.targetY"
                        :source-position="customEdgeProps.sourcePosition"
                        :target-position="customEdgeProps.targetPosition"
                        :data="customEdgeProps.data"
                        :marker-end="customEdgeProps.markerEnd"
                        :style="customEdgeProps.style"
                        :animated="customEdgeProps.animated"
                    />
                </template> -->
            </VueFlow>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { VueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import FlowNode from './FlowNode.vue'
// import FlowEdge from './FlowEdge.vue'
import { ElNotification } from 'element-plus'
import { useMultiIndexStore } from '@/store/multiIndexStore'

const multiIndexStore = useMultiIndexStore()
const modelFlowDom = ref()
const emit = defineEmits(['changeModel'])

const FlowNodeClick = (e) => {
    if (e.node.data.status < 0) {
        ElNotification({
            title: '无法调用',
            message: '请先完成前置步骤',
            type: 'warning',
            position: 'top-left',
        })
        return
    }
    console.log('click node', e.node.label)
    emit('changeModel', e.node.label)
}
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

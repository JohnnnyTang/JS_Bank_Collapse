<template>
    <div class="model-flow-container">
        <div class="model-flow-title">土体变形分析工作流</div>
        <div class="model-flow-content" ref="modelFlowDom">
            <VueFlow :nodes="nodes" :edges="edges" @node-drag-stop="onDragLeave" @node-click="onNodeClick">
                <!-- bind your custom node type to a component by using slots, slot names are always `node-<type>` -->
                <template #node-flow="specialNodeProps">
                    <!-- <SpecialNode v-bind="specialNodeProps" /> -->
                    <FlowNode :data="specialNodeProps.data"></FlowNode>
                </template>
                <!-- useGetPointerPosition -->
                <!-- bind your custom edge type to a component by using slots, slot names are always `edge-<type>` -->
                <template #edge-flow="specialEdgeProps">
                    <FLowEdge :id="specialEdgeProps.id" :source-x="specialEdgeProps.sourceX"
                        :source-y="specialEdgeProps.sourceY" :target-x="specialEdgeProps.targetX"
                        :target-y="specialEdgeProps.targetY" :source-position="specialEdgeProps.sourcePosition"
                        :target-position="specialEdgeProps.targetPosition" :data="specialEdgeProps.data"
                        :marker-end="specialEdgeProps.markerEnd" :style="specialEdgeProps.style"
                        :animated="specialEdgeProps.animated">
                    </FlowEdge>
                </template>
            </VueFlow>
        </div>
    </div>
</template>

<script setup>
import '@vue-flow/core/dist/style.css'
import { ref, computed, onMounted } from 'vue'
import { VueFlow, Position, MarkerType, useGetPointerPosition } from '@vue-flow/core'
import FlowNode from './customNode.vue'
import FLowEdge from './customEdge.vue'
import { useSoilAnalysisStore } from '../../../store/modelStore'

const soilAnalysisStore = useSoilAnalysisStore()

const nodes = soilAnalysisStore.nodes
const edges = soilAnalysisStore.edges

const onDragLeave = (e) => {
    console.log(e)
}
const onNodeClick = (e) => {
    console.log(e.node.computedPosition.x, e.node.computedPosition.y)
}

onMounted(() => {
    console.log('soilFlowChart onMounted', nodes, edges)
})


</script>

<style lang="scss" scoped>
div.model-flow-container {
    width: 26vw;
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
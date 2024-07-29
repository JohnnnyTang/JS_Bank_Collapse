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
import { ref } from 'vue'
import { VueFlow, Position, MarkerType, useGetPointerPosition } from '@vue-flow/core'
import FlowNode from './customNode.vue'
import FLowEdge from './customEdge.vue'

const nodes = ref([
    // an input node, specified by using `type: 'input'`
    {
        id: '1',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 202, y: 48 },
        data: { label: '评估断面选择', status: 0, },
    },

    {
        id: '2',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 32, y: 249 },
        data: { label: 'Detailed Bank', status: 1, },
    },
    // An output node, specified by using `type: 'output'`
    {
        id: '3',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 203, y: 249 },
        data: { label: 'Layer Thickness', status: 1, },
    },
    {
        id: '4',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 374, y: 249 },
        data: { label: 'Elevation of Flow', status: 1, },
    },
    {
        id: '5',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 202, y: 481 },
        data: { label: '评估结果', status: 1, },
    }
])

const edges = ref([
    {
        id: 'e1->2',
        source: '1',
        target: '2',
        animated: false,
        markerEnd: MarkerType.ArrowClosed,
    },
    {
        id: 'e1->3',
        source: '1',
        target: '3',
        animated: false,
        markerEnd: MarkerType.ArrowClosed,
    },
    {
        id: 'e1->4',
        source: '1',
        target: '4',
        animated: false,
        markerEnd: MarkerType.ArrowClosed,
    },
    {
        id: 'e2->5',
        source: '2',
        target: '5',
        animated: false,
        markerEnd: MarkerType.ArrowClosed,
    },
    {
        id: 'e3->5',
        source: '3',
        target: '5',
        animated: false,
        markerEnd: MarkerType.ArrowClosed,
    },
    {
        id: 'e4->5',
        source: '4',
        target: '5',
        animated: false,
        markerEnd: MarkerType.ArrowClosed,
    },
])

const onDragLeave = (e) => {
    console.log(e)
}
const onNodeClick = (e) => {
    console.log(e.node.computedPosition.x, e.node.computedPosition.y)
}


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
<template>
    <div class="main">
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
</template>

<script setup>
import '@vue-flow/core/dist/style.css'
import { ref } from 'vue'
import { VueFlow, Position, MarkerType, useGetPointerPosition } from '@vue-flow/core'
import FlowNode from '../modelStore/soilAnalysis/customNode.vue'
import FLowEdge from '../modelStore/soilAnalysis/customEdge.vue'

const nodes = ref([
    // an input node, specified by using `type: 'input'`
    {
        id: '1',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 25, y: 351 },
        data: { label: '评估断面选择', status: 0, },
    },

    {
        id: '2',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 205, y: 11 },
        data: { label: 'Node 2', status: 1, },
    },
    // An output node, specified by using `type: 'output'`
    {
        id: '3',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 333, y: 72 },
        data: { label: 'Node 3', status: 2, },
    },
    {
        id: '4',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 434, y: 166 },
        data: { label: 'Node 4', status: 3, },
    },
    {
        id: '5',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 520, y: 263 },
        data: { label: 'Node 5', status: 3, },
    },
    {
        id: '6',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 564, y: 358 },
        data: { label: 'Node 6', status: 3, },
    },
    {
        id: '7',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 520, y: 455 },
        data: { label: 'Node 7', status: 3, },
    },
    {
        id: '8',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 427, y: 551 },
        data: { label: 'Node 8', status: 3, },
    },
    {
        id: '9',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 319, y: 646 },
        data: { label: 'Node 9', status: 3, },
    },
    {
        id: '10',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 213, y: 735 },
        data: { label: 'Node 10', status: 3, },
    },
    {
        id: '11',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 623, y: 684 },
        data: { label: 'Node 11', status: 3, },
    },
])

const edges = ref([
    {
        id: 'e1->2',
        source: '1',
        target: '2',
        animated: false,
        label: '水流动力',
        markerEnd: MarkerType.ArrowClosed,
    },

    // set `animated: true` to create an animated edge path
    {
        id: 'e1->3',
        source: '1',
        target: '3',
        animated: false,
        label: '水流动力',
        markerEnd: MarkerType.ArrowClosed,
    },

    {
        id: 'e1->4',
        source: '1',
        target: '4',
        animated: false,
        label: '水流动力',
        markerEnd: MarkerType.ArrowClosed,
    },

    {
        id: 'e1->5',
        source: '1',
        target: '5',
        animated: false,
        label: '河床演变',
        markerEnd: MarkerType.ArrowClosed,
    },

    {
        id: 'e1->6',
        source: '1',
        target: '6',
        animated: false,
        label: '河床演变',
        markerEnd: MarkerType.ArrowClosed,
    },
    {
        id: 'e1->7',
        source: '1',
        target: '7',
        animated: false,
        label: '河床演变',
        markerEnd: MarkerType.ArrowClosed,
    },
    {
        id: 'e1->8',
        source: '1',
        target: '8',
        animated: false,
        label: '地质工程',
        markerEnd: MarkerType.ArrowClosed,
    },
    {
        id: 'e1->9',
        source: '1',
        target: '9',
        animated: false,
        label: '地质工程',
        markerEnd: MarkerType.ArrowClosed,
    },
    {
        id: 'e1->10',
        source: '1',
        target: '10',
        animated: false,
        label: '地质工程',
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
div.main {
    position: absolute;
    width: 100vw;
    height: 92vh;
    background-color: aliceblue;
}
</style>
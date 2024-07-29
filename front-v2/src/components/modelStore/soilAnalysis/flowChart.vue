<template>
    <div class="main">
        <VueFlow :nodes="nodes" :edges="edges">
            <!-- bind your custom node type to a component by using slots, slot names are always `node-<type>` -->
            <template #node-flow="specialNodeProps">
                <!-- <SpecialNode v-bind="specialNodeProps" /> -->
                <FlowNode :data="specialNodeProps.data"></FlowNode>
            </template>

            <!-- bind your custom edge type to a component by using slots, slot names are always `edge-<type>` -->
            <template #edge-flow="specialEdgeProps">
                <FlowEdge :id="specialEdgeProps.id" :source-x="specialEdgeProps.sourceX"
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
import { VueFlow,Position } from '@vue-flow/core'
import FlowNode from '../modelStore/riskCalc/FlowNode.vue';
import FlowEdge from '../modelStore/riskCalc/FlowEdge.vue';

const nodes = ref([
    // an input node, specified by using `type: 'input'`
    {
        id: '1',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 250, y: 5 },
        data: { label: 'Node 1', status: 0 },
    },

    {
        id: '2',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 100, y: 100 },
        targetPosition: Position.Left,
        data: { label: 'Node 1', status: 1 },
    },

    // An output node, specified by using `type: 'output'`
    {
        id: '3',
        type: 'flow', // <-- this is the custom node type name
        targetPosition: Position.Left,

        position: { x: 400, y: 200 },
        data: { label: 'Node 1', status: 2 },
    },

    // this is a custom node
    // we set it by using a custom type name we choose, in this example `special`
    // the name can be freely chosen, there are no restrictions as long as it's a string
    {
        id: '4',
        type: 'flow', // <-- this is the custom node type name
        position: { x: 300, y: 400 },
        data: { label: 'Node 1', status: 3 },
    },
])

const edges = ref([
    // default bezier edge
    // consists of an edge id, source node id and target node id
    {
        id: 'e1->2',
        source: '1',
        target: '2',
        animated: true,
    },

    // set `animated: true` to create an animated edge path
    {
        id: 'e1->3',
        source: '1',
        target: '3',
        animated: true,
    },

    // a custom edge, specified by using a custom type name
    // we choose `type: 'special'` for this example
    {
        id: 'e3->4',
        type: 'flow',
        source: '3',
        target: '4',
        animated: true,
        data: {
            hello: 'world',
        }
    },
])



</script>

<style lang="scss" scoped>
div.main {
    position: absolute;
    width: 100vw;
    height: 92vh;
    background-color: aliceblue;
}
</style>
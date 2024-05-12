<script setup>
import { BaseEdge, getBezierPath } from '@vue-flow/core'
import { BezierEdge } from '@vue-flow/core';
import { computed, onMounted, toRef, ref } from 'vue'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    sourceX: {
        type: Number,
        required: true,
    },
    sourceY: {
        type: Number,
        required: true,
    },
    targetX: {
        type: Number,
        required: true,
    },
    targetY: {
        type: Number,
        required: true,
    },
    sourcePosition: {
        type: String,
        required: true,
    },
    targetPosition: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: false,
    },
    markerEnd: {
        type: String,
        required: false,
    },
    style: {
        type: Object,
        required: false,
    },
    animated: {
        type: Boolean,
        required: false,
    },
})
const refProps = toRef(props)
const animated = ref(true)

console.log('edge-props', refProps.value)

// const path = computed(() => getBezierPath(props))

onMounted(() => {
})
</script>

<script>
export default {
    inheritAttrs: false,
}
</script>

<template>
    <BezierEdge
        :source-x="refProps.sourceX"
        :source-y="refProps.sourceY"
        :target-x="refProps.targetX"
        :target-y="refProps.targetY"
        :id="refProps.id"
        :style="refProps.style"
        :marker-end="refProps.markerEnd"
        :animated="animated"
    />
</template>

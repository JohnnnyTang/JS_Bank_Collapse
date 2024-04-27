<script setup>
import { toRef } from 'vue'
import { Handle, useHandleConnections } from '@vue-flow/core'

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})

console.log(props.data)
</script>

<template>
    <div
        class="process-node"
    >
        {{ props.data }}
    </div>
</template>

<style scoped>
.process-node {
    padding: 10px;
    border-radius: 8px;
    width: 8rem;
    height: 6rem;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: aqua;

    &:hover {
        cursor: pointer;
    }
}

</style>

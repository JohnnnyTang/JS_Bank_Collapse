<template>
    <div class="title-container">
    </div>
</template>

<script setup>
const props = defineProps({
    width: {
        type: String,
        default: '100%'
    },
    height: {
        type: String,
        default: '100%'
    },
    title: {
        type: String,
        default: '默认标题'
    }
})
</script>

<style lang="scss" scoped>
div.title-container {
    text-align: center;
    font-weight: bold;
}
</style>
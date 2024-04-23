<template>
    <div
        class="evolve-calc-content model-item-content"
    ></div>
</template>

<script setup></script>

<style lang="scss" scoped>
div.model-item-content {
    height: 79vh;
    width: 75vw;

    background-color: #2a99c9;

    &.section-choose-content {
        div.map-container {
            width: 75vw;
            height: 79vh;
        }
    }

    &.velocity-calc-content {
        background-color: #abd5f8;
    }

    &.evolve-calc-content {
        background-color: #7a7cad;
    }

    &.element-calc-content {
        background-color: #a2dede;
    }
}
</style>

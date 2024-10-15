<template>
    <div class="hide-button-vue" :class="props.direction">

    </div>
</template>

<script setup>

const props =defineProps({
    direction: {
        type: String,
        default: 'left'
    }
})

</script>

<style lang="scss" scoped>
div.hide-button-vue {
    width: 100%;
    height: 100%;

    background-image: url('/down-arrow.png');
    background-size: contain;
    background-position: 50% 50%;
    background-repeat: no-repeat;

    &.right {
        transform: rotate(-90deg);
    }

    &.left {
        transform: rotate(90deg);
    }

    filter: contrast(200%) saturate(200%) hue-rotate(10deg);

}
</style>
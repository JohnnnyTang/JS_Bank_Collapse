<template>
    <div class="return-top-container">
        <div class="return-top-icon" @click="returnTop"></div>
    </div>
</template>

<script setup>
const emit = defineEmits(['returnTop'])

function returnTop() {
    emit('returnTop')
}

</script>

<style lang="scss" scoped>
div.return-top-container {
    position: fixed;

    top: 9vh;
    right: 1vw;
    width: 4vw;
    height: 4vh;

    // background-color: aqua;

    display: flex;
    justify-content: center;
    align-items: center;

    div.return-top-icon {
        width: 3vw;
        height: 4vh;
        background-image: url("/left-arrow.png");
        background-size: contain;
        background-position: 50% 50%;
        background-repeat: no-repeat;
        transition: all 0.6s cubic-bezier(0.68, -0.35, 0.265, 1.35);

        &:hover {
            cursor: pointer;
            transform: translateX(-14%);

        }
    }
}
</style>
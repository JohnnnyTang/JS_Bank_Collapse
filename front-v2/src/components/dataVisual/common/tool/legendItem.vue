<template>
    <div class="legend-item">
        <div class="legend-style-region">
            <div class="legend-style" :style="props.style"></div>
        </div>
        <div class="legend-text-region">
            <div class="legend-text">{{ props.text }}</div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    style: Object,
    text: String
})
</script>

<style lang="scss" scoped>
.legend-item {
    position: relative;
    width: 100%;
    height: 3vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-top: 0.5vh;

    .legend-style-region {
        width: 45%;
        height: 3vh;
        display: flex;
        justify-content: center;
        align-items: center;

        .legend-style {
            // height..
            // image..
            // background-color...
            width: 100%;
            height: 50%;
            background-size: contain;
            background-repeat: no-repeat;
        }
    }


    .legend-text-region {
        width: 45%;
        height: 3vh;

        .legend-text {
            text-align: center;
            line-height: 3vh;
            font-size: calc(0.5vw + 0.5vh);
            color: rgb(10, 46, 106);
        }
    }

}
</style>
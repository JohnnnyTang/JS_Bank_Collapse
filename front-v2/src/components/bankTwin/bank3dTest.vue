<template>
    <div class="test" id="test" style="width: 200px;height: 200px;background-color: rebeccapurple;">
        我是测试弹窗
    </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
    test: String
})

onMounted(() => {
    console.log(' i am mounted ', props.test);
})
</script>

<style lang="scss" scoped>
div.test {
    position: absolute;
    left: 40%;
    top: 40%;
}
</style>
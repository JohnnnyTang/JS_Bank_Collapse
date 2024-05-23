<template>
    <div class="test" id="test" style="width: 200px;height: 200px;">
        hello unity popup
    </div>
</template>

<script setup>
import { onMounted } from 'vue'

// const props = defineProps({
//     test: String
// })

onMounted(() => {
    console.log(' i am mounted ',window.pickedObject);
})
</script>

<style lang="scss" scoped>
div.test {
    position: relative;
    background-color: aliceblue;
}
</style>
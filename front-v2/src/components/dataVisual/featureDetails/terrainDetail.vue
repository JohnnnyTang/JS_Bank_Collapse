<template>
    <div class='desc'>
        <div class='now'>当前高程</div>
        <div class='num'>{{props.height}}</div>
    </div>
</template>

<script setup>
import { onMounted,ref,computed } from 'vue'

const props = defineProps({
    height: Object
})


</script>

<style lang="scss" scoped>
.desc {
    background-color: rgb(163, 206, 245);
    width: 80px;
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    padding: 5px;

    .now {
        color: rgb(47, 94, 177);
        font-size: 15px;
        line-height: 15px;
    }

    .num {
        color: rgb(47, 94, 211);
        font-size: 20px;
        line-height: 20px;
        font-weight: 800;
    }
}
</style>
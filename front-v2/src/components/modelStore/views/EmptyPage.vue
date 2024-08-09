<template>
    <div class="empty-page">
        <el-empty :image-size="300">
            <h1>
                模块正在开发中...
            </h1>
        </el-empty>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.empty-page {
    position: absolute;
    width: 100vw;
    height: 92vh;
    display: flex;
    flex-direction: column;
    color: #055279;
}
</style>
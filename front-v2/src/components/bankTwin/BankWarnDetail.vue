<template>
    <div
        class="warn-detail-container"
        :class="props.warnActive ? 'active' : 'in-active'"
        v-loading="detailLoading"
    >
        <div class="warn-detail-title">报警信息详情</div>
        <div class="warn-detail-content">
            <div
                class="key-val-container"
                v-for="(item, index) in warnKeyValList"
                :key="index"
            >
                <div class="key-text">{{ item.key + '：' }}</div>
                <el-scrollbar>
                    <div class="val-text">{{ item.val }}</div>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    warnActive: {
        type: Boolean,
        default: true
    }
})

</script>

<style lang="scss" scoped></style>

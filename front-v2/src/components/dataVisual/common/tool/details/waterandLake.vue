<template>
    <div class="description-container">
        <el-descriptions class="margin-top" :title="title" :column="props.column" border>
            <el-descriptions-item v-for="( key, index ) in  Object.keys(fMap) " :key="index">
                <template #label>
                    <div class="cell-item">
                        {{ fMap[key] }}
                    </div>
                </template>
                {{ data[key] }}
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { sourceFieldMap } from '../../../js/tilefieldMAP'

const props = defineProps({
    ogData: Object,
    sourceId: String,
    column: Number,
})

const fMap = sourceFieldMap[props.sourceId]["fieldMap"]
const title = sourceFieldMap[props.sourceId]["original"]
const data = props.ogData

onMounted(() => {
    // console.log(props.column);
})
</script>

<style lang="scss" scoped>
.description-container {
    width: 25vw;
    // height: 20vh;
    overflow: hidden;
    border: 1px solid #ccc;
    border-radius: 3%;

    .margin-top {

        :deep(.el-descriptions__header) {
            justify-content: center;
            margin: 0;
            padding-top: 1vh;
            padding-bottom: 1vh;
            background-color: rgb(198, 229, 252);

            .el-descriptions__title {
                font-size: calc(0.7vw + 0.8vh);
            }
        }
    }

    :deep(.el-descriptions__body) {
        .el-descriptions__cell.el-descriptions__content.is-bordered-content {
            text-align: center;
        }

        .el-descriptions__label.el-descriptions__cell.is-bordered-label {
            background-color: rgb(198, 229, 252);
        }

        .cell-item {
            text-align: center;
        }
    }
}
</style>
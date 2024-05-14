<template>
    <div class="description-container">
        <div class="miniIcon" @click="close"></div>
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
import { onMounted, ref, watch } from 'vue'
import { sourceFieldMap } from '../../js/tilefieldMAP'

const props = defineProps({
    ogData: Object,
    sourceId: String,
    column: Number,
})
const emit = defineEmits(['close'])


const fMap = ref({})
const title = ref('')
const data = ref({})

watch(props, (V) => {
    console.log(V);
    if (sourceFieldMap[props.sourceId]) {
        fMap.value = sourceFieldMap[props.sourceId]["fieldMap"]
        title.value = sourceFieldMap[props.sourceId]["original"]
        data.value = props.ogData
    }
})
const close = () => {
    emit('close')
}

onMounted(() => {
    // console.log(props.column);
    // if (sourceFieldMap[props.sourceId]) {
    //     fMap = sourceFieldMap[props.sourceId]["fieldMap"]
    //     title = sourceFieldMap[props.sourceId]["original"]
    //     data = props.ogData
    // }
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

    :deep(.el-descriptions__header) {
        .el-descriptions__title {
            position: relative;
            height: 3vh;
            line-height: 3vh;
            border-radius: 6px;
            font-family: "Microsoft YaHei";
            font-weight: bold;
            font-size: calc(1.0vw + 0.8vh);
            color: #0a72c7;
            text-shadow: 0 0 10px #72c0ff;
        }
    }

    :deep(.el-descriptions__body) {


        .el-descriptions__cell.el-descriptions__content.is-bordered-content {
            text-align: center;
            background-color: #ecf5ff90;
            .cell-item{
                color: white;
            }
        }

        .el-descriptions__label.el-descriptions__cell.is-bordered-label {
            background-color: rgb(198,229,251);
        }

        .cell-item {
            text-align: center;
        }
    }

    .miniIcon {
        position: absolute;
        right: 0.5vw;
        width: 4vh;
        height: 4vh;
        background-image: url('/icons/minimize.png');
        background-size: contain;
        background-repeat: no-repeat;

        &:hover {
            cursor: pointer;
        }
    }
}
</style>
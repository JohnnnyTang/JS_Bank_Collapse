<template>
    <div class="description-container">
        <div class="miniIcon" @click="close"></div>

        <!-- <div class="bankDesc" v-if="props.sourceId === 'importantBank'">
            <h1>bank</h1>
            <el-descriptions title="xxx-I级预警">
                <el-descriptions-item label="所属城市">{{ props.ogData['city_name'] }}</el-descriptions-item>
                <el-descriptions-item label="所属河段">{{ props.ogData['river_name'] }}</el-descriptions-item>
                <el-descriptions-item label="监测长度">{{ props.ogData['monitoring_length'] }}</el-descriptions-item>
                <el-descriptions-item label="岸段简介">{{ props.ogData['description'] }}</el-descriptions-item>
                <el-descriptions-item label="治理工程">
                    {{ props.ogData['fix_project'] }}
                </el-descriptions-item>
            </el-descriptions>
        </div>


        <div class="sandDesc" v-if="props.sourceId === 'sandBar'">
            <h1>sand</h1>

        </div> -->

        <el-descriptions class="margin-top" :title="title" :column="props.column" border>
            <el-descriptions-item v-for="( key, index ) in  Object.keys(fMap) " :key="index">
                <template #label>
                    <div class="cell-item">
                        {{ fMap[key] }}
                    </div>
                </template>
                <el-scrollbar max-height="10vh">
                    <p style="text-align: left; padding-left: 0.1vw;">{{ noDataMap(data[key]) }}</p>
                </el-scrollbar>
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

const bankfiledDict = {
    "importantBank": {
        "bank_name": "名称",
        "city_name": "所属城市",
        "river_name": "所属河段",
        "monitoring_length": '监测长度',
        "warning_level": "预警等级",
        "description": '简介',
        "fix_project": '治理工程'
    }
}
const sandFieldDict = {
    "name": "名称",
    "river": "所属河段",
    "洲滩信息_面积": '面积(km²)',
    "洲滩信息_人口": '人口',
    "预案": '防汛预案'
}


watch(props, (V) => {
    console.log(V);
    if (sourceFieldMap[props.sourceId]) {
        fMap.value = sourceFieldMap[props.sourceId]["fieldMap"]
        // console.log(fMap.value, props.ogData,);
        title.value = props.ogData[sourceFieldMap[props.sourceId]["original"]]
        data.value = props.ogData
    }
})
const close = () => {
    emit('close')
}
const noDataMap = (data) => {
    if (data === '0' || data === '*' || data === '' || data === undefined || data === null) {
        return 'N/A'
    } else {
        return data
    }
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
// .description-container {
//     width: 25vw;
//     height: fit-content;
//     overflow: hidden;
//     border: 1px solid #ccc;
//     border-radius: 3%;
// }

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
        }
    }

    :deep(.el-descriptions__header) {
        height: 3vh;
        border-bottom: inset 3px #4f81ff;


        .el-descriptions__title {
            position: relative;
            height: 3vh;
            line-height: 3vh;
            font-weight: 600;
            font-size: calc(0.7vw + 0.6vh);
            background: #0237bd;
            text-shadow: 2px 8px 6px rgba(5, 2, 95, 0.207), 0px -5px 35px rgba(255, 255, 255, 0.167);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    :deep(.el-descriptions__body) {


        .el-descriptions__cell.el-descriptions__content.is-bordered-content {
            background-color: #ffffff;
            text-align: center;
            font-size: calc(0.6vw + 0.3vh);
            border-right: inset 2px rgb(23, 163, 248);
            border-bottom: inset 2px rgb(23, 163, 248);
            padding: 0.2vh;

            .cell-item {
                height: fit-content;
            }
        }

        // .el-descriptions__cell.el-descriptions__content.is-bordered-content {

        // }

        .el-descriptions__label.el-descriptions__cell.is-bordered-label {
            // background-color: rgb(198, 229, 251);
            color: #0237bd;
            background: rgb(197, 225, 244);
            font-size: calc(0.7vw + 0.4vh);
            height: 3vh;
            border-right: inset 2px #157acc;
            border-bottom: inset 2px #05a3ff;
        }

        .cell-item {
            text-align: center;
        }
    }

    .miniIcon {
        position: absolute;
        right: 0.5vw;
        top: 1vh;
        width: 2.5vh;
        height: 2.5vh;
        background-image: url('/icons/minimize.png');
        background-size: contain;
        background-repeat: no-repeat;

        &:hover {
            cursor: pointer;
        }
    }
}
</style>
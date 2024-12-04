<template>
    <div class="description-container">
        <div class="miniIcon" :style="iconBackStyle" @click="pinIt"></div>

        <div class="bankDesc" v-if="props.sourceId === 'importantBank'">
            <el-descriptions class="margin-top" :title="props.ogData['bank_name'] + '--' + level + '级预警'" :column="3"
            :class="{'smallFont':(props.ogData['bank_name'] + '--' + level + '级预警').length>15}"    
            border>
                <el-descriptions-item align="center">
                    <template #label>
                        <div class="cell-item">
                            所在地区
                        </div>
                    </template>
                    <el-scrollbar max-height="10vh">
                        <p style="text-align: center; padding-left: 0.1vw;">{{ props.ogData['city_name'] }}</p>
                    </el-scrollbar>
                </el-descriptions-item>

                <el-descriptions-item align="center">
                    <template #label>
                        <div class="cell-item">
                            所属河段
                        </div>
                    </template>
                    <el-scrollbar max-height="10vh">
                        <p style="text-align: center; padding-left: 0.1vw;">{{ props.ogData['river_name'] }}</p>
                    </el-scrollbar>
                </el-descriptions-item>

                <el-descriptions-item align="center">
                    <template #label>
                        <div class="cell-item">
                            监测长度
                        </div>
                    </template>
                    <el-scrollbar max-height="10vh">
                        <p style="text-align: center; padding-left: 0.1vw;">{{ props.ogData['monitoring_length'] + 'km' }}
                        </p>
                    </el-scrollbar>
                </el-descriptions-item>
                <el-descriptions-item align="left" span="3">
                    <template #label>
                        <div class="cell-item">
                            岸段简介
                        </div>
                    </template>
                    <el-scrollbar max-height="10vh">
                        <p style="text-align: left; padding-left: 0.1vw;">{{ props.ogData['description'] }}</p>
                    </el-scrollbar>
                </el-descriptions-item>
                <el-descriptions-item span="3" align="left">
                    <template #label>
                        <div class="cell-item">
                            治理工程
                        </div>
                    </template>
                    <el-scrollbar max-height="10vh">
                        <p style="text-align: left; padding-left: 0.1vw;">{{ bankFix }}</p>
                    </el-scrollbar>
                </el-descriptions-item>
            </el-descriptions>
        </div>


        <div class="sandDesc" v-else-if="props.sourceId === 'sandBar'">
            <el-descriptions class="margin-top" :title="props.ogData['name']" :column="3" border>
                <el-descriptions-item align="center">
                    <template #label>
                        <div class="cell-item">
                            面积
                        </div>
                    </template>
                    <el-scrollbar max-height="10vh">
                        <p style="text-align: left; padding-left: 0.1vw;">{{ sandBarArea }}</p>
                    </el-scrollbar>
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            人口
                        </div>
                    </template>
                    <el-scrollbar max-height="10vh">
                        <p style="text-align: left; padding-left: 0.1vw;">{{ props.ogData['洲滩信息_人口'] }}</p>
                    </el-scrollbar>
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            所属河段
                        </div>
                    </template>
                    <el-scrollbar max-height="10vh">
                        <p style="text-align: left; padding-left: 0.1vw;">{{ props.ogData['river'] }}</p>
                    </el-scrollbar>
                </el-descriptions-item>
                <el-descriptions-item span="3">
                    <template #label>
                        <div class="cell-item">
                            防汛预案
                        </div>
                    </template>
                    <el-scrollbar max-height="10vh">
                        <p style="text-align: left; padding-left: 0.1vw;">{{ sandBarFix }}</p>
                    </el-scrollbar>
                </el-descriptions-item>

            </el-descriptions>
        </div>

        <div class="channelDesc" v-else-if="props.sourceId === 'channel'">
            <el-descriptions class="margin-top" :title="title" :column="1" border>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            建设时间
                        </div>
                    </template>
                    <p style="text-align: center; padding-left: 0.1vw;">{{ noDataMap(data['construct_date']) }}</p>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            桥型简介
                        </div>
                    </template>
                    <p style="text-align: left; padding-left: 0.1vw;">{{ noDataMap(data['bridge_type']) }}</p>
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="waterDesc" v-else-if="props.sourceId === 'riverArea'">
            <el-descriptions class="margin-top" :title="title" :column="props.column" border>
                <el-descriptions-item v-for="( key, index ) in  Object.keys(fMap) " :key="index">
                    <template #label>
                        <div class="cell-item">
                            {{ fMap[key] }}
                        </div>
                    </template>
                    <el-scrollbar max-height="10vh">
                        <p style="text-align: center; padding-left: 0.1vw;">{{ noDataMap(data[key]) }}</p>
                    </el-scrollbar>
                </el-descriptions-item>
            </el-descriptions>
        </div>


        <div class="normal" v-else>
            <el-descriptions class="margin-top" :title="title" :column="props.column" border>
                <h1>111</h1>
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

    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { sourceFieldMap } from '../../js/tilefieldMAP'

const props = defineProps({
    ogData: Object,
    sourceId: String,
    column: Number,
})
const emit = defineEmits(['close', 'pin'])


const fMap = ref({})
const title = ref('')
const data = ref({})
const pinState = ref(false)
const iconBackStyle = computed(() => {
    return pinState.value ? { backgroundImage: `url('${import.meta.env.VITE_BASE}/icons/pin.png')` } : { backgroundImage: `url('${import.meta.env.VITE_BASE}/icons/notPin.png')` }
})

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
const level = computed(() => {
    let romanNumbers = ["I", "II", "III"];
    return romanNumbers[props.ogData['warning_level'] - 1]
})
const bankFix = computed(() => {
    return (props.ogData['fix_project'] == null || props.ogData['fix_project'] == undefined || props.ogData['fix_project'] == '') ? '暂无信息' : props.ogData['fix_project']

})

const sandBarArea = computed(() => {
    return props.ogData['洲滩信息_面积'] == 'N/A' ? 'N/A' : props.ogData['洲滩信息_面积'] + 'km²'
})
const sandBarFix = computed(() => {
    // console.log(props.ogData['预案'] == null || props.ogData['预案'] == undefined || props.ogData['预案'] == '');
    return (props.ogData['预案'] == null || props.ogData['预案'] == undefined || props.ogData['预案'] == '') ? '暂无信息' : props.ogData['预案']
})

watch(props, (V) => {
    // console.log(V, 'hello');
    if (sourceFieldMap[props.sourceId]) {
        fMap.value = sourceFieldMap[props.sourceId]["fieldMap"]
        title.value = props.ogData[sourceFieldMap[props.sourceId]["original"]]
        data.value = props.ogData
        // console.log(fMap.value, title.value, data.value);
    }
})
// const close = () => {
//     emit('close')
// }

const pinIt = () => {
    pinState.value = !pinState.value
    emit('pin', pinState.value)
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
    // width: 25vw;
    width: 20vw;
    // height: 20vh;
    overflow: hidden;
    border: 1px solid #ccc;
    border-radius: 2%;

    .margin-top {
        box-shadow: #173eaa 1px 1px, #173eaa 2px 2px, #173eaa 3px 3px;
        :deep(.el-descriptions__header) {
            justify-content: center;
            margin: 0;
            padding-top: 1vh;
            padding-bottom: 1vh;
            background-color: rgb(20, 115, 196);
            font-family: Arial, Helvetica, sans-serif;

        }
    }
    :deep(.el-descriptions__header) {
        height: 3vh;
        border: #4f81ff solid 1px;

        &:hover {
            cursor: move;
        }
        .el-descriptions__title {
            position: relative;
            width: fit-content;
            height: 4vh;
            line-height: 4vh;
            text-align: center;
            font-size: calc(1vw + 0.3vh);
            font-family: "Microsoft YaHei";
            font-weight: bold;
            color: #e3f4ff;
            text-shadow: #173eaa 1px 1px, #173eaa 2px 2px, #173eaa 3px 3px;
        }
    }
    .smallFont{
        :deep(.el-descriptions__header) {

            .el-descriptions__title {
                font-size: calc(0.6vw + 0.6vh);
            }
        }
    }

    :deep(.el-descriptions__body) {

        border: #60c0ff solid 1px;

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

            .cell-item.lable {
                width: 3vw;
            }
        }

        // .el-descriptions__cell.el-descriptions__content.is-bordered-content {

        // }

        .el-descriptions__label.el-descriptions__cell.is-bordered-label {
            // background-color: rgb(198, 229, 251);
            color: rgb(20, 115, 196);
            background: rgb(237, 248, 250);
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
        width: 2.3vh;
        height: 2.3vh;
        // background-image: url('/icons/pin.png');
        background-size: contain;
        background-repeat: no-repeat;

        &:hover {
            cursor: pointer;
        }
    }
}
</style>
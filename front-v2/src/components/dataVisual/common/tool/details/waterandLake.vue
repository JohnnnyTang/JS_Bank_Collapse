<template>
    <div class="description-container">
        <el-descriptions class="margin-top" :title="title" :column="option.column" border>
            <el-descriptions-item v-for="( key, index ) in  Object.keys(fMap) " :key="index">
                <template #label>
                    <div class="cell-item">
                        {{ fMap[key] }}
                    </div>
                </template>
                {{ data[key] }}
            </el-descriptions-item>

            <!-- <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        Username
                    </div>
                </template>
                kooriookami
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">

                        Telephone
                    </div>
                </template>
                18100000000
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        Place
                    </div>
                </template>
                Suzhou
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        Remarks
                    </div>
                </template>
                <el-tag size="small">School</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        Address
                    </div>
                </template>
                No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
            </el-descriptions-item> -->
        </el-descriptions>
    </div>
</template>

<script setup>
/*
    "lakeArea": {
        "original": "国普湖泊",
        "fieldMap": {
            "id": "id",
            "code": "编号",
            "basin": "流域",
            "water": "水系",
            "area": "水面面积",
            "height": "正常蓄水位",
            "name": "名称"
        }
    }
    {
        "area": 90,
        "code": "EB034",
        "name": "邵伯湖",
        "id": 1,
        "basin": "长江流域",
        "water": "长江干流水系",
        "center_y": 32.61453229409356,
        "center_x": 119.43241975533357,
        "height": 4.5
    }
*/
import { computed, ref } from 'vue'
import { sourceFieldMap } from '../../../js/tilefieldMAP'

const props = defineProps({
    ogData: Object,
    sourceId: String,
    option: Object
})

const fMap = sourceFieldMap[props.sourceId]["fieldMap"]
const title = sourceFieldMap[props.sourceId]["original"]
const data = props.ogData
const option = props.option

// const ogData = {
//     "area": 90,
//     "code": "EB034",
//     "name": "邵伯湖",
//     "id": 1,
//     "basin": "长江流域",
//     "water": "长江干流水系",
//     "center_y": 32.61453229409356,
//     "center_x": 119.43241975533357,
//     "height": 4.5
// }
// const fieldMap = {
//     "id": "id",
//     "code": "编号",
//     "basin": "流域",
//     "water": "水系",
//     "area": "水面面积",
//     "height": "正常蓄水位",
//     "name": "名称"
// }
// const title = "国普湖泊"

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
            background-color: rgb(198,229,252);

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
            background-color: rgb(198,229,252);
        }

        .cell-item {
            text-align: center;
        }
    }
}
</style>
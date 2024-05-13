<template>
    <div>
        <waterandLake :source-id="sourceId" :og-data="ogData" :option="option"></waterandLake>
    </div>
</template>

<script setup>
import waterandLake from './details/waterandLake.vue';
// debug
// const sourceId = 'lakeArea'
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
// const option ={
//     'colomn': 4
// }

// const sourceId = 'hydroStationPoint'
// const ogData = {
//     "sp_name": "河口",
//     "id": "63101130",
//     "place": "江苏省溧阳市社渚镇河口",
//     "begin": "1986年05月",
//     "center_y": 31.368706045000053,
//     "center_x": 119.22949820800012
// }
// const option = {
//     'colomn': 3
// }
const sourceId = 'embankmentLine'
const ogData = {
    "bank": "望虞河",
    "sp_name": "洞泾圩堤防",
    "level": "5级",
    "district": "苏州市",
    "class_sub": "土堤",
    "length": 2521,
    "county": "常熟市",
    "id": "320581000100",
    "class": "围（圩、圈）堤",
    "center_y": 31.611421218974886,
    "center_x": 120.58681741416116,
    "height": 5
}
const option = {
    'colomn': 3
}


</script>

<style lang="scss" scoped></style>
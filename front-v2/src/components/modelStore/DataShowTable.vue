<template>
  <div>{{tableData.title}}</div>
</template>

<script setup>
const props = defineProps({
  tableData: Object
})
console.log(props.tableData)
const tableData = props.tableData
// console.log(tableData)
</script>

<style scoped>
.large-area-chart {
  width: 100%;
  height: 100%; /* 调整为需要的高度 */
}
</style>
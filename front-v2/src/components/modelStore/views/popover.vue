<template>
    <div class="my-popover flex-row" :style="dynamicPos">
        <el-button type="primary" pla style="padding: 0px 8px;" @click="handleView">查看</el-button>
        <el-button type="warning" style="padding: 0px 8px;" @click="handleDelete">删除</el-button>
        <div class="arrow-down"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHydrodynamicStore } from '../../../store/modelStore';
import { ElNotification } from 'element-plus';

const hydrodynamicStore = useHydrodynamicStore();

const handleDelete = () => {

    const _focusingMarkerDom = hydrodynamicStore.focusingMarkerDom
    // const markerInfo = hydrodynamicStore.getMarkerInfo(_focusingMarkerDom)
    // console.log('markerInfo', markerInfo)
    hydrodynamicStore.removeMarkerInfo(_focusingMarkerDom)
    ElNotification({
        type: 'info',
        title: '提示',
        message: '删除潮位点',
        offset: 120,
    })
}
const handleView = () => {
    const _focusingMarkerDom = hydrodynamicStore.focusingMarkerDom
    const markerInfo = hydrodynamicStore.getMarkerInfo(_focusingMarkerDom)

    if (markerInfo.option) {
        ElNotification({
            type: 'info',
            title: '查看潮位数据',
            message: `经度：${markerInfo.lng.toFixed(4)}，纬度：${markerInfo.lat.toFixed(4)}`,
            offset: 120,
        })
        hydrodynamicStore.showingOption = markerInfo.option

    } else {
        ElNotification({
            type: 'warning',
            title: '提示',
            message: '此点潮位数据尚未计算',
            offset: 120,
        })
    }
}

</script>

<style lang="scss" scoped>
div.my-popover {

    position: relative;
    z-index: 5;
    width: auto;
    height: auto;
    // top: 0vh;
    // left: 0vw;
    // background-color: #faf8f8;
    // padding: 1vh 1vw;
    // border-radius: 10px;
    // box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;

    .view-button {
        position: relative;

    }

    .delete-button {
        position: relative;
    }

    // .arrow-down {
    //   position: absolute;
    //   left: 50%;
    //   top: 50%;
    //   transform: translateX(-50%) translateY(200%);
    //   border-left: 10px solid transparent;
    //   border-right: 10px solid transparent;
    //   border-top: 10px solid #000;
    //   /* 你可以根据需要更改颜色 */
    // }

}
</style>
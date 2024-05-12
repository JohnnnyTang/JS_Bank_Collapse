<template>
    <dv-border-box9>
        <div class="sideBar-container">
            <dv-decoration-11 style="width:75%;height: 7vh;">
                <div class="title-text">
                    综合数据专题
                </div>
            </dv-decoration-11>
            <hr class="hr_gradient">

            <div class="scenes-tree-container">
                <el-tree style="max-width: 600px" :data="dataSource" node-key="id" default-expand-all
                    :expand-on-click-node="false">
                    <template #default="{ node, data }">
                        <span class="custom-tree-node" @click="treeNodeClickHandler(node, data)">
                            <sceneContainer v-if="node.level == 1" :title="data.label"></sceneContainer>
                            <subSceneContainer v-else-if="node.level == 2" :title="data.label" :icon-src="data.icon"
                                :class="{ active: data.active }">
                            </subSceneContainer>
                        </span>
                    </template>
                </el-tree>
            </div>

        </div>
    </dv-border-box9>
</template>

<script setup>
import { BorderBox9 as DvBorderBox9, Decoration11 as DvDecoration11 } from '@kjgl77/datav-vue3'
import { onMounted, ref } from 'vue';
import subSceneContainer from '../common/subSceneContainer.vue';
import sceneContainer from '../common/sceneContainer.vue'
import { tree, scenes, layerGroups } from '../js/SCENES'
import { useMapStore, useNewSceneStore } from '../../../store/mapStore';

const dataSource = ref(tree)
const mapStore = useMapStore()
const sceneStore = useNewSceneStore()
const sceneDict = {
    '全江概貌': 0,
    '涉水工程': 1,
    '重点岸段': 2,
}


const treeNodeClickHandler = (node, data) => {
    // console.log(node);

    if (data.active) {
        data.active = false
        //移除
        let map = mapStore.getMap()
        if (node.level == 2) { // layerGroup 级别
            let selectedLayerGroupID = data.label
            sceneStore.LAYERGROUPMAP.value[selectedLayerGroupID].setMap(map)
            sceneStore.LAYERGROUPMAP.value[selectedLayerGroupID].hideLayer()
            sceneStore.LAYERGROUPMAP.value[selectedLayerGroupID].active = false

        } else if (node.level == 1) {
            let selectedSceneID = data.label
            sceneStore.SCENEMAP.value[selectedSceneID].setMap(map)
            sceneStore.SCENEMAP.value[selectedSceneID].hideScene()
            sceneStore.SCENEMAP.value[selectedSceneID].active = false
            for (let i = 0; i < dataSource.value[sceneDict[selectedSceneID]].children.length; i++) {
                dataSource.value[sceneDict[selectedSceneID]].children[i].active = false
            }
        }
        return
    }
    else {
        data.active = true
        // 添加
        let map = mapStore.getMap()
        if (node.level == 2) { // layerGroup 级别
            let selectedLayerGroupID = data.label
            sceneStore.LAYERGROUPMAP.value[selectedLayerGroupID].setMap(map)
            sceneStore.LAYERGROUPMAP.value[selectedLayerGroupID].showLayer()
            sceneStore.LAYERGROUPMAP.value[selectedLayerGroupID].active = true

        } else if (node.level == 1) {
            let selectedSceneID = data.label
            sceneStore.SCENEMAP.value[selectedSceneID].setMap(map)
            sceneStore.SCENEMAP.value[selectedSceneID].showScene()
            sceneStore.SCENEMAP.value[selectedSceneID].active = true
            for (let i = 0; i < dataSource.value[sceneDict[selectedSceneID]].children.length; i++) {
                dataSource.value[sceneDict[selectedSceneID]].children[i].active = true
            }
        }
    }



}

onMounted(async () => {
    // sceneStore.SCENEMAP.value = scenes
    // sceneStore.LAYERGROUPMAP.value = layerGroups

    setTimeout(() => {
        // wait for map init
        let mapInstance = mapStore.getMap()
        let selectedSceneID = '全江概貌'
        sceneStore.SCENEMAP.value[selectedSceneID].setMap(mapInstance)
        sceneStore.SCENEMAP.value[selectedSceneID].showScene()
        sceneStore.SCENEMAP.value[selectedSceneID].active = true
        for (let i = 0; i < dataSource.value[sceneDict[selectedSceneID]].children.length; i++) {
            dataSource.value[sceneDict[selectedSceneID]].children[i].active = true
        }
    }, 2000)


})


</script>

<style lang="scss" scoped>
div.sideBar-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;


    .title-text {
        position: relative;
        height: 5vh;
        line-height: 5vh;
        border-radius: 6px;
        font-family: "Microsoft YaHei";
        font-weight: bold;
        font-size: calc(0.8vw + 0.8vh);
        color: #0a72c7;
        text-shadow: 0 0 10px #72c0ff;
    }

    .hr_gradient {
        position: relative;
        margin-top: 0.5vh;
        border: 0;
        height: 0.4vh;
        width: 90%;
        background-image: linear-gradient(to right, rgb(167, 233, 255), rgb(14, 155, 219), rgb(167, 233, 255));
    }

    .scenes-tree-container {
        position: relative;
        width: 90%;
        height: 80vh;
        background-color: #f1fcff;
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 3px;
        }

        &::-webkit-scrollbar-track {
            background-color: rgba(10, 231, 251, 0.219);
        }

        &::-webkit-scrollbar-thumb {
            background-color: #15a1e294;
            border-radius: 5px;
        }

        &::-webkit-scrollbar-thumb:hover {
            background-color: #3af0f781;
        }
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
}

:deep(.el-tree) {

    .el-tree-node__content {
        height: 6vh;
    }

    .el-tree-node__content>.el-tree-node__expand-icon {
        padding: 0px;
    }

    .el-tree-node__expand-icon {
        font-size: calc(0.8vw + 0.6vh);
        color: #0a72c7;
    }


}
</style>
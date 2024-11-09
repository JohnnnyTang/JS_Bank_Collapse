<template>
    <div class="file-view">

        <div class="header">
            <div>崩岸监测预警系统知识库管理</div>
        </div>

        <div class="tree">
            <el-scrollbar height="80vh">
                <el-tree style="width: 85vw" :data="treeData" :props="defaultProps" @node-click="handleNodeClick"
                    :default-expand-all="true">
                    <template #default="{ node, data }">
                        <div class="file-set" v-if="data.fileCollection">
                            <FileCard v-for="(item, index) in data.fileCollection" :fileInfo="item" :key="index"
                                @click.stop="handleFileClick(item, node)"
                                @contextmenu.prevent="rightClickHandler($event, item, node)">
                            </FileCard>
                        </div>
                        <div v-else class="title" :layer="data.layer">
                            {{ data.label }}
                        </div>
                    </template>
                </el-tree>
            </el-scrollbar>
        </div>

        <!-- right menu -->
        <div v-show="showRightMenu" class="right-menu" ref="menu">
            <div class="right-memu-item" @click="downloadFileHandler">
                <span>删除</span>
            </div>
            <div class="right-memu-item" @click="deleteFileHandler">
                <span>下载</span>
            </div>
        </div>


        <!-- preview -->
        <FilePreviewer :fileInfo="previewFileInfo" v-model:show="showPreview"></FilePreviewer>
    </div>
</template>

<script setup>
import FileCard from './FileCard.vue'
import { fileTree } from '../globalGraph/tree.js';
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import FilePreviewer from './FilePreviewer.vue';



///////////////tree ///////////////////
const handleNodeClick = (data, node) => {
    console.log(data, node)
}
const defaultProps = {
    children: 'children',
    label: 'label',
}
const buildTree = () => {
    return fileTree
}
const treeData = ref([])



///////////////file operation ///////////////////
const previewFileInfo = ref({
    label: '',
    filePath: '',
})
const showPreview = ref(false)
const handleFileClick = (fileInfo, node) => {
    ElMessage.info('预览文件 ' + fileInfo.label)
    previewFileInfo.value = fileInfo
    showPreview.value = true
}
const downloadFileHandler = () => {
    const { fileInfo, node } = rightClickingFileNode
    ElMessage.info('下载文件 ' + fileInfo.label)
    const downloadUrl = './download/' + fileInfo.filePath
    downloadFile(downloadUrl)
}
const deleteFileHandler = () => {
    const { fileInfo, node } = rightClickingFileNode
    ElMessage.info('删除文件 ' + fileInfo.label)
}



///////////////context menu ///////////////////
const menu = ref(null)
const showRightMenu = ref(false)
let rightClickingFileNode = {
    fileInfo: null,
    node: null
}
const closeRightMenu = () => {
    showRightMenu.value = false;
    window.removeEventListener("click", closeRightMenu);
}
const rightClickHandler = (event, fileInfo, node) => {

    rightClickingFileNode.fileInfo = fileInfo
    rightClickingFileNode.node = node
    if (menu.value) {
        showRightMenu.value = false;
        showRightMenu.value = true;
        menu.value.style.left = event.clientX - 5 + "px";
        menu.value.style.top = event.clientY - 80 + "px";
        window.addEventListener("click", closeRightMenu);
    }
};






onMounted(() => {
    treeData.value = buildTree()
})



/////////////// Helper ////////////////
const downloadFile = (url) => {
    var a = document.createElement('a');
    a.href = url;
    a.download = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
</script>

<style lang="scss" scoped>
.file-view {
    position: relative;
    width: 100vw;
    height: 92vh;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;

    .header {
        position: relative;
        width: 85vw;
        height: 6vh;
        line-height: 6vh;
        font-size: calc(1.3vw + 1vh);
        font-weight: 700;
        font-family: 'Microsoft YaHei';
        color: #0446a8;
        text-align: center;
    }

    .tree {
        position: relative;
        width: 85vw;
        height: 80vh;
    }
}

.file-set {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 98vw;
    // margin-top: 10vh;
    z-index: 2;
    flex-wrap: wrap;
}

.title {
    position: relative;
    width: 100%;
    height: 4vh;
    // background-color: #c5e4ff;
    font-size: calc(0.7vw + 0.5vh);
    font-family: 'Microsoft YaHei';
    text-align: left;
    line-height: 4vh;

    &[layer="1"] {
        font-size: calc(1.5vw + 1.2vh);
        margin: 1vh 0;
        font-weight: 800;
    }

    &[layer="2"] {
        font-size: calc(0.9vw + 0.8vh);
        margin: 0.9vh 0;
        font-weight: 700;
    }

    &[layer="3"] {
        font-size: calc(0.8vw + 0.7vh);
        margin: 0.8vh 0;
        font-weight: 600;
    }
}

.right-menu {
    z-index: 999;
    position: absolute;
    width: 100px;
    position: absolute;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: white;
    cursor: pointer;

    .right-memu-item {
        position: relative;
        width: 100px;
        height: 4vh;
        line-height: 4vh;
        transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        padding-left: 0.5vw;
        box-shadow: rgba(193, 233, 255, 0.8) 1px 1px, rgba(193, 233, 255, 0.7) 2px 2px, rgba(193, 233, 255, 0.6) 3px 3px;
        background-color: rgb(255, 255, 255);

        font-family: 'Microsoft YaHei';
        font-size: calc(0.8vw + 0.6vh);

        span {
            padding-left: 0.5vw;
        }

        &:hover {
            background-color: rgb(195, 224, 255);
        }
    }
}

:deep(.el-tree) {
    .el-tree-node__content {
        height: fit-content;
    }
}
</style>
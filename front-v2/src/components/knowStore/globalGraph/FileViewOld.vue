<template>
    <div class="file-view">

        <div class="header">
            <div class="tree-title-icon"></div>
            <div class="tree-title-text">江苏省长江崩岸监测预警知识库</div>
            <div class="upload" @click="uploadHandler">上传</div>
        </div>

        <!-- tree -->
        <div class="tree">
            <el-scrollbar height="80vh">
                <el-tree style="width: 85vw" :data="treeData" :props="defaultProps" @node-click="handleNodeClick"
                    ref="treeRef" @node-expand="handleNodeExpand" @node-collapse="handleNodeCollapse"
                    :default-expand-all="false">
                    <template #default="{ node, data }">
                        <div class="file-set" v-if="data.fileCollection">
                            <FileCard v-for="(item, index) in data.fileCollection" :fileInfo="item" :key="index"
                                @click.stop="handleFileClick(item, node)"
                                @contextmenu.prevent="rightClickHandler($event, item, node)">
                            </FileCard>
                        </div>
                        <div v-else class="title" :layer="data.layer">
                            <span>{{ data.label }}</span>
                            <div class="upload" @click.stop="uploadHandler(node, data)">上传</div>
                        </div>
                    </template>
                </el-tree>
            </el-scrollbar>
        </div>

        <!-- right menu -->
        <div v-show="showRightMenu" class="right-menu" ref="menu">
            <div class="right-memu-item" @click="downloadFileHandler">
                <span>下载</span>
            </div>
            <div class="right-memu-item" @click="deleteFileHandler">
                <span>删除</span>
            </div>
        </div>


        <!-- preview -->
        <FilePreviewer :fileInfo="previewFileInfo" v-model:show="showPreview"></FilePreviewer>

        <!-- upload -->
        <FileUpload :info="uploadInitInfo" v-model:uploadShow="showUpload" @upload-success="handleUploadSuccess">
        </FileUpload>

    </div>
</template>

<script setup>
import FileCard from './FileCard.vue'
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import FilePreviewer from './FilePreviewer.vue';
import FileUpload from './FileUpload.vue';
import KnowStoreHelper from '../knowStoreHelper';


///////////////tree ///////////////////
const handleNodeClick = (data, node) => {
    console.log(data, node)
}
const defaultProps = {
    children: 'children',
    label: 'name',
}

const treeData = ref([])
const treeRef = ref(null)


/////////////// 节点展开和收起记录 //////////////
const expandedNodesIds = ref([]);
const handleNodeExpand = (node) => {
    if (!expandedNodesIds.value.includes(node.id)) {
        expandedNodesIds.value.push(node.id);
    }
};
const handleNodeCollapse = (node) => {
    const index = expandedNodesIds.value.indexOf(node.id);
    if (index > -1) {
        expandedNodesIds.value.splice(index, 1);
    }
};






/////////////// file upload //////////////////
const showUpload = ref(false)
const uploadInitInfo = reactive({
    name: '',
    dirPath: [],
    type: '',
})


const uploadHandler = (node = null, data = null) => {
    if (node && data) {
        // upload in row
        uploadInitInfo.name = ''
        uploadInitInfo.type = ''
        uploadInitInfo.dirPath = data.dirPath
        showUpload.value = true
    }
    else {
        // upload in title , reset
        uploadInitInfo.dirPath = []
        uploadInitInfo.name = ''
        uploadInitInfo.type = ''
        showUpload.value = true
    }
}

const handleUploadSuccess = async () => {
    refreshTree()
}


///////////////file operation ///////////////////
const previewFileInfo = reactive({
    label: '',
    filePath: '',// 注意这边是URL
    type: '',
})
const showPreview = ref(false)
const handleFileClick = (fileInfo, node) => {
    info('预览文件 ' + fileInfo.label)
    const fileURL = KnowStoreHelper.getOneFileUrl(fileInfo)
    previewFileInfo.label = fileInfo.label
    previewFileInfo.filePath = fileURL
    previewFileInfo.type = fileInfo.type
    showPreview.value = true
}
const downloadFileHandler = () => {
    const { fileInfo, node } = rightClickingFileNode
    KnowStoreHelper.downloadOneFile(fileInfo)
}

const deleteFileHandler = () => {
    const { fileInfo, node } = rightClickingFileNode
    info('删除文件 ' + fileInfo.label)
    KnowStoreHelper.deleteOneFile(fileInfo).then(() => {
        info('文件删除成功')
        refreshTree()
    })
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






onMounted(async () => {
    treeData.value = await buildTree()

    const gdata = await KnowStoreHelper.getGraphData()
    console.log(gdata)
})



/////////////// Helper ////////////////
const info = (msg) => {
    ElMessage.info({
        offset: 110,
        message: msg
    })
}
const searchPath = (node) => {
    let path = []
    path.push(node.data.label)
    while (node.level !== 1) {
        node = node.parent
        path.push(node.data.label)
    }
    return path.reverse()
}
const buildTree = () => {
    return KnowStoreHelper.getTreeData()
}
const refreshTree = async () => {
    treeData.value = await buildTree()
    treeRef.value.setExpandedKeys(expandedNodesIds.value)
}
const dpCpy = (obj) => {
    return JSON.parse(JSON.stringify(obj))
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
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;

        background-color: rgba(204, 233, 252, 0.9);
        backdrop-filter: blur(6px);

        border-bottom: 3px solid rgb(15, 83, 230);

        div.tree-title-icon {
            height: 4vh;
            width: 4vh;
            background-image: url('/binary-data.png');
            background-size: contain;
            background-repeat: no-repeat;
        }
    }

    .upload {
        position: absolute;
        right: 1vw;
        top: 0;
        width: 5vw;
        height: 4vh;
        line-height: 4vh;

        cursor: pointer;
        text-align: center;
        font-size: calc(0.8vw + 0.6vh);
        font-weight: bold;
        background-color: black;
        color: white;
        border-radius: 5px;
        transition: 0.1s ease-in-out;

        &:hover {
            background-color: rgb(77, 0, 87);
        }
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
    font-size: calc(0.7vw + 0.5vh);
    font-family: 'Microsoft YaHei';
    text-align: left;
    line-height: 4vh;

    &[layer="1"] {
        font-size: calc(1.5vw + 1.2vh);
        margin: 1vh 0;
        font-weight: 800;
        background-color: rgb(222, 226, 255);
    }

    &[layer="2"] {
        font-size: calc(0.9vw + 0.8vh);
        margin: 0.9vh 0;
        font-weight: 700;
        background-color: rgb(235, 238, 255);
    }

    &[layer="3"] {
        font-size: calc(0.8vw + 0.7vh);
        margin: 0.8vh 0;
        font-weight: 600;
        background-color: rgb(240, 242, 255);
    }

    .upload {
        position: absolute;
        right: 1vw;
        top: 0;
        width: 5vw;
        height: 4vh;
        line-height: 4vh;

        cursor: pointer;
        text-align: center;
        font-size: calc(0.8vw + 0.6vh);
        font-weight: bold;
        background-color: rgb(184, 203, 255);
        color: #002d70;
        border-radius: 5px;
        transition: 0.3s ease-in-out;

        &:hover {
            background-color: rgb(129, 141, 252);
        }
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
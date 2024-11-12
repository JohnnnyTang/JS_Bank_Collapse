<template>
    <div class="file-view" v-loading="loading">
        <!-- tree -->
        <div class="tree">
            <el-scrollbar height="80vh">
                <el-tree style="width: 85vw" :data="treeData" :props="defaultProps" @node-click="handleNodeClick"
                    ref="treeRef" :default-expand-all="true">
                    <template #default="{ node, data }">
                        <div class="file-set" v-if="data.fileCollection">
                            <FileCard v-for="(item, index) in data.fileCollection" :fileInfo="item" :key="index"
                                @click.stop="handleFileClick(item, node)"
                                @contextmenu.prevent="rightClickHandler($event, item, node)">
                            </FileCard>
                        </div>
                        <div v-else class="title gradient" :layer="data.layer">
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

/////////////// other //////////////////
const loading = ref(false)




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
        menu.value.style.left = event.clientX - 200 + "px";
        menu.value.style.top = event.clientY - 150 + "px";
        window.addEventListener("click", closeRightMenu);
    }
};






onMounted(() => {
    refreshTree()

    window.addEventListener('keydown', e => {
        if (e.key === '1') {
            refreshTree()
        }
    })
})



/////////////// Helper ////////////////
const info = (msg) => {
    ElMessage.info({
        offset: 110,
        message: msg
    })
}

const refreshTree = async () => {
    loading.value = true
    treeData.value = await KnowStoreHelper.getTreeData()
    loading.value = false
}
const dpCpy = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}
</script>

<style lang="scss" scoped>
.file-view {
    position: relative;
    height: 74vh;
    width: 80vw;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .tree {
        position: relative;
        height: 74vh;
        width: 80vw;
    }
}

.file-set {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 78vw;
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

    &.gradient {
        color: #26255e;
        font-family: "Microsoft YaHei";
    }

    &[layer="1"] {
        font-size: calc(0.9vw + 0.8vh);
        margin: 1vh 0;
        font-weight: 800;
    }

    &[layer="2"] {
        font-size: calc(0.8vw + 0.6vh);
        margin: 0.9vh 0;
        font-weight: 700;
      
    }

    &[layer="3"] {
        font-size: calc(0.65vw + 0.5vh);
        margin: 0.8vh 0;
        font-weight: 600;
        background-clip: none;

    }



    .upload {
        position: absolute;
        right: 7.5vw;
        top: 0;
        width: 3vw;
        height: 3vh;
        line-height: 3vh;
        margin: 0.5vh 0vw;


        cursor: pointer;
        text-align: center;
        font-size: calc(0.7vw + 0.4vh);
        font-weight: bold;
        background-color: rgb(149, 174, 255);
        color: #ffffff;
        border-radius: 5px;
        transition: 0.3s ease-in-out;

        &:hover {
            background-color: rgb(134, 146, 255);
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
        margin-left: 1vw;
    }

    .el-tree-node__expand-icon {
        font-size: 1vw;
    }
}
</style>
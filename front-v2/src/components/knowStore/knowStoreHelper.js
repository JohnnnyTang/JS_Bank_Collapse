import axios from 'axios';
import { ElMessage } from 'element-plus';

const VALID_TYPE = ['pdf', 'picture', 'video']
export const TYPE_MIME = {
    'pdf': 'application/pdf',
    'picture': 'image/png',
    'video': 'video/mp4',
    // 'mp4': 'video/mp4',
}
export const MIME_TYPE = {
    "application/pdf": "pdf",
    "image/png": "picture",
    "video/mp4": "video"
}

const knowAPI = axios.create({
    baseURL: import.meta.env.VITE_MAP_TILE_SERVER2 + '/data/knowledge',
    timeout: 5000
})

export default class KnowStoreHelper {


    //////////// Request //////////////
    static getAllFiles() {

        return handleError(knowAPI.get())

    }

    static uploadOneFile(file, info) {
        console.log(info)
        if (!infoCheck(info)) return
        console.log(info)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('info', JSON.stringify(info))
        return handleError(knowAPI.post(info.type, formData))

    }

    static getOneFile(info) {

        if (!infoCheck(info)) return

        return handleError(knowAPI.get(`/${info.type}/${info.name}`))

    }

    static getOneFileUrl(info) {
        if (!infoCheck(info)) return
        return `${knowAPI.defaults.baseURL}/${info.type}/${info.name}`
    }

    static downloadOneFile(info) {
        if (!infoCheck(info)) return

        let url = `${info.type}/${info.name}`
        knowAPI.get(url, { responseType: 'blob' }).then(response => {
            const blob = new Blob([response.data], { type: TYPE_MIME[info.type] });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = info.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(error => {
            errorMsg('下载出错：' + error.message)
        });
    }

    static deleteOneFile(info) {

        if (!infoCheck(info)) return

        return handleError(knowAPI.delete(`/${info.type}/${info.name}`))

    }

    //////////// Data //////////////
    static getTreeData() {
        return handleError(knowAPI.get().then(response => {
            const data = response.data;
            return mergeChildren(generateTreeFromList(data));
        }))
    }

    static getGraphData() {
        return handleError(knowAPI.get().then(response => {
            const data = response.data;
            return generateTreeWithRootFromList(data);
        }))
    }



}


function infoCheck(info) {
    // 必须要有文件名,文件类型,文件路径
    const { type, name, dirPath } = info
    if (!VALID_TYPE.includes(type) || !name || !dirPath) {
        console.warn('KnowStoreHelper::' + 'Invalid file type or empty name')
        return false
    }
    return true
}


function handleError(promise) {
    try {
        return promise;
    } catch (error) {
        if (axios.isCancel(error)) {
            errorMsg('上传失败:' + '请求被取消')
        } else if (error.code === 'ECONNABORTED') {
            errorMsg('上传失败:' + '请求超时')
        } else {
            console.log('其他错误：', error);
            errorMsg('上传失败:' + error.message)
        }
        throw error;
    }
}

function generateTreeFromList(fileList) {
    const root = { name: 'Root', type: 'folder', children: [] };
    const pathMap = new Map();

    // 遍历文件列表，构建路径节点和文件节点
    fileList.forEach((item) => {
        const { name, type, dirPath } = item;
        let currentNode = root;
        let currentPath = '';
        let currentLayer = 1;

        // 遍历目录路径，创建或查找路径节点
        dirPath.forEach((folder, index) => {
            currentPath += `/${folder}`;
            if (!pathMap.has(currentPath)) {
                const newNode = {
                    name: folder,
                    type: 'folder',
                    label: folder,
                    layer: currentLayer,
                    dirPath: dirPath.slice(0, index + 1),
                    children: []
                };
                pathMap.set(currentPath, newNode);
                currentNode.children.push(newNode);
            }
            currentNode = pathMap.get(currentPath);
            currentLayer++;
        });

        // 创建文件节点并添加到当前路径节点的子节点中
        const fileNode = { name, type, dirPath, label: name, layer: currentLayer };
        currentNode.children.push(fileNode);
    });


    return root.children;
}

function generateTreeWithRootFromList(fileList) {
    let idCounter = 0;

    const root = { label: '长江崩岸监测\n预警知识库', name: '长江崩岸监测\n预警知识库', id: '' + idCounter++, type: 'root', layer: 0, children: [] };
    const pathMap = new Map();

    // 遍历文件列表，构建路径节点和文件节点
    fileList.forEach((item) => {
        const { name, type, dirPath } = item;
        let currentNode = root;
        let currentPath = '';
        let currentLayer = 1;

        // 遍历目录路径，创建或查找路径节点
        dirPath.forEach((folder, index) => {
            currentPath += `/${folder}`;
            if (!pathMap.has(currentPath)) {
                const newNode = {
                    name: folder,
                    type: 'folder',
                    label: folder,
                    dirPath: dirPath.slice(0, index + 1),
                    id: '' + idCounter++,
                    layer: currentLayer,
                    children: []
                };
                pathMap.set(currentPath, newNode);
                currentNode.children.push(newNode);
            }
            currentNode = pathMap.get(currentPath);
            currentLayer++;
        });

        // 创建文件节点并添加到当前路径节点的子节点中
        const fileNode = { name, type, dirPath, label: name, id: '' + idCounter++, layer: currentLayer };
        currentNode.children.push(fileNode);
    });

    return root;
}

function mergeChildren(treeData) {
    function processNode(node) {
        const nonFolderChildren = [];
        const folderChildren = [];

        // 遍历当前节点的所有子节点
        node.children.forEach((child) => {
            if (child.type === 'folder') {
                folderChildren.push(child);
            } else {
                nonFolderChildren.push(child);
            }
        });

        // 如果存在非文件夹类型的子节点，则进行合并操作
        if (nonFolderChildren.length > 0) {
            node.children = [
                ...folderChildren,
                {
                    label: '新孩子',
                    fileCollection: nonFolderChildren,
                    type: 'collection', // 可以根据需要定义新的类型
                    dirPath: node.dirPath
                },
            ];
        }

        // 递归处理文件夹类型的子节点
        folderChildren.forEach(processNode);
    }

    // 从根节点开始处理整个树
    treeData.forEach(processNode);

    return treeData;
}

function treeToGraph(treeRoot) {
    const nodes = [];
    const edges = [];
    let id = 0;

    function processNode(node, parentId) {
        const nodeId = id++; // 这里简单使用节点的name作为唯一标识，你也可以根据需求生成更独特的id
        nodes.push({
            id: nodeId,
            label: node.label,
            type: node.type,
            dirPath: node.dirPath
        });

        if (parentId) {
            edges.push({
                source: parentId,
                target: nodeId
            });
        }

        if (node.children && node.children.length > 0) {
            node.children.forEach((child) => {
                processNode(child, nodeId);
            });
        }
    }

    // treeData.forEach((rootNode) => {
    //     processNode(rootNode, null);
    // });
    processNode(treeRoot, null);

    return { nodes, edges };
}


const info = (msg) => {
    ElMessage.info({
        message: msg,
        offset: 100
    })
}
const errorMsg = (msg) => {
    ElMessage.error({
        message: msg,
        offset: 100
    })
}

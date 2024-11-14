<template>
    <div class="geologyAndProject-container">
        <div class="title-context geology">
            地质结构
        </div>
        <button class="edit-button" @click="editClickHandler()" :class="{ 'active': true }">
            编辑
        </button>
        <dv-decoration10 :Dur="1" :color="['rgba(231, 137, 15, 0.7)', 'rgba(171, 184, 197, 0.8)']"
            style="position: absolute; height: 8.5vh; width: 25vw; left: 0.7vw;" />
        <div class="item-container geology">
            <div class="img-container geology">
                <el-image class="geology" style="width: 100%; height: 100%;" :src="image1Url" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :initial-index="4" :preview-src-list="srcList1" alt="地质结构" />
            </div>
            <div class="geology-content content">
                <!-- <div class="part1-content">粉质黏土 1.5m</div>
                <div class="part2-content">粉砂 2m</div>
                <div class="part3-content">淤泥质粉质黏土<br>7.5m</div>
                <div class="part4-content">粉砂 28m</div> -->
                <!-- <div v-for="(item, index) in formationData" :class="getFormationClass(item.name)" :style="{...getHeightStyle(item.height), backgroundColor: getColorForName(item.name), borderLeft: `4px solid ${getColorForName(item.name)}`}" :key="index">{{ item.name }}{{ item.height }}</div> -->
                <div v-for="(item, index) in formationData" class="part-content" :style="{...getHeightStyle(item.height), backgroundColor: getColorForName(item.name), borderLeft: `4px solid ${getColorForName(item.name)}`}" :key="index">{{ item.name }}{{ item.height }}</div>
                <div class="edit-pannel-container" v-if="addFormationPannelShow">
                    <div class="title">添加土层</div>
                    <div class="part">
                        <span>土层名称：</span>
                        <el-input v-model="formationName" @input="handleNameInput" style="width: 6vw; height: 3.1vh" placeholder="请输入" /> 
                    </div>
                    <div class="part">
                        <span>土层高度：</span>
                        <el-input v-model="formationHeight" @input="handleHeightInput" style="width: 6vw; height: 3.1vh" placeholder="请输入" /> 
                    </div>
                    <div class="submit">
                        <button class="cancel-button" @click="cancelAddFormation" :class="{ 'active': true }" style="width: 4vw; height: 3vh; font-size: medium;">
                            取消
                        </button>
                        <button class="submit-button" @click="editData" :class="{ 'active': true }" style="width: 4vw; height: 3vh; font-size: medium;">
                            确认
                        </button>
                    </div>
                </div>
            </div>  
        <!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
            <div class="item-context geology">
                <!-- 右缘地表土层从上到下依次分为粉质黏土、粉砂、淤泥质粉质黏土、粉砂层，总体呈现黏土-粉砂二元结构，下层易冲刷 -->
                {{ geologyText }}
            </div>
        </div>
        <div class="title-context project">
            工程因素
        </div>
        <dv-decoration10 :Dur="1" :color="['rgba(231, 137, 15, 0.7)', 'rgba(171, 184, 197, 0.8)']"
            style="position: absolute; height: 86vh; width: 25vw; left: 0.7vw;" />
        <div class="item-container project">
            <div class="img-container project">
                <el-image style="width: 100%; height: 100%;" :src="image2Url" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :initial-index="4" :preview-src-list="srcList2" alt="项目结构" />
            </div>
            <div class="item-context project">
                <!-- 2017年 马洲岛外江堤修复加固工程
                <br>
                2023年 张皋过江通道工程民主沙右缘守护工程 -->
                {{ projectText }}
            </div>
        </div>
    </div>
<!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
    <div class="geologyAndProject-container" v-if="editPannelShow">
        <div class="title-context geology">地质结构</div>
        <button class="edit-button cancel" @click="editClickHandler()">取消</button>
        <button class="edit-button submit" @click="confirmUploadHandler()">完成</button>
        <dv-decoration10 :Dur="1" :color="['rgba(231, 137, 15, 0.7)', 'rgba(171, 184, 197, 0.8)']" style="position: absolute; height: 8.5vh; width: 25vw; left: 0.7vw;"/>
        <div class="item-container geology">
            <div class="img-container geology-upload">
                <el-upload style="height: fit-content; width: 100%;" drag="true" action="#" list-type="picture-card"
                    :multiple="false" :show-file-list="true" ref="uploadPicRef1" :auto-upload="false" 
                    :file-list="fileList1" :accept="'image/png, image/jpeg, image/tiff, image/bmp'"
                    :on-preview="handlePicturePreview" :on-remove="handlePicture1Remove"
                    :http-request="handlePic1Upload">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        <em>拖拽文件至此处</em>或<em>点击</em>进行上传
                    </div>
                </el-upload>
            </div>
            <div class="geology-content edit">  
                <div class="resource-box-container">
                    <div class="resource-title">
                            <div class="resource-title-text">地表土层</div>
                            <div class="resource-upload-btn" @click="addFormationHandler()" :class="{ 'active': true }">添加</div>
                    </div>
                    <div class="resource-content">
                        <el-table :data="tableData" style="width: 95%; margin-left: 2.5%;" max-height="25vh">
                            <el-table-column min-width="45%" class-name="custom-label-color" align="center" prop="name" label="土层名称"></el-table-column>
                            <el-table-column min-width="25%" class-name="custom-label-color" align="center" prop="height" label="高度"></el-table-column>
                            <el-table-column min-width="30%" class-name="custom-label-color" align="center" prop="operation" label="操作">
                                <template #default="scope">
                                    <el-button link type="danger" size="small" @click="deleteFormation(scope.$index)">
                                        删除
                                    </el-button>
                                    <el-button link type="warning" size="small" @click="editFormation(scope.$index)">
                                        修改
                                    </el-button>
                                </template>
                            </el-table-column>                                    
                        </el-table>
                    </div>
                </div>
            </div>  
        <div class="item-context geology-edit">
            地质结构描述：
            <el-input v-model="textarea1" maxlength="60" style="width: 460px" placeholder="请输入"
                :resize="none" :autosize="{ minRows: 2, maxRows: 2.5 }"
                show-word-limit type="textarea" :http-request="handleText1Upload"
            />          
        </div>
 
        </div>
        <div class="title-context project">
            工程因素
        </div>
        <dv-decoration10 :Dur="1" :color="['rgba(231, 137, 15, 0.7)', 'rgba(171, 184, 197, 0.8)']"
        style="position: absolute; height: 86vh; width: 25vw; left: 0.7vw;" />
        <div class="item-container project">
            <div class="img-container project">
                <el-upload style="height: fit-content; width: 100%;" drag="true" action="#" list-type="picture-card" 
                    ref="uploadPicRef2" :multiple="false" :show-file-list="true" :auto-upload="false" :file-list="fileList2"
                    :accept="'image/png, image/jpeg, image/tiff, image/bmp'"
                    :on-preview="handlePicturePreview" :on-remove="handlePicture2Remove"
                    :http-request="handlePic2Upload">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        <em>拖拽文件至此处</em>或<em>点击</em>进行上传
                    </div>
                </el-upload>
            </div>
            <div class="item-context project-edit">
                工程因素描述：
                <el-input
                    v-model="textarea2" maxlength="60" style="width: 460px" placeholder="请输入"
                    :resize="none" :autosize="{ minRows: 2, maxRows: 2.5 }"
                    show-word-limit type="textarea"
                    :http-request="handleText2Upload"
                />     
            </div>
        </div>
    </div>
<!--/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  -->
</template>

<script setup>
import axios from 'axios';
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue';
import { useBankNameStore } from '../../store/bankNameStore';
import { ElImage, ElInput, ElButton, ElMessage } from 'element-plus';

// const UrlPart1 = "/geology_structure.png"
// const UrlPart2 = "/project_structure.jpg"
// const srcList1 = ["/geology_structure.png"]
// const srcList2 = ["/project_structure.jpg", "/geoStruct/民主沙右缘守护工程09.jpg", "/geoStruct/民主沙右缘守护工程12.jpg", "/geoStruct/民主沙右缘守护工程18.jpg"]
const srcList1 = ref([])
const srcList2 = ref([])

let nextId = 1
let formDataPicUp1 = null
let formDataPicUpdate1 = null
let formDataPicUp2 = null
let formDataPicUpdate2 = null
let formDataTextUp1 = null
let formDataTextUpdate1 = null
let formDataTextUp2 = null
let formDataTextUpdate2 = null
let formDataTableUp = null
let formDataTableUpdate = null
let fileName = null
let bank = useBankNameStore().globalBankName


const upLoading = ref(false)
const editPannelShow = ref(false);
const addFormationPannelShow = ref(false)
const uploadPicRef1 = ref(null)
const uploadPicRef2 = ref(null)
const currentFormation = ref(null);

const fileList1 = ref([])
const fileList2 = ref([])
const tableData = ref([]);
const formationName = ref('')
const formationHeight = ref('')
const textarea1 = ref('')
const textarea2 = ref('')
const image1Url = ref('')
const image2Url = ref('')
const geologyText = ref('')
const projectText = ref('')
const formationData = ref('')

const colorMap = reactive(new Map())

const getColorForName = (name) => {
    if (colorMap.has(name)) {
        return colorMap.get(name);
    }

    // 生成偏向土色、黄色、橙色和棕色的随机颜色，但不包含鲜红色
    const r = Math.floor(Math.random() * 100 + 155); // 155-255
    const g = Math.floor(Math.random() * 100 + 100); // 100-200
    const b = Math.floor(Math.random() * 50);        // 0-49

    const randomColor = `rgb(${r}, ${g}, ${b})`;
    colorMap.set(name, randomColor);

    return randomColor;
}

// const getFormationClass = (name) => {
//     switch (name) {
//         case '粉砂':
//             return 'part2-content';
//         case '粉质黏土':
//             return 'part1-content';
//         case '淤泥质粉质黏土':
//             return 'part3-content';
//         default:
//             return 'part4-content';
//     }
// }

const getHeightStyle = (height) => {
    const heightValue = parseFloat(height.replace('m', '')); // 移除'm'并转换为数字
    const percentageHeight = (heightValue) * 100;
    return {
        height: `${percentageHeight}%`,
    };
}

const handlePicturePreview = (file) => {
    console.log("预览", file)
}
const handlePicture1Remove = (file, fileList1) => {
    console.log("删除", file, fileList1)
}
const handlePicture2Remove = (file, fileList1) => {
    console.log("删除", file, fileList1)
}
const editClickHandler = () => {
    editPannelShow.value = !editPannelShow.value;
    addFormationPannelShow.value = false;
};

const handleNameInput = (value) => {
    formationName.value = value;
}

const handleHeightInput = (value) => {
    const numericValue = value.replace(/[^0-9.]/g, '');     // 替换掉任何非数字和小数点的字符
    // 如果输入值中包含小数点，则只允许一个
    if (numericValue.includes('.')) {
        const parts = numericValue.split('.');
        // 如果小数点数量超过1，则移除多余的小数点
        if (parts.length > 2) {
            numericValue = parts[0] + '.' + parts.slice(1).join('');
        }
    }
    formationHeight.value = numericValue;
};

const editData = () => {
    if (!formationHeight.value.match(/^\d*\.?\d+$/) || !formationName.value) {
        ElMessage.error('土层名称和高度不能为空,且高度必须为数字');
        return; 
    }
    if (currentFormation.value) {
        const index = tableData.value.findIndex(item => item.id === currentFormation.value.id);
        if (index !== -1) {
            tableData.value[index] = {
                ...currentFormation.value,
                name: formationName.value,
                height: formationHeight.value + 'm'
            };
        }
    } 
    else if (formationName.value && formationHeight.value) {
        const newId = nextId++; // 生成一个新的唯一 id
        tableData.value.push({
            id: newId,
            name: formationName.value,
            height: formationHeight.value + 'm'
        });
    }
    formationName.value = '';
    formationHeight.value = '';
    currentFormation.value = null;
    addFormationPannelShow.value = false;
};

const deleteFormation = (index) => {
    tableData.value.splice(index, 1);
    addFormationPannelShow.value = false;
};

const editFormation = (index) => {
    const item = tableData.value[index];
    console.log(item)
    currentFormation.value = { ...item }; 
    formationName.value = item.name;
    formationHeight.value = item.height.replace('m', '');
    addFormationPannelShow.value = true
};

const addFormationHandler = () => {
    formationName.value = '';
    formationHeight.value = '';
    addFormationPannelShow.value = ! addFormationPannelShow.value
};   

const cancelAddFormation = () => {
    addFormationPannelShow.value = false;
}

const handlePic1Upload = async (file1) => {
    console.log('上传文件!!', file1);
    try {
        //上传
        formDataPicUp1 = new FormData();
        formDataPicUp1.append('file', file1.file);
        const info = {
            name: 'testing1',
            info: 'testing1'
        };
        formDataPicUp1.append('info', JSON.stringify(info));
        const responseUp = await axios.post(`http://172.21.212.166:8989/api/v2/data/bankResource/up/local/resource/${bank}/picture`, formDataPicUp1, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        //更新
        formDataPicUpdate1 = new FormData();
        formDataPicUpdate1.append('file', file1.file);
        const data = {
            info: 'testing1'
        };
        formDataPicUpdate1.append('data', JSON.stringify(data));
        const responseUpdate = await axios.post(`http://172.21.212.166:8989/api/v2/data/bankResource/update/local/resource/picture/${bank}/testing1`, formDataPicUpdate1, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('上传失败:', error);
        ElMessage.error('上传失败');
    } finally {
        upLoading.value = false;
    }
};
// const handlePic1Upload = async (file1) => {
//     console.log('上传文件!!', file1);
//     try {
//         //上传
//         formDataPicUp1 = new FormData();
//         formDataPicUp1.append('file', file1.file);
//         // 从文件对象中获取文件名
//         fileName = file1.file.name;
//         const info = {
//             name: fileName,
//             info: fileName
//         };
//         formDataPicUp1.append('info', JSON.stringify(info));
//         const responseUp = await axios.post(`http://172.21.212.166:8989/api/v2/data/bankResource/up/local/resource/${bank}/picture`, formDataPicUp1, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         //更新
//         formDataPicUpdate1 = new FormData();
//         formDataPicUpdate1.append('file', file1.file);
//         const data = {
//             info: fileName
//         };
//         formDataPicUpdate1.append('data', JSON.stringify(data));
//         const responseUpdate = await axios.post(`http://172.21.212.166:8989/api/v2/data/bankResource/update/local/resource/picture/${bank}/${fileName}`, formDataPicUpdate1, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//     } catch (error) {
//         console.error('上传失败:', error);
//         ElMessage.error('上传失败');
//     } finally {
//         upLoading.value = false;
//     }
// };

const handlePic2Upload = async (file2) => {
    console.log('上传文件!!', file2);
    try {
        //上传
        formDataPicUp2 = new FormData();
        formDataPicUp2.append('file', file2.file);
        const info = {
            name: 'testing2',
            info: 'testing2'
        };
        formDataPicUp2.append('info', JSON.stringify(info));
        const responseUp = await axios.post(`http://172.21.212.166:8989/api/v2/data/bankResource/up/local/resource/${bank}/picture`, formDataPicUp2, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        //更新
        formDataPicUpdate2 = new FormData();
        formDataPicUpdate2.append('file', file2.file);
        const data = {
            info: 'testing2'
        };
        formDataPicUpdate2.append('data', JSON.stringify(data));
        const responseUpdate = await axios.post(`http://172.21.212.166:8989/api/v2/data/bankResource/update/local/resource/picture/${bank}/testing2`, formDataPicUpdate2, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('上传失败:', error);
        ElMessage.error('上传失败');
    } finally {
        upLoading.value = false;
    }
};

const handleText1Upload = async() => {
    console.log("上传内容是:", textarea1.value);
    try {
        //上传
        formDataTextUp1 = new FormData();
        const info = {
            name: 'testing1',
            text:  textarea1.value
        };
        formDataTextUp1.append('info', JSON.stringify(info));
        const responseUp = await axios.post(`http://172.21.212.166:8989/api/v2/data/bankResource/up/local/resource/${bank}/text`, formDataTextUp1, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        // 更新
        formDataTextUpdate1 = new FormData();
        const data = {
            text: textarea1.value
        }
        formDataTextUpdate1.append('data', JSON.stringify(data))
        const responseUpdate = await axios.put(`http://172.21.212.166:8989/api/v2/data/bankResource/update/local/resource/text/${bank}/testing1`, data, {
            headers: {
                'Content-Type': 'application/json', // 设置请求头为 application/json
            },
        });
    } catch (error) {
        console.error('上传失败:', error);
        ElMessage.error('上传失败');
    }
}

const handleText2Upload = async() => {
    console.log("上传内容是:", textarea2.value);
    try {
        //上传
        formDataTextUp2 = new FormData();
        const info = {
            name: 'testing2',
            text:  textarea2.value
        };
        formDataTextUp2.append('info', JSON.stringify(info));
        const responseUp = await axios.post(`http://172.21.212.166:8989/api/v2/data/bankResource/up/local/resource/${bank}/text`, formDataTextUp2, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        //更新
        formDataTextUpdate2 = new FormData();
        const data = {
            text: textarea2.value
        }
        formDataTextUpdate2.append('data', JSON.stringify(data))
        const responseUpdate = await axios.put(`http://172.21.212.166:8989/api/v2/data/bankResource/update/local/resource/text/${bank}/testing2`, data, {
            headers: {
                'Content-Type': 'application/json', // 设置请求头为 application/json
            },
        });
    } catch (error) {
        console.error('上传失败:', error);
        ElMessage.error('上传失败');
    }
}

const handleTableUpload = async() => {
    console.log("上传内容是:", tableData.value);
    try {
        //上传
        formDataTableUp = new FormData();
        const info = {
            name: 'tableData',
            text:  tableData.value
        };
        formDataTableUp.append('info', JSON.stringify(info));
        const responseUp = await axios.post(`http://172.21.212.166:8989/api/v2/data/bankResource/up/local/resource/${bank}/text`, formDataTableUp, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        //更新
        formDataTableUpdate = new FormData();
        const data = {
            text: tableData.value
        }
        formDataTableUpdate.append('data', JSON.stringify(data))
        const responseUpdate = await axios.put(`http://172.21.212.166:8989/api/v2/data/bankResource/update/local/resource/text/${bank}/tableData`, data, {
            headers: {
                'Content-Type': 'application/json', // 设置请求头为 application/json
            },
        });
    } catch (error) {
        console.error('上传失败:', error);
        ElMessage.error('上传失败');
    }
}

const getImage1Url = async () => {
    try {
        const response = await axios.get(`http://172.21.212.166:8989/api/v2/data/bankResource/down/local/resource/${bank}/picture/testing1`, {
            responseType: 'blob' // 重要：设置响应类型为 'blob'
        });
        // 将 blob 数据转换为 URL
        const url = window.URL.createObjectURL(new Blob([response.data]));
        image1Url.value = url;
        srcList1.value.push(url); 
    } catch (error) {
        console.error('获取图片失败:', error);
        ElMessage.error('获取图片失败');
    }
}
// const getImage1Url = async () => {
//     try {
//         const response = await axios.get(`http://172.21.212.166:8989/api/v2/data/bankResource/down/local/resource/${bank}/picture/${fileName}`, {
//             responseType: 'blob' // 重要：设置响应类型为 'blob'
//         });
//         // 将 blob 数据转换为 URL
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         image1Url.value = url;
//         srcList1.value.push(url); 
//     } catch (error) {
//         console.error('获取图片失败:', error);
//         ElMessage.error('获取图片失败');
//     }
// }

const getImage2Url = async () => {
    try {
        const response = await axios.get(`http://172.21.212.166:8989/api/v2/data/bankResource/down/local/resource/${bank}/picture/testing2`, {
            responseType: 'blob' // 重要：设置响应类型为 'blob'
        });
        // 将 blob 数据转换为 URL
        const url = window.URL.createObjectURL(new Blob([response.data]));
        image2Url.value = url;
        srcList2.value.push(url); 
    } catch (error) {
        console.error('获取图片失败:', error);
        ElMessage.error('获取图片失败');
    }
}

const getGeologyText = async () => {
    try {
        const response = await axios.get(`http://172.21.212.166:8989/api/v2/data/bankResource/bank/text?bank=${bank}`);
        const data = response.data;
        const textItem = data.find(item => item.name === "testing1");
        geologyText.value = textItem.text; // 设置地质结构描述的文本
        textarea1.value = textItem.text; // 设置地质结构描述的文本
    } catch (error) {
        console.error('获取地质结构描述失败:', error);
        ElMessage.error('获取地质结构描述失败');
    }
};

const getProjectText = async () => {
    try {
        const response = await axios.get(`http://172.21.212.166:8989/api/v2/data/bankResource/bank/text?bank=${bank}`);
        const data = response.data;
        const textItem = data.find(item => item.name === "testing2");
        projectText.value = textItem.text; // 设置工程因素描述的文本
        textarea2.value = textItem.text; // 设置工程因素描述的文本
    } catch (error) {
        console.error('获取工程因素描述失败:', error);
        ElMessage.error('获取工程因素描述失败');
    }
};

const getTableData = async () => {
    try {
        const response = await axios.get(`http://172.21.212.166:8989/api/v2/data/bankResource/bank/text?bank=${bank}`);
        const data = response.data;
        const tableDataItem = data.find(item => item.name === "tableData");
        formationData.value = tableDataItem.text; // 设置表格描述的文本
        tableData.value = tableDataItem.text; // 设置表格描述的文本
    } catch (error) {
        console.error('获取土层描述失败:', error);
        ElMessage.error('获取土层描述失败');
    }
};

onMounted(() => {
    getImage1Url();
    getImage2Url();
    getGeologyText();
    getProjectText();
    getTableData();
})

onUnmounted(() => {
    if (image1Url.value && image2Url.value) {
        window.URL.revokeObjectURL(image1Url.value);
        window.URL.revokeObjectURL(image2Url.value);
    }
});

const confirmUploadHandler = async () => {
    uploadPicRef1.value && uploadPicRef1.value.submit()
    uploadPicRef2.value && uploadPicRef2.value.submit()
    // await uploadPicRef1.value.submit()
    // await uploadPicRef2.value.submit()
    await handleText1Upload();
    await handleText2Upload();
    await handleTableUpload();
    editPannelShow.value = !editPannelShow.value;
    addFormationPannelShow.value = false;
    getImage1Url();
    getImage2Url();
    getGeologyText();
    getProjectText();
    getTableData();
}
</script>

<style lang="scss" scoped>
div.edit-pannel-container {
                position: absolute;
                left: 25.8vw;
                display: flex;
                flex-direction: column;
                border: 2px solid #e0cfcf;
                background-color: rgba(238, 235, 205, 0.6);
                backdrop-filter: blur(6px);
                border-radius: 5px;
                height: 80%;
                width: 45%;
                font-family: 'Microsoft YaHei', 'sans-serif';
                align-items: center; // 水平居中

                div.title {
                    display: flex;
                    width: 100%;
                    height: 20%;
                    color: #e48f0f;
                    letter-spacing: 0.1vw;
                    font-weight: bold;
                    font-size: calc(0.8vw + 0.6vh);
                    line-height: 8vh;
                    justify-content: center;
                    // align-items: center;
                    text-shadow:
                        #121214 1px 1px,
                        #5c5e63 2px 2px,
                        #6493ff 3px 3px;
                }

                div.part {
                    line-height: 3vh;
                    display: flex;
                    height: 25%;
                    left: 5vw;
                    font-size: calc(0.6vw + 0.5vh);
                    font-weight: 700;
                    color: #444;
                    justify-content: center; // 垂直居中
                    align-items: center; // 水平居中
                    // line-height: 8vh
                }

                div.submit {
                    height: 20%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    

                    .cancel-button {
                        background: #ffffff;
                        color: #000000;
                        font-family: 'Microsoft YaHei';
                        font-weight: 900;
                        font-size: calc(0.3vw + 0.7vh);
                        border: 1px solid rgb(167, 131, 3);
                        border-radius: 0.4em;
                        box-shadow: rgb(114, 90, 3) 0.05em 0.05em;
                        cursor: pointer;
                        // z-index: 4;
                        transition: 0.3s linear;
                        &:hover {
                            background: #e2b168;
                        }
                    }
                    .submit-button {
                        background: #e48f0f;
                        color: #fff;
                        font-family: 'Microsoft YaHei';
                        font-weight: 900;
                        font-size: calc(0.3vw + 0.7vh);
                        border: 1px solid rgb(167, 131, 3);
                        border-radius: 0.4em;
                        box-shadow: rgb(114, 90, 3) 0.05em 0.05em;
                        cursor: pointer;
                        // z-index: 4;
                        transition: 0.3s linear;
                        &:hover {
                            background: #e2b168;
                        }
                    }
                }
            }

div.geologyAndProject-container {
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 16.25vh;
    left: 0.3vw;
    height: 75.25vh;
    width: 26vw;
    background-color: rgba(238, 235, 205, 0.6);
    border: 2px solid #e0cfcf;
    border-radius: 10px;
    backdrop-filter: blur(6px);

    .edit-button {
        position: absolute;
        right: 1.3vw;
        top: 0.7vh;
        width: 3vw;
        height: 3vh;
        background: #e48f0f;
        color: #fff;
        font-family: 'Microsoft YaHei';
        font-weight: 900;
        font-size: calc(0.3vw + 0.7vh);
        border: 1px solid rgb(167, 131, 3);
        border-radius: 0.4em;
        box-shadow: rgb(114, 90, 3) 0.05em 0.05em;
        cursor: pointer;
        z-index: 2;
        transition: 0.3s linear;

        &:hover {
            background: #e2b168;
        }

        &.cancel {
            background: #ffffff;
            color: #000000;
        }

        &.submit {
            right: 5vw;
        }
    }

    .custom-label-color .el-table__header-wrapper .el-table-column--label {
        color: #ccb024 !important; // 修改 label 颜色
    }

    div.title-context {
        position: absolute;
        left: 10vw;
        letter-spacing: 0.1vw;
        width: 10vw;
        line-height: 4vh;
        font-family: 'Microsoft YaHei';
        font-weight: bold;
        font-size: calc(0.9vw + 0.7vh);
        color: #e48f0f;
        text-shadow:
            #121214 1px 1px,
            #5c5e63 2px 2px,
            #6493ff 3px 3px;

        &.geology {
            top: -0.2vh;
            
        }

        &.project {
            top: 38.5vh;
        }
    }

    div.item-container {
        display: flex;
        position: absolute;
        left: 0.4vw;
        width: 25vw;
        height: 30vh;

        &.geology {
            top: 5vh;
            height: 35vh;
            // background-color: #121214;
        }

        &.project {
            top: 44vh;
            // background-color: #67679e;
        }

        div.img-container {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80%;
            border: rgba(196, 192, 188, 0.7) 2px solid;
            border-radius: 6px;
            margin-bottom: 0.5vh;
            z-index: 2;

            &.geology {
                width: 70%;
            }
            &.project {
                width: 100%;
            }
            &.geology-upload {
                width: 40%;
                border-right: rgb(214, 142, 8) 4px solid;
            }

            
        }

        div.geology-content {
            display: flex;
            flex-direction: column;
            height: 80%;

            &.content {
                width: 30%;
            }
            &.edit {
                width: 60%;
            }

            div.part-content {
                margin-left: 0.1vw;
                border-left: rgb(214, 142, 8) 4px solid;
                display: flex;
                justify-content: center;
                align-items: center;
                // height: 3.846%;
                height: 10%;
                background-color: rgba(224, 178, 134, 0.6);
                font-size: calc(0.6vw + 0.3vh);
                font-family: 'Microsoft YaHei';
                font-weight: bolder;
                color: #573606;
            }
            // div.part1-content {
            //     margin-left: 0.1vw;
            //     border-left: rgb(214, 142, 8) 4px solid;
            //     display: flex;
            //     justify-content: center;
            //     align-items: center;
            //     // height: 3.846%;
            //     height: 10%;
            //     background-color: rgba(224, 178, 134, 0.6);
            //     font-size: calc(0.6vw + 0.3vh);
            //     font-family: 'Microsoft YaHei';
            //     font-weight: bolder;
            //     color: #573606;
            // }

            // div.part2-content {
            //     margin-left: 0.1vw;
            //     border-left: rgb(173, 171, 5) 4px solid;
            //     display: flex;
            //     justify-content: center;
            //     align-items: center;
            //     // height: 5.128%;
            //     height: 15%;
            //     background-color: rgba(218, 219, 137, 0.6);
            //     font-size: calc(0.6vw + 0.3vh);
            //     font-family: 'Microsoft YaHei';
            //     font-weight: bolder;
            //     color: #363a20;
            // }

            // div.part3-content {
            //     margin-left: 0.1vw;
            //     border-left: rgb(202, 113, 238) 4px solid;
            //     display: flex;
            //     justify-content: center;
            //     align-items: center;
            //     // height: 19.231%;
            //     height: 25%;
            //     background-color: rgba(189, 163, 223, 0.6);
            //     font-size: calc(0.6vw + 0.3vh);
            //     font-family: 'Microsoft YaHei';
            //     font-weight: bolder;
            //     color: #331577;
            // }

            // div.part4-content {
            //     margin-left: 0.1vw;
            //     border-left: rgb(5, 173, 72) 4px solid;
            //     display: flex;
            //     justify-content: center;
            //     align-items: center;
            //     height: 50%;
            //     background-color: rgba(94, 240, 78, 0.367);
            //     font-size: calc(0.6vw + 0.3vh);
            //     font-family: 'Microsoft YaHei';
            //     font-weight: bolder;
            //     color: #3a2c20;
            // }

            div.resource-box-container {
                // background-color: rgba(224, 178, 134, 0.6);

                div.resource-title {
                    position: relative;
                    height: 3vh;
                    line-height: 3vh;
                    text-align: left;
                    font-family: 'Microsoft YaHei';
                    font-size: calc(0.6vw + 0.4vh);
                    font-weight: bold;
                    border-bottom: 2px solid rgb(214, 142, 8);

                    div.resource-title-text {
                        position: absolute;
                        left: 1vw;
                        color: #e48f0f;
                        text-shadow:
                            #121214 1px 1px,
                            #5c5e63 1px 1px,
                            #6493ff 1px 1px;
                    }

                    div.resource-upload-btn {
                        position: absolute;
                        top: 0.6vh;
                        right: 0.65vw;
                        width: 3vw;
                        height: 2vh;
                        border: 1px solid rgb(167, 131, 3);
                        border-radius: 0.4em;
                        line-height: 2vh;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                        font-size: calc(0.5vw + 0.3vh);
                        font-family: 'Microsoft YaHei';
                        font-weight: bold;
                        background-color: #e48f0f;
                        color: #ffffff;
                        box-shadow: rgb(0, 6, 54) 0.05em 0.05em;
                        z-index: 1;
                        transition: 0.3s linear;
                        cursor: pointer;
                        &:hover {
                            background-color: #e2b168;
                        }
                    }
                }
            }
        }
    }

    div.item-context {
        position: absolute;
        left: 1vw;
        // z-index: 4;
        font-size: calc(0.6vw + 0.4vh);
        color: rgb(27, 26, 26);
        font-family: 'Microsoft YaHei';
        font-weight: bolder;

        &.geology {
            top: 29vh;
        }

        &.geology-edit {
            top: 29vh;
            z-index: 1;
        }

        &.project {
            top: 25.5vh;
            white-space: pre-wrap; 
        }
        &.project-edit {
            top: 25.5vh;
        }
    }
}
</style>

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
                <el-image class="geology" style="width: 100%; height: 100%;" :src="UrlPart1" :zoom-rate="1.2"
                    :max-scale="7" :min-scale="0.2" :initial-index="4" :preview-src-list="srcList1" alt="地质结构" />
            </div>
            <div class="geology-content content">
                    <!-- <div class="part1-content">粉质黏土 1.5m</div>
                    <div class="part2-content">粉砂 2m</div>
                    <div class="part3-content">淤泥质粉质黏土<br>7.5m</div>
                    <div class="part4-content">粉砂 28m</div> -->
        <!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
                    <div class="part1-content" :style="{ height: height1 }">粉质黏土 {{ part1 }}m</div>
                    <div class="part2-content" :style="{ height: height2 }">粉砂 {{ part2 }}m</div>
                    <div class="part3-content" :style="{ height: height3 }">淤泥质粉质黏土<br>{{ part3 }}m</div>
                    <div class="part4-content" :style="{ height: height4 }">粉砂 {{ part4 }}m</div>
                    <div class="edit-pannel-container" v-if="editPannelShow">
                        <div class="title">编辑页面</div>
                        <div class="part">
                            <span>粉质粘土：</span>
                            <el-input v-model="inputPart1" style="width: 4vw; height: 3.5vh" placeholder="请输入" />
                        </div>
                        <div class="part">
                            <span>粉砂：</span>
                            <el-input v-model="inputPart2" style="width: 4vw; height: 3.5vh" placeholder="请输入" />
                        </div>
                        <div class="part">
                            <span>淤泥质粉质黏土：</span>
                            <el-input v-model="inputPart3" style="width: 4vw; height: 3.5vh" placeholder="请输入" />
                        </div>
                        <div class="part">
                            <span>粉砂：</span>
                            <el-input v-model="inputPart4" style="width: 4vw; height: 3.5vh" placeholder="请输入" />
                        </div>
                        <div class="submit">
                            <button class="submit-button" @click="editData" :class="{ 'active': true }" style="width: 4vw; height: 3vh; font-size: medium;">
                                修改
                            </button>
                        </div>
                    </div>
            </div>  
        <!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
            <div class="item-context geology">
                右缘地表土层从上到下依次分为粉质黏土、粉砂、淤泥质粉质黏土、粉砂层，总体呈现黏土-粉砂二元结构，下层易冲刷
            </div>
        </div>
        <div class="title-context project">
            工程因素
        </div>
        <dv-decoration10 :Dur="1" :color="['rgba(231, 137, 15, 0.7)', 'rgba(171, 184, 197, 0.8)']"
            style="position: absolute; height: 86vh; width: 25vw; left: 0.7vw;" />
        <div class="item-container project">
            <div class="img-container project">
                <el-image style="width: 100%; height: 100%" :src="UrlPart2" :zoom-rate="1.2" :max-scale="7"
                    :min-scale="0.2" :initial-index="4" :preview-src-list="srcList2" alt="项目结构" />
            </div>
            <div class="item-context project">
                2017年 马洲岛外江堤修复加固工程
                <br>
                2023年 张皋过江通道工程民主沙右缘守护工程
            </div>
        </div>
    </div>
<!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
<!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
    <div class="geologyAndProject-container" v-if="editPannelShow">
        <div class="title-context geology">
            地质结构
        </div>
        <button class="edit-button" @click="editClickHandler()" :class="{ 'active': true }">
            编辑
        </button>
        <dv-decoration10 :Dur="1" :color="['rgba(231, 137, 15, 0.7)', 'rgba(171, 184, 197, 0.8)']"
            style="position: absolute; height: 8.5vh; width: 25vw; left: 0.7vw;" />
        <div class="item-container geology">
            <div class="img-container geology-upload">
                <el-upload
                    class="avatar-uploader"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </div>
            <div class="geology-content edit">
                <div class="resource-box-container">

                    <!-- <div class="one-type-resource-container" v-for="(key, resourceCatogoryIndex) in Object.keys(resourceInfo)" :ref=handleRef> -->
                    <div class="one-type-resource-container">

                        <!-- <div class="resource-content-container">
                            <el-scrollbar height="75vh">
                                <div class="resource-box-item" v-for="(  item, resourceTypeIndex  ) in   resourceInfo[key]  "
                                    :key="resourceTypeIndex"> -->
                                    <div class="resource-title">
                                        <div class="resource-title-text">地表土层</div>

                                        <!-- <div class="resource-upload-btn" v-show="item.upload" @click="resourceUploadClickHandler(resourceTypeIndex)">添加</div> -->
                                        <div class="resource-upload-btn">添加</div>

                                    </div>
                                        <!-- <div class="resource-content">
                                        <el-table :data="item.resourceList" style="width: 95%; margin-left: 2.5%;"
                                            max-height="25vh">
                                            <el-table-column v-for="(  column, index  ) in  tableColumnInfo[key]  " :key="index"
                                                :prop="column.prop" :label="column.label" :min-width="column['min-width']"
                                                align="center">
                                                <template #default="scope" v-if="column.asTag">
                                                    <div style="display: flex; align-items: center;justify-content: center;">
                                                        <el-tag>{{ scope.row.fileType }}</el-tag>
                                                    </div>
                                                </template>
                                            </el-table-column>

                                            <el-table-column fixed="right" label="操作" min-width="20%" align="center"
                                                v-if="item.delete || item.update">
                                                <template #default="scope">
                                                    <el-button link type="danger" size="small" v-if="item.delete"
                                                        @click.prevent="deleteRow(scope.$index, resourceTypeIndex, scope.row)">
                                                        删除
                                                    </el-button>
                                                    <el-button link type="warning" size="small" v-if="item.update"
                                                        @click.prevent="updateRow(scope.$index, resourceTypeIndex, scope.row)">
                                                        更新
                                                    </el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                            </el-scrollbar>
                        </div> -->
                    </div>
                </div>
            </div>  
        <!-- ///////////////////////////////////////////////////////////////////////////////////////// -->
            <div class="item-context geology">
                地质结构描述：            
            </div>
        </div>
        <div class="title-context project">
            工程因素
        </div>
        <dv-decoration10 :Dur="1" :color="['rgba(231, 137, 15, 0.7)', 'rgba(171, 184, 197, 0.8)']"
            style="position: absolute; height: 86vh; width: 25vw; left: 0.7vw;" />
        <div class="item-container project">
            <div class="img-container project">
                <el-upload
                    class="avatar-uploader"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </div>
            <div class="item-context project">
                工程因素描述：
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElImage, ElInput, ElButton } from 'element-plus';
const srcList1 = ["/geology_structure.png"]
const UrlPart1 = "/geology_structure.png"
const srcList2 = ["/project_structure.jpg", "/geoStruct/民主沙右缘守护工程09.jpg", "/geoStruct/民主沙右缘守护工程12.jpg", "/geoStruct/民主沙右缘守护工程18.jpg"]
const UrlPart2 = "/project_structure.jpg"

//////////////////////////////////////////////////////////////////
//各地层part米数
const part1 = ref(localStorage.getItem('part1') || 1.5);
const part2 = ref(localStorage.getItem('part2') || 2);
const part3 = ref(localStorage.getItem('part3') || 7.5);
const part4 = ref(localStorage.getItem('part4') || 28);
const inputPart1 = ref(part1.value);
const inputPart2 = ref(part2.value);
const inputPart3 = ref(part3.value);
const inputPart4 = ref(part4.value);

// 编辑面板的显示状态
const editPannelShow = ref(false);

const editClickHandler = () => {
    editPannelShow.value = !editPannelShow.value;
};

const editData = () => {
  // 更新 part1 至 part4 的值
  if (!isNaN(inputPart1.value) && inputPart1.value !== '') part1.value = parseFloat(inputPart1.value);
  if (!isNaN(inputPart2.value) && inputPart2.value !== '') part2.value = parseFloat(inputPart2.value);
  if (!isNaN(inputPart3.value) && inputPart3.value !== '') part3.value = parseFloat(inputPart3.value);
  if (!isNaN(inputPart4.value) && inputPart4.value !== '') part4.value = parseFloat(inputPart4.value);

  // 存储到 localStorage
  localStorage.setItem('part1', part1.value);
  localStorage.setItem('part2', part2.value);
  localStorage.setItem('part3', part3.value);
  localStorage.setItem('part4', part4.value);

  // 关闭编辑面板
  editPannelShow.value = false;
};

// 计算每个标签的高度，这里假设总高度为100%，根据实际需要调整
const height1 = computed(() => `${part1.value * 100}%`);
const height2 = computed(() => `${part2.value * 100}%`);
const height3 = computed(() => `${part3.value * 100}%`);
const height4 = computed(() => `${part4.value * 100}%`);
//////////////////////////////////////////////////////////////////
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
                height: 100%;
                width: 50%;
                font-family: 'Microsoft YaHei', 'sans-serif';

                div.title {
                    display: flex;
                    width: 100%;
                    height: 20%;
                    color: #e48f0f;
                    letter-spacing: 0.1vw;
                    font-weight: bold;

                    font-size: calc(0.8vw + 0.6vh);
                    line-height: 4vh;
                    justify-content: center;
                    align-items: center;
                    text-shadow:
                        #121214 1px 1px,
                        #5c5e63 2px 2px,
                        #6493ff 3px 3px;
                }

                div.part {
                    display: flex;
                    height: 15%;
                    left: 4vw;
                    font-size: calc(0.6vw + 0.5vh);
                    font-weight: 700;
                    color: #444;
                }

                div.submit {
                    height: 20%;
                    display: flex;
                    justify-content: center;
                    align-items: center;

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
                        z-index: 4;
                        transition: 0.3s linear;

                        &:hover {
                            background: #e2b168;
                        }
                    }
                }
            }

div.geologyAndProject-container {
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
        z-index: 4;
        transition: 0.3s linear;

        &:hover {
            background: #e2b168;
        }
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
            z-index: 1;

            &.geology {
                width: 70%;
            }
            &.project {
                width: 100%;
            }
            &.geology-upload {
                width: 40%;
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

            div.part1-content {
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

            div.part2-content {
                margin-left: 0.1vw;
                border-left: rgb(173, 171, 5) 4px solid;
                display: flex;
                justify-content: center;
                align-items: center;
                // height: 5.128%;
                height: 15%;
                background-color: rgba(218, 219, 137, 0.6);
                font-size: calc(0.6vw + 0.3vh);
                font-family: 'Microsoft YaHei';
                font-weight: bolder;
                color: #363a20;
            }

            div.part3-content {
                margin-left: 0.1vw;
                border-left: rgb(202, 113, 238) 4px solid;
                display: flex;
                justify-content: center;
                align-items: center;
                // height: 19.231%;
                height: 25%;
                background-color: rgba(189, 163, 223, 0.6);
                font-size: calc(0.6vw + 0.3vh);
                font-family: 'Microsoft YaHei';
                font-weight: bolder;
                color: #331577;
            }

            div.part4-content {
                margin-left: 0.1vw;
                border-left: rgb(173, 171, 5) 4px solid;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 50%;
                background-color: rgba(218, 219, 137, 0.6);
                font-size: calc(0.6vw + 0.3vh);
                font-family: 'Microsoft YaHei';
                font-weight: bolder;
                color: #3a2c20;
            }

            div.resource-box-container {

                div.one-type-resource-container {

                    div.resource-title {
                        position: relative;
                        height: 3vh;
                        line-height: 3vh;
                        text-align: left;
                        font-family: 'Microsoft YaHei';
                        font-size: calc(0.6vw + 0.4vh);
                        font-weight: bold;
                        border-bottom: 2px solid #5b9dff;
                        color: #001d7a;

                        div.resource-title-text {
                            position: absolute;
                            left: 1vw;
                        }

                        div.resource-upload-btn {
                            position: absolute;
                            top: 0.6vh;
                            right: 0.7vw;
                            width: 3vw;
                            height: 2vh;
                            line-height: 2vh;
                            justify-content: center;
                            align-items: center;
                            text-align: center;
                            font-size: calc(0.5vw + 0.3vh);
                            font-weight: bold;
                            background-color: rgb(64, 102, 206);
                            color: #ffffff;
                            border-radius: 5px;

                            &:hover {
                                cursor: pointer;
                                background-color: rgb(93, 169, 255);
                            }
                        }
                    }
                }
            }
        }
    }

    div.item-context {
        position: absolute;
        left: 1vw;
        font-size: calc(0.6vw + 0.4vh);
        color: rgb(27, 26, 26);
        font-family: 'Microsoft YaHei';
        font-weight: bolder;

        &.geology {
            top: 29vh;
        }

        &.project {
            top: 25.5vh;
        }
    }
}
</style>

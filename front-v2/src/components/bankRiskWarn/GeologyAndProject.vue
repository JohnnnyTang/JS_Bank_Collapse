<template>
<div class="geologyAndProject-container">
    <div class="title-context">
        地质结构
    </div>
    <dv-decoration10
        :Dur="1"
        :color="['rgba(231, 137, 15, 0.7)','rgba(171, 184, 197, 0.8)']"
        style="position: absolute; height: 8.5vh; width: 21.5vw; left: 0.7vw;"
    />
    <div class="item-container geology">
        <div class="img-container">
            <el-image
                style="width: 100%; height: 100%; "
                :src="UrlPart1"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :initial-index="4"
                :preview-src-list="srcList1"
                fit="cover"
                alt="地质结构"
            />
        </div>
        <div class="item-context geology">
            右缘地表土层从上到下依次分为粉砂、淤泥质粉质黏土、粉质黏土、粉砂和粉质黏土层，总体呈现黏土-粉砂二元结构，下层易冲刷
        </div>
    </div>
    <div class="item-container project">
        <div class="img-container">
            <el-image
                style="width: 100%; height: 100%"
                :src="UrlPart2"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :initial-index="4"
                :preview-src-list="srcList2"
                fit="cover"
                alt="项目结构"
            />
        </div>
        <div class="item-context project">
            2017年 马洲岛外江堤修复加固工程
        </div>
        <div class="item-context project">
            2023年 张皋过江通道工程民主沙右缘守护工程
        </div>
    </div>
</div>
</template>

<script setup>
import { ElImage } from 'element-plus';
const srcList1 = ["/geology_structure.png"]
const UrlPart1 = "/geology_structure.png"
const srcList2 = ["/project_structure.png"]
const UrlPart2 = "/project_structure.png"
</script>

<style lang="scss" scoped>
    div.geologyAndProject-container {
        position: absolute;
        top: 2vh;
        right: 2vw;
        height: 88vh;
        width: 23vw;
        background-color: rgba(238, 235, 205, 0.6);
        border: 2px solid #e0cfcf;
        border-radius: 10px;
        backdrop-filter: blur(6px);

        div.title-context {
            position: absolute;
            left: 9vw;
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
        }

        div.item-container {
            position: absolute;
            left: 0.4vw;
            width: 22.2vw;
            height: 42vh;

            &.geology {
                top: 5vh;
                border-bottom: #e98e06 3px solid;
                // background-color: #121214;
            }

            &.project {
                top: 47vh;
                margin-top: 1.5vh;
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
            }
        }

        div.item-context {
            top: 0.9vh;
            left: 1.2vw;
            font-size: calc(0.6vw + 0.4vh);
            color: rgb(27, 26, 26);
            font-family: 'Microsoft YaHei';
            font-weight: bolder;
        }
    }
</style>

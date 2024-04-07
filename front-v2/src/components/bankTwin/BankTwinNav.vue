<template>
    <div class="vertical-menu-container">
        <div class="placement-container upper">
            
        </div>
        <el-scrollbar>
            <el-menu
                class="el-menu-vertical-demo"
                default-active="2"
                @open="handleOpen"
                @close="handleClose"
            >
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon><InfoFilled /></el-icon>
                        <span>基础信息</span>
                    </template>
                    <el-menu-item index="1-1">民主沙右缘</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="2">
                    <template #title>
                        <el-icon><View /></el-icon>
                        <span>岸坡监测</span>
                    </template>
                    <el-sub-menu index="2-1">
                        <template #title>民主沙右缘</template>
                        <el-menu-item index="2-1-1">视频监测</el-menu-item>
                        <el-menu-item index="2-1-2">GNSS</el-menu-item>
                        <el-menu-item index="2-1-3">测斜仪</el-menu-item>
                        <el-menu-item index="2-1-4">孔隙水压力计</el-menu-item>
                        <el-menu-item index="2-1-5">应力桩</el-menu-item>
                    </el-sub-menu>
                </el-sub-menu>
                <el-sub-menu index="3">
                    <template #title>
                        <el-icon><WarningFilled /></el-icon>
                        <span>风险预警</span>
                    </template>
                    <el-sub-menu index="3-1">
                        <template #title>数据预警</template>
                        <el-menu-item index="3-1-1">GNSS</el-menu-item>
                        <el-menu-item index="3-1-2">测斜仪</el-menu-item>
                        <el-menu-item index="3-1-3">孔隙水压力计</el-menu-item>
                        <el-menu-item index="3-1-4">应力桩</el-menu-item>
                        <el-menu-item index="3-1-5">实时风险</el-menu-item>
                        <el-menu-item index="3-1-6">岸坡稳定</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="3-2">
                        <template #title>报警记录</template>
                        <el-menu-item index="3-2-1">断面</el-menu-item>
                        <el-menu-item index="3-2-2">GNSS</el-menu-item>
                        <el-menu-item index="3-2-3">测斜仪</el-menu-item>
                        <el-menu-item index="3-2-4">孔隙水压力计</el-menu-item>
                        <el-menu-item index="3-2-5">应力桩</el-menu-item>
                    </el-sub-menu>
                </el-sub-menu>
                <el-sub-menu index="4">
                    <template #title>
                        <el-icon><Document /></el-icon>
                        <span>报表管理</span>
                    </template>
                    <el-menu-item index="4-1">日报</el-menu-item>
                    <el-menu-item index="4-2">周报</el-menu-item>
                    <el-menu-item index="4-3">月报</el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-scrollbar>
        <div class="placement-container down"></div>
    </div>
</template>

<script setup>
import {
    Document,
    InfoFilled,
    WarningFilled,
    View,
} from '@element-plus/icons-vue'

const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
}

const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
}
</script>

<style lang="scss" scoped>
$openMenuColor: rgba(28, 59, 163, 0.6);
div.vertical-menu-container {
    position: relative;
    left: 0vw;
    // padding-top: 6vh;
    // padding-bottom: 6vh;
    height: 92vh;
    width: 12vw;
    border-radius: 12px;
    // overflow: hidden;

    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(6px);

    div.placement-container {
        height: 6vh;
        width: 12vw;
    }
}
:deep(.el-menu) {
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
    letter-spacing: 0.2rem;
    border-right: none;
}

:deep(.el-sub-menu__title) {
    font-weight: 600;
    --el-menu-item-font-size: calc(0.7vw + 0.5vh);
    // border-radius: 10px;
}

:deep(.el-sub-menu) {
    border-right: 2px solid #0836b4;
    // border-radius: 10px;
    // border-radius: 4px;
    // overflow: hidden;

    &.is-opened {
        background-color: $openMenuColor;
        border-right: 2px solid #38d7ff;
        .el-sub-menu__title,
        li {
            color: #ffff;
            background-color: $openMenuColor;
            border-right: 2px solid #38d7ff;
        }
        &.is-active,
        li.is-active {
            background-color: rgb(18, 98, 247);
        }
    }
}

:deep(.el-scrollbar) {
    // border-bottom: 2px solid #0836b4;
    border-radius: 12px;
    height: 80vh;
    transition: all 0.4s cubic-bezier(0.68, -0.15, 0.265, 1.15);
    
    // overflow: hidden;
}
</style>

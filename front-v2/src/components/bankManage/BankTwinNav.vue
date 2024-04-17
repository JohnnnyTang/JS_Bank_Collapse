<template>
    <div class="vertical-menu-container">
        <div class="placement-container upper" @click="returnPage">
            <div class="back-icon"></div>
            <div class="back-text">返回平台</div>
        </div>
        <el-scrollbar>
            <el-menu
                class="el-menu-vertical-demo"
                :default-active="defaultActive"
                @select="handleSelect"
            >
                <el-sub-menu index="basic">
                    <template #title>
                        <el-icon><InfoFilled /></el-icon>
                        <span>基础信息</span>
                    </template>
                    <el-menu-item index="basic/mzs">民主沙右缘</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="2">
                    <template #title>
                        <el-icon><View /></el-icon>
                        <span>岸坡监测</span>
                    </template>
                    <el-sub-menu index="2-1">
                        <template #title>民主沙右缘</template>
                        <el-menu-item index="monitor/video"
                            >视频监测</el-menu-item
                        >
                        <el-menu-item index="monitor/gnss">GNSS</el-menu-item>
                        <el-menu-item index="monitor/inclinometer"
                            >测斜仪</el-menu-item
                        >
                        <el-menu-item index="monitor/manometer"
                            >孔隙水压力计</el-menu-item
                        >
                        <el-menu-item index="monitor/stress"
                            >应力桩</el-menu-item
                        >
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
import { onMounted, ref } from 'vue'
import router from '../../router'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'

const returnPage = () => {
    router.push('/bankTwin')
}

const route = useRoute()

const defaultActive = ref('')

// const handleOpen = (key, keyPath) => {
//     console.log(key, keyPath)
// }

// const handleClose = (key, keyPath) => {
//     console.log(key, keyPath)
// }

const handleSelect = (index, indexPath) => {
    // console.log('select', index, indexPath)
    router.push('/bankManage/' + index)
}

const updateSelection = (curRoute) =>{
    let pathSplit = curRoute.fullPath.split('/')
    let selectIndex =
        pathSplit[pathSplit.length - 2] + '/' + pathSplit[pathSplit.length - 1]
    // console.log(selectIndex)
    defaultActive.value = selectIndex
}

onBeforeRouteUpdate((to, from) => {
    // console.log(to, from)
    updateSelection(to)
})

onMounted(() => {
    // console.log(route.params)
    updateSelection(route)
})
</script>

<style lang="scss" scoped>
$openMenuColor: rgba(28, 59, 163, 0.6);
div.vertical-menu-container {
    position: relative;
    left: 0vw;
    // padding-top: 6vh;
    // padding-bottom: 6vh;
    height: 90vh;
    width: 12vw;
    margin-top: 1vh;
    border-radius: 10px;
    // border-radius: 12px;
    // overflow: hidden;

    background: rgba(192, 224, 255, 0.6);
    backdrop-filter: blur(6px);
    overflow: hidden;
    border: 2px solid #0775db;

    div.placement-container {
        height: 6vh;
        width: 12vw;

        &.upper {
            display: flex;
            height: 5vh;
            width: fit-content;
            padding-right: 0.5vw;
            margin-bottom: 0.5vh;
            margin-top: 0.5vh;
            margin-left: 0.5vw;
            // column-gap: 0.5vw;
            justify-content: flex-start;
            border: 2px solid rgb(27, 71, 128);

            transition: all 0.4s cubic-bezier(0.68, -0.35, 0.265, 1.35);
            border-radius: 12px;
            overflow: hidden;
            background-color: rgb(202, 229, 255);
            box-shadow:
                rgba(0, 132, 255, 0.8) 1px 1px,
                rgba(0, 119, 255, 0.7) 2px 2px,
                rgba(0, 119, 255, 0.6) 3px 3px;

            &:hover {
                cursor: pointer;
                transform: translate3d(2px, 2px, 2px);

                div.back-icon {
                    background-size: 70%;
                }
            }
            div.back-icon {
                height: 5vh;
                width: 3vw;
                // background-color: rgb(206, 231, 255);

                background-image: url('/back.png');
                background-repeat: no-repeat;
                background-size: 80%;
                background-position: 50% 50%;
                transition: all 0.4s cubic-bezier(0.68, -0.35, 0.265, 1.35);

                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
            }

            div.back-text {
                height: 5vh;
                line-height: 5vh;
                // background-color: rgb(206, 231, 255);

                color: #032a96;
                font-weight: bold;
                font-size: calc(0.8vw + 0.6vh);

                border-top-right-radius: 8px;
                border-bottom-right-radius: 8px;
            }
        }
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

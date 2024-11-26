<template>
    <div class="vertical-nav-container">
        <div class="nav-item-container" v-for="(navMenuItem, index) in navMenuList" :key="index"
            :class="{ active: navMenuItem.active }" @click="changeActive(index)">
            <div class="nav-item-icon" :style="{
                'background-image': 'url(' + navMenuItem.iconUrl + ')',
            }"></div>
            <div class="nav-item-text">{{ navMenuItem.name }}</div>
        </div>
        <div class="active-bg-container" :active-id="preActiveIndex"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import router from '../../router/index'
import { onBeforeRouteUpdate } from 'vue-router';

const preActiveIndex = ref(-1)

const navMenuList = ref([
    {
        name: '崩岸知识网络',
        iconUrl: '/binary-data.png',
        path: '/knowledgeStore/graph',
        active: false,
    },
    {
        name: '历史崩岸列表',
        iconUrl: '/history.png',
        path: '/knowledgeStore/history',
        active: false,
    },
    // {
    //     name: '相关规划图集',
    //     iconUrl: '/plan.png',
    //     path: '/knowledgeStore/plan',
    //     active: false,
    // },
    // {
    //     name: '崩岸知识管理',
    //     iconUrl: '/admin-panel.png',
    //     path: '/knowledgeStore/tree',
    //     active: false,
    // }
])

const pathIndexMap = {
    graph: 0,
    history: 1,
    plan: 2,
    manage: 3,
}

function changeActive(index) {
    if (index === preActiveIndex.value) {
        return
    } else {
        if (preActiveIndex.value != -1) {
            navMenuList.value[preActiveIndex.value].active = false
        }
        if (index < navMenuList.value.length) {
            navMenuList.value[index].active = true
            preActiveIndex.value = index
            router.push(navMenuList.value[preActiveIndex.value].path)
        }
    }
}

onBeforeRouteUpdate((to, from, next) => {
    // 从其他地方跳到知识库
    if (to.path.endsWith('/home')) {
        preActiveIndex.value = -1
        navMenuList.value.map(item => item.active = false)
    }
    next()
})

onMounted(() => {

    let pathSplit = router.currentRoute.value.path.split('/')
    let splitPath = pathSplit[pathSplit.length - 1]

    if (splitPath === 'home' || splitPath === 'knowledgeStore') {
        preActiveIndex.value = -1
        navMenuList.value.map(item => item.active = false)
        return
    }
    changeActive(pathIndexMap[splitPath])

})
</script>

<style lang="scss" scoped>
$shadowWhite: #e2c2ff;

div.vertical-nav-container {
    position: fixed;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: fit-content;
    width: 4vw;
    background-color: aliceblue;
    border-radius: 6px;

    box-shadow: 0px 8px 40px -10px rgba(219, 248, 255, 0.8);
    border: inset 1px #436efa;

    overflow: hidden;
    transition: all 0.6s cubic-bezier(0.68, -0.25, 0.265, 1.25);

    &:hover {
        width: 11vw;
        cursor: pointer;
    }

    div.nav-item-container {
        width: 11vw;
        height: 4vw;
        // padding-top: 1vh;
        padding-bottom: 0.5vw;

        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        column-gap: 0.6vw;

        border-radius: 6px;
        // transition: all 0.3s cubic-bezier(0.68, -0.45, 0.265, 1.45);

        &:hover {
            background: linear-gradient(to right, #6c84f1 0%, #191dff 100%);
            // transition-delay: 0.4s;
            color: aliceblue;
        }

        &.active {
            // background: linear-gradient(
            //     to right,
            //     #874acc 0%,
            //     #6a0bdf 30%,
            //     #6a0bdf 100%
            // );
            // transition-delay: 0.4s;
            color: aliceblue;
            font-weight: 600;

            div.nav-item-text {
                font-weight: bold;
            }
        }

        div.nav-item-icon {
            background-size: contain;
            background-repeat: no-repeat;
            width: 3vw;
            height: 3vw;
            margin-left: 0.5vw;
            // border-radius: 1rem;
            z-index: 11;
        }

        div.nav-item-text {
            width: 7vw;
            line-height: 4vw;
            height: 4vw;
            font-size: calc(0.8vw + 0.4vh);
            z-index: 11;

            // background-color: aqua;
        }
    }

    div.active-bg-container {
        position: absolute;
        width: 11vw;
        height: 4.5vw;
        top: 0vh;
        border-radius: 6px;
        background: linear-gradient(to right,
                #4a62cc 0%,
                #0b0edf 40%,
                #0b0edf 100%);
        transition: all 0.4s cubic-bezier(0.68, -0.25, 0.265, 1.25);

        z-index: 10;

        &[active-id='-1'] {
            top: -4.5vw;
        }

        &[active-id='0'] {
            top: 0vh;
        }

        &[active-id='1'] {
            top: 4.5vw;
        }

        &[active-id='2'] {
            top: 9vw;
        }

        &[active-id='3'] {
            top: 13.5vw;
        }
    }
}
</style>

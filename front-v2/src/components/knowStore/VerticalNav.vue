<template>
    <div class="vertical-nav-container">
        <div
            class="nav-item-container"
            v-for="(navMenuItem, index) in navMenuList"
            :key="index"
            :class="{ active: navMenuItem.active }"
            @click="changeActive(index)"
        >
            <div
                class="nav-item-icon"
                :style="{
                    'background-image': 'url(' + navMenuItem.iconUrl + ')',
                }"
            ></div>
            <div class="nav-item-text">{{ navMenuItem.name }}</div>
        </div>
        <div class="active-bg-container" :active-id="preActiveIndex"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import router from '../../router/index'

const preActiveIndex = ref(0)

const navMenuList = ref([
    {
        name: '历史崩岸库',
        iconUrl: '/history.png',
        path: '/knowledgeStore/history',
        active: true,
    },
    {
        name: '相关规划库',
        iconUrl: '/model.png',
        path: '/knowledgeStore/plan',
        active: false,
    },
    {
        name: '模型参数库',
        iconUrl: '/admin-panel.png',
        path: '/knowledgeStore/param',
        active: false,
    },
    {
        name: '专家经验库',
        iconUrl: '/rating.png',
        path: '/knowledgeStore/experience',
        active: false,
    },
])

const pathIndexMap = {
    history: 0,
    plan: 1,
    param: 2,
    experience: 3,
}

function changeActive(index) {
    if (index === preActiveIndex.value) {
        return
    } else {
        navMenuList.value[preActiveIndex.value].active = false
        navMenuList.value[index].active = true
        preActiveIndex.value = index
        router.push(navMenuList.value[preActiveIndex.value].path)
    }
}

onMounted(() => {
    // console.log(router.currentRoute.value.path)
    let pathSplit = router.currentRoute.value.path.split('/')
    let splitPath = pathSplit[pathSplit.length-1]
    // console.log(splitPath)
    if (splitPath === '' || splitPath === 'knowledgeStore') {
        return
    } else if (pathIndexMap[splitPath] != preActiveIndex.value) {
        navMenuList.value[preActiveIndex.value].active = false
        navMenuList.value[pathIndexMap[splitPath]].active = true
        preActiveIndex.value = pathIndexMap[splitPath]
    }
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
        width: 9.6vw;
        cursor: pointer;
    }

    div.nav-item-container {
        width: 9.6vw;
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
            width: 5.5vw;
            line-height: 4vw;
            height: 4vw;
            font-size: calc(0.8vw + 0.4vh);
            z-index: 11;

            // background-color: aqua;
        }
    }

    div.active-bg-container {
        position: absolute;
        width: 9.6vw;
        height: 4.5vw;
        top: 0vh;
        border-radius: 6px;
        background: linear-gradient(
            to right,
            #4a62cc 0%,
            #0b0edf 40%,
            #0b0edf 100%
        );
        transition: all 0.4s cubic-bezier(0.68, -0.25, 0.265, 1.25);

        z-index: 10;

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

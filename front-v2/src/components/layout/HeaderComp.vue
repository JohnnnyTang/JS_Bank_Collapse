<template>
    <div class="main-header-container" ref="headerDom">
        <div class="header-logo-pic"></div>
        <div class="header-nav-container">
            <div class="header-nav-item" v-for="(navItem, index) in navList" :key="index" @click="emitNavClick(index)"
                :class="{
                    active: navItem.isActive,
                    'long-text': !navItem.oneRow,
                }" ref="navItemRefs" @mouseover="hoverNav(index)" @mouseleave="leaveNav()">
                <div class="header-nav-icon" :style="{
                    'background-image': 'url(' + navItem.iconUrl + ')',
                }" v-if="navItem.oneRow"></div>
                <div class="header-nav-text" v-if="navItem.oneRow">
                    {{ navItem.name }}
                </div>
                <div class="header-nav-text long-text" v-else>
                    {{ navItem.name }}
                    <br />
                    {{ navItem.nameTwo }}
                </div>
                <el-dropdown ref="eleDropDownDomRef" v-if="index == 4 || index == 1 || index == 3" trigger="click"
                    :popper-class="index == 4 ? 'nav-popper center' : 'nav-popper'
                        ">
                    <div style="
                            width: 10vw;
                            height: 1px;
                            background-color: transparent;
                            position: relative;
                        "></div>
                    <template #dropdown>
                        <el-dropdown-menu v-if="index == 4">
                            <el-dropdown-item @click="navToModelPage">模型管理</el-dropdown-item>
                            <el-dropdown-item @click="navToKnowledgePage">知识管理</el-dropdown-item>
                            <el-dropdown-item @click="bankManageClickHandler">岸段管理</el-dropdown-item>
                        </el-dropdown-menu>
                        <el-dropdown-menu v-if="index == 1 || index == 3">
                            <el-dropdown-item v-for="(item, idx) in bankList" @click="clickBankItem(item, index)">
                                <span style="float: left" class="left">{{ item.name }}</span>
                                <span style="float: right" class="right level-one">一级预警岸段</span>
                            </el-dropdown-item>
                            <el-dropdown-item disabled>
                                <span style="text-align: center" class="">...</span>
                            </el-dropdown-item>
                            <!-- <el-dropdown-item @click="navToWarnPage" disabled>
                                <span
                                    style="float: left"
                                    class="left"
                                    >太平洲左缘</span
                                >
                                <span
                                    style="float: right"
                                    class="right level-one"
                                    >一级预警岸段</span
                                >
                            </el-dropdown-item>
                            <el-dropdown-item @click="navToWarnPage" disabled>
                                <span
                                    style="float: left"
                                    class="left"
                                    >丰乐桥</span
                                >
                                <span
                                    style="float: right"
                                    class="right level-two"
                                    >二级预警岸段</span
                                >
                            </el-dropdown-item> -->
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div class="header-user-container">
            <el-dropdown trigger="click" v-if="LOGIN === 'YES'">
                <div class="user-avatar-icon"></div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-if="LOGIN === 'YES' && !statusStore.loginStatus"
                            @click="login">登录</el-dropdown-item>
                        <el-dropdown-item v-if="LOGIN === 'YES' && statusStore.loginStatus"
                            @click="logout">退出登录</el-dropdown-item>
                        <el-dropdown-item v-if="MANAGEMENT === 'YES'"
                            @click="bankManageClickHandler">权限管理</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>


            <el-dropdown trigger="click" v-if="LOGIN === 'NOT' && MANAGEMENT === 'YES'">
                <div class="user-avatar-icon"></div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item :disabled="true" @click="bankManageClickHandler">权限管理</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>

            <div class="user-avatar-icon" v-if="LOGIN === 'NOT' && MANAGEMENT === 'NOT'"></div>

        </div>
    </div>
    <div class="title-header">
        <TitleContainerVue style="width: 28vw; height: 8vh" :title-width="titleWidthInPixel"></TitleContainerVue>
    </div>
    <div class="header-decorate-line left">
        <DecorateLineVue :lineWidth="decLineWidth" :nodeSize="decLineNodeWidth" :line-animate="decLineAnimation"
            :node-animate="decNodeAnimation" />
    </div>
    <div class="header-decorate-line right">
        <DecorateLineVue :lineWidth="decLineWidth" :nodeSize="decLineNodeWidth" :if-reverse="true"
            :line-animate="decLineAnimation" :node-animate="decNodeAnimation" />
    </div>
    <div class="title-bracket-container active-bracket" v-show="bracketTitleActiveShow"
        :style="{ left: activeBracketLeft + 'px' }">
        <TitleBracket :title-width="bracketActiveTitleWidth" ref="activeBracketDomRef" />
    </div>
    <div class="title-bracket-container hover-bracket" v-show="bracketTitleHoverShow"
        :style="{ left: hoverBracketLeft + 'px' }">
        <TitleBracket :title-width="bracketHoverTitleWidth" />
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, onUnmounted, onBeforeMount } from 'vue'
import TitleContainerVue from '../header/TitleContainer.vue'
import DecorateLineVue from '../header/DecorateLine.vue'
import TitleBracket from '../header/TitleBracket.vue'
import router from '../../router/index'
import { useStatusStore } from '../../store/statusStore'
import { useBankNameStore } from '../../store/bankNameStore'
import { onBeforeRouteUpdate } from 'vue-router'
import axios from 'axios'
import { useBankInfoStore } from '../../store/bankInfoStore'

const LOGIN = import.meta.env.VITE_LOGIN
const MANAGEMENT = import.meta.env.VITE_BANK_MANAGEMENT
const statusStore = useStatusStore()
const bankNameStore = useBankNameStore()

const titleWidthInPixel = ref(300)
const headerDom = ref(null)
const navItemRefs = ref(null)

const decLineWidth = ref(1)
const decLineNodeWidth = ref(2)

const decLineAnimation = ref(false)
const decNodeAnimation = ref(true)

const bracketActiveTitleWidth = ref(0)
const bracketTitleActiveShow = ref(false)
const activeBracketLeft = ref(0)
const activeBracketDomRef = ref(null)

const bracketHoverTitleWidth = ref(0)
const bracketTitleHoverShow = ref(false)
const hoverBracketLeft = ref(0)

const eleDropDownDomRef = ref()

const navList = ref([
    {
        name: '崩岸综合信息',
        routerLink: '/dataVisual',
        isActive: false,
        oneRow: true,
        iconUrl: '/big-data.png',
    },
    {
        name: '实时监测预警',
        routerLink: '/bankTwin',
        isActive: false,
        oneRow: true,
        iconUrl: '/analysis.png',
    },

    {
        name: '江苏省长江崩岸',
        nameTwo: '监测预警应用系统',
        routerLink: '/dataVisual',
        isActive: true,
        oneRow: false,
    },
    {
        name: '崩岸风险研判',
        routerLink: '/bankWarn',
        isActive: false,
        oneRow: true,
        iconUrl: '/monitoring.png',
    },
    {
        name: '崩岸系统管理',
        routerLink: '/modelStore',
        isActive: false,
        oneRow: true,
        iconUrl: '/predictive.png',
    },
])

const routerPathIndexMap = {
    '/dataVisual': 0,
    '/bankWarn': 3,
    '/modelStore': 4,
    '/knowledgeStore': 4,
    '/bankTwin': 1,
    '/bankManage': 2,
    '/': 2,
}

//通过点击获取岸端名
const bankList = ref([])
const clickBankItem = (bankItem, index) => {
    bankNameStore.globalBankName = bankItem.bank
    navToWarnOrRiskPage(index, bankItem.bank)
}

let previousActive = 2

const focusOnNavItem = (navIndex) => {
    bracketTitleHoverShow.value = false
    const bbox = navItemRefs.value[navIndex].getBoundingClientRect()
    activeBracketLeft.value = bbox.x - bracketActiveTitleWidth.value / 12.8
    bracketTitleActiveShow.value = true
    // await nextTick()
    nextTick(() => {
        activeBracketDomRef.value.trans2Tri()
    })
}

const emitNavClick = async (navIndex) => {
    if (navIndex == 4) {
        // console.log(1)
        eleDropDownDomRef.value[2].handleOpen()
    } else if (navIndex == 1) {
        eleDropDownDomRef.value[0].handleOpen()
    } else if (navIndex == 3) {
        eleDropDownDomRef.value[1].handleOpen()
    } else if (navIndex != previousActive) {
        router.push(navList.value[navIndex].routerLink)
        navList.value[previousActive].isActive = false
        navList.value[navIndex].isActive = true
        previousActive = navIndex

        if (navIndex != 2) {
            focusOnNavItem(navIndex)
        } else {
            bracketTitleActiveShow.value = false
        }
    }
}

const hoverNav = (navIndex) => {
    if (navIndex != previousActive && navIndex != 2) {
        const bbox = navItemRefs.value[navIndex].getBoundingClientRect()
        hoverBracketLeft.value = bbox.x - bracketHoverTitleWidth.value / 6.4
        bracketTitleHoverShow.value = true
    }
    // console.log(navItemRefs.value[navIndex].getBoundingClientRect());
}

const leaveNav = () => {
    bracketTitleHoverShow.value = false
}

const navToModelPage = () => {
    console.log('hello model')
    eleDropDownDomRef.value[0].handleClose()
    router.push('/modelStore')
    focusOnNavItem(4)
}

const navToKnowledgePage = () => {
    eleDropDownDomRef.value[0].handleClose()
    router.push('/knowledgeStore')
    focusOnNavItem(4)
}

const navToWarnOrRiskPage = (index, bankEnName) => {
    if (index == 1) {
        eleDropDownDomRef.value[0].handleClose()
        router.push('/bankTwin/' + bankEnName)
    } else if (index == 3) {
        eleDropDownDomRef.value[1].handleClose()
        router.push('/bankWarn/' + bankEnName)
    }
    focusOnNavItem(index)
}

const onResize = (refDomWidth, refDomHeight) => {
    titleWidthInPixel.value = (4 * refDomWidth) / 25
    decLineWidth.value = refDomHeight / 24
    decLineNodeWidth.value = refDomHeight / 18
    bracketActiveTitleWidth.value = refDomWidth / 12.8
    bracketHoverTitleWidth.value = refDomWidth / 10
    const bbox = navItemRefs.value[previousActive].getBoundingClientRect()
    // console.log(bbox.x, bracketActiveTitleWidth.value)
    activeBracketLeft.value = bbox.x - bracketActiveTitleWidth.value / 12.8
}

const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
        onResize(entry.contentRect.width, entry.contentRect.height)
        titleWidthInPixel.value = (4 * entry.contentRect.width) / 25
    })
})

const login = () => {
    router.push('/login')
}
const logout = () => {
    localStorage.removeItem('token')
    statusStore.loginStatus = false
    router.push('/login')
}
const bankManageClickHandler = () => {
    eleDropDownDomRef.value[0].handleClose()
    router.push('/bankManage')
    focusOnNavItem(4)
}


watch(() => useBankInfoStore().bankList, (newVal) => {
    console.log('bankList changed')
    bankList.value = newVal
})

onBeforeMount(async () => {
    const res = await axios.get('/model/data/bankResource/bank')
    useBankInfoStore().bankList = res.data
    bankList.value = res.data
})

onMounted(() => {
    // console.log(headerDom.value);
    // titleWidthInPixel.value = titleDom;

    onResize(headerDom.value.clientWidth, headerDom.value.clientHeight)
    resizeObserver.observe(headerDom.value)
    console.log(navItemRefs.value)
    let curRoute = router.currentRoute.value.path
    console.log(curRoute)
    if (routerPathIndexMap[curRoute] != previousActive) {
        navList.value[previousActive].isActive = false
        navList.value[routerPathIndexMap[curRoute]].isActive = true
        previousActive = routerPathIndexMap[curRoute]
        if (routerPathIndexMap[curRoute] != 2) {
            focusOnNavItem(routerPathIndexMap[curRoute])
        }
    }
    watch(
        () => router.currentRoute.value.path,
        (newPath, oldPath) => {
            console.log(newPath, oldPath)
            // console.log(newPath.split('/'), oldPath)
            let parentPath = newPath
            let splitPath = newPath.split('/')
            console.log('pp', parentPath, splitPath)
            if (splitPath.length >= 3) {
                parentPath = '/' + splitPath[1]
            }
            if (
                parentPath in routerPathIndexMap &&
                routerPathIndexMap[parentPath] != previousActive
            ) {
                navList.value[previousActive].isActive = false
                navList.value[routerPathIndexMap[parentPath]].isActive = true
                previousActive = routerPathIndexMap[parentPath]
                if (routerPathIndexMap[parentPath] != 2) {
                    focusOnNavItem(routerPathIndexMap[parentPath])
                }
            }
        },
    )
})
onUnmounted(() => {
    resizeObserver.disconnect()
})
</script>

<style lang="scss" scoped>
div.main-header-container {
    height: 7vh;
    width: 100vw;
    padding-bottom: 1vh;

    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    background: radial-gradient(circle,
            rgba(16, 2, 84, 1) 0%,
            rgba(16, 31, 128, 1) 40%,
            rgba(13, 80, 147, 1) 80%,
            rgba(0, 134, 255, 1) 100%);
    // z-index: 1;

    div.header-logo-pic {
        height: 5vh;
        width: 7vw;
        // background-color: aqua;
        background-position: 50% 50%;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url('/logo.png');
        position: relative;
        z-index: 10;
    }

    div.header-nav-container {
        width: 88vw;
        height: 7vh;
        // background-color: #7bf0ff;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;

        div.header-nav-item {
            height: 7vh;
            width: 10vw;
            // margin-right: 1.4vw;
            // margin-left: 1.4vw;
            z-index: 3;
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            align-content: center;
            justify-content: center;

            text-align: center;
            transition: all 0.2s ease-in-out;

            div.header-nav-icon {
                width: 4vh;
                height: 4vh;
                transition: all 0.2s ease-in-out;
                background-size: contain;
            }

            div.header-nav-text {
                width: calc(10vw - 4vh);
                font-family: 'Microsoft YaHei';
                font-size: calc(1vw + 0.2vh);
                // text-align: start;
                color: rgba(240, 248, 255, 0.804);

                transition: all 0.2s ease-in-out;

                &.long-text {
                    height: 5.6vh;
                    padding-top: 1.4vh;
                    width: 16vw;
                    letter-spacing: 0.1vw;
                    line-height: 2.8vh;
                    text-align: center;

                    color: aliceblue;
                }

                &:hover {
                    // transition-duration: 0.4s;
                    font-weight: 600;
                    // transition-timing-function: ease-in-out;
                }
            }

            &.active {
                font-weight: 800;

                div.header-nav-text {
                    width: 10vw;
                    color: aliceblue;
                    // font-family: 'Microsoft YaHei';
                    // font-size: calc(0.8vw + 0.5vh);

                    &.long-text {
                        width: 16vw;
                    }
                }
            }

            &:hover {
                font-size: calc(1vw + 0.4vh);
                cursor: pointer;
            }

            &.long-text {
                width: 16vw;
            }
        }
    }

    div.header-user-container {
        width: 7vw;
        height: 8.5vh;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: flex-start;

        div.user-avatar-icon {
            position: relative;
            margin-top: 2.2vh;
            height: 5vh;
            width: 5vh;
            // background-color: antiquewhite;
            background-image: url('/user.png');
            background-repeat: no-repeat;
            background-size: contain;

            &:hover {
                cursor: pointer;
            }
        }

        // div.drop-down-icon {
        //     height: 1.6vh;
        //     width: 1.6vh;
        //     // background-color: #8a9a9e;
        //     // background-image: url('/down-arrow.png');
        //     background-repeat: no-repeat;
        //     background-size: contain;
        //     &:hover {
        //         cursor: pointer;
        //     }
        // }
    }
}

div.title-header {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    z-index: 2;
}

div.header-decorate-line {
    position: absolute;
    left: 8.4vw;
    top: 6vh;
    width: 35vw;
    height: 3vh;

    &.right {
        left: auto;
        right: 8.4vw;
    }
}

div.title-bracket-container {
    position: absolute;
    top: 2vh;
    left: 9.4vw;
    width: 11vw;
    height: 3vh;
    z-index: 2;

    &.hover-bracket {
        width: 12.6vw;
    }
}
</style>

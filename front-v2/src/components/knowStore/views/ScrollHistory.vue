<template>
    <el-skeleton
        style="
            width: 100vw;
            height: 80vh;
            display: flex;
            justify-content: space-around;
            top: 5vh;
            position: relative;
            z-index: 8;
        "
        :loading="loading"
        animated
        :count="3"
    >
        <template #template>
            <el-skeleton-item variant="rect" style="width: 26%; height: 100%" />
        </template>
        <template #default>
            <el-scrollbar
                @mousewheel="scroll"
                ref="scrollBar"
                class="knowledge"
            >
                <div
                    class="knowledge-scroll-container"
                    :class="{ 'not-active': scrollHistoryNotActive }"
                >
                    <HistoryTableVue @scrollToSeeMore="scrollToDesc" />
                    <HistoryCardVue
                        v-for="(infoItem, index) in knowledgeInfoList"
                        :key="index"
                        :infoItem="infoItem"
                        :index="index"
                    />
                    <div class="placement-div"></div>
                </div>
            </el-scrollbar>
        </template>
    </el-skeleton>
    <ReturnStartVue @return-top="scrollTop" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import HistoryCardVue from '../HistoryCard.vue'
import ReturnStartVue from '../ReturnStart.vue'
import HistoryTableVue from '../HistoryTable.vue'

const loading = ref(true)
const scrollBar = ref()
const knowledgeInfoList = ref([])
const scrollHistoryNotActive = ref(true)

// const props = defineProps({
//     knowledgeContainerWidth: {
//         type: Number,
//     },
// })

let scrollLeft = 0
let scrollLeftMax = 0

const backendInstance = axios.create({
    // baseURL: Vue.prototype.baseURL,
    baseURL: '/api',
})

const scrollToDesc = (index) => {
    // console.log('scroll', index)
    scrollLeft = window.innerWidth * (index * 0.35 + 0.2)
    scrollBar.value.setScrollLeft(scrollLeft)
}

const scroll = (e) => {
    if (
        e.target.className.includes('content-item-text') ||
        e.target.className.includes('cell') ||
        e.target.className.includes('more-info-button') ||
        e.target.className.includes('el-collapse') ||
        e.target.className.includes('desc') || 
        e.target.className.includes('content-item-container') || 
        e.target.className.includes('video-box')
    ) {
        return
    }
    scrollLeft += e.deltaY
    // console.log('scroll left', scrollLeft)
    // console.log('scroll max', scrollLeftMax)
    if (scrollLeft < 0) {
        scrollLeft = 0
    } else if (scrollLeft > scrollLeftMax) {
        scrollLeft = scrollLeftMax
    }
    scrollBar.value.setScrollLeft(scrollLeft)
}

function scrollTop() {
    scrollLeft = 0
    scrollBar.value.setScrollLeft(scrollLeft)
}

onMounted(async () => {
    scrollLeft = 0

    // console.log(knowledgeContainer.value)
    const requestInfo = await backendInstance.get('/data/historyInfo/desc')
    knowledgeInfoList.value = requestInfo.data
    scrollLeftMax =
        (((knowledgeInfoList.value.length + 1) * 36.5 - 60) / 100.0) *
        window.innerWidth
    // console.log(knowledgeInfoList.value)
    // scrollBarInside.value.style.width = scrollLeftMax + 'px'
    // 不知道为什么更新了数据之后 dom的clientWidth没有更新
    // knowledgeInfoList.value = (
    //     await backendInstance.get('/data/historyInfo/desc')
    // ).data;
    // console.log(knowledgeInfoList.value)
    knowledgeInfoList.value.forEach((item) => {
        item.firstPage = true
    })
    loading.value = false
    setTimeout(()=> {
        scrollHistoryNotActive.value = false
    }, 50)
})

// watch(knowledgeInfoList, (newVal, oldVal) => {
//     // console.log('watch', scrollBarInside.value.clientWidth , knowledgeContainer.value.clientWidth)
//     if (props.knowledgeContainerWidth != 0) {
//         scrollLeftMax =
//             ((newVal.length * 33.5 - 105.5) / 100.0) * window.innerWidth
//     }
//     // console.log(scrollMax);
// })

// watch(
//     () => props.knowledgeContainerWidth,
//     (newVal, prevVal) => {
//         if (newVal != 0) {
//             scrollLeftMax =
//                 ((knowledgeInfoList.value.length * 33.5 - 105.5) / 100.0) *
//                 window.innerWidth
//         }
//     },
// )
</script>

<style lang="scss" scoped>
div.knowledge-scroll-container {
    position: relative;
    height: 80vh;
    width: fit-content;
    // overflow: hidden;
    margin-bottom: 1vh;
    left: 0vw;
    // margin-right: 2vw;
    // padding-left: 2vw;
    // left: 100vw;
    &.not-active {
        left: 100vw;
        transition: all 1s cubic-bezier(0.68, -0.15, 0.265, 1.15);
    }

    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-end;
    column-gap: 8.5vw;
    transition: all 1s cubic-bezier(0.68, -0.15, 0.265, 1.15);

    div.placement-div {
        width: 16vw;
        height: 80vh;

        background: transparent;
    }
}

.el-scrollbar {
    &.knowledge {
        height: 87vh;
        position: relative;
        top: 4vh;
        left: 10vw;
    }
}

:deep(.el-scrollbar__wrap) {
    scroll-behavior: smooth;
}
</style>

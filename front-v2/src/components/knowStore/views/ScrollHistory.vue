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
    console.log('scroll', index)
    scrollLeft = window.innerWidth * (index * 0.35 + 0.2)
    scrollBar.value.setScrollLeft(scrollLeft)
}

const scroll = (e) => {
    if (
        e.target.className.includes('content-item-text') ||
        e.target.className.includes('cell') ||
        e.target.className.includes('more-info-button')
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
    console.log(knowledgeInfoList.value)
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

    div.knowledge-card-container {
        width: 28vw;
        height: 78vh;
        // line-height: 78vh;
        text-align: center;
        // background-color: antiquewhite;

        // &:first-of-type {
        //     margin-left: 10vw;
        // }

        div.knowledge-card-wrapper {
            width: 23vw;
            height: 78vh;
            position: relative;
            left: 2vw;
            top: 0vh;
            // background-color: aqua;

            &:first-child {
                margin-left: 3vw;
            }

            div.knowledge-card {
                width: 19.5vw;
                height: 70vh;
                padding-left: 1vw;
                padding-right: 1vw;
                padding-bottom: 4vh;
                position: relative;
                top: 1.5vh;

                background-color: aliceblue;

                border-radius: 10px;
                box-shadow: 0px 8px 40px -10px rgba(0, 0, 0, 0.8);
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
                align-content: flex-start;
                transition: all 0.25s cubic-bezier(0.68, -0.45, 0.265, 1.45);

                &.active {
                    opacity: 1;
                    z-index: 10;
                }

                &.inactive {
                    position: absolute;
                    opacity: 0.75;
                    top: 0;
                    right: 0;
                    z-index: 1;
                    cursor: pointer;

                    &:hover {
                        transform: translate(0.1vw, -1.2vh) rotate(3deg);
                    }

                    div.see-more-button,
                    div.knowledge-content-container,
                    div.image-wrapper {
                        opacity: 0;
                    }
                }

                div.image-wrapper {
                    -webkit-transition: all 0.25s ease;
                    -moz-transition: all 0.25s ease;
                    -o-transition: all 0.25s ease;
                    transition: all 0.25s ease;
                    will-change: transform;
                    margin-top: 2vh;
                    height: 29vh;

                    div.image-div {
                        width: calc(100% + 15%);
                        -webkit-transform: translate(-10%, 0);
                        -moz-transform: translate(-10%, 0);
                        -o-transform: translate(-10%, 0);
                        -ms-transform: translate(-10%, 0);
                        transform: translate(-16%, 0);
                        height: 28vh;
                        -webkit-box-shadow: 0px 20px 30px -15px rgba(0, 0, 0, 0.45);
                        -moz-box-shadow: 0px 20px 30px -15px rgba(0, 0, 0, 0.45);
                        box-shadow: 0px 20px 30px -15px rgba(0, 0, 0, 0.45);
                        margin-bottom: 2vh;
                        user-select: none;
                        overflow: hidden;
                        -webkit-transition: all 0.25s ease;
                        -moz-transition: all 0.25s ease;
                        -o-transition: all 0.25s ease;
                        transition: all 0.25s ease;

                        img {
                            object-fit: cover;
                            width: 100%;
                            height: 100%;
                            filter: contrast(1.1) hue-rotate(12deg)
                                brightness(0.9) saturate(0.8);
                            border-radius: 10px;
                        }
                    }
                }

                div.knowledge-title-container {
                    width: 100%;
                    height: 4vh;
                    line-height: 2vh;
                    // background-color: aqua;

                    font-size: calc(0.5vh + 0.8vw);
                    font-weight: 600;
                    font-family: 'Microsoft YaHei';
                    border-bottom: 3px solid #3011d4;

                    // background: linear-gradient(
                    //     to right,
                    //     #36e2e2 0%,
                    //     #6420b9 100%
                    // );
                    // -webkit-background-clip: text;
                    // -webkit-text-fill-color: transparent;
                }

                div.knowledge-content-container {
                    width: 100%;
                    height: 34vh;
                    // background-color: aqua;

                    display: flex;
                    flex-flow: row wrap;
                    align-content: space-around;

                    &.second {
                        height: 70vh;
                        // background-color: #2bc5fc;
                    }

                    div.content-row-container {
                        width: 80%;
                        height: 8vh;
                        margin-left: 6%;
                        margin-right: 6%;
                        padding-left: 4%;
                        padding-right: 4%;
                        // background-color: rgb(92, 125, 154);
                        border-bottom: 2px solid #3011d4;

                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: space-between;

                        div.content-item-container {
                            height: 8vh;
                            width: 48%;

                            // background-color: rgb(63, 109, 149);

                            div.content-item-title {
                                width: 100%;
                                height: 4vh;
                                line-height: 4vh;
                                // background-color: aquamarine;
                                // color: #0050b1;
                                background: linear-gradient(
                                    to right,
                                    #6345e8 0%,
                                    #51129e 100%
                                );
                                -webkit-background-clip: text;
                                background-clip: text;
                                -webkit-text-fill-color: transparent;

                                font-size: calc(0.8vh + 0.6vw);
                                font-weight: 600;
                                font-family: 'Microsoft YaHei';
                            }

                            div.content-item-text {
                                width: 100%;
                                height: 4vh;
                                line-height: 4vh;
                                // background-color: bisque;
                                color: #5467e2;

                                font-size: calc(0.5vh + 0.65vw);
                                // font-weight: 600;
                                font-family: 'Microsoft YaHei';

                                &.number {
                                    font-family: 'Trebuchet MS';
                                }

                                &.no-data {
                                    opacity: 0.5;
                                }

                                &.time {
                                    font-size: calc(0.5vh + 0.55vw);
                                }
                            }

                            &.left {
                                text-align: left;
                            }

                            &.right {
                                text-align: right;
                            }
                        }

                        &.desc {
                            width: 100%;
                            height: 50vh;
                            // background-color: aqua;
                            justify-content: center;
                            padding-left: 5%;
                            padding-right: 5%;
                            border-radius: 10px;
                            border-style: solid;
                            border-color: #7497c0d0;

                            .el-scrollbar {
                                top: 0;
                                height: 46vh;
                            }

                            div.content-item-container {
                                height: 50vh;
                                width: 100%;
                                // background-color: #3011d4;

                                div.content-item-title {
                                    text-align: center;
                                }

                                div.content-item-text {
                                    text-align: left;
                                    height: 46vh;
                                }
                            }
                        }
                    }
                }
            }

            div.see-more-button {
                position: absolute;
                width: 7vw;
                height: 5vh;
                line-height: 5vh;
                // background-color: aquamarine;
                bottom: 0.6vh;
                right: 2.8vw;
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                align-items: center;
                z-index: 12;

                border-radius: 10px;
                column-gap: 0.4vw;

                background: linear-gradient(135deg, #3011d4 0%, #2bc5fc 100%);
                color: #fff;
                transition: all 0.25s cubic-bezier(0.68, -0.45, 0.265, 1.45);
                &:hover {
                    cursor: pointer;
                    right: 1.8vw;
                    column-gap: 0;
                    transition: all 0.25s cubic-bezier(0.68, -0.45, 0.265, 1.45);
                }

                div.button-text {
                    width: 4.5vw;
                    height: 5vh;
                    // background-color: aqua;
                    font-size: calc(0.5vh + 0.6vw);
                    font-weight: 600;
                    font-family: 'Microsoft YaHei';
                }

                div.button-arrow {
                    width: 1.5vw;
                    height: 3vh;
                    background-image: url('/right-arrow.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center center;
                    // background-color: azure;
                }

                // &.inactive {
                //     display: none;
                // }
            }
        }
    }

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

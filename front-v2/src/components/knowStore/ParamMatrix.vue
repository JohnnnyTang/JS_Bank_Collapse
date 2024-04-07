<template>
    <div class="param-matrix-container">
        <div class="param-matrix-title">
            <div class="tree-title-icon"></div>
            <div class="tree-title-text">崩岸预警模型参数库</div>
        </div>
        <div class="param-matrix-content">
            <div class="param-row-selector">
                <div class="param-selector-icon"></div>
                <div
                    v-for="(rowItem, index) in paramRowSelector"
                    :key="rowItem.id"
                    class="param-row-item"
                    :class="{ active: rowItem.isActive }"
                    @click="handleRowClick(index)"
                >
                    <div class="param-row-text">{{ rowItem.name }}</div>
                </div>
                <div
                    class="param-row-item active-bg"
                    :active-id="curActiveIndex[0]"
                ></div>
            </div>
            <div class="param-column-selector">
                <div
                    v-for="(colItem, index) in paramColumnSelector"
                    :key="colItem.id"
                    class="param-column-item"
                    :class="{ active: colItem.isActive }"
                    @click="handleColClick(index)"
                >
                    <div class="param-column-text">{{ colItem.name }}</div>
                </div>
                <div
                    class="param-column-item active-bg"
                    :active-id="curActiveIndex[1]"
                ></div>
            </div>
            <div class="param-collection-display">
                <el-carousel
                    :autoplay="carouselLoop"
                    arrow="never"
                    indicator-position="none"
                    height="69vh"
                    ref="carouselDom"
                >
                    <el-carousel-item v-for="i in 9" :key="i">
                        <el-scrollbar>
                            <ParamCardVue
                                v-for="(paramInfo, index) in paramMatrixList[i-1]"
                                :key="index"
                                :name="paramInfo.name"
                                :model="paramInfo.model"
                                :time-string="paramInfo.timeString"
                            />
                        </el-scrollbar>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ParamCardVue from './ParamCard.vue'
import { paramMatrixList } from './paramTree'

const carouselLoop = ref(false)
const carouselDom = ref()

const paramRowSelector = ref([
    { name: '土体变形分析模型', id: 0, isActive: true },
    { name: '岸坡稳定分析模型', id: 1, isActive: false },
    { name: '崩岸风险预警模型', id: 2, isActive: false },
])

const paramColumnSelector = ref([
    { name: '实时监测预警', id: 0, isActive: true },
    { name: '未来风险预报', id: 1, isActive: false },
    { name: '专题情景预演', id: 2, isActive: false },
])

const handleRowClick = (index) => {
    if (curActiveIndex.value[0] === index) return

    paramRowSelector.value[curActiveIndex.value[0]].isActive = false
    paramRowSelector.value[index].isActive = true
    curActiveIndex.value[0] = index
    carouselDom.value.setActiveItem(
        curActiveIndex.value[0] * 3 + curActiveIndex.value[1],
    )
}

const handleColClick = (index) => {
    if (curActiveIndex.value[1] === index) return

    paramColumnSelector.value[curActiveIndex.value[1]].isActive = false
    paramColumnSelector.value[index].isActive = true
    curActiveIndex.value[1] = index
    carouselDom.value.setActiveItem(
        curActiveIndex.value[0] * 3 + curActiveIndex.value[1],
    )
}

const curActiveIndex = ref([0, 0])
</script>

<style lang="scss" scoped>
$selector-height: 5vh;

div.param-matrix-container {
    position: relative;
    width: 43vw;
    height: 80vh;
    left: 4vw;

    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 8px 40px -10px rgba(0, 0, 0, 0.8);

    // background-color: aliceblue;

    div.param-matrix-title {
        position: relative;
        height: 6vh;
        line-height: 6vh;
        width: 43vw;
        left: 50%;
        transform: translateX(-50%);
        font-size: calc(1vw + 0.8vh);
        font-weight: 600;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        column-gap: 1vw;

        background-color: rgba(203, 249, 255, 0.9);
        backdrop-filter: blur(6px);

        // border-bottom: 3px solid rgb(15, 83, 230);

        div.tree-title-icon {
            height: 4vh;
            width: 4vh;
            background-image: url('/data-collection.png');
            background-size: contain;
            background-repeat: no-repeat;
        }
    }

    div.param-matrix-content {
        height: 74vh;
        width: 43vw;

        // background-color: antiquewhite;

        display: flex;
        flex-flow: row wrap;

        div.param-row-selector {
            height: $selector-height;
            width: 43vw;
            // padding-left: $selector-height;

            // background-color: aliceblue;
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;

            div.param-selector-icon {
                width: $selector-height;
                height: $selector-height;
                flex-shrink: 0;

                border-radius: 20%;
                background-color: rgb(59, 43, 117);

                background-image: url('/matrix.png');
                background-size: 90%;
                background-position: 50% 50%;
                background-repeat: no-repeat;
            }

            div.param-row-item {
                width: calc((43vw - $selector-height) / 3);
                height: $selector-height;
                line-height: $selector-height;
                box-shadow: inset 0 0 6px rgb(200, 255, 248);
                border-top-right-radius: 12px;
                border-top-left-radius: 12px;
                text-align: center;

                flex-shrink: 0;
                transition: all 0.4s cubic-bezier(0.68, -0.15, 0.265, 1.15);

                background-color: rgba(0, 30, 94, 0.75);

                div.param-row-text {
                    position: relative;
                    z-index: 14;
                    background-color: transparent;
                    color: aliceblue;
                    font-weight: 800;
                    font-size: calc(0.8vw + 0.4vh);
                    letter-spacing: 0.2rem;
                    &:hover {
                        cursor: pointer;
                    }
                }

                &.active {
                    background-color: transparent;
                    box-shadow: none;
                    div.param-row-text {
                        color: rgb(0, 7, 73);
                    }
                }

                &.active-bg {
                    transition: all 0.4s cubic-bezier(0.68, -0.15, 0.265, 1.15);
                    position: relative;
                    left: 0;
                    z-index: 11;
                    box-shadow: inset 0 0 6px rgb(6, 80, 218);
                    background-color: rgba(181, 216, 255, 0.6);
                    backdrop-filter: blur(10px);

                    &[active-id='0'] {
                        left: calc($selector-height - 43vw);
                    }

                    &[active-id='1'] {
                        left: calc(($selector-height - 43vw) / 1.5);
                    }

                    &[active-id='2'] {
                        left: calc(($selector-height - 43vw) / 3);
                    }
                }
            }
        }

        div.param-column-selector {
            height: calc(74vh - $selector-height);
            width: $selector-height;
            display: flex;
            flex-flow: column nowrap;
            justify-content: flex-start;

            // background-color: aqua;

            div.param-column-item {
                height: calc((74vh - $selector-height) / 3);
                width: $selector-height;
                line-height: $selector-height;
                box-shadow: inset 0 0 6px rgb(200, 255, 248);
                flex-shrink: 0;

                border-top-left-radius: 12px;
                border-bottom-left-radius: 12px;

                background-color: rgba(0, 30, 94, 0.75);
                transition: all 0.4s cubic-bezier(0.68, -0.15, 0.265, 1.15);
                // backdrop-filter: blur(10px);

                writing-mode: vertical-lr;
                text-align: center;

                div.param-column-text {
                    position: relative;
                    z-index: 14;
                    background-color: transparent;
                    color: aliceblue;
                    font-weight: 800;
                    font-size: calc(0.8vw + 0.6vh);
                    letter-spacing: 0.3rem;
                    &:hover {
                        cursor: pointer;
                    }
                }

                &.active {
                    background-color: transparent;
                    box-shadow: none;
                    div.param-column-text {
                        color: rgb(0, 7, 73);
                    }
                }

                &.active-bg {
                    transition: all 0.4s cubic-bezier(0.68, -0.15, 0.265, 1.15);
                    box-shadow: inset 0 0 6px rgb(6, 80, 218);
                    position: relative;
                    top: 0;
                    z-index: 11;
                    background-color: rgba(181, 216, 255, 0.6);
                    backdrop-filter: blur(10px);

                    &[active-id='0'] {
                        top: calc($selector-height - 74vh);
                    }

                    &[active-id='1'] {
                        top: calc(($selector-height - 74vh) / 1.5);
                    }

                    &[active-id='2'] {
                        top: calc(($selector-height - 74vh) / 3);
                    }
                }
            }
        }

        div.param-collection-display {
            width: calc(43vw - $selector-height);
            height: calc(74vh - $selector-height);
            border-radius: 2px;

            background-color: rgba(181, 216, 255, 0.6);
            backdrop-filter: blur(6px);
            box-shadow: inset 0 0 2px rgb(0, 69, 197);
        }
    }
}
</style>

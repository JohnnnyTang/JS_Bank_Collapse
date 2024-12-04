<template>
    <div class="river-plan-container" :class="{'not-active': planNotActive}">
        <div class="switch-nav-container">
            <input
                type="radio"
                id="radio-1"
                name="tabs"
                :checked="curIndex == 0"
                @click="selectByUser(0)"
            />
            <label class="tab" for="radio-1">{{ imageTitles[0] }}</label>
            <input
                type="radio"
                id="radio-2"
                name="tabs"
                :checked="curIndex == 1"
                @click="selectByUser(1)"
            />
            <label class="tab" for="radio-2">{{ imageTitles[1] }}</label>
            <input
                type="radio"
                id="radio-3"
                name="tabs"
                :checked="curIndex == 2"
                @click="selectByUser(2)"
            />
            <label class="tab" for="radio-3">{{ imageTitles[2] }}</label>
            <span class="glider"></span>
        </div>
        <div class="carousel-viewer-container">
            <el-carousel
                :interval="5000"
                arrow="always"
                height="75vh"
                @change="carouselChange"
                ref="carouselDom"
            >
                <el-carousel-item v-for="src in images" :key="src">
                    <el-image
                        style="width: 100%; height: 100%"
                        :src="src"
                        fit="contain"
                        :preview-src-list="[src]"
                        :preview-teleported="true"
                    />
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const images = [import.meta.env.VITE_BASE + '/plan-clipped.png', import.meta.env.VITE_BASE + '/plan-clipped2.png', import.meta.env.VITE_BASE + '/plan-clipped3.png']

const planNotActive = ref(true)

const imageTitles = [
    '澄通河段岸线功能区分区规划示意图',
    '澄通河段河道综合整治研究方案示意图',
    '澄通河段河道综合整治工程总体布置示意图',
]

const carouselDom = ref()

const curIndex = ref(0)

const carouselChange = (index) => {
    // console.log(index)
    curIndex.value = index
}

const selectByUser = (index) => {
    curIndex.value = index
    carouselDom.value.setActiveItem(index)
}

onMounted(() => {
    setTimeout(() => {
        planNotActive.value = false
    }, 50)
})
</script>

<style lang="scss" scoped>
div.river-plan-container {
    position: relative;
    width: 72vw;
    height: 80vh;
    left: 18vw;
    top: 4vh;
    transition: all 0.8s cubic-bezier(0.68, -0.15, 0.265, 1.15);

    &.not-active {
        left: 100vw;
        transition: all 0.8s cubic-bezier(0.68, -0.15, 0.265, 1.15);
    }

    z-index: 3;

    background-color: transparent;

    div.switch-nav-container {
        position: relative;
        height: 5vh;
        width: 30vw;
        margin-bottom: 1vh;

        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-flow: row nowrap;
        background-color: #fff;
        box-shadow:
            0 0 4px 1px rgba(#0642b1, 0.55),
            0 6px 12px 0 rgba(#0642b1, 0.55);
        padding: 0.6vh;
        border-radius: 0.6vw; // just a high number to create pill effect
        * {
            z-index: 6;
        }

        input[type='radio'] {
            display: none;
        }

        .tab {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 5vh;
            padding-left: 1vw;
            padding-right: 1vw;
            width: 8vw;
            font-size: calc(0.6vw + 0.3vh);
            font-weight: 600;
            border-radius: 1.6rem; // just a high number to create pill effect
            cursor: pointer;
            transition: color 0.15s ease-in;
            text-align: center;
        }

        input[type='radio'] {
            &:checked {
                & + label {
                    color: #185ee0;
                }
            }
        }

        input[id='radio-1'] {
            &:checked {
                & ~ .glider {
                    transform: translateX(0);
                }
            }
        }

        input[id='radio-2'] {
            &:checked {
                & ~ .glider {
                    transform: translateX(100%);
                }
            }
        }

        input[id='radio-3'] {
            &:checked {
                & ~ .glider {
                    transform: translateX(200%);
                }
            }
        }

        .glider {
            position: absolute;
            display: flex;
            height: 5vh;
            width: 10vw;
            background-color: #bcd8fc;
            z-index: 5;
            border-radius: 0.6vw; // just a high number to create pill effect
            transition: 0.4s cubic-bezier(0.68, -0.25, 0.265, 1.25);
        }

        // @media (max-width: 700px) {
        //     .tabs {
        //         transform: scale(0.6);
        //     }
        // }
    }

    div.carousel-viewer-container {
        width: 100%;
        height: 75vh;
        background-color: transparent;
    }
}

:deep(.el-carousel__arrow) {
    width: 3vw;
    height: 3vw;
    border-radius: 40%;
    background-color: rgb(213, 231, 255);

    .el-icon {
        width: 3vw;
        height: 3vw;
        fill: black;
        color: black;

        svg {
            width: 2.4vw;
            height: 2.4vw;
            // path {
            //     stroke-width: 20;
            // }
        }
    }
}
</style>

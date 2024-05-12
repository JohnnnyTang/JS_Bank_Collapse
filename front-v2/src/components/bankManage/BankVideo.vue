<template>
    <div class="bank-video-container">
        <div class="video-list-container">
            <dv-border-box12 backgroundColor="rgb(233, 250, 255)">
                <div class="video-list-title">实时现场监控视频</div>
                <div class="video-page-container">
                    <div
                        v-for="(item, index) in videoList"
                        :key="index"
                        class="video-box"
                    >
                        <div class="video-content">
                            <!-- <video
                                width="100%"
                                height="100%"
                                :id="item.name"
                                controls
                                preload="auto"
                                class="video-js vjs-default-skin"
                            ><source :src="item.videoUrl" /></video> -->
                            <!-- <videoPlay :src="item.videoUrl" autoPlay :type="m3u8"/> -->
                            <iframe
                                :src="item.videoUrl"
                                width="100%"
                                height="100%"
                                :id="item.name"
                                allowfullscreen
                            >
                            </iframe>
                        </div>
                        <div class="video-title">{{ item.name }}</div>
                    </div>
                </div>
                <div class="pagination-container">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :page-count="1"
                    />
                </div>
            </dv-border-box12>
        </div>
        <div class="video-info-container">
            <dv-border-box10>
                <div class="video-info-title">监控点位信息</div>
                <div
                    class="video-info-card"
                    v-for="(item, index) in videoList"
                    :key="index"
                >
                    <div class="video-card-title">{{ item.name }}</div>
                    <div class="video-key-val">
                        <div class="video-key">布设点位：</div>
                        <div class="video-val" v-if="changeStatus">
                            <el-input
                                v-model="item.position"
                                style="
                                    width: 100%;
                                    height: 100%;
                                    font-size: calc(0.6vw + 0.6vh);
                                "
                                :autosize="{ minRows: 4, maxRows: 6 }"
                            />
                        </div>
                        <div class="video-val" v-else>{{ item.position }}</div>
                    </div>
                    <div class="change-button-container">
                        <div
                            class="change-button"
                            @click="modifyData"
                            :class="{ modify: changeStatus }"
                        >
                            {{ changeStatus ? '提交' : '修改' }}
                        </div>
                        <div
                            class="cancel-button"
                            v-if="changeStatus"
                            @click="cancelClick"
                        >
                            取消
                        </div>
                    </div>
                </div>
            </dv-border-box10>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { BorderBox12 as DvBorderBox12 } from '@kjgl77/datav-vue3'
import { BorderBox10 as DvBorderBox10 } from '@kjgl77/datav-vue3'
import axios from 'axios'
// import 'viplayer/dist/index.css'
// import { videoPlay } from 'viplayer'
// const token = 'at.2q8ej4p4114dtudb20awr9763vfz1f6o-5j403u7nkd-1ya7mgb-wv9z5z55f'
const token = 'at.742vjiq01mtq2g3jbnkckwuq3ze19j4w-839um484hs-1qki2ev-lammqrxtd'

const defaultVal = [
    {
        name: '民主沙上游监控S01',
        position: '32.04023206, 120.51992163',
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033036/1.hd.live&autoplay=1&accessToken=${token}`,
    },
    {
        name: '民主沙中游监控S02',
        position: '32.03683063, 120.52666202',
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033037/1.hd.live&autoplay=1&accessToken=${token}`,
    },
    {
        name: '民主沙中游监控S03',
        position: '32.02839471, 120.54611474',
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033035/1.hd.live&autoplay=1&accessToken=${token}`,
    },
]

const videoList = ref([
    {
        name: '民主沙监控1',
        position: '32.0432963, 120.5122242',
        videoUrl:
        `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033036/1.hd.live&autoplay=1&accessToken=${token}`,
    },
    {
        name: '民主沙监控2',
        position: '32.0381061, 120.5263473',
        videoUrl:
        `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033037/1.hd.live&autoplay=1&accessToken=${token}`,
    },
    {
        name: '民主沙监控3',
        position: '32.0316674, 120.5402574',
        videoUrl:
        `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033035/1.hd.live&autoplay=1&accessToken=${token}`,
    },
])

const changeStatus = ref(false)

const modifyData = () => {
    if (changeStatus.value) {
    } else {
    }
    changeStatus.value = !changeStatus.value
}

const cancelClick = () => {
    videoList.value = defaultVal
    changeStatus.value = false
}
</script>

<style lang="scss" scoped>
div.bank-video-container {
    width: 100%;
    height: 100%;
    // padding-top: 1vh;
    // padding-bottom: 1vh;
    // margin-left: 0.5vw;
    // padding-right: 0.5vw;

    border-radius: 12px;
    // margin-bottom: 1vh;
    overflow: hidden;
    display: flex;
    justify-content: space-between;

    // background-color: rgb(240, 255, 240);

    div.video-list-container {
        width: 60vw;
        height: 90vh;
        // background-color: rgb(233, 250, 255);

        border-radius: 8px;
        box-shadow: 12px 12px 20px -10px rgba(0, 0, 0, 0.8);

        div.video-list-title {
            width: 58vw;
            margin-left: 1vw;
            height: 6vh;
            line-height: 6vh;

            text-align: center;
            font-weight: bold;
            font-size: calc(0.9vw + 0.9vh);

            border-bottom: 3px solid;
        }

        div.video-page-container {
            width: 60vw;
            height: 78vh;
            display: flex;
            flex-flow: row wrap;
            justify-content: space-around;
            align-content: space-around;
            // align-items: flex-start;

            div.video-box {
                width: 48%;
                height: 48%;

                background-color: rgba(172, 215, 255, 0.651);

                div.video-content {
                    height: 90%;
                    width: 100%;

                    background-color: rgb(34, 75, 165);
                }

                div.video-title {
                    line-height: 3vh;
                    height: 3vh;
                    text-align: center;

                    font-weight: bold;
                    font-size: calc(0.6vw + 0.6vh);
                }
            }

            // background-color: aliceblue;
        }

        div.pagination-container {
            height: 6vh;
            width: 30vw;
            margin-left: 15vw;

            // background-color: aliceblue;

            display: flex;
            justify-content: center;
            align-items: center;

            div.el-pagination {
                --el-pagination-font-size: calc(0.45vw + 0.45vh);
            }

            :deep(ul.el-pager) {
                font-family: Impact, Haettenschweiler, 'Arial Narrow Bold',
                    sans-serif;
                text-align: center;
            }

            :deep(button.btn-prev) {
                padding: 0 0 0 0;
            }
            :deep(button.btn-next) {
                padding: 0 0 0 0;
            }

            :deep(i.el-icon) {
                width: 100%;
                height: 100%;

                svg {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }

    div.video-info-container {
        width: 26vw;
        height: 90vh;
        border-radius: 8px;
        box-shadow: 12px 12px 20px -10px rgba(0, 0, 0, 0.8);

        background-color: rgb(215, 230, 250);

        div.video-info-title {
            width: 25vw;
            margin-left: 0.5vw;
            height: 6vh;
            line-height: 6vh;

            text-align: center;
            font-weight: bold;
            font-size: calc(0.9vw + 0.9vh);

            border-bottom: 3px solid;
        }

        div.video-info-card {
            width: 24vw;
            margin-left: 1vw;
            height: 13vh;
            border-radius: 8px;
            margin-top: 2vh;

            background-color: rgb(190, 242, 255);
            text-align: center;
            border: 2px solid #3361c4;
            box-shadow: 12px 12px 20px -10px rgba(0, 0, 0, 0.8);
            transition: all 0.3s cubic-bezier(0.68, -0.35, 0.265, 1.35);

            &:hover {
                transform: scale(1.05);
            }

            div.video-card-title {
                height: 4vh;
                width: 22vw;
                margin-left: 1vw;
                padding-left: 0.5vw;
                text-align: left;
                line-height: 4vh;

                font-size: calc(0.7vw + 0.6vh);
                font-weight: bold;

                border-bottom: 3px solid #1649b8;
            }

            div.video-key-val {
                height: 4vh;
                width: 24vw;
                display: flex;
                line-height: 4vh;
                font-size: calc(0.6vw + 0.5vh);

                div.video-key {
                    width: 8vw;
                    color: #0842c0;
                }
                div.video-val {
                    width: 16vw;
                }
            }

            div.change-button-container {
                position: relative;
                width: 8vw;
                height: 4vh;
                top: 0vh;
                left: 14vw;

                // background-color: #0040a0;

                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;

                text-align: center;
                font-weight: bold;
                font-size: calc(0.8vw + 0.4vh);

                div.change-button {
                    width: 8vw;
                    height: 4vh;
                    line-height: 4vh;
                    border-radius: 6px;

                    background-color: #b4ddff;
                    transition: all 0.2s ease-in-out;

                    box-shadow:
                        rgba(0, 132, 255, 0.8) 1px 1px,
                        rgba(0, 119, 255, 0.7) 2px 2px,
                        rgba(0, 119, 255, 0.6) 3px 3px;

                    &.modify {
                        width: 3.2vw;
                    }
                    &:hover {
                        cursor: pointer;
                        transform: translate3d(2px, 2px, 2px);
                        color: #0539a8;
                        box-shadow:
                            rgba(0, 132, 255, 0.8) 1px 1px,
                            rgba(0, 119, 255, 0.7) 2px 2px,
                            rgba(0, 119, 255, 0.6) 3px 3px,
                            rgba(0, 119, 255, 0.4) 4px 4px;
                    }
                }

                div.cancel-button {
                    width: 3.2vw;
                    height: 4vh;
                    line-height: 4vh;
                    transition: all 0.6s ease-in-out;

                    border-radius: 6px;
                    color: #f0f8ff;
                    background-color: #2358eb;
                    box-shadow:
                        rgba(29, 142, 248, 0.8) 1px 1px,
                        rgba(26, 133, 255, 0.7) 2px 2px,
                        rgba(25, 132, 255, 0.6) 3px 3px;

                    &:hover {
                        cursor: pointer;
                        color: #85f7ff;
                        transform: translate3d(2px, 2px, 2px);
                        box-shadow:
                            rgba(29, 142, 248, 0.8) 1px 1px,
                            rgba(26, 133, 255, 0.7) 2px 2px,
                            rgba(25, 132, 255, 0.6) 3px 3px,
                            rgba(35, 138, 255, 0.4) 4px 4px;
                    }
                }
            }
        }
    }
}
</style>

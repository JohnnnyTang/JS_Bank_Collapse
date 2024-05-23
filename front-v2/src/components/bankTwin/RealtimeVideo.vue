<template>
    <div
        class="realtime-video-container"
        :class="props.active ? 'active' : 'in-active'"
        v-if="props.active"
    >
        <div class="realtime-video-title">实时视频监控</div>
        <div
            class="video-box"
            v-for="(item, index) in videoList"
            :key="index"
            :id="index"
        >
            <div class="video-content">
                <iframe
                    :src="item.videoUrl + token"
                    width="100%"
                    height="100%"
                    :id="item.name"
                    allowfullscreen
                >
                </iframe>
            </div>
            <div class="video-title">{{ item.name }}</div>
            <div class="video-focus" v-if="index != 0" @click="focusOn(index)">
                放大/控制
            </div>
        </div>
        <div class="video-controller-container">
            <div class="video-controller-title">当前监控云台控制</div>
            <div class="crc-directions">
                <div class="crc-directions-up">
                    <ArrowUpBold
                        style="width: 3vh; height: 3vh; display: block"
                    />
                </div>
                <div class="crc-directions-left">
                    <ArrowLeftBold
                        style="width: 3vh; height: 3vh; display: block"
                    />
                </div>
                <div class="crc-directions-right">
                    <ArrowRightBold
                        style="width: 3vh; height: 3vh; display: block"
                    />
                </div>
                <div class="crc-directions-down">
                    <ArrowDownBold
                        style="width: 3vh; height: 3vh; display: block"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted, watch } from 'vue'

const token = ref(
    'at.8z5xddvs305hvthb5emtqno22k38c3s0-6bgwm8993s-0llo4pp-mc0rbdnna',
)

const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
})

const videoList = ref([
    {
        name: '民主沙海事码头监控',
        position: '32.0316674, 120.5402574',
        // videoUrl: `https://open.ys7.com/ezopen`,
         videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033035/1.live&autoplay=1&accessToken=`,
    },
    {
        name: '民主沙靖江市江滩办事处外堤监控',
        position: '32.0381061, 120.5263473',
        // videoUrl: `https://open.ys7.com/ezopen`,
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033037/1.live&autoplay=1&accessToken=`,
    },
    {
        name: '民主沙上游围堤监控',
        position: '32.0432963, 120.5122242',
        // videoUrl: `https://open.ys7.com/ezopen`,
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033036/1.live&autoplay=1&accessToken=`,
    },
])

const focusOn = (index) => {
    ;[videoList.value[0], videoList.value[index]] = [
        videoList.value[index],
        videoList.value[0],
    ]
}
</script>

<style lang="scss" scoped>
$hoverColor: rgb(0, 160, 252);
$splitColor: rgba(0, 51, 160, 0.575);

div.realtime-video-container {
    position: absolute;
    right: 0.5vw;
    top: 9vh;

    height: 82vh;
    width: 27.5vw;

    z-index: 4;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-content: flex-start;
    column-gap: 1vw;
    row-gap: 1vh;

    backdrop-filter: blur(12px);
    box-shadow: 4px 8px 8px -4px rgb(0, 47, 117);
    background-color: rgba(156, 195, 255, 0.4);
    border-radius: 4px;
    border: 2px solid rgb(28, 105, 247);

    div.realtime-video-title {
        height: 4vh;
        line-height: 4vh;
        width: 100%;
        text-align: center;

        font-size: calc(0.8vw + 0.8vh);
        font-weight: bold;
        color: #0400fd;
        text-shadow:
            #eef3ff 1px 1px,
            #eef3ff 2px 2px,
            #6493ff 3px 3px;
        letter-spacing: 0.4rem;

        border-bottom: 2px solid #0400fd;
    }

    div.video-box {
        width: 12.5vw;
        // margin-left: 0.5vw;
        height: 16vh;

        background-color: rgba(3, 63, 173, 1);

        div.video-content {
            height: calc(100% - 3vh);
            width: 100%;

            background-color: rgb(34, 75, 165);
        }

        div.video-title {
            line-height: 3vh;
            height: 3vh;
            text-align: center;

            font-weight: bold;
            font-size: calc(0.4vw + 0.4vh);
            color: #eef3ff;
        }

        div.video-focus {
            position: relative;
            line-height: 3vh;
            height: 3vh;
            text-align: center;
            width: fit-content;
            margin-top: 0.5vh;
            padding-left: 0.5vw;
            padding-right: 0.5vw;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 4px;

            font-weight: bold;
            font-size: calc(0.4vw + 0.6vh);
            color: #eef3ff;
            background-color: #487fff;

            &:hover {
                background-color: #0037ad;
                color: #9df8ff;
                cursor: pointer;
            }
        }

        &[id='0'] {
            width: 27vw;
            height: 32vh;
            order: 1;

            div.video-title {
                font-size: calc(0.6vw + 0.6vh);
            }
        }

        &[id='1'] {
            order: 3;
        }

        &[id='2'] {
            order: 4;
        }
    }

    div.video-controller-container {
        order: 2;
        width: 27vw;
        height: 22vh;
        display: flex;
        flex-flow: column wrap;

        background-color: #6aa5f1;
        border: 2px solid #001885;
        border-radius: 4px;

        div.video-controller-title {
            writing-mode: vertical-lr;
            padding-left: 0.5vw;
            width: 2vw;
            height: 22vh;
            font-weight: bold;
            font-size: calc(0.7vw + 0.8vh);
            text-align: center;
            color: #001885;

            box-shadow: 3px 0px rgb(0, 3, 196);
        }

        .crc {
            position: relative;
            list-style-type: none;
            margin: 0;
            transform: translate(
                -4px,
                -50%
            ); //2px border offset fix
            &-directions {
                position: relative;
                display: block;
                height: 18vh;
                width: 18vh;
                background: white;
                top: 50%;
                // left: 50%;
                transform: translate(-50%, -50%);
                z-index: 2;
                border-radius: 50%;
                box-shadow: 12px 8px 20px -10px rgba(0, 0, 0, 0.4);
                &::before {
                    position: relative;
                    content: '';
                    display: block;
                    height: 18vh;
                    width: 18vh;
                    border-radius: 50%;
                    background: linear-gradient(
                        45deg,
                        transparent 49%,
                        $splitColor 51%,
                        $splitColor 51%,
                        transparent 51%
                    );
                    z-index: 2;
                }
                &::after {
                    position: relative;
                    content: '';
                    display: block;
                    height: 18vh;
                    width: 18vh;
                    transform: translateY(-18vh);
                    border-radius: 50%;
                    background: linear-gradient(
                        135deg,
                        transparent 49%,
                        $splitColor 51%,
                        $splitColor 51%,
                        transparent 51%
                    );
                    z-index: 2;
                }

                &-up {
                    position: absolute;
                    top: 1vh;
                    left: 50%;
                    transform: translateX(-50%);
                    cursor: pointer;
                    transition: all 250ms ease-in-out;
                    svg {
                        &:hover {
                            :deep(path) {
                                fill: $hoverColor !important;
                            }
                        }
                    }
                    z-index: 4;
                }
                &-down {
                    position: absolute;
                    bottom: 1vh;
                    left: 50%;
                    transform: translateX(-50%);
                    cursor: pointer;
                    transition: all 250ms ease-in-out;
                    svg {
                        &:hover {
                            :deep(path) {
                                fill: $hoverColor !important;
                            }
                        }
                    }
                    z-index: 4;
                }
                &-left {
                    position: absolute;
                    top: 50%;
                    left: 1vh;
                    transform: translateY(-50%);
                    cursor: pointer;
                    transition: all 250ms ease-in-out;
                    svg {
                        &:hover {
                            :deep(path) {
                                fill: $hoverColor !important;
                            }
                        }
                    }
                    z-index: 4;
                }
                &-right {
                    position: absolute;
                    top: 50%;
                    right: 1vh;
                    transform: translateY(-50%);
                    cursor: pointer;
                    transition: all 250ms ease-in-out;
                    svg {
                        &:hover {
                            :deep(path) {
                                fill: $hoverColor !important;
                            }
                        }
                    }
                    z-index: 4;
                }
            }
        }
    }

    transition: transform 0.2s ease-in-out;
    &.in-active {
        transform: translateX(30vw);
    }
}
</style>

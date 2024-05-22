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
            <div class="crc-directions">
                <div class="crc-directions-up">
                    <i class="fas fa-chevron-up"></i>
                </div>
                <div class="crc-directions-left">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <div class="crc-directions-right">
                    <i class="fas fa-chevron-right"></i>
                </div>
                <div class="crc-directions-down">
                    <i class="fas fa-chevron-down"></i>
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
        videoUrl: `https://open.ys7.com/ezopen`,
        //  videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033035/1.live&autoplay=1&accessToken=`,
    },
    {
        name: '民主沙靖江市江滩办事处外堤监控',
        position: '32.0381061, 120.5263473',
        videoUrl: `https://open.ys7.com/ezopen`,
        // videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033037/1.live&autoplay=1&accessToken=`,
    },
    {
        name: '民主沙上游围堤监控',
        position: '32.0432963, 120.5122242',
        videoUrl: `https://open.ys7.com/ezopen`,
        // videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033036/1.live&autoplay=1&accessToken=`,
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

        background-color: #0400fd;

        .crc {
            &-wrapper {
                position: relative;
                width: 250px;
                height: 250px;
                overflow: hidden;
                border-radius: 50%;
                border: 2px solid white;
            }
            position: relative;
            list-style-type: none;
            margin: 0;
            transform: translate(
                calc(-50% - 4px),
                -50%
            ); //2px border offset fix
            &-item {
                position: absolute;
                width: 125px;
                height: 125px;
                background-color: white;
                transform-origin: 100% 100%;
                overflow: hidden;
                border-bottom: 1px solid #d9d3d5;
                top: 50%;
                left: 50%;
                transition: border 0.3s ease;
                i {
                    transition: all 0.2s ease-in-out;
                }
                &.active {
                    background-color: teal;
                    border-bottom: 2px solid teal;
                    a {
                        i {
                            color: white;
                        }
                        &:hover {
                            i {
                                color: white;
                            }
                        }
                    }
                }
                &:hover {
                    border-bottom: 4px solid teal;
                    a i {
                        color: teal;
                    }
                }
                &:first-child {
                    transform: rotate(0deg) skew(45deg);
                    i {
                        transform: skew(-45deg) scale(1);
                        margin-top: 60%;
                        color: black;
                        margin-left: 20%;
                    }
                }

                &:nth-child(2) {
                    transform: rotate(45deg) skew(45deg);
                    i {
                        transform: skew(-45deg) rotate(-45deg) scale(1);
                        margin-top: 60%;
                        color: black;
                        margin-left: 20%;
                    }
                }

                &:nth-child(3) {
                    transform: rotate(90deg) skew(45deg);
                    i {
                        transform: skew(-45deg) rotate(-90deg) scale(1);
                        margin-top: 60%;
                        color: black;
                        margin-left: 20%;
                    }
                }

                &:nth-child(4) {
                    transform: rotate(135deg) skew(45deg);
                    i {
                        transform: skew(-45deg) rotate(-135deg) scale(1);
                        margin-top: 60%;
                        color: black;
                        margin-left: 20%;
                    }
                }

                &:nth-child(5) {
                    transform: rotate(180deg) skew(45deg);
                    i {
                        transform: skew(-45deg) rotate(-180deg) scale(1);
                        margin-top: 60%;
                        color: black;
                        margin-left: 20%;
                    }
                }

                &:nth-child(6) {
                    transform: rotate(225deg) skew(45deg);
                    i {
                        transform: skew(-45deg) rotate(-225deg) scale(1);
                        margin-top: 60%;
                        color: black;
                        margin-left: 20%;
                    }
                }

                &:nth-child(7) {
                    transform: rotate(270deg) skew(45deg);
                    i {
                        transform: skew(-45deg) rotate(-270deg) scale(1);
                        margin-top: 60%;
                        color: black;
                        margin-left: 20%;
                    }
                }

                &:nth-child(8) {
                    transform: rotate(315deg) skew(45deg);
                    i {
                        transform: skew(-45deg) rotate(-315deg) scale(1);
                        margin-top: 60%;
                        color: black;
                        margin-left: 20%;
                    }
                }
                a {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    text-decoration: none;
                    color: #fff;
                    text-align: center;
                    transition:
                        opacity 0.3s,
                        color 0.3s;
                    &:hover {
                        color: rgba(255, 255, 255, 0.5);
                    }
                }
            }
            &-directions {
                position: absolute;
                display: block;
                height: 100px;
                width: 100px;
                background: white;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 2;
                border-radius: 50%;
                box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.25);
                i {
                    color: gray;
                }
                &-wrapper {
                    position: absolute;
                    display: block;
                    top: 50%;
                    left: 50%;
                    width: 150px;
                    height: 150px;
                    background-color: white;
                    transform: translate(-50%, -50%);
                    z-index: 1;
                    border-radius: 50%;
                }
                &-up {
                    position: absolute;
                    top: 4px;
                    left: 50%;
                    transform: translateX(-50%);
                    cursor: pointer;
                    tranistion: all 250ms ease-in-out;
                    &:hover {
                        i {
                            color: teal;
                        }
                    }
                }
                &-down {
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-50%);
                    cursor: pointer;
                    tranistion: all 250ms ease-in-out;
                    &:hover {
                        i {
                            color: teal;
                        }
                    }
                }
                &-left {
                    position: absolute;
                    top: 50%;
                    left: 4px;
                    transform: translateY(-50%);
                    cursor: pointer;
                    tranistion: all 250ms ease-in-out;
                    &:hover {
                        i {
                            color: teal;
                        }
                    }
                }
                &-right {
                    position: absolute;
                    top: 50%;
                    right: 4px;
                    transform: translateY(-50%);
                    cursor: pointer;
                    tranistion: all 250ms ease-in-out;
                    &:hover {
                        i {
                            color: teal;
                        }
                    }
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

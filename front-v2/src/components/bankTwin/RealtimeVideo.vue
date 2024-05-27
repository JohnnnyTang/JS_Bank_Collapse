<template>
    <div
        class="realtime-video-container"
        :class="props.active ? 'active' : 'in-active'"
    >
        <div class="realtime-video-title">实时视频监控</div>
        <div
            class="video-box"
            v-for="(item, index) in videoList"
            :key="index"
            :id="item.order"
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
            <div class="video-focus" v-if="item.order != 0" @click="focusOn(index)">
                放大/控制
            </div>
            <div class="small-pic" v-if="item.order == 0" :id="index"></div>
        </div>
        <div class="video-controller-container">
            <div class="video-controller-title">当前监控云台控制</div>
            <div class="crc-directions">
                <div class="crc-directions-up" @click="basicVideoFunction(0)">
                    <ArrowUpBold
                        style="width: 3vh; height: 3vh; display: block"
                    />
                </div>
                <div class="crc-directions-left" @click="basicVideoFunction(2)">
                    <ArrowLeftBold
                        style="width: 3vh; height: 3vh; display: block"
                    />
                </div>
                <div
                    class="crc-directions-right"
                    @click="basicVideoFunction(3)"
                >
                    <ArrowRightBold
                        style="width: 3vh; height: 3vh; display: block"
                    />
                </div>
                <div class="crc-directions-down" @click="basicVideoFunction(1)">
                    <ArrowDownBold
                        style="width: 3vh; height: 3vh; display: block"
                    />
                </div>
            </div>
            <div class="function-button-group">
                <div class="preset button-title">预设点</div>

                <div class="preset button-column">
                    <div
                        class="preset button-item"
                        v-for="i in 4"
                        :key="i"
                        @click="move2PresetPoint(i)"
                    >
                        {{ '预设点-' + i }}
                    </div>
                </div>
                <div class="zoom button-title">视角缩放</div>
                <div class="zoom button-column">
                    <div
                        class="zoom button-item"
                        v-for="(func, index) in zoomFuncList"
                        :key="index"
                        @click="basicVideoFunction(index + 4)"
                    >
                        {{ func.label }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    onMounted,
    ref,
    onUnmounted,
    watch,
    onBeforeUnmount,
    onBeforeMount,
} from 'vue'
import axios from 'axios'

const token = ref(
    'at.89iiwo7c5cztq6f30wuai5oy0j3362ow-6m3qlhqadh-1phdss1-rmjo1wuzd',
)

const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
})

const zoomFuncList = [
    { label: '放大', func: '' },
    { label: '缩小', func: '' },
    { label: '远焦距', func: '' },
    { label: '近焦距', func: '' },
]

let controlParam = {
    deviceSerial: 'FB5033035',
    channelNo: '1',
    direction: '9',
    speed: 2,
}

let presetParam = {
    deviceSerial: 'FB5033035',
    channelNo: '1',
    index: '1',
}

const functionIndexList = [0, 1, 2, 3, 8, 9, 10, 11]

let curBigVideoIndex = 0

const videoList = ref([
    {
        name: '民主沙海事码头监控',
        position: '32.0316674, 120.5402574',
        deviceId: 'FB5033035',
        // videoUrl: `https://open.ys7.com/ezopen`,
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033035/1.hd.live&autoplay=1&accessToken=`,
        order: 0,
    },
    {
        name: '民主沙靖江市江滩办事处外堤监控',
        position: '32.0381061, 120.5263473',
        deviceId: 'FB5033037',
        // videoUrl: `https://open.ys7.com/ezopen`,
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033037/1.hd.live&autoplay=1&accessToken=`,
        order: 1
    },
    {
        name: '民主沙上游围堤监控',
        position: '32.0432963, 120.5122242',
        deviceId: 'FB5033036',
        // videoUrl: `https://open.ys7.com/ezopen`,
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033036/1.hd.live&autoplay=1&accessToken=`,
        order: 2
    },
])

const focusOn = (index) => {
    ;[videoList.value[curBigVideoIndex].order, videoList.value[index].order] = [
        videoList.value[index].order,
        videoList.value[curBigVideoIndex].order,
    ]
    curBigVideoIndex = index
}

const basicVideoFunction = async (functionIndex) => {
    controlParam.deviceSerial = videoList.value[curBigVideoIndex].deviceId
    controlParam.direction = functionIndexList[functionIndex]
    // console.log('curent func param', controlParam)
    let stRes = await axios.post(
        'https://open.ys7.com/api/lapp/device/ptz/start',
        null,
        {
            params: { accessToken: token.value, ...controlParam },
        },
    )
    setTimeout(async () => {
        let stopRes = await axios.post(
            'https://open.ys7.com/api/lapp/device/ptz/stop',
            null,
            {
                params: { accessToken: token.value, ...controlParam },
            },
        )
        // console.log('control stopped', stRes, stopRes)
    }, 100)
}

const move2PresetPoint = async (presetIndex) => {
    presetParam.deviceSerial = videoList.value[curBigVideoIndex].deviceId
    presetParam.index = presetIndex
    // console.log('preset param', presetParam)
    let stRes = await axios.post(
        'https://open.ys7.com/api/lapp/device/preset/move',
        null,
        {
            params: { accessToken: token.value, ...presetParam },
        },
    )
    // console.log('preset move', stRes)
}

const moveBack2Origin = async () => {
    const moveBackPost = []
    for (let video of videoList.value) {
        console.log(video)
        moveBackPost.push(
            axios.post(
                'https://open.ys7.com/api/lapp/device/preset/move',
                null,
                {
                    params: {
                        accessToken: token.value,
                        channelNo: '1',
                        index: '1',
                        deviceSerial: video.deviceId,
                    },
                },
            ),
        )
    }
    const res = await axios.all(moveBackPost)
    console.log('back back', res)
}

onBeforeMount(async () => {
    await moveBack2Origin()
})

onMounted(() => {
    // let res = await axios.post('https://open.ys7.com/api/lapp/device/ptz/start', null, {
    //     params: {accessToken: token.value, ...controlParam}
    // })
    // console.log('zooooom', res.data)
})

onBeforeUnmount(async () => {
    await moveBack2Origin()
})
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
    overflow: hidden;
    

    &.in-active {
        height: 37.5vh;
    }

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

        div.small-pic {
            width: 8vw;
            height: 8vh;

            position: relative;
            top: -32vh;
            right: -19vw;
            background-color: #ffffff8e;

            background-size: contain;
            background-repeat: no-repeat;
            background-position: 50% 50%;

            &[id="0"] {
                background-image: url('/mzsBase-monitor3.png');
            }
            &[id="1"] {
                background-image: url('/mzsBase-monitor2.png');
            }
            &[id="2"] {
                background-image: url('/mzsBase-monitor1.png');
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
        justify-content: center;
        align-content: flex-start;
        column-gap: 1.5vw;

        background-color: #a4cbff94;
        border: 2px solid #001885;
        border-radius: 4px;

        div.video-controller-title {
            writing-mode: vertical-lr;
            padding-left: 0.5vw;
            width: 2vw;
            height: 22vh;
            font-weight: bold;
            font-size: calc(0.6vw + 0.9vh);
            text-align: center;
            letter-spacing: 0.2rem;
            color: #001885;

            box-shadow: 3px 0px rgb(0, 3, 196);
        }

        .crc {
            position: relative;
            list-style-type: none;
            margin: 0;
            // transform: translate(
            //     -4px,
            //     -50%
            // ); //2px border offset fix
            &-directions {
                position: relative;
                display: block;
                height: 18vh;
                width: 18vh;
                background: white;
                // top: 50%;
                // left: 50%;
                // transform: translate(-50%, -50%);
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

        div.function-button-group {
            width: calc(21vw - 18vh);
            height: 20vh;

            // background-color: #0059fd;

            display: flex;
            flex-flow: column wrap;
            column-gap: 0.5vw;
            border-radius: 4px;
            overflow: hidden;
            padding: 0.2vh;

            div.button-title {
                width: 46%;
                height: 3vh;
                line-height: 3vh;
                text-align: center;
                font-size: calc(0.4vw + 0.7vh);
                font-weight: bold;
                color: #eef3ff;
                border-top-right-radius: 4px;
                border-top-left-radius: 4px;
                border: #000985 solid 2px;

                background-color: #0062e2;
            }

            div.button-column {
                width: 46%;
                height: 16vh;
                border-bottom-right-radius: 4px;
                background-color: #b3daff;
                display: flex;
                flex-flow: column nowrap;
                justify-content: space-around;
                align-items: center;
                border-bottom-left-radius: 4px;
                border-bottom: #001885 solid 2px;
                border-right: #001885 solid 2px;
                border-left: #001885 solid 2px;

                div.button-item {
                    width: 80%;
                    height: 3vh;
                    line-height: 3vh;
                    text-align: center;
                    border-radius: 4px;
                    color: #eef3ff;
                    // font-weight: bold;
                    font-size: calc(0.4vw + 0.6vh);

                    background-color: #001885;

                    &:hover {
                        cursor: pointer;
                        font-weight: bold;
                        color: #9df8ff;
                    }
                }
            }
        }
    }

    transition: transform 0.2s ease-in-out;
    &.in-active {
        top: 54vh;
    }
}
</style>

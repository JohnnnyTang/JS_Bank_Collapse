<template>
    <div
        class="realtime-video-container"
        :class="[props.active ? 'active' : 'in-active', {'hide-right': props.domHide}]"
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
            <div
                class="video-title"
                :class="videoList[index].warn ? 'warn' : 'normal'"
            >
                {{ item.name }}
            </div>
            <div
                class="video-focus"
                v-if="item.order != 0"
                @click="focusOn(index)"
            >
                放大
            </div>
            <div class="small-pic" v-if="item.order == 0" :id="index"></div>
        </div>
        <div class="video-control-opener" :class="{ open: videoControlOpen }">
            <div class="left tri"></div>
            <div class="control-open-text" @click="toggleVideoControl">
                {{ videoControlOpen ? '▲监控云台控制▲' : '▼监控云台控制▼' }}
            </div>
            <div class="right tri"></div>
        </div>
        <div class="video-controller-container" v-if="videoControlOpen">
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
                        v-for="(item, i) in videoList[curBigVideoIndex]
                            .presetPt"
                        :key="i"
                        @click="move2PresetPoint(i + 1)"
                        :class="item.status"
                    >
                        {{ item.name }}
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
        <div class="history-table" v-show="!videoControlOpen">
            <div class="history-table-title">历史报警信息</div>
            <div class="detail-content-container">
                <div class="head device-status-row">
                    <div class="device-id device-item head">序号</div>
                    <div class="device-time device-item head">报警时间</div>
                    <div class="device-name device-item head">报警设备</div>
                    <div class="device-place device-item head">报警位置</div>
                    <div class="device-deal device-item head">处置</div>
                </div>
                <div
                    class="device-status-row body"
                    v-for="(item, index) in dealtWarnList"
                    :key="index"
                >
                    <div class="device-id device-item body">
                        {{ index + 1 }}
                    </div>
                    <div class="device-time device-item body">
                        <div class="up">
                            {{ item.warnTime.split(' ')[0] }}
                        </div>
                        <div class="down">
                            {{ item.warnTime.split(' ')[1] }}
                        </div>
                    </div>
                    <div class="device-name device-item body">
                        {{ deviceIdMap[item.deviceId] }}
                    </div>
                    <div class="device-place device-item body">
                        {{ deviceIdPlaceMap[item.deviceId] }}
                    </div>
                    <div class="device-deal device-item body">
                        <div
                            class="withdraw-button"
                            @click="withdrawDeal(item)"
                        >
                            撤回处置
                        </div>
                    </div>
                </div>
                <div
                    class="device-status-row body no-warn"
                    v-if="dealtWarnList.length == 0"
                >
                    暂无已处置报警
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
    computed,
} from 'vue'
import axios from 'axios'
import BackEndRequest from '../../api/backend'
import { useWarnInfoStore } from '../../store/mapStore'

const deviceIdMap = {
    'MZS120.51749289_32.04059243_1': 'CL-01',
    'MZS120.51977143_32.04001152_1': 'CL-02',
    'MZS120.52557975_32.03825056_1': 'CL-03',
    'MZS120.52660704_32.03676583_1': 'CL-04',
    'MZS120.53334877_32.03227055_1': 'CL-05',
    'MZS120.54599538_32.02837993_1': 'CL-06',
    'MZS120.55327892_32.02707923_1': 'CL-07',
    'MZS120.55649757_32.02592404_1': 'CL-08',
    'MZS120.56334257_32.02298144_1': 'CL-09',
    'MZS120.56944728_32.02070961_1': 'CL-10',
    'MZS120.51726088_32.04054582_3': 'KX-01',
    'MZS120.51738292_32.04054923_3': 'KX-02',
    'MZS120.51749021_32.04053105_3': 'KX-03',
    'MZS120.51957026_32.04008655_3': 'KX-04',
    'MZS120.51967889_32.04004108_3': 'KX-05',
    'MZS120.51986665_32.03998992_3': 'KX-06',
    'MZS120.52557975_32.03825056_3': 'KX-07',
    'MZS120.52565217_32.03813574_3': 'KX-08',
    'MZS120.52566826_32.03799363_3': 'KX-09',
    'MZS120.513203_32.042733_2': 'YL-01',
    'MZS120.515433_32.04231_2': 'YL-02',
    'MZS120.521221_32.040331_2': 'YL-03',
    'MZS120.529078_32.034385_2': 'YL-04',
    'MZS120.541648_32.030524_2': 'YL-05',
    'MZS120.548925_32.029361_2': 'YL-06',
    'MZS120.552209_32.028149_2': 'YL-07',
    'MZS120.51967889_32.04004108_4': 'CX-01',
    'MZS120.51986665_32.03998992_4': 'CX-02',
    'MZS120.52557975_32.03825056_4': 'CX-03',
    'MZS120.52565217_32.03813574_4': 'CX-04',
    'MZS120.52566826_32.03799363_4': 'CX-05',
    'MZS120.51726088_32.04054582_4': 'CX-06',
    'MZS120.51738292_32.04054923_4': 'CX-07',
    'MZS120.51749021_32.04053105_4': 'CX-08',
    'MZS120.51957026_32.04008655_4': 'CX-09',
}

const deviceIdPlaceMap = {
    '': '暂无',
    'MZS120.51749289_32.04059243_1': 'MZ02顺堤',
    'MZS120.51977143_32.04001152_1': 'MZ03顺堤尾',
    'MZS120.52557975_32.03825056_1': 'MZ04江滩办',
    'MZS120.52660704_32.03676583_1': 'MZ05小港池',
    'MZS120.53334877_32.03227055_1': 'MZ06张靖皋桥位',
    'MZS120.54599538_32.02837993_1': 'MZ08海事码头',
    'MZS120.55327892_32.02707923_1': 'MZ09码头下游',
    'MZS120.55649757_32.02592404_1': 'MZ10雷达站',
    'MZS120.56334257_32.02298144_1': 'MZ11主路',
    'MZS120.56944728_32.02070961_1': 'MZ12沙尾',
    'MZS120.51726088_32.04054582_3': 'MZ02顺堤',
    'MZS120.51738292_32.04054923_3': 'MZ02顺堤',
    'MZS120.51749021_32.04053105_3': 'MZ02顺堤',
    'MZS120.51957026_32.04008655_3': 'MZ03顺堤尾',
    'MZS120.51967889_32.04004108_3': 'MZ03顺堤尾',
    'MZS120.51986665_32.03998992_3': 'MZ03顺堤尾',
    'MZS120.52557975_32.03825056_3': 'MZ04江滩办',
    'MZS120.52565217_32.03813574_3': 'MZ04江滩办',
    'MZS120.52566826_32.03799363_3': 'MZ04江滩办',
    'MZS120.513203_32.042733_2': 'MZ02顺堤',
    'MZS120.515433_32.04231_2': 'MZ03顺堤尾',
    'MZS120.521221_32.040331_2': 'MZ04江滩办',
    'MZS120.529078_32.034385_2': 'MZ06张靖皋桥位',
    'MZS120.541648_32.030524_2': 'MZ08海事码头',
    'MZS120.548925_32.029361_2': 'MZ09码头下游',
    'MZS120.552209_32.028149_2': 'MZ10雷达站',
    'MZS120.51967889_32.04004108_4': 'MZ02顺堤',
    'MZS120.51986665_32.03998992_4': 'MZ02顺堤',
    'MZS120.52557975_32.03825056_4': 'MZ02顺堤',
    'MZS120.52565217_32.03813574_4': 'MZ03顺堤尾',
    'MZS120.52566826_32.03799363_4': 'MZ03顺堤尾',
    'MZS120.51726088_32.04054582_4': 'MZ03顺堤尾',
    'MZS120.51738292_32.04054923_4': 'MZ04江滩办',
    'MZS120.51749021_32.04053105_4': 'MZ04江滩办',
    'MZS120.51957026_32.04008655_4': 'MZ04江滩办',
}

const warnInfoStore = useWarnInfoStore()

const videoControlOpen = ref(false)

const domHide = ref(true)

const dealtWarnList = computed(() => {
    let res = []
    warnInfoStore.warnInfo_history.map((item) => {
        if (item.ifDealt !== 0) {
            res.push(item)
        }
    })
    // console.log('computed dealt warn', res)
    return res
})

const token = ref(
    'at.5cxvxrig152g1ybj4b67hk5ucv11if4w-7i08g7dedf-1c4h1rt-ns5tf5u9m',
)

const props = defineProps({
    active: {
        type: Boolean,
        default: false,
    },
    domHide: {
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
    speed: 1,
}

let presetParam = {
    deviceSerial: 'FB5033035',
    channelNo: '1',
    index: '1',
}

const functionIndexList = [0, 1, 2, 3, 8, 9, 10, 11]

let curBigVideoIndex = ref(0)

const videoList = ref([
    {
        name: '民主沙海事码头监控',
        position: '32.0316674, 120.5402574',
        deviceId: 'FB5033035',
        // videoUrl: `https://open.ys7.com/ezopen`,
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033035/1.hd.live&autoplay=1&accessToken=`,
        order: 0,
        presetPt: [
            { name: '上游岸段', status: 'normal' },
            { name: '下游岸段', status: 'normal' },
            { name: 'CL-06', status: 'normal' },
            { name: '海事码头', status: 'normal' },
        ],
        warn: false,
    },
    {
        name: '民主沙靖江市江滩办事处外堤监控',
        position: '32.0381061, 120.5263473',
        deviceId: 'FB5033037',
        // videoUrl: `https://open.ys7.com/ezopen`,
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033037/1.live&autoplay=1&accessToken=`,
        order: 1,
        presetPt: [
            { name: '下游岸段', status: 'normal' },
            { name: '上游岸段', status: 'normal' },
            { name: 'CL-04', status: 'normal' },
            { name: '小港池', status: 'normal' },
        ],
        warn: false,
    },
    {
        name: '民主沙上游围堤监控',
        position: '32.0432963, 120.5122242',
        deviceId: 'FB5033036',
        // videoUrl: `https://open.ys7.com/ezopen`,
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033036/1.live&autoplay=1&accessToken=`,
        order: 2,
        presetPt: [
            { name: '下游岸段', status: 'normal' },
            { name: '上游岸段', status: 'normal' },
            { name: 'CL-02', status: 'normal' },
            { name: 'JZ-01', status: 'normal' },
        ],
        warn: false,
    },
])

const focusOn = (index) => {
    ;[
        videoList.value[curBigVideoIndex.value].order,
        videoList.value[index].order,
    ] = [
        videoList.value[index].order,
        videoList.value[curBigVideoIndex.value].order,
    ]
    curBigVideoIndex.value = index
}

const basicVideoFunction = async (functionIndex) => {
    controlParam.deviceSerial = videoList.value[curBigVideoIndex.value].deviceId
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
    presetParam.deviceSerial = videoList.value[curBigVideoIndex.value].deviceId
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
        // console.log(video)
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
    // console.log('back back', res)
}

const toggleVideoControl = () => {
    videoControlOpen.value = !videoControlOpen.value
}

const withdrawDeal = async (warnItem) => {
    if (!warnInfoStore.fake) {
        await BackEndRequest.updateWarnDealtStatus(warnItem.id, 0)
    }

    warnInfoStore.restoreWarn(warnItem)
    warnInfoStore.videoActive = [0, 2]
}

onBeforeMount(async () => {
    await moveBack2Origin()
})

watch(
    () => warnInfoStore.videoActive,
    (newVal, oldVal) => {
        if (oldVal[0] != null) {
            videoList.value[oldVal[0]].warn = false
            if (oldVal[1] != null) {
                videoList.value[oldVal[0]].presetPt[oldVal[1]].status = 'normal'
            }
        }
        if (newVal[0] != null) {
            videoList.value[newVal[0]].warn = true
            if (newVal[1] != null) {
                videoList.value[newVal[0]].presetPt[newVal[1]].status = 'warn'
                move2PresetPoint(newVal[1] + 1)
            }
        } else {
            move2PresetPoint(1)
        }
    },
)

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
    top: 3vh;

    height: 87.5vh;
    width: 27.5vw;

    z-index: 4;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-content: flex-start;
    column-gap: 1vw;
    // row-gap: 1vh;

    backdrop-filter: blur(12px);
    box-shadow: 4px 8px 8px -4px rgb(0, 47, 117);
    background-color: rgba(156, 195, 255, 0.4);
    border-radius: 4px;
    border: 2px solid rgb(28, 105, 247);
    overflow: hidden;

    // transition: all 0.2s ease-in-out;

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
        margin-top: 1vh;
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

            &.warn {
                background-color: red;
                color: #eef3ff;
            }
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

            &[id='0'] {
                background-image: url('/mzsBase-monitor3.png');
            }
            &[id='1'] {
                background-image: url('/mzsBase-monitor2.png');
            }
            &[id='2'] {
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
            order: 2;
        }

        &[id='2'] {
            order: 3;
        }
    }

    div.video-control-opener {
        margin-top: 4vh;
        order: 4;
        height: 3vh;
        line-height: 3vh;
        color: #e3fdff;
        width: 100%;
        justify-content: center;
        border-top: 2px solid blue;

        // padding: 0 0.5vw 0 0.5vw;

        font-size: calc(0.5vw + 0.6vh);

        display: flex;

        div.control-open-text {
            background-color: #001885;

            &:hover {
                cursor: pointer;
                font-weight: bold;
                color: #9df8ff;
            }
        }

        div.tri {
            width: 3vh;
            height: 3vh;
            background: linear-gradient(
                45deg,
                transparent 49%,
                #001885 51%,
                #001885 100%
            );

            &.right {
                background: linear-gradient(
                    -45deg,
                    transparent 49%,
                    #001885 51%,
                    #001885 100%
                );
            }
        }

        &.open {
            div.tri {
                background: linear-gradient(
                    135deg,
                    transparent 49%,
                    #001885 51%,
                    #001885 100%
                );

                &.right {
                    background: linear-gradient(
                        -135deg,
                        transparent 49%,
                        #001885 51%,
                        #001885 100%
                    );
                }
            }

            border-top: none;
        }
    }

    div.video-controller-container {
        order: 5;
        width: 27vw;
        height: 24.5vh;
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
            height: 24.5vh;
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
            height: 22vh;

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
                height: 18vh;
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

                    &.warn {
                        color: #eef3ff;
                        background-color: red;
                        animation: breathing 1s linear infinite;
                        font-weight: bold;
                        @keyframes breathing {
                            0% {
                                transform: scale(1);
                            }

                            50% {
                                transform: scale(0.95);
                            }

                            100% {
                                transform: scale(1);
                            }
                        }
                    }
                }
            }
        }
    }

    div.history-table {
        order: 6;
        width: 27vw;
        height: 24.5vh;
        display: flex;
        flex-flow: column wrap;
        justify-content: flex-start;
        align-content: flex-start;
        column-gap: 0.5vw;
        background-color: #a4cbff94;
        border: 2px solid #001885;
        border-radius: 4px;

        div.history-table-title {
            writing-mode: vertical-lr;
            padding-left: 0.5vw;
            width: 2vw;
            height: 24.5vh;
            font-weight: bold;
            font-size: calc(0.6vw + 0.9vh);
            text-align: center;
            letter-spacing: 0.2rem;
            color: #001885;

            box-shadow: 3px 0px rgb(0, 3, 196);
        }

        div.detail-content-container {
            width: 24vw;
            // height: 32vh;
            height: fit-content;
            margin-top: 0.2vh;
            // margin-left: 1%;
            // padding-left: 2%;
            // padding-right: 2%;
            // background-color: rgb(92, 125, 154);
            border-bottom: 2px solid #0018a3;

            display: flex;
            flex-flow: row wrap;
            justify-content: center;

            // :deep(div.el-descriptions__title) {
            //     font-size: calc(0.6vw + 0.4vh);
            //     color: #021e7a;
            // }

            &.dealt {
                margin-top: 2vh;
            }

            :deep(
                    .el-descriptions__body
                        .el-descriptions__table
                        .el-descriptions__cell
                ) {
                font-size: calc(0.5vw + 0.3vh);
                text-align: center;
                background-color: #0a1e91;
                color: rgba(246, 250, 255, 1);
                // box-shadow: 0 0 0 1px #dbedff inset;

                &.is-bordered-content {
                    text-align: center;
                    font-size: calc(0.5vw + 0.3vh);
                    color: hsl(234, 100%, 15%);
                    box-shadow: 0 0 0 1px #b4a3ff inset;
                    background-color: rgb(238, 248, 255);
                    font-weight: 600;
                }
            }

            div.deal-confirm-buttons {
                height: 5vh;
                width: 100%;

                display: flex;
                flex-flow: row nowrap;

                justify-content: space-around;
                align-items: center;
                margin-top: 1vh;
                padding-bottom: 1vh;

                div.button {
                    width: 15%;
                    height: 4vh;
                    line-height: 4vh;

                    text-align: center;

                    padding: 0 1vw 0 1vw;
                    border-radius: 6px;
                    background-color: #8bbcfc;
                    color: #000f41;
                    font-size: calc(0.6vw + 0.6vh);
                    border: 2px solid black;

                    &:hover {
                        font-weight: bold;
                        color: #ebf3ff;
                        background-color: #00328f;
                        cursor: pointer;
                    }
                }
            }

            div.device-status-row {
                height: 4vh;
                line-height: 4vh;
                width: 100%;
                border-radius: 2px;

                // background-color: #2622fd;

                display: flex;
                flex-flow: row nowrap;
                justify-content: space-around;

                &.head {
                    padding-bottom: 4px;
                }

                div.device-item {
                    width: 28%;
                    height: 4vh;
                    line-height: 4vh;
                    text-align: center;
                    font-size: calc(0.5vw + 0.4vh);
                    border-radius: 2px;

                    background-color: #d2f2ff;
                    font-weight: bold;
                    color: #0237b3;

                    &.device-id {
                        width: 10%;
                    }

                    &.device-name {
                        width: 24%;

                        &.body {
                            font-size: calc(0.5vw + 0.6vh);
                        }
                    }

                    &.device-time {
                        width: 24%;
                        display: flex;
                        flex-flow: row wrap;
                        &.body {
                            line-height: 2vh;
                            font-size: calc(0.3vw + 0.6vh);

                            div {
                                width: 100%;

                                &.up {
                                    color: #5a8bff;
                                }
                            }
                        }
                        justify-content: center;
                    }

                    &.device-place {
                        width: 24%;
                        &.body {
                            font-size: calc(0.45vw + 0.4vh);
                        }
                    }
                    &.device-deal {
                        width: 18%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        div.withdraw-button {
                            height: 3vh;
                            line-height: 3vh;
                            width: fit-content;
                            padding: 0 6% 0 6%;
                            background-color: #0019a5;
                            color: rgb(230, 242, 255);
                            font-weight: normal;
                            border-radius: 4px;
                            font-size: calc(0.5vw + 0.3vh);

                            &:hover {
                                font-weight: bold;
                                cursor: pointer;
                                color: #75faff;
                            }
                        }
                    }

                    &.head {
                        background-color: #2a5fdb;
                        border: 1px solid #aaffff;
                        font-weight: bold;
                        color: #dafdff;
                        box-shadow:
                            rgba(208, 252, 255, 0.6) 0px 2px 4px,
                            rgba(208, 252, 255, 0.4) 0px 7px 13px -3px,
                            rgba(208, 252, 255, 0.3) 0px -3px 0px inset;
                    }

                    box-shadow:
                        rgba(13, 70, 228, 0.6) 0px 2px 4px,
                        rgba(6, 55, 189, 0.4) 0px 7px 13px -3px,
                        rgba(9, 61, 204, 0.3) 0px -3px 0px inset;
                }

                &.no-warn {
                    font-weight: bold;
                    font-size: calc(0.6vw + 0.8vh);
                    background-color: #daeaff;
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

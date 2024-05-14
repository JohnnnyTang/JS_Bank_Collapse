<template>
    <div class="twin-main-container" ref="containerDom">
        <div class="nav-manage-button" @click="navToManage">
            <div class="nav-manage-icon"></div>
            <div class="nav-manage-text">监测详情</div>
            <div class="nav-arrow-icon"></div>
        </div>
        <div class="visual-tab-container">
            <DvBorderBox12 backgroundColor="rgb(0, 32, 100)">
                <e-tab style="z-index: 3; font-size: calc(0.4vw + 0.4vh)" :items="items" :columns="2"></e-tab>
            </DvBorderBox12>
        </div>
        <BankBasicInfoVue />
        <RealtimeStatusVue />
        <div class="realtime-video-container">
            <div class="realtime-video-title">实时视频监控</div>
            <div class="video-box" v-for="(item, index) in videoList" :key="index">
                <div class="video-content">
                    <iframe :src="item.videoUrl + token" width="100%" height="100%" :id="item.name" allowfullscreen>
                    </iframe>
                </div>
                <div class="video-title">{{ item.name }}</div>
            </div>
        </div>
        <!-- <SectionRisk />
        <DeviceWarn /> -->

        <div class="marquee-container">
            <DvBorderBox12 backgroundColor="rgb(0, 32, 100)">
                <div class="marquee-block" ref="marqueeBlockDom" :style="{ animationDuration: animateTime }">
                    <div class="no-warn-block" v-if="warningList.length == 0"
                        style="font-size: calc(0.5vw + 0.7vh); color:#e7f2ff;">
                        {{ `当前无报警信息` }}
                    </div>
                    <div v-else class="warn-block" v-for="(warningString, index) in warningList" :key="index">
                        <div
                            style=" background-size: contain; background-image: url('/icons/warning.png');  width: 3vh; height: 3vh;">
                        </div>
                        <div style=" font-size: calc(0.5vw + 0.7vh); color:#e7f2ff; margin-left: 0.5vw;">
                            {{ warningString }}</div>
                    </div>
                </div>
            </DvBorderBox12>
        </div>

        <div class="monitor-legend-container">
            <div class="monitor-legend-title">监测设备图例</div>
            <div class="monitor-legend-block">
                <div v-for="(item, index) in legendList" :key="index" class="monitor-legend-item">
                    <div class="icon-block" :style="{ backgroundImage: `url(${item.icon})` }"></div>
                    <div class="text-block">
                        <span>{{ item.text1 }}</span>
                        <span style="font-weight: bold;">{{ item.strong }}</span>
                        <span>{{ item.text2 }}</span>
                        <br>
                        <span style="text-align: center; width: 100%; display: block; 
                            text-shadow: #eef3ff 1px 1px, #eef3ff 1px 1px,">
                            {{ item.device }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="map-container" id="map"></div>
    </div>
</template>

<script setup>
import router from '../router'
import { onMounted, ref, onUnmounted, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ETab } from 'e-datav-vue3'
import { BorderBox12 as DvBorderBox12, BorderBox7 as DvBorderBox7 } from '@kjgl77/datav-vue3'
import BankBasicInfoVue from '../components/bankTwin/BankBasicInfo.vue'
import RealtimeStatusVue from '../components/bankTwin/RealtimeStatus.vue'
// import SectionRisk from '../components/bankTwin/SectionRisk.vue'
// import DeviceWarn from '../components/bankTwin/DeviceWarn.vue'
import { mapInit } from '../components/bankManage/mapInit'
import { useMapStore, useWarnInfoStore } from '../store/mapStore'
import dayjs from 'dayjs'

const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
const containerDom = ref(null)
const animateTime = ref('0s')
const marqueeBlockDom = ref()

// mapboxgl.accessToken =
//     'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg'
let map = null
const warnInfoStore = useWarnInfoStore()
const token = ref(
    'at.9muaq1l4dwsnaqkfbhn98qxe10ud6kgw-54xl36oksd-1bmu6o1-pilufj5d3',
)

const items = ref([
    { label: '二维视图', value: 'tab1' },
    { label: '三维视图', value: 'tab2' },
])

const videoList = ref([
    {
        name: '民主沙上游围堤监控',
        position: '32.0432963, 120.5122242',
        // videoUrl: `https://open.ys7.com/ezopen`,
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033036/1.live&autoplay=1&accessToken=`,
    },
    {
        name: '民主沙靖江市江滩办事处外堤监控',
        position: '32.0381061, 120.5263473',
        // videoUrl: `https://open.ys7.com/ezopen`,
        videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033037/1.live&autoplay=1&accessToken=`,
    },
    {
        name: '民主沙海事码头监控',
        position: '32.0316674, 120.5402574',
        // videoUrl: `https://open.ys7.com/ezopen`,
         videoUrl: `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/FB5033035/1.live&autoplay=1&accessToken=`,
    },
])
const warningList = ref([])
const legendList = [
    {
        icon: '/icons/GNSS.png', text1: '土体', strong: '表面位移', text2: '监测', device: 'GNSS'
    },
    {
        icon: '/icons/测斜仪.png', text1: '土体', strong: '内部位移', text2: '监测', device: '测斜仪'
    },
    {
        icon: '/icons/孔隙水压力计.png', text1: '土体', strong: '潜水位', text2: '监测', device: '孔隙水压力计'
    },
    {
        icon: '/icons/应力桩.png', text1: '土体', strong: '应力应变', text2: '监测', device: '应力桩'
    },
]




const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.46957922676836, 32.01001616423072],
            [120.61109640208264, 32.074171362618625],
        ],
        {
            pitch: 32.45,
            duration: 1500,
            // zoom: 8,
        },
    )
}

// const resizeObserver = new ResizeObserver((entries) => {
//     mapFlyToRiver(map)
// })

watch(() => warnInfoStore.warnInfo, (newV, oldV) => {
    updateWarnInfoDesc()
})

const navToManage = () => {
    router.push('/bankManage')
}
const updateWarnInfoDesc = () => {
    const DEVICETYPEMAP = ['GNSS', '应力桩', '水压力计', '测斜仪']
    let warnInfo = warnInfoStore.warnInfo
    let WARN_TEXT = []

    for (let i = 0; i < warnInfo.length; i++) {

        // 报警设备信息
        let deviceId = warnInfo[i].deviceId
        let deviceName = DEVICETYPEMAP[deviceId.slice(-1) - 1]
        let warnTime = dayjs(warnInfo[i].warnTime).format('M月D日H时m分s秒');
        let threeDiff = warnInfo[i].threeDiff.toFixed(3)

        let warnString = `警告：${deviceName}(${deviceId})于${warnTime}土体表面累计位移${threeDiff}mm
        ！`
        WARN_TEXT.push(warnString)
    }
    warningList.value = WARN_TEXT

    const marqueeBlockWidth = marqueeBlockDom.value.offsetWidth
    animateTime.value = `${marqueeBlockWidth}s`
}

onMounted(async () => {
    map = new mapboxgl.Map({
        container: 'map', // container ID
        accessToken:
            'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg',
        style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
        center: [120.542, 32.036], // starting position [lng, lat]
        zoom: 8, // starting zoom
        bounds: [
            [114.36611654985586, 30.55501729652339],
            [124.5709218840081, 35.31358005439914],
        ],
    })
    map.on('load', async () => {
        // console.log('map loaded!!!')
        mapFlyToRiver(map)
        useMapStore().setMap(map)
        map.addSource('ptVector', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/placeLabel/{x}/{y}/{z}'],
        })
        await mapInit(map, true)
        map.addLayer({
            id: '点1',
            type: 'symbol',
            source: 'ptVector',
            'source-layer': 'default',
            layout: {
                'text-field': ['get', 'label'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                // 'text-font':['Open Sans Bold','Arial Unicode MS Bold'],
                // 'text-offset': [0, 1.25],
                'text-anchor': 'left',
                'text-size': 20,
            },
            paint: {
                'text-color': 'rgb(0, 42, 105)',
            },
        })

        // map.on('click', (e) => {
        //     console.log(map.queryRenderedFeatures([e.point.x, e.point.y]))

        // })

        // resizeObserver.observe(containerDom.value)
    })

    // const videoAccessKey = (await axios.post(
    //     'https://open.ys7.com/api/lapp/token/get?appKey=d228a2fab09d4c879b4449c356bbd90d&appSecret=0c46042ef59aed43c4eddbb80d637369',
    // )).data
    // console.log('res', videoAccessKey)
    // if (videoAccessKey.data.accessToken) {
    //     console.log('get key')
    //     token.value = videoAccessKey.data.accessToken
    // }
})

onUnmounted(() => {
    // resizeObserver.disconnect()
    // resizeObserver.unobserve(containerDom.value)
    console.log('onUnmounted')
    map && map.remove()
    console.log('map.remove')
})
</script>

<style lang="scss" scoped>
div.twin-main-container {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    left: 0;
    overflow: hidden;

    background-color: rgb(100, 154, 202);

    div.nav-manage-button {
        position: absolute;
        right: 0;
        top: 2vh;

        width: 10vw;
        height: 6vh;
        background-color: rgb(0, 42, 105);
        transition: all 0.4s cubic-bezier(0.68, -0.15, 0.265, 1.15);
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;

        display: flex;
        flex-flow: row nowrap;
        overflow: hidden;
        z-index: 3;

        &:hover {
            cursor: pointer;

            div.nav-arrow-icon {
                width: 2.4vw;
            }
        }

        div.nav-manage-icon {
            width: 2.6vw;
            height: 6vh;
            flex-shrink: 0;

            background-image: url('/dashboard.png');
            background-size: 100%;
            background-position: 50% 50%;
            background-repeat: no-repeat;
        }

        div.nav-manage-text {
            width: 5vw;
            height: 6vh;
            line-height: 6vh;
            text-align: center;

            font-size: calc(0.75vw + 0.4vh);
            font-weight: bold;
            color: rgba(32, 75, 116, 0.4);
            color: rgb(140, 255, 255);
        }

        div.nav-arrow-icon {
            width: 2vw;
            height: 6vh;
            flex-shrink: 0;

            background-image: url('/right-arrow.png');
            background-size: 100%;
            background-position: 50% 50%;
            background-repeat: no-repeat;
            transition: all 0.2s cubic-bezier(0.68, -0.15, 0.265, 1.15);
        }
    }

    div.map-container {
        position: absolute;
        width: 100vw;
        height: 92vh;
        top: 0;
        left: 0;
        z-index: 2;
    }

    div.visual-tab-container {
        position: absolute;
        top: 2vh;
        right: 15vw;

        width: 10vw;
        height: 6vh;
        z-index: 3;
        border-radius: 10px;

        font-size: calc(0.6vw + 0.4vh);
        background-color: rgb(0, 56, 141);
        box-shadow: 4px 8px 8px -4px rgba(0, 11, 34, 0.9);
        // background-color: antiquewhite;
    }

    div.realtime-video-container {
        position: absolute;
        right: 1vw;
        top: 9vh;

        height: 82vh;
        width: 24vw;

        z-index: 4;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;

        backdrop-filter: blur(12px);
        box-shadow: 4px 8px 8px -4px rgb(0, 47, 117);
        background-color: rgba(156, 195, 255, 0.4);
        border-radius: 4px;
        border: 2px solid rgb(28, 105, 247);

        div.realtime-video-title {
            height: 4vh;
            line-height: 4vh;
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
            width: 23vw;
            margin-left: 0.5vw;
            height: 25vh;

            background-color: rgba(3, 63, 173, 1);

            div.video-content {
                height: 22vh;
                width: 23vw;

                background-color: rgb(34, 75, 165);
            }

            div.video-title {
                line-height: 3vh;
                height: 3vh;
                text-align: center;

                font-weight: bold;
                font-size: calc(0.6vw + 0.6vh);
                color: #eef3ff;
            }
        }
    }


    div.marquee-container {
        position: absolute;
        left: 28vw;
        top: 2vh;
        width: 44vw;
        height: 5vh;
        // background-color: rgb(0, 75, 249);
        z-index: 4;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;

        :deep(.border-box-content) {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 95%;
            overflow: hidden;
            transform: translateX(2.5%);

            div.marquee-block {
                display: flex;
                flex-direction: row;
                white-space: nowrap;
                justify-content: flex-start;
                // animation: marquee 15s linear infinite;
                animation-name: marquee;
                animation-duration: 0s;
                animation-timing-function: linear;
                animation-iteration-count: infinite;

                div.warn-block {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    width: fit-content;
                    margin-right: 1vw;
                }

                div.no-warn-block {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    width: fit-content;
                }


            }
        }

    }

    div.monitor-legend-container {
        position: absolute;
        bottom: 1vh;
        left: 27vw;
        width: 46vw;
        height: 10vh;

        z-index: 4;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;

        backdrop-filter: blur(12px);
        box-shadow: 4px 8px 8px -4px rgb(0, 47, 117);
        background-color: rgba(156, 195, 255, 0.4);
        border-radius: 4px;
        border: 2px solid rgb(28, 105, 247);

        div.monitor-legend-title {
            position: absolute;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            top: 0vh;
            height: 4vh;
            line-height: 4vh;
            text-align: center;

            background-color: rgb(4, 70, 168);
            color: rgb(212, 255, 253);

            font-size: calc(0.8vw + 0.8vh);
            font-weight: bold;
            letter-spacing: 0.2rem;
            padding-left: 0.5vw;
            padding-right: 0.5vw;
        }


        div.monitor-legend-block {
            position: relative;
            width: 46vw;
            height: 7vh;
            margin-top: 2vh;
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            align-items: center;

            div.monitor-legend-item {
                display: flex;
                flex-direction: row;
                justify-content: space-evenly;
                align-items: center;
                width: 10vw;
                height: 6vh;
                border: #0400fd 1px solid;
                box-shadow: inset 5px 5px 5px #478bf2bc, inset -5px -5px 5px #478bf2bc;
                // box-shadow: inset 5px 5px 5px #0400fd, inset -5px -5px 5px #0400fd;

                border-radius: 5%;

                div.icon-block {
                    position: relative;
                    width: 3vh;
                    height: 3vh;
                    background-size: contain;
                    background-repeat: no-repeat;
                    margin-right: 0.2vw;
                    margin-left: 0.2vw;
                }

                div.text-block {
                    font-size: calc(0.6vw + 0.4vh);
                    font-weight: 400;
                    color: rgb(32, 15, 248);
                }
            }
        }

    }



    /* 根据需要调整动画的持续时间 */
}

:deep(.iEdpB) {
    font-size: calc(0.4vw + 0.4vh);
}

:deep(.active.active .iEdpB) {
    color: rgb(198, 244, 255);
    font-weight: bold;
}

:deep(.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip) {
    display: none;
}

:deep(.mapboxgl-popup-tip) {
    border: none;
}

:deep(.mapboxgl-popup-content) {
    background: none;
    border: none;
    box-shadow: none;
    padding: 0;
}

:deep(.mapboxgl-popup-close-button) {
    right: 5px;
    top: 5px;
    border: none;
    display: none;
}

:deep(.el-overlay) {
    background-color: none;
}

@keyframes marquee {
    0% {
        transform: translateX(0%);
    }

    100% {
        transform: translateX(-50%);
    }
}
</style>

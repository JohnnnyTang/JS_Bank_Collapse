<template>
    <div class="basic-page-container" ref="containerDom">
        <div class="desc-box-container">
            <div class="title-container">民主沙右缘-基础信息</div>
            <div class="detail-content-container">
                <div
                    class="detail-box-item"
                    v-for="(item, index) in mzsInfo"
                    :key="index"
                    :class="item.type"
                >
                    <div class="detail-key">{{ item.key }}</div>
                    <div class="detail-val" v-if="changeStatus">
                        <el-input
                            v-model="item.val"
                            style="
                                width: 100%;
                                height: 100%;
                                font-size: calc(0.6vw + 0.6vh);
                            "
                            placeholder="Please input"
                            :type="
                                item.type.includes('long-text')
                                    ? 'textarea'
                                    : 'text'
                            "
                            :autosize="{ minRows: 4, maxRows: 6 }"
                        />
                    </div>
                    <div
                        class="detail-val"
                        v-else-if="item.type.includes('two-row')"
                    >
                        <div class="detail-val-row">
                            {{ item.val.split(item.splitter)[0] }}
                        </div>
                        <div class="detail-val-row">
                            {{ item.val.split(item.splitter)[1] }}
                        </div>
                    </div>
                    <div class="detail-val" v-else>{{ item.val }}</div>
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
        </div>
        <div class="map-view-container view-box" id="map-container"></div>
        <div class="pic-view-container view-box">
            <el-carousel height="44.5vh" arrow="always">
                <el-carousel-item v-for="item in 4" :key="item">
                    <el-image
                        style="width: 100%; height: 100%"
                        :src="imgUrlList[item - 1]"
                        fit="cover"
                    />
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ref, onMounted, onUnmounted } from 'vue'
import {mapInit} from './mapInit'

const defaultVal = [
    { key: '预警级别', val: 'Ⅰ级', type: ['half', 'left'] },
    {
        key: '坐标桩号',
        val: '3522404.48,357836.15 3527568.32,359415.63',
        type: ['half', 'two-row', 'right'],
        splitter: ' ',
    },
    {
        key: '情况介绍',
        val: '民主沙右缘位于长江澄通河段，分属泰州市的靖江市和南通市的如皋市，是水利部长江委、省市县的Ⅰ级预警岸段。近年民主沙南侧的浏海沙水道深槽坐弯、深泓左偏，致来民主沙右缘持续冲退，影响局部河势稳定。同时民主沙为张皋过江通道拟建桥址所在地。',
        type: ['single', 'long-text'],
    },
    {
        key: '管理单位',
        val: '靖江市水利局/如皋市水利局',
        type: ['half', 'left'],
    },
    {
        key: '管理单位联系方式',
        val: 'xxxxxxxxxxx',
        type: ['half', 'right'],
    },
]

const mzsInfo = ref([
    { key: '预警级别', val: 'Ⅰ级', type: ['half', 'left'] },
    {
        key: '坐标桩号',
        val: '3522404.48,357836.15 3527568.32,359415.63',
        type: ['half', 'two-row', 'right'],
        splitter: ' ',
    },
    {
        key: '情况介绍',
        val: '民主沙右缘位于长江澄通河段，分属泰州市的靖江市和南通市的如皋市，是水利部长江委、省市县的Ⅰ级预警岸段。近年民主沙南侧的浏海沙水道深槽坐弯、深泓左偏，致来民主沙右缘持续冲退，影响局部河势稳定。同时民主沙为张皋过江通道拟建桥址所在地。',
        type: ['single', 'long-text'],
    },
    {
        key: '管理单位',
        val: '靖江市水利局/如皋市水利局',
        type: ['half', 'left'],
    },
    {
        key: '管理单位联系方式',
        val: 'xxxxxxxxxxx',
        type: ['half', 'right'],
    },
])

const imgUrlList = ref(['/mzs-1.png', '/mzs-2.png', '/mzs-3.png', '/mzs-4.png'])

const changeStatus = ref(false)

const modifyData = () => {
    if (changeStatus.value) {
    } else {
    }
    changeStatus.value = !changeStatus.value
}

const cancelClick = () => {
    mzsInfo.value = defaultVal;
    changeStatus.value = false
}

const containerDom = ref(null)
// mapboxgl.accessToken =
//     'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg'

let map = null

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.48987922676836, 32.03501616423072],
            [120.59089640208264, 32.050171362618625],
        ],
        {
            // pitch: 52.45,
            duration: 1500,
            // zoom: 8,
        },
    )
}

const resizeObserver = new ResizeObserver((entries) => {
    mapFlyToRiver(map)
})

onMounted(() => {
    map = new mapboxgl.Map({
        container: 'map-container', // container ID
        style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
        center: [120.542, 32.036], // starting position [lng, lat]
        zoom: 8, // starting zoom
        bounds: [
            [114.36611654985586, 30.55501729652339],
            [124.5709218840081, 35.31358005439914],
        ],
    })
    map.on('load', () => {
        // console.log('map loaded!!!')
        mapFlyToRiver(map)

        resizeObserver.observe(containerDom.value)

        mapInit(map, false)
    })
})

onUnmounted(() => {
    resizeObserver.disconnect()
    // resizeObserver.unobserve(containerDom.value)
    console.log('onUnmounted')
    map && map.remove()
    console.log('map.remove')
})
</script>

<style lang="scss" scoped>
div.basic-page-container {
    position: absolute;
    left: 12vw;
    top: 0vh;

    width: 88vw;
    height: 93vh;

    // background-color: rgb(176, 239, 255);

    display: flex;
    flex-flow: column wrap;
    overflow: hidden;

    div.desc-box-container {
        width: 43vw;
        height: 90vh;

        margin-top: 1vh;
        margin-bottom: 1vh;
        margin-left: 0.5vw;
        margin-right: 0.5vw;

        background-color: aliceblue;
        border: 2px solid #7aa8ff;

        border-radius: 12px;

        box-shadow: 10px 12px 20px -10px rgba(0, 0, 0, 0.8);

        overflow: hidden;

        div.title-container {
            width: 42vw;
            height: 7vh;
            margin-left: 0.5vw;

            line-height: 7vh;

            text-align: center;

            font-size: calc(1vw + 1vh);
            font-weight: bold;

            border-bottom: 4px solid #0040a0;
            color: #001d7a;
        }

        div.detail-content-container {
            width: 38vw;
            margin-left: 2.5vw;
            // padding-right: 0.5vw;
            height: calc(83vh - 4px);

            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            align-content: flex-start;
            row-gap: 3vh;

            div.detail-box-item {
                width: 19vw;
                height: 16vh;
                font-size: calc(0.8vw + 0.8vh);
                border-bottom: 3px solid rgb(31, 123, 209);

                div.detail-key {
                    height: 8vh;
                    line-height: 8vh;
                    font-weight: bold;
                    font-size: calc(0.8vw + 1vh);
                    color: #002397;
                }

                div.detail-val {
                    height: 8vh;
                    line-height: 8vh;

                    div.detail-val-row {
                        height: 4vh;
                        line-height: 4vh;
                    }
                }

                &.single {
                    width: 38vw;
                }

                &.long-text {
                    height: 24vh;
                    div.detail-val {
                        line-height: normal;
                        height: 16vh;
                    }
                }

                &.left {
                    text-align: left;
                }

                &.right {
                    text-align: right;
                }
            }

            div.change-button-container {
                position: relative;
                width: 8vw;
                height: 4vh;
                top: 2vh;
                left: 30vw;

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

            // background-color: antiquewhite;
        }
    }

    div.view-box {
        width: 43vw;
        height: 44.5vh;

        margin-top: 0.5vh;
        margin-bottom: 0.5vh;
        margin-left: 0.5vw;
        margin-right: 0.5vw;

        background-color: antiquewhite;
        border-radius: 12px;
        overflow: hidden;

        box-shadow: 12px 8px 20px -10px rgba(0, 0, 0, 0.8);

        &.map-view-container {
            margin-top: 1vh;
        }

        &.pic-view-container {
        }
    }
}


</style>

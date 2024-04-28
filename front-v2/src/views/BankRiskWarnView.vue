<template>
    <div class="risk-warn-container">
        <div class="map-container" id="map"></div>
        <div class="scene-select-container">
            <div class="scene-select-title">专题崩岸风险计算</div>
            <div class="risk-scene-content">
                <RiskSceneCard
                    v-for="(item, index) in sceneCardInfoList"
                    :key="index"
                    :name="item.name"
                    :year="item.year"
                    :time-string="item.createTime"
                />
            </div>
        </div>
        <SectionStable />
        <div class="nav-manage-button" @click="navToManage">
            <div class="nav-manage-icon"></div>
            <div class="nav-manage-text">自定义风险计算</div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import SectionStable from '../components/bankTwin/SectionStable.vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import RiskSceneCard from '../components/bankRisk/RiskSceneCard.vue'
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER

let map = null

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [120.46987922676836, 32.03201616423072],
            [120.61089640208264, 32.052171362618625],
        ],
        {
            pitch: 52.45,
            duration: 1500,
            // zoom: 8,
        },
    )
}

const sceneCardInfoList = ref([
    { name: '民主沙右缘预警岸段', year: '2023', createTime: '2024年4月10日' },
    { name: '民主沙右缘预警岸段', year: '2019', createTime: '2024年4月16日' },
])

const sectionPaint = {
    default: {
        'fill-color': [
            'match',
            ['get', 'stability'],
            '较稳定',
            '#18b915',
            '稳定',
            '#06bef1',
            '不稳定',
            '#df8105',
            '较不稳定',
            '#ee3603',
            '#18b915',
        ],
    },
    2019: {
        'fill-color': [
            'match',
            ['get', 'stability_2019'],
            '较稳定',
            '#18b915',
            '稳定',
            '#06bef1',
            '不稳定',
            '#df8105',
            '较不稳定',
            '#ee3603',
            '#18b915',
        ],
    },
}

onMounted(() => {
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
        map.addSource('mzsPlaceLabelSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsPlaceLabel/{x}/{y}/{z}'],
        })
        map.addSource('mzsPlaceLineSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsPlaceLine/{x}/{y}/{z}'],
        })
        map.addSource('mzsBankAreaSSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsBankAreaS/{x}/{y}/{z}'],
        })
        map.addSource('mzsBankLineSource', {
            type: 'vector',
            tiles: [tileServer + '/tile/vector/mzsBankLine/{x}/{y}/{z}'],
        })
        map.addLayer({
            id: 'mzsLine',
            type: 'line',
            source: 'mzsPlaceLineSource',
            'source-layer': 'default',
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-opacity': 1,
                'line-color': 'rgba(26, 87, 138, 0.6)',
                'line-width': 2,
            },
        })
        map.addLayer({
            id: 'mzsLabel',
            type: 'symbol',
            source: 'mzsPlaceLabelSource',
            'source-layer': 'default',
            layout: {
                'text-field': ['get', 'label'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                // 'text-offset': [0, 1.25],
                'text-anchor': 'left',
            },
            paint: {
                'text-color': 'rgba(31, 14, 126, 0.75)',
            },
        })
        map.addLayer({
            id: 'mzsSectionArea1',
            type: 'fill',
            source: 'mzsBankAreaSSource',
            'source-layer': 'default',
            paint: sectionPaint.default,
        })
        map.addLayer({
            id: 'mzsBankLine',
            type: 'line',
            source: 'mzsBankLineSource',
            'source-layer': 'default',
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
            paint: {
                'line-opacity': 1,
                'line-color': 'rgba(31, 14, 223, 0.5)',
                'line-width': 4,
            },
        })
        // map.on('click', (e) => {
        //     console.log(map.queryRenderedFeatures([e.point.x, e.point.y]))

        // })
    })
})
</script>

<style lang="scss" scoped>
div.risk-warn-container {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    left: 0;

    background: rgb(68, 105, 138);

    div.map-container {
        width: 100vw;
        height: 92vh;

        background-color: antiquewhite;
    }

    div.scene-select-container {
        position: absolute;
        left: 1vw;
        top: 4vh;

        width: 24vw;
        height: 84vh;
        background-color: rgba(213, 235, 255, 0.6);
        backdrop-filter: blur(8px);
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid #002a69;

        div.scene-select-title {
            height: 6vh;
            line-height: 6vh;
            width: 24vw;

            background-color: rgb(16, 97, 173);
            text-align: center;
            font-size: calc(0.9vw + 0.9vh);
            font-weight: bold;
            color: aliceblue;

            border-bottom: 3px solid #00e1ff;
        }

        div.risk-scene-content {
            height: 70vh;
            width: 24vw;

            // background-color: #00e1ff;
        }
    }

    div.nav-manage-button {
        position: absolute;
        right: 0;
        top: 2vh;

        width: 6vh;
        height: 6vh;
        background-color: rgb(0, 42, 105);
        transition: all 0.4s cubic-bezier(0.68, -0.15, 0.265, 1.15);
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;

        display: flex;
        flex-flow: row nowrap;
        overflow: hidden;
        z-index: 3;

        &:hover {
            width: 24vh;
            cursor: pointer;
        }

        div.nav-manage-icon {
            width: 6vh;
            height: 6vh;
            flex-shrink: 0;

            background-image: url('/settings.png');
            background-size: 75%;
            background-position: 50% 50%;
            background-repeat: no-repeat;
        }

        div.nav-manage-text {
            width: 18vh;
            height: 6vh;
            line-height: 6vh;
            text-align: center;

            font-size: calc(0.9vw + 0.4vh);
            font-weight: bold;
            color: rgba(32, 75, 116, 0.4);
            color: rgb(140, 255, 255);
        }
    }
}
</style>

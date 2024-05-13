<template>
    <div class="twin-main-container" ref="containerDom">
        <div class="nav-manage-button" @click="navToManage">
            <div class="nav-manage-icon"></div>
            <div class="nav-manage-text">监测详情</div>
        </div>
        <div class="visual-tab-container">
            <DvBorderBox12 backgroundColor="rgb(0, 32, 100)">
                <e-tab style="z-index: 3; font-size: calc(0.4vw + 0.4vh)" :items="items" :columns="2"></e-tab>
            </DvBorderBox12>
        </div>
        <BankBasicInfoVue />
        <RealtimeStatusVue />
        <SectionRisk />
        <DeviceWarn />
        <div class="map-container" id="map"></div>
    </div>
</template>

<script setup>
import router from '../router'
import { onMounted, ref, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ETab } from 'e-datav-vue3'
import { BorderBox12 as DvBorderBox12 } from '@kjgl77/datav-vue3'
import BankBasicInfoVue from '../components/bankTwin/BankBasicInfo.vue'
import RealtimeStatusVue from '../components/bankTwin/RealtimeStatus.vue'
import SectionRisk from '../components/bankTwin/SectionRisk.vue'
import DeviceWarn from '../components/bankTwin/DeviceWarn.vue'
import { mapInit } from '../components/bankManage/mapInit'
import { useMapStore } from '../store/mapStore'
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
const containerDom = ref(null)
// mapboxgl.accessToken =
//     'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg'
let map = null

const items = ref([
    { label: '二维视图', value: 'tab1' },
    { label: '三维视图', value: 'tab2' },
])

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

// const resizeObserver = new ResizeObserver((entries) => {
//     mapFlyToRiver(map)
// })

const navToManage = () => {
    router.push('/bankManage')
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
        useMapStore().setMap(map)
        map.addSource('ptVector', {
            type: 'vector',
            tiles: [
                tileServer+'/tile/vector/placeLabel/{x}/{y}/{z}',
            ],
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

    background-color: rgb(100, 154, 202);

    div.nav-manage-button {
        position: absolute;
        right: 0;
        top: 2vh;

        width: 16vh;
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
            width: 10vh;
            height: 6vh;
            line-height: 6vh;
            text-align: center;

            font-size: calc(0.9vw + 0.4vh);
            font-weight: bold;
            color: rgba(32, 75, 116, 0.4);
            color: rgb(140, 255, 255);
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
        right: 19vh;

        width: 10vw;
        height: 6vh;
        z-index: 3;
        border-radius: 10px;

        font-size: calc(0.6vw + 0.4vh);
        background-color: rgb(0, 56, 141);
        box-shadow: 4px 8px 8px -4px rgba(0, 11, 34, 0.9);
        // background-color: antiquewhite;
    }
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
:deep(.mapboxgl-popup-content){
    background:none;
    border: none;
    box-shadow: none;
    padding: 0;
}
:deep(.mapboxgl-popup-close-button){
    right: 5px;
    top: 5px;
    border: none;
}

:deep(.el-overlay){
    background-color: none;
}
</style>

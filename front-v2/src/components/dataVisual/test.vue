<template>
    <div class="main">
        <div class="map" ref="mapRef"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import mapboxgl from "mapbox-gl"

const thresholdParmas = reactive({
    "Zb": [0, 0, 0],
    "Sa": [0, 0, 0],
    "Ln": [0, 0, 0],
    "PQ": [0, 0, 0],
    "Ky": [0, 0, 0],
    "Zd": [0, 0, 0],
    "Dsed": [0, 0, 0],
    "all": [0, 0, 0],
    "wNM": [0, 0, 0],
    "wRE": [0, 0, 0],
    "wGE": [0, 0, 0],
    "wRL": [0, 0, 0],
})

// threshold template
const json = {
    "Zb": [20, 30, 40],
    "Sa": [0.2, 0.3, 0.5],
    "Ln": [0.04, 0.12, 0.20],
    "PQ": [0.5, 1.0, 2.3],
    "Ky": [1.7, 1.35, 1.0],
    "Zd": [0.1, 0.15, 0.3],
    "Dsed": [0.7, 1.0, 1.5],
    "all": [0.25, 0.50, 0.75],
    "wNM": [0.43, 0.32, 0.25],
    "wRE": [0.48, 0.16, 0.36],
    "wGE": [0.6, 0.2, 0.2],
    "wRL": [0.32, 0.43, 0.25]
}

const mapRef = ref(null)

onMounted(async () => {

     const map = new mapboxgl.Map({
        container: mapRef.value, // container ID
        accessToken:
            'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg',
        style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
        center: [120.312, 31.917], // starting position [lng, lat]
        zoom: 8,
        maxZoom: 22,
        projection: 'mercator',
        antialias: true,
        transformRequest: (url) => {
            if (url.startsWith(import.meta.env.VITE_APP_BACK_ADDRESS)) {
                return {
                    url: url,
                    headers: { token: localStorage.getItem("token") },
                };
            }
        },

    }).on('load', async () => {
        map.showTileBoundaries = true;
        console.log('PureScratchMap init!')

        let tileInfo = {
            "name": "199901",
            "bank": "Mzs"
        }
        const tileServer = import.meta.env.VITE_MAP_TILE_SERVER

//         map.addSource('mapRaster2020', {
//             type: 'raster',
//             tiles: [
//                 tileServer + '/tile/raster/mzs/2020/Before/{x}/{y}/{z}',
//             ],
//             // tileSize: 1024,
//             // minzoom: 10,
//             // maxzoom: 20,
//             // bounds: [120.509, 32.023, 120.555, 32.0402],
//         })
//         map.addLayer({
//             id: 'ras',
//             type: 'raster',
//             source: 'mapRaster2020',
//         })
         map.addSource('demTile', {
             type: 'raster',
             tiles: [tileServer + '/tile/raster/dem/Mzs/199901/{x}/{y}/{z}'],
//              tileSize: 1024,
//              minzoom: 10,
//              maxzoom: 20,
//              bounds: [120.509, 32.023, 120.555, 32.0402],
         })
         map.addLayer({
             id: 'ras',
             type: 'raster',
             source: 'demTile',
        })

    })
    
    const res = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(json)
        }, 500)
    })
    const json2params = (res) => {
        for (let key in res) {
            if (res.hasOwnProperty(key)) {
                thresholdParmas[key] = res[key]
            }
        }
    }
    json2params(res)

    window.addEventListener('keydown', (e) => {
        if (e.key === 'b') {
            console.log(thresholdParmas)
        }
    })

})
</script>

<style lang="scss" scoped>
.main {
    position: absolute;
    width: 100vw;
    height: 92vh;
    display: flex;
    align-items: center;
    justify-content: center;

    .map {
        width: 100%;
        height: 100%;
    }


}
</style>
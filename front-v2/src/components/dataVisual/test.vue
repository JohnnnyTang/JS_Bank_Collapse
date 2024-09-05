<template>
    <div class="main">
        <div ref="mapRef" id="map"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
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
            if (url.startsWith(import.meta.env.VITE_APP_TEMP_ADDRESS)) {
                return {
                    url: url,
                    headers: { token: localStorage.getItem("token") },
                };
            }
        },

    }).on('load', async () => {
        console.log('PureScratchMap init!')

        let tileInfo = {
            "name": "199901",
            "bank": "Mzs"
        }
        const tileServer = import.meta.env.VITE_APP_TEMP_ADDRESS

        map.addSource('mapRaster2020', {
            type: 'raster',
            tiles: [
                tileServer + '/tile/raster/mzs/2020/Before/{x}/{y}/{z}',
            ],
            // tileSize: 1024,
            // minzoom: 10,
            // maxzoom: 20,
            // bounds: [120.509, 32.023, 120.555, 32.0402],
        })
        // map.addLayer({
        //     id: 'ras',
        //     type: 'raster',
        //     source: 'mapRaster2020',
        // })

        map.addSource('demTile', {
            type: 'raster',
            tiles: [tileServer + '/tile/raster/dem/Mzs/199901/{x}/{y}/{z}'],
            tileSize: 1024,
            minzoom: 10,
            maxzoom: 20,
            bounds: [120.509, 32.023, 120.555, 32.0402],
        })
        map.addLayer({
            id: 'ras',
            type: 'raster',
            source: 'demTile',
            paint: {
                'raster-opacity': 1.0,
            }
        })

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

    #map {
        width: 100%;
        height: 100%;
    }

}
</style>
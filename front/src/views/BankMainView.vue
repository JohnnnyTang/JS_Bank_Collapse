<template>
    <div class="bankMain-container">
        <div class="map-container" id="map"></div>
    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { onMounted } from 'vue';
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg';

const mapFlyToRiver = (map) => {
    map.fitBounds([[119.34643582916999, 30.990467310895838], [121.09492087941601, 32.80937651942584]], {
        pitch: 49.45,
        duration: 800,
        // zoom:8.8
    });
}


onMounted(() => {
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/johnnyt/clrldnfyk001f01q2092ndx2y', // style URL
        center: [120.312, 31.917], // starting position [lng, lat]
        zoom: 8.4, // starting zoom
        // pitch: 49.45,
        bounds: [[114.36611654985586, 30.55501729652339], [124.5709218840081, 35.31358005439914]],
    });
    map.on('load', () => {
        console.log("loaded")
        mapFlyToRiver(map);

        // map.on('move', () => {
        //     console.log(map.getBounds());
        // })
        window.onresize = () => {
            mapFlyToRiver(map);
        }
    })

})

</script>

<style lang="scss" scoped>
div.bankMain-container {
    height: 93vh;
    width: 100vw;
    background-color: rgb(24, 24, 24);

    div.map-container {
        height: 93vh;
        width: 100vw;
        background-color: rgb(22, 22, 22);
    }
}
</style>
<template>
    <div class="main">
        <!-- <totalController></totalController> -->
        <div class="map" ref="mapDom"></div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch, createApp } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios';
// import totalController from './common/totalController.vue';
import { initLoadedMap } from '../../utils/mapUtils';
import { layerAddFunctionMap } from './layerUtil';



const mapDom = ref()
const tileServer = import.meta.env.VITE_MAP_TILE_SERVER
onMounted(async () => {
    // const map = await initLoadedMap(mapDom)
    let map = new mapboxgl.Map({
        container: mapDom.value,
        accessToken:
            'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg',
        style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
        bounds: [
            [120.48987922676836, 32.03501616423072],
            [120.59089640208264, 32.050171362618625],
        ],
    }).on('load', async () => {
        console.log('map loaded!');
        map.addSource('earthquakes', {
            type: 'vector',
            tiles: [
                'http://127.0.0.1:3001/tile/testPoint/{x}/{y}/{z}'
            ],

            // type: 'geojson',
            // data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
            // cluster: true,
            // clusterMaxZoom: 14, // Max zoom to cluster points on
            // clusterRadius: 25,
        })
        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'earthquakes',
            'source-layer': 'default',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#ff0000',
                'circle-radius': 4,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            }
        });

        await layerAddFunctionMap['GNSS'](map)
        await layerAddFunctionMap['测斜仪'](map)
        await layerAddFunctionMap['孔隙水压力计'](map)
        await layerAddFunctionMap['应力桩'](map)







        window.addEventListener('keydown', (e) => {
            if (e.key == '1') {
                // const queryResult = map.querySourceFeatures('earthquakes', {
                //     sourceLayer: 'default',
                // });
                // console.log('query!', queryResult);

                // 1
                const queryResult1 = map.querySourceFeatures('gnss-source')
                test(queryResult1)
                console.log('gnss query!', queryResult1);

                // 2
                const queryResult2 = map.queryRenderedFeatures(undefined, {
                    layers: ['GNSS']
                })
                console.log('gnss query!', queryResult2);
                test(queryResult2)

                // 3
                const queryResult = map.getSource('gnss-source')
                // test(queryResult)
                console.log('gnss query!', queryResult);

                // const earthquakes = map.getSource('earthquakes')
                // console.log('second!',earthquakes);
            }
            else if (e.key == '2') {
                const queryResult = map.querySourceFeatures('incline-source')
                test(queryResult)
                console.log('incline query!', queryResult);
            }
            else if (e.key == '3') {
                const queryResult = map.querySourceFeatures('manometer-source')
                test(queryResult)
                console.log('manometer query!', queryResult);
            }
            else if (e.key == '4') {
                const queryResult = map.querySourceFeatures('stress-source')
                test(queryResult)
                console.log('stress query!', queryResult);
            }

        })
    })
    // console.log(layerTree);
    // await layerAddFunctionMap['地形瓦片'](map)
    // let features = map.querySourceFeatures('river-terrain-source')
    // console.log(features);

});



const test = (data) => {

    let arr = []
    data.forEach((item) => {
        let type = item.properties['type']
        if (type == '1') {
            if (arr.includes(item.properties['code'])) {
                console.log('same');
            } else {
                arr.push(item.properties['code'])
            }
        }
    })
    console.log('valid num ', arr);

}



</script>

<style lang="scss" scoped>
.main {
    position: absolute;
    width: 100vw;
    height: 92vh;




}

:deep(.el-tree-node__label) {
    font-size: calc(0.6vw + 0.7vh);
}

:deep(.el-tree-node__content) {
    padding: 0.5vh;
}

:deep(.el-tree) {
    background-color: rgba($color: #000000, $alpha: 0.0);
}



.map {
    position: absolute;
    width: 100vw;
    height: 92vh;
}
</style>
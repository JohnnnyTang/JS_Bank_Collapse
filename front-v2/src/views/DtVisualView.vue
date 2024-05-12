<template>
    <div class="data-visual-container">
        <div class="sideBar">
            <sideBar></sideBar>
        </div>
        <div class="mapBase">
            <div ref="mapContainer" id="map"></div>
            <canvas id="GPUFrame"></canvas>
        </div>
        <div class="tools-container">
            <div class="icon-container" v-for="i in 4">
                <div class="icon" :style="styles[i - 1]" @click="toolClick(i - 1)"
                    :class="{ 'active': activeStatus[i - 1] }">
                </div>
            </div>
        </div>


        <div class="search-pos" v-show="activeStatus[0]" v-draggable="{ bounds: 'body', cancel: 'div.content' }">
            <featSearch @close="closeHandler"></featSearch>
        </div>
        <div class="layer-pos" v-show="activeStatus[1]" v-draggable="{ bounds: 'body', cancel: 'div.content' }">
            <layerCtrl @close="closeHandler"></layerCtrl>
        </div>
        <div class="legend-pos" v-show="activeStatus[2]" v-draggable="{ bounds: 'body', cancel: 'div.content' }">
            <mapLegend @close="closeHandler"></mapLegend>
        </div>
    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"

import { onMounted, ref } from 'vue';
import sideBar from '../components/dataVisual/common/sideBar.vue'
import layerCtrl from '../components/dataVisual/common/tool/layerCtrl.vue'
import featSearch from '../components/dataVisual/common/tool/featSearch.vue'
import mapLegend from '../components/dataVisual/common/tool/legend.vue'
import { initScratchMap } from '../utils/mapUtils';
import { useMapStore, useNewSceneStore } from '../store/mapStore';
import { scenes, layerGroups } from '../components/dataVisual/js/SCENES';
import axios from 'axios';


// data
const mapContainer = ref()
const mapStore = useMapStore()
const sceneStore = useNewSceneStore()
const activeStatus = ref([false, false, false])
const styles = [
    { backgroundImage: `url('/icons/searching.png')` },
    { backgroundImage: `url('/icons/layers.png')` },
    { backgroundImage: `url('/icons/legend.png')` },
    { backgroundImage: `url('/icons/full.png')` },
]



// methods
const toolClick = (i) => {
    if (i == 3) { //zoom
        mapFlyToRiver(mapStore.getMap())
        return;
    }
    activeStatus.value[i] = !activeStatus.value[i]
}
const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [[118.75395171066617, 31.191536515956685],
        [121.94881134428226, 32.68858659779259],],
        { pitch: 52.45, duration: 1500, },
    )
}
const closeHandler = (index) => {
    console.log('hello');
    activeStatus.value[index] = false
}

onMounted(async () => {

    const mapInstance = await initScratchMap(mapContainer.value)
    mapStore.setMap(mapInstance)
    mapInstance.addControl(new mapboxgl.NavigationControl({
        showZoom: false,
        showCompass: true,
        visualizePitch: true
    }), 'top-right')
    mapInstance.addControl(new mapboxgl.ScaleControl({ maxWidth: 150 }), 'bottom-left');
    mapFlyToRiver(mapInstance)

    sceneStore.SCENEMAP.value = scenes
    sceneStore.LAYERGROUPMAP.value = layerGroups

    activeStatus.value[0] = true



    //#region test
    // feature get test
    // await layerAddFunctionMap['地形瓦片'](mapInstance)//mvt polygon
    // await layerAddFunctionMap['沙岛'](mapInstance)//mvt polygon
    // await layerAddFunctionMap['全江注记'](mapInstance)//mvt point
    // await layerAddFunctionMap['民主沙区划线'](mapInstance)//mvt line
    // await layerAddFunctionMap['GNSS'](mapInstance)//geojson point
    // await layerAddFunctionMap['一级预警岸段'](mapInstance)//geojson line

    /// feature get test
    // window.addEventListener('keydown', async (e) => {
    //     console.log(e.key);
    //     switch (e.key) {
    //         case '1':
    //             await tempFunction(mapInstance, '地形瓦片')
    //             break;
    //         case '2':
    //             await tempFunction(mapInstance, '全江注记')
    //             break;
    //         case '3':
    //             await tempFunction(mapInstance, '民主沙区划线')
    //             break; 
    //         case '4':
    //             await tempFunction(mapInstance, 'GNSS')
    //             break;
    //         case '5':
    //             await tempFunction(mapInstance, '一级预警岸段')
    //             break;
    //     }
    // })
    //#endregion

    // addNewLayer(mapInstance)


})

//////////// DEBUG FUNCTIONS
const tempFunction = async (mapInstance, layerName) => {
    // 获取要素数组的函数
    let properties = []

    let layer = mapInstance.getLayer(layerName)
    if (!layer) return properties

    let sourceId = layer.source
    let source = mapInstance.getSource(sourceId)
    if (!source) return properties

    if (source.type == 'geojson') {
        let geofeatures = source['_data']['features']
        for (let i = 0; i < geofeatures.length; i++) {
            properties.push(geofeatures[i]['properties'])
        }
    }
    else if (source.type == 'vector') {
        const res = await axios.get(`http://localhost:5173/api/tile/vector/${sourceId}/info`)
        properties = res.data
    }
    console.log(properties);
}
const addNewLayer = async (mapInstance) => {
    // 测试瓦片图层
    const tileServer = import.meta.env.VITE_MAP_TILE_SERVER

    let map = mapInstance
    ///////////////////////////////全江概貌
    //////////// 1、行政区划
    map.addSource('cityBoundary', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/cityBoundary/{x}/{y}/{z}',
        ],
    })
    map.addLayer({
        id: '省级行政区',
        type: 'fill',
        source: 'cityBoundary',
        'source-layer': 'default',
        layout: {
            // 'line-width': 10.0
        },
        paint: {
            'fill-color': 'rgb(216,241,255)',
            'fill-opacity': 1.0,
            // 'fill-outline-color': 'rgba(0,0,47,0.8)'
        },
    })



    //////////////2 河道分段
    map.addSource('riverSection', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/riverSection/{x}/{y}/{z}',
        ],
    })
    map.addLayer({
        id: '河道分段',
        type: 'line',
        source: 'riverSection',
        'source-layer': 'default',
        layout: {
            'line-cap': 'round',
            'line-join': 'round',
        },
        paint: {
            'line-opacity': 1,
            'line-color': 'rgba(231, 214, 86, 0.9)',
            'line-width': 4,
        },
    })
    map.addSource('riverName', {
        type: 'vector',
        tiles: [
            tileServer + '/tile/vector/riverName/{x}/{y}/{z}',
        ],
    })
    map.addLayer({
        id: '河段注记',
        type: 'symbol',
        source: 'riverName',
        'source-layer': 'default',
        layout: {
            'text-field': ['get', 'label'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            // 'text-offset': [0, 1.25],
            'text-anchor': 'left',
        },
        paint: {
            'text-color': '#FC7C49',
        },
    })

    /////// 3、流域水系
    // map.addSource('riverArea', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/riverArea/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '流域水系',
    //     type: 'fill',
    //     source: 'riverArea',
    //     'source-layer': 'default',
    //     layout: {
    //     },
    //     paint: {
    //         'fill-color': 'rgb(27,116,193)',
    //     },
    // })
    // {
    // "code": "EBAA1H00000P",
    // "level": 3,
    // "name": "金湾河",
    // "length": 13,
    // "id": "110",
    // "basin": "淮河流域",
    // "water": "淮河水系",
    // "center_y": 32.44801774692429,
    // "center_x": 119.5220794131374
    // }
    // console.log((await axios.get(`http://localhost:5173/api/tile/vector/riverArea/info`)).data);


    ////// 4、湖泊河流
    // map.addSource('lakeArea', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/lakeArea/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '湖泊河流',
    //     type: 'fill',
    //     source: 'lakeArea',
    //     'source-layer': 'default',
    //     layout: {
    //     },
    //     paint: {
    //         'fill-color': 'rgb(74,102,172)',
    //     },
    // })
    //  console.log((await axios.get(`http://localhost:5173/api/tile/vector/lakeArea/info`)).data);

    ////// 5、水文站点
    // map.addSource('hydroStationPoint', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/hydroStationPoint/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '水文站点',
    //     type: 'circle',
    //     source: 'hydroStationPoint',
    //     'source-layer': 'default',
    //     layout: {
    //     },
    //     paint: {
    //         'circle-color': 'rgb(79,188,215)',
    //         'circle-blur': 0.5,
    //         'circle-radius': 6,
    //     },
    // })
    // console.log((await axios.get(`http://localhost:5173/api/tile/vector/hydroStationPoint/info`)).data);

    ///////////////////////////////涉水工程
    // 1、长江堤防
    // map.addSource('embankmentLine', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/embankmentLine/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '长江堤防',
    //     type: 'line',
    //     source: 'embankmentLine',
    //     'source-layer': 'default',
    //     layout: {
    //         'line-cap': 'round',
    //         'line-join': 'round',
    //     },
    //     paint: {
    //         'line-opacity': 1,
    //         'line-color': '#D3ABF5',
    //         'line-width': 1,
    //     },
    // })
    // console.log((await axios.get(`http://localhost:5173/api/tile/vector/embankmentLine/info`)).data);

    // 2、过江通道 /data/bankLine
    // console.log((await axios.get(`http://localhost:5173/api/data/channel`)).data);

    // map.addSource('riverPassageLine', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/riverPassageLine/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '过江通道-线',
    //     type: 'line',
    //     source: 'riverPassageLine',
    //     'source-layer': 'default',
    //     layout: {
    //         'line-cap': 'round',
    //         'line-join': 'round',
    //     },
    //     paint: {
    //         'line-opacity': 1,
    //         'line-color': '#FFD8B0',
    //         'line-width': 2.0,
    //     },
    // })

    // map.addSource('riverPassagePier', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/riverPassagePier/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '过江通道-桥墩',
    //     type: 'fill-extrusion',
    //     source: 'riverPassagePier',
    //     'source-layer': 'default',
    //     layout: {
    //     },
    //     paint: {
    //         'fill-extrusion-color': '#E0D2C4',
    //         'fill-extrusion-base': 0,
    //         'fill-extrusion-height': 200,
    //         'fill-extrusion-opacity': 0.5
    //     },
    // })

    // map.addSource('riverPassagePolygon', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/riverPassagePolygon/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '过江通道-桥',
    //     type: 'fill-extrusion',
    //     source: 'riverPassagePolygon',
    //     'source-layer': 'default',
    //     layout: {
    //     },
    //     paint: {
    //         'fill-extrusion-color': '#BBAD9F',
    //         'fill-extrusion-base': 200,
    //         'fill-extrusion-height': 230,
    //         'fill-extrusion-opacity': 0.7
    //     },
    // })


    // 3、沿江码头
    // map.addSource('dockArea', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/dockArea/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '沿江码头',
    //     type: 'fill',
    //     source: 'dockArea',
    //     'source-layer': 'default',
    //     layout: {
    //     },
    //     paint: {
    //         'fill-color': '#2B2E76',
    //     },
    // })
    // console.log((await axios.get(`http://localhost:5173/api/tile/vector/dockArea/info`)).data);

    // 4、大型枢纽



    // 5、水库工程
    // map.addSource('reservoirArea', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/reservoirArea/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '水库大坝',
    //     type: 'fill',
    //     source: 'reservoirArea',
    //     'source-layer': 'default',
    //     layout: {
    //     },
    //     paint: {
    //         'fill-color': '#2B2E76',
    //     },
    // })
    // console.log((await axios.get(`http://localhost:5173/api/tile/vector/reservoirArea/info`)).data);

    //要素高亮小测试


    // 6、水闸工程  很小
    // map.addSource('sluiceArea', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/sluiceArea/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '水闸工程',
    //     type: 'fill',
    //     source: 'sluiceArea',
    //     'source-layer': 'default',
    //     layout: {
    //     },
    //     paint: {
    //         'fill-color': '#2B2E76',
    //     },
    // })
    // console.log((await axios.get(`http://localhost:5173/api/tile/vector/sluiceArea/info`)).data);

    // 7、泵站工程  很小
    // map.addSource('pumpArea', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/pumpArea/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '泵站工程',
    //     type: 'fill',
    //     source: 'pumpArea',
    //     'source-layer': 'default',
    //     layout: {
    //     },
    //     paint: {
    //         'fill-color': '#2B2E76',
    //     },
    // })
    // console.log((await axios.get(`http://localhost:5173/api/tile/vector/pumpArea/info`)).data);

    // 8、组合工程
    // map.addSource('fjsFixPolygon', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/fjsFixPolygon/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '组合工程-面',
    //     type: 'fill',
    //     source: 'fjsFixPolygon',
    //     'source-layer': 'default',
    //     layout: {
    //     },
    //     paint: {
    //         'fill-color': '#2B2E76',
    //     },
    // })
    // console.log((await axios.get(`http://localhost:5173/api/tile/vector/fjsFixPolygon/info`)).data);



    ////////////////// 重点岸段
    // 1、岸段名录
    // let bankTable = (await axios.get(`http://localhost:5173/api/tile/vector/importantBank/info`)).data
    // console.log('岸段名录', bankTable);
    // 2、历史崩岸
    // let bankHistory = (await axios.get(`http://localhost:5173/api/data/historyInfo/desc/sort`)).data
    // console.log('历史崩岸', bankHistory);
    // 3、近岸地形

    // map.addSource('riverBg', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/riverBg/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '全江地形',
    //     type: 'fill',
    //     source: 'riverBg',
    //     'source-layer': 'default',
    //     paint: {
    //         'fill-color': [
    //             'match',
    //             ['get', 'height'],
    //             0,
    //             '#57a3ea',
    //             5,
    //             '#3c8ee9',
    //             10,
    //             '#2177e9',
    //             15,
    //             '#1361dc',
    //             20,
    //             '#0e4dc5',
    //             25,
    //             '#0a3bad',
    //             30,
    //             '#072c95',
    //             35,
    //             '#041e7c',
    //             40,
    //             '#021363',
    //             45,
    //             '#010a49',
    //             50,
    //             '#00042e',
    //             '#000000'
    //         ],
    //         // 'fill-color': '#3EFA13'
    //     },
    // })

    // map.addSource('mzs2022Before', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/mzs2022Before/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '民主沙近岸地形',
    //     type: 'fill',
    //     source: 'mzs2022Before',
    //     'source-layer': 'default',
    //     layout: {
    //     },
    //     paint: {
    //         'fill-color': '#2B2E76',
    //     },
    // })
    // console.log((await axios.get(`http://localhost:5173/api/tile/vector/mzs2022Before/info`)).data);




    // 4、近年冲淤

    //// 重点岸段 - 原来的预警岸段
    // map.addSource('importantBank', {
    //     type: 'vector',
    //     tiles: [
    //         tileServer + '/tile/vector/importantBank/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: '重点岸段',
    //     type: 'line',
    //     source: 'importantBank',
    //     'source-layer': 'default',
    //     layout: {
    //         // 'line-cap': 'round',
    //         // 'line-join': 'round',
    //     },
    //     paint: {
    //         // 'line-opacity': 1,
    //         'line-color': '#FF0303',
    //         'line-width': 10,
    //     },
    // })
    // console.log((await axios.get(`http://localhost:5173/api/tile/vector/importantBank/info`)).data);


}
function convertToGeoJSON(data) {
    const features = data.map(item => {
        return {
            type: 'Feature',
            properties: {
                name: item.name
            },
            geometry: {
                type: 'Point',
                coordinates: [item.center_x, item.center_y]
            }
        };
    });

    return {
        type: 'FeatureCollection',
        features: features
    };
}
function featureHighlight(layer, nameField, name, map) {
    // 要素高亮函数
    map.on('click', ['市级行政区'], (e) => {
        console.log(e.features[0].properties);
        // let sp_name = e.features[0].properties['sp_name']
        // map.addLayer({
        //     id: `水库工程-highlight-${sp_name}`,
        //     type: 'fill',
        //     source: 'reservoirArea',
        //     'source-layer': 'default',
        //     filter: ['==', ['get', 'sp_name'], sp_name],
        //     layout: {

        //     },
        //     paint: {
        //         'fill-color': 'rgb(254,254,60)',
        //         // 'fill-outline-color': 'rgba(254,254,60,0.8)'
        //     },
        // })
        // setTimeout(() => {
        //     map.removeLayer(`水库工程-highlight-${sp_name}`)
        // }, 3000)
    })
}

</script>

<style lang="scss" scoped>
.data-visual-container {
    width: 100vw;
    height: 92vh;
    position: absolute;
    background-color: rgba(228, 242, 252, 0.6);
    display: flex;
    flex-direction: row;
    overflow: hidden;

    .sideBar {
        position: relative;
        width: 18vw;
        height: 92vh;
    }

    .mapBase {
        position: relative;
        width: 82vw;
        height: 92vh;

        #map {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 0;
            background-color: hsl(194, 69%, 91%);
        }

        #GPUFrame {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        }
    }

    div.tools-container {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 4vw;
        height: 30vh;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        z-index: 2;

        .icon-container {
            position: relative;
            width: 6vh;
            height: 6vh;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2;
            background-color: rgb(255, 255, 255);

            .icon {
                width: 4vh;
                height: 4vh;
                background-size: contain;
                z-index: 2;

                &:hover {
                    box-shadow: 0px 10px 20px rgb(1, 110, 236), 0px -10px 20px rgb(1, 110, 236);
                    cursor: pointer;
                }
            }

            .active {
                box-shadow: 0px 10px 20px rgb(1, 110, 236), 0px -10px 20px rgb(1, 110, 236);
                cursor: pointer;
                transition: .3s ease-in-out;
            }
        }
    }

    div.search-pos {
        position: absolute;
        z-index: 2;
        right: 1vw;
        top: 10vh;
    }

    div.layer-pos {
        position: absolute;
        z-index: 2;
        right: 1vw;
        top: 10vh;
    }

    div.legend-pos {
        position: absolute;
        z-index: 2;
        right: 1vw;
        top: 10vh;
    }

}


:deep(.mapboxgl-ctrl-group button) {
    width: 5vh;
    height: 5vh;
}

:deep(.mapboxgl-ctrl button.mapboxgl-ctrl-compass .mapboxgl-ctrl-icon) {
    background-image: url('/icons/compass.svg');
}

:deep(.mapboxgl-ctrl.mapboxgl-ctrl-scale) {
    text-align: center;
    font-size: calc(0.5vw + 0.5vh);
}
</style>
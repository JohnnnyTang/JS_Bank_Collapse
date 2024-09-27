<template>
    <div class="main">
        <div ref="mapRef" id="map"></div>

    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import mapboxgl from 'mapbox-gl'
import { initMap } from '../../utils/mapUtils';
import 'mapbox-gl/dist/mapbox-gl.css'
const mapRef = ref(null)
import BankResourceHelper from '../modelStore/views/bankResourceHelper';


// const a = {
//     "tileName": "waterLine",
//     "tableName": "zys_water_line",
//     "type": "line",
//     "fields": [
//         "if_importa"
//     ]
// }
const addBankLayer = async (map, bankEnName) => {
    const tServer = 'http://172.21.212.166:8989/api/v2'

    const bank = bankEnName
    const bankVectorLayers = (await BankResourceHelper.getBankVisualResourceList('vector', bank)).data

    const layers = {
        'point': [],
        'line': [],
        'polygon': [],
        'symbol': []
    }
    const _tile = (name) => {
        return tServer + `/tile/vector/${bank}/${name}/{x}/{y}/{z}`
    }

    bankVectorLayers.forEach(blayer => {
        const name = blayer.tileName
        const tileUrl = _tile(name)
        const type = blayer.type
        const fields = blayer.fields
        layers[type].push({
            name, fields, tileUrl
        })
    })

    layers.polygon.forEach((flayer, index) => {
        map.addSource(flayer.name + 'source', {
            type: 'vector',
            tiles: [flayer.tileUrl]
        })
        map.addLayer({
            id: flayer.name,
            type: 'fill',
            'source-layer': 'default',
            source: flayer.name + 'source',
            paint: {
                'fill-color': `rgb(155,155,${(135 + index * 10) % 255})`,
                'fill-opacity': 0.8
            }
        })
    })

    layers.line.forEach((flayer, index) => {
        map.addSource(flayer.name + 'source', {
            type: 'vector',
            tiles: [flayer.tileUrl]
        })
        map.addLayer({
            id: flayer.name,
            type: 'line',
            'source-layer': 'default',
            source: flayer.name + 'source',
            paint: {
                'line-color': `rgb(255,30,${(30 + index * 10) % 255})`,
                'line-opacity': 0.8
            }
        })
    })

    layers.point.forEach((flayer, index) => {
        map.addSource(flayer.name + 'source', {
            type: 'vector',
            tiles: [flayer.tileUrl]
        })
        map.addLayer({
            id: flayer.name,
            type: 'circle',
            'source-layer': 'default',
            source: flayer.name + 'source',
            paint: {
                'circle-color': `rgb(222,100,${(200 + index * 10) % 255})`,
                'circle-radius': 5.0,
            }
        })
    })

    layers.symbol.forEach((flayer, index) => {
        map.addSource(flayer.name + 'source', {
            type: 'vector',
            tiles: [flayer.tileUrl]
        })
        map.addLayer({
            id: flayer.name,
            type: 'symbol',
            'source-layer': 'default',
            source: flayer.name + 'source',
            layout: {
                'text-field': ['get', flayer.fields[0]],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-size': 17,
            },
            paint: {
                'text-color': 'rgb(51, 51, 51)',
                'text-opacity': [
                    'match',
                    ["get", "name"],
                    'assist',
                    0.0,
                    1.0
                ],
                'text-halo-color': "rgba(255, 255, 255, 1.0)",
                'text-halo-width': 2.0,
            }
        })
    })

}


onMounted(async () => {

    // let _bankList = (await BankResourceHelper.getBankNamesList()).data
    // console.log(_bankList)

    const map = await initMap(mapRef.value)
    addBankLayer(map, 'Zys')
    // const tServer = 'http://172.21.212.166:8989/api/v2'

    // const bank = 'Zys'
    // const bankVectorLayers = (await BankResourceHelper.getBankVisualResourceList('vector', bank)).data

    // console.log(bankVectorLayers)

    // const layers = {
    //     'point': [],
    //     'line': [],
    //     'polygon': [],
    //     'symbol': []
    // }
    // const _tile = (name) => {
    //     return tServer + `/tile/vector/${bank}/${name}/{x}/{y}/{z}`
    // }

    // bankVectorLayers.forEach(blayer => {
    //     const name = blayer.tileName
    //     const tileUrl = _tile(name)
    //     const type = blayer.type
    //     const fields = blayer.fields
    //     layers[type].push({
    //         name, fields, tileUrl
    //     })
    // })
    // console.log(layers)

    // layers.polygon.forEach((flayer, index) => {
    //     map.addSource(flayer.name + 'source', {
    //         type: 'vector',
    //         tiles: [flayer.tileUrl]
    //     })
    //     map.addLayer({
    //         id: flayer.name,
    //         type: 'fill',
    //         'source-layer': 'default',
    //         source: flayer.name + 'source',
    //         paint: {
    //             'fill-color': `rgb(155,155,${(135 + index * 10) % 255})`,
    //             'fill-opacity': 0.8
    //         }
    //     })
    // })

    // layers.line.forEach((flayer, index) => {
    //     map.addSource(flayer.name + 'source', {
    //         type: 'vector',
    //         tiles: [flayer.tileUrl]
    //     })
    //     map.addLayer({
    //         id: flayer.name,
    //         type: 'line',
    //         'source-layer': 'default',
    //         source: flayer.name + 'source',
    //         paint: {
    //             'line-color': `rgb(255,30,${(30 + index * 10) % 255})`,
    //             'line-opacity': 0.8
    //         }
    //     })
    // })

    // layers.point.forEach((flayer, index) => {
    //     map.addSource(flayer.name + 'source', {
    //         type: 'vector',
    //         tiles: [flayer.tileUrl]
    //     })
    //     map.addLayer({
    //         id: flayer.name,
    //         type: 'circle',
    //         'source-layer': 'default',
    //         source: flayer.name + 'source',
    //         paint: {
    //             'circle-color': `rgb(222,100,${(200 + index * 10) % 255})`,
    //             'circle-radius': 5.0,
    //         }
    //     })
    // })

    // layers.symbol.forEach((flayer, index) => {
    //     map.addSource(flayer.name + 'source', {
    //         type: 'vector',
    //         tiles: [flayer.tileUrl]
    //     })
    //     map.addLayer({
    //         id: flayer.name,
    //         type: 'symbol',
    //         'source-layer': 'default',
    //         source: flayer.name + 'source',
    //         layout: {
    //             'text-field': ['get', flayer.fields[0]],
    //             'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    //             'text-size': 17,
    //         },
    //         paint: {
    //             'text-color': 'rgb(51, 51, 51)',
    //             'text-opacity': [
    //                 'match',
    //                 ["get", "name"],
    //                 'assist',
    //                 0.0,
    //                 1.0
    //             ],
    //             'text-halo-color': "rgba(255, 255, 255, 1.0)",
    //             'text-halo-width': 2.0,
    //         }
    //     })
    // })


    // map.addSource('mzsBankLine', {
    //     type: 'vector',
    //     tiles: ['http://172.21.212.166:8989/api/v2' + '/tile/vector/Zys/zysLine/{x}/{y}/{z}']
    //     // tiles: [tileServer + '/tile/vector/mzsBankLine/{x}/{y}/{z}'],
    // })

    // !map.getLayer('预警岸段') &&
    //     map.addLayer({
    //         id: '预警岸段',
    //         type: 'line',
    //         source: 'mzsBankLine',
    //         'source-layer': 'default',
    //         layout: {
    //             'line-join': 'round',
    //         },
    //         paint: {
    //             'line-color': '#ff3d2b',
    //             'line-width': 5,
    //         },
    //     })

    // map.addSource('mapRaster2020', {
    //     type: 'raster',
    //     tiles: [
    //         tileServer + '/tile/raster/mzs/2020/Before/{x}/{y}/{z}',
    //     ],
    // })
    // map.addLayer({
    //     id: 'ras',
    //     type: 'raster',
    //     source: 'mapRaster2020',
    // })

    // map.addSource('demTile', {
    //     type: 'raster',
    //     tiles: [tileServer + '/tile/raster/dem/Mzs/199901/{x}/{y}/{z}'],
    //     tileSize: 1024,
    //     minzoom: 10,
    //     maxzoom: 20,
    //     bounds: [120.509, 32.023, 120.555, 32.0402],
    // })
    // map.addLayer({
    //     id: 'ras',
    //     type: 'raster',
    //     source: 'demTile',
    //     paint: {
    //         'raster-opacity': 1.0,
    //     }
    // })

})


</script>

<style lang="scss" scoped>
div.flex-coloum {
    display: flex;
    flex-direction: column;
}

div.flex-row {
    display: flex;
    flex-direction: row;
}

div.one-center {
    position: relative;
    display: grid;
    place-items: center;
}

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

    div.math-model-calculation {
        position: absolute;
        z-index: 1;
        top: 8vh;
        left: 20.3vw;
        width: 15vw;
        // height: 76vh;
        background-color: rgb(248, 248, 248);
        // backdrop-filter: blur(20px);
        border-radius: calc(0vw + 0.5vh);
        box-shadow:
            rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
            rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
            rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;

        div.main-title {
            position: relative;
            width: 13vw;
            height: 5vh;
            font-size: calc(0.8vw + 0.7vh);
            font-weight: 800;
            font-family: 'Microsoft YaHei';
            text-align: center;
            line-height: 5vh;
            color: #054bb3;
            // border-bottom: #055279 solid 2px;

            div.minimize-btn {
                position: absolute;
                right: 0.1vw;
                top: 1.5vh;
                width: 2vh;
                height: 2vh;
                background-size: contain;
                background-repeat: no-repeat;
                background-image: url('/minimize.png');
                z-index: 1;
                cursor: pointer;
            }
        }

        div.file-upload-container {
            position: relative;
            width: 14.8vw;
            height: 26vh;

            :deep(.el-button, .el-button--primary, .is-plain) {
                width: 8vw;
                height: 3.7vh;
                font-size: calc(0.5vw + 0.6vh);
                font-family: 'Microsoft YaHei';
                margin: 0;
            }
        }

        div.model-container {
            position: relative;
            width: 14.8vw;
            // height: 44.8vh;
            margin-bottom: 0.5vh;

            .card {
                margin-bottom: 0.7vh;

                .content {
                    .running-container {
                        margin-top: 0.5vh;
                        border: #0d6eff54 solid 1px;
                        border-radius: 5px;
                    }

                    .setting-container {
                        margin-top: 1vh;
                        border: #0d6eff54 solid 1px;
                        border-radius: 5px;

                        .judge-container {
                            position: relative;
                            width: 14vw;

                            .judge-desc {
                                position: relative;
                                margin-top: 1vh;
                                margin-bottom: 1vh;
                                width: 12.5vw;
                                font-size: calc(0.6vw + 0.4vh);
                                font-weight: 600;
                            }

                            .after-judge {
                                position: relative;
                                margin-top: 1vh;
                                margin-bottom: 1vh;
                                width: 12.5vw;
                                font-size: calc(0.6vw + 0.4vh);
                                font-weight: 600;
                            }

                            .confirm-container {
                                position: relative;
                                margin-top: 1vh;
                                margin-bottom: 1vh;
                                width: 12.5vw;
                                font-size: calc(0.6vw + 0.4vh);
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
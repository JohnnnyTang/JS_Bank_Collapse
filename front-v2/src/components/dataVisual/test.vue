<template>
    <div class="main">
        <div ref="mapRef" id="map"></div>

    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ElMessage } from 'element-plus';
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
        map.showTileBoundaries = true;
        console.log('PureScratchMap init!')
    })

    //     let tileInfo = {
    //         "name": "199901",
    //         "bank": "Mzs"
    //     }
    //     const tileServer = import.meta.env.VITE_APP_TEMP_ADDRESS

    //     map.addSource('mapRaster2020', {
    //         type: 'raster',
    //         tiles: [
    //             tileServer + '/tile/raster/mzs/2020/Before/{x}/{y}/{z}',
    //         ],
    //         // tileSize: 1024,
    //         // minzoom: 10,
    //         // maxzoom: 20,
    //         // bounds: [120.509, 32.023, 120.555, 32.0402],
    //     })
    //     // map.addLayer({
    //     //     id: 'ras',
    //     //     type: 'raster',
    //     //     source: 'mapRaster2020',
    //     // })

    //     map.addSource('demTile', {
    //         type: 'raster',
    //         tiles: [tileServer + '/tile/raster/dem/Mzs/199901/{x}/{y}/{z}'],
    //         tileSize: 1024,
    //         minzoom: 10,
    //         maxzoom: 20,
    //         bounds: [120.509, 32.023, 120.555, 32.0402],
    //     })
    //     map.addLayer({
    //         id: 'ras',
    //         type: 'raster',
    //         source: 'demTile',
    //         paint: {
    //             'raster-opacity': 1.0,
    //         }
    //     })

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
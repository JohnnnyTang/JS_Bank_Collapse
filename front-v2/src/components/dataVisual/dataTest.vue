<template>
    <div>
        <div id="map" ref="mapref"></div>
    </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import "mapbox-gl/dist/mapbox-gl.css"
import { initScratchMap, initMap, ScratchMap } from '../../utils/mapUtils'
import { onMounted, ref } from 'vue';
const mapref = ref()


const createEmptyMap = () => {
    const blankMapStyle = {
        "version": 8,
        "sources": {},
        "layers": []
    }
    const map = new mapboxgl.Map({
        container: mapref.value, // container ID
        accessToken:
            'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg',
        // style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
        style: blankMapStyle,
        center: [120.312, 31.917], // starting position [lng, lat]
        zoom: 3, // starting zoom
        bounds: [
            [114.36611654985586, 30.55501729652339],
            [124.5709218840081, 35.31358005439914],
        ],
    })
    return map;
}

const createOfflineMap = () => {
    const offlineMapStyle = {
        "version": 8,
        "sources": {
            "offline-tiles": {
                type: 'vector',
                tiles: [
                    'http://127.0.0.1:9000/2020-10-planet-14.mbtiles/{z}/{x}/{y}.pbf'
                ]
            }
        },
        "layers": [
            {
                "id": "water",
                "type": "fill",
                "source": "offline-tiles",
                "source-layer": "water",
                "minzoom": 0,
                "layout": {},
                "paint": {
                    "fill-color": "rgb(124, 179, 211)"
                }
            },
            {
                "id": "land",
                "type": "fill",
                "source": "offline-tiles",
                "source-layer": "landcover",
                "minzoom": 0,
                "layout": {},
                "paint": {
                    "fill-color": "rgb(0, 0, 211)"
                }
            }

        ]
    }
    const styleJson = {
        "owner": "wyjq",
        "metadata": {
            "mapbox:groups": {}
        },
        "sources": {
            "js_city_point_u_65433c7c1ee803c30d922697#defaultPG": {
                "type": "vector",
                "url": "http://1.13.2.169:8899/getTileJson/65433c7c1ee803c30d922699.json"
            },
            "js_city_region_u_6540e31c1ee803c30d922681#defaultPG": {
                "type": "vector",
                "url": "http://1.13.2.169:8899/getTileJson/6540e31c1ee803c30d922683.json"
            }
        },
        "visibility": "public",
        "created": "2023-11-02 14:04:41 ",
        "center": [
            119.20807552273698,
            32.6502533117763
        ],
        "zoom": 6.774878157577292,
        "glyphs": "http://1.13.2.169:8899/store/fonts/{fontstack}/{range}.pbf",
        "version": 8,
        "draft": false,
        "name": "123",
        "sprite": "http://1.13.2.169:8899/store/sprites/osm_liberty/sprite",
        "layers": [
            {
                "metadata": {
                    "mapbox:type": "background"
                },
                "showName": "背景",
                "filterValueSet": {},
                "show": true,
                "paint": {
                    "background-color": "#a2b282",
                    "background-opacity": 1
                },
                "nodeType": "layer",
                "type": "background",
                "shpAttribute": [],
                "layout": {
                    "visibility": "visible"
                },
                "sourceType": "multiPG",
                "manageInfo": {
                    "layerKey": "background",
                    "sourceKey": ""
                },
                "attrShowList": {},
                "id": "背景_QiaKR",
                "attrValueSet": {}
            },
            {
                "metadata": {
                    "mapbox:type": "defaultPG"
                },
                "showName": "js_city_region_u",
                "filterValueSet": {},
                "show": true,
                "paint": {
                    "fill-antialias": true,
                    "fill-color": [
                        "case",
                        [
                            "match",
                            [
                                "get",
                                "gid"
                            ],
                            [
                                1
                            ],
                            true,
                            false
                        ],
                        "#4d689e",
                        [
                            "match",
                            [
                                "get",
                                "gid"
                            ],
                            [
                                2
                            ],
                            true,
                            false
                        ],
                        "rgba(199, 21, 133, 1)",
                        [
                            "match",
                            [
                                "get",
                                "gid"
                            ],
                            [
                                3
                            ],
                            true,
                            false
                        ],
                        "rgba(0, 206, 209, 1)",
                        "#4d689e"
                    ],
                    "fill-opacity": 1,
                    "fill-outline-color": "rgba(255, 255, 255, 0)",
                    "fill-pattern": "",
                    "fill-translate": [
                        0,
                        0
                    ],
                    "fill-translate-anchor": "map"
                },
                "source": "js_city_region_u_6540e31c1ee803c30d922681#defaultPG",
                "source-layer": "js_city_region_u_6540e31c1ee803c30d922681",
                "nodeType": "layer",
                "type": "fill",
                "shpAttribute": [
                    {
                        "column_name": "gid",
                        "data_type": "integer"
                    },
                    {
                        "column_name": "id",
                        "data_type": "integer"
                    },
                    {
                        "column_name": "name",
                        "data_type": "character varying"
                    },
                    {
                        "column_name": "é¢ç§¯",
                        "data_type": "double precision"
                    },
                    {
                        "column_name": "äººå£",
                        "data_type": "double precision"
                    },
                    {
                        "column_name": "gdp2005",
                        "data_type": "integer"
                    },
                    {
                        "column_name": "gdp2006",
                        "data_type": "integer"
                    },
                    {
                        "column_name": "gdp2007",
                        "data_type": "integer"
                    },
                    {
                        "column_name": "07äººågd",
                        "data_type": "double precision"
                    },
                    {
                        "column_name": "geom",
                        "data_type": "USER-DEFINED"
                    }
                ],
                "filter": [
                    "all"
                ],
                "layout": {
                    "visibility": "visible"
                },
                "sourceType": "defaultPG",
                "manageInfo": {
                    "layerKey": "js_city_region_u_6540e31c1ee803c30d922681#defaultPG",
                    "sourceKey": "js_city_region_u_6540e31c1ee803c30d922681#defaultPG"
                },
                "maxzoom": 22,
                "bounds": [
                    116.35694757451174,
                    30.758714531264886,
                    121.90024009490733,
                    35.12650911426078
                ],
                "attrShowList": {
                    "fill-antialias": true,
                    "fill-color": false,
                    "fill-opacity": true,
                    "fill-outline-color": true,
                    "fill-pattern": true,
                    "fill-translate": true,
                    "fill-translate-anchor": true,
                    "visibility": false
                },
                "id": "js_city_region_u_RZ--W",
                "attrValueSet": {
                    "fill-antialias": "primary",
                    "fill-color": {
                        "value": {
                            "propValue": [
                                {
                                    "prop": "default",
                                    "value": "#4d689e",
                                    "index": 0
                                },
                                {
                                    "prop": 1,
                                    "value": "#4d689e",
                                    "index": 1
                                },
                                {
                                    "prop": 2,
                                    "index": 2,
                                    "value": "rgba(199, 21, 133, 1)"
                                },
                                {
                                    "prop": 3,
                                    "index": 3,
                                    "value": "rgba(0, 206, 209, 1)"
                                }
                            ],
                            "propSelect": "gid",
                            "propValueFilter": [
                                [],
                                [
                                    {
                                        "gid": 1
                                    }
                                ],
                                [
                                    {
                                        "gid": 2
                                    }
                                ],
                                [
                                    {
                                        "gid": 3
                                    }
                                ]
                            ],
                            "propValueList": [
                                {
                                    "gid": 1
                                },
                                {
                                    "gid": 2
                                },
                                {
                                    "gid": 3
                                },
                                {
                                    "gid": 4
                                },
                                {
                                    "gid": 5
                                },
                                {
                                    "gid": 6
                                },
                                {
                                    "gid": 7
                                },
                                {
                                    "gid": 8
                                },
                                {
                                    "gid": 9
                                },
                                {
                                    "gid": 10
                                }
                            ],
                            "propValueOrigin": [
                                {
                                    "prop": "default",
                                    "value": "#4d689e"
                                },
                                {
                                    "prop": "",
                                    "value": "#4d689e"
                                }
                            ]
                        },
                        "type": "prop"
                    },
                    "fill-opacity": "primary",
                    "fill-outline-color": "primary",
                    "fill-pattern": "primary",
                    "fill-translate": "primary",
                    "fill-translate-anchor": "primary"
                },
                "minzoom": 0
            },
            {
                "metadata": {
                    "mapbox:type": "defaultPG"
                },
                "showName": "js_city_point_u(2)",
                "filterValueSet": {},
                "show": true,
                "paint": {
                    "icon-translate": [
                        0,
                        0
                    ],
                    "text-halo-color": "rgba(0, 0, 0, 0)",
                    "icon-translate-anchor": "map",
                    "text-halo-blur": 0,
                    "text-color": "#000000",
                    "icon-opacity": 1,
                    "text-halo-width": 0,
                    "text-opacity": 1,
                    "text-translate": [
                        0,
                        0
                    ]
                },
                "source": "js_city_point_u_65433c7c1ee803c30d922697#defaultPG",
                "source-layer": "js_city_point_u_65433c7c1ee803c30d922697",
                "nodeType": "layer",
                "type": "symbol",
                "shpAttribute": [
                    {
                        "column_name": "gid",
                        "data_type": "integer"
                    },
                    {
                        "column_name": "id",
                        "data_type": "integer"
                    },
                    {
                        "column_name": "name",
                        "data_type": "character varying"
                    },
                    {
                        "column_name": "buffer_dis",
                        "data_type": "double precision"
                    },
                    {
                        "column_name": "geom",
                        "data_type": "USER-DEFINED"
                    }
                ],
                "filter": [
                    "all"
                ],
                "layout": {
                    "text-optional": false,
                    "text-line-height": 1.2,
                    "text-size": 16,
                    "text-allow-overlap": false,
                    "icon-size": 1,
                    "icon-optional": false,
                    "text-font": [
                        "Open Sans Regular"
                    ],
                    "text-max-width": 0,
                    "icon-anchor": "center",
                    "text-offset": [
                        0,
                        0
                    ],
                    "text-rotation-alignment": "auto",
                    "text-ignore-placement": false,
                    "icon-rotate": 0,
                    "text-padding": 2,
                    "icon-rotation-alignment": "auto",
                    "icon-allow-overlap": false,
                    "icon-pitch-alignment": "auto",
                    "visibility": "visible",
                    "text-field": "",
                    "text-anchor": "center",
                    "symbol-placement": "point",
                    "icon-ignore-placement": false,
                    "icon-image": "",
                    "icon-padding": 0,
                    "text-rotate": 0,
                    "text-transform": "none",
                    "text-pitch-alignment": "auto",
                    "text-justify": "center",
                    "text-letter-spacing": 0,
                    "icon-offset": [
                        0,
                        0
                    ],
                    "icon-keep-upright": false
                },
                "sourceType": "defaultPG",
                "manageInfo": {
                    "layerKey": "js_city_point_u_65433c7c1ee803c30d922697#defaultPG",
                    "sourceKey": "js_city_point_u_65433c7c1ee803c30d922697#defaultPG"
                },
                "maxzoom": 22,
                "bounds": [
                    117.18829654366297,
                    31.312757813561802,
                    120.85533169448735,
                    34.60479413468055
                ],
                "attrShowList": {
                    "icon-opacity": true,
                    "icon-translate": true,
                    "icon-translate-anchor": true,
                    "text-color": true,
                    "text-halo-blur": true,
                    "text-halo-color": true,
                    "text-halo-width": true,
                    "text-opacity": true,
                    "text-translate": true,
                    "icon-allow-overlap": true,
                    "icon-anchor": true,
                    "icon-ignore-placement": true,
                    "icon-image": true,
                    "icon-keep-upright": true,
                    "icon-offset": true,
                    "icon-optional": true,
                    "icon-padding": true,
                    "icon-pitch-alignment": true,
                    "icon-rotate": true,
                    "icon-rotation-alignment": true,
                    "icon-size": true,
                    "symbol-placement": true,
                    "text-allow-overlap": true,
                    "text-anchor": true,
                    "text-field": true,
                    "text-font": true,
                    "text-ignore-placement": true,
                    "text-justify": true,
                    "text-letter-spacing": true,
                    "text-line-height": true,
                    "text-max-width": true,
                    "text-offset": true,
                    "text-optional": true,
                    "text-padding": true,
                    "text-pitch-alignment": true,
                    "text-rotate": true,
                    "text-rotation-alignment": true,
                    "text-size": true,
                    "text-transform": true,
                    "visibility": false
                },
                "id": "js_city_point_u_4z9CI",
                "attrValueSet": {
                    "text-optional": "primary",
                    "text-line-height": "primary",
                    "text-size": "primary",
                    "text-allow-overlap": "primary",
                    "icon-size": "primary",
                    "icon-optional": "primary",
                    "text-font": "primary",
                    "text-max-width": "primary",
                    "icon-anchor": "primary",
                    "text-offset": "primary",
                    "text-rotation-alignment": "primary",
                    "text-ignore-placement": "primary",
                    "text-color": "primary",
                    "icon-rotate": "primary",
                    "text-padding": "primary",
                    "text-opacity": "primary",
                    "icon-rotation-alignment": "primary",
                    "icon-translate": "primary",
                    "icon-allow-overlap": "primary",
                    "icon-pitch-alignment": "primary",
                    "text-halo-color": "primary",
                    "text-field": "primary",
                    "text-anchor": "primary",
                    "text-halo-blur": "primary",
                    "symbol-placement": "primary",
                    "icon-opacity": "primary",
                    "icon-ignore-placement": "primary",
                    "icon-image": "primary",
                    "text-translate": "primary",
                    "icon-padding": "primary",
                    "text-rotate": "primary",
                    "text-transform": "primary",
                    "text-pitch-alignment": "primary",
                    "text-justify": "primary",
                    "text-letter-spacing": "primary",
                    "icon-offset": "primary",
                    "icon-translate-anchor": "primary",
                    "icon-keep-upright": "primary",
                    "text-halo-width": "primary"
                },
                "minzoom": 0
            }
        ],
        "modified": "2024-04-11 21:09:30 ",
        "id": "65433bf91ee803c30d922691"
    }
    const map = new mapboxgl.Map({
        container: mapref.value, // container ID
        accessToken:
            'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg',
        // style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
        style: offlineMapStyle,
        // style: styleJson,
        center: [120.312, 31.917], // starting position [lng, lat]
        zoom: 3, // starting zoom
        bounds: [
            [114.36611654985586, 30.55501729652339],
            [124.5709218840081, 35.31358005439914],
        ],
    })

    map.on('click',['water','land'],(e)=>{
        console.log(e.features);
    })

    return map;
}

const addBackEndMVT = (map) => {
    map.addSource('river-terrain-source', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/riverBg/{x}/{y}/{z}',
        ],
    })
    map.addLayer({
        id: '全江地形',
        type: 'fill',
        source: 'river-terrain-source',
        'source-layer': 'default',
        paint: {
            'fill-color': [
                'match',
                ['get', 'height'],
                0,
                '#3EFA13',
                5,
                '#51E212',
                10,
                '#65CA11',
                15,
                '#78B210',
                20,
                '#8B9A0F',
                25,
                '#9F820F',
                30,
                '#B26A0E',
                35,
                '#C5520D',
                40,
                '#C5520D',
                45,
                '#D83A0C',
                50,
                '#EC220B',
                '#000000'
            ],
            // 'fill-color': '#3EFA13'
        },
    })
    map.addSource('riverSectionLabelSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/riverSection/{x}/{y}/{z}',
        ],
    })
    map.addSource('riverLabelSource', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:8989/api/v1/tile/vector/riverName/{x}/{y}/{z}',
        ],
    })
    map.addLayer({
        id: 'riverSectionLabel',
        type: 'line',
        source: 'riverSectionLabelSource',
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
    map.addLayer({
        id: 'riverLabel',
        type: 'symbol',
        source: 'riverLabelSource',
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
}

const addOfflineBase = (map) => {

    map.addSource('offlineBase', {
        type: 'vector',
        tiles: [
            'http://127.0.0.1:9000/2020-10-planet-14.mbtiles/{z}/{x}/{y}.pbf'
        ]
    })
    map.addLayer({
        'id': 'base',
        'type': 'fill',
        'source': 'offlineBase',
        'source-layer': 'water',
        'layout': {},
        'paint': {
            'fill-color': '#0000ff',
            'fill-opacity': 0.6
        }
    })
}

onMounted(() => {
    console.log('onMounted');
    // const map = createEmptyMap()
    // map.on('load', () => {
    //     console.log('map loaded');
    //     addOfflineBase(map)
    //     addBackEndMVT(map)
    // })

    const map = createOfflineMap()
    map.on('load', () => {
        console.log('map loaded');
        // addBackEndMVT(map)
    })


})

</script>

<style lang="scss" scoped>
#map {
    position: absolute;
    height: 92vh;
    width: 100vw;
}
</style>
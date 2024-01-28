import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import BackEndRequest from "../api/backendIns"
import { mzsBoundary_gj, mzsMonitor_gj, mzsMonitorSection_gj, mzsMonitorBankLine_gj, changjiangBoudary } from "./geojson/monitordata"
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg';


const initMap = () => {
    let map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/johnnyt/clrldnfyk001f01q2092ndx2y', // style URL
        center: [120.312, 31.917], // starting position [lng, lat]
        zoom: 3, // starting zoom
        bounds: [[114.36611654985586, 30.55501729652339], [124.5709218840081, 35.31358005439914]],
    });

    map.on('load', () => {

        mapFlyToRiver(map);
        // window.onresize = () => {
        //     mapFlyToRiver(map);
        // }
    });

    return map
}

const initAllLayer = async (map) => {

    //requestData
    let channelData = (await BackEndRequest.getChannelData()).data
    let bankData = (await BackEndRequest.getbankLineData()).data
    let mzs_monitorDevice = (await BackEndRequest.getMonitorInfo()).data


    //load Json
    let channel_gs = generateGeoJson(channelData, (element) => {
        return element['llCoords']
    }, 'LineString')
    let bankline_gs = generateGeoJson(bankData, (element) => {
        return element['coord']
    }, 'LineString')
    let mzs_mDevice_gs = generateGeoJson(mzs_monitorDevice, (element) => {
        return [element["longitude"], element["latitude"]]
    }, "Point")
    //mzsBoundary_gj --polygon
    //mzsMonitor_gj  --point

    const LayerID = [
        'channelLayer',
        'banklineLayer',
        'mzsBoundary',
        'mzsMonitorDevice',
        'mzsMonitorSectionLayer',
        'mzsMonitorBankLineLayer',
        'changjiangboudary'
    ]
    //map load 在 请求之前
    if (map.loaded()) {
        //map add source
        map.addSource('channelSource', {
            'type': 'geojson',
            'data': channel_gs
        });
        map.addSource('banklineSource', {
            'type': 'geojson',
            'data': bankline_gs
        })
        map.addSource('mzsBoundarySource', {
            'type': 'geojson',
            'data': mzsBoundary_gj
        })
        map.addSource('mzsDeviceSource', {
            'type': 'geojson',
            'data': mzs_mDevice_gs
        })

        map.addSource('mzsMonitorSectionSource', {
            'type': 'geojson',
            'data': mzsMonitorSection_gj
        })
        map.addSource('mzsMonitorBankLineSource', {
            'type': 'geojson',
            'data': mzsMonitorBankLine_gj
        })
        map.addSource('changjiangboudarySource', {
            'type': 'geojson',
            'data': changjiangBoudary
        })

        //add invisible layer
        map.addLayer({
            'id': 'channelLayer',
            'type': 'line',
            'source': 'channelSource',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round',
                // 'visibility': 'none',// 'visible'
            },
            'paint': {
                'line-color': [
                    'match',
                    ['get', 'type'],
                    '在建通道',
                    '#98E19B',
                    '已建通道',
                    '#12E0A5',
                    '规划通道',
                    '#12E05F',
                    '#C9E0BA'
                ],
                'line-width': 2,
                // 'line-dasharray': [2, 4],
                'line-opacity': 0.6
            }
        });

        map.addLayer({
            id: 'banklineLayer',
            type: 'line',
            source: 'banklineSource',
            'layout': {
                // 'visibility': 'none'
            },
            paint: {
                'line-color': [
                    'match',
                    ['get', 'warningLevel'],
                    1,
                    '#F12F05',
                    2,
                    '#F05C04',
                    3,
                    '#F5E309',
                    '#ccc'
                ],
                'line-width': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0, 4,   // 缩放级别为 0 时的线宽
                    10, 1  // 缩放级别为 10 时的线宽
                ],
                'line-opacity': 0.6
            }
        })

        // map.addLayer({
        //     'id': 'mzsBoundary',
        //     'type': 'fill',
        //     'source': 'mzsBoundarySource', // reference the data source
        //     'layout': {
        //         'visibility': 'none'
        //     },
        //     'paint': {
        //         'fill-color': '#02b9ff',
        //         'fill-opacity': 0.1
        //     }
        // });
        map.addLayer({
            'id': 'mzsBoundary',
            'type': 'line',
            'source': 'mzsBoundarySource', // reference the data source
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                'line-color': '#1cf85c',
                'line-opacity': 0.9,
                'line-width':3,
                'line-dasharray':[2,2]
            }
        });
        let size = 60
        const pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),

            // When the layer is added to the map,
            // get the rendering context for the map canvas.
            onAdd: function () {
                const canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext('2d');
                this.context.canvas.willReadFrequently = true;
            },

            // Call once before every frame where the icon will be used.
            render: function () {
                const duration = 1000;
                const t = (performance.now() % duration) / duration;

                const radius = (size / 2) * 0.3;
                const outerRadius = (size / 2) * 0.7 * t + radius;
                const context = this.context;

                // Draw the outer circle.
                context.clearRect(0, 0, this.width, this.height);
                context.beginPath();
                context.arc(
                    this.width / 2,
                    this.height / 2,
                    outerRadius,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
                context.fill();

                // Draw the inner circle.
                context.beginPath();
                context.arc(
                    this.width / 2,
                    this.height / 2,
                    radius,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = 'rgba(255, 100, 100, 1)';
                context.strokeStyle = 'white';
                context.lineWidth = 2 + 4 * (1 - t);
                context.fill();
                context.stroke();

                // Update this image's data with data from the canvas.
                context.canvas.willReadFrequently = true;
                this.data = context.getImageData(
                    0,
                    0,
                    this.width,
                    this.height
                ).data;
                context.canvas.willReadFrequently = true;

                // Continuously repaint the map, resulting
                // in the smooth animation of the dot.
                map.triggerRepaint();

                // Return `true` to let the map know that the image was updated.
                return true;
            }
        };
        map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 1 });
        map.addLayer({
            'id': 'mzsMonitorDevice',
            'type': 'symbol',
            'source': 'mzsDeviceSource',
            'layout': {
                'visibility': 'none',
                'icon-image': 'pulsing-dot',
                'icon-allow-overlap': true

            },
        })


        map.addLayer({
            'id': 'mzsMonitorSectionLayer',
            'type': 'line',
            'source': 'mzsMonitorSectionSource',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                'line-color': '#9b9b9b',
                'line-width': 8
            }
        })
        map.addLayer({
            'id': 'mzsMonitorBankLineLayer',
            'type': 'line',
            'source': 'mzsMonitorBankLineSource',
            'layout': {
                'visibility': 'none'
            },
            'paint': {
                'line-color': [
                    'match',
                    ['get', 'warning'],
                    '1',
                    '#ff001e',
                    '2',
                    '#f65c6d',
                    '3',
                    '#f4d4d4',
                    '#f4d4d4'
                ],
                'line-width': [
                    'match',
                    ['get', 'warning'],
                    '1',
                    5,
                    '2',
                    3,
                    '3',
                    2,
                    2
                ],
            }
        })

        map.addLayer({
            'id': 'changjiangboudary',
            'type': 'fill',
            'source': 'changjiangboudarySource', // reference the data source
            'layout': {},
            'paint': {
                'fill-color': '#0080ff', // blue color fill
                'fill-opacity': 0.1
            }
        });
    }

    //map load 在 请求之后
    else {
        map.on('load', () => {
            map.addSource('channelSource', {
                'type': 'geojson',
                'data': channel_gs
            });
            map.addSource('banklineSource', {
                'type': 'geojson',
                'data': bankline_gs
            })
            map.addSource('mzsBoundarySource', {
                'type': 'geojson',
                'data': mzsBoundary_gj
            })
            map.addSource('mzsDeviceSource', {
                'type': 'geojson',
                'data': mzs_mDevice_gs
            })

            map.addSource('mzsMonitorSectionSource', {
                'type': 'geojson',
                'data': mzsMonitorSection_gj
            })
            map.addSource('mzsMonitorBankLineSource', {
                'type': 'geojson',
                'data': mzsMonitorBankLine_gj
            })
            map.addSource('changjiangboudarySource', {
                'type': 'geojson',
                'data': changjiangBoudary
            })

            //add invisible layer
            map.addLayer({
                'id': 'channelLayer',
                'type': 'line',
                'source': 'channelSource',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round',
                    // 'visibility': 'none',// 'visible'
                },
                'paint': {
                    'line-color': [
                        'match',
                        ['get', 'type'],
                        '在建通道',
                        '#98E19B',
                        '已建通道',
                        '#12E0A5',
                        '规划通道',
                        '#12E05F',
                        '#C9E0BA'
                    ],
                    'line-width': 2,
                    // 'line-dasharray': [2, 4],
                    'line-opacity': 0.6
                }
            });

            map.addLayer({
                id: 'banklineLayer',
                type: 'line',
                source: 'banklineSource',
                'layout': {
                    // 'visibility': 'none'
                },
                paint: {
                    'line-color': [
                        'match',
                        ['get', 'warningLevel'],
                        1,
                        '#F12F05',
                        2,
                        '#F05C04',
                        3,
                        '#F5E309',
                        '#ccc'
                    ],
                    'line-width': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0, 4,   // 缩放级别为 0 时的线宽
                        10, 1  // 缩放级别为 10 时的线宽
                    ],
                    'line-opacity': 0.6
                }
            })

            // map.addLayer({
            //     'id': 'mzsBoundary',
            //     'type': 'fill',
            //     'source': 'mzsBoundarySource', // reference the data source
            //     'layout': {
            //         'visibility': 'none'
            //     },
            //     'paint': {
            //         'fill-color': '#02b9ff',
            //         'fill-opacity': 0.1
            //     }
            // });
            map.addLayer({
                'id': 'mzsBoundary',
                'type': 'line',
                'source': 'mzsBoundarySource', // reference the data source
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'line-color': '#1cf85c',
                    'line-opacity': 0.5,
                    'line-width':3,
                    'line-dasharray':[2,2]
                }
            });
            let size = 60
            const pulsingDot = {
                width: size,
                height: size,
                data: new Uint8Array(size * size * 4),

                // When the layer is added to the map,
                // get the rendering context for the map canvas.
                onAdd: function () {
                    const canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    this.context = canvas.getContext('2d');
                    this.context.canvas.willReadFrequently = true;
                },

                // Call once before every frame where the icon will be used.
                render: function () {
                    const duration = 1000;
                    const t = (performance.now() % duration) / duration;

                    const radius = (size / 2) * 0.3;
                    const outerRadius = (size / 2) * 0.7 * t + radius;
                    const context = this.context;

                    // Draw the outer circle.
                    context.clearRect(0, 0, this.width, this.height);
                    context.beginPath();
                    context.arc(
                        this.width / 2,
                        this.height / 2,
                        outerRadius,
                        0,
                        Math.PI * 2
                    );
                    context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
                    context.fill();

                    // Draw the inner circle.
                    context.beginPath();
                    context.arc(
                        this.width / 2,
                        this.height / 2,
                        radius,
                        0,
                        Math.PI * 2
                    );
                    context.fillStyle = 'rgba(255, 100, 100, 1)';
                    context.strokeStyle = 'white';
                    context.lineWidth = 2 + 4 * (1 - t);
                    context.fill();
                    context.stroke();

                    // Update this image's data with data from the canvas.
                    context.canvas.willReadFrequently = true;
                    this.data = context.getImageData(
                        0,
                        0,
                        this.width,
                        this.height
                    ).data;
                    context.canvas.willReadFrequently = true;

                    // Continuously repaint the map, resulting
                    // in the smooth animation of the dot.
                    map.triggerRepaint();

                    // Return `true` to let the map know that the image was updated.
                    return true;
                }
            };
            map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 1 });
            map.addLayer({
                'id': 'mzsMonitorDevice',
                'type': 'symbol',
                'source': 'mzsDeviceSource',
                'layout': {
                    'visibility': 'none',
                    'icon-image': 'pulsing-dot',
                    'icon-allow-overlap': true

                },
            })


            map.addLayer({
                'id': 'mzsMonitorSectionLayer',
                'type': 'line',
                'source': 'mzsMonitorSectionSource',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'line-color': '#9b9b9b',
                    'line-width': 8
                }
            })
            map.addLayer({
                'id': 'mzsMonitorBankLineLayer',
                'type': 'line',
                'source': 'mzsMonitorBankLineSource',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'line-color': [
                        'match',
                        ['get', 'warning'],
                        '1',
                        '#ff001e',
                        '2',
                        '#f65c6d',
                        '3',
                        '#f4d4d4',
                        '#f4d4d4'
                    ],
                    'line-width': [
                        'match',
                        ['get', 'warning'],
                        '1',
                        5,
                        '2',
                        3,
                        '3',
                        2,
                        2
                    ],
                }
            })

            map.addLayer({
                'id': 'changjiangboudary',
                'type': 'fill',
                'source': 'changjiangboudarySource', // reference the data source
                'layout': {},
                'paint': {
                    'fill-color': '#0080ff', // blue color fill
                    'fill-opacity': 0.1
                }
            });
        })
    }


    return LayerID

}


const showLayers = (map, allLayer, layerShowArr) => {

    // map.on('load',()=>{
    allLayer.forEach((item) => {
        if (map.getLayer(item))
            map.setLayoutProperty(item, 'visibility', 'none');
    })

    layerShowArr.forEach((item) => {
        if (map.getLayer(item))
            map.setLayoutProperty(item, 'visibility', 'visible');
    })
    // })

    //visible
}



const generateGeoJson = (itemArr, getCoords, type) => {

    const features = []

    itemArr.forEach(element => {
        // let coords = element[coordsName];
        let coords = getCoords(element);
        let feature = {
            'type': 'Feature',
            'properties': element,
            'geometry': {
                'coordinates': coords,
                // 'type': 'LineString',
                'type': type
            }
        }
        features.push(feature)
    });

    const geojson = {
        'type': 'FeatureCollection',
        'features': features
    }
    return geojson
}
const mapFlyToRiver = (map) => {
    if (!map) return
    map.fitBounds([[119.34643582916999, 30.990467310895838], [121.09492087941601, 32.80937651942584]], {
        pitch: 49.45,
        duration: 800,
        zoom: 7.5
    });
}


export {
    showLayers,
    initMap,
    initAllLayer,
}
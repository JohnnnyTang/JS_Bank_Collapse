<template>
    <div class="bankMain-container">
        <div class="map-container" id="map" ref="mapContainer"></div>
        <mapLegendL v-show="showLegend"></mapLegendL>
        <mapLegend v-show="showLegend2"></mapLegend>
        <button style="left: 4vh" class="button" @click="largeScaleShow" ref="btn1">
            长江江苏段
        </button>
        <button style="left: 24vh" class="button" @click="smallScaleShow" ref="btn2">
            民主沙示范段
        </button>
        <div class="radioBox" v-show="showRadio">
            <el-radio-group v-model="viewMode" size="large">
                <el-radio-button label="2D视图" />
                <el-radio-button label="3D视图" />
            </el-radio-group>
        </div>

        <bankList v-show="showList" @showChange="handlerListDBclick"></bankList>
        <bankListChild v-show="showChild" @showChange="handlerShowchange" :info="childData" @showDetail="handleShowDetail">
        </bankListChild>

        <bankHistory v-show="showHistory"></bankHistory>
        <mzsDetail @closeMzsDetail="handleMzsDetail" v-show="showmzsDetail"></mzsDetail>
        <deviceDetail @closeDeviceDetail="handleDDClose" v-if="showDeviceDetail" :deviceInfo="deviceInfo"></deviceDetail>
        <canvas id="WebGPUFrame" v-show="showWEBGPU"></canvas>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { onMounted, reactive, ref, watch, onUnmounted } from 'vue';
import bankHistory from '../components/BankMainComponents/bankHistory.vue';
import bankList from '../components/BankMainComponents/bankList.vue';
import bankListChild from '../components/BankMainComponents/bankListChild.vue';
import deviceDetail from '../components/BankMainComponents/deviceDetail.vue';
import mapLegend from '../components/BankMainComponents/mapLegend.vue';
import mapLegendL from '../components/BankMainComponents/mapLegendL.vue';
import mzsDetail from '../components/BankMainComponents/mzsDetail.vue';

import { initAllLayer, initMap, showLayers, hideLayers } from '../utils/MainView';
import { DEMLayer } from '../utils/webgpu/layers/demLayers'

const threeDLayer = new DEMLayer('3DLayer')

const mapContainer = ref();
const showLegend = ref(true);
const showLegend2 = ref(false);
const showList = ref(true);
const showChild = ref(false);
const showHistory = ref(true);
const showmzsDetail = ref(false);
const showDeviceDetail = ref(false);
const showRadio = ref(false)
const childData = ref({});
const showWEBGPU = ref(true)

const deviceInfo = ref({});
const viewMode = ref("2D视图")

const btn1 = ref({})
const btn2 = ref({})

let map;
let marker;

let layerIDs = [
    'channelLayer',
    'banklineLayer',
    'mzsBoundary',
    'mzsMonitorDevice',
    'mzsMonitorSectionLayer',
    'mzsMonitorBankLineLayer',
    'changjiangboudary',
];
let layerCount = 52 + layerIDs.length
let layerInited = false;

const largeScale = ['channelLayer', 'banklineLayer', 'changjiangboudary'];
const smallScale = [
    'mzsBoundary',
    'mzsMonitorDevice',
    'mzsMonitorSectionLayer',
    'mzsMonitorBankLineLayer',
    'changjiangboudary',
];

const handlerListDBclick = (info) => {
    marker && marker.remove()
    handlerShowchange(info);
    childData.value = info.childInfo;
    map.flyTo({
        center: info.childInfo.coord[0],
        zoom: 12,
        pitch: 0,
    });
    // map.setPaintProperty('banklineLayer', 'line-color', []);
};

const handlerShowchange = (info) => {
    showChild.value = info.showChild;
    showList.value = info.showFather;
};
const handleShowDetail = (info) => {
    showChild.value = info.showChild;
    showList.value = info.showFather;
    showmzsDetail.value = info.showDetail;
    showRadio.value = true;
    smallScaleShow()
};

const handleMzsDetail = (info) => {
    showmzsDetail.value = info.showmzsDetail
}
const handleDDClose = (info) => {
    showDeviceDetail.value = info.showDeviceDetail;
}

watch(viewMode, (val) => {
    if (val === "2D视图") {
        // console.log(document.getElementsByClassName("dg ac"));
        const guidiv = document.getElementsByClassName("dg ac")[0]
        if (guidiv) guidiv.style.display = 'none'
        showWEBGPU.value = false;
        if (map.getLayer('3DLayer'))
            map.removeLayer('3DLayer')

        ElMessage({
            offset: 80,
            message: '2D视图',
            type: 'success'
        })

        layerCount = 52 + layerIDs.length;
        smallScaleShow();
    } else {
        const guidiv = document.getElementsByClassName("dg ac")[0]
        if (guidiv) guidiv.style.display = 'block'
        showWEBGPU.value = true;
        hideLayers(map, layerIDs);

        ElMessage({
            offset: 80,
            message: '3D视图',
            type: 'success'
        })

        map.addLayer(threeDLayer)
        layerCount = 52 + layerIDs.length + 1;
    }
})

onMounted(async () => {
    map = await initMap(mapContainer);
    layerInited = await initAllLayer(map);
    // console.log(map.getStyle().layers.length);
    // if (map.getStyle().layers.length === layerCount)
    ElMessage({
        offset: 80,
        message: '图层加载完毕',
        type: 'success'
    })
    // btn1.value.classList.add('active')

    layerEventLogic(map);
});

onUnmounted(() => {
    if (map.getLayer('3DLayer'))
        map.removeLayer('3DLayer')
    map.remove()
    
    const guidiv = document.getElementsByClassName("dg ac")[0]
    if (guidiv) 
        guidiv.style.display = 'none'
})

window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        console.log(map.getStyle().layers);
    }
    if (e.key === ' ') {
        console.log('pitch', map.getPitch());
        console.log('zoom', map.getZoom());
        console.log('center', map.getCenter());
    }
}, {
    once: true
});

const mapFlyToRiver = () => {
    if (!map) return;
    map.fitBounds(
        [
            [119.34643582916999, 30.990467310895838],
            [121.09492087941601, 32.80937651942584],
        ],
        {
            pitch: 49.45,
            duration: 800,
            zoom: 7.5,
        },
    );
};

const mapFlyToMZS = async () => {
    if (!map) return;
    map.flyTo({
        center: [120.53389486960941, 32.039433500951574],
        zoom: 12.946462040328413,
        pitch: 56.686721021958206,
    });
};

const largeScaleShow = () => {
    // if (map.getStyle().layers.length != layerCount) {
    //     ElMessage({
    //         offset: 80,
    //         message: '图层加载中',
    //     });
    //     return;
    // }
    if (map.loaded()) {
        marker && marker.remove();
        mapFlyToRiver();
        showLayers(map, layerIDs, largeScale);
        showLegend.value = true;
        showLegend2.value = false;
        showList.value = true;
        showChild.value = false;
        showHistory.value = true;
        showmzsDetail.value = false;
        showDeviceDetail.value = false;
        showRadio.value = false;
    }
};

const smallScaleShow = () => {
    // if (map.getStyle().layers.length != layerCount) {
    //     ElMessage({
    //         offset: 80,
    //         message: '图层加载中',
    //     });
    //     return;
    // }
    marker && marker.remove();
    mapFlyToMZS();
    showLayers(map, layerIDs, smallScale);
    showLegend.value = false;
    showLegend2.value = true;
    showList.value = false;
    showChild.value = false;
    showHistory.value = false;
    showmzsDetail.value = true;
    showRadio.value = true
};

const layerEventLogic = () => {
    map.on('click', (e) => {
        const box = [
            [e.point.x - 3, e.point.y - 3],
            [e.point.x + 3, e.point.y + 3],
        ];
        marker && marker.remove();
        //点击device弹出deviceDetail
        if (map.getLayer('mzsMonitorDevice')) {
            const mzsMonitorDevices = map.queryRenderedFeatures(box, {
                layers: ['mzsMonitorDevice'],
            });
            if (mzsMonitorDevices && mzsMonitorDevices[0]) {
                showDeviceDetail.value = true;
                deviceInfo.value = mzsMonitorDevices[0].properties;
            }
        }

        //点击bankLine 图查文, 和双击表格一样的效果
        if (map.getLayer('banklineLayer')) {
            const bankLines = map.queryRenderedFeatures(box, {
                layers: ['banklineLayer'],
            });
            marker && marker.remove();
            if (bankLines && bankLines[0]) {
                childData.value = bankLines[0].properties;
                showChild.value = true;
                showList.value = false;
                let lonlat = bankLines[0].properties.coord
                    .slice(2, 28)
                    .split(',');
                marker = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map);
                map.flyTo({
                    center: [Number(lonlat[0]), Number(lonlat[1])],
                    zoom: 11,
                    pitch: 0,
                    speed: 0.5,
                })
            }
        }
    });

    map.on('mousemove', (e) => {
        const box = [
            [e.point.x - 5, e.point.y - 5],
            [e.point.x + 5, e.point.y + 5],
        ];
        if (map.getLayer('banklineLayer')) {
            const bankLines = map.queryRenderedFeatures(box, {
                layers: ['banklineLayer'],
            });
            if (bankLines && bankLines[0]) {
                map.getCanvas().style.cursor = 'pointer';
            }
        }
        if (map.getLayer('mzsMonitorDevice')) {
            const devices = map.queryRenderedFeatures(box, {
                layers: ['mzsMonitorDevice'],
            });
            if (devices && devices[0]) {
                map.getCanvas().style.cursor = 'pointer';
            }
        }

    })



};
</script>

<style lang="scss" scoped>
div.bankMain-container {
    height: 93vh;
    width: 100vw;
    background-color: rgb(24, 24, 24);

    // cursor:pointer;
    div.map-container {
        height: 93vh;
        width: 100vw;
        background-color: rgb(34, 34, 34);
    }

    canvas#WebGPUFrame {
        position: absolute;
        // background-color: aqua;
        top: 7vh;
        height: 93vh;
        width: 100vw;
        pointer-events: none;
        z-index: 1;
    }
}

div.radioBox {
    position: absolute;
    bottom: 20vh;
    left: 7vw;
    color: aquamarine;
    z-index: 2;

}

.legendCard {
    position: absolute;
    bottom: 5vh;
    right: 2vw;
    z-index: 2;
}

button {
    position: absolute;
    top: 8vh;
    z-index: 2;
    margin: 5px;
    height: 40px;
    width: 8vw;
    background-color: hsla(210, 70%, 20%);
    justify-content: center;
    cursor: pointer;
    align-items: center;
    border: solid hsla(210, 30%, 14%) 1px;
    font-size: 16px;
    color: hsl(210, 70%, 90%);
    transition: 500ms;
    border-radius: 0.2vw;
}

button:hover {
    background: hsla(210, 70%, 30%);
    transition: 500ms;
}

// .active{
//     background-color:rgb(247, 241, 241);
//     color:black;
//     font-size: larger;
//     box-shadow: 10px 5px 5px 5px hsl(210, 70%, 90%);
// }

.bankListDIV {
    position: absolute;
    top: 16vh;
    left: 3vh;
    z-index: 2;
}

.bankListChildDIV {
    position: absolute;
    top: 16vh;
    left: 3vh;
    z-index: 2;
}

.historyDIV {
    position: absolute;
    top: 10vh;
    right: 3vh;
    z-index: 2;
}

.mzsDetailDIV {
    position: absolute;
    top: 16vh;
    left: 3vh;
    z-index: 2;
}

.monitorDeviceDetail {
    position: absolute;
    top: 10vh;
    right: 4vh;
    z-index: 2;
}
</style>

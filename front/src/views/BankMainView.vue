<template>
    <div class="bankMain-container">
        <div class="map-container" id="map"></div>
        <mapLegendL v-show="showLegend"></mapLegendL>
        <mapLegend v-show="showLegend2"></mapLegend>
        <button style="left: 2vh;" @click="largeScaleShow">长江江苏段</button>
        <button style="left: 25vh;" @click="smallScaleShow">民主沙示范段</button>
        <bankList v-show="showList" @showChange="handlerListDBclick"></bankList>
        <bankListChild v-show="showChild" @showChange="handlerShowchange" :info="childData"></bankListChild>

        <bankHistory v-show="showHistory"></bankHistory>
        <mzsDetail v-show="showmzsDetail"></mzsDetail>
        <deviceDetail2 v-if="showDeviceDetail" :deviceInfo="deviceInfo"></deviceDetail2>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ElMessage } from 'element-plus'
// import { initMap, channelVisual, bankLineVisual, mzsMonitorVisual, monitorDeviceVisual } from '../utils/code4MainView'
import { initMap, initAllLayer, showLayers } from "../utils/MainView"
import mapLegend from "../components/BankMainComponents/mapLegend.vue"
import mapLegendL from "../components/BankMainComponents/mapLegendL.vue"
import bankList from "../components/BankMainComponents/bankList.vue"
import bankListChild from '../components/BankMainComponents/bankListChild.vue';
import bankHistory from "../components/BankMainComponents/bankHistory.vue"
import mzsDetail from "../components/BankMainComponents/mzsDetail.vue"
// import deviceDetail from '../components/BankMainComponents/deviceDetail.vue';
import deviceDetail2 from '../components/BankMainComponents/deviceDetail2.vue';


const showLegend = ref(true)
const showLegend2 = ref(false)
const showList = ref(true)
const showChild = ref(false)
const showHistory = ref(true)
const showmzsDetail = ref(false)
const showDeviceDetail = ref(false)
const childData = ref({})

const showInfo = ref({})
const deviceInfo = ref({})

let map
let layerIDs = [
    'channelLayer',
    'banklineLayer',
    'mzsBoundary',
    'mzsMonitorDevice',
    'mzsMonitorSectionLayer',
    'mzsMonitorBankLineLayer'
]
let layerInited = false

const largeScale = ['channelLayer', 'banklineLayer']
const smallScale = ['mzsBoundary', 'mzsMonitorDevice', 'mzsMonitorSectionLayer', 'mzsMonitorBankLineLayer']

const handlerListDBclick = (info) => {
    handlerShowchange(info)
    childData.value = info.childInfo
    console.log(info.childInfo);
    map.flyTo({
        center: info.childInfo.coord[0],
        zoom: 12.946462040328413,
        pitch: 56.686721021958206
    })
    // map.setPaintProperty('banklineLayer', 'line-color', []);

}

const handlerShowchange = (info) => {
    showChild.value = info.showChild
    showList.value = info.showFather
}


onMounted(async () => {
    map = initMap();
    layerInited = await initAllLayer(map);
    ElMessage({
        message: '图层加载完毕',
        type: 'success'
    })
    largeScaleShow();
    layerEventLogic(map);
})

window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')
        console.log(map.getStyle().layers);
    if (e.key === ' ') {
        console.log('pitch', map.getPitch());
        console.log('zoom', map.getZoom());
        console.log('center', map.getCenter());
    }

})


const mapFlyToRiver = () => {
    if (!map) return
    map.fitBounds([[119.34643582916999, 30.990467310895838], [121.09492087941601, 32.80937651942584]], {
        pitch: 49.45,
        duration: 800,
        zoom: 7.5
    });
}

const mapFlyToMZS = async () => {

    if (!map) return
    map.flyTo({
        center: [120.53389486960941, 32.039433500951574],
        zoom: 12.946462040328413,
        pitch: 56.686721021958206
    })
}

const largeScaleShow = () => {
    // console.log('largeScaleShow', map.loaded());
    if (map.getStyle().layers.length != 58) {
        ElMessage('图层正在加载中')
        return;
    }


    mapFlyToRiver()

    showLayers(map, layerIDs, largeScale)
    showLegend.value = true
    showLegend2.value = false
    showList.value = true
    showChild.value = false
    showHistory.value = true
    showmzsDetail.value = false
    showDeviceDetail.value = false

}

const smallScaleShow = () => {
    if (map.getStyle().layers.length != 58) {
        ElMessage('图层正在加载中')
        return;
    }

    mapFlyToMZS()
    showLayers(map, layerIDs, smallScale)
    showLegend.value = false
    showLegend2.value = true
    showList.value = false
    showChild.value = false
    showHistory.value = false
    showmzsDetail.value = true

}

const layerEventLogic = (map) => {


    map.on('click', (e) => {
        const box = [
            [e.point.x - 5, e.point.y - 5],
            [e.point.x + 5, e.point.y + 5]
        ]
        //点击device弹出deviceDetail
        const mzsMonitorDevices = map.queryRenderedFeatures(box, { layers: ['mzsMonitorDevice'] });
        if (mzsMonitorDevices && mzsMonitorDevices[0]) {
            showDeviceDetail.value = true
            deviceInfo.value = mzsMonitorDevices[0].properties;
        }

        //点击bankLine 图查文, 和双击表格一样的效果
        const bankLines = map.queryRenderedFeatures(box, { layers: ['banklineLayer'] });
        if (bankLines && bankLines[0]) {
            childData.value = bankLines[0].properties
            // showChild.value = true
            // showChild.value = false

            map.flyTo({
                center: bankLines[0].properties.coord[0],
                zoom: 12.946462040328413,
                pitch: 56.686721021958206
            })
        }
    })

    // map.on('zoom',(e)=>{
    //     console.log('zooming',e);
    //     // if small enough 
    //     // show small scale
    // })


}



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
}

.legendCard {
    position: absolute;
    bottom: 6vh;
    right: 3vw;
    z-index: 1;
}

button {
    position: absolute;
    top: 8vh;
    z-index: 1;
    height: 30px;
    margin: 5px;
    width: 20vh;
    background: #333;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    cursor: pointer;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    font-family: Consolas, Courier New, monospace;
    border: solid #404c5d 1px;
    font-size: 12px;
    color: rgb(255, 255, 255);
    -webkit-transition: 500ms;
    transition: 500ms;
    border-radius: 5px;
    //   background: linear-gradient(145deg, #2e2d2d, #212121);
    //   -webkit-box-shadow: -1px -5px 15px #41465b, 5px 5px 15px #41465b,
    //     inset 5px 5px 10px #212121, inset -5px -5px 10px #212121;
    //   box-shadow: -1px -5px 15px #41465b, 5px 5px 15px #41465b,
    //     inset 5px 5px 10px #212121, inset -5px -5px 10px #212121;

    :hover {
        -webkit-box-shadow: 1px 1px 13px #20232e, -1px -1px 13px #545b78;
        box-shadow: 1px 1px 13px #20232e, -1px -1px 13px #545b78;
        color: #ffffff;
        font-size: 16px;
        font-weight: bolder;
        -webkit-transition: 500ms;
        transition: 500ms;
    }

    :active {
        -webkit-box-shadow: 1px 1px 13px #20232e, -1px -1px 33px #545b78;
        box-shadow: 1px 1px 13px #20232e, -1px -1px 33px #545b78;
        color: #ffffff;
        -webkit-transition: 100ms;
        transition: 100ms;
    }
}

.bankListDIV {
    position: absolute;
    top: 18vh;
    left: 2vh;
    z-index: 1;
}

.bankListChildDIV {
    position: absolute;
    top: 18vh;
    left: 2vh;
    z-index: 1;
}

.historyDIV {
    position: absolute;
    top: 8vh;
    right: 2vh;
    z-index: 1;
}


.mzsDetailDIV {
    position: absolute;
    top: 20vh;
    left: 2vh;
    z-index: 1;
}

.monitorDeviceDetail {
    position: absolute;
    top: 8vh;
    right: 2vh;
    z-index: 1;
}
</style>
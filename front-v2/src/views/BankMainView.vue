<template>
    <div class="bank-main-container" ref="containerDom">
        <div id="map" class="map-container"></div>
        <TickClockVue />
        <div class="basemap-radio-container">
            <input type="radio" id="radio-1" name="tabs" checked />
            <label class="tab" for="radio-1">天地图</label>
            <input type="radio" id="radio-2" name="tabs" />
            <label class="tab" for="radio-2">OSM</label>
            <!-- <input type="radio" id="radio-3" name="tabs" />
            <label class="tab" for="radio-3">Completed</label> -->
            <span class="glider"></span>
        </div>
        <BankTableVue />
        <WarnNoticeVue />
        <RealtimeRiskVue />
        <StableStatusVue />
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import StableStatusVue from '../components/bankMain/StableStatus.vue'
import TickClockVue from '../components/bankMain/TickClock.vue'
import RealtimeRiskVue from '../components/bankMain/RealtimeRisk.vue'
import BankTableVue from '../components/bankMain/BankTable.vue'
import WarnNoticeVue from '../components/bankMain/WarnNotice.vue'

mapboxgl.accessToken =
    'pk.eyJ1Ijoiam9obm55dCIsImEiOiJja2xxNXplNjYwNnhzMm5uYTJtdHVlbTByIn0.f1GfZbFLWjiEayI6hb_Qvg'


const containerDom = ref(null)
let map = null

const mapFlyToRiver = (mapIns) => {
    if (!mapIns) return
    mapIns.fitBounds(
        [
            [117.64643582916999, 30.990467310895838],
            [122.59492087941601, 32.80937651942584],
        ],
        {
            pitch: 49.45,
            duration: 800,
            // zoom: 8,
        },
    )
}

const resizeObserver = new ResizeObserver((entries) => {
    mapFlyToRiver(map)
})


onMounted(() => {
    map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/johnnyt/clto0l02401bv01pt54tacrtg', // style URL
        center: [120.312, 31.917], // starting position [lng, lat]
        zoom: 3, // starting zoom
        bounds: [
            [114.36611654985586, 30.55501729652339],
            [124.5709218840081, 35.31358005439914],
        ],
    })

    map.on('load', () => {
        // console.log('map loaded!!!')
        mapFlyToRiver(map)

        resizeObserver.observe(containerDom.value)
    })

})

onUnmounted(() => {
    // resizeObserver.unobserve(containerDom.value)
    console.log('onUnmounted');
    map&&map.remove()
    console.log(map);
    console.log('map.remove');

})
</script>

<style lang="scss" scoped>
$shadow: #6b94e0;

@keyframes flip-card {
    0% {
        transform: perspective(2500px) rotateY(0deg);
    }
    50% {
        transform: perspective(2500px) rotateY(90deg);
    }
    100% {
        transform: perspective(2500px) rotateY(0deg);
    }
}

div.bank-main-container {
    position: absolute;
    width: 100vw;
    height: 92vh;
    top: 8vh;
    left: 0;
    overflow: hidden;

    background-color: rgb(215, 231, 250);

    div.map-container {
        width: 100vw;
        height: 92vh;
    }

    div.basemap-radio-container {
        position: absolute;
        right: 1vw;
        top: 3vh;

        width: 10vw;
        height: 3vh;
        display: flex;
        flex-flow: row nowrap;
        background-color: #fff;
        box-shadow:
            0 0 4px 1px rgba(#0642b1, 0.55),
            0 6px 12px 0 rgba(#0642b1, 0.55);
        padding: 0.6vh;
        border-radius: 0.6vw; // just a high number to create pill effect
        * {
            z-index: 6;
        }

        input[type='radio'] {
            display: none;
        }

        .tab {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 3vh;
            width: 5vw;
            font-size: calc(0.7vw + 0.2vh);
            font-weight: 600;
            border-radius: 1.6rem; // just a high number to create pill effect
            cursor: pointer;
            transition: color 0.15s ease-in;
        }

        input[type='radio'] {
            &:checked {
                & + label {
                    color: #185ee0;
                }
            }
        }

        input[id='radio-1'] {
            &:checked {
                & ~ .glider {
                    transform: translateX(0);
                }
            }
        }

        input[id='radio-2'] {
            &:checked {
                & ~ .glider {
                    transform: translateX(100%);
                }
            }
        }

        input[id='radio-3'] {
            &:checked {
                & ~ .glider {
                    transform: translateX(200%);
                }
            }
        }

        .glider {
            position: absolute;
            display: flex;
            height: 3vh;
            width: 5vw;
            background-color: #bcd8fc;
            z-index: 5;
            border-radius: 0.6vw; // just a high number to create pill effect
            transition: 0.4s cubic-bezier(0.68, -0.25, 0.265, 1.25);
        }

        // @media (max-width: 700px) {
        //     .tabs {
        //         transform: scale(0.6);
        //     }
        // }
    }


}
</style>

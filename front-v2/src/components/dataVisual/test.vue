<template>
    <div class="main">
        <!-- <sectionDraw></sectionDraw> -->
        <div class="table">
            <div class="row">
                <div class="cell" v-for="(item, index) in testData" :key="index">{{ item[0].toFixed(2) }}</div>
            </div>
            <div class="row">
                <div class="cell" v-for="(item, index) in testData" :key="index">{{ item[1].toFixed(2) }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import sectionDraw from '../modelStore/soilAnalysis/sectionDraw.vue';
import * as echarts from 'echarts';

const chartdom = ref(null)

const testData = [
    [
        4.558842192636803e-11,
        -1.2148850368295108
    ],
    [
        38.10376216666087,
        -1.2429049979040028
    ],
    [
        76.20752433327615,
        -1.2259330622439175
    ],
    [
        114.31128649989144,
        -1.259806958700206
    ],
    [
        152.41504866650672,
        -1.2611951002238697
    ],
    [
        190.51881083312202,
        -1.3152647034596443
    ],
    [
        228.6225729997373,
        -1.4663700476224946
    ],
    [
        266.72633516635256,
        -1.6060859011160848
    ],
    [
        304.83009733296785,
        -3.032057199133465
    ],
    [
        342.93385949958315,
        -3.3242398937408764
    ],
    [
        381.03762166619845,
        -3.4983403331779157
    ],
    [
        419.1413838328137,
        -4.124987050220527
    ],
    [
        457.245145999429,
        -4.851273410394535
    ],
    [
        495.3489081660443,
        -6.5910771797927366
    ],
    [
        533.4526703326595,
        -8.942828967567108
    ],
    [
        571.5564324992748,
        -12.24843115675129
    ],
    [
        609.6601946658901,
        -16.29660691373699
    ],
    [
        647.7639568325054,
        -20.083224500410033
    ],
    [
        685.8677189991207,
        -23.861599173246326
    ],
    [
        723.971481165736,
        -27.125650170028873
    ],
    [
        762.0752433323513,
        -28.320095015823984
    ],
    [
        800.1790054989665,
        -29.132909224573726
    ],
    [
        838.2827676655818,
        -29.25361011534611
    ]
]
onMounted(async () => {


})
</script>

<style lang="scss" scoped>
.main {
    position: absolute;
    width: 100vw;
    height: 92vh;
    display: flex;
    align-items: center;
    justify-content: center;

    .table {
        position: relative;
        width: 50vw;
        height: 20vh;
        display: flex;
        flex-direction: column;
        background-color: rgb(186, 221, 252);

        .row {
            position: relative;
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }

        .cell {
            height: 2vh;
            flex: 1;
            border: 1px solid black;
            display: grid;
            place-items: center;
            font-size: calc(0.3vw + 0.3vh);
            background-color: antiquewhite;
        }


    }


}
</style>
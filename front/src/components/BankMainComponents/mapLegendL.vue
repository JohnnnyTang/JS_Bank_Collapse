<template>
    <div class="legendCard">
        <div class="card2">
            <div id="title"><strong>图 例</strong></div>
            <hr />
            <div
                v-for="(item, index) in lengendData"
                :key="index"
                class="legendItem"
            >
                <div
                    class="colorcolumn"
                    :style="{ 'border-top-color': item.color }"
                ></div>
                <div class="column2">{{ item.desc }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

const lengendData = [
    {
        color: '#98E19B',
        desc: '在建通道',
    },
    {
        color: '#12E0A5',
        desc: '已建通道',
    },
    {
        color: '#12E05F',
        desc: '规划通道',
    },
    {
        color: '#F12F05',
        desc: '一级预警崩岸',
    },
    {
        color: '#F05C04',
        desc: '二级预警崩岸',
    },
    {
        color: '#F5E309',
        desc: '二级预警崩岸',
    },
];

const lengendData2 = [
    {
        color: '#ff001e',
        desc: '一级预警崩岸段',
    },
    {
        color: '#f65c6d',
        desc: '二级预警崩岸段',
    },
    {
        color: '#f4d4d4',
        desc: '三级预警崩岸段',
    },
    {
        color: '#9b9b9b',
        desc: '断面',
    },
    // {
    //     color: 'red',
    //     desc: "监测点"
    // },
];

onMounted(async () => {});
</script>

<style lang="scss" scoped>
.legendCard {
    width: 12vw;
    height: 26vh;
    // background-image: linear-gradient(163deg, #ffffff 0%, #302e38 50%);
    border-radius: 1vhpx;

    hr {
        border: 1px solid hsla(210, 70%, 40%, 0.8);
    }

    .card2 {
        width: 12vw;
        height: 26vh;
        color: hsl(210, 70%, 90%);
        background-color: hsla(210, 70%, 16%, 0.8);
        border-radius: 1vh;
        // transform: scale(0.95);
        box-shadow: 0px 0px 8px 4px hsla(210, 70%, 12%, 0.5);

        #title {
            font-family: 'Microsoft YaHei Light', sans-serif;
            font-size: calc(12px + 0.6vh);
            font-weight: 800;
            text-align: center;
            padding-top: 1vh;
        }

        .legendItem {
            display: flex;
        }
        .column1 {
            flex: 1;
            margin-left: 1vw;
            background-size: contain;

            background-repeat: no-repeat;
            background-position: center center;
        }

        .colorcolumn {
            flex: 1;
            padding-top: 1vh;
            height: 1vh;
            margin-left: 1vw;
            border-top-color: rgb(84, 84, 206);
            border-top-width: 2px;
            border-top-style: solid;
            transform: translateY(50%);
        }

        .column2 {
            flex: 2;
            font-size: calc(0.5vw + 0.5vh);
            margin-left: 1vw;
            height: 3vh;
            line-height: 3vh;
        }
    }
}
</style>

<template>
    <div class="container">
        <div class="name" :style="{ fontSize: fontSize(channelinfo.name) }">{{ channelinfo.name }}</div>
        <div class="main-container">
            <div class="channel">
                <div class="type">类型</div>
                <div class="channel-text">{{ channelinfo.type }}</div>
            </div>
            <div class="time">
                <div class="updateTime">上次更新</div>
                <div class="channel-time">{{ channelinfo.updateTime }}</div>
            </div>

            <div class="button" @click="showdesc = true">
                通道描述
            </div>
        </div>
        <Transition name="slidefade">
            <div class="sub-container" v-show="showdesc">
                <div class="desc">
                    {{ channelinfo.desc }}
                </div>
                <div class="button" @click="showdesc = false">
                    通道概要
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import BackEndRequest from '../../../api/backend';
import { useSceneStore } from '../../../store/mapStore';
const channelinfo = computed(() => useSceneStore().selectedFeature)
const showdesc = ref(false)

const fontSize = (name) => {
    if (name) {
        let length = name.length
        if (length <= 8) {
            return 'calc(1.2vh + 1.0vw)';
        } else if (length <= 10) {
            return 'calc(1.0vh + 0.9vw)'
        } else {
            return 'calc(0.8vh + 0.6vw)'
        }
    }
}


onMounted(async () => {

    const data = (await BackEndRequest.getChannelData()).data
    channelinfo.value = data[0]

})

</script>

<style lang="scss" scoped>
$Color1: rgb(163, 206, 245);
$Color2: rgb(218, 236, 251);
$Color3: rgb(37, 77, 200);
$Color4: rgb(47, 94, 211);
$Color5: rgb(6, 102, 192);

.container {
    user-select: none;

    position: relative;
    width: 14vw;
    height: 26vh;
    box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.466);

    .name {
        position: relative;
        height: 8vh;
        line-height: 8vh;
        width: 100%;
        text-align: center;
        color: white;
        background-color: $Color5;
        font-family: "Trebuchet MS", Helvetica, sans-serif;
        font-size: calc(1.2vh + 1.0vw);
        text-shadow: 1px 1px 0 #bcbcbc, 1px 1px 0 #9c9c9c;
        font-weight: 600;
    }

    .main-container {

        width: 14vw;
        height: 18vh;
        color: $Color3;
        background-color: $Color2;

        .channel {
            position: relative;
            height: 6vh;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .type {
                height: 6vh;
                margin-left: 2vw;
                line-height: 6vh;
                font-size: calc(1vh + 0.7vw);
                font-weight: 700;
            }

            .channel-text {
                height: 6vh;
                margin-right: 1.5vw;
                line-height: 6vh;

                font-size: calc(1vh + 0.7vw);
                font-weight: 600;

            }
        }

        .time {
            width: 100%;
            margin-top: 1vh;
            height: 4vh;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .updateTime {
                line-height: 4vh;
                width: 5vw;
                margin-left: 1vw;
                font-size: calc(0.8vh + 0.6vw);
                font-weight: 600;
            }

            .channel-time {
                margin-left: 1vw;
                font-size: calc(0.7vh + 0.5vw);
                font-weight: 500;
                text-align: center;
            }
        }


        .button {
            position: absolute;
            bottom: 1vh;
            height: 4vh;
            width: 5vw;
            border-radius: 5px;
            background: rgb(6, 102, 192);
            color: white;
            text-align: center;
            line-height: 4vh;
            margin-left: 50%;
            transform: translateX(-50%);
            font-size: calc(0.4vh + 0.75vw);

            &:hover {
                background: rgb(9, 133, 248);
                font-size: calc(0.6vh + 0.75vw);
                cursor: pointer;
                transition: 300ms;

            }
        }
    }

    .sub-container {
        position: absolute;
        top: 8vh;
        left: 0;
        width: 14vw;
        height: 18vh;
        color: $Color3;
        background-color: $Color2;
        transition: all .3s cubic-bezier(.6, .4, 0, 1);

        .desc {
            font-size: calc(0.6vh + 0.75vw);
            line-height: calc(0.7vh + 0.75vw);
            overflow-x: hidden;
            overflow-y: auto;
            width: 12.5vw;
            height: 10.5vh;
            margin-left: 1vw;
            padding-top: 1vh;
            text-indent: 2em;


            &::-webkit-scrollbar {
                width: 5px;
            }

            &::-webkit-scrollbar-track {
                background-color: rgba(255, 255, 255, 0.219);
            }

            &::-webkit-scrollbar-thumb {
                background-color: #ffffff94;
                border-radius: 5px;
            }

            &::-webkit-scrollbar-thumb:hover {
                background-color: #ffffff81;
            }
        }

        .button {
            position: absolute;
            bottom: 1vh;
            height: 4vh;
            width: 5vw;
            border-radius: 5px;
            background: rgb(6, 102, 192);
            color: white;
            text-align: center;
            line-height: 4vh;
            margin-left: 50%;
            transform: translateX(-50%);
            font-size: calc(0.4vh + 0.75vw);

            &:hover {
                background: rgb(9, 133, 248);
                font-size: calc(0.6vh + 0.75vw);
                cursor: pointer;
                transition: 300ms;

            }
        }

    }

    .slidefade-enter-active,
    .slidefade-leave-active {
        transition: opacity 100ms linear;
    }

    .slidefade-enter-from,
    .slidefade-leave-to {
        opacity: 0;
    }


}
</style>
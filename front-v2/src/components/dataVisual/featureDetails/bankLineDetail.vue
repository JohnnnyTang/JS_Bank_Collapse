<template>
    <div class="container">
        <div class="name" :style="{ fontSize: fontSize(bankLineInfo.bankName) }">{{ bankLineInfo.bankName }}
        </div>
        <div class="main-container">

            <div class="warning">
                <div class="warning-icon"
                    :style="{ backgroundImage: `url(${warningIcon[(+bankLineInfo.warningLevel) - 1]})` }"></div>
                <div class="warning-text">{{ warningLever[(+bankLineInfo.warningLevel) - 1] }}</div>
            </div>
            <div class="time">
                <div class="updateTime">上次更新</div>
                <div class="warning-time">{{ bankLineInfo.updateTime }}</div>
            </div>

            <div class="belongTo">
                <div class="belongToTile">隶属</div>
                <div class="belongToContent">
                    <div class="city">{{ bankLineInfo.cityName }}</div>
                    <div class="river">{{ bankLineInfo.riverName }}</div>
                </div>
            </div>
            <div class="button" @click="showdesc = true">
                岸段描述
            </div>
        </div>
        <Transition name="slidefade">
            <div class="sub-container" v-show="showdesc">
                <div class="desc">
                    {{ bankLineInfo.description }}
                </div>
                <div class="button" @click="showdesc = false">
                    岸段概要
                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import BackEndRequest from '../../../api/backend';
import { useSceneStore } from '../../../store/mapStore';


const warningLever = ['一级预警', '二级预警', '三级预警']
const warningIcon = ['/icons/warning3.png', '/icons/warning2.png', '/icons/warning1.png']
const bankLineInfo = computed(() => useSceneStore().selectedFeature)
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


    // console.log(bankLineInfo);

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
    height: 35vh;
    box-shadow: 0px 0px 10px 4px rgba(0, 0, 0, 0.466);

    .name {
        position: relative;
        height: 8vh;
        line-height: 8vh;
        font-size: calc(1.2vh + 1.0vw);
        width: 100%;
        text-align: center;
        color: white;
        background-color: $Color5;
        font-family: "Trebuchet MS", Helvetica, sans-serif;
        text-shadow: 1px 1px 0 #bcbcbc, 1px 1px 0 #9c9c9c;
        font-weight: 600;
    }

    .main-container {

        width: 14vw;
        height: 27vh;
        color: $Color3;
        background-color: $Color2;

        .warning {
            position: relative;
            height: 8vh;
            width: 100%;
            padding-top: 0.5vh;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .warning-icon {
                width: 6vh;
                height: 6vh;
                margin-left: 2vw;
                justify-content: center;
                background-size: contain;
            }


            .warning-text {
                height: 9vh;
                margin-right: 1vw;
                line-height: 6vh;

                font-size: calc(1vh + 0.7vw);
                font-weight: 700;

                &::first-letter {
                    font-size: calc(1.2vh + 1vw);
                    color: rgb(1, 102, 255);
                    letter-spacing: 5px;
                    line-height: 6vh;
                }
            }
        }

        .time {
            width: 100%;
            height: 5vh;
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

            .warning-time {
                margin-left: 1vw;
                font-size: calc(0.7vh + 0.5vw);
                font-weight: 500;
                text-align: center;
            }
        }


        .belongTo {
            height: 8vh;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            .belongToTile {
                margin-left: 1.5vw;
                font-size: calc(1.0vh + 0.9vw);
                font-weight: 600;
            }

            .belongToContent {
                margin-right: 2vw;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
                font-weight: 00;

                .city {
                    font-size: calc(0.8vh + 0.7vw);
                    line-height: calc(0.8vh + 1vw);
                }

                .river {
                    font-size: calc(0.8vh + 0.6vw);
                    line-height: calc(0.8vh + 0.7vw);

                }
            }
        }



        .button {
            margin-top: 0.5vh;
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
        height: 27vh;
        color: $Color3;
        background-color: $Color2;
        transition: all .3s cubic-bezier(.6, .4, 0, 1);

        .desc {
            margin-left: 1vw;
            padding-top: 1vh;
            font-size: calc(0.6vh + 0.75vw);
            line-height: calc(0.7vh + 0.75vw);
            overflow-x: hidden;
            overflow-y: auto;
            width: 12.5vw;
            height: 20vh;
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
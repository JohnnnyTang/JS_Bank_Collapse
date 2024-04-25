<template>
    <div class="warning-pop">
        <div class="icon" v-show="testZoom < 12"></div>

        <div class="content" v-show="testZoom >= 12">
            <div class="header">
                <div class="icon-title"></div>
                <div class="title">警告！</div>
            </div>
            <hr>
            <div class='con-tent'>
                <div class="info">
                    <div class="device-info">
                        预警信息
                    </div>
                    <div class="deviceType">
                        GNSS
                    </div>
                    <div class="deviceCode">
                        <div class="code">设备码</div>
                        <div class="text">
                            Lorem ipsum dolor
                        </div>
                    </div>
                    <div class="devicePos">
                        <div class="pos">位置</div>

                        <div class="text">
                            123123123,123123123
                        </div>
                    </div>
                </div>



            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'


const props = defineProps({
    zoom: Number
})
const testZoom = 13;




</script>

<style lang="scss" scoped>
/* The loader container */

/* The dot */
.warning-pop {
    width: 10vw;
    height: 20vh;
    // background-color: #fac3b5;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // box-shadow: rgb(29, 72, 196) 0px 0px 25px 3px inset;
    border-radius: 5%;


    .icon {
        width: 4vh;
        height: 4vh;
        background-size: contain;
        background-image: url('/alarm.png');
        animation: warningScale 5s infinite;
        border-radius: 40%;
    }

    .content {
        width: 10vw;
        height: 20vh;
        position: relative;
        box-shadow: rgb(253, 80, 80) 0px 0px 5px 3px inset;
        border-radius: calc(0.2vw + 0.5vh);


        .header {
            width: 10vw;
            height: 5vh;
            display: flex;
            flex-direction: row;


            .icon-title {
                width: 4vh;
                height: 4vh;
                margin-top: 0.5vh;
                margin-left: 0.5vw;
                background-size: contain;
                background-image: url('/alarm.png');
                border-radius: 40%;
            }

            .title {
                width: calc(10vw - 4vh);
                height: 5vh;
                text-align: center;
                line-height: 5vh;
                font-size: calc(1vw + 0.5vh);
                font-weight: 800;
            }
        }

        hr {
            margin: 0;
            border-top: 5px;
            border-color: rgb(253, 80, 80);
        }

        .con-tent {
            position: relative;
            width: 10vw;
            height: 15vh;

            .device-info {
                position: relative;
                width: 4vw;
                height: 3vh;
                text-align: center;
                line-height: 5vh;
                font-size: calc(0.7vw + 0.5vh);
                font-weight: 800;
            }



            .deviceType {
                width: 10vw;
                height: 3vh;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

            .deviceCode {
                width: 10vw;
                height: 3vh;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

            .devicePos {
                width: 10vw;
                height: 3vh;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

        }
    }

}


@keyframes warningScale {

    0%,
    100% {
        transform: scale(1.0);
        box-shadow: rgb(247, 161, 161) 0px 0px 2px 2px;
        background-color: rgb(247, 161, 161);
    }

    75% {
        transform: scale(1.1);
        box-shadow: rgb(247, 101, 101) 0px 0px 4px 4px;
        background-color: rgb(247, 101, 101);
    }


}
</style>
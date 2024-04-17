<template>
    <div class="basic-info-container">
        <e-border-box-3 text="基本信息" background-color="#0446a8">
            <div class="basic-info-content">
                <div class="title-container">民主沙右缘示范段</div>
                <div class="splitter-container">
                    <dv-decoration5
                        :dur="4"
                        :color="['#0446a8', 'rgb(28, 105, 247)']"
                        style="height: 2vh; background-color: transparent"
                    />
                </div>
                <div class="key-val-container">
                    <div class="icon" id="warning-icon"></div>
                    <div class="key-text">预警级别</div>
                    <div class="val-text">Ⅰ级</div>
                </div>
                <div class="key-val-container">
                    <div class="key-text">监测长度</div>
                    <div class="icon" id="length-icon"></div>
                    <div class="val-text">7公里</div>
                </div>
                <div class="key-val-container">
                    <div class="key-text">布设监测设备</div>
                    <div class="val-text">38台</div>
                </div>
                <div class="key-val-container">
                    <div class="key-text">持续监测时间</div>
                    <div class="val-text">12天</div>
                </div>
            </div>
        </e-border-box-3>
    </div>
</template>

<script setup>
import { EBorderBox3 } from 'e-datav-vue3'
</script>

<style lang="scss" scoped>
div.basic-info-container {
    position: absolute;
    z-index: 3;
    left: 1vw;
    top: 3vh;
    width: 20vw;
    height: 28vh;

    // background-color: aliceblue;

    div.basic-info-content {
        width: 100%;
        height: 100%;
        border-radius: 16px;
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        justify-content: center;

        div.title-container {
            margin-top: 1.5vh;
            height: 4vh;
            line-height: 4vh;
            width: 100%;
            background-color: transparent;
            text-align: center;
            font-size: calc(0.8vw + 0.8vh);
            font-weight: bold;
            color: #0400fd;
            text-shadow:
                #eef3ff 1px 1px,
                #eef3ff 2px 2px,
                #6493ff 3px 3px;
            letter-spacing: 0.4rem;
        }

        div.splitter-container {
            height: 2vh;
            width: 100%;
            background-color: transparent;
        }

        div.key-val-container {
            margin-top: 0.4vh;
            width: 40%;
            height: 9vh;
            display: flex;
            flex-flow: row wrap;
            // background-color: #0446a8;
            text-align: center;
            border-bottom: 3px solid rgb(0, 32, 175);

            div.icon {
                width: 20%;
                height: 4.5vh;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: 50% 50%;
                background-color: transparent;

                &#warning-icon {
                    background-image: url('/warning.png');
                }

                &#length-icon {
                    background-image: url('/distance.png');
                }
            }

            div.key-text {
                width: fit-content;
                flex-grow: 1;
                height: 4.5vh;
                line-height: 4.5vh;
                background-color: transparent;
                font-size: calc(0.8vw + 0.6vh);
                color: #0043fd;
            }

            div.val-text {
                width: 100%;
                height: 4.5vh;
                line-height: 4.5vh;
                font-size: calc(0.8vw + 0.6vh);
                font-weight: bold;
                color: #1d00be;
                // text-align: center;
            }

            &:nth-child(2n + 1) {
                text-align: left;
                padding-left: 6%;
                // border-right: 2px solid rgb(0, 32, 175);
            }
            &:nth-child(2n) {
                text-align: right;
                padding-right: 6%;
                // border-left: 2px solid rgb(0, 32, 175);
            }
        }
        // background-color: aliceblue;
    }
}

:deep(.e-border-box-3) {
    backdrop-filter: blur(12px);
    box-shadow: 4px 8px 8px -4px rgb(0, 47, 117);
    background-color: rgba(156, 195, 255, 0.4);
    border-radius: 8px;
    border: 2px solid rgb(28, 105, 247);
}

:deep(.e-border-box-3 div:first-of-type) {
    --height: 3vh;
    font-size: calc(0.6vw + 0.6vh);
    color: rgb(212, 255, 253);
    --color: #0446a8;
    background-color: var(--color);
}
</style>

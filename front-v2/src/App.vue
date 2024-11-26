<template>
    <!-- <WsTest /> -->
    <HeaderComp />
    <RouterView />
    <!-- <TreeTypesView /> -->
</template>

<script setup>
import { onMounted, ref, createApp } from 'vue'
import HeaderComp from './components/layout/HeaderComp.vue'
import router from './router/index'
import { useDeviceNameStore } from './store/mapStore';

onMounted(async () => {

    const infoBoxDiv = document.createElement('div')
    infoBoxDiv.style.position = 'absolute'
    infoBoxDiv.style.zIndex = '999'
    infoBoxDiv.id = 'DeviceInfoBox'
    document.body.appendChild(infoBoxDiv)

    // window.DEVICEName = DEVICEName
    window.pickedObject = {

        /** @type { string } */ _name: '',

        /** @type { number[] } */ _position: [0.0, 0.0],

        /** @type { number[] } */ boxSize: [150.0, 150.0],

        /** @type { HTMLDivElement } */ infoBox: infoBoxDiv,

        /** @type { number } */ pixelRation: window.devicePixelRatio,

        /**
         * @param { string } nameStr
         */
        set name(nameStr) {

            // pickedObject.infoBox.innerHTML = nameStr
            // DEVICEName.value = nameStr
            useDeviceNameStore().deviceName = nameStr
            console.log('device name ', nameStr)
            this._name = nameStr
        },

        get name() {

            return this._name
        },

        /**
         * @param { number[] } xy
         */
        set position(xy) {

            const [x, y] = xy

            if (x === -1 && y === -1) {

                this.infoBox.style.display = 'none'

            } else {

                this.infoBox.style.display = 'block'
                this.infoBox.style.bottom = `${y / this.pixelRation}px`
                this.infoBox.style.left = `${x / this.pixelRation - this.boxSize[0] / 2}px`

            }

            this._position = xy
        },

        get position() {

            return this._position
        },
    }

    window.pickUp = (name) => {
        pickedObject.name = name;
        // pickedObject.infoBox.style.width = `${pickedObject.boxSize[0]}px`;
        // pickedObject.infoBox.style.height = `${pickedObject.boxSize[1]}px`;
        pickedObject.infoBox.style.width = `5px`;
        pickedObject.infoBox.style.height = `5px`;

        // test
        // createCompIns(pickedObject.infoBox)

    }
    window.consoleLogMessageFromUnity = (message) => {

        console.log("Received message from Unity:", message)
    }

    window.pickScreenPos = (x, y) => {

        pickedObject.position = [x, y]
    }

})

// const createCompIns = (fatherDom) => {
//     // let fatherDom = document.querySelector('#DeviceInfoBox')
//     fatherDom.innerHTML = ''
//     const bankApp = createApp(threeDdevice)
//     bankApp.mount(fatherDom)
// }
</script>

<style lang="scss">
html,
body,
#app {
    height: 100vh;
    width: 100vw;
    margin: 0 0 0 0;
    padding: 0 0 0 0;
    overflow-y: hidden;
    overflow-x: hidden;
}

.nav-popper {
    .el-scrollbar__wrap {
        width: 14vw;
        text-align: center;
        position: relative;
        z-index: 9999;

        ul {
            text-align: center;
            background-color: rgb(1, 67, 165);
            padding-bottom: 1px;
            z-index: 9999;
        }

        li {
            // width: 10vw;
            text-align: center;
            line-height: 4vh;
            justify-content: space-between;
            font-size: calc(0.6vw + 0.6vh);
            font-weight: bold;
            color: aliceblue;
            border-bottom: 1px solid white;

            span.right {
                font-size: calc(0.4vw + 0.6vh);
            }

            &.is-disabled {
                background-color: rgb(87, 103, 128);
                color: rgb(196, 203, 209);
                filter: grayscale(0.5);
                width: 4%;
                padding-left: 48%;
                padding-right: 48%;
            }

            span.level-one {
                color: rgb(255, 98, 98);
            }

            span.level-two {
                color: rgb(230, 247, 137);
            }
        }
    }

    &.center {
        .el-scrollbar__wrap {
            width: 12vw;
        }

        li {
            justify-content: center;
            font-size: calc(0.8vw + 0.6vh);
        }
    }
}

.draw-popper {
    .el-scrollbar__wrap {
        width: 6vw;
        text-align: center;
        position: relative;
        z-index: 9999;

        ul {
            text-align: center;
            background-color: #2587E3;
            padding-bottom: 1px;
            z-index: 9999;
        }

        li {
            // width: 10vw;
            text-align: center;
            line-height: 3vh;
            justify-content: center;
            font-size: calc(0.6vw + 0.6vh);
            font-weight: bold;
            color: aliceblue;
            border-bottom: 1px solid white;
        }
    }

    &.center {
        .el-scrollbar__wrap {
            width: 12vw;
        }

        li {
            justify-content: center;
            font-size: calc(0.8vw + 0.6vh);
        }
    }
}

.risk-popper {
    .el-scrollbar__wrap {
        width: 14vw;
        text-align: center;
        position: relative;
        z-index: 9999;

        ul {
            text-align: center;
            // background-color: rgb(1, 67, 165);
            padding-bottom: 1px;
            z-index: 9999;
        }

        li {
            // width: 10vw;
            text-align: center;
            line-height: 5vh;
            height: 5vh;
            justify-content: center;
            font-size: calc(0.5vw + 0.8vh);
            color: rgb(0, 12, 182);
            border-bottom: 1px solid white;

            &.is-selected {
                background-color: rgb(26, 122, 231);
                color: rgb(212, 254, 255);
            }
        }
    }

    .el-select-dropdown__footer {
        padding: 0.8vh 4vw 0.8vh 4vw;
        border-top: 2px dashed #1248bb;

        div.add-select-button {
            width: 6vw;
            height: 3.6vh;
            line-height: 3.6vh;
            text-align: center;

            background-color: #c6e3ff;
            border-radius: 8px;

            font-size: calc(0.4vw + 0.5vh);
            font-weight: bold;
            transition: 0.2s ease-in-out;
            border: 1px solid #333;

            box-shadow:
                rgba(0, 132, 255, 0.8) 1px 1px,
                rgba(0, 119, 255, 0.7) 2px 2px,
                rgba(0, 119, 255, 0.6) 3px 3px;

            &:hover {
                cursor: pointer;
                transform: translate3d(2px, 2px, 2px);
                background-color: rgb(26, 122, 231);
                color: rgb(212, 254, 255);
                border: 1px solid rgb(147, 251, 255);
                box-shadow:
                    rgba(117, 211, 240, 0.7) 1px 1px,
                    rgba(117, 211, 240, 0.6) 2px 2px,
                    rgba(117, 211, 240, 0.5) 3px 3px;
            }
        }
    }
}

.profile-popper {
    .el-scrollbar__wrap {
        width: 5.5vw;
        text-align: center;
        position: relative;
        z-index: 9999;

        ul {
            text-align: center;
            background-color: rgba(230, 253, 255, 0.7);
            padding-bottom: 1px;
            z-index: 9999;
        }

        li {
            // width: 10vw;
            text-align: center;
            line-height: 3vh;
            height: 3vh;
            justify-content: center;
            font-size: calc(0.3vw + 0.5vh);
            color: #1c68cc;
            border-bottom: 1px solid white;

            &.is-selected {
                background-color: rgb(26, 122, 231);
                color: rgb(212, 254, 255);
            }
        }
    }

    .el-select-dropdown__footer {
        padding: 0.8vh 4vw 0.8vh 4vw;
        border-top: 2px dashed #1248bb;

        div.add-select-button {
            width: 6vw;
            height: 3.6vh;
            line-height: 3.6vh;
            text-align: center;

            background-color: #c6e3ff;
            border-radius: 8px;

            font-size: calc(0.4vw + 0.5vh);
            font-weight: bold;
            transition: 0.2s ease-in-out;
            border: 1px solid #333;

            box-shadow:
                rgba(0, 132, 255, 0.8) 1px 1px,
                rgba(0, 119, 255, 0.7) 2px 2px,
                rgba(0, 119, 255, 0.6) 3px 3px;

            &:hover {
                cursor: pointer;
                transform: translate3d(2px, 2px, 2px);
                background-color: rgb(26, 122, 231);
                color: rgba(230, 253, 255, 0.7);
                border: 1px solid rgb(147, 251, 255);
                box-shadow:
                    rgba(117, 211, 240, 0.7) 1px 1px,
                    rgba(117, 211, 240, 0.6) 2px 2px,
                    rgba(117, 211, 240, 0.5) 3px 3px;
            }
        }
    }
}

.water-condition-popper {
    .el-scrollbar__wrap {
        width: 6.5vw;
        text-align: center;
        position: relative;
        z-index: 9999;

        ul {
            text-align: center;
            background-color: rgba(230, 253, 255, 0.7);
            padding-bottom: 1px;
            z-index: 9999;
        }

        li {
            // width: 10vw;
            text-align: center;
            line-height: 3vh;
            height: 3vh;
            justify-content: center;
            font-size: calc(0.4vw + 0.5vh);
            color: #1c68cc;
            border-bottom: 1px solid white;

            &.is-selected {
                background-color: rgb(26, 122, 231);
                color: rgb(212, 254, 255);
            }
        }
    }

    .el-select-dropdown__footer {
        padding: 0.8vh 4vw 0.8vh 4vw;
        border-top: 2px dashed #1248bb;

        div.add-select-button {
            width: 6vw;
            height: 3.6vh;
            line-height: 3.6vh;
            text-align: center;

            background-color: #c6e3ff;
            border-radius: 8px;

            font-size: calc(0.4vw + 0.5vh);
            font-weight: bold;
            transition: 0.2s ease-in-out;
            border: 1px solid #333;

            box-shadow:
                rgba(0, 132, 255, 0.8) 1px 1px,
                rgba(0, 119, 255, 0.7) 2px 2px,
                rgba(0, 119, 255, 0.6) 3px 3px;

            &:hover {
                cursor: pointer;
                transform: translate3d(2px, 2px, 2px);
                background-color: rgb(26, 122, 231);
                color: rgba(230, 253, 255, 0.7);
                border: 1px solid rgb(147, 251, 255);
                box-shadow:
                    rgba(117, 211, 240, 0.7) 1px 1px,
                    rgba(117, 211, 240, 0.6) 2px 2px,
                    rgba(117, 211, 240, 0.5) 3px 3px;
            }
        }
    }
}

.el-message-box.choice-box.el-message-box--center {
    width: 10vw;
    background-color: rgb(215, 243, 254);
    backdrop-filter: blur(16px);
    border: #b2c6f3 2px solid;
    padding: 0;
    margin: 0;
    padding-top: 1vh;

    .el-message-box__header.show-close {
        display: none;
    }

    .el-message-box__content {

        .el-message-box__container {

            .el-message-box__message {

                .container {
                    // transform: translateX(7%);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    .title {
                        height: 3vh;
                        line-height: 3vh;
                        width: 9vw;
                        text-align: center;
                        font-size: calc(0.7vw + 0.6vh);
                        font-weight: bold;
                        color: rgb(6, 0, 68);

                        letter-spacing: 0.1rem;
                        border-bottom: #1248bb 2px solid;
                        margin-bottom: 0.5vh;
                    }

                    .block {
                        width: 10vw;
                        height: 2vh;
                        margin-bottom: 0.2vh;
                        transform: translateX(10%);

                        input[type="radio"] {
                            transform: translateY(10%);
                        }

                        .text {
                            line-height: 2vh;
                            text-align: center;
                            font-size: calc(0.5vw + 0.6vh);
                            color: rgb(6, 0, 68);
                            letter-spacing: 0.0rem;
                        }
                    }
                }
            }
        }
    }

    .el-message-box__btns {
        margin: 0;
        padding: 0;
        padding-top: 0.5vh;
        padding-bottom: 0.5vh;

        .el-button {
            width: 2.5vw;
            height: 2.8vh;

        }

        .el-button.el-button--primary {
            width: 2.5vw;
            height: 2.8vh;
        }
    }
}

.el-popper.is-light.el-popover {
    background: rgba(255, 255, 255, 0.8);
    color: #134dcc;
    border: #1248bb 1px solid;
    border-radius: 5px;
    box-shadow: 0 0 4px #1248bb;
    font-size: 20px;
    font-weight: bold;
    ;
}

.el-popper.is-light.el-popover.device-indicator-popover {
    background: rgba(255, 255, 255, 0.942);
    border: #1248bb 1px solid;
    border-radius: 5px;
    box-shadow: 0 0 4px #1248bb;
    width: 15vw !important;

    div.device-indicator-info {
        position: relative;
        width: 14vw;
        height: 30vh;
        color: rgb(1, 24, 74);

        .device-indicator-info-title {
            position: relative;
            width: 100%;
            height: 3vh;
            line-height: 3vh;
            text-align: left;
            font-size: calc(0.5vw + 0.4vh);
            font-weight: bold;
        }

        .device-indicator-info-content {
            position: relative;
            width: 100%;
            height: 26vh;
            font-size: calc(0.4vw + 0.3vh);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            // overflow-y: auto;

            .indicator-info {
                position: relative;
                height: fit-content;
                margin-top: .5vh;
                margin-bottom: .5vh;
                .indicator-name {
                    font-size: calc(0.4vw + 0.4vh);
                    color: rgb(1, 67, 165);
                }

                .indicator-desc {
                    color: #191919;
                    text-align: left;
                    margin-left: .7vw;
                }
            }
        }
    }
}




.el-overlay {
    .el-drawer {
        margin-top: 13vh;
        background-color: rgb(244, 244, 244);
        width: 18% !important;
        height: 87vh !important;
    }
}
</style>

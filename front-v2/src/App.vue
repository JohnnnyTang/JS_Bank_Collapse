<template>
    <!-- <WsTest /> -->
    <HeaderComp />
    <RouterView />
    <!-- <TreeTypesView /> -->
</template>

<script setup>
import { onMounted } from 'vue'
import HeaderComp from './components/layout/HeaderComp.vue'
import router from './router/index'

onMounted(async () => {
    // await Scratch.StartDash()
    console.log('app', router.currentRoute.value)
})
</script>

<style lang="scss">
html,
body,
#app {
    height: 100vh;
    width: 100vw;
    margin: 0 0 0 0;
    padding: 0 0 0 0;
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

.el-message-box.choice-box.el-message-box--center {
    width: 10vw;
    background-color: rgb(215,243,254);
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
                        text-shadow:
                            #eef3ff 1px 1px,
                            #eef3ff 2px 2px;
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
                            text-shadow:
                                #eef3ff 1px 1px,
                                #eef3ff 2px 2px;
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

}</style>

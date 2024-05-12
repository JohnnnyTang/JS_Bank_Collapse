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
</style>

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
        width: 7vw;
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
            line-height: 2.6vh;
            justify-content: center;
            font-size: calc(0.4vw + 0.6vh);
            color: aliceblue;
            border-bottom: 1px solid white;
        }
    }
}
</style>

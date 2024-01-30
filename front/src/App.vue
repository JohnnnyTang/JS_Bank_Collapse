<template>
  <!-- <WsTest /> -->
  <HeaderView/>
  <RouterView />
  <!-- <TreeTypesView /> -->
</template>

<script setup>
import {onMounted} from 'vue';
import HeaderView from './components/main/HeaderView.vue';
// import WsTest from './views/WsTest.vue';
import router from './router/index';

// onMounted(() => {
//   console.log('app', router.currentRoute.value)
// })

</script>

<style lang="scss">
html, body {
  height: 100vh;
  width: 100vw;
  margin: 0;
}
</style>

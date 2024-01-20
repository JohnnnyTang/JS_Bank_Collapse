<template>
  <!-- <WsTest /> -->
  <HeaderView @nav-click="changeNav"/>
  <RouterView />
  <!-- <TreeTypesView /> -->
</template>

<script setup>
import HeaderView from './components/main/HeaderView.vue';
// import WsTest from './views/WsTest.vue';
import router from './router/index';

const changeNav = (navLink) => {
  router.push(navLink);
}

</script>

<style lang="scss">
html, body {
  height: 100vh;
  width: 100vw;
  margin: 0;
}
</style>

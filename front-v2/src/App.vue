<template>
  <!-- <WsTest /> -->
  <HeaderComp/>
  <RouterView />
  <!-- <TreeTypesView /> -->
</template>

<script setup>
import { onMounted } from 'vue';
import HeaderComp from './components/layout/HeaderComp.vue';
import router from './router/index';

onMounted(async () => {
  
  // await Scratch.StartDash()
  console.log('app', router.currentRoute.value)
})

</script>

<style lang="scss">
html, body, #app {
  height: 100vh;
  width: 100vw;
  margin: 0 0 0 0;
  padding: 0 0 0 0;
}
</style>

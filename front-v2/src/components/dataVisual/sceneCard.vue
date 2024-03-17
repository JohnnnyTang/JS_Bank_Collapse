<template>
  <div class="card">
    <div class="top-section">
      <div class="border"></div>
    </div>
    <div class="bottom-section">
      <span class="title">典型数据场景</span>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import router from './router/index';

onMounted(async () => {

})

</script>

<style lang="scss">
.card {
  width: 230px;
  border-radius: 20px;
  background: #1b233d;
  padding: 5px;
  overflow: hidden;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 20px 0px;

  .top-section {
    height: 150px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(45deg, rgb(4, 159, 187) 0%, rgb(80, 246, 255) 100%);
    position: relative;

    .border {
      border-bottom-right-radius: 10px;
      height: 30px;
      width: 130px;
      background: white;
      background: #1b233d;
      position: relative;
      transform: skew(-40deg);
      box-shadow: -10px -10px 0 0 #1b233d;
    }
  }

  .bottom-section {
    .title {
      display: block;
      font-size: 17px;
      font-weight: bolder;
      color: white;
      text-align: center;
      letter-spacing: 2px;
    }
  }
}

.card .top-section .border::before {
  content: "";
  position: absolute;
  width: 15px;
  height: 15px;
  top: 0;
  right: -15px;
  background: rgba(255, 255, 255, 0);
  border-top-left-radius: 10px;
  box-shadow: -5px -5px 0 2px #1b233d;
}

.card .top-section::before {
  content: "";
  position: absolute;
  top: 30px;
  left: 0;
  background: rgba(255, 255, 255, 0);
  height: 15px;
  width: 15px;
  border-top-left-radius: 15px;
  box-shadow: -5px -5px 0 2px #1b233d;
}
</style>

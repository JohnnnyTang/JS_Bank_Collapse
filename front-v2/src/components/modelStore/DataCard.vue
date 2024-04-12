<template>
  <div 
    class="card"
    @click="showData"
  >
    <div class="top-section">
      <div class="border">
        <div class="title-text">
          {{ props.title }}
        </div>
      </div>
      <div class='icon' :style="{ backgroundImage: `url(${props.iconSrc})` }"></div>
      <div class="text">
        {{ props.desc }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, defineEmits } from 'vue'

const emit = defineEmits(['showData']);
const props = defineProps({
  title: String,
  desc: String,
  iconSrc: String,
  data: Object
})

const showData = () => {
  emit('showData', { title: props.title, data: props.data })
}

onMounted(async () => {

})
</script>

<style lang="scss" scoped>
.card {
  // position: absolute;
  // top: 3vh;
  // left: 1vw;
  margin: 5px;
  width: 10.9vw;
  height: 10vh;
  border-radius: 10px;
  background: #175FA3;
  padding: 5px;
  overflow: hidden;
  box-shadow: #b4c8fc 5px 1px 8px 0px;
  display: flex;
  flex-direction: column;
  transition: transform 0.5s;
  user-select: none;

  &:hover {
    transform: scale(1.02);
    cursor: pointer;
  }


  .top-section {
    height: 10vh;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(45deg, #C9E1F5, #E2FFEE);
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 4vh;
      left: 0;
      background: rgba(255, 255, 255, 0);
      height: 15px;
      width: 15px;
      border-top-left-radius: 15px;
      box-shadow: -5px -5px 0 2px #175fa3;
    }



    .border {
      border-bottom-right-radius: 10px;
      height: 4vh;
      width: 70%;
      background: #175FA3;
      position: relative;
      transform: skew(-20deg);
      box-shadow: -10px -10px 0 0 #175fa3;

      &::before {
        content: "";
        position: absolute;
        width: 15px;
        height: 15px;
        top: 0;
        right: -15px;
        border-top-left-radius: 10px;
        box-shadow: -5px -5px 0 2px #175FA3;
      }

      .title-text {
        color: #ECF4FD;
        font-size: calc(0.8vw + 0.8vh);
        font-style: normal;
        text-align: center;
        line-height: 4vh;
        ;
      }

    }

    .icon {
      top: 0;
      right: 15%;
      transform: translateX(50%);

      width: 4vh;
      position: absolute;
      height: 4vh;
      //background-image: url('./icons/beach.png');
      background-size: contain;
    }



    .text {
      color: black;
      font-style: normal;
      font-weight: bolder;
      font-size: larger;
      padding: 5px;
      overflow: hidden
    }
  }
}
</style>

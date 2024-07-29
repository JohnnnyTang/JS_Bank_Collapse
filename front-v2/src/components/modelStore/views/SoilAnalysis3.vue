<template>
  <div class="dataInterpretation-container">
    <ModelTitleVue :ModelName="ModelName" />
    <div class="model-content-container">
      <div class="flow-container">
        <soilFlowChart></soilFlowChart>
      </div>

      <div class="model-run-container">

        <!-- <div class="model-run-title">{{ curRunModelName }}</div>
        <div class="model-run-content">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita, animi?
        </div> -->

        <!-- back -->
        <div class="model-run-back-container">
          <div class="model-input-container">
            <div class="map-block flex-coloum">
              <div class="card">
                <div class="title">评估断面选择</div>
                <sectionDraw></sectionDraw>
              </div>
            </div>
            <div class="parameter-block flex-row">
              <div class="card">
                <div class="title">模型参数配置</div>
                <div>
                  <div class="form-block flex-row">
                    <div class="x-z-form">
                      <div class="input-text-container" v-for="i in 15">
                        <span>X坐标：</span><input type="number" v-model="x" />
                      </div>
                    </div>
                    <div class="thicknessAndFlowElev">

                    </div>
                  </div>
                  <div class="chart-block">

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="model-output-container">
            <div class="chart-block">

            </div>
            <div class="result-block">

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import ModelTitleVue from '../ModelTitle.vue'
import soilFlowChart from '../soilAnalysis/soilFlowChart.vue';
import sectionDraw from '../soilAnalysis/sectionDraw.vue'

const ModelName = '风险预警模型'


const curRunModelName = ref('评估断面选择')

const switchPage = (modelLabel) => {
  curRunModelName.value = modelLabel
}




onMounted(() => {


})


</script>











<style lang="scss" scoped>
@keyframes slideBackgroundColor {
  0% {
    background-position: 0% 0%;
  }

  50% {
    background-position: 100% 100%;
  }

  100% {
    background-position: 0% 0%;
  }
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

div.text {
  width: 50%;
  font-size: calc(0.5vh + 0.5vw);
  font-weight: 600;
  font-family: 'Microsoft YaHei';
  color: white;
  text-align: center;
}

div.flex-coloum {
  display: flex;
  flex-direction: column;
}

div.flex-row {
  display: flex;
  flex-direction: row;
}

div.title {
  position: relative;
  width: 98%;
  height: 4vh;
  line-height: 4vh;
  font-size: calc(0.6vw + 0.7vh);
  font-weight: bold;
  text-align: center;
  margin-left: 1%;
  border-bottom: 3px solid #2a4ac9;
  color: #0e14cf;
  user-select: none;
}

div.card {
  position: relative;
  margin-top: 0.5vh;
  margin-left: 0.2vw;
  width: 98%;
  height: 98%;
  background-color: #fff6e1;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgb(95, 95, 95);
  border: #14141434 1px solid;
  overflow: hidden;
}


div.dataInterpretation-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100vw;
  height: 92vh;
  overflow: hidden;
  flex-direction: column;
  background: linear-gradient(to bottom right, #477ab1, #2aa9c9, #7a7cad);
  background-size: 200% 200%;
  animation: slideBackgroundColor 4s ease infinite;

  div.model-content-container {
    width: 100%;
    height: 85vh;
    padding-top: 1vh;
    overflow: hidden;
    display: flex;
    flex-flow: column wrap;
    justify-content: space-around;
    align-content: space-around;

    div.model-flow-container {
      position: relative;
      width: 24vw;
      height: 85vh;
      background-color: rgb(255, 255, 255);
    }

    div.model-run-container {
      position: relative;
      width: 75vw;
      height: 85vh;

      background-color: #d1e7ff;
      border-radius: 5px;
      overflow: hidden;

      div.model-run-title {
        width: 74vw;
        height: 6vh;
        line-height: 6vh;
        font-size: calc(0.8vw + 1.2vh);
        font-weight: bold;
        text-align: center;

        margin-left: 0.5vw;

        border-bottom: 3px solid #2a4ac9;
        color: #0e14cf;
      }

      div.model-run-content {
        height: 79vh;
        width: 75vw;

        // background-color: #2a4ac9;
      }

      div.model-run-back-container {

        position: relative;
        width: 100%;
        height: 100%;
        background-color: beige;

        div.model-input-container {
          position: relative;
          width: 100%;
          height: 50%;
          display: flex;
          flex-direction: row;

          div.map-block {
            position: relative;
            width: 30%;
            height: 100%;
            background-color: #fff8e1;
          }

          div.parameter-block {
            position: relative;
            width: 70%;
            height: 100%;
            background-color: #fff9e3;
            display: flex;
            flex-direction: row;

            div.form-block {
              position: relative;
              width: 50%;
              height: 100%;

              div.x-z-form {
                position: relative;
                width: 50%;
                height: 100%;
              }

              div.thicknessAndFlowElev {
                position: relative;
                width: 50%;
                height: 100%;
              }

            }

            div.chart-block {
              position: relative;
              width: 50%;
              height: 100%;
              background-color: #ffffff;
            }
          }
        }

        div.model-output-container {
          position: relative;
          width: 100%;
          height: 50%;
          background-color: rgb(126, 126, 125);
          display: flex;
          flex-direction: row;

          div.chart-block {
            position: relative;
            width: 35%;
            height: 100%;
            background-color: #2aa9c9;
          }

          div.result-block {
            position: relative;
            width: 65%;
            height: 100%;
            background-color: #c3e4ec;
          }
        }

      }

    }
  }
}
</style>

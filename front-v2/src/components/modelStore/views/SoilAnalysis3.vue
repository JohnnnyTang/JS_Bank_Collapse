<template>
  <div class="dataInterpretation-container">
    <ModelTitleVue :ModelName="'土体变形分析模型'" />
    <div class="model-content-container">
      <div class="flow-container">
        <soilFlowChart></soilFlowChart>
      </div>

      <div class="model-run-container">

        <div class="section-page" v-show="currentPage == '1'">
          <div class="card" style="width: 100%;">
            <div class="title">评估断面选择
              <div class="smaller" @click="switch2('main')"></div>
            </div>
            <div class="model-run-content" id="tab-section-parent"></div>
          </div>
        </div>

        <div class="param-page" v-show="currentPage == '2'">
          <div class="card" style="width: 100%;">
            <div class="title">断面、土壤分层参数配置
              <div class="smaller" @click="switch2('main')"></div>
            </div>
            <div class="model-run-content flex-coloum">
              <div class="form-block flex-coloum">

                <div class="detail-bank-profile">
                  <div class="title2">断面测点详情</div>
                  <div class="xz-table flex-row">
                    <div class="table head">
                      <div class="row">
                        <div class="cell head">Station(m)</div>
                      </div>
                      <div class="row">
                        <div class="cell head">Elevation(m)</div>
                      </div>
                    </div>

                    <div class="table">
                      <div class="row">
                        <div class="cell" v-for="(item, index) in xzData" :key="index">{{ keepFloat2(item[0]) }}</div>
                      </div>
                      <div class="row">
                        <div class="cell" v-for="(item, index) in xzData" :key="index">{{ keepFloat2(item[1]) }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="soil-layer-profile flex-coloum">
                  <div class="title2">土壤分层详情</div>

                  <div class="content flex-row">
                    <div class="keyValue flex-row" v-for="i in 5">
                      <div class="key">{{ thicknessName[i - 1] }}</div>
                      <div class="value">{{ keepFloat2(thicknessData[i - 1]) }}</div>
                    </div>
                  </div>
                </div>

                <div class="right-block flex-coloum">
                  <div class="half-block flex-coloum">
                    <div class="title2">潮位参数配置</div>
                    <div class="content one-center">
                      <div class="keyValue flex-row">
                        <div class="key">elevation of Flow</div>
                        <!-- <div class="value">1</div> -->
                        <input type="text" class="value" placeholder="请输入潮位">
                      </div>
                    </div>
                  </div>
                  <div class="half-block one-center">
                    <div class="run-button one-center">
                      运行模型
                    </div>
                  </div>
                </div>

              </div>
              <div class="chart-block">
                <div ref="chartdom" id="chart"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- back -->
        <div class="model-run-back-container" v-show="currentPage == '0'">
          <div class="model-input-container">
            <div class="map-block flex-coloum">
              <div class="card" id="main-section-parent" style="margin-left: 1vw;">
                <div class="title">评估断面选择
                  <div class="bigger" @click="switch2('section')"></div>
                </div>
                <sectionDraw ref="sectionDrawRef"></sectionDraw>
              </div>
            </div>
            <div class="parameter-block flex-row">
              <div class="model-arror a1">
              </div>
              <div class="card flex-coloum" style="width: 45vw;margin-left: 6vw;">
                <div class="title">断面、土壤分层参数配置
                  <div class="bigger" @click="switch2('params')"></div>
                </div>
                <div class="content flex-row">
                  <div class="one-center" style="position: relative;width: 35%; height: 100%;">
                    <div class="image-card" style="background-image: url('/sa/part1_1.png'); width: 15vw; height: 35vh;">
                    </div>
                  </div>

                  <div class="one-center" style="position: relative;width:55%; height: 100%;">
                    <div class="image-card" style="background-image: url('/sa/part1_2.png'); width: 30vw; height: 35vh;">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="model-output-container">
            <div class="chart-block">
              <div class="card" style="width: 30vw;">
                <div class="title">土体崩塌过程计算结果
                  <div class="image-card"
                    style="background-image: url('/sa/part3_2.png'); width: 30vw; height: 35vh; margin-top: 1vh;margin-left: 1vw;">
                  </div>
                </div>
              </div>
            </div>
            <div class="result-block">
              <div class="card" style="width: 41vw;margin-left: 7vw;">
                <div class="title">土体稳定系数计算结果
                  <div class="image-card"
                    style="background-image: url('/sa/part4_2.png'); width: 17vw; height: 25vh; margin-top: 1vh; margin-left: 1vw;">
                  </div>
                  <div class="warn-status-container">
                    <div class="warn-status-title">当前断面风险状态</div>
                    <div class="warn-status-content high">高风险</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from 'vue'
import ModelTitleVue from '../ModelTitle.vue'
import soilFlowChart from '../soilAnalysis/soilFlowChart.vue';
import sectionDraw from '../soilAnalysis/sectionDraw.vue'
import { getTestData } from '../soilAnalysis/chart'
import sectionChart from '../soilAnalysis/chart copy'

const currentPage = ref('2')
const sectionDrawRef = ref(null)
const chartdom = ref(null)


const thicknessData = ref([1.93, -4.07, -11.57, -26.57, -36.57])
const thicknessName = ['Layer1', 'Layer2', 'Layer3', 'Layer4', 'Layer5']
const xzData = ref([
  [
    4.558842192636803e-11,
    -1.2148850368295108
  ],
  [
    38.10376216666087,
    -1.2429049979040028
  ],
  [
    76.20752433327615,
    -1.2259330622439175
  ],
  [
    114.31128649989144,
    -1.259806958700206
  ],
  [
    152.41504866650672,
    -1.2611951002238697
  ],
  [
    190.51881083312202,
    -1.3152647034596443
  ],
  [
    228.6225729997373,
    -1.4663700476224946
  ],
  [
    266.72633516635256,
    -1.6060859011160848
  ],
  [
    304.83009733296785,
    -3.032057199133465
  ],
  [
    342.93385949958315,
    -3.3242398937408764
  ],
  [
    381.03762166619845,
    -3.4983403331779157
  ],
  [
    419.1413838328137,
    -4.124987050220527
  ],
  [
    457.245145999429,
    -4.851273410394535
  ],
  [
    495.3489081660443,
    -6.5910771797927366
  ],
  [
    533.4526703326595,
    -8.942828967567108
  ],
  [
    571.5564324992748,
    -12.24843115675129
  ],
  [
    609.6601946658901,
    -16.29660691373699
  ],
  [
    647.7639568325054,
    -20.083224500410033
  ],
  [
    685.8677189991207,
    -23.861599173246326
  ],
  [
    723.971481165736,
    -27.125650170028873
  ],
  [
    762.0752433323513,
    -28.320095015823984
  ],
  [
    800.1790054989665,
    -29.132909224573726
  ],
  [
    838.2827676655818,
    -29.25361011534611
  ]
])





const switch2 = (name) => {
  let modelRunContent = document.querySelector('#tab-section-parent');
  let mainSectionParent = document.querySelector('#main-section-parent');
  let sectionDraw = document.querySelector('#section-draw-container');
  if (name == 'section') {
    currentPage.value = '1'
    if (modelRunContent && sectionDraw) {
      modelRunContent.appendChild(sectionDraw);
    }
  } else if (name == 'params') {
    currentPage.value = '2'
  } else if (name == 'main') {
    currentPage.value = '0'
    if (modelRunContent && sectionDraw) {
      mainSectionParent.appendChild(sectionDraw);
    }
  }
  sectionDrawRef.value.resizeMap()
}

onMounted(async () => {
  // m(chartdom.value)
  let data = await getTestData()
  console.log(data)
  let chart = reactive(new sectionChart(chartdom.value, {
    pointData: data.pointData,
    thicknessData: data.thicknessData,
    lineData: data.lineData
  }))
  chart.initBaseChart()
  chart.initGraphic()


  watch(() => chart.newDataInfo, (e) => {
    // console.log('new value!', e)
    // thicknessData.value = e.thicknessData.map(item => keepFloat2(item))
    // xzData.value = e.pointData.map(item => keepFloat2(item))

    console.log(e.thicknessData)
    thicknessData.value = e.thicknessData.sort((a, b) => b - a)
    xzData.value = e.pointData.sort((a, b) => a[0] - b[0])
  }, {
    deep: true
  })


})



const keepFloat2 = (num) => {
  return Math.round(num * 100) / 100
}

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
  font-size: calc(0.8vw + 0.7vh);
  font-weight: bold;
  text-align: center;
  margin-left: 1%;
  border-bottom: 3px solid #2a4ac9;
  color: #0e14cf;
  user-select: none;

  div.bigger {
    position: absolute;
    right: 0;
    top: 0;
    background-image: url('/icons/full.png');
    background-size: contain;
    width: 2vw;
    height: 2vw;
    cursor: pointer;
  }

  div.smaller {
    position: absolute;
    right: 0;
    top: 0;
    background-image: url('/back.png');
    background-size: contain;
    width: 2vw;
    height: 2vw;
    cursor: pointer;
  }
}

div.title2 {
  position: relative;
  width: fit-content;
  font-size: calc(0.7vw + 0.6vh);
  font-weight: bold;
  text-align: left;
  margin-bottom: 2px;
  color: #0e14cf;
  user-select: none;
  text-shadow: 1px 3px 8px rgba(134, 255, 245, 0.71);
}


div.content {
  position: relative;
  flex-grow: 1;
}

div.one-center {
  position: relative;
  display: grid;
  place-items: center;
}

div.image-card {
  position: relative;
  // box-shadow: 9px 11px 10px 1px rgba(0, 60, 170, 0.315);
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  background-size: contain;
  background-repeat: no-repeat;
}

div.card {
  position: relative;
  margin-top: 0.5vh;
  margin-left: 0.2vw;
  width: 98%;
  height: 98%;
  background-color: #ffffff8f;
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
  background: linear-gradient(to bottom right, rgb(91, 219, 209), rgb(35, 119, 247));
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
      // background-color: rgb(255, 255, 255);
    }

    div.model-run-container {
      position: relative;
      width: 74.4vw;
      height: 85vh;
      border: 5px solid;
      padding: 3px;
      border-image: repeating-linear-gradient(to bottom right, #fdfeff81, #97b1ff73, #b0ffe7, rgba(3, 175, 255, 0.459)) 20;
      border-radius: 10px;
      overflow: hidden;

      div.section-page {}

      div.param-page {}

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

        .form-block {
          position: relative;
          width: 98%;
          height: 30%;
          margin-left: 0.1vw;
          // background-color: #2a4ac9;
          border: #0000ff7e 5px dashed;
          border-radius: 10px;

          .detail-bank-profile {

            position: relative;
            width: 80%;
            height: 70%;
            padding: 10px;
            margin: 5px;
            background-color: rgb(212, 239, 254);
            border-radius: 10px;


            .title2 {
              position: relative;
              width: fit-content;
              height: 30%;
            }

            .xz-table {
              position: relative;
              width: 100%;
              height: 70%;

              .table {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;

                &.head {
                  width: 4vw;
                  margin-right: .2vw;
                }

                .row {
                  position: relative;
                  width: 100%;
                  flex: 1;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;

                }

                .cell {
                  height: 2.5vh;
                  flex: 1;
                  // border: 1px solid rgb(201, 201, 201);
                  border-right: 2px solid rgb(2, 143, 199);
                  border-bottom: 1px solid rgb(5, 88, 121);
                  border-radius: 5px;

                  display: grid;
                  place-items: center;
                  font-size: calc(0.3vw + 0.3vh);
                  transition: .3s ease-in-out;

                  &:nth-child(even) {
                    color: rgb(44, 61, 212);
                    background-color: #ffffff;
                  }

                  &:nth-child(odd) {
                    color: white;
                    background-color: rgba(44, 61, 212, 0.527);
                  }

                  &:hover {
                    background-color: rgb(44, 61, 212);
                    color: white;
                    font-weight: bold;
                  }

                  &.head {
                    background-color: #0e14cf;
                    font-size: calc(0.4vw + 0.3vh);
                  }
                }


              }
            }

          }

          .soil-layer-profile {

            position: relative;
            width: 80%;
            height: 30%;
            padding: 10px;
            margin: 5px;
            background-color: rgb(212, 239, 254);
            border-radius: 10px;

            .content {

              justify-content: space-evenly;
              align-items: center;

              .keyValue {
                position: relative;
                justify-content: center;
                align-items: center;
                width: 8vw;
                height: 4vh;

                .key {
                  height: 2.5vh;
                  flex: 0.3;
                  display: grid;
                  place-items: center;
                  font-size: calc(0.3vw + 0.3vh);
                  transition: .3s ease-in-out;
                  border-right: 2px solid rgb(2, 143, 199);
                  border-bottom: 1px solid rgb(5, 88, 121);
                  border-radius: 5px;
                  background-color: rgb(44, 61, 212);
                  font-weight: bold;
                  color: white;
                }

                .value {
                  height: 2.5vh;
                  flex: 0.7;
                  border-right: 2px solid rgb(2, 143, 199);
                  border-bottom: 1px solid rgb(5, 88, 121);
                  border-radius: 5px;
                  display: grid;
                  place-items: center;
                  font-size: calc(0.4vw + 0.4vh);
                  transition: .3s ease-in-out;
                  background-color: #ffffff;
                  color: rgb(44, 61, 212);

                }
              }

            }

          }

          .right-block {
            position: absolute;
            width: 18%;
            height: 100%;
            right: 0;
            top: 0;

            .half-block {
              position: relative;
              width: 90%;
              height: 50%;
              padding: 10px;
              margin: 5px;
              background-color: rgb(212, 239, 254);
              border-radius: 10px;

              .keyValue {
                position: relative;
                justify-content: center;
                align-items: center;
                width: 10vw;
                height: 4vh;

                .key {
                  height: 2.5vh;
                  width: 65%;
                  margin-right: .5vw;
                  display: grid;
                  place-items: center;
                  font-size: calc(0.5vw + 0.3vh);
                  transition: .3s ease-in-out;
                  border-right: 2px solid rgb(2, 143, 199);
                  border-bottom: 1px solid rgb(5, 88, 121);
                  border-radius: 5px;
                  background-color: rgb(44, 61, 212);
                  font-weight: bold;
                  color: white;
                }

                .value {
                  height: 2.5vh;
                  // flex: 0.4;
                  width: 33%;

                  border-right: 2px solid rgb(2, 143, 199);
                  border-bottom: 1px solid rgb(5, 88, 121);
                  border-radius: 5px;
                  display: grid;
                  place-items: center;
                  font-size: calc(0.4vw + 0.4vh);
                  transition: .3s ease-in-out;
                  background-color: #ffffff;
                  color: rgb(44, 61, 212);

                }
              }

              .run-button {
                position: relative;
                width: 9vw;
                height: 7vh;
                background-color: #b8e9ff;
                border-right: 12px solid rgb(2, 143, 199);
                border-bottom: 8px solid rgb(87, 179, 216);
                border-radius: 5px;
                transition: .1s ease-in-out;
                cursor: pointer;
                font-size: calc(0.7vw + 0.6vh);
                font-weight: 700;

                color: rgb(23, 87, 112);
                text-shadow: 0px 0px 5px #b4f1f1;
                background-color: #b8e9ff;

                &:active {
                  border-right: 6px solid rgb(2, 143, 199);
                  border-bottom: 4px solid rgb(87, 179, 216);
                }


              }




            }

          }


        }

        .chart-block {
          position: relative;
          width: 100%;
          height: 70%;

          #chart {
            position: relative;
            width: 100%;
            height: 100%;
            background-color: white;
          }
        }

      }

      div.model-run-back-container {

        position: relative;
        width: 100%;
        height: 100%;

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
          }

          div.parameter-block {
            position: relative;
            width: 70%;
            height: 100%;
            display: flex;
            flex-direction: row;

            div.model-arror {
              position: absolute;
              transform: rotate(0deg);
              z-index: 2;
              background-image: url('/modelArror.png');
              background-size: contain;
              width: 10vw;
              height: 10vw;

              &.a1 {
                top: 13vh;
                left: -2vw;
              }
            }
          }
        }

        div.model-output-container {
          position: relative;
          width: 100%;
          height: 50%;
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

            div.warn-status-container {
              position: absolute;
              right: 1vw;
              top: 6vh;
              width: 14vw;
              height: 10vh;

              background-color: #000cbbd5;
              backdrop-filter: blur(8px);
              z-index: 3;
              border-radius: 6px;
              text-align: center;
              overflow: hidden;

              box-shadow: 4px 6px 6px -4px rgb(0, 47, 117);

              div.warn-status-title {
                height: 4vh;
                line-height: 4vh;
                width: 14vw;
                font-size: calc(0.8vw + 0.3vh);
                font-weight: bold;
                color: #e3f9ff;
                box-shadow: 0px 2px rgb(0, 225, 255);
              }

              div.warn-status-content {
                height: 6vh;
                line-height: 6vh;
                width: 14vw;
                font-size: calc(1.1vw + 0.8vh);
                font-weight: bold;
                // background-color: #2688f8;
                color: #ebf8ff;
                text-align: cen;
                letter-spacing: 1rem;
                text-indent: 1rem;

                &.low {
                  background-color: rgb(17, 17, 255);
                }

                &.middle {
                  background-color: rgb(220, 126, 37);
                }

                &.high {
                  background-color: rgb(255, 9, 9);
                }
              }
            }
          }
        }

      }

    }
  }
}
</style>

<template>
    <div class="dataInterpretation-container">
        <ModelTitleVue
            :ModelName = "ModelName"
        />
        <div class="model-content-container">
            <div class="model-info-container">
              <ModelInfoVue
                :modelInfo="modelInfo"
              />
            </div>
            <div class="model-data-container">
              <div class="index-items-container">
                <div class="index-items-wrapper">
                  <IndexCardVue
                    v-for="(item, index) in indexDataList"
                    :title="item.title"
                    :data="item.data"
                    :key="index"
                  />
                </div>
              </div>
              <div class="calculate-panel-container">
                <div class="calculate-panel-wrapper">
                  <div class="calculate-input-container">
                    <div class="calculate-input-title">
                      <div class="input-title-icon">
                        <img src="/input.png" alt="input">
                      </div>
                      <div class="input-title-text">
                        风险预警模型因子选择
                      </div>
                    </div>
                    <div class="calculate-input-content">
                      <div class="main-character">
                        <div class="main-character-selector">
                          <div class="text">选择主因子 :</div>
                          <el-select
                            v-model="mainCharacter"
                            placeholder="请选择"
                            style="width: 60%"
                            size="small">
                            <el-option
                              v-for="item in mainCharacterList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </div>
                        <div class="main-character-setter">
                          <div class="text">主因子权重 :</div>
                          <el-input-number
                            v-model="mainCharacterValue"
                            :min="0" 
                            :max="1"
                            :step="0.01"
                            size="small"
                            style="width: 60%"
                            @change="MainCharacterValueChange" />
                        </div>
                      </div>
                      <div class="other-characters-and-matric">
                        <div class="other-characters">
                          <div class="other-characters-title">
                            <div class="text">各次因子权重 :</div>
                          </div>
                          <div class="other-characters-item">
                            <div class="text">透床流量当量 :</div>
                            <el-input-number
                              class="input-number"
                              v-model="Index1Value"
                              :min="0" 
                              :max="1"
                              :step="0.01"
                              size="small"
                              style="width: 50%"
                              @change="Index1ValueChange" />
                          </div>
                          <div class="other-characters-item">
                            <div class="text">流速指标 :</div>
                            <el-input-number
                              class="input-number"
                              v-model="Index2Value"
                              :min="0" 
                              :max="1"
                              :step="0.01"
                              size="small"
                              style="width: 50%"
                              @change="Index2ValueChange" />
                          </div>
                          <div class="other-characters-item">
                            <div class="text">水位变幅 :</div>
                            <el-input-number
                              class="input-number"
                              v-model="Index3Value"
                              :min="0" 
                              :max="1"
                              :step="0.01"
                              size="small"
                              style="width: 50%"
                              @change="Index3ValueChange" />
                          </div>
                          <div class="other-characters-item">
                            <div class="text">河道二次流 :</div>
                            <el-input-number
                              class="input-number"
                              v-model="Index4Value"
                              :min="0" 
                              :max="1"
                              :step="0.01"
                              size="small"
                              style="width: 50%"
                              @change="Index4ValueChange" />
                          </div>
                        </div>
                        <div class="matric">
                          <div class="matric-title">
                            <div class="text">指标权重判断矩阵 :</div>
                          </div>
                          <div class="matric-content">
                            <table>
                              <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                              <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="calculate-output-container">
                    <div class="calculate-output-title">
                      <div class="output-title-icon">
                        <img src="/output.png" alt="output">
                      </div>
                      <div class="output-title-text">
                        岸塌概率计算结果
                      </div>
                    </div>
                    <div class="calculate-output-content">
                      <div class="calculate-ratio-result">
                        <div class="ratio-result-title">
                          崩塌概率计算结果 :
                        </div>
                        <div class="ratio-result-content">
                          <table>
                              <tr>
                                <td>稳定概率</td>
                                <td>较稳定概率</td>
                              </tr>
                              <tr>
                                <td>0.13</td>
                                <td>0.21</td>
                              </tr>
                              <tr>
                                <td>较不稳定概率</td>
                                <td>不稳定概率</td>
                              </tr>
                              <tr>
                                <td>0.35</td>
                                <td>0.32</td>
                              </tr>
                            </table>
                        </div>
                      </div>
                      <div class="calculate-risk-matric">
                        <div class="risk-matric-title">
                          社会经济损失风险矩阵 :
                        </div>
                        <div class="risk-matric-content">
                          <table>
                              <tr>
                                <td>重要</td>
                                <td>重要</td>
                                <td>重要</td>
                              </tr>
                              <tr>
                                <td>一般</td>
                                <td>一般</td>
                                <td>一般</td>
                              </tr>
                              <tr>
                                <td>不重要</td>
                                <td>不重要</td>
                                <td>不重要</td>
                              </tr>
                            </table>
                        </div>
                      </div>
                      <div class="calculate-warning-grade">
                        <div class="warning-grade-text">
                          预警等级 : Ⅱ级风险
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
import { ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import ModelTitleVue from '../ModelTitle.vue';
import ModelInfoVue from '../ModelInfo.vue'
import IndexCardVue from '../IndexCard.vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const modelInfo = {
    application: route.query.application,
    usescene: route.query.usescene,
    input: route.query.input,
    output: route.query.output,
    processPicSrc:route.query.processPicSrc,
}

const ModelName = "风险预警模型"
const indexDataList = [
  {
    title:"指标1",
    data:[1,2,3,4,5]
  },
  {
    title:"指标2",
    data:[1,2,3,4,5]
  },
  {
    title:"指标3",
    data:[1,2,3,4,5]
  },
  {
    title:"指标4",
    data:[1,2,3,4,5]
  },
  {
    title:"指标5",
    data:[1,2,3,4,5]
  },
  {
    title:"指标6",
    data:[1,2,3,4,5]
  },
]

const mainCharacter = ref(null)
const mainCharacterList = [
{
    value: 1,
    label: '因子1',
  },
  {
    value: 2,
    label: '因子2',
  },
  {
    value: 3,
    label: '因子3',
  },
  {
    value: 4,
    label: '因子4',
  },
]

const mainCharacterValue = ref(0)
const MainCharacterValueChange = () => {
  if (mainCharacter.value == null ) {
    ElMessageBox.alert('尚未选择主因子', '警告', {
      confirmButtonText: 'OK',
      callback: (action) => {
        ElMessage({
          type: 'info',
          message: `action: ${action}`,
        })
      },
    })
    mainCharacterValue.value = 0
  }
}
const Index1Value = ref(0)
const Index2Value = ref(0)
const Index3Value = ref(0)
const Index4Value = ref(0)
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
el-input-number.input-number {
  width: 50%;
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
    height: 86vh;
    overflow: hidden;
    display: flex;
    flex-direction: row;

    div.model-info-container {
      width:30%;
      height: 86vh;
    }

    div.model-data-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-right: 5px;
      width: 70%;
      height: 86vh;
      // background-color: #2aa9c9;

      div.index-items-container {
        width: 100%;
        height: 60%;

        div.index-items-wrapper{
          display: flex;
          flex-direction: row;
          width: auto;
          max-width: 100%;
          height: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          border: 2px solid #ccc;
          border-radius: 10px;

          &::-webkit-scrollbar {
              height: 6px;
          }
          &::-webkit-scrollbar-track {
              background-color: rgba(38, 39, 39, 0.219); /* 设置滚动条轨道的背景颜色 */
          }
          &::-webkit-scrollbar-thumb {
              background-color: #c3cace94;
              border-radius: 5px;
          }
          &::-webkit-scrollbar-thumb:hover {
              background-color: #2b303081;
          }
        }  
      }
      
      div.calculate-panel-container {
        width: 100%;
        height: 40%;
        padding: 10px;
        // background-color: #2f33a5;

        div.calculate-panel-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;

          div.calculate-input-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 40%;
            height: 100%;
            margin-right: 5px;
            border: 2px solid #59bdc0;
            border-radius: 10px;
            background-color: rgba(1,35,89,0.7);

            div.calculate-input-title {
              width: 100%;
              height: 15%;
              display: flex;
              flex-direction: row;
              justify-content: left;
              align-items: center;
              margin-left: 15px;

              div.input-title-icon {
                width: 35px;
                height: 35px;
              }

              div.input-title-text {
                margin-left: 12px;
                font-size: calc(0.8vh + 0.8vw);
                font-weight: 600;
                font-family: 'Microsoft YaHei';
                color: #86eff3;
              }
            }

            div.calculate-input-content {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width:97%;
              height: 82%;
              border: #757474 2px solid;
              border-radius: 10px;
              // background-color: #babfc0;

              div.main-character {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                width:100%;
                height:30%;
                // background-color: #2aa9c9;

                div.main-character-selector {
                  display: flex;
                  flex-direction: row;
                  justify-content: center;
                  align-items: center;
                  width:47%;
                  height: 100%;
                }

                div.main-character-setter {
                  display: flex;
                  flex-direction: row;
                  justify-content: center;
                  align-items: center;
                  width:47%;
                  height: 100%;
                  margin-left: 15px;
                }

              }

              div.other-characters-and-matric {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                width:100%;
                height: 70%;
                // background-color: #4b448f;

                div.other-characters {
                  display: flex;
                  flex-direction: column;
                  width: 50%;
                  height: 100%;
                  // background-color: #59bdc0;

                  div.other-characters-title{
                    width: 100%;
                    height: 20%;
                  }

                  div.other-characters-item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    width: 100%;
                    height: 20%;
                  }
                }

                div.matric {
                  display: flex;
                  flex-direction: column;
                  width: 50%;
                  height: 100%;
                  // background-color: #babfc0;

                  div.matric-title {
                    width: 100%;
                    height: 15%;
                  }

                  div.matric-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 85%;

                    table {
                      width: 90%;
                      height: 50%;
                      border-collapse: collapse;
                    }

                    th, td {
                      border: 1px solid #000;
                      background-color: #bbe1e7;
                      padding: 10px;
                      text-align: center;
                    }
                  }
                }
              }
            }
          }

          div.calculate-output-container {
            display: flex;
            flex-direction: column;
            width: 60%;
            height: 100%;
            border: 2px solid #59bdc0;
            border-radius: 10px;
            background-color: rgba(1,35,89,0.7);

            div.calculate-output-title {
              width: 100%;
              height: 15%;
              display: flex;
              flex-direction: row;
              justify-content: left;
              align-items: center;
              margin-left: 10px;

              div.output-title-icon {
                width: 35px;
                height: 35px;
              }

              div.output-title-text {
                margin-left: 12px;
                font-size: calc(0.8vh + 0.8vw);
                font-weight: 600;
                font-family: 'Microsoft YaHei';
                color: #86eff3;
              }
            }

            div.calculate-output-content {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: row;
              width: 100%;
              height: 100%;
              // background-color: #2aa9c9;

              div.calculate-ratio-result {
                display: flex;
                flex-direction: column;
                align-items: center;
                width:34%;
                height: 96%;
                // border: #757474 2px solid;
                // border-radius: 10px;

                div.ratio-result-title{
                  width:100%;
                  height: 15%;
                  margin-left: 10px;
                  margin-top: 3px;
                  font-size: calc(0.6vh + 0.6vw);
                  font-weight: 600;
                  font-family: 'Microsoft YaHei';
                  color: #c6cfcf;
                }

                div.ratio-result-content{
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width:100%;
                  height: 85%;

                  table {
                    width: 90%;
                    height: 50%;
                    border-collapse: collapse;
                  }

                  th, td {
                    border: 1px solid #000;
                    background-color: #bbe1e7;
                    padding: 10px;
                    text-align: center;
                  }

                  .table-data {
                    &:nth-child(even) {
                      background-color: #f9f9f9; // 偶数行背景颜色
                    }
                    &:nth-child(odd) {
                      background-color: #fff; // 奇数行背景颜色
                    }
                  }
                }
              }

              div.calculate-risk-matric {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-left: 5px;
                width:33%;
                height: 96%;
                // border: #757474 2px solid;
                // border-radius: 10px;

                div.risk-matric-title{
                  width:100%;
                  height: 15%;
                  margin-left: 10px;
                  margin-top: 3px;
                  font-size: calc(0.6vh + 0.6vw);
                  font-weight: 600;
                  font-family: 'Microsoft YaHei';
                  color: #c6cfcf;
                }

                div.risk-matric-content {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width:100%;
                  height: 85%;

                  table {
                    width: 90%;
                    height: 50%;
                    border-collapse: collapse;
                  }

                  th, td {
                    border: 1px solid #000;
                    background-color: #bbe1e7;
                    padding: 10px;
                    text-align: center;
                  }
                }
                
              }

              div.calculate-warning-grade {
                width:30%;
                height: 100%;

                div.warning-grade-text {
                  margin-left: 10px;
                  margin-top: 3px;
                  font-size: calc(0.6vh + 0.6vw);
                  font-weight: 600;
                  font-family: 'Microsoft YaHei';
                  color: #c6cfcf;
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
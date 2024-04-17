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
                  <div class="part-card">
                    <div class="index-content">
                        <div class="index-content-title">
                            <div class="content-title-icon">
                                <img src="/index.png" alt="index">
                            </div>
                            <div class="content-title-text">
                              变形分析断面生成和参数设置
                            </div>
                            <div class="exchange-container" >
                                <div class="exchange-icon">
                                    <img
                                        src="/icons/switch.png"
                                        alt="exchange"
                                        @click="changePart1"
                                    >
                                </div>
                            </div>
                        </div>
                          <div class="index-content-description">
                            <div class="model-image-container1_1" v-if="JudgePart1==true">
                              <el-image
                                style="width: 100%; height: 100%"
                                :src="UrlPart1_1"
                                :zoom-rate="1.2"
                                :max-scale="7"
                                :min-scale="0.2"
                                :initial-index="4"
                                :preview-src-list="srcList1_1"
                                fit="cover"
                              />
                            </div>
                            <div class="model-image-container1_2" v-if="JudgePart1==false">
                              <el-image
                                style="width: 100%; height: 100%"
                                :src="UrlPart1_2"
                                :zoom-rate="1.2"
                                :max-scale="7"
                                :min-scale="0.2"
                                :initial-index="4"
                                :preview-src-list="srcList1_2"
                                fit="cover"
                              />
                            </div>
                        </div>
                    </div>
                  </div>
                  <div class="part-card">
                    <div class="index-content">
                      <div class="index-content-title">
                          <div class="content-title-icon">
                              <img src="/index.png" alt="index">
                          </div>
                          <div class="content-title-text">
                            坡脚冲刷过程计算
                          </div>
                          <div class="exchange-container" >
                            <div class="exchange-icon">
                                <img
                                    src="/icons/switch.png"
                                    alt="exchange"
                                    @click="changePart2"
                                >
                            </div>
                        </div>
                      </div>
                      <div class="index-content-description">
                        <div class="model-image-container2_1" v-if="JudgePart2==true">
                          <el-image
                            style="width: 100%; height: 100%"
                            :src="UrlPart2_1"
                            :zoom-rate="1.2"
                            :max-scale="7"
                            :min-scale="0.2"
                            :initial-index="4"
                            :preview-src-list="srcList2_1"
                            fit="cover"
                          />
                        </div>
                        <div class="model-image-container2_2" v-if="JudgePart2==false">
                          <el-image
                            style="width: 100%; height: 100%"
                            :src="UrlPart2_21"
                            :zoom-rate="1.2"
                            :max-scale="7"
                            :min-scale="0.2"
                            :initial-index="4"
                            :preview-src-list="srcList2_21"
                            fit="cover"
                          />
                          <el-image
                            style="width: 100%; height: 100%"
                            :src="UrlPart2_22"
                            :zoom-rate="1.2"
                            :max-scale="7"
                            :min-scale="0.2"
                            :initial-index="4"
                            :preview-src-list="srcList2_22"
                            fit="cover"
                          />
                          <el-image
                            style="width: 100%; height: 100%"
                            :src="UrlPart2_23"
                            :zoom-rate="1.2"
                            :max-scale="7"
                            :min-scale="0.2"
                            :initial-index="4"
                            :preview-src-list="srcList2_23"
                            fit="cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="part-card">
                    <div class="index-content">
                        <div class="index-content-title">
                            <div class="content-title-icon">
                                <img src="/index.png" alt="index">
                            </div>
                            <div class="content-title-text">
                              土体崩塌过程计算
                            </div>
                            <div class="exchange-container" >
                                <div class="exchange-icon">
                                    <img
                                        src="/icons/switch.png"
                                        alt="exchange"
                                        @click="changePart3"
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="index-content-description">
                          <div class="model-image-container3_1" v-if="JudgePart3==true">
                            <el-image
                              style="width: 100%; height: 100%"
                              :src="UrlPart3_1"
                              :zoom-rate="1.2"
                              :max-scale="7"
                              :min-scale="0.2"
                              :initial-index="4"
                              :preview-src-list="srcList3_1"
                              fit="cover"
                            />
                          </div>
                          <div class="model-image-container3_2" v-if="JudgePart3==false">
                            <el-image
                              style="width: 100%; height: 100%"
                              :src="UrlPart3_2"
                              :zoom-rate="1.2"
                              :max-scale="7"
                              :min-scale="0.2"
                              :initial-index="4"
                              :preview-src-list="srcList3_2"
                              fit="cover"
                            />
                          </div>
                        </div>
                    </div>
                  </div>
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
                        土体稳定系数计算
                      </div>
                      <div class="exchange-container" >
                                <div class="exchange-icon">
                                    <img
                                        src="/icons/switch.png"
                                        alt="exchange"
                                        @click="changePart4"
                                    >
                                </div>
                            </div>
                    </div>
                    <div class="calculate-input-content">
                      <div class="model-image-container4_1" v-if="JudgePart4==true">
                          <el-image
                            style="width: 100%; height: 100%"
                            :src="UrlPart4_1"
                            :zoom-rate="1.2"
                            :max-scale="7"
                            :min-scale="0.2"
                            :initial-index="4"
                            :preview-src-list="srcList4_1"
                            fit="cover"
                          />
                        </div>
                        <div class="model-image-container4_2" v-if="JudgePart4==false">
                          <el-image
                            style="width: 100%; height: 100%"
                            :src="UrlPart4_2"
                            :zoom-rate="1.2"
                            :max-scale="7"
                            :min-scale="0.2"
                            :initial-index="4"
                            :preview-src-list="srcList4_2"
                            fit="cover"
                          />
                        </div>
                    </div>
                  </div>
                  <div class="calculate-output-container">
                    <div class="calculate-output-title">
                      <div class="output-title-icon">
                        <img src="/output.png" alt="output">
                      </div>
                      <div class="output-title-text">
                        冲刷-崩塌过程演示
                      </div>
                      <div class="exchange-container" >
                                <div class="exchange-icon">
                                    <img
                                        src="/icons/switch.png"
                                        alt="exchange"
                                        @click="changePart5"
                                    >
                                </div>
                            </div>
                    </div>
                    <div class="calculate-output-content">
                      <div class="model-image-container5_1" v-if="JudgePart5==true">
                          <el-image
                            style="width: 100%; height: 100%"
                            :src="UrlPart5_1"
                            :zoom-rate="1.2"
                            :max-scale="7"
                            :min-scale="0.2"
                            :initial-index="4"
                            :preview-src-list="srcList5_1"
                            fit="cover"
                          />
                        </div>
                        <div class="model-image-container5_2" v-if="JudgePart5==false">
                          <el-image
                            style="width: 100%; height: 100%"
                            :src="UrlPart5_2"
                            :zoom-rate="1.2"
                            :max-scale="7"
                            :min-scale="0.2"
                            :initial-index="4"
                            :preview-src-list="srcList5_2"
                            fit="cover"
                          />
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
import { ElMessageBox, ElImage } from 'element-plus';
import ModelTitleVue from '../ModelTitle.vue';
import ModelInfoVue from '../ModelInfo.vue'
import IndexCardVue from '../IndexCard.vue';
import { infoItemList } from '../modelInfoList.js'

const modelInfo = {
    application: infoItemList[1].application,
    usescene: infoItemList[1].usescene,
    input: infoItemList[1].input,
    output: infoItemList[1].output,
    processPicSrc:infoItemList[1].processPicSrc,
}

const JudgePart1=ref(true)
const JudgePart2=ref(true)
const JudgePart3=ref(true)
const JudgePart4=ref(true)
const JudgePart5=ref(true)

const ModelName = "土体变形分析"

const UrlPart1_1 = "/temp/part1_1.png"
const srcList1_1 = ["/temp/part1_1.png"]
const UrlPart1_2 = "/temp/part1_2.png"
const srcList1_2 = ["/temp/part1_2.png"]
const UrlPart2_1 = "/temp/part2_1.png"
const srcList2_1 = ["/temp/part2_1.png"]
const UrlPart2_21 = "/temp/part2_21.png"
const srcList2_21 = ["/temp/part2_21.png"]
const UrlPart2_22 = "/temp/part2_22.png"
const srcList2_22 = ["/temp/part2_22.png"]
const UrlPart2_23 = "/temp/part2_23.png"
const srcList2_23 = ["/temp/part2_23.png"]
const UrlPart3_1 = "/temp/part3_1.png"
const srcList3_1 = ["/temp/part3_1.png"]
const UrlPart3_2 = "/temp/part3_2.png"
const srcList3_2 = ["/temp/part3_2.png"]
const UrlPart4_1 = "/temp/part4_1.png"
const srcList4_1 = ["/temp/part4_1.png"]
const UrlPart4_2 = "/temp/part4_2.png"
const srcList4_2 = ["/temp/part4_2.png"]
const UrlPart5_1 = "/temp/part5_1.gif"
const srcList5_1 = ["/temp/part5_1.gif"]
const UrlPart5_2 = "/temp/part5_2.png"
const srcList5_2 = ["/temp/part5_2.png"]

const changePart1 = () => {
  JudgePart1.value = !JudgePart1.value
}
const changePart2 = () => {
  JudgePart2.value = !JudgePart2.value
}
const changePart3 = () => {
  JudgePart3.value = !JudgePart3.value
}
const changePart4 = () => {
  JudgePart4.value = !JudgePart4.value
}
const changePart5 = () => {
  JudgePart5.value = !JudgePart5.value
}

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

          div.part-card {
            width: 33vw;
            height: 90%;
            margin: 15px;
            padding: 8px;
            border: 4px solid #6e9bc7;
            border-radius: 10px;
            background: rgba(220,250,239,0.4);
            overflow: hidden;
            box-shadow: #b4c8fc 5px 1px 8px 0px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: transform 0.5s;
            user-select: none;
            &:hover {
                // transform: scale(1.01);
                background-color:rgba(237, 239, 240, 0.5);
                cursor: pointer;
            }

            div.index-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                border-radius: 10px;

                div.index-content-title {
                    display: flex;
                    flex-direction: row;
                    margin-left: 5px;
                    width: 100%;
                    height: 10%;
                    border-bottom: #a231e4 3px solid;

                    div.content-title-icon {
                        width: 40px;
                        height: 40px;

                        img {
                            width: 100%;
                            height: 100%;
                            margin-left: 2px;
                            margin-top: 2px;
                        }
                    }

                    div.content-title-text {
                        margin-left: 12px;
                        font-size: calc(0.5vh + 1vw);
                        font-weight: 600;
                        font-family: 'Microsoft YaHei';
                        color: #a231e4;
                        text-shadow: 1px 0px 1px #8bcfdb, 0px 1px 1px #11ffc4, 2px 1px 1px #CCCCCC, 1px 2px 1px #0d60fa, 1px 2px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 3px 4px 1px #EEEEEE, 2px 1px 1px #CCCCCC, 2px 1px 1px #EEEEEE, 1px 2px 1px #CCCCCC, 1px 2px 1px #EEEEEE, 1px 2px 1px #0f41e7;
                    }

                    div.exchange-container {
                      // position: absolute;
                      display: flex;
                      margin-left: 10px;
                      margin-top: 5px;
                      width:25px;
                      height:25px;
                      // background-color: #ccc;
                      z-index: 10;

                      div.exchange-icon {
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          width: 100%px;
                          height: 100%px;
                          z-index: 10;
                          
                          img {
                              widows: 100%;
                              height: 100%;
                              object-fit:contain;
                              display: inline-block;
                              animation: floating 2s ease-in-out infinite;
                          }
                      }    
                    }
                }

                div.index-content-description {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 88%;
                    border: #a9dce2 2px solid;
                    border-radius: 10px;
                    margin-top: 7px;
                    margin-bottom: -10px;

                    div.model-image-container1_1 {
                      width: 85%;
                      height: auto;
                    }

                    div.model-image-container1_2 {
                      width: 85%;
                      height: auto;
                    }

                    div.model-image-container2_1 {
                      width: 98%;
                      height: auto;
                    }
                    
                    div.model-image-container2_2 {
                      width: 50%;
                      height: auto;
                    }

                    div.model-image-container2_3 {
                      width: 98%;
                      height: auto;
                    }

                    div.model-image-container3_1 {
                      width: 98%;
                      height: auto;
                    }

                    div.model-image-container3_2 {
                      width: 98%;
                      height: auto;
                    }
                  
                }
            }
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
            transition: transform 0.5s;
            &:hover {
                // transform: scale(1.01);
                background-color:rgba(56, 74, 77, 0.8);
                cursor: pointer;
            }

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

              div.exchange-container {
                      // position: absolute;
                      display: flex;
                      margin-left: 10px;
                      margin-top: 5px;
                      width:25px;
                      height:25px;
                      // background-color: #ccc;
                      z-index: 10;

                      div.exchange-icon {
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          width: 100%px;
                          height: 100%px;
                          z-index: 10;
                          
                          img {
                              widows: 100%;
                              height: 100%;
                              object-fit:contain;
                              display: inline-block;
                              animation: floating 2s ease-in-out infinite;
                          }
                      }    
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

              div.model-image-container4_1 {
                width: 98%;
                height: auto;
              }

              div.model-image-container4_2 {
                width: 67%;
                height: auto;
              }
            }
          }

          div.calculate-output-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 60%;
            height: 100%;
            border: 2px solid #59bdc0;
            border-radius: 10px;
            background-color: rgba(1,35,89,0.7);
            &:hover {
                // transform: scale(1.01);
                background-color:rgba(56, 74, 77, 0.8);
                cursor: pointer;
            }

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

              div.exchange-container {
                      // position: absolute;
                      display: flex;
                      margin-left: 10px;
                      margin-top: 5px;
                      width:25px;
                      height:25px;
                      // background-color: #ccc;
                      z-index: 10;

                      div.exchange-icon {
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          width: 100%px;
                          height: 100%px;
                          z-index: 10;
                          
                          img {
                              widows: 100%;
                              height: 100%;
                              object-fit:contain;
                              display: inline-block;
                              animation: floating 2s ease-in-out infinite;
                          }
                      }    
                    }
            }

            div.calculate-output-content {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: row;
              width: 100%;
              height: 100%;
              align-items: center;
              width:97%;
              height: 82%;
              border: #757474 2px solid;
              border-radius: 10px;

              div.model-image-container5_1 {
                width: 54%;
                height: auto;
              }

              div.model-image-container5_2 {
                width: 54%;
                height: auto;
              }
            }
          }
        }
      }
    }
  }
}

</style>
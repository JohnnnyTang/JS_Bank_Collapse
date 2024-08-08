<template>
  <div class="all">
    <ModelTitleVue :ModelName="'近岸演变分析模型'" />

    <div class="model-content-container">
      <div class="model-item-container">
        <div class="model-choice">
          <div class="basemap-radio-container">
            <input
              type="radio"
              id="radio-1"
              name="tabs"
              :checked="checky1"
              @click="radio1Click()"
            />
            <label class="tab" for="radio-1">近岸动力分析</label>
            <input type="radio" id="radio-2" name="tabs" :checked="checky2" />
            <label class="tab" for="radio-2">近岸演变分析</label>
            <span class="glider"></span>
          </div>
        </div>
        <div class="main-page">
          <div class="user-react">
            <div class="title">
              <div class="title-icon uricon"></div>
              <div class="title-text">模型配置</div>
            </div>
            <top-tool
              @returnFileList="returnFileList"
              @operateDraw="operateDraw"
              @analyse="analyse"
              @uploadHandle="drawHandle"
              :dataList="dataList"
            ></top-tool>
          </div>
          <el-skeleton :rows="5" animated class="bottom" v-if="skeletonFlag" />
          <data-manage
            class="top"
            ref="dataManage"
            :dataList="dataList"
            @operateLayer="operateLayer"
            @addCurrentModel="addCurrentModel"
            @updateCurrentModel="updateCurrentModel"
            v-else
          ></data-manage>
          <el-skeleton :rows="5" animated class="bottom" v-if="skeletonFlag" />
          <layer-manage
            class="bottom"
            ref="layerManage"
            :layerList="layerList"
            @closeLayer="closeLayer"
            @hideLayer="hideLayer"
            @moveLayer="moveLayer"
            v-else
          ></layer-manage>
        </div>

        <!-- <div class="left-resize" ref="leftResize"></div> -->
      </div>
      <el-skeleton :rows="5" animated v-if="skeletonFlag" />
      <right-visual
        :layerList="layerList"
        ref="rightMap"
        @drawHandle="drawHandle"
        v-else
      ></right-visual>
      <div class="model-status">
        <div class="show-model-status">模型运行</div>
        <div class="model-status-main" v-if="totalPages != 0">
          <div class="model-status-title">
            正在运行：{{ currentKey }}
            <div @click="prevPage" :disabled="currentIndex === 0">&lt;</div>
            <span>{{ currentIndex + 1 }}/{{ totalPages }}</span>
            <div @click="nextPage" :disabled="currentIndex === totalPages - 1">&gt;</div>
          </div>
          <div class="model-progress">
            <el-progress
              :percentage="modelProgressList[currentKey]"
              :stroke-width="15"
              striped
            />
          </div>
        </div>
        <div class="model-status-empty" v-else>当前没有正在运行的模型！</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onBeforeUnmount, onMounted, computed } from "vue";
import ModelTitleVue from "../ModelTitle.vue";
import ModelRequest from "../modelApi.js";
import TopTool from "../analysis-center/analysis/TopTool.vue";
import DataManage from "../analysis-center/analysis/DataManage.vue";
import LayerManage from "../analysis-center/analysis/LayerManage.vue";
import RightVisual from "../analysis-center/analysis/RightVisual.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: { ModelTitleVue, TopTool, RightVisual, DataManage, LayerManage },
});
</script>

<script setup>
const skeletonFlag = ref(true);
const dataList = ref([]);
const layerList = ref([]);
const rightMap = ref();
const dataManage = ref();
const layerManage = ref();

const checky1 = ref(false);
const checky2 = ref(true);
const router = useRouter();

const modelProgressList = ref({});
const currentIndex = ref(0);
// {
//     fileId: string;
//     fileName: string;
//     dataListId: string;
//     dataListName: string;
//     visualType: string;
//     visualId: string;
// }[]
const returnFileList = (val) => {
  dataManage.value.addData(val);
};

// {
//   type: string,
//   content: {
//     id: string,
//     name: string,
//     label: string,
//     visualType: string,
//     visualId: string,
//   },
// }
const operateLayer = (val) => {
  if (val.type === "add") {
    layerManage.value.addLayer(val.content);
    rightMap.value.addMapLayer(val.content);
  } else if (val.type === "del") {
    layerManage.value.delLayer(val.content.id);
    rightMap.value.removeLayer(val.content.id);
  } else if (val.type === "chart") {
    rightMap.value.addChart(val.content);
  }
};

const closeLayer = (val) => {
  rightMap.value.removeLayer(val);
};

//{ id: string; flag: boolean }
const hideLayer = (val) => {
  rightMap.value.changeLayerState(val);
};

//{ drop: string; target: string }
const moveLayer = (val) => {
  rightMap.value.moveLayer(val);
};

const operateDraw = (val) => {
  rightMap.value.operateDraw(val);
};

// val: {
//   id: string,
//   geoJson: any,
//   visualType: string,
//   fileName: string,
// }
const drawHandle = async (val) => {
  const param = await dataManage.value.addDrawData(val);
  layerManage.value.addLayer(param);
  rightMap.value.addMapLayer(param);
};

const analyse = async (val) => {
  await dataManage.value.addAnalyse(val);
};

const radio1Click = () => {
  router.push("/modelStore/stabilityAnalysis");
};

const addCurrentModel = (name) => {
  modelProgressList.value[name] = 0;
  console.log(modelProgressList.value);
};

const updateCurrentModel = (name, status) => {
  if (status == 0) {
    delete modelProgressList.value[name];
  } else if (status == -1) {
    delete modelProgressList.value[name];
  } else if (status == 1) {
    modelProgressList.value[name] += 5;
  }
};

// 分页逻辑
const keys = computed(() => {
  return Object.keys(modelProgressList.value);
});
const currentKey = computed(() => {
  return keys.value[currentIndex.value];
});
const currentValue = computed(() => {
  return modelProgressList.value[currentKey.value];
});
const totalPages = computed(() => {
  return keys.value.length;
});
const prevPage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};
const nextPage = () => {
  if (currentIndex.value < totalPages.value - 1) {
    currentIndex.value++;
  }
};

onMounted(async () => {
  dataList.value = [
    {
      id: "935809d3-f8de-45df-a2ee-b3cfebfbbf6b",
      label: "2006年长江南京以下DEM",
      flag: true,
      children: [
        {
          id: "294222ef-2dd2-446f-a484-b14659eeeaa7",
          label: "w001001.adf",
          flag: false,
          children: [],
          visualType: "rasterTile",
        },
      ],
    },
    {
      id: "30c14195-bfe7-47e4-ac06-70991392409c",
      label: "2004年长江南京以下DEM",
      flag: true,
      children: [
        {
          id: "200408_dem/w001001.adf",
          label: "w001001.adf",
          flag: false,
          children: [],
          visualType: "rasterTile",
        },
      ],
    },
    {
      id: "25edd8fa-92c9-49ce-b77b-8d65667b9dd4",
      label: "1998年长江南京以下DEM",
      flag: true,
      children: [
        {
          id: "199801_dem/w001001.adf",
          label: "w001001.adf",
          flag: false,
          children: [],
          visualType: "rasterTile",
        },
      ],
    },
  ];
  // TODO: sessionstorage获得图层列表
  // const res = await ModelRequest.getLayersInfo(import.meta.env.VITE_APP_ROUTER_ID);
  // if (res != null && res.code === 0) {
  //   layerList.value = res.data;
  // }
  // const data = window.sessionStorage.getItem("layerList");
  // if (data != null) layerList.value = JSON.parse(data);
  skeletonFlag.value = false;

  // let runningStatusInterval = setInterval(async () => {
  //   let randomFactor = 3.0;

  //   if (modelRunnningProgress.value < 88) randomFactor = 1.0;
  //   if (modelRunnningProgress.value > 88) randomFactor = 0.5;
  //   if (modelRunnningProgress.value > 95) randomFactor = 0.1;

  //   let nextProgress =
  //     Math.round((modelRunnningProgress.value + Math.random() * randomFactor) * 100) /
  //     100;
  //   nextProgress = nextProgress > 95 ? 95 : nextProgress;
  //   modelRunnningProgress.value = nextProgress;
  // }, 1000);
});

onBeforeUnmount(() => {
  window.sessionStorage.setItem("layerList", JSON.stringify(layerList.value));
});
</script>

<style lang="scss">
div.all {
  width: 100vw;
  height: 92vh;
  position: relative;
  overflow: hidden;
}

div.model-content-container {
  position: relative;
  overflow: hidden;
  width: 100vw;
  height: calc(92vh - 6%);
  display: flex;
  flex-direction: row;

  div.model-item-container {
    width: 20vw;
    height: 87.4vh;
    position: relative;
    display: flex;
    flex-direction: column;

    div.model-choice {
      position: relative;
      height: 8vh;
      width: 100%;
      background-color: rgba(240, 248, 255, 0);
      display: flex;
      justify-content: center;
      align-items: center;

      .title-icon {
        z-index: 0;
        width: 4.5vh;
        height: 4.5vh;
        background-size: contain;
      }

      .el-popper.is-customized {
        z-index: 3;
        padding: 6px 12px;
        background: linear-gradient(90deg, rgb(179, 255, 171), rgb(204, 229, 129));
      }

      .el-popper.is-customized .el-popper__arrow::before {
        background: linear-gradient(45deg, #b2e68d, #bce689);
        right: 0;
        z-index: 3;
      }

      .detailIcon {
        width: 4.5vh;
        height: 4.5vh;
        background-size: contain;
        margin-left: 2.5vw;
        background-image: url("/icons/searching.png");
        z-index: 0;

        &:hover {
          cursor: pointer;
          transform: scale(1.03);
          transition: 500ms;
        }
      }

      .returnIcon {
        width: 4.5vh;
        height: 4.5vh;
        background-size: contain;
        margin-left: 2.5vw;
        background-image: url("/back.png");

        &:hover {
          cursor: pointer;
          transform: scale(1.03);
          transition: 500ms;
        }
      }

      div.basemap-radio-container {
        z-index: 1;
        width: 14vw;
        height: 4vh;
        display: flex;
        flex-flow: row nowrap;
        background-color: #fff;
        box-shadow: 0 0 4px 1px rgba(#0642b1, 0.55), 0 6px 12px 0 rgba(#0642b1, 0.55);
        padding: 0.6vh;
        border-radius: 0.6vw; // just a high number to create pill effect
        margin-right: auto;
        margin-left: 8px;

        * {
          z-index: 7;
        }

        input[type="radio"] {
          display: none;
        }

        .tab {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 4vh;
          width: 7vw;
          font-size: calc(0.8vw + 0.5vh);
          font-weight: 600;
          border-radius: 1.6rem; // just a high number to create pill effect
          cursor: pointer;
          transition: color 0.15s ease-in;
        }

        input[type="radio"] {
          &:checked {
            & + label {
              color: #185ee0;
            }
          }
        }

        input[id="radio-1"] {
          &:checked {
            & ~ .glider {
              transform: translateX(0);
            }
          }
        }

        input[id="radio-2"] {
          &:checked {
            & ~ .glider {
              transform: translateX(100%);
            }
          }
        }

        input[id="radio-3"] {
          &:checked {
            & ~ .glider {
              transform: translateX(200%);
            }
          }
        }

        .glider {
          position: absolute;
          display: flex;
          height: 4vh;
          width: 7vw;
          background-color: #bcd8fc;
          z-index: 5;
          border-radius: 0.6vw; // just a high number to create pill effect
          transition: 0.4s cubic-bezier(0.68, -0.25, 0.265, 1.25);
        }

        // @media (max-width: 700px) {
        //     .tabs {
        //         transform: scale(0.6);
        //     }
        // }
      }
    }

    div.main-page {
      width: 20vw;
      height: calc(87.4vh - 8vh);
      display: flex;
      flex-direction: column;
      user-select: none;

      div.title-icon {
        height: 4vh;
        width: 4vh;
        line-height: 5vh;
        margin-right: 1vw;
        background-size: contain;
        z-index: 1;
      }

      div.title {
        height: 5vh;
        width: 100%;
        background: linear-gradient(90deg, rgb(187, 239, 248), rgb(29, 128, 214));
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .title-text {
          color: white;
          text-shadow: 5px 5px 0 #4074b5, 2px -2px 0 #4074b5, -2px 2px 0 #4074b5,
            -2px -2px 0 #4074b5, 2px 0px 0 #4074b5, 0px 2px 0 #4074b5, -2px 0px 0 #4074b5,
            0px -2px 0 #4074b5;
        }
      }

      div.user-react {
        height: 15vh;
        width: 100%;
        background-color: aliceblue;

        .title {
          .uricon {
            background-image: url("/data.png");
          }

          .title-text {
            font-size: calc(1vw + 0.5vh);
            font-weight: 600;
            text-align: center;
            line-height: 5vh;
            letter-spacing: 0.1vw;
          }
        }

        .buttons {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-evenly;

          .button {
            background-color: #4c97fa;
            padding: 0.3vh;
            border-radius: 0.5vh;
            border-color: white;
            border-width: 0.5vh;
            height: 3vh;
            width: 8vw;
            color: white;
            font-size: calc(0.8vw + 0.5vh);
            font-weight: 600;
            margin-left: 1vw;
            margin: 0.7vh;
            // text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;

            &:hover {
              cursor: pointer;
              background-color: #0642b1;
              transform: scale(1.01);
              box-shadow: #00183d 0px 0px 5px 0px;
              transition: 0.2s ease-in;
            }
          }
        }
      }

      div.data-panel {
        height: 35vh;
        width: 100%;

        .title {
          .dpicon {
            background-image: url("/data-collection2.png");
          }

          .title-text {
            font-size: calc(1vw + 0.5vh);
            font-weight: 600;
            text-align: center;
            line-height: 5vh;
          }
        }

        .dp-content {
          height: 30vh;
          overflow-x: hidden;
          overflow-y: scroll;
          padding: 1vh;

          &::-webkit-scrollbar {
            width: 8px;
          }

          &::-webkit-scrollbar-track {
            background-color: rgba(6, 181, 197, 0.219);
          }

          &::-webkit-scrollbar-thumb {
            background-color: #15a1e294;
            border-radius: 5px;
          }

          &::-webkit-scrollbar-thumb:hover {
            background-color: #3af0f781;
          }
        }
      }

      div.layer-panel {
        height: 30%;
        width: 100%;

        .title {
          .lpicon {
            background-image: url("/icons/layers.png");
          }

          .title-text {
            font-size: calc(1vw + 0.5vh);
            font-weight: 600;
            text-align: center;
            line-height: 5vh;
          }
        }

        .dp-content {
          height: 30vh;
          overflow-x: hidden;
          overflow-y: scroll;
          padding: 1vh;

          &::-webkit-scrollbar {
            width: 8px;
          }

          &::-webkit-scrollbar-track {
            background-color: rgba(6, 181, 197, 0.219);
          }

          &::-webkit-scrollbar-thumb {
            background-color: #15a1e294;
            border-radius: 5px;
          }

          &::-webkit-scrollbar-thumb:hover {
            background-color: #3af0f781;
          }
        }
      }
    }

    div.detail-page {
      width: 20vw;
      height: calc(87.4vh - 8vh);
      display: flex;
      scale: 0.95;
      translate: 0% -3.5%;

      // transform: translateY(-1%);
    }
  }

  div.main {
    position: relative;
  }

  div.map-container {
    position: relative;
    width: 80vw;
    height: 87vh;

    #map {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      background-color: hsl(194, 69%, 91%);
    }

    #GPUFrame {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 2;
      pointer-events: none;
    }
  }

  div.model-status {
    position: absolute;
    right: 0;
    width: 22vw;
    top: 5vh;
    height: 12vh;
    background: white;
    z-index: 1000;
    border-radius: 15px 0 0 15px;
    overflow: hidden;
    display: flex;
    border: 2px solid #1735ae;

    .show-model-status {
      height: 100%;
      width: 1.7vw;
      background: #1753ae;
      font-size: calc(0.6vw + 0.8vh);
      display: flex;
      text-align: center;
      align-items: center;
      line-height: 2.5vh;
      color: white;
    }

    .model-status-empty {
      height: 100%;
      width: 100%;
      background-color: #dcebf8;
      display: grid;
      place-items: center;
      font-size: calc(0.85vw + 0.85vh);
      font-weight: 600;
      color: #566573;
    }

    .model-status-main {
      height: 100%;
      width: 100%;
      background-color: #dcebf8;
      color: #566573;

      .model-status-title {
        height: 40%;
        display: flex;
        align-items: center;
        padding: 1vh 0.8vw;
        font-size: calc(0.85vw + 0.85vh);
        font-weight: 600;
      }

      .model-progress {
        padding: 0.2vh 0.8vw;
      }
    }
  }
}

:deep(.el-tree-node__label) {
  font-size: calc(0.6vw + 0.5vh);
  font-weight: 800;
}

:deep(.el-tree .el-tree-node__expand-icon.expanded) {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}

:deep(.el-tree-node) {
  padding: 2px 0px;
}

:deep(.el-checkbox__label) {
  font-size: calc(0.6vw + 0.5vh);
}
</style>

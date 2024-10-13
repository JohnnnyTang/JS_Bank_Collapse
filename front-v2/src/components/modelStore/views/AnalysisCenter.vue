<template>
  <div class="all">
    <ModelTitleVue @confirmBank="confirmBankHandler" :ModelName="'近岸演变分析模型'" />

    <div class="model-content-container">
      <div class="model-item-container">
        <div class="model-choice">
          <div class="basemap-radio-container">
            <!-- <input
              type="radio"
              id="radio-1"
              name="tabs"
              :checked="checky1"
              @click="radio1Click()"
            />
            <label class="tab" for="radio-1">近岸动力分析</label>
            <input type="radio" id="radio-2" name="tabs" :checked="checky2" />
            <label class="tab" for="radio-2">近岸演变分析</label>
            <span class="glider"></span> -->
            <el-radio-group v-model="radio1" @change="jump2Model(radio1)">
              <el-radio-button label="近岸动力评估" value="1" />
              <el-radio-button label="近岸动力计算" value="2" />
              <el-radio-button label="近岸演变分析" value="3" />
            </el-radio-group>
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
              :key="selectedBank"
            ></top-tool>
          </div>
          <data-manage
            class="top"
            ref="dataManage"
            :dataList="dataList"
            :key="selectedBank"
            @operateLayer="operateLayer"
            @addCurrentModel="addCurrentModel"
            @updateCurrentModel="updateCurrentModel"
          ></data-manage>
          <layer-manage
            class="bottom"
            ref="layerManage"
            :layerList="layerList"
            @closeLayer="closeLayer"
            @hideLayer="hideLayer"
            @moveLayer="moveLayer"
          ></layer-manage>
        </div>

        <!-- <div class="left-resize" ref="leftResize"></div> -->
      </div>
      <right-visual
        :layerList="layerList"
        ref="rightMap"
        @drawHandle="drawHandle"
      ></right-visual>
      <div class="model-status" :class="{ 'model-status-hide': !showModelStatus }">
        <div class="show-model-status" @click="showModelStatus = !showModelStatus">
          模型运行
        </div>
        <div class="model-status-main" v-if="totalPages != 0">
          <div class="model-status-title">
            正在运行：<span class="current-model-name">{{ currentKey }}</span>
            <div class="pagination">
              <span
                class="page-change"
                @click="prevPage"
                :class="{ 'page-change-disabled': currentIndex === 0 }"
              >
                &lt;
              </span>
              <span class="page-num">{{ currentIndex + 1 }}/{{ totalPages }}</span>
              <span
                class="page-change"
                @click="nextPage"
                :class="{ 'page-change-disabled': currentIndex === totalPages - 1 }"
              >
                &gt;
              </span>
            </div>
          </div>
          <div class="model-progress">
            <el-progress
              :percentage="modelProgressList[currentKey]"
              :stroke-width="15"
              :duration="5"
              striped-flow
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
import utils from "@/utils/CommonUtils";
import BankResourceHelper from "./bankResourceHelper";

export default defineComponent({
  components: { ModelTitleVue, TopTool, RightVisual, DataManage, LayerManage },
});
</script>

<script setup>
const { getDataList } = ModelRequest;
const { notice } = utils;
const selectedBank = ref("");
const skeletonFlag = ref(true);
const dataList = ref([]);
const layerList = ref([]);
const rightMap = ref();
const dataManage = ref();
const layerManage = ref();

const checky1 = ref(false);
const checky2 = ref(true);
const router = useRouter();
const radio1 = ref(3);

const modelProgressList = ref({});
const currentIndex = ref(0);
const showModelStatus = ref(false);

const jump2Model = (value) => {
  console.log(value == "1");
  const routeMap = {
    1: "/modelStore/stabilityAnalysis",
    2: "/modelStore/stabilityCalc",
    3: "/modelStore/analysisCenter",
  };
  routeMap[value] && router.push(routeMap[value]);
};

const confirmBankHandler = async (bank) => {
  const bankNameMap = {
    民主沙: "Mzs",
    民主沙右缘: "Mzs",
  };
  console.log(bank);
  rightMap.value.mapFlyToRiver(bank.name);

  const demData = (await BankResourceHelper.getBankCalculateResourceList("DEM", bank.bankEnName))
    .data;

  //const result = await getDataList("DEM", bank.bankEnName);
  console.log(demData);
  const formedData = demData.map((yearData) => {
    // TODO: 优化数据组织
    return {
      id: yearData.year,
      label: `${yearData.year}年长江南京以下DEM`,
      flag: true,
      children: yearData.sets.flatMap((set) => {
        return set.list.map((item) => {
          return {
            id: item.path,
            label: item.name,
            flag: false,
            children: [],
            visualType: "rasterTile",
          };
        });
      }),
    };
  });

  //TODO: 获取数据放在datamanage?
  // 添加已有的分析结果集
  let allData = dataManage.value.dataList;
  if (allData.length != 0 && allData[allData.length - 1].id === "") {
    formedData.push(allData[allData.length - 1]);
  }
  dataList.value = formedData;
  selectedBank.value = bank.name;

  notice(
    "success",
    "选择岸段",
    `已选择岸段——${bank.name},模型计算将默认采用${bank.name}相关资源`,
    180
  );
};
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
  if (modelProgressList.value[name] !== undefined) {
    notice("info", "错误", "当前模型正在运行中，请等待其运行完毕。");
    return;
  }
  modelProgressList.value[name] = 0;
  showModelStatus.value = true;
};

const updateCurrentModel = (name, status) => {
  if (status == 0) {
    modelProgressList.value[name] = 100;
    setTimeout(async () => {
      delete modelProgressList.value[name];
      if (currentIndex.value > 0) currentIndex.value--;
    }, 1000);
  } else if (status == -1) {
    delete modelProgressList.value[name];
    if (currentIndex.value > 0) currentIndex.value--;
  } else if (status == 1) {
    if (modelProgressList.value[name] < 90) {
      modelProgressList.value[name] += Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    }
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
  // TODO: sessionstorage获得图层列表
  // const res = await ModelRequest.getLayersInfo(import.meta.env.VITE_APP_ROUTER_ID);
  // if (res != null && res.code === 0) {
  //   layerList.value = res.data;
  // }
  // const data = window.sessionStorage.getItem("layerList");
  // if (data != null) layerList.value = JSON.parse(data);
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
        width: 18.8vw;
        height: 4vh;
        display: flex;
        flex-flow: row nowrap;
        background-color: #fff;
        box-shadow: 0 0 4px 1px rgba(#0642b1, 0.55), 0 6px 12px 0 rgba(#0642b1, 0.55);
        padding: 0.6vh;
        border-radius: 0.6vw; // just a high number to create pill effect
        // margin-right: auto;
        margin-left: 8px;

        .el-radio-group {
          // background-color: red;
          width: 18.8vw;
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;

          .el-radio-button {
            width: 6vw;

            .el-radio-button__inner {
              width: 6vw;
              font-size: calc(0.6vw + 0.6vh);
              font-weight: 800;
              padding: 1vh 0vw;
            }
          }
        }
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
        height: 12vh;
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
          height: 7vh;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-evenly;
          align-items: center;

          .button {
            background-color: #4c97fa;
            padding: 0.3vh;
            border-radius: 0.5vh;
            border-color: white;
            border-width: 0.5vh;
            height: 4vh;
            width: 5vw;
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
    right: -2px;
    width: 25vw;
    top: 5vh;
    height: 12vh;
    z-index: 1000;
    border-radius: 10px 0 0 10px;
    overflow: hidden;
    display: flex;
    border: 2px solid #3175ff;
    transition: right 1s;

    .show-model-status {
      height: 100%;
      width: 2vw;
      // background: #1753ae;
      background: #3175ff;
      font-size: calc(0.6vw + 0.8vh);
      display: flex;
      text-align: center;
      align-items: center;
      line-height: 2.5vh;
      color: white;
      cursor: pointer;
    }

    .show-model-status:hover {
      color: #62f8ff;
    }

    .model-status-empty {
      height: 100%;
      width: 100%;
      background-color: #dcebf8;
      background-image: linear-gradient(to left, #ccffff 0%, #baddf3 100%);
      display: grid;
      place-items: center;
      font-size: calc(0.85vw + 0.85vh);
      font-weight: 600;
      color: #909090;
    }

    .model-status-main {
      height: 100%;
      width: 100%;
      background-color: #dcebf8;
      background-image: linear-gradient(to left, #ccffff 0%, #baddf3 100%);
      color: #566573;

      .model-status-title {
        height: 40%;
        display: flex;
        align-items: center;
        padding: 1vh 0.8vw;
        font-size: calc(0.85vw + 0.85vh);
        font-weight: 600;

        .current-model-name {
          color: #366fe1;
        }

        .pagination {
          position: absolute;
          right: 1vw;

          .page-change {
            font-size: calc(0.85vw + 0.85vh);
          }

          .page-change:not(.page-change-disabled):hover {
            cursor: pointer;
            color: #3498db;
          }

          .page-change-disabled {
            color: #979a9a;
          }

          .page-num {
            font-size: calc(0.7vw + 0.7vh);
          }
        }
      }

      .model-progress {
        padding: 0.2vh 0.8vw;
      }
    }
  }

  div.model-status-hide {
    right: calc(2vw - 25vw - 4px);
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

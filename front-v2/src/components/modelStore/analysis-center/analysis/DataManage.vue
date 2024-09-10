<template>
  <div class="data-manage">
    <div class="data-panel">
      <div class="title">
        <div class="title-icon dpicon"></div>
        <div class="title-text">数据面板</div>
      </div>
      <div class="dp-content" style="height: 27vh">
        <div class="scroll">
          <el-scrollbar>
            <el-tree
              style="overflow: auto"
              :data="dataList"
              :props="defaultProps"
              @node-contextmenu="rightClick"
              default-expand-all
            >
              <template #default="{ data }">
                <div class="custom-tree-node" style="width: 100%">
                  <div class="text">
                    <span
                      v-if="data.flag"
                      :style="data.label == '分析结果集' ? 'font-weight:bold' : ''"
                      >{{ data.label }}</span
                    >
                    <span v-else>{{ data.label }}</span>
                  </div>
                </div>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div v-show="showRightMenu">
      <ul class="right-menu" ref="menu">
        <li
          :class="!isLayerVisual ? 'menu-item disabled' : 'menu-item'"
          @click="operateLayer('add', isLayerVisual)"
        >
          <span>添加至图层</span>
        </li>
        <li
          :class="isLayerVisual ? 'menu-item disabled' : 'menu-item'"
          @click="operateLayer('chart', !isLayerVisual)"
        >
          <span>可视化</span>
        </li>

        <li class="menu-item" @click="operateLayer('rename', true)">
          <span>重命名</span>
        </li>
        <!-- <li
          :class="downloadAble ? 'menu-item' : 'menu-item disabled'"
          @click="operateLayer('download', downloadAble)"
        >
          <span>下载</span>
        </li> -->
        <li class="menu-item" @click="operateLayer('del', true)">
          <span>删除</span>
        </li>
      </ul>
    </div>
    <el-dialog v-model="dialogRename" width="350px" :show-close="false">
      <el-input v-model="input" />
      <div class="btn">
        <el-button type="primary" plain size="small" @click="btnClick">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import router from "@/router";
import { defineComponent, ref, onMounted, computed, watch, onBeforeUnmount } from "vue";
import { Search } from "@element-plus/icons-vue";
import ModelRequest from "../../modelApi.js";
const {
  addAnalysisData,
  getData,
  delData,
  getAnalysisResult,
  addDraw,
  delAnalysisResult,
  getResultData,
  calculateSectionView,
  calculateSectionContrast,
  calculateRegionFlush,
  calculateRegionContour,
  calculateRiverVolume,
  rename,
  checkStatus,
  checkResult,
} = ModelRequest;
import utils from "@/utils/CommonUtils";
const { notice } = utils;
export default defineComponent({
  emits: ["operateLayer", "addCurrentModel", "updateCurrentModel"],
  props: {
    dataList: {
      type: Array,
    },
  },
  setup(props, context) {
    let sectionTimeout;
    const defaultProps = {
      children: "children",
      label: "label",
    };

    // {
    //     id: string;
    //     flag: boolean;
    //     label: string;
    //     children: Tree[];
    //     visualType?: string;
    // }[]
    let dataList = props.dataList;
    const showRightMenu = ref(false);
    const skeletonFlag = ref(true);
    const menu = ref();

    // {
    //     id: string;
    //     flag: boolean;
    //     label: string;
    //     children: Tree[];
    //     visualType?: string;
    // }
    const selectedData = ref();
    const parentId = ref("");

    const dialogRename = ref(false);
    const input = ref("");

    // param: {
    //     fileId: string;
    //     fileName: string;
    //     dataListId: string;
    //     dataListName: string;
    //     visualType: string;
    // }[]
    const addData = async (param) => {
      //   {
      //     caseId: string;
      //     list: { fileId: string; dataListId: string }[];
      //   }
      const jsonData = {
        caseId: import.meta.env.VITE_APP_ROUTER_ID,
        list: [],
      };
      param.forEach((item) => {
        let flag1 = true;
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].id === item.dataListId) {
            let flag = true;
            for (let j = 0; j < dataList[i].children.length; j++) {
              if (dataList[i].children[j].id === item.fileId) {
                flag = false;
                break;
              }
            }
            if (flag) {
              dataList[i].children.push({
                id: item.fileId,
                label: item.fileName,
                flag: false,
                children: [],
                visualType: item.visualType,
              });
              jsonData.list.push({
                fileId: item.fileId,
                dataListId: item.dataListId,
              });
            }
            flag1 = false;
            break;
          }
        }
        if (flag1) {
          if (dataList.length > 0 && dataList[dataList.length - 1].id === "") {
            dataList.splice(dataList.length - 1, 0, {
              id: item.dataListId,
              label: item.dataListName,
              flag: true,
              children: [],
            });
            dataList[dataList.length - 2].children.push({
              id: item.fileId,
              label: item.fileName,
              flag: false,
              children: [],
              visualType: item.visualType,
            });
          } else {
            dataList.push({
              id: item.dataListId,
              label: item.dataListName,
              flag: true,
              children: [],
            });
            dataList[dataList.length - 1].children.push({
              id: item.fileId,
              label: item.fileName,
              flag: false,
              children: [],
              visualType: item.visualType,
            });
          }

          jsonData.list.push({
            fileId: item.fileId,
            dataListId: item.dataListId,
          });
        }
      });
      if (jsonData.list.length > 0) {
        await addAnalysisData(jsonData);
        //window.sessionStorage.setItem("treeData", dataList);
      }
    };

    // param: { geoJson: any; visualType: string; fileName: string }
    const addDrawData = async (param) => {
      console.log(param);
      let drawData = {
        id: param.id, //TODO: 区分后端和前端生成id
        name: "",
        label: param.fileName,
        flag: false,
        children: [],
        visualType: param.visualType,
        params: { geojson: param.geoJson },
      };
      if (dataList.length != 0 && dataList[dataList.length - 1].id === "") {
        dataList[dataList.length - 1].children.push(drawData);
      } else {
        dataList.push({
          id: "",
          label: "分析结果集",
          flag: true,
          children: [],
        });
        dataList[dataList.length - 1].children.push(drawData);
      }

      //window.sessionStorage.setItem("treeData", dataList);
      return drawData;
    };

    const getGeomById = (id) => {
      if (dataList.length != 0 && dataList[dataList.length - 1].id === "" && id != "") {
        let result = dataList[dataList.length - 1].children.find(
          (item) => item.id === id
        );
        return result.params.geojson;
      } else {
        return null;
      }
    };

    const addAnalyse = async (param) => {
      console.log(param);
      if (param.type === "section") {
        // addData([param.value.dem]);
        // context.emit("operateLayer", {
        //   content: {
        //     id: param.value.dem.fileId,
        //     name: param.value.dem.fileName,
        //     visualType: param.value.dem.visualType,
        //     visualId: param.value.dem.visualId,
        //   },
        //   type: "add",
        // });
        let sectionGeom = getGeomById(param.value.section);
        if (sectionGeom == null) return;
        context.emit("addCurrentModel", "断面形态");
        const data = await calculateSectionView({
          "dem-id": param.value.dem.fileId,
          "section-geometry": sectionGeom,
        });
        let result = await checkStateHandle(data.data, "断面形态");
        if (result != null) {
          if (dataList[dataList.length - 1].id !== "") {
            dataList.push({
              id: "",
              label: "分析结果集",
              children: [],
              flag: true,
            });
          }
          dataList[dataList.length - 1].children.push({
            id: result.data["case-id"],
            name: result.data["raw-json"],
            label: param.value.fileName,
            flag: false,
            children: [],
            visualType: "section",
            params: { interval: parseFloat(result.data["interval"]) },
          });
        }
      } else if (
        param.type === "sectionFlush" ||
        param.type === "regionFlush" ||
        param.type === "flushContour"
      ) {
        // addData([param.value.benchmarkDem]);
        // context.emit("operateLayer", {
        //   content: {
        //     id: param.value.benchmarkDem.fileId,
        //     name: param.value.benchmarkDem.fileName,
        //     visualType: param.value.benchmarkDem.visualType,
        //     visualId: param.value.benchmarkDem.visualId,
        //   },
        //   type: "add",
        // });
        // addData([param.value.referDem]);
        // context.emit("operateLayer", {
        //   content: {
        //     id: param.value.referDem.fileId,
        //     name: param.value.referDem.fileName,
        //     visualType: param.value.referDem.visualType,
        //     visualId: param.value.referDem.visualId,
        //   },
        //   type: "add",
        // });
        if (param.type === "sectionFlush") {
          let sectionGeom = getGeomById(param.value.section);
          if (sectionGeom == null) return;
          context.emit("addCurrentModel", "断面冲淤");
          const data = await calculateSectionContrast({
            "bench-id": param.value.benchmarkDem.fileId,
            "ref-id": param.value.referDem.fileId,
            "section-geometry": sectionGeom,
          });
          let result = await checkStateHandle(data.data, "断面冲淤");
          if (result != null) {
            if (dataList[dataList.length - 1].id !== "") {
              dataList.push({
                id: "",
                label: "分析结果集",
                children: [],
                flag: true,
              });
            }
            dataList[dataList.length - 1].children.push({
              id: result.data["case-id"],
              name: result.data["raw-txt"],
              label: param.value.fileName,
              flag: false,
              children: [],
              visualType: "sectionFlush",
              params: { interval: parseFloat(result.data["interval"]) },
            });
          }
        } else if (param.type === "regionFlush") {
          let regionGeom = getGeomById(param.value.region);
          context.emit("addCurrentModel", "区域冲淤");
          const data = await calculateRegionFlush({
            "bench-id": param.value.benchmarkDem.fileId,
            "ref-id": param.value.referDem.fileId,
            "region-geometry":
              param.value.global == true
                ? "NONE"
                : { type: "FeatureCollection", features: [regionGeom] },
          });
          let result = await checkStateHandle(data.data, "区域冲淤");
          if (result != null) {
            const coordJson = await getResultData(
              "json",
              result.data["case-id"],
              result.data["extent-json"]
            );
            const coords = coordJson.data;
            const extent = [coords.ul, coords.ur, coords.lr, coords.ll];
            if (dataList[dataList.length - 1].id !== "") {
              dataList.push({
                id: "",
                label: "分析结果集",
                children: [],
                flag: true,
              });
            }
            dataList[dataList.length - 1].children.push({
              id: result.data["case-id"],
              name: result.data["visualization-png"],
              label: param.value.fileName,
              flag: false,
              children: [],
              visualType: "regionFlush",
              params: { extent },
            });
            console.log(dataList);
          }
        } else {
          let regionGeom = getGeomById(param.value.region);
          context.emit("addCurrentModel", "冲淤等深线");
          const data = await calculateRegionContour({
            "bench-id": param.value.benchmarkDem.fileId,
            "ref-id": param.value.referDem.fileId,
            "region-geometry":
              param.value.global == true
                ? "NONE"
                : { type: "FeatureCollection", features: [regionGeom] },
          });
          let result = await checkStateHandle(data.data, "冲淤等深线");
          if (result != null) {
            if (dataList[dataList.length - 1].id !== "") {
              dataList.push({
                id: "",
                label: "分析结果集",
                children: [],
                flag: true,
              });
            }
            dataList[dataList.length - 1].children.push({
              id: result.data["case-id"],
              name: result.data["visualization-geojson"],
              label: param.value.fileName,
              flag: false,
              children: [],
              visualType: "flushContour",
              params: null,
            });
          }
        }
      } else if (param.type === "volume") {
        // addData([param.value.dem]);
        // context.emit("operateLayer", {
        //   content: {
        //     id: param.value.dem.fileId,
        //     name: param.value.dem.fileName,
        //     visualType: param.value.dem.visualType,
        //   },
        //   type: "add",
        // });
        let regionGeom = getGeomById(param.value.region);
        context.emit("addCurrentModel", "河道容积");
        const data = await calculateRiverVolume({
          "dem-id": param.value.dem.fileId,
          "region-geometry": { type: "FeatureCollection", features: [regionGeom] },
          "water-depth": param.value.deep,
        });
        let result = await checkStateHandle(data.data, "河道容积");
        if (result != null) {
          const volume = await getResultData(
            "txt",
            result.data["case-id"],
            result.data["volume-summary-txt"]
          );
          const coordJson = await getResultData(
            "json",
            result.data["case-id"],
            result.data["extent-json"]
          );
          const coords = coordJson.data;
          const extent = [coords.ul, coords.ur, coords.lr, coords.ll];
          if (dataList[dataList.length - 1].id !== "") {
            dataList.push({
              id: "",
              label: "分析结果集",
              children: [],
              flag: true,
            });
          }
          dataList[dataList.length - 1].children.push({
            id: result.data["case-id"],
            name: result.data["visualization-png"],
            label: param.value.fileName,
            flag: false,
            children: [],
            visualType: "volume",
            params: { volume: parseFloat(volume.data), extent },
          });
        }
      }
    };

    const operateLayer = async (keyword, flag) => {
      // TODO: 添加基础数据
      if (selectedData.value?.visualType == "rasterTile") {
        notice("error", "错误", "无法添加该图层！");
        return;
      }
      if (flag) {
        if (keyword != "rename" && keyword != "download") {
          context.emit("operateLayer", {
            content: {
              id: selectedData.value?.id,
              name: selectedData.value?.name,
              label: selectedData.value?.label,
              visualType: selectedData.value?.visualType,
              params: selectedData.value?.params,
            },
            type: keyword,
          });
        }
        if (keyword === "del") {
          for (let i = 0; i < dataList.length; i++) {
            if (dataList[i].id === parentId.value) {
              if (
                dataList[i].children.length === 0 ||
                dataList[i].children.length === 1
              ) {
                dataList.splice(i, 1);
                notice("success", "成功", "数据删除成功!");
                return;
              } else {
                for (let j = 0; j < dataList[i].children.length; j++) {
                  if (dataList[i].children[j].id === selectedData.value?.id) {
                    dataList[i].children.splice(j, 1);
                    notice("success", "成功", "数据删除成功!");
                    return;
                  }
                }
              }
            }
          }
        } else if (keyword === "rename") {
          dialogRename.value = true;
          input.value = selectedData.value?.label;
        } else if (keyword === "download") {
          window.location.href = `/monitor/analysis/downloadAnalysisResult/${selectedData.value?.id}`;
        }
      }
    };

    const checkStateHandle = async (key, text) => {
      const res = await checkStatus(key);
      const status = res.data;
      if (status == "ERROR") {
        const result = await checkResult(key);
        console.error(result.data);
        context.emit("updateCurrentModel", text, -1);
        notice("error", "错误", text + "计算失败！");
        return null;
      } else if (status == "COMPLETE") {
        const result = await checkResult(key);
        context.emit("updateCurrentModel", text, 0);
        notice("success", "成功", text + "计算成功！");
        return result;
      } else {
        context.emit("updateCurrentModel", text, 1);
        return new Promise((resolve) => {
          setTimeout(async () => {
            const result = await checkStateHandle(key, text);
            resolve(result);
          }, 2000);
        });
      }
    };

    const rightClick = (event, data, node, obj) => {
      function closeRightMenu() {
        showRightMenu.value = false;
        document.removeEventListener("click", closeRightMenu);
      }
      if (!data.flag && menu.value) {
        showRightMenu.value = false;
        showRightMenu.value = true;
        selectedData.value = data;
        parentId.value = node.parent.data.id;
        menu.value.style.left = event.clientX - 15 + "px";
        menu.value.style.top = event.clientY - 125 + "px";
        document.addEventListener("click", closeRightMenu);
      }
    };

    const isLayerVisual = computed(() => {
      if (
        selectedData.value?.visualType === "polygonVectorTile3D" ||
        selectedData.value?.visualType === "pointVectorTile3D" ||
        selectedData.value?.visualType === "pointVectorTile" ||
        selectedData.value?.visualType === "lineVectorTile3D" ||
        selectedData.value?.visualType === "polygonVectorTile" ||
        selectedData.value?.visualType === "lineVectorTile" ||
        selectedData.value?.visualType === "png" ||
        selectedData.value?.visualType === "movePng" ||
        selectedData.value?.visualType === "rasterTile" ||
        selectedData.value?.visualType === "geoJsonLine" ||
        selectedData.value?.visualType === "geoJsonPolygon" ||
        selectedData.value?.visualType === "regionFlush" ||
        selectedData.value?.visualType === "elevationFlush" ||
        selectedData.value?.visualType === "flushContour" ||
        selectedData.value?.visualType === "slope" ||
        selectedData.value?.visualType === "volume"
      ) {
        return true;
      } else {
        return false;
      }
    });

    const downloadAble = computed(() => {
      if (parentId.value === "") {
        return true;
      } else {
        return false;
      }
    });

    const btnClick = async () => {
      dialogRename.value = false;
      context.emit("operateLayer", {
        content: {
          id: selectedData.value?.id,
          name: input.value,
          visualType: selectedData.value?.visualType,
        },
        type: "rename",
      });
      for (let i = 0; i < dataList[dataList.length - 1].children.length; i++) {
        if (dataList[dataList.length - 1].children[i].id === selectedData.value?.id) {
          dataList[dataList.length - 1].children[i].label = input.value;
          break;
        }
      }
      await rename({ id: selectedData.value?.id, name: input.value });
    };

    const initData = async (id) => {
      dataList = [];
      const data = await getData(id);
      console.log(data);
      if (data != null && data.code === 0) {
        data.data.forEach((item) => {
          let flag = true;
          for (let i = 0; i < dataList.length; i++) {
            if (dataList[i].id === item.dataListId) {
              dataList[i].children.push({
                id: item.fileId,
                label: item.fileName,
                flag: false,
                children: [],
                visualType: item.visualType,
              });
              flag = false;
            }
          }
          if (flag) {
            dataList.push({
              id: item.dataListId,
              label: item.dataListName,
              flag: true,
              children: [],
            });
            dataList[dataList.length - 1].children.push({
              id: item.fileId,
              label: item.fileName,
              flag: false,
              children: [],
              visualType: item.visualType,
            });
          }
        });
      }
      const analyticData = await getAnalysisResult(id);
      console.log(analyticData);
      if (analyticData != null && data.code === 0) {
        if (analyticData.data.length > 0) {
          dataList.push({
            id: "",
            label: "分析结果集",
            flag: true,
            children: [],
          });
          analyticData.data.forEach((item) => {
            dataList[dataList.length - 1].children.push({
              id: item.id,
              label: item.fileName,
              flag: false,
              children: [],
              visualType: item.visualType,
            });
          });
        }
      }
      console.log(dataList);
    };

    onBeforeUnmount(() => {
      window.sessionStorage.setItem("dataList", JSON.stringify(dataList));
      clearTimeout(sectionTimeout);
    });

    return {
      Search,
      addData,
      skeletonFlag,
      operateLayer,
      defaultProps,
      rightClick,
      showRightMenu,
      menu,
      isLayerVisual,
      addDrawData,
      addAnalyse,
      downloadAble,
      dialogRename,
      input,
      btnClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.data-manage {
  .right-menu {
    z-index: 1;
    position: absolute;
    width: 100px;
    position: absolute;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: white;
    cursor: pointer;
    li:hover {
      background-color: #edf6ff;
      color: #606266;
    }
    .menu-item {
      line-height: 25px;
      height: 25px;
      text-align: left;
      margin: 10px 0px;
      font-size: 14px;
      color: #606266;
      span {
        margin-left: 5px;
      }
    }
    .disabled {
      background: white;
      color: #c7d0dc;
      &:hover {
        background: white;
        color: #c7d0dc;
      }
    }
  }
  :deep() .el-dialog {
    .el-dialog__header {
      padding: 0px;
    }
    .el-dialog__body {
      padding-bottom: 10px;
    }
    .btn {
      text-align: center;
      margin-top: 10px;
    }
  }
}
</style>

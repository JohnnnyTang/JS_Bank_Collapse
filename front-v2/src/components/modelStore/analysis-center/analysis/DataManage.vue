<template>
  <div class="data-manage">
    <div class="data-panel">
      <div class="title">
        <div class="title-icon dpicon"></div>
        <div class="title-text">数据面板</div>
      </div>
      <div class="dp-content" style="height: 27vh">
        <el-skeleton :rows="5" animated v-if="skeletonFlag" />
        <div class="scroll" v-else>
          <el-scrollbar>
            <el-tree
              style="overflow: auto"
              :data="treeData"
              :props="defaultProps"
              @node-contextmenu="rightClick"
              default-expand-all
            >
              <template #default="{ data }">
                <div class="custom-tree-node" style="width: 100%">
                  <div class="text">
                    <span
                      v-if="data.flag"
                      :style="data.label == '分析结果集' ? 'color:#E1E1E1' : ''"
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
        <li
          :class="downloadAble ? 'menu-item' : 'menu-item disabled'"
          @click="operateLayer('download', downloadAble)"
        >
          <span>下载</span>
        </li>
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
  emits: ["operateLayer"],
  setup(_, context) {
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
    const treeData = ref([]);
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
        for (let i = 0; i < treeData.value.length; i++) {
          if (treeData.value[i].id === item.dataListId) {
            let flag = true;
            for (let j = 0; j < treeData.value[i].children.length; j++) {
              if (treeData.value[i].children[j].id === item.fileId) {
                flag = false;
                break;
              }
            }
            if (flag) {
              treeData.value[i].children.push({
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
          if (
            treeData.value.length > 0 &&
            treeData.value[treeData.value.length - 1].id === ""
          ) {
            treeData.value.splice(treeData.value.length - 1, 0, {
              id: item.dataListId,
              label: item.dataListName,
              flag: true,
              children: [],
            });
            treeData.value[treeData.value.length - 2].children.push({
              id: item.fileId,
              label: item.fileName,
              flag: false,
              children: [],
              visualType: item.visualType,
            });
          } else {
            treeData.value.push({
              id: item.dataListId,
              label: item.dataListName,
              flag: true,
              children: [],
            });
            treeData.value[treeData.value.length - 1].children.push({
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
        //window.sessionStorage.setItem("treeData", treeData.value);
      }
    };

    // param: { geoJson: any; visualType: string; fileName: string }
    const addDrawData = async (param) => {
      //   {
      //     caseId: string;
      //     geoJson: any;
      //     fileName: string;
      //     visualType: string;
      //   }
      const jsonData = {
        caseId: import.meta.env.VITE_APP_ROUTER_ID,
        geoJson: param.geoJson,
        fileName: param.fileName,
        visualType: param.visualType,
      };
      const data = await addDraw(jsonData);
      if (data != null && data.code === 0) {
        if (
          treeData.value.length != 0 &&
          treeData.value[treeData.value.length - 1].id === ""
        ) {
          treeData.value[treeData.value.length - 1].children.push({
            id: data.data,
            label: param.fileName,
            flag: false,
            children: [],
            visualType: param.visualType,
          });
        } else {
          treeData.value.push({
            id: "",
            label: "分析结果集",
            flag: true,
            children: [],
          });
          treeData.value[treeData.value.length - 1].children.push({
            id: data.data,
            label: param.fileName,
            flag: false,
            children: [],
            visualType: param.visualType,
          });
        }

        //window.sessionStorage.setItem("treeData", treeData.value);

        return {
          id: data.data,
          name: param.fileName,
          visualType: param.visualType,
        };
      }
    };

    const addAnalyse = async (param) => {
      if (param.type === "section") {
        console.log(param);
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
        const data = await calculateSectionView({
          "dem-id": "199801_dem/w001001.adf",
          "section-geometry": {
            type: "FeatureCollection",
            name: "mzsSectionLineLong",
            crs: { type: "name", properties: { name: "urn:ogc:def:crs:EPSG::3857" } },
            features: [
              {
                type: "Feature",
                properties: {
                  id: 0,
                  fid: 1,
                  name: "JC01",
                  label: "MZ01围堤",
                  warn: "mid",
                  if_important: 1,
                },
                geometry: {
                  type: "LineString",
                  coordinates: [
                    [13413891.494620809331536, 3769073.072245586663485],
                    [13413485.103571385145187, 3765456.449993444141001],
                  ],
                },
              },
            ],
          },
        });
        let result = await checkStateHandle(data.data, "断面形态");
        if (result != null) {
          if (treeData.value[treeData.value.length - 1].id !== "") {
            treeData.value.push({
              id: "",
              label: "分析结果集",
              children: [],
              flag: true,
            });
          }
          treeData.value[treeData.value.length - 1].children.push({
            caseid: result.data["case-id"],
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
          const data = await calculateSectionContrast({
            "bench-id": "199801_dem/w001001.adf",
            "ref-id": "200408_dem/w001001.adf",
            "section-geometry": {
              type: "FeatureCollection",
              name: "mzsSectionLineLong",
              crs: { type: "name", properties: { name: "urn:ogc:def:crs:EPSG::3857" } },
              features: [
                {
                  type: "Feature",
                  properties: {
                    id: 0,
                    fid: 1,
                    name: "JC01",
                    label: "MZ01围堤",
                    warn: "mid",
                    if_important: 1,
                  },
                  geometry: {
                    type: "LineString",
                    coordinates: [
                      [13413891.494620809331536, 3769073.072245586663485],
                      [13413485.103571385145187, 3765456.449993444141001],
                    ],
                  },
                },
              ],
            },
          });
          let result = await checkStateHandle(data.data, "断面冲淤");
          if (result != null) {
            if (treeData.value[treeData.value.length - 1].id !== "") {
              treeData.value.push({
                id: "",
                label: "分析结果集",
                children: [],
                flag: true,
              });
            }
            treeData.value[treeData.value.length - 1].children.push({
              caseid: result.data["case-id"],
              name: result.data["raw-txt"],
              label: param.value.fileName,
              flag: false,
              children: [],
              visualType: "sectionFlush",
              params: null,
            });
            console.log(treeData.value);
          }
        } else if (param.type === "regionFlush") {
          const data = await calculateRegionFlush({
            "bench-id": "199801_dem/w001001.adf",
            "ref-id": "200408_dem/w001001.adf",
            "region-geometry": {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    name: "Example Polygon",
                  },
                  geometry: {
                    type: "Polygon",
                    coordinates: [
                      [
                        [121.35857784308524, 31.660508611487913],
                        [121.29264135171792, 31.576285441022137],
                        [121.45748258013526, 31.57394482076768],
                        [121.3860513811536, 31.508383603511106],
                        [121.50693494865948, 31.56458175211411],
                        [121.35857784308524, 31.660508611487913],
                      ],
                    ],
                  },
                },
              ],
            },
          });
          let result = await checkStateHandle(data.data, "区域冲淤"); //将分析结果添加至结果集
          if (result != null) {
            const coordJson = await getResultData(
              "common",
              result.data["case-id"],
              result.data["extent-json"]
            );
            const coords = coordJson.data;
            const extent = [coords.ul, coords.lr, coords.ur, coords.ll];
            if (treeData.value[treeData.value.length - 1].id !== "") {
              treeData.value.push({
                id: "",
                label: "分析结果集",
                children: [],
                flag: true,
              });
            }
            treeData.value[treeData.value.length - 1].children.push({
              caseid: result.data["case-id"],
              name: result.data["visualization-png"],
              label: param.value.fileName,
              flag: false,
              children: [],
              visualType: "regionFlush",
              params: { extent },
            });
            console.log(treeData.value);
          }
        } else {
          const data = await calculateRegionContour({
            "bench-id": "199801_dem/w001001.adf",
            "ref-id": "200408_dem/w001001.adf",
            "region-geometry": {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    name: "Example Polygon",
                  },
                  geometry: {
                    type: "Polygon",
                    coordinates: [
                      [
                        [121.35857784308524, 31.660508611487913],
                        [121.29264135171792, 31.576285441022137],
                        [121.45748258013526, 31.57394482076768],
                        [121.3860513811536, 31.508383603511106],
                        [121.50693494865948, 31.56458175211411],
                        [121.35857784308524, 31.660508611487913],
                      ],
                    ],
                  },
                },
              ],
            },
          });
          let result = await checkStateHandle(data.data, "区域等深线");
          if (result != null) {
            if (treeData.value[treeData.value.length - 1].id !== "") {
              treeData.value.push({
                id: "",
                label: "分析结果集",
                children: [],
                flag: true,
              });
            }
            treeData.value[treeData.value.length - 1].children.push({
              caseid: result.data["case-id"],
              name: result.data["visualization-geojson"],
              label: param.value.fileName,
              flag: false,
              children: [],
              visualType: "flushContour",
              params: null,
            });
            console.log(treeData.value);
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
        const data = await calculateRiverVolume({
          "dem-id": "200408_dem/w001001.adf",
          "region-geometry": {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  name: "Example Polygon",
                },
                geometry: {
                  type: "Polygon",
                  coordinates: [
                    [
                      [121.35857784308524, 31.660508611487913],
                      [121.29264135171792, 31.576285441022137],
                      [121.45748258013526, 31.57394482076768],
                      [121.3860513811536, 31.508383603511106],
                      [121.50693494865948, 31.56458175211411],
                      [121.35857784308524, 31.660508611487913],
                    ],
                  ],
                },
              },
            ],
          },
          "water-depth": 10,
        });
        let result = await checkStateHandle(data.data, "河道容积");
        if (result != null) {
          const volume = await getResultData(
            "common",
            result.data["case-id"],
            result.data["volume-summary-txt"]
          );
          const coordJson = await getResultData(
            "common",
            result.data["case-id"],
            result.data["extent-json"]
          );
          const coords = coordJson.data;
          const extent = [coords.ul, coords.lr, coords.ur, coords.ll];
          if (treeData.value[treeData.value.length - 1].id !== "") {
            treeData.value.push({
              id: "",
              label: "分析结果集",
              children: [],
              flag: true,
            });
          }
          treeData.value[treeData.value.length - 1].children.push({
            caseid: result.data["case-id"],
            name: result.data["visualization-png"],
            label: param.value.fileName,
            flag: false,
            children: [],
            visualType: "volume",
            params: { volume, extent },
          });
          console.log(treeData.value)
        }
      }
    };

    const operateLayer = async (keyword, flag) => {
      if (flag) {
        if (keyword != "rename" && keyword != "download") {
          context.emit("operateLayer", {
            content: {
              caseid: selectedData.value?.caseid,
              name: selectedData.value?.name,
              visualType: selectedData.value?.visualType,
              params: selectedData.value?.params,
            },
            type: keyword,
          });
        }
        if (keyword === "del") {
          let data;
          if (parentId.value === "") {
            data = await delAnalysisResult(selectedData.value?.id);
          } else {
            data = await delData(
              import.meta.env.VITE_APP_ROUTER_ID,
              parentId.value,
              selectedData.value?.id
            );
          }
          if (data != null && data.code === 0) {
            for (let i = 0; i < treeData.value.length; i++) {
              if (treeData.value[i].id === parentId.value) {
                if (
                  treeData.value[i].children.length === 0 ||
                  treeData.value[i].children.length === 1
                ) {
                  treeData.value.splice(i, 1);
                  notice("success", "成功", "数据删除成功!");
                  return;
                } else {
                  for (let j = 0; j < treeData.value[i].children.length; j++) {
                    if (treeData.value[i].children[j].id === selectedData.value?.id) {
                      treeData.value[i].children.splice(j, 1);
                      notice("success", "成功", "数据删除成功!");
                      return;
                    }
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
        notice("error", "错误", text + "计算失败！");
        return null;
      } else if (status == "COMPLETE") {
        const result = await checkResult(key);
        notice("success", "成功", text + "计算成功！");
        return result;
      } else {
        sectionTimeout = setTimeout(async () => {
          await checkStateHandle(key, text);
        }, 2000);
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
      for (
        let i = 0;
        i < treeData.value[treeData.value.length - 1].children.length;
        i++
      ) {
        if (
          treeData.value[treeData.value.length - 1].children[i].id ===
          selectedData.value?.id
        ) {
          treeData.value[treeData.value.length - 1].children[i].label = input.value;
          break;
        }
      }
      await rename({ id: selectedData.value?.id, name: input.value });
    };

    const initData = async (id) => {
      treeData.value = [];
      const data = await getData(id);
      console.log(data);
      if (data != null && data.code === 0) {
        data.data.forEach((item) => {
          let flag = true;
          for (let i = 0; i < treeData.value.length; i++) {
            if (treeData.value[i].id === item.dataListId) {
              treeData.value[i].children.push({
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
            treeData.value.push({
              id: item.dataListId,
              label: item.dataListName,
              flag: true,
              children: [],
            });
            treeData.value[treeData.value.length - 1].children.push({
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
          treeData.value.push({
            id: "",
            label: "分析结果集",
            flag: true,
            children: [],
          });
          analyticData.data.forEach((item) => {
            treeData.value[treeData.value.length - 1].children.push({
              id: item.id,
              label: item.fileName,
              flag: false,
              children: [],
              visualType: item.visualType,
            });
          });
        }
      }
      console.log(treeData.value);
    };

    onMounted(() => {
      //TODO: sessionstorage获取数据列表
      treeData.value = [
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
      //initData(import.meta.env.VITE_APP_ROUTER_ID);
      //const data = window.sessionStorage.getItem("dataList");
      //if (data != null) treeData.value = JSON.parse(data);
      skeletonFlag.value = false;
    });

    onBeforeUnmount(() => {
      window.sessionStorage.setItem("dataList", JSON.stringify(treeData.value));
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
      treeData,
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

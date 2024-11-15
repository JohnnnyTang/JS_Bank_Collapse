<template>
  <div class="data-visual-container">
    <div class="sideBar">
      <dv-border-box9>
        <div class="sideBar-container">
          <!-- <dv-decoration-11 style="width:75%;height: 6.5vh;">
                        <div class="title-text">
                            综合数据专题
                        </div>
                    </dv-decoration-11>
                    <hr class="hr_gradient"> -->
          <div class="scenes-tree-container" v-loading="sideBarLoading">
            <el-tree
              style="max-width: 400px"
              :data="dataSource"
              :expand-on-click-node="false"
              node-key="label"
              :default-expanded-keys="expandKey"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <div class="scene-card" v-if="data.type == 'title1'">
                    <div
                      class="scene-top-section"
                      :class="{ active: data.active }"
                      @click="treeNodeClickHandler(node, data)"
                    >
                      <div class="scene-title">
                        <div class="scene-title-text">
                          {{ data.label }}
                        </div>
                      </div>
                    </div>
                    <el-switch
                      v-model="data.active"
                      :active-action-icon="View"
                      :inactive-action-icon="Hide"
                      size="large"
                      @change="viewChange(node, data)"
                    />
                  </div>

                  <div
                    class="subScene-container"
                    v-else-if="data.type == 'title2' || data.type == 'title3'"
                  >
                    <div class="card" :class="{ active: data.active }">
                      <div class="top-section" @click="treeNodeClickHandler(node, data)">
                        <div class="title">
                          <div class="subScene-title-text">
                            {{ data.label }}
                          </div>
                          <div class="detail-icon">
                            <el-button
                              type="info"
                              :icon="List"
                              circle
                              size="default"
                              @click.stop="layerGroupClickHandler(node, data)"
                              v-show="
                                !(
                                  node.parent.data.label.includes('岸段') ||
                                  node.parent.data.label.includes('其他') ||
                                  data.label.includes('其他') ||
                                  data.label.includes('过江通道') ||
                                  data.label.includes('沿江码头')
                                )
                              "
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="feature-container"
                    v-else-if="
                      data.type == 'feature' && node.parent.data.label.includes('岸段')
                    "
                    @click="featureNodeClick(node, data)"
                  >
                    <div
                      class="feature-content"
                      :class="{ smaller: data.label.length > 10 }"
                    >
                      {{ data.label }}
                    </div>
                  </div>
                  <div
                    class="feature-container"
                    v-else-if="
                      data.type == 'feature' && node.parent.data.label.includes('沙洲')
                    "
                    @click="featureNodeClick(node, data)"
                  >
                    <div
                      class="feature-content"
                      :class="{ smaller: data.label.length > 10 }"
                    >
                      <div>{{ data.label }}</div>
                      <el-icon
                        v-if="node.data.property['洲滩信息_人口活动'] == '2'"
                        style="margin-left: 0.6vw"
                      >
                        <House />
                      </el-icon>
                      <el-icon
                        v-else-if="node.data.property['洲滩信息_人口活动'] == '1'"
                        style="margin-left: 0.6vw"
                      >
                        <UserFilled />
                      </el-icon>
                    </div>
                  </div>
                </span>
              </template>
            </el-tree>
          </div>
        </div>
      </dv-border-box9>
    </div>
    <div class="mapBase">
      <div ref="mapContainer" id="map"></div>
    </div>
    <div class="tools-container">
      <div class="icon-container" v-for="i in 2" :key="i">
        <div
          class="icon"
          :style="styles[i - 1]"
          @click="toolClick(i - 1)"
          :class="{ active: activeStatus[i - 1] }"
        ></div>
      </div>
    </div>

    <!-- <div class="search-pos" v-show="activeStatus[0]" v-draggable="{ bounds: 'body', cancel: 'div.content' }">
            <featSearch @close="closeHandler" @featureInfo="selectFeatureHandler"></featSearch>
        </div> -->
    <!-- <div class="layer-pos" v-show="activeStatus[1]" v-draggable="{ bounds: 'body', cancel: 'div.content' }">
            <layerCtrl @close="closeHandler"></layerCtrl>
        </div> -->

    <div
      class="legend-pos"
      v-show="activeStatus[0]"
      v-draggable="{ bounds: 'body', cancel: 'div.content' }"
    >
      <mapLegend @close="closeHandler(0)" :legendList="legendList"></mapLegend>
    </div>

    <div
      class="featDetail"
      v-show="showDetail"
      v-draggable="{ bounds: 'body', cancel: 'div.content' }"
      v-click-out-side="detailClickOutSideHandler"
    >
      <!-- v-click-out-side="() => showDetail = false" -->
      <featDetail
        :column="featureInfo.column"
        :ogData="featureInfo.ogData"
        :sourceId="featureInfo.sourceId"
        @close="showDetail = false"
        @pin="pinHandler"
      ></featDetail>
    </div>

    <div
      class="infomation-pannel"
      v-show="showInfoPannel"
      v-draggable="{ bounds: 'body', cancel: 'div.content' }"
      v-loading="false"
      v-click-out-side="listClickOutSideHandler"
    >
      <div class="title-block">
        <div class="title">{{ infoPannelTitle }}</div>
        <div
          class="miniIcon"
          :style="iconBackStyle"
          @click="listPinState = !listPinState"
        ></div>
      </div>
      <!-- <div class="close" @click="showInfoPannel = false; showDetail = false"></div> -->
      <div class="important-feature">
        <el-table
          :data="infoTableData_filtered"
          height="30vh"
          stripe
          border
          class="infomation-table"
          v-loading="pannelLoading"
        >
          <el-table-column
            v-for="(item, index) in infoTableHeader"
            :key="index"
            :prop="item.prop"
            :label="item.label"
          ></el-table-column>

          <el-table-column align="right">
            <template #header>
              <el-input v-model="search" size="small" placeholder="输入关键字搜索" />
            </template>
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="detailClickHandler4Feature(scope.row)"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="hydro-pannel">
      <div class="title">
        <span style="padding-left: 0.5vw">实时水文信息</span>
        <span class="title-time">{{ waterConditionTime }}</span>
        <el-icon @click="showHydroPannel = !showHydroPannel" class="iconn">
          <More />
        </el-icon>
      </div>

      <el-table
        :data="waterTableData"
        border
        style="width: 100%"
        v-show="showHydroPannel"
      >
        <el-table-column
          prop="station"
          label="站点"
          :min-width="'20%'"
          :align="'center'"
        />
        <el-table-column
          prop="flow"
          label="流量(m³/s)"
          :min-width="'30%'"
          :align="'center'"
        />
        <el-table-column
          prop="level"
          label="水位(m)"
          :min-width="'25%'"
          :align="'center'"
        />
        <el-table-column
          prop="time"
          label="更新时间"
          :min-width="'30%'"
          :align="'center'"
        />
      </el-table>
    </div>

    <!-- 底图切换 -->
    <div class="radio-container">
      <el-radio-group v-model="baseMapRadio" size="large" @change="baseMapChangeHandler">
        <el-radio-button label="矢量底图" value="1" />
        <el-radio-button label="影像底图" value="0" />
      </el-radio-group>
    </div>

    <!-- <div class="temp" style="display: block; position: absolute; left: 30vw; top: 30vh; background-color: rgb(182, 70, 18); 
        opacity: 0.5; width: 8vw; height: 4vh;">
            <span style="font-weight: 600;">{{ realtimeZoom }}</span>
        </div> -->
  </div>
</template>

<script setup>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { onMounted, ref, watch, onUnmounted, computed } from "vue";
import { Hide, View, List } from "@element-plus/icons-vue";
import axios from "axios";
import {
  BorderBox9 as DvBorderBox9,
  Decoration11 as DvDecoration11,
} from "@kjgl77/datav-vue3";
import { clickOutSide as vClickOutSide } from "@mahdikhashan/vue3-click-outside";
import mapLegend from "../components/dataVisual/common/tool/legend.vue";
import featDetail from "../components/dataVisual/common/tool/featDetail.vue";

import { initBaseMap, getStyleJson4base, getImageStyleJson } from "../utils/mapUtils";
import {
  scenes,
  layerGroups,
  LayerGroup,
  lableLayerMap,
} from "../components/dataVisual/js/SCENES";
import { useMapStore, useNewSceneStore, useHighlightLayerStore } from "../store/mapStore";
import {
  sourceFieldMap,
  legendMap,
  legendStyleMap,
  sourceColumnMap,
  sourceZoomMap,
  legendListt,
  layerSourceMap,
  sourceNameMap,
} from "../components/dataVisual/js/tilefieldMAP";
import { initSortedLayer, initTextLayer, temp } from "../components/dataVisual/layerUtil";
import {
  getSideBarTree,
  addChildren,
  showLayers,
  hideLayers,
  DICT,
} from "../components/dataVisual/js/useful";
import { getRealTimeStationData } from "../api/realtimeWaterCondition";
import dayjs from "dayjs";

// data
const tileServer = `http://${window.location.host}${import.meta.env.VITE_MAP_TILE_SERVER}`;
console.log("输出的是：" + import.meta.env.VITE_APP_BACK_ADDRESS)
const mapContainer = ref();
const mapStore = useMapStore();
const activeStatus = ref([false, false]);
const styles = [
  { backgroundImage: `url('/icons/legend.png')` },
  { backgroundImage: `url('/icons/full.png')` },
];
const featureInfo = ref({});
const showDetail = ref(false);
const showHydroPannel = ref(false);
const featureTableLoading = ref(true);
const showInfoPannel = ref(false);
const sideBarLoading = ref(true);
const legendList = ref([]);
const infoPannelTitle = ref("");
const search = ref("");
const realtimeZoom = ref(0);
var latestLGID = "";
const waterTableData = ref([]);
const infoTableData = ref([]);
const infoTableHeader = ref([]);
let nowSource;
let nowLayerGroup;
const pannelLoading = ref(true);
const baseMapRadio = ref(1);
const dataSource = ref([]);
const detailPinState = ref(false);
const listPinState = ref(false);
const iconBackStyle = computed(() => {
  return listPinState.value
    ? { backgroundImage: `url('/icons/pin.png')` }
    : { backgroundImage: `url('/icons/notPin.png')` };
});

const expandKey = ["重点岸段", "全江概貌"];
const infoTableData_filtered = computed(() => {
  let nameField = sourceNameMap[nowSource];
  let res;
  if (nowSource == null || nowSource == undefined || nowSource == "") {
    res = arrayDistinctByName(infoTableData.value, nameField);
  } else {
    let filterRes = infoTableData.value.filter((item) => {
      if (item["" + nameField].includes(search.value) && item["" + nameField] !== "长江")
        return true;
      return false;
    });

    res = arrayDistinctByName(filterRes, sourceNameMap[nowSource]);

    if (nowSource == "riverArea") {
      if (nowLayerGroup == "流域性骨干河道") {
        res.sort(customSort1);
      } else if (nowLayerGroup == "区域性骨干河道") {
        res.sort(customSort2);
      }
    } else if (nowSource == "sluiceArea") {
      res.sort(customSort3);
    } else if (nowSource == "pumpArea") {
      res.sort(customSort4);
    }
  }

  pannelLoading.value = false;

  return res;
});

///////
const pinHandler = (pinState) => {
  detailPinState.value = pinState;
};
const detailClickOutSideHandler = () => {
  if (!detailPinState.value) {
    showDetail.value = false;
  }
};
const listClickOutSideHandler = () => {
  if (!listPinState.value) {
    showInfoPannel.value = false;
  }
};

const viewChange = (node, data) => {
  const map = mapStore.getMap();
  const processMap = {
    title1: () => {
      data.active
        ? showLayers(map, DICT.T1LayerDict[data.label])
        : hideLayers(map, DICT.T1LayerDict[data.label]);
    },
    title2: () => {
      title2processMap[data.label](data.active);
    },
  };

  if (data.type == "title1") {
    data.active
      ? showLayers(map, DICT.T1LayerDict[data.label])
      : hideLayers(map, DICT.T1LayerDict[data.label]);
    let children = node.childNodes;
    for (let i = 0; i < children.length; i++) {
      children[i].data.active = data.active;
      for (let j = 0; j < children[i].childNodes.length; j++) {
        children[i].childNodes[j].data.active = data.active;
      }
    }
  } else if (data.type == "title2") {
    data.active
      ? showLayers(map, DICT.T2LayerDict[data.label])
      : hideLayers(map, DICT.T2LayerDict[data.label]);
    let children = node.childNodes;
    for (let i = 0; i < children.length; i++) {
      children[i].data.active = data.active;
    }
  } else if (data.type == "title3") {
    data.active
      ? showLayers(map, DICT.T3LayerDict[data.label])
      : hideLayers(map, DICT.T3LayerDict[data.label]);
  }
};
const treeNodeClickHandler = async (node, data) => {
  if (node.level == 2) {
    data.active = !data.active;
    viewChange(node, data);
  }
  if (node.level == 3) {
    data.active = !data.active;
    viewChange(node, data);
  }
  // showTable
};

const layerGroupClickHandler = async (node, data) => {
  pannelLoading.value = true;

  nowLayerGroup = data.label;
  const parentLabel = node.parent.data.label;
  // const totalData = node.parent.data.data
  infoPannelTitle.value = data.label;
  const process = (obj) => {
    let res = [];
    let keys = Object.keys(obj);
    keys.forEach((item) => {
      res.push({ label: obj[item], prop: item });
    });
    return res;
  };
  // data filter

  if (parentLabel === "过江通道") {
    featureTableLoading.value = true;
    showInfoPannel.value = true;
    infoTableData.value = [];
    infoTableHeader.value = [];
    nowSource = "";

    const totalData = (await axios.get(tileServer + `/tile/vector/riverBridge/info`))
      .data;
    const filterFlag = {
      已建通道: 1,
      在建通道: 0,
      规划通道: -1,
    };
    const planText = {
      1: "已建通道",
      0: "在建通道",
      "-1": "规划通道",
    };
    let tableData = totalData.filter((item) => {
      return item.plan == filterFlag[data.label];
    });
    for (let i = 0; i < tableData.length; i++) {
      tableData[i].typeText = planText["" + tableData[i].plan];
    }
    let tableHeadData = {
      name: "名称",
      // 'typeText': '类型',
    };
    infoTableData.value = tableData;
    infoTableHeader.value = { ...process(tableHeadData) };
    nowSource = DICT.LGIDSourceMap["过江通道"];
  } else if (parentLabel === "骨干河道") {
    showInfoPannel.value = true;
    infoTableData.value = [];
    infoTableHeader.value = [];
    nowSource = "";

    const filterFlag = {
      流域性骨干河道: "流域性河道",
      区域性骨干河道: "区域性骨干河道",
    };
    const typeText = {
      流域性河道: "流域性骨干河道",
      区域性骨干河道: "区域性骨干河道",
    };
    const totalData = (await axios.get(tileServer + `/tile/vector/riverArea/info`)).data;
    let tableData = totalData.filter((item) => {
      return item.kind == filterFlag[data.label];
    });
    for (let i = 0; i < tableData.length; i++) {
      tableData[i].typeText = typeText["" + tableData[i].kind];
    }
    let tableHeadData = {
      name: "名称",
      // 'typeText': '类型',
    };
    infoTableData.value = tableData;
    infoTableHeader.value = { ...process(tableHeadData) };
    nowSource = DICT.LGIDSourceMap["骨干河道"];
  } else if (parentLabel === "重要水闸") {
    showInfoPannel.value = true;
    infoTableData.value = [];
    infoTableHeader.value = [];
    nowSource = "";

    const totalData = (await axios.get(tileServer + `/tile/vector/sluiceArea/info`)).data;
    const filterFlag = {
      大中型水闸: 1,
      其他水闸: 0,
    };
    const typeText = {
      0: "其他水闸",
      1: "大中型水闸",
    };

    let tableData = totalData.filter((item) => {
      return item["if_important"] == filterFlag[data.label];
    });
    for (let i = 0; i < tableData.length; i++) {
      tableData[i].typeText = typeText["" + tableData[i]["if_important"]];
    }
    let tableHeadData = {
      sp_name: "名称",
      // 'typeText': '类型',
    };
    infoTableData.value = tableData;
    infoTableHeader.value = { ...process(tableHeadData) };
    nowSource = DICT.LGIDSourceMap["重要水闸"];
  } else if (parentLabel === "重要泵站") {
    showInfoPannel.value = true;
    infoTableData.value = [];
    infoTableHeader.value = [];
    nowSource = "";

    const filterFlag = {
      大中型泵站: 1,
      其他泵站: 0,
    };
    const typeText = {
      0: "其他泵站",
      1: "大中型泵站",
    };
    const totalData = (await axios.get(tileServer + `/tile/vector/pumpArea/info`)).data;
    let tableData = totalData.filter((item) => {
      return item["if_important"] == filterFlag[data.label];
    });
    for (let i = 0; i < tableData.length; i++) {
      tableData[i].typeText = typeText["" + tableData[i]["if_important"]];
    }
    let tableHeadData = {
      sp_name: "名称",
      // 'typeText': '类型',
    };
    infoTableData.value = tableData;
    infoTableHeader.value = { ...process(tableHeadData) };
    nowSource = DICT.LGIDSourceMap["重要泵站"];
  }
};

const baseMapChangeHandler = async () => {
  let map = mapStore.getMap();
  if (baseMapRadio.value == 0) {
    map.setStyle(getImageStyleJson());
    resetSideBarTree();

    setTimeout(() => {
      map.addSource("mapRaster22", {
        type: "raster",
        tiles: [tileServer + "/tile/raster/image/base/{x}/{y}/{z}"],
        tileSize: 256,
        minzoom: 1,
        maxzoom: 14,
        bounds: [
          118.3372672298279582,
          30.5615244886408277,
          122.3900937696443378,
          32.835981186719593,
        ],
      });
      map.addLayer({
        id: "ras",
        type: "raster",
        source: "mapRaster22",
      });
      initTextLayer(map);
    }, 500);
  } else {
    // map.once('style.load', async () => {
    //     await initSortedLayer(map)
    // })
    map.setStyle(getStyleJson4base());
    resetSideBarTree();

    setTimeout(() => {
      initSortedLayer(map);
    }, 500);
  }
};

const detailClickHandler4Feature = async (a) => {
  let featInfo = a;
  let newFeatInfomation = {
    ogData: featInfo,
    sourceId: nowSource,
    column: DICT.sourceColumnMap[nowSource],
  };
  featureInfo.value = newFeatInfomation;
  // showDetail.value = true

  let map = mapStore.getMap();
  if (nowSource == "riverBridge") {
    let detailInfo = (
      await axios.get(
        tileServer + `/tile/vector/${nowSource}/id/${featInfo.id}/info/bbox`
      )
    ).data;
    let bbox = [
      [detailInfo.bbox[0], detailInfo.bbox[1]],
      [detailInfo.bbox[2], detailInfo.bbox[3]],
    ];
    map.fitBounds(bbox, {
      padding: paddingMap[nowSource],
      maxZoom: maxZoomMap[nowSource],
    });
    // const colorMap = {
    //     '1': 'rgb(162,212,235)',
    //     '0': 'rgb(247,132,9)',
    //     '-1': 'rgb(85,112,125)',
    // }
    // !map.getLayer(nowSource + '-' + featInfo.id) &&
    //     map.addLayer({
    //         id: nowSource + '-' + featInfo.id,
    //         type: 'line',
    //         source: nowSource,
    //         'source-layer': 'default',
    //         filter: ['==', "id", featInfo.id],
    //         layout: {},
    //         paint: {
    //             'line-color': '#FF0000',
    //             'line-opacity': 0.3,
    //         },
    //     })
    // setTimeout(() => {
    //     map.removeLayer(nowSource + '-' + featInfo.id)
    // }, 5000)
  } else if (nowSource == "riverArea") {
    // http://localhost:5173/api/tile/vector/river/riverArea/id/1/buffer/500/cj/bbox
    // let detailInfo = (await axios.get(tileServer + `/tile/vector/${nowSource}/id/${featInfo.id}/buffer/15000/cj/bbox`)).data
    let detailInfo = (
      await axios.get(
        tileServer + `/tile/vector/${nowSource}/id/${featInfo.id}/info/bbox`
      )
    ).data;
    let bbox = [
      [detailInfo.bbox[0], detailInfo.bbox[1]],
      [detailInfo.bbox[2], detailInfo.bbox[3]],
    ];
    map.fitBounds(bbox, {
      padding: paddingMap[nowSource],
      maxZoom: maxZoomMap[nowSource],
    });
    !map.getSource(nowSource + "-" + featInfo.id) &&
      !map.getSource("riverArea") &&
      map.addSource("riverArea", {
        type: "vector",
        tiles: [tileServer + "/tile/vector/riverArea/{x}/{y}/{z}"],
      });

    !map.getLayer(nowSource + "-" + featInfo.id) &&
      map.addLayer({
        id: nowSource + "-" + featInfo.id,
        type: "fill",
        source: nowSource,
        "source-layer": "default",
        filter: ["==", "id", featInfo.id],
        layout: {},
        paint: {
          "fill-color": "#FF0000",
          "fill-opacity": 0.3,
        },
      });
    // map.setPaintProperty(nowSource + '-' + featInfo.id, 'fill-opacity', 0.3)

    setTimeout(() => {
      map.getLayer(nowSource + "-" + featInfo.id) &&
        map.removeLayer(nowSource + "-" + featInfo.id);
    }, 5000);
  } else if (nowSource == "sluiceArea" || nowSource == "pumpArea") {
    // http://localhost:5173/api/tile/vector/pumpArea/id/1/buffer/500/cj/bbox
    let detailInfo = (
      await axios.get(
        tileServer + `/tile/vector/${nowSource}/id/${featInfo.id}/buffer/1000/cj/bbox`
      )
    ).data;
    let bbox = [
      [detailInfo.bbox[0], detailInfo.bbox[1]],
      [detailInfo.bbox[2], detailInfo.bbox[3]],
    ];
    map.fitBounds(bbox, {
      padding: paddingMap[nowSource],
      maxZoom: maxZoomMap[nowSource],
    });

    const colorMap = {
      sluiceArea: "#FF0000",
      pumpArea: "#0000FF",
    };

    // Set marker options.
    const marker = new mapboxgl.Marker({
      color: colorMap[nowSource],
      draggable: true,
    })
      .setLngLat([featInfo.center_x, featInfo.center_y])
      .addTo(map);

    setTimeout(() => {
      marker.remove();
    }, 5000);
  } else {
    // console.log('else')
  }
};

const featureNodeClick = async (node, data) => {
  // only bank and riverBeach
  let featInfo = data.property;
  let lgId = data.lgId;
  let nowSource = layerSourceMap[lgId];
  // let newFeatInfomation = {
  //     ogData: featInfo,
  //     sourceId: nowSource,
  //     column: sourceColumnMap[nowSource],
  // }
  // featureInfo.value = newFeatInfomation
  if (node.parent.data.label.includes("岸段")) {
    showDetail.value = true;
    const featureDetailInfo = (
      await axios.get(
        tileServer + `/tile/vector/${nowSource}/id/${featInfo.id}/info/bbox`
      )
    ).data;
    featureInfo.value = {
      ogData: featureDetailInfo,
      sourceId: nowSource,
      column: sourceColumnMap[nowSource],
    };
    // featureHighLight(lgId, mapStore.getMap(), featInfo.id)
  }

  let detailInfo = (
    await axios.get(
      tileServer + `/tile/vector/${nowSource}/id/${data.property.id}/info/bbox`
    )
  ).data;
  let bbox = [
    [detailInfo.bbox[0], detailInfo.bbox[1]],
    [detailInfo.bbox[2], detailInfo.bbox[3]],
  ];

  let map = mapStore.getMap();
  map.fitBounds(bbox, {
    padding: paddingMap[nowSource],
    maxZoom: maxZoomMap[nowSource],
  });

  ////////highlight
  if (nowSource == "riverBeach") {
    !map.getSource("riverBeachLine") &&
      map.addSource("riverBeachLine", {
        type: "vector",
        tiles: [tileServer + "/tile/vector/riverBeachLine/{x}/{y}/{z}"],
      });
    !map.getLayer(nowSource + "-" + featInfo.id) &&
      map.addLayer({
        id: nowSource + "-" + featInfo.id,
        type: "line",
        source: "riverBeachLine",
        "source-layer": "default",
        filter: ["==", "id", featInfo.id],
        layout: {},
        paint: {
          "line-color": "rgb(240, 0, 0)",
          "line-width": 3.0,
          "line-opacity": 0.5,
          "line-dasharray": [5, 3],
        },
      });
    setTimeout(() => {
      map.removeLayer(nowSource + "-" + featInfo.id);
    }, 5000);
  }
};

const toolClick = (i) => {
  if (i == 1) {
    //zoom
    mapFlyToRiver(mapStore.getMap());
    return;
  }
  activeStatus.value[i] = !activeStatus.value[i];
};
const mapFlyToRiver = (mapIns) => {
  if (!mapIns) return;
  mapIns.fitBounds(
    [
      [118.40770531586725, 31.015473926104463],
      [122.06874017956159, 32.73217294711945],
    ],
    { pitch: 0, duration: 1500 }
  );
};
const closeHandler = (index) => {
  activeStatus.value[index] = false;
};
const resetSideBarTree = () => {
  // console.log('reset!')
  /////// STATIC
  let nowTree = dataSource.value;
  nowTree[0].active = true;
  nowTree[0].children[0].active = true;
  nowTree[0].children[1].active = true;
  nowTree[0].children[2].active = true;

  nowTree[1].active = true;

  nowTree[2].active = false;
  nowTree[2].children[0].active = false;
  nowTree[2].children[0].children[0].active = false;
  nowTree[2].children[0].children[1].active = false;
  nowTree[2].children[0].children[2].active = false;

  nowTree[2].children[1].active = false;

  nowTree[3].active = true;
  nowTree[3].children[0].active = true;
  nowTree[3].children[1].active = true;

  nowTree[4].active = false;
  nowTree[4].children[0].active = false;
  nowTree[4].children[1].active = false;

  nowTree[5].active = false;
  nowTree[5].children[0].active = false;
  nowTree[5].children[1].active = false;

  nowTree[6].active = true;

  nowTree[7].active = false;
  nowTree[7].children[0].active = true;
  nowTree[7].children[1].active = true;
  nowTree[7].children[2].active = false;
};

const prepareMap = async () => {
  const mapInstance = await initBaseMap(mapContainer.value);
  mapStore.setMap(mapInstance);
  mapInstance.addControl(
    new mapboxgl.NavigationControl({
      showZoom: false,
      showCompass: true,
      visualizePitch: true,
    }),
    "top-right"
  );
  mapInstance.addControl(new mapboxgl.ScaleControl({ maxWidth: 150 }), "bottom-left");
  mapInstance.dragRotate.disable();
  mapInstance.touchZoomRotate.disableRotation();
  mapFlyToRiver(mapInstance);

  mapInstance.on("zoom", () => {
    realtimeZoom.value = mapInstance.getZoom();
  });
  // mapInstance.on('style.load', async () => {
  //     console.log('style load')
  //     if (baseMapRadio.value == 0) {
  //         mapInstance.addSource('mapRaster22', {
  //             type: 'raster',
  //             tiles: [
  //                 tileServer + '/tile/raster/image/base/{x}/{y}/{z}',
  //             ],
  //             tileSize: 256,
  //             minzoom: 1,
  //             maxzoom: 14,
  //             bounds: [
  //                 118.3372672298279582, 30.5615244886408277, 122.3900937696443378,
  //                 32.835981186719593,
  //             ],
  //         })
  //         mapInstance.addLayer({
  //             id: 'ras',
  //             type: 'raster',
  //             source: 'mapRaster22',
  //         })
  //         await initTextLayer(mapInstance)
  //     }
  //     else {
  //         await initSortedLayer(mapInstance)
  //     }
  // })
  window.addEventListener("keydown", (e) => {
    const styleJson = mapInstance.getStyle();
    // console.log(styleJson)
  });
  return mapInstance;
};
const waterConditionTime = ref(dayjs().format(`YYYY年MM月DD日`));
const updateWaterInfo = async () => {
  waterTableData.value = await getRealTimeStationData();
  waterConditionTime.value = dayjs().format(`YYYY年MM月DD日`);
};

let updateWaterInfoInterval = null;

// const addChildren = () => {
//   axios.get(tileServer + `/tile/vector/importantBank/info`).then((res) => {
//     let bankData = res.data;
//     let w1 = [];
//     let w2 = [];
//     let w3 = [];

//     for (let i = 0; i < bankData.length; i++) {
//       let item = bankData[i];
//       if (item["warning_level"] == 1) {
//         w1.push({
//           label: item["bank_name"],
//           active: false,
//           type: "feature",
//           property: item,
//           lgId: "一级预警岸段",
//         });
//       } else if (item["warning_level"] == 2) {
//         w2.push({
//           label: item["bank_name"],
//           active: false,
//           type: "feature",
//           property: item,
//           lgId: "二级预警岸段",
//         });
//       } else if (item["warning_level"] == 3) {
//         w3.push({
//           label: item["bank_name"],
//           active: false,
//           type: "feature",
//           property: item,
//           lgId: "三级预警岸段",
//         });
//       }
//     }

//     // debugger
//     w1.sort((a, b) => {
//       return bank1Sort.indexOf(a.label) - bank1Sort.indexOf(b.label);
//     });
//     w2.sort((a, b) => {
//       return bank2Sort.indexOf(a.label) - bank2Sort.indexOf(b.label);
//     });
//     w3.sort((a, b) => {
//       return bank3Sort.indexOf(a.label) - bank3Sort.indexOf(b.label);
//     });
//     dataSource.value[0].children[0].children = w1;
//     dataSource.value[0].children[1].children = w2;
//     dataSource.value[0].children[2].children = w3;
//   });

//   axios
//     .get(tileServer + `/tile/vector/riverBeach/info`)
//     .then((res) => {

//       let zt = res.data;
//       zt.sort((a, b) => {
//         return sandBarSort.indexOf(a.name) - sandBarSort.indexOf(b.name);
//       });

//       zt.forEach((item) => {
//         dataSource.value[1].children.push({
//           label: item.name,
//           active: false,
//           type: "feature",
//           property: item,
//           lgId: "长江沙洲",
//         });
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };

onMounted(async () => {
  //////////init map
  let map = await prepareMap();

  //////////add legend
  legendList.value = legendListt;
  // dataSource.value = await getSideBarTree()
  // sideBarLoading.value = false
  // getSideBarTree().then((result) => {
  //     dataSource.value = result
  //     sideBarLoading.value = false
  // }).catch((err) => {
  //     console.error("side bar tree error!!!");
  // });
  sideBarLoading.value = false;
  dataSource.value = getSideBarTree();
  initSortedLayer(map);

  updateWaterInfo();
  updateWaterInfoInterval = setInterval(updateWaterInfo, 1000 * 60 * 1);

  addChildren(dataSource);
});

//////////// DEBUG FUNCTIONS
const getLayerFeatureArray = async (mapInstance, layerName) => {
  // 获取要素数组的函数
  let properties = [];
  let layer = mapInstance.getLayer(layerName);
  if (!layer) return properties;

  let sourceId = layer.source;
  let source = mapInstance.getSource(sourceId);
  if (!source) return properties;

  if (source.type == "geojson") {
    let geofeatures = source["_data"]["features"];
    for (let i = 0; i < geofeatures.length; i++) {
      properties.push(geofeatures[i]["properties"]);
    }
  } else if (source.type == "vector") {
    const res = await axios.get(tileServer + `/tile/vector/${sourceId}/info`);
    properties = res.data;
    // special
    if (sourceId == "importantBank") {
      let warn1 = [];
      let warn2 = [];
      let warn3 = [];
      for (let i = 0; i < properties.length; i++) {
        if (properties[i].warning_level == 1) warn1.push(properties[i]);
        else if (properties[i].warning_level == 2) warn2.push(properties[i]);
        else if (properties[i].warning_level == 3) warn3.push(properties[i]);
      }
      if (layerName == "一级预警岸段") properties = warn1;
      else if (layerName == "二级预警岸段") properties = warn2;
      else if (layerName == "三级预警岸段") properties = warn3;
    }
    // featureInfo.value['sourceId'] = sourceId
    nowSource = sourceId;
  }
  return properties;
};
const getTableHeader = (mapInstance, layerName) => {
  let layer = mapInstance.getLayer(layerName);
  if (!layer) return properties;

  let sourceId = layer.source;
  let source = mapInstance.getSource(sourceId);
  if (!source) return properties;
  let title = FieldMap[sourceId]["fieldMap"];
  return title;
};
const sideBarClickHandler = (node, data) => {
  if (node.level === 1) {
    //必然是全体控制
    if (data.label === "重点岸段") {
    }
    if (data.type == "title1" && data.label !== "其他") {
      let lgId = data.label;
      if (data.active == true) hideLayers(mapStore.getMap(), lableLayerMap[lgId]);
      if (data.active == false) showLayers(mapStore.getMap(), lableLayerMap[lgId]);
      data.active = !data.active;
    }
  } else if (node.level === 2) {
    //可能要素,可能图层
    if (data.type == "feature") {
      emit("detailClick", data.property, node.parent.data.label);
    }
    if (data.type == "title2") {
      let lgId = data.label;
      if (data.active == true) {
        let lgId = data.label;
        hideLayers(mapStore.getMap(), lableLayerMap[lgId]);
        data.active = false;
      } else {
        let lgId = data.label;
        showLayers(mapStore.getMap(), lableLayerMap[lgId]);
        data.active = true;
      }
    }
  } else if (node.level === 3) {
    //要素
    if (data.type == "feature") {
      emit("detailClick", data.property, node.parent.data.label);
    }
  }
};
const featureHighLight = (featureLayerid, map, featureId) => {
  let featureLayer = map.getLayer(featureLayerid);

  let sourceid = featureLayer.source;
  let layoutMap = {
    line: {},
    fill: {},
    circle: {},
    symbol: {
      "icon-size": 3.0,
    },
  };
  let paintMap = {
    line: {
      "line-color": "#FF5D06",
      "line-width": 5,
    },
    fill: {
      "fill-color": "#FF5D06",
      "fill-opacity": 0.8,
    },
    circle: {
      "circle-color": "#FF5D06",
      "circle-radius": 8,
    },
    symbol: {},
  };

  // 1  add highlight layer
  map.addLayer({
    id: `${featureLayerid}-highlight-${featureId}`, //自定义
    type: featureLayer.type,
    source: featureLayer.source,
    "source-layer": featureLayer.sourceLayer,
    filter: ["==", ["get", "id"], featureId], //自定义
    layout: layoutMap[featureLayer.type],
    paint: paintMap[featureLayer.type],
  });

  // 2  use expression  但不适用于现在的Map 还是用加图层的办法
  // map.setPaintProperty(layerId, 'fill-color', [
  //     'match',
  //     ['get', sourceNameMap[sourceid]], // 获取要素的'name'属性
  //     'featureName', ['literal', 'rgba(255, 0, 0, 1)'], // 如果'name'是'123'，则使用红色高亮
  //     ['literal', map.getPaintProperty(layerId, 'fill-color')] // 否则保持原有样式
  // ]);

  // highlightLayer.value.push(`${layerId}-highlight-${featureId}`)
  // useHighlightLayerStore().highlightLayers = highlightLayer.value;
  setTimeout(() => {
    if (map.getLayer(`${featureLayerid}-highlight-${featureId}`))
      map.removeLayer(`${featureLayerid}-highlight-${featureId}`);
  }, 5000);
};

const arrayDistinct = (arr) => {
  return arr.filter((item, index) => {
    return arr.indexOf(item) === index;
  });
};

const arrayDistinctByName = (tempArr, nameField) => {
  let result = [];
  let obj = {};
  for (let i = 0; i < tempArr.length; i++) {
    if (!obj[tempArr[i][nameField]]) {
      result.push(tempArr[i]);
      obj[tempArr[i][nameField]] = true;
    }
  }
  return result;
};

onUnmounted(async () => {
  if (useMapStore().getMap()) {
    useMapStore().getMap().remove();
    useMapStore().destroyMap();
  }

  updateWaterInfoInterval && clearInterval(updateWaterInfoInterval);
});

/////////////  BBOX MAP
const paddingMap = {
  importantBank: { top: 50, bottom: 0, left: 300, right: 300 },
  riverBeach: { top: 50, bottom: 0, left: 300, right: 300 },
  riverBridge: { top: 150, bottom: 50, left: 100, right: 100 },
  riverArea: { top: 150, bottom: 50, left: 100, right: 100 },
  sluiceArea: {},
  pumpArea: {},
};

const maxZoomMap = {
  importantBank: 14,
  riverBeach: 13,
  riverBridge: 14,
  riverArea: 22,
  sluiceArea: 14,
  pumpArea: 14,
};

const liuyuxing = [
  "滁河",
  "望虞河",
  "泰州引江河",
  "秦淮河",
  "水阳江",
  "太浦河",
  "淮河下游入江水道",
  "新孟河",
  "京杭运河白马湖-高宝湖长江区段",
];
const quyuxing = [
  "七浦塘",
  "白茆塘",
  "常浒河",
  "张家港",
  "锡澄运河",
  "九曲河",
  "白屈港",
  "杨林塘",
  "通扬运河",
  "澡港河",
  "德胜河",
  "焦港",
  "九圩港",
  "划子口河",
  "岳子河",
  "朱家山河",
  "如海运河",
  "通吕运河",
  "十一圩港",
  "夏仕港",
  "娄江-浏河",
  "走马塘",
];

const shuizha = [
  "秦淮新河节制闸",
  "三汊河河口闸",
  "朱家山河闸",
  "划子口节制闸",
  "瓜洲节制闸",
  "泰州引江河枢纽—高港节制闸",
  "夏仕港节制闸",
  "焦土港闸",
  "望虞河常熟水利枢纽-水闸工程",
  "岳子河河闸",
  "中坝闸",
  "七摆渡闸站",
  "引航道枢纽工程-水闸工程",
  "京口闸",
  "三茅镇沙家港闸",
  "口岸闸",
  "过船节制闸",
  "天星港闸",
  "太字港节制闸",
  "南通节制闸",
  "营船港闸",
  "白茆闸",
  "浏河节制闸",
];
const bengzhan = [
  "望虞河常熟水利枢纽泵站工程",
  "秦淮新河闸站一泵站工程",
  "武定门闸站—泵站工程",
  "澡港河水利枢纽-泵站工程",
  "魏村水利枢纽-泵站工程",
  "谏壁抽水站",
  "高港泵站",
  "九圩港提水泵站",
  "杨家沟站",
  "大年站",
  "十二圩翻水站",
  "大年站",
  "引航道枢纽工程-泵站工程",
  "东风泵站",
  "大港泵站",
  "上九圩泵站",
  "新夏港泵站",
  "焦港泵站",
  "三干河泵站",
  "七浦塘江边枢纽泵站",
  "新沟泵站",
];

const customSort1 = (a, b) => {
  let indexA = liuyuxing.indexOf(a.name);
  let indexB = liuyuxing.indexOf(b.name);

  if (indexA === -1) indexA = Infinity;
  if (indexB === -1) indexB = Infinity;

  return indexA - indexB;
};
const customSort2 = (a, b) => {
  let indexA = quyuxing.indexOf(a.name);
  let indexB = quyuxing.indexOf(b.name);

  if (indexA === -1) indexA = Infinity;
  if (indexB === -1) indexB = Infinity;

  return indexA - indexB;
};
const customSort3 = (a, b) => {
  let indexA = shuizha.indexOf(a.sp_name);
  let indexB = shuizha.indexOf(b.sp_name);
  if (indexA === -1) indexA = Infinity;
  if (indexB === -1) indexB = Infinity;

  return indexA - indexB;
};
const customSort4 = (a, b) => {
  let indexA = bengzhan.indexOf(a.sp_name);
  let indexB = bengzhan.indexOf(b.sp_name);

  if (indexA === -1) indexA = Infinity;
  if (indexB === -1) indexB = Infinity;

  return indexA - indexB;
};
</script>

<style lang="scss" scoped>
.data-visual-container {
  width: 100vw;
  height: 92vh;
  position: absolute;
  background-color: rgba(228, 242, 252, 0.6);
  display: flex;
  flex-direction: row;
  overflow: hidden;

  .sideBar {
    position: relative;
    width: 15vw;
    height: 92vh;

    div.sideBar-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .title-text {
        position: relative;
        height: 5vh;
        line-height: 5vh;
        border-radius: 6px;
        font-family: "Microsoft YaHei";
        font-weight: bold;
        font-size: calc(0.8vw + 0.8vh);
        color: #0a72c7;
        text-shadow: 0 0 10px #72c0ff;
      }

      .hr_gradient {
        position: relative;
        margin-top: 0.5vh;
        border: 0;
        height: 0.4vh;
        width: 90%;
        background-image: linear-gradient(
          to right,
          rgb(167, 233, 255),
          rgb(14, 155, 219),
          rgb(167, 233, 255)
        );
      }

      .scenes-tree-container {
        position: relative;
        width: 90%;
        // height: 80vh;
        height: 95%;
        background-color: #f1fcff;
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 3px;
        }

        &::-webkit-scrollbar-track {
          background-color: rgba(10, 231, 251, 0.219);
        }

        &::-webkit-scrollbar-thumb {
          background-color: #15a1e294;
          border-radius: 5px;
        }

        &::-webkit-scrollbar-thumb:hover {
          background-color: #3af0f781;
        }
      }

      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
        width: 100%;
        height: 100%;

        &:hover {
          cursor: default;
        }

        .scene-card {
          margin: 0.5vh;
          width: 90%;
          height: 4vh;
          border-radius: 5px;
          background: rgb(20, 115, 196);
          padding: 4px;
          overflow: hidden;
          box-shadow: #cbeafd 10px 7px 20px 0px;
          display: flex;
          flex-direction: row;
          align-items: center;
          transition: transform 0.5s;
          user-select: none;

          .scene-top-section {
            //   height: 10vh;
            border-radius: 5px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            // background: rgb(234, 244, 252);
            position: relative;
            width: 70%;

            .scene-title {
              width: 100%;
              height: 4vh;

              .scene-title-text {
                color: rgb(234, 244, 252);
                font-size: calc(0.8vw + 0.8vh);
                font-style: normal;
                font-weight: 700;
                margin-left: 1vw;
                line-height: 4vh;
                font-family: "Microsoft YaHei";
              }
            }

            &:hover {
              transform: scale(1.02);
              cursor: pointer;
            }
          }

          .scene-top-section .active {
            background: linear-gradient(45deg, rgb(255, 255, 255), #c9e1f5);

            .scene-title {
              .scene-title-text {
                color: rgb(27, 116, 193);
              }
            }
          }

          .checkbox {
            width: 30%;
            height: 4vh;
            transform: translateY(20%) translateX(30%);
          }
        }

        .subScene-container {
          // width: 12vw;
          // height: 4vh;
          width: 98%;
          height: 4.5vh;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 4px;
          padding-left: 0;

          .card {
            flex-grow: 1;
            width: 100%;
            height: 4vh;
            margin-right: 5%;
            border-radius: 5px;
            background: rgb(20, 115, 196);
            padding: 4px;
            overflow: hidden;
            box-shadow: #cbeafd 10px 7px 20px 0px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            transition: transform 0.5s;
            user-select: none;
            transition: 0.3s linear;

            &:hover {
              // transform: scale(1.02);
              cursor: pointer;
            }

            .top-section {
              //   height: 10vh;
              height: 100%;
              width: 100%;
              border-radius: 5px;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              background: rgb(234, 244, 252);
              position: relative;
              transition: 0.3s linear;

              // .icon-container {
              //     position: relative;
              //     width: 4vh;
              //     height: 4vh;

              //     .icon {
              //         top: 0;
              //         right: 15%;
              //         transform: translateX(50%) translateY(20%);
              //         width: 3vh;
              //         height: 3vh;
              //         position: absolute;
              //         background-size: contain;
              //     }
              // }

              .title {
                position: relative;
                width: 100%;
                height: 4vh;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                text-align: center;

                .subScene-title-text {
                  color: rgb(20, 115, 196);
                  font-size: calc(0.7vw + 0.6vh);
                  font-weight: 600;
                  font-style: normal;
                  margin-left: 1vw;
                  line-height: 4vh;
                  font-family: "Microsoft YaHei";
                }

                .detail-icon {
                  position: absolute;
                  right: 0.2vw;
                  z-index: 100;
                }
              }
            }
          }

          .card.active {
            // box-shadow: #cbeafd 10px 7px 20px 0px;
            // border: inset #C9E1F5 3px solid;

            .top-section {
              background: rgb(26, 143, 245);

              .title {
                .subScene-title-text {
                  color: rgb(234, 244, 252);
                }

                .detail-icon {
                }
              }
            }
          }

          .card.expand {
            width: 100%;
            height: 4vh;
            transition: 0.3s linear;
          }

          .button-block {
            position: relative;
            width: 25%;
            height: 5vh;
            display: flex;
            justify-content: center;
            align-items: center;
            user-select: none;

            .btn {
              width: 3.8vh;
              height: 3.8vh;
              background-size: contain;
              background-image: url("/detail.png");
              transition: 0.3s linear;

              &:hover {
                cursor: pointer;
                // transform: scale(1.05);
              }
            }
          }
        }

        .feature-container {
          width: 88%;
          height: 3vh;
          display: flex;
          flex-direction: row;
          margin: 0.2vh;
          padding-left: 0;
          background-color: #c9e1f5;
          border-radius: 5%;
          border-color: #0a72c7;

          &:hover {
            cursor: pointer;
          }

          .feature-content {
            color: rgb(20, 115, 196);
            font-size: calc(0.5vw + 0.5vh);
            font-weight: 600;
            font-style: normal;
            margin-left: 0.2vw;
            line-height: 3vh;
            font-family: "Microsoft YaHei";
            display: flex;
            flex-direction: row;
            align-items: center;
          }

          .smaller {
            font-size: calc(0.4vw + 0.5vh);
          }
        }
      }
    }

    :deep(.el-tree) {
      .el-tree-node__content {
        height: fit-content;
        transform: translateX(-1%);
      }

      .el-tree-node__content > .el-tree-node__expand-icon {
        padding: 0px;
      }

      .el-tree-node__expand-icon {
        font-size: calc(0.8vw + 0.6vh);
        color: #0a72c7;
      }
    }

    :deep(.el-checkbox) {
      width: fit-content;
      height: fit-content;

      .el-checkbox__input {
        .el-checkbox__inner {
          transform: scale(2);

          &::after {
            scale: 1.2;
          }
        }
      }
    }
  }

  .mapBase {
    position: relative;
    width: 85vw;
    height: 92vh;

    #map {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 0;
      background-color: hsl(180, 7%, 94%);
    }
  }

  div.tools-container {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 4vw;
    height: 18vh;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    z-index: 2;

    .icon-container {
      position: relative;
      width: 6vh;
      height: 6vh;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;
      background-color: rgb(255, 255, 255);

      .icon {
        width: 4vh;
        height: 4vh;
        background-size: contain;
        z-index: 2;

        &:hover {
          box-shadow: 0px 10px 20px rgb(1, 110, 236), 0px -10px 20px rgb(1, 110, 236);
          cursor: pointer;
        }
      }

      .active {
        box-shadow: 0px 10px 20px rgb(1, 110, 236), 0px -10px 20px rgb(1, 110, 236);
        cursor: pointer;
        transition: 0.3s ease-in-out;
      }
    }
  }

  div.search-pos {
    position: absolute;
    z-index: 2;
    right: 1vw;
    top: 10vh;
  }

  div.layer-pos {
    position: absolute;
    z-index: 2;
    right: 1vw;
    top: 10vh;
  }

  div.legend-pos {
    position: absolute;
    z-index: 2;
    right: 5vw;
    bottom: 7vh;
  }

  div.featDetail {
    position: absolute;
    z-index: 2;
    left: 18vw;
    top: 0vh;
  }

  div.infomation-pannel {
    position: absolute;
    z-index: 2;
    left: 19vw;
    top: 17vh;
    width: 13vw;
    background-color: rgb(20, 115, 196);
    backdrop-filter: blur(5px);
    border: solid 3px #6990c4;
    border-radius: 2%;
    overflow: hidden;

    div.title-block {
      width: 100%;
      height: 4vh;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      &:hover {
        cursor: move;
      }

      div.title {
        // font-size: calc(0.4vw + 0.8vh);
        width: fit-content;
        height: 4vh;
        line-height: 4vh;
        text-align: center;
        font-size: calc(0.8vw + 0.3vh);
        font-weight: 600;
        color: #e3f4ff;
        text-shadow: #173eaa 1px 1px, #173eaa 2px 2px, #173eaa 3px 3px;
      }

      div.miniIcon {
        position: absolute;
        right: 0.5vw;
        top: 1vh;
        width: 2.3vh;
        height: 2.3vh;
        // background-image: url('/icons/pin.png');
        background-size: contain;
        background-repeat: no-repeat;

        &:hover {
          cursor: pointer;
        }
      }
    }

    div.important-feature {
      // width: 20vw;
      // height: 30vh;
      width: 13vw;
      height: 30vh;
    }

    div.feature-search {
      .e-input {
        width: 18vw;
        height: 4vh;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        transform: translateY(-20%);
        scale: 1;
      }

      .tree-container {
        position: relative;
        width: 10vw;
        height: 20vh;
        padding-left: 1vw;
        padding-bottom: 1vh;
        padding-top: 0.5vh;
        box-shadow: rgb(201, 230, 255) 0px 0px 5px 3px inset;
        border-radius: 1%;
        overflow-y: auto;
        overflow-x: auto;

        .feature-desc {
          height: 3vh;
          text-align: left;
        }

        :deep(.el-tree) {
          background-color: rgb(239, 247, 253);
          height: 24vh;
          overflow-y: auto;
          overflow-x: auto;

          &::-webkit-scrollbar {
            width: 5px;
          }

          &::-webkit-scrollbar-track {
            background-color: rgba(162, 168, 168, 0.219);
          }

          &::-webkit-scrollbar-thumb {
            background-color: rgb(94, 164, 250);
            border-radius: 5px;
          }

          &::-webkit-scrollbar-thumb:hover {
            background-color: rgb(48, 136, 243);
          }
        }

        .custom-tree-node {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-right: 8px;

          .text {
            font-size: calc(0.6vw + 0.4vh);
            color: rgb(19, 70, 147);
            font-weight: 500;
            font-family: "Microsoft YaHei";
          }
        }
      }
    }
  }

  div.hydro-pannel {
    position: absolute;
    z-index: 2;
    right: 5vw;
    top: 0vh;
    width: 18vw;
    padding: calc(0.1vw + 0.1vh);
    background-color: aliceblue;
    user-select: none;
    border: solid calc(0.1vh + 0.1vw) rgb(82, 163, 235);
    border-radius: calc(0.1vh + 0.3vw);
    transition: ease-in-out 0.3s;

    .title {
      border-bottom: rgb(41, 40, 40) 1px solid;
      font-weight: bold;
      font-size: calc(0.7vw + 0.5vh);
      line-height: 3vh;
      width: 100%;

      .title-time {
        padding-left: 3vw;
        font-size: calc(0.55vw + 0.4vh);
        line-height: 3vh;
      }

      .iconn {
        position: absolute;
        right: 1vw;
        top: 1vh;

        :hover {
          cursor: pointer;
        }
      }
    }
  }

  div.radio-container {
    position: absolute;
    bottom: 2vh;
    right: 6vw;
  }
}

:deep(.mapboxgl-ctrl-group button) {
  width: 5vh;
  height: 5vh;
}

:deep(.mapboxgl-ctrl button.mapboxgl-ctrl-compass .mapboxgl-ctrl-icon) {
  background-image: url("/icons/compass.svg");
}

:deep(.mapboxgl-ctrl.mapboxgl-ctrl-scale) {
  text-align: center;
  font-size: calc(0.5vw + 0.5vh);
}

:deep(.el-scrollbar__wrap) {
  scroll-behavior: smooth;
}

:deep(.el-table__inner-wrapper::before) {
  background: hsl(210, 70%, 30%);
}

:deep(.el-table__border-left-patch) {
  background: transparent;
}

:deep(.el-table .el-table__cell) {
  border: 1px solid #c6e7f0;
}

:deep(.el-table thead th.el-table__cell) {
  color: #173eaa;
  background: rgba(238, 244, 255, 0.6);
  font-size: calc(0.6vw + 0.3vh);

  div.cell {
    height: 100%;
    line-height: 100%;
    width: 100%;
    text-align: center;
  }
}

:deep(.el-table tbody tr) {
  transition: all 0.6s cubic-bezier(0.68, -0.15, 0.265, 1.15);
  height: fit-content;

  div.cell {
    height: fit-content;
    line-height: 2vh;
    font-size: calc(0.5vw + 0.3vh);
    text-align: center;
  }
}

:deep(.el-table tbody tr:nth-child(2n)) {
  &.even-state {
    color: hsl(209, 58%, 39%);
    background: rgb(235, 242, 255);
    font-weight: 600;
  }

  &.odd-state {
    color: rgba(230, 243, 255, 0.9);
    background: rgb(45, 87, 177);
    font-weight: 600;
  }
}

// :deep(.el-table__body tr:nth-child(2n):hover > td) {
//     background: hsl(210, 70%, 32%);
// }

:deep(.el-table tbody tr:nth-child(2n + 1)) {
  &.even-state {
    color: rgba(230, 243, 255, 0.9);
    background: rgb(45, 87, 177);
    font-weight: 600;
  }

  &.odd-state {
    color: hsl(209, 58%, 39%);
    background: rgb(235, 242, 255);
    font-weight: 600;
  }
}

// :deep(.el-table__body tr:nth-child(2n + 1):hover > td) {
//     background: hsl(210, 70%, 32%);
// }

:deep(.el-table tbody tr.highLight-row) {
  background: hsl(210, 70%, 16%);
  animation: shine 2.4s infinite;
}

:deep(.el-table tbody tr.highLight-row:hover > td) {
  cursor: pointer;
}

.small-column {
  background-color: red;
}
</style>

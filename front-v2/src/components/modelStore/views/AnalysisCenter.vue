<template>
  <div class="all">
    <ModelTitleVue :ModelName="'近岸演变分析模型'" />

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
            <top-tool @returnFileList="returnFileList" @operateDraw="operateDraw" @analyse="analyse"
              @uploadHandle="drawHandle" :dataList="dataList"></top-tool>
          </div>
          <el-skeleton :rows="5" animated class="bottom" v-if="skeletonFlag" />
          <data-manage class="top" ref="dataManage" :dataList="dataList" @operateLayer="operateLayer"
            v-else></data-manage>
          <el-skeleton :rows="5" animated class="bottom" v-if="skeletonFlag" />
          <layer-manage class="bottom" ref="layerManage" :layerList="layerList" @closeLayer="closeLayer"
            @hideLayer="hideLayer" @moveLayer="moveLayer" v-else></layer-manage>
        </div>

        <!-- <div class="left-resize" ref="leftResize"></div> -->
      </div>
      <el-skeleton :rows="5" animated v-if="skeletonFlag" />
      <right-visual :layerList="layerList" ref="rightMap" @drawHandle="drawHandle" v-else></right-visual>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, onBeforeUnmount, onMounted } from "vue";
import ModelTitleVue from "../ModelTitle.vue";
import ModelRequest from "../modelApi.js";
import TopTool from "../analysis-center/analysis/TopTool.vue";
import DataManage from "../analysis-center/analysis/DataManage.vue";
import LayerManage from "../analysis-center/analysis/LayerManage.vue";
import RightVisual from "../analysis-center/analysis/RightVisual.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: { ModelTitleVue, TopTool, RightVisual, DataManage, LayerManage },
  setup() {
    const skeletonFlag = ref(true);
    const dataList = ref([]);
    const layerList = ref([]);
    const rightMap = ref();
    const dataManage = ref();
    const layerManage = ref();

    const checky1 = ref(false);
    const checky2 = ref(true);
    const router = useRouter();
    const radio1 = ref(3)

    const jump2Model = (value) => {
      console.log(value == '1')
      const routeMap = {
        '1': "/modelStore/stabilityAnalysis",
        '2': "/modelStore/stabilityCalc",
        '3': "/modelStore/analysisCenter"
      }
      routeMap[value] && router.push(routeMap[value])
    }

    let eventSource;

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
      console.log(val);
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
    });

    onBeforeUnmount(() => {
      window.sessionStorage.setItem("layerList", JSON.stringify(layerList.value));
    });

    return {
      rightMap,
      returnFileList,
      dataManage,
      operateLayer,
      layerManage,
      closeLayer,
      hideLayer,
      operateDraw,
      drawHandle,
      analyse,
      skeletonFlag,
      dataList,
      layerList,
      moveLayer,
      checky1,
      checky2,
      radio1Click,
      radio1,
      jump2Model
    };
  },
});
</script>

<style lang="scss">
@import "../StabilityAnalysis.scss";
</style>

<template>
  <div class="top-tool">
    <div class="buttons">
      <!-- <div class="button" @click="dialogAddData = true">加载数据</div> -->
      <div class="button" style="cursor: not-allowed">加载数据</div>
      <div class="button" @click="dialogAnalyse = true">模型计算</div>
      <el-dropdown popper-class="draw-popper">
        <div class="button btn-draw">添加断面</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="sectionClick">绘制</el-dropdown-item>
            <el-dropdown-item>
              <el-upload
                ref="uploadSectionRef"
                :limit="1"
                :show-file-list="false"
                :on-change="uploadSection"
                accept=".json,.geojson"
                action=""
                :auto-upload="false"
                >上传</el-upload
              ></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown popper-class="draw-popper">
        <div class="button btn-draw">添加区域</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="regionClick">绘制</el-dropdown-item>
            <el-dropdown-item>
              <el-upload
                ref="uploadRegionRef"
                :limit="1"
                :show-file-list="false"
                :on-change="uploadRegion"
                accept=".json,.geojson"
                action=""
                :auto-upload="false"
                >上传</el-upload
              ></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <el-dialog v-model="dialogAddData" width="1000px" title="添加数据">
      <add-data-dialog @returnData="returnData" v-if="dialogAddData" />
    </el-dialog>

    <el-dialog v-model="dialogAnalyse" width="580px" title="模型计算">
      <analyse-dialog @analyse="analyse" v-if="dialogAnalyse" :dataList="dataList" />
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import AddDataDialog from "./AddDataDialog.vue";
import AnalyseDialog from "./AnalyseDialog.vue";
import { useRouter } from "vue-router";
import utils from "@/utils/CommonUtils";
const { uuid } = utils;
export default defineComponent({
  components: { AddDataDialog, AnalyseDialog },
  emits: ["returnFileList", "operateDraw", "analyse", "uploadHandle"],
  props: {
    dataList: {
      type: Array,
    },
  },
  setup(props, context) {
    const router = useRouter();
    const dataList = props.dataList;
    const dialogAddData = ref(false);
    const dialogAnalyse = ref(false);
    const state = ref(0);
    const uploadSectionRef = ref();
    const uploadRegionRef = ref();
    // {
    //   fileId: string;
    //   fileName: string;
    //   dataListId: string;
    //   dataListName: string;
    //   visualType: string;
    //   visualId: string;
    // }[]
    const returnData = (val) => {
      dialogAddData.value = false;
      context.emit("returnFileList", val);
    };

    const sectionClick = () => {
      if (state.value === 1) {
        state.value = 0;
      } else {
        state.value = 1;
      }
      context.emit("operateDraw", state.value);
    };

    const regionClick = () => {
      if (state.value === 2) {
        state.value = 0;
      } else {
        state.value = 2;
      }
      context.emit("operateDraw", state.value);
    };

    // { type: string, value: any }
    const analyse = (val) => {
      context.emit("analyse", val);
      dialogAnalyse.value = false;
    };

    const backToStability = () => {
      router.push("/modelStore/stabilityAnalysis");
    };

    const uploadSection = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const geojson = JSON.parse(e.target.result);
          context.emit("uploadHandle", {
            id: uuid(),
            geoJson: geojson,
            visualType: "geoJsonLine",
            fileName: file.name,
          });

          uploadSectionRef.value.clearFiles();
        } catch (error) {
          console.error("Error parsing GeoJSON:", error);
        }
      };
      reader.readAsText(file.raw, "UTF-8");
    };

    const uploadRegion = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const geojson = JSON.parse(e.target.result);
          context.emit("uploadHandle", {
            id: uuid(),
            geoJson: geojson,
            visualType: "geoJsonPolygon",
            fileName: file.name,
          });

          uploadRegionRef.value.clearFiles();
        } catch (error) {
          console.error("Error parsing GeoJSON:", error);
        }
      };
      reader.readAsText(file.raw, "UTF-8");
    };

    // const handleExceed = (files) => {
    //   upload.value.clearFiles(); // Assuming `upload` is defined elsewhere
    //   const file = files[0];
    //   file.uid = genFileId();
    //   upload.value.handleStart(file);
    //   submitUpload();
    // };

    // const submitUpload = () => {
    //   upload.value.submit();
    // };

    return {
      state,
      dialogAddData,
      returnData,
      sectionClick,
      regionClick,
      dialogAnalyse,
      analyse,
      backToStability,
      uploadSectionRef,
      uploadSection,
      uploadRegion,
    };
  },
});
</script>

<style lang="scss" scoped>
.top-tool {
  .map-tool {
    height: 100%;
    position: absolute;
    left: 35%;
    display: flex;
    align-items: center;

    .el-button {
      border: solid 1px rgba($color: #000000, $alpha: 0);
      box-sizing: border-box;
      font-size: calc(0.9vw + 0.4vh);
      font-weight: bold;
      color: #0055e1;
      // box-shadow: 0px 2px rgb(0, 225, 255);
      // text-shadow: #eef3ff 1px 1px, #eef3ff 2px 2px, #6493ff 3px 3px;
    }
  }

  .right {
    height: 100%;
    right: 30px;
    position: absolute;
    top: 10px;
    cursor: pointer;
    .el-dropdown {
      margin-top: 18px;
    }
  }

  :deep().el-dialog {
    padding: 0;

    .el-dialog__header {
      padding: 10px;
      margin: 0;
      background: #125a9d;

      .el-dialog__title {
        color: white;
        font-weight: bold;
      }
      .el-dialog__headerbtn {
        height: 40px;
        .el-icon {
          color: white;
        }
      }
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>

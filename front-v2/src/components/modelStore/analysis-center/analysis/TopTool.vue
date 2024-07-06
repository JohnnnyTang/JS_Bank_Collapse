<template>
  <div class="top-tool">
    <div class="base-function">
      <el-button text @click="dialogAddData = true" class="btn-main">添加数据</el-button>
      <el-button text @click="dialogAnalyse = true" class="btn-main">模型计算</el-button>
    </div>

    <div class="map-tool">
      <el-button type="primary" :text="state === 1 ? false : true" @click="sectionClick"
        ><svg
          width="16px"
          height="16px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="margin-right: 10px"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18 5C17.4477 5 17 5.44772 17 6C17 6.27642 17.1108 6.52505 17.2929 6.70711C17.475 6.88917 17.7236 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5ZM15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6C21 7.65685 19.6569 9 18 9C17.5372 9 17.0984 8.8948 16.7068 8.70744L8.70744 16.7068C8.8948 17.0984 9 17.5372 9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.3431 4.34315 15 6 15C6.46278 15 6.90157 15.1052 7.29323 15.2926L15.2926 7.29323C15.1052 6.90157 15 6.46278 15 6ZM6 17C5.44772 17 5 17.4477 5 18C5 18.5523 5.44772 19 6 19C6.55228 19 7 18.5523 7 18C7 17.7236 6.88917 17.475 6.70711 17.2929C6.52505 17.1108 6.27642 17 6 17Z"
            fill="#000000"
          /></svg
        >绘制断面</el-button
      >
      <el-divider direction="vertical" />
      <el-button type="primary" :text="state === 2 ? false : true" @click="regionClick"
        ><svg
          width="16px"
          height="16px"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style="margin-right: 10px"
        >
          <g>
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M20 16h2v6h-6v-2H8v2H2v-6h2V8H2V2h6v2h8V2h6v6h-2v8zm-2 0V8h-2V6H8v2H6v8h2v2h8v-2h2zM4 4v2h2V4H4zm0 14v2h2v-2H4zM18 4v2h2V4h-2zm0 14v2h2v-2h-2z"
            />
          </g></svg
        >绘制区域</el-button
      >
    </div>

    <el-dialog v-model="dialogAddData" width="1000px" title="添加数据">
      <add-data-dialog @returnData="returnData" v-if="dialogAddData" />
    </el-dialog>

    <el-dialog v-model="dialogAnalyse" width="580px" title="河床分析">
      <analyse-dialog @analyse="analyse" v-if="dialogAnalyse" />
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import AddDataDialog from "./AddDataDialog.vue";
import AnalyseDialog from "./AnalyseDialog.vue";
import router from "@/router";
export default defineComponent({
  components: { AddDataDialog, AnalyseDialog },
  emits: ["returnFileList", "operateDraw", "analyse"],
  setup(_, context) {
    const dialogAddData = ref(false);
    const dialogAnalyse = ref(false);
    const state = ref(0);

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

    return {
      state,
      dialogAddData,
      returnData,
      sectionClick,
      regionClick,
      dialogAnalyse,
      analyse,
    };
  },
});
</script>

<style lang="scss" scoped>
.top-tool {
  height: 6vh;
  display: flex;
  // background: #d1e7ff;
  background: #abd5f8;
  border-bottom: solid 0.5px #dcdfe6;
  box-sizing: border-box;
  position: relative;
  color: #26f4f9;
  align-items: center;

  .base-function {
    display: flex;
    align-items: center;
    margin-left: 70px;
    height: 100%;
  }

  .btn-main {
    width: 8vw;
    background-color: #11aee0;
    backdrop-filter: blur(8px);
    z-index: 3;
    border-radius: 6px;
    text-align: center;
    overflow: hidden;
    height: 4vh;
    line-height: 6vh;
    letter-spacing: 0.1vw;
    font-size: calc(0.9vw + 0.7vh);
    font-weight: bold;
    // background-color: #2688f8;
    color: #ffffff;
    text-align: center;
    box-shadow: 2px 3px 3px -2px rgb(0, 47, 117);

    &:hover {
      transform: scale(1.05);
      background: #1384f6;
      cursor: pointer;
    }
  }

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
      background: #000000;
      .el-dialog__title {
        color: white;
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

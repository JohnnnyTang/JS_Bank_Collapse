<template>
  <div class="analyse-dialog">
    <el-row :gutter="10" v-show="flag">
      <el-col :span="8" v-for="(item, index) in list" :key="index">
        <div class="card" @click="cardClick(item.value)">
          <div class="picture">
            <img :src="item.src" />
          </div>
          <div class="text">
            <el-tag effect="dark">{{ item.name }}</el-tag>
          </div>
        </div>
      </el-col>
    </el-row>
    <analyse-interface
      v-if="!flag"
      :analyseType="analyseType"
      :analyticDataList="analyticDataList"
      :demDataList="demDataList"
      @back="flag = true"
      @returnParameter="returnParameter"
    />
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import ModelRequest from "../../modelApi.js";
import AnalyseInterface from "./AnalyseInterface.vue";
import router from "@/router";
export default defineComponent({
  components: { AnalyseInterface },
  emits: ["analyse"],
  props: {
    dataList: {
      type: Array,
    },
  },
  setup(props, context) {
    const flag = ref(true);
    const analyseType = ref("");
    const analyticDataList = ref([]);
    const demDataList = ref([]);
    const list = [
      {
        name: "断面形态",
        src: import.meta.env.VITE_BASE + "/analyse/duanmianXT.png",
        value: "section",
      },
      {
        name: "断面冲淤",
        src: import.meta.env.VITE_BASE + "/analyse/duanmianCY.png",
        value: "sectionFlush",
      },
      {
        name: "区域冲淤",
        src: import.meta.env.VITE_BASE + "/analyse/quyuCY.png",
        value: "regionFlush",
      },
      {
        name: "冲淤等深线",
        src: import.meta.env.VITE_BASE + "/analyse/chongyuDSX.png",
        value: "flushContour",
      },
      {
        name: "河道容积",
        src: import.meta.env.VITE_BASE + "/analyse/hedaoRJ.png",
        value: "volume",
      },
      // {
      //   name: "深泓线演变",
      //   src: "https://pic3.zhimg.com/v2-96d58dc7ea889b98102cbad4c53bb91e_720w.jpg?source=172ae18b",
      //   value: "horizon",
      // },
      // {
      //   name: "边界演变",
      //   src: "https://pic3.zhimg.com/v2-96d58dc7ea889b98102cbad4c53bb91e_720w.jpg?source=172ae18b",
      //   value: "boundary",
      // },
    ];

    const cardClick = (value) => {
      flag.value = false;
      analyseType.value = value;
    };

    const returnParameter = (val) => {
      context.emit("analyse", { type: analyseType.value, value: val });
    };

    const getDemList = () => {
      let baseData;
      if (
        props.dataList.length != 0 &&
        props.dataList[props.dataList.length - 1].id === ""
      ) {
        baseData = props.dataList.slice(0, -1);
      } else {
        baseData = props.dataList;
      }
      let demList = [];
      baseData.forEach((item) => {
        item.children.forEach((data) => {
          if (data.visualType === "rasterTile") {
            demList.push({
              dataListId: item.id,
              dataListName: item.label,
              fileId: data.id,
              fileName: data.label,
              visualType: "rasterTile",
            });
          }
        });
      });
      return demList;
    };

    onMounted(() => {
      console.log(props.dataList);
      if (
        props.dataList.length != 0 &&
        props.dataList[props.dataList.length - 1].id === ""
      ) {
        analyticDataList.value = props.dataList[props.dataList.length - 1].children;
      } else {
        analyticDataList.value = [];
      }
      demDataList.value = getDemList();
    });

    return {
      flag,
      list,
      cardClick,
      analyseType,
      analyticDataList,
      demDataList,
      returnParameter,
    };
  },
});
</script>

<style lang="scss" scoped>
@keyframes move {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.1);
  }
}
.analyse-dialog {
  background: #f0f0f0;
  padding: 20px;
  .card {
    position: relative;
    margin-bottom: 10px;
    &:hover {
      cursor: pointer;
      img {
        animation: move 0.3s linear forwards;
      }
    }
    .picture {
      width: 150px;
      height: 150px;
      overflow: hidden;
      border-radius: 8px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .text {
      text-align: center;
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
}
</style>

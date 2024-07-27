<template>
  <div>
    <el-page-header :icon="ArrowLeft" @back="backClick">
      <template #content>
        <span> {{ title }} </span>
      </template>
    </el-page-header>

    <div class="analyse">
      <div class="introduce">
        <strong v-if="analyseType === 'section'"
          >断面形态是指随着断面起点距的变化河道高程的变化趋势，选择相应的河道DEM与断面数据，计算该断面形态</strong
        >
        <strong v-if="analyseType === 'sectionFlush'"
          >断面冲於是通过当前年数据和参考年数据，对这个时间段内河道的冲刷和淤泥进行比较分析</strong
        >
        <strong v-if="analyseType === 'regionFlush'"
          >区域冲於是通过当前年数据和参考年数据，对这个时间段内河床区域的冲刷和淤泥进行比较分析</strong
        >
        <strong v-if="analyseType === 'flushContour'"
          >针对整个长江南京以下河段，选择参数生成冲淤等深线</strong
        >
        <strong v-if="analyseType === 'volume'"
          >选择河床参数与区域，设置最大深度计算河道容积</strong
        >
      </div>
      <div class="flushType" v-if="analyseType === 'regionFlush'">
        <div class="text">选择冲淤类型:</div>
        <el-radio-group v-model="flushType">
          <el-radio label="globalFlush">全江冲淤</el-radio>
          <el-radio label="regionFlush">区域冲淤</el-radio>
        </el-radio-group>
      </div>
      <el-select v-model="sectionValue" :placeholder="placeholder" v-if="selectFlag">
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <div class="deep" v-if="analyseType === 'volume'">
        <span><strong>水面距岸高度：</strong></span>
        <el-input-number
          v-model="deep"
          :min="1"
          :max="30"
          controls-position="right"
          :precision="1"
          :step="0.1"
        />
      </div>

      <div v-if="analyseType === 'section' || analyseType === 'volume'">
        <div class="text" v-if="analyseType === 'section' || analyseType === 'volume'">
          选择DEM数据，DEM将默认添加至数据与图层中
        </div>
        <el-skeleton :rows="5" animated v-if="skeletonFlag" />
        <div class="dem" v-else>
          <el-scrollbar>
            <el-tree :data="treeData" :props="defaultProps" default-expand-all>
              <template #default="{ data }">
                <div class="custom">
                  <div class="icon" v-if="data.flag">
                    <el-icon><FolderOpened /></el-icon>
                  </div>
                  <div class="text" v-if="data.flag">
                    <strong v-if="data.flag">{{ data.label }}</strong>
                  </div>
                  <el-checkbox
                    v-model="data.checkFlag"
                    size="large"
                    v-else
                    @change="changeClick(data)"
                    >{{ data.label }}</el-checkbox
                  >
                </div>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
      </div>

      <div
        v-if="
          analyseType === 'sectionFlush' ||
          analyseType === 'regionFlush' ||
          analyseType === 'flushContour'
        "
        class="section-flush"
      >
        <div class="left">
          <div class="text">选择基准面</div>
          <el-skeleton :rows="5" animated v-if="skeletonFlag" />
          <div class="dem" v-else>
            <el-scrollbar>
              <el-tree :data="benchmarkTreeData" :props="defaultProps" default-expand-all>
                <template #default="{ data }">
                  <div class="custom">
                    <div class="icon" v-if="data.flag">
                      <el-icon><FolderOpened /></el-icon>
                    </div>
                    <div class="text" v-if="data.flag">
                      <strong v-if="data.flag">{{ data.label }}</strong>
                    </div>
                    <el-checkbox
                      v-model="data.checkFlag"
                      size="large"
                      v-else
                      @change="changeClick(data, 'benchmark')"
                      >{{ data.label }}</el-checkbox
                    >
                  </div>
                </template>
              </el-tree>
            </el-scrollbar>
          </div>
        </div>
        <div class="right">
          <div class="text">选择参考面</div>
          <el-skeleton :rows="5" animated v-if="skeletonFlag" />
          <div class="dem" v-else>
            <el-scrollbar>
              <el-tree :data="referTreeData" :props="defaultProps" default-expand-all>
                <template #default="{ data }">
                  <div class="custom">
                    <div class="icon" v-if="data.flag">
                      <el-icon><FolderOpened /></el-icon>
                    </div>
                    <div class="text" v-if="data.flag">
                      <strong v-if="data.flag">{{ data.label }}</strong>
                    </div>
                    <el-checkbox
                      v-model="data.checkFlag"
                      size="large"
                      v-else
                      @change="changeClick(data, 'refer')"
                      >{{ data.label }}</el-checkbox
                    >
                  </div>
                </template>
              </el-tree>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div class="file-name">
        <div>输出文件名:</div>
        <el-input v-model="inputValue" />
      </div>
      <div class="btn">
        <el-button type="primary" plain @click="btnClick">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, nextTick, onMounted, ref } from "vue";
import { ArrowLeft } from "@element-plus/icons-vue";
import ModelRequest from "../../modelApi.js";
const { findParameterByType } = ModelRequest;
import utils from "@/utils/CommonUtils";
const { notice } = utils;
export default defineComponent({
  props: {
    analyseType: {
      type: String,
    },
    analyticDataList: {
      type: Object,
    },
  },
  emits: ["back", "returnParameter"],
  setup(props, context) {
    const defaultProps = {
      children: "children",
      label: "label",
    };
    const title = computed(() => {
      if (props.analyseType === "section") {
        return "断面形态";
      } else if (props.analyseType === "sectionFlush") {
        return "断面冲淤";
      } else if (props.analyseType === "regionFlush") {
        return "区域冲淤";
      } else if (props.analyseType === "flushContour") {
        return "冲淤等深线";
      } else if (props.analyseType === "volume") {
        return "河道容积计算";
      }
    });
    const placeholder = computed(() => {
      if (props.analyseType === "section" || props.analyseType === "sectionFlush") {
        return "选择断面";
      } else {
        return "选择区域";
      }
    });
    const selectFlag = computed(() => {
      if (props.analyseType === "flushContour") {
        return false;
      } else if (
        props.analyseType === "regionFlush" &&
        flushType.value === "globalFlush"
      ) {
        return false;
      } else {
        return true;
      }
    });
    const analyticDataList = computed(() => {
      return props.analyticDataList;
    });
    const treeData = ref([]);
    const benchmarkTreeData = ref([]);
    const referTreeData = ref([]);
    const skeletonFlag = ref(true);

    const sectionValue = ref("");
    const options = ref([]);
    const sectionDem = ref();
    const sectionDemList = ref([]);
    const benchmarkDem = ref();
    const referDem = ref();

    const deep = ref(5);

    const inputValue = ref("");

    const flushType = ref("globalFlush");

    const backClick = () => {
      context.emit("back");
    };

    const changeClick = (val, type) => {
      if (props.analyseType === "section" || props.analyseType === "volume") {
        treeData.value.forEach((item) => {
          item.children.forEach((c) => {
            if (c.id != val.id) {
              c.checkFlag = false;
            } else {
              if (c.checkFlag) {
                sectionDem.value = {
                  fileId: c.id,
                  fileName: c.label,
                  dataListId: item.id,
                  dataListName: item.label,
                  visualId: c.visualId,
                  visualType: c.visualType,
                };
              } else {
                sectionDem.value = undefined;
              }
            }
          });
        });
      } else if (
        props.analyseType === "sectionFlush" ||
        props.analyseType === "regionFlush" ||
        props.analyseType === "flushContour"
      ) {
        if (type === "benchmark") {
          benchmarkTreeData.value.forEach((item) => {
            item.children.forEach((c) => {
              if (c.id != val.id) {
                c.checkFlag = false;
              } else {
                if (c.checkFlag) {
                  benchmarkDem.value = {
                    fileId: c.id,
                    fileName: c.label,
                    dataListId: item.id,
                    dataListName: item.label,
                    visualId: c.visualId,
                    visualType: c.visualType,
                  };
                } else {
                  benchmarkDem.value = undefined;
                }
              }
            });
          });
        } else if (type === "refer") {
          referTreeData.value.forEach((item) => {
            item.children.forEach((c) => {
              if (c.id != val.id) {
                c.checkFlag = false;
              } else {
                if (c.checkFlag) {
                  referDem.value = {
                    fileId: c.id,
                    fileName: c.label,
                    dataListId: item.id,
                    dataListName: item.label,
                    visualId: c.visualId,
                    visualType: c.visualType,
                  };
                } else {
                  referDem.value = undefined;
                }
              }
            });
          });
        }
      }
    };

    const btnClick = () => {
      if (props.analyseType === "section") {
        if (
          1
          // TODO: 输入非空判断
          // sectionValue.value != "" &&
          // sectionDem.value != undefined &&
          // inputValue.value != ""
        ) {
          context.emit("returnParameter", {
            section: sectionValue.value,
            dem: sectionDem.value,
            fileName: inputValue.value,
          });
        } else {
          let target = "";
          if (sectionValue.value === "") {
            target = "断面";
          } else if (sectionDem.value === undefined) {
            target = "DEM";
          } else {
            target = "输出文件名";
          }
          notice("warning", "警告", target + "不得为空");
        }
      } else if (props.analyseType === "volume") {
        if (
          1
          // sectionValue.value != "" &&
          // sectionDem.value != undefined &&
          // inputValue.value != ""
        ) {
          context.emit("returnParameter", {
            region: sectionValue.value,
            dem: sectionDem.value,
            deep: deep.value,
            fileName: inputValue.value,
          });
        } else {
          let target = "";
          if (sectionValue.value == "") {
            target = "区域不得为空";
          } else if (sectionDem.value == undefined) {
            target = "DEM不得为空";
          } else {
            target = "输入文件名不得为空";
          }
          notice("warning", "警告", target);
        }
      } else if (
        props.analyseType === "sectionFlush" ||
        props.analyseType === "regionFlush"
      ) {
        if (
          1
          // sectionValue.value != "" &&
          // benchmarkDem.value != undefined &&
          // referDem.value != undefined &&
          // inputValue.value != ""
        ) {
          //TODO:
          // if (referDem.value.fileId === benchmarkDem.value.fileId) {
          //   notice("warning", "警告", "基准DEM数据不能与参考DEM数据相同");
          // } else {
          //   context.emit("returnParameter", {
          //     section: sectionValue.value,
          //     benchmarkDem: benchmarkDem.value,
          //     referDem: referDem.value,
          //     fileName: inputValue.value,
          //   });
          // }
          context.emit("returnParameter", {
            section: sectionValue.value,
            benchmarkDem: benchmarkDem.value,
            referDem: referDem.value,
            fileName: inputValue.value,
          });
        } else if (sectionValue.value === "") {
          if (props.analyseType === "sectionFlush") {
            notice("warning", "警告", "请选择断面");
          } else if (props.analyseType === "regionFlush") {
            notice("warning", "警告", "请选择区域");
          }
        } else if (inputValue.value == "") {
          notice("warning", "警告", "输出文件名不得为空");
        } else if (benchmarkDem.value === undefined) {
          notice("warning", "警告", "基准DEM数据不得为空");
        } else {
          notice("warning", "警告", "参考DEM数据不得为空");
        }
      } else if (props.analyseType === "flushContour") {
        if (
          1
          // benchmarkDem.value != undefined &&
          // referDem.value != undefined &&
          // inputValue.value != ""
        ) {
          // if (referDem.value.fileId === benchmarkDem.value.fileId) {
          //   notice("warning", "警告", "基准DEM数据不能与参考DEM数据相同");
          // } else {
          //   context.emit("returnParameter", {
          //     benchmarkDem: benchmarkDem.value,
          //     referDem: referDem.value,
          //     fileName: inputValue.value,
          //   });
          // }
          context.emit("returnParameter", {
            benchmarkDem: benchmarkDem.value,
            referDem: referDem.value,
            fileName: inputValue.value,
          });
        } else {
          let target = "";
          if (benchmarkDem.value === undefined) {
            target = "基准DEM数据不得为空";
          } else if (referDem.value === undefined) {
            target = "参考DEM数据不得为空";
          } else {
            target = "输出文件名不得为空";
          }
          notice("warning", "警告", target);
        }
      }
    };

    const getParame = async (type) => {
      const data = await findParameterByType("dem");
      if (data != null && data.code === 0) {
        for (let i = 0; i < data.data.length; i++) {
          let flag = true;
          for (let j = 0; j < treeData.value.length; j++) {
            if (treeData.value[j].id === data.data[i].dataListId) {
              treeData.value[j].children.push({
                id: data.data[i].fileId,
                label: data.data[i].fileName,
                flag: false,
                children: [],
                checkFlag: false,
                visualId: data.data[i].visualId,
                visualType: data.data[i].visualType,
                parentId: data.data[i].dataListId,
                parentName: data.data[i].dataListName,
              });
              flag = false;
              break;
            }
          }
          if (flag) {
            treeData.value.push({
              id: data.data[i].dataListId,
              label: data.data[i].dataListName,
              flag: true,
              children: [],
            });
            treeData.value[treeData.value.length - 1].children.push({
              id: data.data[i].fileId,
              label: data.data[i].fileName,
              flag: false,
              checkFlag: false,
              children: [],
              visualId: data.data[i].visualId,
              visualType: data.data[i].visualType,
              parentId: data.data[i].dataListId,
              parentName: data.data[i].dataListName,
            });
          }
        }
        if (
          type === "sectionFlush" ||
          type === "regionFlush" ||
          type === "flushContour"
        ) {
          benchmarkTreeData.value = JSON.parse(JSON.stringify(treeData.value));
          referTreeData.value = JSON.parse(JSON.stringify(treeData.value));
        }
        if (type === "section" || type === "sectionFlush") {
          options.value = [];
          analyticDataList.value.forEach((item) => {
            if (item.visualType === "geoJsonLine") {
              options.value.push({
                id: item.id,
                name: item.fileName,
              });
            }
          });
        } else {
          options.value = [];
          analyticDataList.value.forEach((item) => {
            if (item.visualType === "geoJsonPolygon") {
              options.value.push({
                id: item.id,
                name: item.fileName,
              });
            }
          });
        }
      }
    };

    onMounted(async () => {
      skeletonFlag.value = true;
      // TODO: 获取输入参数
      // await getParame(props.analyseType);
      skeletonFlag.value = false;
    });

    return {
      ArrowLeft,
      title,
      analyticDataList,
      backClick,
      sectionValue,
      options,
      treeData,
      benchmarkTreeData,
      referTreeData,
      defaultProps,
      changeClick,
      btnClick,
      skeletonFlag,
      placeholder,
      selectFlag,
      deep,
      inputValue,
      flushType,
    };
  },
});
</script>

<style lang="scss" scoped>
.introduce {
  margin-top: 30px;
  margin-left: 5px;
  margin-bottom: 30px;
}
.analyse {
  .el-select {
    width: 100%;
  }
  .deep {
    margin: 10px 0;
  }
  .text {
    height: 20px;
    line-height: 20px;
    margin: 5px 0;
  }
  .flushType {
    margin-top: 10px;
  }
  .dem {
    border: solid #dcdfe6 1px;
    height: 200px;
    border-radius: 4px;
    cursor: pointer;
    .custom {
      display: flex;
      .icon {
        width: 15px;
        margin-top: 6px;
        margin-right: 5px;
      }
    }
    .el-tree {
      :deep() .el-tree-node__content {
        height: 40px;
      }
    }
  }
  .section-flush {
    display: flex;
    .left,
    .right {
      width: 50%;
    }
    .left {
      margin-right: 10px;
    }
  }
  .file-name {
    margin-top: 10px;
  }
  .btn {
    text-align: center;
    margin-top: 10px;
  }
}
</style>

<template>
  <div class="layer-manage">
    <div class="layer-panel">
      <div class="title">
        <div class="title-icon lpicon"></div>
        <div class="title-text">图层面板</div>
      </div>
      <div class="lp-content">
        <div class="scroll">
          <el-scrollbar>
            <div>
              <el-tree
                :data="treeData"
                :props="defaultProps"
                draggable
                :allow-drop="allowDrop"
                @node-drop="dragHandle"
              >
                <template #default="{ data }">
                  <div class="custom" style="width: 100%">
                    <el-checkbox
                      v-model="data.flag"
                      size="large"
                      @change="changeClick(data)"
                      >{{ data.label }}</el-checkbox
                    >
                    <div class="close" @click="closeClick(data.id)">
                      <el-icon><CircleClose /></el-icon>
                    </div>
                  </div>
                </template>
              </el-tree>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { Search, Delete } from "@element-plus/icons-vue";
import ModelRequest from "../../modelApi.js";
const { updateLayer } = ModelRequest;
import router from "@/router";
import utils from "@/utils/CommonUtils";
const { notice } = utils;
//import type { DragEvents } from "element-plus/es/components/tree/src/model/useDragNode";

export default defineComponent({
  props: {
    layerList: {
      type: Array,
    },
  },
  emits: ["closeLayer", "hideLayer", "moveLayer"],
  setup(props, context) {
    const defaultProps = {
      children: "children",
      label: "label",
    };
    const serach = ref("");
    // {
    //     id: string;
    //     flag: boolean;
    //     label: string;
    //     children: Tree[];
    //     visualType?: string;
    //     visualId?: string;
    // }[]
    const treeData = ref([]);

    // val: {
    //   id: string;
    //   name: string;
    //   visualType: string;
    //   visualId: string;
    // }
    const addLayer = async (val) => {
      for (let i = 0; i < treeData.value.length; i++) {
        if (treeData.value[i].id === val.id) {
          return;
        }
      }
      treeData.value.unshift({
        id: val.id,
        label: val.name,
        visualType: val.visualType,
        children: [],
        flag: true,
        visualId: val.visualId,
      });
      const list = [];
      treeData.value.forEach((item) => {
        list.push(item.id);
      });
      console.log(treeData.value);
      const data = await updateLayer(import.meta.env.VITE_APP_ROUTER_ID, list);
    };

    const closeClick = async (id) => {
      for (let i = 0; i < treeData.value.length; i++) {
        if (treeData.value[i].id === id) {
          treeData.value.splice(i, 1);
          const list = [];
          treeData.value.forEach((item) => {
            list.push(item.id);
          });
          const data = await updateLayer(import.meta.env.VITE_APP_ROUTER_ID, list);
          if (data != null && data.code === 0) {
            notice("success", "成功", "已移除图层");
          }
          context.emit("closeLayer", id);
          return;
        }
      }
    };

    const delLayer = async (param) => {
      for (let i = 0; i < treeData.value.length; i++) {
        if (treeData.value[i].id === param) {
          treeData.value.splice(i, 1);
          const list = [];
          treeData.value.forEach((item) => {
            list.push(item.id);
          });
          await updateLayer(import.meta.env.VITE_APP_ROUTER_ID, list);
          return;
        }
      }
    };

    // Tree
    const changeClick = (val) => {
      context.emit("hideLayer", { flag: val.flag, id: val.id });
    };

    const allowDrop = (draggingNode, dropNode, type) => {
      if (draggingNode.level === dropNode.level) {
        if (draggingNode.parent.id === dropNode.parent.id) {
          // 向上拖拽 || 向下拖拽
          return type === "prev" || type === "next";
        }
      } else {
        // 不同级进行处理
        return false;
      }
    };

    const dragHandle = async (node, dropNode, dropType, ev) => {
      let target = "";
      console.log(dropType);
      if (dropType === "before") {
        for (let i = 0; i < treeData.value.length; i++) {
          if (treeData.value[i].id === node.data.id) {
            if (i != 0) {
              target = treeData.value[i + 1].id;
            }
            break;
          }
        }
      } else {
        target = dropNode.data.id;
      }
      context.emit("moveLayer", {
        drop: node.data.id,
        target: target,
      });
      const list = [];
      treeData.value.forEach((item) => {
        list.push(item.id);
      });
      await updateLayer(import.meta.env.VITE_APP_ROUTER_ID, list);
    };

    const getLayers = () => {
      return treeData.value.length;
    };

    onMounted(() => {
      console.log(props.layerList)
      props.layerList?.forEach((item) => {
        treeData.value.push({
          id: item.id,
          label: item.fileName,
          visualType: item.visualType,
          flag: true,
          children: [],
          visualId: item.visualId,
        });
      });
    });

    return {
      Search,
      serach,
      treeData,
      defaultProps,
      addLayer,
      Delete,
      closeClick,
      changeClick,
      delLayer,
      dragHandle,
      allowDrop,
      getLayers,
    };
  },
});
</script>

<style lang="scss" scoped>
.layer-manage {
  
  .custom {
    position: relative;
    width: 100%;
    .el-checkbox {
      width: 100%;
      :deep() .el-checkbox__label {
        width: calc(100% - 60px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #36e3db;
        line-height: 5vh;
      }
    }

    .close {
      position: absolute;
      right: 10px;
      top: 13px;
    }
  }
}
</style>

<template>
    <div class="SoilAnalysis-container">
        <ModelTitleVue
          :ModelName="ModelName"
        />
        <div class="model-content-container">
            <ModelInfoVue/>
            <div class="model-data-container">
                <div class="model-data-wrapper">
                    <div class="model-data-item">
                        <div class="data-table-title">
                            土体变形分析可视化结果
                        </div>
                        <div class="data-table-body">
                            <el-table :data="tableData" stripe style="width: 100%">
                                <el-table-column prop="id" label="岸段" width="'20%''" />
                                <el-table-column prop="para1" label="参数1" width="'20%'" />
                                <el-table-column prop="para2" label="参数2" width="'20%'" />
                                <el-table-column prop="para3" label="参数3" width="'20%'" />
                                <el-table-column prop="time" label="计算时间" width="'20%'"/>
                            </el-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { useRouter } from 'vue-router'
import ModelInfoVue from '../ModelInfo.vue'
import ModelTitleVue from '../ModelTitle.vue';

const ModelName = "土体变形分析模型"

const router = useRouter()
const returnMain = () => {
    router.push('/modelStore')
}

const tableData = [
  {
    id: '001',
    para1: '1',
    para2: '2',
    para3: '3',
    time: '2016-05-02'
  },
  {
    id: '002',
    para1: '1',
    para2: '2',
    para3: '3',
    time: '2016-05-02'
  },
  {
    id: '003',
    para1: '1',
    para2: '2',
    para3: '3',
    time: '2016-05-02'
  },
  {
    id: '004',
    para1: '1',
    para2: '2',
    para3: '3',
    time: '2016-05-02'
  },
  {
    id: '004',
    para1: '1',
    para2: '2',
    para3: '3',
    time: '2016-05-02'
  },
  {
    id: '004',
    para1: '1',
    para2: '2',
    para3: '3',
    time: '2016-05-02'
  },
  {
    id: '004',
    para1: '1',
    para2: '2',
    para3: '3',
    time: '2016-05-02'
  },
  {
    id: '004',
    para1: '1',
    para2: '2',
    para3: '3',
    time: '2016-05-02'
  },
  {
    id: '004',
    para1: '1',
    para2: '2',
    para3: '3',
    time: '2016-05-02'
  },
  {
    id: '004',
    para1: '1',
    para2: '2',
    para3: '3',
    time: '2016-05-02'
  },
  {
    id: '004',
    para1: '1',
    para2: '2',
    para3: '3',
    time: '2016-05-02'
  },
  {
    id: '004',
    para1: '1',
    para2: '2',
    para3: '3',
    time: '2016-05-02'
  },
]

</script>
  
<style lang="scss" scoped>

@keyframes slideBackgroundColor {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}

div.SoilAnalysis-container {
    width:100%;
    height: 92vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: linear-gradient(to bottom right, #477ab1, #2aa9c9, #7a7cad);
    background-size: 200% 200%;
    animation: slideBackgroundColor 4s ease infinite;

    div.model-content-container {
        width:100%;
        height: 87vh;
        overflow: hidden;
        display: flex;
        flex-direction: row;

        div.model-data-container {
            display: flex;
            width: 60vw;
            height: 86vh;
            justify-content: center;
            align-items: center;
            // background-color: rgb(160, 38, 150);

            div.model-data-wrapper {
                // position: relative;
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                // flex-direction: col;
                width: 99%;
                height: 98%;
                border: 3px solid #ccc;
                border-radius: 10px;
                // background-color: rgb(192, 185, 165);

                div.model-data-item {
                    display: flex;
                    flex-direction: column;
                    // align-items: center;
                    width: 97%;
                    height: 100%;
                    // background-color: aquamarine;

                    div.data-table-title {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 6%;
                        font-size: calc(1vh + 0.8vw);
                        font-weight: 600;
                        font-family: 'Microsoft YaHei'; 
                        color:rgb(238, 145, 69); 
                        text-shadow: #b2b863 1px 1px;
                    }

                    div.data-table-body {
                        display: flex;
                        text-align: center;
                        justify-content: center;
                        width: 100%;
                        height: 90%;

                        .el-table {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }
    }  
}

:deep(.el-table) {
    overflow-y: auto;
    background-color: rgba(241, 241, 223, 0.9)
}
// 设置表头
:deep(.el-table thead th.el-table__cell) {
    color: #010613;
    background: rgba(224, 188, 24, 0.897);
    font-size: calc(0.7vw + 0.4vh);
    height: 3vh;
    border-right: inset 2px #a5b611;
    border-left: inset 2px #a5b611;
    border-bottom: inset 4px #ff9305;
    text-shadow: #e2dca3 1px 1px;
    div.cell {
        text-align: center;
        height: 3vh;
        line-height: 3vh;
    }
    &:last-child {
        width: 2vw;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }
    &:first-child {
        width: 2vw;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }
}
// 设置表身
:deep(.el-table tbody tr:nth-child(2n)) {
    line-height: 30px;
    color: hsl(225, 15%, 5%);
    background: rgb(231, 222, 168);
    font-weight: 600;
}
:deep(.el-table tbody tr:nth-child(2n+1)) {
    line-height: 30px;
    color: hsl(225, 15%, 5%);
    background: rgb(241, 241, 223);
    font-weight: 600;
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: #05a3ff;
}
::-webkit-scrollbar-track{
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  background: hsl(224, 79%, 33%);
}

</style>
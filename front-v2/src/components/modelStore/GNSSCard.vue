<template>
    <div class="machine-card-container">
        <div class="exchange-container">
            <div class="exchange-icon">
                <img
                    src="/icons/switch.png"
                    alt="exchange"
                    @click="changePage()"
                >
            </div>
        </div>
        <div 
            class="machine-card"
            :class="[gnss.firstPage ? 'active' : 'inactive']"
        >
            <div class="machine-show-container">
                <img src="/gnssBase.png" alt="设备图片">
                <div class="machine-name-container">
                    <div class="machine-name-text">设备名称: GNSS</div>
                </div>
            </div>
            <div class="machine-info-container">
                <div class="machine-text-container">
                    <div class="machine-text-content">
                        这里是解算算法的内容#这里是解算算法的内容#这里是解算算法的内容
                        #这里是解算算法的内容#这里是解算算法的内容#这里是解算算法的内容
                    </div>
                </div>
            </div>
        </div>
        <div 
            class="machine-card second"
            :class="[gnss.firstPage ? 'inactive' : 'active']"
        >
            <div class="machine-table-container">
                <div class="table-text-container">
                    <div class="table-text">
                        GNSS数据解译可视化结果
                    </div>
                </div>
                <div class="table-body-container">
                    <el-table 
                        :data="tableData"
                        stripe
                        style="width: 100%"
                        v-loading="loading"
                        element-loading-text="数据加载中"
                        element-loading-background="rgba(244, 252, 239, 0.6)"
                    >
                        <el-table-column prop="id" label="设备ID" width="'20%''" />
                        <el-table-column prop="x_move" label="x位移" width="'20%'" />
                        <el-table-column prop="y_move" label="y位移" width="'20%'" />
                        <el-table-column prop="z_move" label="z位移" width="'20%'" />
                        <el-table-column prop="time" label="测量时间" width="'20%'"/>
                    </el-table>
                </div>
            </div>
            <div class="machine-data-container">
                <div class="device-number-content">
                    <div class="device-number-data">
                        已有设备数量:&nbsp;<span class="color-data">{{ deviceNum }}</span></div>
                </div>
                <div class="record-number-content">
                    <div class="record-number-data">
                        算法运行次数:&nbsp;<span class="color-data">{{ CalculateTime }}</span></div>
                </div>
                <div class="time-number-content">
                    <div class="time-number-data">
                        上次运行时间:<br><span class="color-data">{{ latestTime }}</span></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import DeviceRequest from './api.js';
import { ref, onMounted } from 'vue'

const tableData = ref([]);
const deviceNum = ref(0);
const CalculateTime = ref(0);
const latestTime = ref("");
const loading = ref(true)

const props = defineProps({
    gnss: {
        type: Object,
    }
})
const gnss = ref(props.gnss)

const changePage = () => {
    gnss.value.firstPage = !gnss.value.firstPage
}

onMounted(
    async () => {
        const gnssData = (await DeviceRequest.getGNSSAllData()).data.data;
        deviceNum.value = ( await DeviceRequest.getGNSSMachineNum()).data.data;
        CalculateTime.value = ( await DeviceRequest.getGNSSRecordNum()).data.data;
        latestTime.value = ( await DeviceRequest.getGNSSRecordLatestTime()).data.data;
        gnssData.forEach(item => {
            tableData.value.push({
                id: item.idGroup.machine_id,
                x_move: item.x_move,
                y_move: item.y_move,
                z_move: item.z_move,
                time: item.in_time
            })
        })
        loading.value = false
    }
);

</script>

<style lang="scss" scoped>
div.machine-card-container {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    // background-color: aqua;

    div.exchange-container {
        position: absolute;
        display: flex;
        width:4%;
        height:6%;
        top: 8px;
        right: 70px;
        // background-color: #ccc;

        div.exchange-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%px;
            height: 100%px;
            z-index: 10;
            
            img {
                widows: 100%;
                height: 100%;
                object-fit:contain;
                display: inline-block;
                animation: floating 2s ease-in-out infinite;
            }
        }
            
    }

    div.machine-card {
        width: 90%;
        height: 90%;
        display: flex;
        flex-direction: row;
        border: 2px solid #ccc;
        border-radius: 10px;
        transition: transform 0.3s ease;
        &:hover {
            transform: scale(1.02);
            background-color: rgba(255, 255, 255, 0.1);
            // transform: translate(0.1vw, -1vh) rotate(0.5deg);
        }

        &.active {
            opacity: 1;
            z-index: 2;

        }

        &.inactive {
            position: absolute;
            opacity: 0.02;
            top: 0;
            // right: 15px;
            z-index: 1;
            cursor: pointer;
            pointer-events: none;

        }

        &.second {
            flex-direction: column;
        }

        div.machine-show-container {
            display: flex;
            flex-direction: column;
            justify-content: center; 
            align-items: center;
            width: 40%;
            height: 100%;
            padding-top: 10px;
            // background-color: aqua;

            img {
                width: 100%;
                height: 60%;
                margin-bottom: 10px;
            }

            div.machine-name-container {
                display: flex;
                justify-content: center; 
                align-items: center;
                width: 70%;
                height: 15%;
                margin-top: 10px;
                background-color: rgb(63, 146, 201);
                border: 2px solid black;
                border-radius: 5px;
                
                // background-color: aqua;
                div.machine-name-text {
                    font-size: calc(0.6vh + 0.7vw);
                    font-weight: 600;
                    font-family: 'Microsoft YaHei'; 
                    color:beige;
                }
            }
        }

        div.machine-info-container {
            display: flex;
            justify-content: center; 
            align-items: center;
            flex-direction: column;
            width: 60%;
            height: 100%;

            div.machine-text-container {
                display: flex;
                justify-content: center; 
                align-items: center;
                width: 80%;
                height: 80%;
                // background-color: aqua;

                div.machine-text-content {
                    font-size: calc(0.5vh + 0.7vw);
                    font-weight: 400;
                    font-family: 'Microsoft YaHei'; 
                    color: azure;
                }
            }

        }

        div.machine-table-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 95%;
            height: 85%;
            margin: 0 auto;
            // background-color: aqua;

            div.table-text-container {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 13%;
                border-bottom: 2px solid rgb(98, 40, 206); 

                div.table-text {
                    font-size: calc(0.7vh + 0.7vw);
                    font-weight: 600;
                    font-family: 'Microsoft YaHei'; 
                    color:rgb(98, 40, 206); 
                    text-shadow: #d7e1e7 0.5px 0.5px;
                }
            }

            div.table-body-container {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 87%;

                .el-table {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        div.machine-data-container {
            display: flex;
            flex-direction: row;
            justify-content: center; 
            align-items: center;
            width: 100%;
            height: 15%;
            // background-color: aqua;

            div.device-number-content{
                display: flex;
                height: 100%;
                width: 30%;
                // background-color: aqua;

                div.device-number-data {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: calc(0.5vh + 0.7vw);
                    font-weight: 600;
                    font-family: 'Microsoft YaHei'; 
                    // color: azure;

                    span.color-data {
                        color:rgb(207, 44, 44);
                    }
                }
            }

            div.record-number-content{
                display: flex;
                height: 100%;
                width: 30%;

                div.record-number-data {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: calc(0.5vh + 0.7vw);
                    font-weight: 600;
                    font-family: 'Microsoft YaHei'; 
                    // color: azure;

                    span.color-data {
                        color:rgb(207, 44, 44);
                    }
                }
            }

            div.time-number-content{
                display: flex;
                height: 100%;
                width: 40%;

                div.time-number-data {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: calc(0.5vh + 0.7vw);
                    font-weight: 600;
                    font-family: 'Microsoft YaHei'; 
                    // color: azure;

                    span.color-data {
                        color:rgb(207, 44, 44);
                    }
                }
            }
        }
    }
}


:deep(.el-table) {
    overflow-y: auto;
}
// 设置表头
:deep(.el-table thead th.el-table__cell) {
    color: #f8faff;
    background: rgba(51, 39, 212, 0.897);
    font-size: calc(0.7vw + 0.4vh);
    height: 3vh;
    border-right: inset 2px #157acc;
    border-bottom: inset 4px #05a3ff;
    text-shadow: #4bb0f3 1px 1px;
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
    color: hsl(224, 79%, 33%);
    background: rgb(235, 242, 255);
    font-weight: 600;
}
:deep(.el-table tbody tr:nth-child(2n+1)) {
    color: hsl(224, 79%, 33%);
    background: rgb(119, 141, 182);
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

// 图标浮动
@keyframes floating {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

</style>

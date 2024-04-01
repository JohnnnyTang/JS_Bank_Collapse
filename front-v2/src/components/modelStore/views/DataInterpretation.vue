<template>
    <div class="dataInterpretation-container">
        <ModelTitleVue
            :ModelName="ModelName"
        />
        <div class="model-content-container">
            <ModelInfoVue/>
            <div class="model-data-container">
                <div class="model-data-wrapper">
                    <div class="model-data-item">
                        <div class="data-item-title">
                            GNSS表面三位位移量实时差分解算算法
                        </div>
                        <div class="data-item-content">
                            <GNSSCardVue
                                :gnss="gnss"
                            />
                        </div>
                    </div>
                    <div class="model-data-item">
                        <div class="data-item-title">
                            固定式测斜仪位移测量解算算法
                        </div>
                        <div class="data-item-content">
                            <incliCardVue
                                :incli="incli"
                            />
                        </div>
                    </div>
                    <div class="model-data-item">
                        <div class="data-item-title">
                            孔隙水压力计渗透压解算算法
                        </div>
                        <div class="data-item-content">
                            <watpreCardVue
                                :watpre="watpre"
                            />
                        </div>
                    </div>
                    <div class="model-data-item">
                        <div class="data-item-title">
                            应力桩应变量解算算法
                        </div>
                        <div class="data-item-content">
                            <StrepileCardVue
                                :strepile="strepile"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import GNSSCardVue from '../GNSSCard.vue';
import incliCardVue from '../IncliCard.vue';
import watpreCardVue from '../WatpreCard.vue';
import StrepileCardVue from '../StrepileCard.vue';
import ModelInfoVue from '../ModelInfo.vue'
import ModelTitleVue from '../ModelTitle.vue';

const ModelName = '数据融合解译模型'

const gnss = {
    firstPage: false,
}
const incli = {
    firstPage: false,
}
const watpre = {
    firstPage: false,
}
const strepile = {
    firstPage: false,
}
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

div.dataInterpretation-container {
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
            width: 70vw;
            height: 86vh;
            padding-left: 20px;
            justify-content: center;
            align-items: center;
            // background-color: rgb(160, 38, 150);

            div.model-data-wrapper {
                // position: relative;
                display: flex;
                flex-wrap: wrap;
                // flex-direction: col;
                width: 99%;
                height: 98%;
                // background-color: rgb(192, 185, 165);

                div.model-data-item {
                    width: 50%;
                    height: 50%;
                    // background-color: aquamarine;

                    div.data-item-title {
                        width: 100%;
                        height: 10%;
                        font-size: calc(0.5vh + 1vw);
                        font-weight: 600;
                        font-family: 'Microsoft YaHei';
                        color:beige;
                        text-shadow: #4bb0f3 1px 1px;
                    }

                    div.data-item-content {
                        width: 100%;
                        height: 90%;
                    }
                }
            }
        }
    }
        
}

</style>
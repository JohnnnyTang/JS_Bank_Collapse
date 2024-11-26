<template>
    <div class="container">
        <!-- <GlobalGraph></GlobalGraph> -->

        <div class="navs">
            <NavCard v-for="(item, index) in navInfo" :navInfo="item" :key="index"></NavCard>
        </div>

        <bottomWaveVue></bottomWaveVue>
    </div>
</template>

<script setup>
// import GlobalGraph from '../components/knowStore/globalGraph/GlobalGraph.vue'
import NavCard from '../globalGraph/NavCard.vue';
import bottomWaveVue from '../BottomWave.vue';


const navInfo = [
    {
        name: '历史场景与规划',
        description: '包括各河段典型历史崩岸发生时间、位置、范围等知识资料,以及长江流域综合规划、防洪规划、堤防能力提升规划等资料。',
        img: '/knowledge/BK0.png',
        path:'/knowledgeStore/historyAndPlan',
        type: 'two',
        unitInfo: [{
            name: '历史崩岸资料',
            value: 7
        }, {
            name: '相关规划文件',
            value: 9
        }]
    },
    {
        name: '模型参数库',
        description: '包括长江江苏段崩岸预警指标库、权重系数、预警指标的崩岸风险概率阈值等模型参数资料',
        img: '/knowledge/model.png',
        path:'/knowledgeStore/param',
        type: 'one',
        unitInfo: [{
            name: '资料条目',
            value: 2
        }]
    },
    {
        name: '专家经验库',
        description: '包括防御预案、抢险经验等专家知识和经验资料，为崩岸预警预警决策提供专业意见和建议',
        img: '/knowledge/typing.jpg',
        path: '/knowledgeStore/experience',
        type: 'two',
        unitInfo: [{
            name: '防御预案资料',
            value: 9
        }, {
            name: '抢险经验资料',
            value: 3
        }]
    }

]


</script>

<style lang="scss" scoped>
.container {
    position: absolute;
    top: 8vh;
    left: 0vw;
    width: 100vw;
    height: 92vh;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: rgb(29, 97, 157);
    overflow: auto;


    .navs { 
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100vw;
        margin-top: 10vh;
        // background-color: red;
        z-index: 2;
    }

}
</style>
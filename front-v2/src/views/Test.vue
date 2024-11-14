<template>
    <div class="container" @click="download">
        <!-- <GlobalGraph></GlobalGraph> -->

        <div class="navs">
            <NavCard v-for="(item, index) in navInfo" :navInfo="item" :key="index"></NavCard>
        </div>
        <!--
        <bottomWaveVue></bottomWaveVue> -->
        <!-- <FileView></FileView> -->
        <!-- <FileUpload v-model:uploadShow="uploadShow"></FileUpload> -->
        <!-- <el-tree :data="treeStructure" :props="defaultProps">

        </el-tree> -->
    </div>
</template>

<script setup>
import GlobalGraph from '../components/knowStore/globalGraph/GlobalGraph.vue'
import FileView from '../components/knowStore/globalGraph/FileView.vue';
import FileUpload from '../components/knowStore/globalGraph/FileUpload.vue';
import axios from 'axios'
import NavCard from '../components/knowStore/globalGraph/NavCard.vue';
// import { ref } from 'vue'

// const uploadShow = ref(true)
// window.addEventListener('keydown', e => {
//     if (e.key === '1') {
//         uploadShow.value = true
//     }
//     if (e.key === '2') {
//         uploadShow.value = false
//     }
//     if (e.key === '3')
//         console.log(uploadShow.value)
// })

const navInfo = [
    {
        name: '崩岸知识网络',
        description: '包括各河段典型历史崩岸发生时间、位置、范围等知识资料,以及长江流域综合规划、防洪规划、堤防能力提升规划等资料。',
        img: '/knowledge/BK0.png',
        path: '/knowledgeStore/graph',
        type: 'three',
        unitInfo: [{
            name: '文本',
            value: 23
        }, {
            name: '图片',
            value: 1
        }, {
            name: '视频',
            value: 1
        }]
    },
    {
        name: '历史崩岸列表',
        description: '包括长江江苏段崩岸预警指标库、权重系数、预警指标的崩岸风险概率阈值等模型参数资料',
        img: '/knowledge/model.png',
        path: '/knowledgeStore/history',
        type: 'one',
        unitInfo: [{
            name: '历史记录',
            value: 324
        }]
    },
    {
        name: '相关规划图集',
        description: '包括防御预案、抢险经验等专家知识和经验资料，为崩岸预警预警决策提供专业意见和建议',
        img: '/knowledge/typing.jpg',
        path: '/knowledgeStore/plan',
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

    display: flex;
    justify-content: center;
    align-items: center;

    .navs {
        display: flex;
        flex-direction: row;
    }

}
</style>
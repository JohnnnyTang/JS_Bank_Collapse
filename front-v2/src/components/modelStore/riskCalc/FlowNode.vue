<script setup>
import { computed, toRef } from 'vue'
import { Handle, useHandleConnections } from '@vue-flow/core'

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})

const nodeContent = computed(() => {
    if(props.data.name == "评估断面选择") {
        if(props.data.status==0) {
            return '正在选择'
        }
        else if(props.data.status==1) {
            return '已选择'
        }
        else if(props.data.status==2) {
            return '已计算剖面'
        }
    }
    else if(props.data.name == '动力指标计算') {
        if(props.data.status==-1) {
            return '请先选择断面'
        }
        else if(props.data.status==0) {
            return '配置中'
        }
        else if(props.data.status==1) {
            return '正在计算'
        }
        else if(props.data.status==2) {
            return props.data.result
        }
    }
    else if(props.data.name == '演变分析指标计算') {
        if(props.data.status==-1) {
            return '请先选择断面'
        }
        else if(props.data.status==0) {
            return '配置中'
        }
        else if(props.data.status==1) {
            return '正在计算'
        }
        else if(props.data.status==2) {
            return props.data.result
        }
    }
    else {
        if(props.data.status==-2) {
            return '请完成前置步骤'
        }
        else if(props.data.status==-1) {
            return '请完成指标计算'
        }
        else if(props.data.status==0) {
            return '配置中'
        }
        else if(props.data.status==1) {
            return '正在计算'
        }
        else if(props.data.status==2) {
            return props.data.result
        }
    }
    
})

console.log(props.data)
</script>

<template>
    <div class="process-node" :status-id="props.data.status">
        <div class="node-title">{{ props.data.name }}</div>
        <div class="node-content" :status-id="props.data.status">{{ nodeContent }}</div>
        <div class="node-status" :status-id="props.data.status"></div>
    </div>
</template>

<style scoped lang="scss">
$rotate-border-width: 3px;
$rotate-border-length: 12px;
$rotate-border-color: #23c100;

.process-node {
    border-radius: 12px;
    width: 8rem;
    height: 6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: row wrap;
    overflow: hidden;

    background-color: aqua;

    text-align: center;
    line-height: 3rem;
    font-size: 0.8rem;
    font-weight: bold;

    &:hover {
        cursor: pointer;
    }

    div.node-title {
        height: 2.4rem;
        line-height: 2.4rem;
        width: 8rem;
        background-color: rgb(36, 60, 220);
        color: aliceblue;
    }

    div.node-content {
        height: 3rem;
        width: 8rem;
        background-color: rgb(198, 255, 196);

        &[status-id='2'] {
            font-size: 0.6rem;
        }
    }

    div.node-status {
        height: 0.6rem;
        width: 8rem;

        &[status-id='0'] {
            background-color: rgb(78, 97, 223);
        }

        &[status-id='1'] {
            background-color: rgb(103, 169, 220);
        }
        &[status-id='2'] {
            background-color: rgb(39, 163, 8);
        }

        &[status-id='-1'] {
            background-color: rgb(218, 141, 86);
        }

        &[status-id='-2'] {
            background-color: rgb(245, 88, 74);
        }
    }

    &[status-id='0'], &[status-id='1'] {
        background: linear-gradient(90deg, $rotate-border-color 50%, transparent 50%),
            linear-gradient(90deg, $rotate-border-color 50%, transparent 50%),
            linear-gradient(0deg, $rotate-border-color 50%, transparent 50%),
            linear-gradient(0deg, $rotate-border-color 50%, transparent 50%);
        background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
        background-size:
            $rotate-border-length $rotate-border-width,
            $rotate-border-length $rotate-border-width,
            $rotate-border-width $rotate-border-length,
            $rotate-border-width $rotate-border-length;
        padding: calc($rotate-border-width + 1px);
        animation: border-dance 4s infinite linear;
    }   

    &[status-id='-1'] {
        border: rgb(96, 112, 136) 2px solid;
        filter: grayscale(85%);
    }

    &[status-id='-2'] {
        border: rgb(96, 112, 136) 2px solid;
        filter: grayscale(100%);
    }

    &[status-id='2'] {
        border: rgb(5, 160, 0) 2px solid;
        filter: grayscale(0%);
    }
}

@keyframes border-dance {
    0% {
        background-position:
            0 0,
            100% 100%,
            0 100%,
            100% 0;
    }
    100% {
        background-position:
            100% 0,
            0 100%,
            0 0,
            100% 100%;
    }
}
</style>

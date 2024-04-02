<template>
<div class="card"
    @click="changeStatus"
>
    <div class="result-content">
        <div class="result-text-content">
            <div class="result-text">{{ props.title }}</div>
            <div class="result-time">( {{ props.time }} )</div>
            <el-switch
                class="result-switch"
                @click="changeStatus"
                v-model="Status"
                :active-action-icon="View"
                :inactive-action-icon="Hide"
            />
        </div>
        <div class="result-icon-content">
            <img :src="props.iconSrc" alt="result">
        </div>
    </div>
</div>
</template>

<script setup>
import { Hide, View } from '@element-plus/icons-vue'
import { ref } from 'vue'
const Status = ref(false)
const props = defineProps({
    title: String,
    time: String,
    iconSrc: String,
})
const changeStatus = () => {
    Status.value = !Status.value
}

</script>

<style lang="scss" scoped>
div.card {
    width: 26vw;
    height: 5vh;
    margin: 5px;
    padding: 5px;
    border-radius: 10px;
    background: #175FA3;
    overflow: hidden;
    box-shadow: #b4c8fc 5px 1px 8px 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: transform 0.5s;
    user-select: none;

    &:hover {
        transform: scale(1.01);
        cursor: pointer;
    }

    div.result-content {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        margin: 5px;
        
        div.result-text-content {
            display: flex;
            flex-direction: row;
            align-items: center;
            width:90%;
            height: 100%;
            background: linear-gradient(45deg, #C9E1F5, #E2FFEE);
            border-radius: 10px;

            div.result-text {
                font-size: calc(0.8vw + 0.8vh);
                font-style: normal;
                text-align: left;
                padding-left: 10px;
                line-height: 4.5vh;
                transform: skew(-20deg);
            }

            div.result-time {
                font-size: calc(0.4vw + 0.4vh);
                font-weight: 600;
                font-style: normal;
                text-align: left;
                padding-left: 2px;
                line-height: 5.5vh;
                transform: skew(-20deg);
                color: red;
            }

            div.result-switch {
                margin-left: 25px;
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #c4bebe;
            }


        }

        div.result-icon-content {
            display: flex;
            justify-content: center;
            align-items: center;
            width: auto;
            height: 100%;
            right: 0%;

            img {
                width: 100%;
                height: 100%;
                padding: 1%;
                object-fit: contain;
            }
        }
    }
}
</style>

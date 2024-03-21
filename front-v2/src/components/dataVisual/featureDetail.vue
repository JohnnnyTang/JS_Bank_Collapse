<template>
    <div class="feature-detail">
        <div class="headerInfo">
            <div class="name" :style="{ 'font-size': fontSize }">{{ featureUniformInfo.name }}</div>
            <div class="secondInfo">
                <div class="belongcity">{{ featureUniformInfo.secondInfo.info1 }}</div>
                <div class="belongriver">{{ featureUniformInfo.secondInfo.info2 }}</div>
            </div>
        </div>
        <div class="desc">{{ featureUniformInfo.description }}</div>
    </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue';

const fontSize = computed(() => {
    let size = 30
    if (props.selectedFeature.value.bankName) {
        let length = props.selectedFeature.value.bankName.length
        if (length < 4) size = 35
        else if (length < 6) size = 26
        else if (length < 12) size = 23
        else size = 18
    }
    if (props.selectedFeature.value.name) {
        let length = props.selectedFeature.value.name.length
        if (length < 4) size = 35
        else if (length < 6) size = 26
        else if (length < 12) size = 23
        else size = 18
    }
    return String(size) + 'px'
})

const props = defineProps({
    selectedFeature: Object
})

watch(props, (newV, oldV) => {
    // console.log(newV.selectedFeature.value.bankName);
    console.log(newV.selectedFeature.value);
})
const featureUniformInfo = computed(() => {

    if (props.selectedFeature.value["desc"]) {
        // for channel
        return {
            name:props.selectedFeature.value["name"],
            secondInfo:{
                info1:props.selectedFeature.value["type"],
                info2:null,
            },
            description:props.selectedFeature.value["desc"]
        }
    }
    else {
        // for bank
        return {
            name:props.selectedFeature.value["bankName"],
            secondInfo:{
                info1:props.selectedFeature.value["cityName"],
                info2:props.selectedFeature.value["riverName"],
            },
            description:props.selectedFeature.value["description"]
        }
    }
})

onMounted(async () => {

})

</script>

<style lang="scss" scoped>
.feature-detail {

    width: 20vw;
    height: 30vh;
    border-radius: 15px;
    background: #4cafaf;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: absolute;
    //right: 2vw;
    //top: 10vh;
    overflow: hidden;

    &::before {
        content: "";
        width: 200px;
        height: 200px;
        position: absolute;
        top: -50%;
        left: 50%;
        border-radius: 50%;
        border: 35px solid rgba(255, 255, 255, 0.13);
    }

    .headerInfo {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        position: relative;
        font-weight: 900;
        color: #ECF4FD;
        height: 40%;

        .name {
            padding-top: 3vh;
            line-height: 1.1;
            text-shadow: 0 0 5px #D3F3F8;
            width: 50%;
        }

        .secondInfo {
            padding-top: 2vh;

            .belongcity {
                margin-bottom: 1vh;
                font-size: 25px;
                text-shadow: 0 0 1px #D3F3F8;
                text-align: right;
            }

            .belongriver {
                font-size: 20px;
                text-shadow: 0 0 1px #D3F3F8;
                text-align: right;
            }
        }
    }

    .desc {
        padding-left: 5%;
        padding-right: 5%;
        width: 88%;
        color: #ECF4FD;
        font-size: 15px;
        overflow-x: hidden;
        overflow-y: auto;
        height: 60%;

        &::-webkit-scrollbar {
            width: 5px;
        }

        &::-webkit-scrollbar-track {
            background-color: rgba(255, 255, 255, 0.219);
        }

        &::-webkit-scrollbar-thumb {
            background-color: #ffffff94;
            border-radius: 5px;
        }

        &::-webkit-scrollbar-thumb:hover {
            background-color: #ffffff81;
        }
    }
}
</style>
<template>
    <div class="feature-detail">
        <div class="headerInfo">
            <div class="name">{{props.selectedFeature.value.bankName}}</div>
            <div class="secondInfo">
                <div class="belongcity">{{props.selectedFeature.value.cityName}}</div>
                <div class="belongriver">{{props.selectedFeature.value.riverName}}</div>
            </div>
        </div>
        <div class="desc">{{props.selectedFeature.value.description}}</div>
    </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';

const props = defineProps({
    selectedFeature:Object
})

watch(props,(newV,oldV)=>{
    console.log(newV.selectedFeature.value.bankName);
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
        padding-bottom: 40px;
        font-weight: 900;
        color: #ECF4FD;

        .name {
            font-size: 40px;
            text-shadow: 0 0 5px #D3F3F8;
            position: absolute;
            left: 5%;
            top: 5%;
        }

        .secondInfo {
            position: absolute;
            right: 5%;
            top: 5%;
            .belongcity {
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
        color: #ECF4FD;
        font-size: 15px;
        overflow: hidden;
    }
}
</style>
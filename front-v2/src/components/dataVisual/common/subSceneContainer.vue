<template>
    <div class="subScene-container">
        <div class="card">
            <div class="top-section" :class="$attrs.class">
                <div class="icon-container">
                    <div class='icon' :style="{ backgroundImage: `url(${props.iconSrc})` }"></div>
                </div>
                <div class="title">
                    <div class="title-text">
                        {{ props.title }}
                    </div>
                </div>
            </div>
        </div>
        <div class="button-block" @click="clickHandler">
            {{ buttonText }}
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
    title: String,
    iconSrc: String,
})
const emit = defineEmits(['filter'])
const sholdFilter = ref(true)
const buttonText = computed(() => {
    console.log(sholdFilter.value);
    return sholdFilter.value ? '全部要素' : '重点要素'
})

const clickHandler = (a, b) => {
    sholdFilter.value = !sholdFilter.value
    // emit('filter', sholdFilter.value)
    console.log(a, b);
}

</script>
  
<style lang="scss" scoped>
.subScene-container {
    // width: 12vw;
    // height: 4vh;
    width: 12vw;
    height: 5vh;
    display: flex;
    flex-direction: row;

    .card {
        width: 75%;
        height: 4vh;
        border-radius: 5px;
        background: rgb(20, 115, 196);
        padding: 4px;
        overflow: hidden;
        box-shadow: #cbeafd 10px 7px 20px 0px;
        display: flex;
        flex-direction: column;
        transition: transform 0.5s;
        user-select: none;

        &:hover {
            transform: scale(1.02);
            cursor: pointer;
        }


        .top-section {
            //   height: 10vh;
            height: 100%;
            width: 100%;
            border-radius: 5px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            background: rgb(234, 244, 252);
            position: relative;

            .icon-container {
                position: relative;
                width: 4vh;
                height: 4vh;

                .icon {
                    top: 0;
                    right: 15%;
                    transform: translateX(50%) translateY(20%);
                    width: 3vh;
                    height: 3vh;
                    position: absolute;
                    background-size: contain;
                }
            }

            .title {
                position: relative;
                width: 50%;
                height: 4vh;

                .title-text {
                    color: rgb(20, 115, 196);
                    font-size: calc(0.8vw + 0.8vh);
                    font-style: normal;
                    margin-left: 1vw;
                    line-height: 4vh;
                    font-family: 'Microsoft YaHei';
                }
            }



        }

        .top-section.active {
            background: linear-gradient(45deg, #C9E1F5, #5af4ff);

        }
    }

    // .card.expand{
    //     width: 100%;
    //     height: 4vh;
    // }
    .button-block {
        position: relative;
        // margin-left: ;
        // margin-top: 0.5vh;
        width: 20%;
        margin-left: 5%;
        height: 5vh;
        background-color: rgb(2, 93, 173);
        display: flex;
        justify-content: center;
        align-items: center;
        text-wrap: wrap;
        text-align: center;
        line-height: 2vh;
        background-color: #C9E1F5;
        color: rgb(7, 58, 153);
        font-size: calc(0.5vw + 0.5vh);

    }

}
</style>
  
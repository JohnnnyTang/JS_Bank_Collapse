<template>
    <div class="card">
        <div class="top-section" :class="$attrs.class">
            <div class="title">
                <div class="title-text">
                    {{ props.title }}
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
const props = defineProps({
    title: String,
    iconSrc: String,
})
</script>
  
<style lang="scss" scoped>
.card {
    margin: 0.5vh;
    width: 13vw;
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
        border-radius: 5px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        // background: rgb(234, 244, 252);
        position: relative;

        .title {
            width: 70%;
            height: 4vh;

            .title-text {
                color: rgb(234, 244, 252);
                font-size: calc(0.8vw + 0.8vh);
                font-style: normal;
                font-weight: 700;
                margin-left: 1vw;
                line-height: 4vh;
                font-family: 'Microsoft YaHei';

            }
        }

        .icon-container {
            width: 4vh;
            height: 4vh;

            .icon {
                top: 0;
                right: 15%;
                transform: translateX(50%);
                width: 3.5vh;
                height: 3.5vh;
                position: absolute;
                // background-image: url('/output.png');
                background-size: contain;
            }
        }

    }

    .top-section.active {
        background: linear-gradient(45deg, rgb(255, 255, 255), #C9E1F5);

        .title {
            .title-text {
                color: rgb(27, 116, 193);
            }
        }

    }
}
</style>
  
<template>
    <div class="wrapper" @click="jumpToPath(data.path)">
        <div class="clash-card">
            <div class="clash-card__image" :style="{ backgroundImage: 'url(' + data.img + ')' }">
            </div>
            <div class="clash-card__unit-name">{{ data.name }}</div>
            <div class="clash-card__unit-description">
                {{ data.description }}
            </div>

            <div class="clash-card__unit-stats  clearfix">
                <div :class="{ 'one-second': data.type === 'two', 'one-third': data.type === 'three', 'one-first': data.type === 'one' }"
                    v-for="(unit, index) in data.unitInfo">
                    <div class="stat">{{ unit.value }}份</div>
                    <div class="stat-value">{{ unit.name }}</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { defineProps } from 'vue';

const router = useRouter()
const props = defineProps({
    navInfo: Object,
    default: {
        name: '',
        description: '',
        img: '',
        path: '',
        type: 'one',
        unitInfo: [{
            name: '',
            value: 0
        }]
    },
})

const data = props.navInfo

const jumpToPath = (path) => {
    router.push(path)
}

</script>

<style lang="scss" scoped>
$border-radius-size: 14px;
$barbarian: rgb(226, 161, 40);
$hoverEasing: cubic-bezier(0.23, 1, 0.32, 1);
$returnEasing: cubic-bezier(0.445, 0.05, 0.55, 0.95);

.wrapper {
    // temp
    position: relative;
    width: 23vw;
    height: fit-content;
    margin: 2vh 2vw;
    // background-color: aqua;
    font-family: 'Microsoft YaHei';
    cursor: pointer;


    &:hover {
        transform: scale(1.03);
        transition: 0.6s $hoverEasing;
        cursor: pointer;
        box-shadow: -1px 15px 30px -12px rgb(255, 255, 255);
    }

    .clash-card {
        background: rgb(255, 255, 255);
        width: 23vw;
        display: inline-block;
        margin: auto;
        border-radius: $border-radius-size;
        position: relative;
        text-align: center;
        box-shadow: -1px 15px 30px -12px black;
        z-index: 9999;
    }

}


.clash-card__image {
    position: relative;
    height: 26.5vh;
    width: 23vw;
    border-top-left-radius: $border-radius-size;
    border-top-right-radius: $border-radius-size;

    background-size: cover;
    background-repeat: no-repeat;

    margin-bottom: 1vh;
}



.clash-card__unit-name {
    font-size: calc(1.2vw + 0.9vh);
    color: $barbarian;
    font-weight: 900;

}

.clash-card__unit-description {
    padding: 1.5vh 1vw;
    margin-bottom: 1vh;
    text-align: left;
    text-indent: 2em;
    line-height: 1.5em;
    height: 8vh;
}

.one-third {
    width: 30%;
    float: left;
    padding: 2vh 0.35vw;
    border-right: 1px solid #ffffff;

    &:last-child {
        border-right: none;
    }
}

.one-second {
    width: 46%;
    float: left;
    padding: 2vh 0.35vw;
    border-right: 1px solid #ffffff;

    &:last-child {
        border-right: none;
    }
}

.one-first {
    width: 90%;
    float: left;
    padding: 2vh 0.35vw;
}

.clash-card__unit-stats {

    background-color: $barbarian;

    color: rgb(255, 255, 255);
    font-weight: 700;
    border-bottom-left-radius: $border-radius-size;
    border-bottom-right-radius: $border-radius-size;

    sup {
        position: absolute;
        bottom: 4px;
        font-size: 45%;
        margin-left: 2px;
    }

    .stat {
        position: relative;
        font-size: 24px;
        margin-bottom: 10px;
    }

    .stat-value {
        text-transform: uppercase;
        font-weight: 400;
        font-size: calc(0.8vw + 0.5vh);
    }

}

.clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
}
</style>
<template>
    <div class="main-header-container">
        <div class="header-logo-pic"></div>
        <div class="header-name-conatainer">
            <div class="header-name-text">
                长江江苏段
                <br>崩岸预警模型应用系统
            </div>
        </div>
        <div class="header-nav-container">
            <div class="header-nav-item" v-for="navItem of navList" @click="emitNavClick(navItem)"
                :class="{ active: navItem.isActive }">
                <div class="header-nav-upLine"></div>
                <div class="header-nav-text">
                    {{ navItem.name }}
                </div>
                <div class="header-nav-downLine"></div>
            </div>
        </div>
        <div class="header-user-container"></div>
    </div>
</template>

<script setup>
// import router from '../../router/index';
import { ref } from 'vue'
const emit = defineEmits(['navClick'])


const navList = ref([
    { name: '崩岸预警监测', routerLink: '/', isActive: true },
    { name: '监测设备管理', routerLink: '/device', isActive: false },
    { name: '崩岸知识库', routerLink: '/knowledge', isActive: false },
    { name: '崩岸资源管理', routerLink: '/tree', isActive: false },
])

let previousActive = navList.value[0];

const emitNavClick = (navItem) => {
    emit('navClick', navItem.routerLink);
    if (previousActive.name != navItem.name) {
        for (let navItem of navList.value) {
            if (navItem.isActive) {
                navItem.isActive = false;
            }
        }
        navItem.isActive = true;
        previousActive = navItem;
    }

}



</script>

<style lang="scss" scoped>
div.main-header-container {
    height: 7vh;
    width: 100vw;
    background-image: linear-gradient(to bottom,
            rgba(0, 24, 68, 1) 0%,
            rgba(0, 24, 68, 0.85) 42%,
            rgba(0, 24, 68, 0.6) 100%);
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    div.header-logo-pic {
        height: 5vh;
        width: 5vw;
        // background-color: aqua;
        background-position: 50% 50%;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url('./logo.png');
    }

    div.header-name-conatainer {
        width: 20vw;

        div.header-name-text {
            // background-image: linear-gradient(25deg,
            //         #ffffff 0%,
            //         #b1f6ff 40%,
            //         #7bf0ff 100%);
            // -webkit-background-clip: text;
            // background-clip: text;
            // -webkit-text-fill-color: transparent;
            // -webkit-animation: hue 60s infinite linear;
            // animation: hue 60s infinite linear;
            color: #effcfd;

            // text-shadow:
            //     0 -1px 0 #fff,
            //     0 1px 0 #2e2e2e,
            //     0 2px 0 #2c2c2c,
            //     0 3px 0 #2a2a2a,
            //     0 4px 0 #282828,
            //     0 5px 0 #262626;

            word-wrap: break-word;
            // word-spacing: 40px;
            font-size: 1.2vw;
            text-align: left;
            font-weight: 600;
            font-family: "Microsoft YaHei";
        }

    }

    div.header-nav-container {
        width: 65vw;
        height: 7vh;
        // background-color: #7bf0ff;
        display: flex;
        flex-flow: row nowrap;
        justify-content: start;

        div.header-nav-item {
            height: 7vh;
            width: 7vw;
            margin-right: 1.4vw;
            margin-left: 1.4vw;
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            align-content: center;


            &:hover {
                cursor: pointer;

                div.header-nav-upLine {
                    margin-bottom: 0;
                    margin-top: 1.2vh;
                    background-color: #b1f6ff;
                    transition: all 0.3s ease-in-out;
                }

                div.header-nav-downLine {
                    margin-bottom: 1.2vh;
                    margin-top: 0;
                    background-color: #b1f6ff;
                    transition: all 0.3s ease-in-out;
                }
            }

            &.active {
                div.header-nav-text {
                    color: #b1f6ff;

                    text-shadow:
                        1px -1px 0 #707a81,
                        -1px 2px 1px rgb(92, 100, 105),
                        -2px 4px 1px rgb(39, 45, 51);
                        // -3px 6px 1px #787777,
                        // -4px 8px 1px #7b7a7a,
                    font-weight: 600;
                    
                }

                div.header-nav-upLine {
                    margin-bottom: 0;
                    margin-top: 1.2vh;
                    background-color: #b1f6ff;
                    transition: all 0.3s ease-in-out;
                }

                div.header-nav-downLine {
                    margin-bottom: 1.2vh;
                    margin-top: 0;
                    background-color: #b1f6ff;
                    transition: all 0.3s ease-in-out;
                }

            }

            div.header-nav-upLine {
                height: 0.3vh;
                width: 7vw;
                margin-bottom: 1.2vh;
                background-color: transparent;
                transition: all 0.3s ease-in-out;
            }

            div.header-nav-downLine {
                height: 0.3vh;
                width: 7vw;
                margin-top: 1.2vh;
                background-color: transparent;
                transition: all 0.3s ease-in-out;
            }

            div.header-nav-text {
                // height: 7vh;
                width: 7vw;
                height: 4vh;
                line-height: 4vh;
                // margin-top: 1vh;
                // margin-bottom: 1vh;
                font-size: 1vw;
                // font-weight: 600;
                font-family: "Microsoft YaHei";
                color: #e1f3f5;
                caret-color: transparent;

                text-shadow: 1px -1px 0 #8a9a9e,
                    -1px 2px 1px rgb(96, 110, 110),
                    -2px 4px 1px rgb(68, 78, 78);
                // -3px 6px 1px #787777,
                // -4px 8px 1px #7b7a7a,
                text-align: center;


            }
        }

    }
}
</style>
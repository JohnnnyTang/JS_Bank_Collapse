<template>
    <div class="login-view">

        <div class="login-card">
            <div class="left-side">
                <div class="login-pic"></div>
                <div class="title-block">
                    <span class="font" style="font-size:calc(1.4vw + 1.4vh);">江苏省长江崩岸</span>
                    <br>
                    <span class="font" style="font-size:calc(1.3vw + 1.3vh);">监测预警应用系统</span>
                </div>
            </div>

            <div class="right-side">
                <div class="login-title">用户登录</div>
                <form class="login-form" @submit.prevent="login()">
                    <input type="username" v-model="username" class="input" placeholder="用户名" style="margin-top: 5.5vh;">
                    <input type="password" v-model="password" class="input" placeholder="密码">
                    <button class="form-btn">登录</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import router from '../router/index';

const username = ref('');
const password = ref('');

const login = () => {
    if (username.value === '123' && password.value === '123') {
        localStorage.setItem('loggedIn', true);
        router.push('/dataVisual')
    }
    else
        alert('用户名或密码错误，请重新输入！');
};
</script>

<style lang="scss" scoped>
div.login-view {
    position: absolute;
    width: 100vw;
    height: 92vh;
    opacity: 0.5;
    background-image: repeating-radial-gradient(circle at 0 0, transparent 0, #e5e5f7 10px), repeating-linear-gradient(#93dbff55, #93dbff);
    display: flex;
    justify-content: center;
    align-items: center;

    div.login-card {
        position: relative;
        width: 38vw;
        height: 48vh;
        background-color: #ffffff;
        // box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
        border-radius: calc(0.2vw + 0.5vh);
        border-right: #045f8d solid calc(0.2vw + 0.5vh);
        border-bottom: #045f8d solid calc(0.2vw + 0.5vh);
        border-top: #0382c2 solid calc(0.1vw + 0.1vh);
        border-left: #0382c2 solid calc(0.1vw + 0.1vh);

        display: flex;
        flex-direction: row;


        div.left-side {
            position: relative;
            width: 55%;
            height: 100%;
            background-color: #f3f3f3;
            border-right: #219cda solid 1px;

            div.login-pic {
                position: absolute;
                top: 36%;
                left: 15%;
                width: calc(10vw + 10vh);
                height: calc(10vw + 10vh);
                background-image: url('/login.png');
                background-size: contain;
                background-repeat: no-repeat;

            }

            div.title-block {
                position: relative;
                margin-top: 5%;
                width: 100%;
                height: 30%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                span.font {
                    font-family: 'Microsoft YaHei';
                    font-weight: bold;
                    line-height: calc(1.7vw + 1.7vh);
                    color: #003b58;

                }

            }
        }

        div.right-side {
            position: relative;
            width: 45%;
            height: 100%;
            background-color: #f3f8fa;

            .login-title {
                position: relative;
                width: 100%;
                height: 20%;
                font-family: 'Microsoft YaHei';
                font-size: calc(1.2vw + 1.2vh);
                font-weight: bold;
                color: #003b58;
                letter-spacing: .2em;
                display: flex;
                justify-content: center;
                align-items: flex-end;
            }

            .login-form {
                position: relative;
                width: 100%;
                height: 80%;

                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                gap: 2vh;

                .input {
                    width: 70%;
                    height: 5vh;
                    border-radius: 20px;
                    border: 1px solid #c0c0c0;
                    outline: 0 !important;
                    box-sizing: border-box;
                    padding-left: 20px;
                    margin-top: 2vh;
                    font-size: calc(0.6vw + 0.6vh);
                }

                .form-btn {
                    margin-top: 2vh;

                    width: 70%;
                    height: 4.5vh;
                    border-radius: 20px;
                    font-family: 'Microsoft YaHei';

                    background-color: #0b7eb8;
                    border-radius: 20px;
                    border: 0 !important;
                    outline: 0 !important;
                    color: white;
                    cursor: pointer;
                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                    font-size: calc(0.7vw + 0.6vh);

                    &:active {
                        box-shadow: none;
                    }
                }

            }
        }
    }
}
</style>
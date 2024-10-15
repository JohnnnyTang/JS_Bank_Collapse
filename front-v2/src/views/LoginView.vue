<template>
    <div class="login-view">
        <div class="overlay"></div>
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
import { ref, onUnmounted } from 'vue';
import router from '../router/index';
import axios from 'axios';
import { ElMessage } from 'element-plus'
import { useStatusStore } from '../store/statusStore';

const statusStore = useStatusStore();
const username = ref('');
const password = ref('');

const loginFail = () => {
    statusStore.loginStatus = false
    ElMessage.error('登录失败,请检查用户名或密码')
}
const loginSuccess = () => {
    statusStore.loginStatus = true
    ElMessage.success('登录成功')
}

const login = () => {
    // step 1 input checkin
    if (username.value.trim() === '' || password.value.trim() === '') {
        ElMessage.info('用户名或密码不能为空')
        return
    }
    // step 2 post request
    const requestBody = {
        "email": username.value,
        "password": password.value
    }
    axios.post('/api/user/login', requestBody).then(response => {
        let token
        if (token = response.data) {
            localStorage.setItem('token', token)
            loginSuccess()
            router.push('/dataVisual')
        } else {
            loginFail()
        }
    }).catch(error => {
        console.log(error)
        loginFail()
    })
};

onUnmounted(() => {
    username.value = '';
    password.value = '';
})
</script>

<style lang="scss" scoped>
div.login-view {
    position: absolute;
    width: 100vw;
    height: 92vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(230, 243, 255);
    overflow: hidden;
    user-select: none;
    div.overlay {
        position: absolute;
        left: 17%;
        top: 10%;

        @keyframes rotate {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        --size: 1080px;
        --speed: 10s;
        --easing: cubic-bezier(0.8, 0.2, 0.2, 0.8);
        width: 70vw;
        height: 70vh;
        filter: blur(calc(var(--size) / 5));
        background-image: linear-gradient(rgba(11, 125, 255, 0.479), rgba(22, 246, 235, 0.411));
        animation: rotate var(--speed) var(--easing) alternate infinite;
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;

    }


    div.login-card {
        position: relative;
        z-index: 100;
        width: 38vw;
        height: 48vh;
        background-color: #ffffff;
        // box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
        border-radius: calc(0.2vw + 0.5vh);
        border-right: rgb(0, 44, 126) solid calc(0.2vw + 0.3vh);
        border-bottom: rgb(0, 49, 141) solid calc(0.2vw + 0.5vh);
        border-top: rgb(22, 129, 240) solid calc(0.1vw + 0.1vh);
        border-left: rgb(22, 129, 240) solid calc(0.1vw + 0.1vh);

        display: flex;
        flex-direction: row;


        div.left-side {
            position: relative;
            width: 55%;
            height: 100%;
            background-color: #f3f3f3;
            // border-radius: calc(0.1vw + 0.5vh);
            border-top-left-radius: calc(0.1vw + 0.5vh);
            border-right: #219cda solid 1px;

            div.login-pic {
                position: absolute;
                top: 34%;
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
                    transition: .4s ease-in-out;

                    &:hover {
                        border-color: #004c72;
                    }
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
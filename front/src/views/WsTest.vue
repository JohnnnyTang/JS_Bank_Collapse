<template>
    <div>
        <span>{{ connectStatus }}</span>
        <br>
        <input type="text" name="asdasd" id="nameInput" v-model="username">
        <button @click="connectWs">connect</button>
        <br>
        <input type="text" name="aqwe" id="textInput" v-model="textInput">
        <button @click="sendMessage">send</button>
        <div v-for="message in messageList" :key="messageList.indexOf(message)">
            <span>{{ message }}</span>
            <br>
        </div>
    </div>
</template>

<script setup>
import SockJS from 'sockjs-client/dist/sockjs'; 
import Stomp from 'stompjs';
import { ref } from 'vue';

let connectStatus = ref("connecting");
let stompClient = null;
let username = ref("");
let textInput = ref("");
let messageList = ref(['messageList']);

let onMessageReceived = (payload) => {
    let message = JSON.parse(payload.body);
    console.log(messageList.value);
    if(message.messageType == 'JOIN') {
        messageList.value.push(message.sender + " joined");
    } else if(message.messageType == 'LEAVE') {
        messageList.value.push(message.sender + " leaved");
    } else {
        messageList.value.push(message.sender + " send: " + message.content);
    }
}

let onConnected = () => {
    stompClient.subscribe("/topic/public", onMessageReceived);
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username.value, messageType: 'JOIN', content: ''})
    );
    connectStatus.value = "connected";

}

let onError = () => {
    connectStatus.value = "could not connect...";
}

let connectWs = () => {
    let sockjs = new SockJS("http://localhost:8989/ws");
    stompClient = Stomp.over(sockjs);

    stompClient.connect({}, onConnected, onError);
}

let sendMessage = () => {
    if(textInput.value != "" && stompClient) {
        let messageContent = {
            sender: username.value,
            content: textInput.value,
            messageType: 'CHAT'
        }
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(messageContent));
        textInput.value = "";
    }
}

</script>

<style lang="scss" scoped>

</style>
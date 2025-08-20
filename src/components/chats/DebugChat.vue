<script setup>
import { onMounted, ref } from 'vue';
import TextMessage from './TextMessage.vue';
const messageList = ref([])
const newMessage = ref('');
const ip = ref('0.0');

const base_url = import.meta.env.VITE_BASE_URL

async function sendMessage(message) {
    console.log("Sending message:", message);
    await fetch(`${base_url}/api/sendMessage`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ message })
    })
    messageList.value.push({ value: message, timestamp: new Date(), ip: ip.value });
    getLastMessages(59);
}

async function getLastMessages(n){
    const data = await fetch(`${base_url}/api/getLastMessages?limit=${n}`)
    const text = await data.text()
    console.log("Retrieved messages:", text);
    const jsonData = JSON.parse(text);
    console.log("Parsed JSON data:", jsonData);
    messageList.value = jsonData.messages;
    ip.value = jsonData.ip;
}

async function getMessages(n){
    const data = await fetch(`${base_url}/api/getMessages?limit=${n}`)
    const text = await data.text()
    const jsonData = JSON.parse(text);
    messageList.value = jsonData.messages;
    ip.value = jsonData.ip;
}

onMounted(() => {
    getLastMessages(10);
});


</script>


<template>
    <div class=" w-full h-400">
        <button @click="getLastMessages(10)" class="px-4 py-2 bg-blue-500 text-white rounded">
            <i class="fas fa-sync" />
        </button>
        <div class="flex flex-col w-full">
            <TextMessage  v-for="message in messageList" :key="message.id" :message="message" :isCurrentUser="message.ip === ip" />
        </div>

        <input 
        v-model="newMessage" 
        type="text"
        maxlength="200"
        @keyup.enter="{
            sendMessage(newMessage); 
            newMessage = '';
        }" 
        placeholder="Type your message..." 
        class="border rounded-md p-3  w-2/3 mx-auto block bg-green-100" />
    </div>
</template>

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
    messageList.value.push({ value: message, timestamp: new Date(), ip: '0.0' })
}

async function getLastMessages(n){
    const data = await fetch(`${base_url}/api/getMessages?limit=${n}`)
    const text = await data.text()
    console.log("Retrieved messages:", text);
    const jsonData = JSON.parse(text);
    console.log("Parsed JSON data:", jsonData);
    const { messages, ipStack } = jsonData.responseItem;
    messageList.value = messages;
    ip.value = ipStack;
}

onMounted(() => {
    getLastMessages(59);
});


</script>


<template>
    <div class=" w-full h-400 bg-red-100">
        <button @click="getLastMessages(59)" class="px-4 py-2 bg-blue-500 text-white rounded">Refresh</button>
        <div class="flex flex-col w-full bg-green-100">
            <TextMessage  v-for="message in messageList" :class="bg-green-100" :key="message.id" :message="message" :isCurrentUser="message.ip === ip" />
        </div>

        <input 
        v-model="newMessage" 
        @keyup.enter="{
            sendMessage(newMessage); 
            newMessage = '';
        }" 
        placeholder="Type your message..." 
        class="border p-2 w-full" />
    </div>
</template>

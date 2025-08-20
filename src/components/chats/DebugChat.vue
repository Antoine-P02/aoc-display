<script setup>
import { onMounted, ref } from 'vue';
const messageList = ref([])
const newMessage = ref('');

const base_url = import.meta.env.VITE_BASE_URL

async function sendMessage(message) {
    console.log("Sending message:", message);
    await fetch(`${base_url}/api/sendMessage`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ message })
    })
    getLastMessages(59);
}

async function getLastMessages(n){
    const data = await fetch(`${base_url}/api/getMessages?limit=${n}`)
    const text = await data.text()
    console.log("Retrieved messages:", text);
    const jsonData = JSON.parse(text);
    console.log("Parsed JSON data:", jsonData);
    messageList.value = jsonData.messages;
}

onMounted(() => {
    getLastMessages(59);
});


</script>


<template>
    <div class=" w-full h-400 bg-red-400">
        <button @click="getLastMessages(59)" class="px-4 py-2 bg-blue-500 text-white rounded">Get Last Messages</button>
        <ul>
            <li v-for="message in messageList" :key="message.id">{{ message.value }}</li>
        </ul>
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

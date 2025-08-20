<script setup>
import { onMounted, ref } from 'vue'
import TextMessage from './TextMessage.vue'
import AuthPage from './AuthPage.vue'

const messageList = ref([])
const newMessage = ref('')
const imageList = ref([])
const ip = ref('0.0')

const base_url = import.meta.env.VITE_BASE_URL

async function sendMessage(message) {
  console.log('Sending message:', message)

  const messageData = {
    value: message,
    images: imageList.value
  }
  console.log('Message data:', messageData, imageList.value)
  await fetch(`${base_url}/api/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData)
  })
  messageList.value.push({ value: message, images: imageList.value, timestamp: new Date(), ip: ip.value })
  imageList.value = []
  getLastMessages(10)
}

async function getLastMessages(n) {
  const data = await fetch(`${base_url}/api/getLastMessages?limit=${n}`)
  const text = await data.text()
  const jsonData = JSON.parse(text)
  messageList.value = jsonData.messages
  ip.value = jsonData.ip
}

async function getMessages(n) {
  const data = await fetch(`${base_url}/api/getMessages?limit=${n}`)
  const text = await data.text()
  const jsonData = JSON.parse(text)
  messageList.value = jsonData.messages
  ip.value = jsonData.ip
}

onMounted(() => {
  getLastMessages(10)
})

const isLoggedIn = ref(false)

function handlePaste(event) {
  const items = event.clipboardData.items
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (items[i].type.indexOf('image') !== -1) {
      const file = item.getAsFile()
      const reader = new FileReader()
      reader.onload = function (e) {
        const imageUrl = e.target.result
        imageList.value.push(imageUrl)
      }
      reader.readAsDataURL(file)
      return
    }
  }
}
</script>

<template>
  <div v-if="isLoggedIn" class="w-full">
    <button @click="getLastMessages(10)" class="px-4 py-2 bg-blue-500 text-white rounded">
      <i class="fas fa-sync" />
    </button>
    <div class="flex flex-col w-full">
      <TextMessage v-for="message in messageList" :key="message.id" :message="message" :isCurrentUser="message.ip === ip" />
    </div>

    <div>
      <input
        v-model="newMessage"
        type="text"
        maxlength="200"
        @paste="handlePaste"
        @keyup.enter="
          {
            sendMessage(newMessage)
            newMessage = ''
          }
        "
        placeholder="Type your message..."
        class="border rounded-md p-3 w-2/3 mx-auto block bg-green-100"
      />
      <div class="flex flex-wrap justify-start w-2/3 mx-auto">
        <div v-for="image in imageList" class="w-20 h-20 m-4 group relative">
          <img :src="image" alt="Pasted Image" class="absolute top-0 left-0 w-full h-full border-4 bg-gray-600 border-gray-300 rounded-md group-hover:blur-xs group-hover:opacity-50 transition duration-300" />

          <button @click="imageList = imageList.filter(i => i !== image)" class="absolute top-0 left-0 w-full h-full z-10 text-red-500 opacity-0 group-hover:opacity-100 transition">
            <i class="fas fa-trash" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <AuthPage @login-success="isLoggedIn = true" @register-success="isLoggedIn = true" />
  </div>
</template>

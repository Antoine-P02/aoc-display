<script setup>
import { onMounted, ref, nextTick } from 'vue'
import TextMessage from './TextMessage.vue'
import pingSound from '@/assets/ping.wav'
import ConversationHeader from './ConversationHeader.vue'
import DeleteButtonOver from '../reusables/DeleteButtonOver.vue'
import { userStoreData } from '../user/User'

const props = defineProps({
  currentUser: {}
})

const emit = defineEmits(['back-to-aoc'])
console.log("currentUser prop in ChatPage:", props.currentUser)

const messageList = ref([])
const newMessage = ref('')
const imageList = ref([])

const ip = ref('0.0')
const isLoggedIn = ref(false)
const errorWarning = ref('')

const authLoading = ref(true)
const chatContainer = ref(null)
const status = ref('bot')
const showScrollToBottom = ref(false)

const NUMBER_OF_MESSAGES = 15
const base_url = import.meta.env.VITE_BASE_URL

function isEqual(message1, message2) {
  return message1._id === message2._id && message1.value === message2.value && message1.timestamp === message2.timestamp
}

onMounted(() => {
  getLastMessages(NUMBER_OF_MESSAGES, 0)
  setInterval(refreshMessages, 30000) // Refresh messages every 30s to see if new messages have arrived
})

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    status.value = 'bot'
    showScrollToBottom.value = false
  }
}

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

function confirmSend(event) {
  const textContent = event.target.value.trim()
  if (textContent) {
    sendMessage(textContent)
    newMessage.value = ''
  }
}

async function handleScroll() {
  if (chatContainer.value.scrollTop < chatContainer.value.scrollHeight - chatContainer.value.clientHeight - 100) {
    showScrollToBottom.value = true
  } 
  else {
    showScrollToBottom.value = false
  }

  if (chatContainer.value.scrollTop === 0) {
    const prevMaxScroll = chatContainer.value.scrollHeight
    status.value = 'top'
    console.log('request more')
    const previousMessages = await getLastMessages(NUMBER_OF_MESSAGES, messageList.value.length)
    if (previousMessages.length > 0) {
      messageList.value = [...previousMessages, ...messageList.value]
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight - prevMaxScroll + 5
      status.value = 'bot'
    } 
    else {
      status.value = 'beginning'
    }
  }
}

async function getLastMessages(limit, skip) {
  const data = await fetch(`${base_url}/api/getLastMessages?limit=${limit}&skip=${skip}`)
  const text = await data.text()
  const jsonData = JSON.parse(text)

  console.log('GETTER', jsonData.messages)
  if (skip === 0) {
    messageList.value = jsonData.messages
    ip.value = jsonData.ip
  }
  else {
    return jsonData.messages
  }
  await nextTick()
  scrollToBottom()
}

async function refreshMessages() {
  const data = await fetch(`${base_url}/api/getLastMessages?limit=${1}`)
  const text = await data.text()
  const jsonData = JSON.parse(text)
  const lastMessage = jsonData.messages

  if (!isEqual(lastMessage[0], messageList.value[messageList.value.length - 1])) {
    console.log('NEW TEXT FOUND REFRESHING', lastMessage)
    const audio = new Audio(pingSound)
    audio.play()
    getLastMessages(NUMBER_OF_MESSAGES, 0)
    messageList.value.push(lastMessage[0])
  }
}

async function sendMessage(message) {
  console.log('Sending message:', message)

  const messageData = {
    value: message,
    images: imageList.value,
    timestamp: null,
    user: userStoreData.user.username,
    isEdited: null,
    ip: ip.value
  }
  console.log('Message data:', messageData, imageList.value)
  await fetch(`${base_url}/api/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData)
  })
  messageData.timestamp = new Date()
  messageList.value.push(messageData)
  await nextTick()
  scrollToBottom()
  imageList.value = []
}

async function deleteMessage(messageString) {
  const selectedMessage = messageList.value.find(message => message.value === messageString)
  await fetch(`${base_url}/api/deleteMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value: messageString })
  })
  messageList.value = messageList.value.filter(message => message.value !== messageString)
}

async function editMessage(messageId, newMessage) {
  await fetch(`${base_url}/api/editMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageId: messageId, newMessage: newMessage })
  })
}
</script>

<template>
  <div class="flex flex-col w-full gap-y-[2vh]">
    <div ref="chatContainer" class="h-[80vh] overflow-auto no-scrollbar" @scroll="handleScroll">
      <div v-if="status == 'top'" class="text-center text-white">
        <i class="fas fa-spinner fa-pulse" />
        <span>Loading previous messages...</span>
      </div>
      <div v-if="status == 'beginning'" class="text-center">
        <ConversationHeader />
      </div>

      <div class="flex flex-col space-y-2">
        <TextMessage v-for="message in messageList" :key="message.value + message.timestamp" :message="message"
          :deleteMessage="deleteMessage" :editMessage="editMessage"
          :isCurrentUser="message.user !== 'AntoineP02'" />
        <!-- :isCurrentUser="message.user === userStoreData.user.username" /> -->
      </div>
    </div>
    <div class="h-[5vh] relative">
      <input v-model="newMessage" type="text" maxlength="200" @paste="handlePaste" @keyup.enter="confirmSend"
        placeholder="Type your message..." class="border rounded-md p-3 w-2/3 mx-auto block bg-light-green" />

      <button v-if="showScrollToBottom" @click="scrollToBottom"
        class="absolute left-[10%] top-0 px-3.75 py-3 bg-dark-blue text-white rounded-full shadow-lg hover:bg-dark-blue-hover transition">
        <i class="fas fa-arrow-down fa-bounce" />
      </button>

      <div class="flex flex-wrap justify-start w-2/3 mx-auto">
        <div v-for="image in imageList" class="w-20 h-20 m-4 group relative">
          <img :src="image" alt="Pasted Image"
            class="absolute top-0 left-0 w-full h-full rounded-md group-hover:blur-xs group-hover:opacity-50 transition duration-300" />
          <DeleteButtonOver @click="imageList = imageList.filter(i => i !== image)" />
        </div>
      </div>
    </div>
  </div>
</template>

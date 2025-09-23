<script setup>
import { onMounted, ref, nextTick } from 'vue'
import TextMessage from './TextMessage.vue'
import pingSound from '@/assets/ping.wav'
import ConversationHeader from './ConversationHeader.vue'
import DeleteButtonOver from '../reusables/DeleteButtonOver.vue'
import { userStoreData } from '../user/User'
import CancelButton from '../reusables/CancelButton.vue'
import wallpaper from '@/assets/wallpaper.jpg'
import AppHeader from '../reusables/AppHeader.vue'
import { useRouter } from 'vue-router'
import EmojiMenu from '../reusables/EmojiMenu.vue'
import OptionsPicker from '../reusables/OptionsPicker.vue'
import Poll from '../reusables/Poll.vue'

const router = useRouter()
const loading = ref(true)

const emit = defineEmits(['back-to-aoc'])
const users = ref([])

const messageList = ref([])
const newMessage = ref('')
const imageList = ref([])
const responseMessage = ref(null)

const ip = ref('0.0')
const chatContainer = ref(null)
const status = ref('bot')
const showScrollToBottom = ref(false)
const nbRows = ref(1)

let tmpBgColor = "#101828"

const NUMBER_OF_MESSAGES = 15
const base_url = import.meta.env.VITE_BASE_URL

function handleKeyBinding(event) {
  if (newMessage.value === ''){
    nbRows.value = 1
  }

  if (event.key === 'Enter' && (event.ctrlKey || event.shiftKey)) {
    const currentPositionInString = event.target.selectionStart
    event.preventDefault()
    message.value = newMessage.value.slice(0, currentPositionInString) + '\n' + newMessage.value.slice(currentPositionInString)
    nbRows.value += 1
  }
  else if (event.key === 'Enter') {
    event.preventDefault()
    confirmSend(event)
  }
}

function onSelectEmoji(emoji) {
  newMessage.value += emoji.i
}

async function updateResponseMessage(message) {
  responseMessage.value = null
  await nextTick()                //Force rerender
  responseMessage.value = message
}

function isEqual(message1, message2) {
  return message1._id === message2._id && message1.value === message2.value && message1.timestamp === message2.timestamp
}

onMounted(() => {
  console.log("Auth Verification before accessing Chats");
  if (!userStoreData.user) {
    router.push('/login')
    return
  }
  loading.value = false
  
  getLastMessages(NUMBER_OF_MESSAGES, 0)
  setInterval(refreshMessages, 10000) // Refresh messages every 10s to see if new messages have arrived

  if (Math.random() < 0.1) {
    const body = document.body;
    tmpBgColor = "#fae8e9"
    body.style.backgroundImage = `url(${wallpaper})`;
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundSize = 'cover';
  }
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

      if (imageList.value.length >= 4) {
        alert('WHY THE FUCK DO YOU NEED THIS AMOUNT OF IMAGES ??\n NO !')
        return
      }
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
    nbRows.value = 1
  }
}

async function handleScroll() {
  if (chatContainer.value){
    if (chatContainer.value.scrollTop < chatContainer.value.scrollHeight - chatContainer.value.clientHeight - 100) {
      showScrollToBottom.value = true
    }
    else {
      showScrollToBottom.value = false
    }

    if (chatContainer.value.scrollTop === 0) {
      const prevMaxScroll = chatContainer.value.scrollHeight
      status.value = 'top'

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
}

async function getLastMessages(limit, skip) {
  const data = await fetch(`${base_url}/api/getLastMessages?limit=${limit}&skip=${skip}`)
  const text = await data.text()
  const jsonData = JSON.parse(text)
  users.value = jsonData.users

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

function getTheirLastMessage(textList) {
  for (let x = textList.length - 1; x >= 0; x--) {
    if (textList[x].user !== userStoreData.user.username) {
      return textList[x]
    }
  }
  return null
}

async function refreshMessages() {
  console.log("Smart Refresh !");
  const data = await fetch(`${base_url}/api/getLastMessages?limit=${1}`)
  const text = await data.text()
  const jsonData = JSON.parse(text)
  const lastMessage = jsonData.messages

  if (!isEqual(lastMessage[0], messageList.value[messageList.value.length - 1])) {
    const prevTextList = messageList.value
    await getLastMessages(NUMBER_OF_MESSAGES, 0)

    if (!isEqual(getTheirLastMessage(prevTextList), getTheirLastMessage(messageList.value)) ) {
      console.log('NEW TEXT FOUND REFRESHING', lastMessage)
      const audio = new Audio(pingSound)
      audio.play()
    }
    
  }
}

async function sendMessage(message, isPoll = null) {

  const messageData = {
    value: message,
    images: imageList.value,
    timestamp: null,
    user: userStoreData.user.username,
    replyTo: responseMessage.value,
    isEdited: null,
    isPoll: isPoll,
    ip: ip.value
  }

  responseMessage.value = null

  const response = await fetch(`${base_url}/api/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData)
  })
  console.log('Response:', response)
  if (!response.ok) {
    const text = await response.text()
    console.log("text", text);
    const jsonData = JSON.parse(text)
    console.log("jsonData", jsonData);

    console.log('Error response:', status)
    messageData.error = status.error || 'Unknown error'
  }
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
  <div class="flex flex-col h-full w-full gap-4 ">

    <AppHeader />

    <!-- <div :class="`h-20 bg-gradient-to-b from-[${tmpBgColor}] to-[${tmpBgColor}]/5 -my-[2vh] -mb-20 z-10`" /> -->
    <!-- <div ref="chatContainer" :class="['overflow-auto no-scrollbar', responseMessage ? 'h-[60vh]' : 'h-[80vh]']" @scroll="handleScroll"> -->

    <div ref="chatContainer" class="flex-1 overflow-y-auto no-scrollbar" @scroll="handleScroll">
      <div v-if="status == 'top'" class="text-center text-white">
        <i class="fas fa-spinner fa-pulse" />
        <span>Loading previous messages...</span>
      </div>
      <div v-if="status == 'beginning'" class="text-center">
        <ConversationHeader />
      </div>

      <div v-if="userStoreData.user" class="flex flex-col space-y-2">
        <div v-for="message in messageList" :key="message.timestamp">
          <Poll v-if="message.isPoll" :textId="message._id" :pollData="message.isPoll" :pollAuthor="message.user" :currentUsername="userStoreData.user.username" />
          <TextMessage 
            v-else
            @responseMessageTransfer="updateResponseMessage"
            :message="message"
            :user="users[message.user] || {}"
            :deleteMessage="deleteMessage"
            :editMessage="editMessage"
            :isCurrentUser="message.user === userStoreData.user.username" />
        </div>
      </div>
    </div>

    <div class="flex-shrink-0 h-[5vh] flex flex-row items-center justify-center m-2">

      <button v-if="showScrollToBottom" @click="scrollToBottom"
        class="px-3.5 py-3 self-end -ml-21.75 bg-dark-blue text-white rounded-full shadow-lg hover:bg-dark-blue-hover transition">
        <i class="fas fa-arrow-down fa-bounce" />
      </button>



      <div class="h-full rounded-xl w-2/3 bg-blue/0 relative" :class="showScrollToBottom ? 'ml-10' : ''">

        <div v-if="responseMessage" class="text-center h-[15vh] overflow-y-auto no-scrollbar text-xs">
          <CancelButton @click="responseMessage = null" size="10" />
          <TextMessage :message="responseMessage" class="min-w-[90%] max-h-40 overflow-y-auto no-scrollbar"
            :user="users[responseMessage.user] || {}" :deleteMessage="deleteMessage" :editMessage="editMessage"
            :isCurrentUser="true" />
        </div>

        <div class="flex items-center gap-4">
          <textarea v-model="newMessage" type="text" :rows="nbRows" maxlength="500" @paste="handlePaste"
            @keydown="handleKeyBinding" placeholder="Type your message..."
            class="border rounded-md w-full p-3 mx-auto block bg-light-green" />
          <OptionsPicker :sendMessage="sendMessage" />
          <EmojiMenu :onSelectEmoji="onSelectEmoji" />
        </div>

        <div class="flex flex-wrap justify-start w-2/3 mx-auto">
          <div v-for="image in imageList" class="w-20 h-20 m-4 group relative">
            <img :src="image" alt="Pasted Image"
              class="absolute top-0 left-0 w-full h-full rounded-md group-hover:blur-xs group-hover:opacity-50 transition duration-300" />
            <DeleteButtonOver @click="imageList = imageList.filter(i => i !== image)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ImgCarousel from '../reusables/ImgCarousel.vue'

const props = defineProps({
  message: {},
  user: {},
  responseMessageTransfer: Function,
  deleteMessage: Function,
  editMessage: Function,
  isCurrentUser: Boolean
})

console.log("Hi this is a new text", props.message)

const emit = defineEmits(['responseMessageTransfer'])
const hover = ref(false)
const showCarousel = ref(false)
const edit = ref(false)
const messageText = ref(props.message.value)
const editedText = ref(props.message.value)

function formatMessage(text) {
  const regex = /(https?:\/\/[^\s]+)/g
  if ( regex.test(text) ) {
    return text.replace(regex, '<a href="$1" target="_blank" class="text-darker-yellow font-bold underline">$1</a>')
  }
  return text.replace(/\n/g, '<br />')

}

function formatDate(ts) {
  const date = new Date(ts)
  return date.toLocaleString('fr-FR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

function deleteMessage() {
  console.log('Deleting message:', messageText.value)
  props.deleteMessage(messageText.value)
  //messageText.value = 'Removed'
}

function editMessage() {
  console.log('Editing message:', props.message, 'to:', editedText.value)
  const messageId = props.message._id
  const newMessage = {
    ...props.message,
    value: editedText.value,
    isEdited: Date.now()
  }
  props.editMessage(messageId, newMessage)
  messageText.value = editedText.value
  props.message.isEdited = Date.now()
  switchEdit()
}

function switchEdit() {
  edit.value = !edit.value
  if (edit.value) {
    editedText.value = messageText.value
  }
}

function cancelEdit() {
  edit.value = false
  editedText.value = messageText.value
}

</script>

<template>
  <div 
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    :style= "{ backgroundColor: isCurrentUser ? '' : props.user.color }"
    class="w-fit max-w-3/7 my-3 mx-1 rounded-3xl p-4"
    :class="{ 'rounded-br-none ml-auto bg-blue': isCurrentUser, 'rounded-bl-none mr-auto' : !isCurrentUser}"
  >
    <div class="flex justify-between items-center text-center gap-x-2">
      <div class="flex items-center gap-x-2">
        <img v-if="props.user && props.user.image" :src="props.user.image" class="w-10 h-10 rounded-full object-cover" />
        <div v-else class="w-6 h-6 rounded-full bg-gray">
          <span class="text-white text-xs flex items-center justify-center w-full h-full">
            <i class="fas fa-user" />
          </span>
        </div>

        <span :class="hover ? '' : 'mr-6'"> 
          {{ props.message.user }}
        </span>
        <span v-if="hover" @click="emit('responseMessageTransfer', props.message)">
          <i class="min-w-4 min-h-4 fas fa-reply text-xs text-gray-hover hover:text-yellow cursor-pointer" />
        </span>
      </div>

      <div class="flex text-xs gap-2">
        <span>
          {{ formatDate(message.timestamp) }}
        </span>
        <button v-if="isCurrentUser" @click="switchEdit" class="text-gray-hover hover:text-light-gray">
          <i class="fas fa-edit" />
        </button>
        <button v-if="isCurrentUser" @click="deleteMessage" class="text-gray-hover hover:text-light-gray">
          <i class="fas fa-trash" />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 justify-self-end gap-4">
      <img v-for="image in message.images"
        :src="image"
        @click="showCarousel = message.images.indexOf(image)+1"
        class="w-auto h-auto max-w-[250px] mx-auto rounded-md" />
    </div>

    <div v-if="edit">
      <input v-model="editedText" @keydown.esc="cancelEdit" @keypress.enter="editMessage" :size="editedText.length"
        class="w-full text-md focus:outline-none" />
      <span class="text-[9px] text-center block">
        <strong>Escape</strong>
        to cancel,
        <strong>Enter</strong>
        to save
      </span>
    </div>

    <div v-else class="text-md">
      <span v-html="formatMessage(messageText)" class="min-w-full break-all" />
      <div v-if="props.message.error != null" class="text-xs">
        <span class="text-[9px] text-center font-bold block text-red">
          (Error at {{ props.message.error }})</span>
      </div>
      <div v-if="props.message.isEdited != null" class="text-xs">
        <span class="text-[9px] text-center font-bold block text-yellow">
          (Edited at {{ formatDate(props.message.isEdited) }})</span>
      </div>
    </div>

    <!-- Img popup -->
    <ImgCarousel v-if="showCarousel" :images="props.message.images" @close="showCarousel = false" :startingIndex="showCarousel" />
  </div>
</template>

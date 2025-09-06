<script setup>
import { ref } from 'vue'
import CancelButton from '../reusables/CancelButton.vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  deleteMessage: Function,
  editMessage: Function,
  debug: String,
  isCurrentUser: Boolean
})

const fullImage = ref(null)
const edit = ref(false)
const messageText = ref(props.message.value)
const editedText = ref(props.message.value)

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
    _id: messageId,
    value: editedText.value,
    images: props.message.images,
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

function setPopupImage(image) {
  fullImage.value = image
}
</script>

<template>
  <div
    class="h-fit max-w-1/2 my-3 mx-1 rounded-3xl p-4"
    :class="{
      'rounded-br-none ml-auto bg-blue ': isCurrentUser,
      'rounded-bl-none mr-auto bg-light-blue ': !isCurrentUser
    }"
  >
    <div class="flex justify-end">
      <span class="text-xs">
        {{ formatDate(message.timestamp) }}
      </span>
      <button v-if="isCurrentUser" @click="switchEdit" class="ml-2 text-xs text-gray-hover hover:text-light-gray">
        <i class="fas fa-edit"></i>
      </button>
      <button v-if="isCurrentUser" @click="deleteMessage" class="ml-2 text-xs text-gray-hover hover:text-light-gray">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="flex items-center mb-2">
      <img v-for="image in message.images" :src="image" @click="setPopupImage(image)" class="w-auto h-auto rounded-md object-contain mr-2" />
    </div>
    <div v-if="edit">
      <input v-model="editedText" @keydown.esc="cancelEdit" @keypress.enter="editMessage" :size="editedText.length" class="w-full text-md focus:outline-none" />
      <span class="text-[9px] text-center block">
        <strong>Escape</strong>
        to cancel,
        <strong>Enter</strong>
        to save
      </span>
    </div>
    <div v-else class="text-md">
      <span>
        {{ messageText }}
      </span>
      <div v-if="props.message.isEdited != null" class="text-xs">
        <span class="text-[9px] text-center font-bold block text-yellow">(Edited at {{ formatDate(props.message.isEdited) }})</span>
      </div>
    </div>

    <!-- Img popup -->
    <div v-if="fullImage" @click="setPopupImage(null)" class="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
      <img :src="fullImage" @click.stop class="max-w-full max-h-full rounded-md" />
      <CancelButton :onClick="() => (fullImage = null)" size="10" offset="4" />
    </div>
  </div>
</template>

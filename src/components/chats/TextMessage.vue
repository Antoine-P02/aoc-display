<script setup>
import { defineProps, ref } from 'vue'

const fullImage = ref(null)

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isCurrentUser: Boolean
})

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
  console.log('Delete message:', props.message)
  // Implement delete logic here
}

function editMessage() {
  console.log('Edit message:', props.message)
  // Implement edit logic here
}

function setPopupImage(image) {
  fullImage.value = image
}
</script>

<template>
  <div
    class="h-fit max-w-[524px] m-3 rounded-3xl p-4"
    :class="{
      'rounded-br-none ml-auto bg-blue-400 ': isCurrentUser,
      'rounded-bl-none mr-auto bg-blue-200 ': !isCurrentUser
    }"
  >
    <div class="flex justify-end">
      <span class="text-xs">
        {{ formatDate(message.timestamp) }}
      </span>
      <!-- <button 
            v-if="isCurrentUser" 
            @click="editMessage" 
            class="ml-2 text-xs text-gray-600 hover:text-gray-800">
            <i class="fas fa-edit"></i>
        </button>
        <button 
            v-if="isCurrentUser" 
            @click="deleteMessage" 
            class="ml-2 text-xs text-gray-600 hover:text-gray-800">
            <i class="fas fa-trash"></i>
        </button> -->
    </div>
    <div class="flex items-center mb-2">
      <img v-for="image in message.images" :src="image" @click="setPopupImage(image)" class="w-auto h-auto max-w-[500px] max-h-[500px] rounded-md object-contain mr-2" />
    </div>
    <span class="text-sm">{{ message.value }}</span>

    <!-- Fullscreen modal -->
    <div v-if="fullImage" class="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <img :src="fullImage" class="max-w-full max-h-full rounded-md" />
      <button @click="setPopupImage(null)" class="absolute top-4 right-4 text-white text-2xl">&times;</button>
    </div>
  </div>
</template>

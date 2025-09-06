<script setup>
import placeholder from '@/assets/profile.png'
import { userStoreData } from '../user/User'

const emit = defineEmits(['logout'])

const user = userStoreData.user
console.log('UserTab user:', user)

function logout(event) {
  event.preventDefault()
  const token = sessionStorage.getItem('token')
  if (token) {
    sessionStorage.removeItem('token')
  }
  emit('logout')
}
</script>

<template>
  <div class="bg-green h-full w-full items-center gap-4 rounded-lg p-2">
    <div class="grid grid-cols-4 gap-x-4">
      <img :src="placeholder" alt="Profile Picture" class="w-full max-w-16 max-h-16 col-span-1 rounded-full object-cover" />
      <div class="col-span-3">
        <span class="text-white font-bold text-lg truncate block">{{ user.username }}</span>
        <div class="flex items-center justify-between gap-2">
          <p class="text-white text-sm">{{ user.location }}</p>
          <span @click="logout">
            <i class="fas fa-sign-out-alt text-white hover:text-gray cursor-pointer" />
            <!--
            Might be useful wit socket.io
            <span class="text-white text-xs">Online</span>
            --></span>
        </div>
      </div>
    </div>
  </div>
</template>

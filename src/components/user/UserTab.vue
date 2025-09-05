<script setup>
import placeholder from '@/assets/profile.png'

const emit = defineEmits(['logout'])

const member = {
  username: 'Username',
  location: 'Location'
}

function logout(event) {
  event.preventDefault();
  const token = sessionStorage.getItem('token')
  if ( token ) {
    sessionStorage.removeItem('token')
  }
  emit('logout');

}

</script>

<template>
  <div class="bg-green h-full w-full items-center gap-4 rounded-lg p-2">
    <div class="flex items-center space-x-4">
      <img :src="placeholder" alt="Profile Picture" class="w-12 h-12 rounded-full object-cover" />
      <div>
        <h2 class="text-white font-bold text-lg">{{ member.username }}</h2>
        <div class="flex items-center justify-between gap-2">
          <p class="text-white text-sm">{{ member.location }}</p>
          <span @click="logout">
            <i class="fas fa-sign-out-alt text-white hover:text-gray cursor-pointer" />
            <!--
          Might be useful wit socket.io
          <span class="text-white text-xs">Online</span>
          -->
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import placeholder from '@/assets/profile.png'

const member = {
  username: 'AntoineP02',
  location: 'France'
}
</script>

<template>
  <div class="bg-green-400 h-full w-full items-center gap-4 rounded-lg p-2">
    <div class="flex items-center space-x-4">
      <img :src="placeholder" alt="Profile Picture" class="w-12 h-12 rounded-full object-cover" />
      <div>
        <h2 class="text-white font-bold text-lg">{{ member.username }}</h2>
        <p class="text-white text-sm">{{ member.location }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  member: Object,
  loading: Boolean,
  error: String,
  mode: String
})

const base_url = import.meta.env.VITE_BASE_URL

async function runShit() {
  console.log('test launch')
  await fetch(`${base_url}/api/db`)
  console.log('test end')
}

async function getDb() {
  console.log('test get db')
  const response = await fetch(`${base_url}/api/get-db`)
  const data = await response.json()
  console.log('test end', data)
}

async function closeDb() {
  console.log('test close')
  await fetch(`${base_url}/api/close-db`)
  console.log('test end')
}

const emit = defineEmits(['update:mode'])
</script>

<template>
  <div class="justify-center w-full h-full gap-10">
    <div class="bg-gray text-white rounded-xl p-6 shadow-lg">
      <div class="flex flex-col gap-6 h-40">
        <h2 class="text-2xl font-extrabold text-yellow text-center">Advent of Code 2024 Completion</h2>
        <div class="flex flex-col w-full">
          <div class="flex flex-row items-center gap-2">
            <span class="text-base text-light-gray">Username:</span>
            <span class="text-xl font-bold">{{ member.name }}</span>
          </div>
        </div>
        <div class="flex justify-end items-center gap-2">
          <span class="font-semibold text-white">Problems Solved</span>
          <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow text-black">★ {{ member.stars }}</span>
        </div>
      </div>
    </div>

    <div class="flex gap-2 mt-4 mb-10">
      <button :class="['px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap', props.mode === 'aoc' ? 'bg-dark-green text-white shadow-md' : 'bg-gray text-light-gray hover:bg-gray-hover']" @click="emit('update:mode', 'aoc')">Complete Progress</button>
      <button :class="['px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap', props.mode === 'feed' ? 'bg-dark-green text-white shadow-md' : 'bg-gray text-light-gray hover:bg-gray-hover']" @click="emit('update:mode', 'feed')">Daily Feed</button>
      <button :class="['px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap', props.mode === 'chat' ? 'bg-dark-green text-white shadow-md' : 'bg-gray text-light-gray hover:bg-gray-hover']" @click="emit('update:mode', 'login')">Chat</button>
      <!-- <button :class="['px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap', props.mode === 'game' ? 'bg-dark-green text-white shadow-md' : 'bg-gray text-light-gray hover:bg-gray-hover']" @click="emit('update:mode', 'game')">Breakout</button> -->
      
    </div>
  </div>
</template>

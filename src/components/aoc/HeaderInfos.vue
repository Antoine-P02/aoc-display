<script setup>
const props = defineProps({
  member: Object,
  loading: Boolean,
  error: String,
  mode: String
})

const base_url = import.meta.env.VITE_BASE_URL

async function runShit(){
  console.log("test launch");
  await fetch(`${base_url}/api/db`);
  console.log("test end");
}

async function getDb(){
  console.log("test get db");
  const response = await fetch(`${base_url}/api/get-db`);
  const data = await response.json();
  console.log("test end", data);
}

async function closeDb(){
  console.log("test close");
  await fetch(`${base_url}/api/close-db`);
  console.log("test end");
}

const emit = defineEmits(['update:mode'])
</script>

<template>
  <div class="grid grid-cols-[10%_75%_10%] justify-center bg-gray-900 w-full h-full gap-10">
    <img src="/vite.svg" class="h-32 w-32 transition-all hover:drop-shadow-[0_0_2em_#646cffaa]" alt="Vite logo" />

    <div class="mt-20">
      <div class="bg-gray-700 text-white rounded-xl p-6 shadow-lg">
        <div class="flex flex-col gap-6 h-40">
          <h2 class="text-2xl font-extrabold text-yellow-400 text-center">Advent of Code 2024 Completion</h2>
          <div class="flex flex-col w-full">
            <div class="flex flex-row items-center gap-2">
              <span class="text-base text-gray-400">Username:</span>
              <span class="text-xl font-bold">{{ member.name }}</span>
            </div>
            <!-- <div class="flex items-center justify-center gap-4">
              <button 
                class="px-4 py-2.5 rounded-lg font-semibold transition-all bg-red-600 text-white hover:bg-blue-500 shadow-md"
                @click="runShit">
                Run
              </button>
              
              <button 
                class="px-4 py-2.5 rounded-lg font-semibold transition-all bg-red-600 text-white hover:bg-blue-500 shadow-md"
                @click="getDb">
                Get DB
              </button>

              <button 
                class="px-4 py-2.5 rounded-lg font-semibold transition-all bg-red-600 text-white hover:bg-blue-500 shadow-md"
                @click="closeDb">
                Close
              </button>
            </div> -->
          </div>
          <div class="flex justify-end items-center gap-2">
            <span class="font-semibold text-white">Problems Solved</span>
            <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-500 text-gray-900">★ {{ member.stars }}</span>
          </div>
        </div>
      </div>

      <div class="flex gap-2 mt-4 mb-10">
        <button :class="['px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap', props.mode === 'progress' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']" @click="emit('update:mode', 'progress')">Complete Progress</button>
        <button :class="['px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap', props.mode === 'feed' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']" @click="emit('update:mode', 'feed')">Daily Feed</button>
        <button :class="['px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap', props.mode === 'chat' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']" @click="emit('update:mode', 'chat')">Chat</button>
      </div>
    </div>

    <img src="/vue.svg" class="h-32 w-32 transition-all hover:drop-shadow-[0_0_2em_#42b883aa]" alt="Vue logo" />
  </div>
</template>

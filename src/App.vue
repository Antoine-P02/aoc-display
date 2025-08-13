<script setup>
import AocLeaderboard from './components/AocLeaderboard.vue'
</script>

<template>  
  <div class="bg-gray-900 w-full h-full">
    <header class="flex flex-grid justify-center gap-10 p-4 ">

      <img src="/vite.svg" class="h-32 w-32 transition-all hover:drop-shadow-[0_0_2em_#646cffaa]" alt="Vite logo" />
        
      <div class="mt-20">
        <AocLeaderboard />
      </div>
        
      <img src="./assets/vue.svg" class="h-32 w-32 transition-all hover:drop-shadow-[0_0_2em_#42b883aa]" alt="Vue logo" />
    </header>
  </div>
</template>

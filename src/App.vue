<script setup>
</script>

<template>
  <div class="bg-gray-900 text-gray-850 w-full h-full p-10">
    <!-- <p><strong>Current route path:</strong> {{ $route.fullPath }}</p> -->
    <nav class="flex space-x-4">
      <!-- <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/aoc">aoc</RouterLink> -->
      <RouterLink to="/chats">chats</RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
    
  </div>
</template>

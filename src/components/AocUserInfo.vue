<template>
  <div>
    <h2>Advent of Code User Info</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <pre>{{ userInfo }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const error = ref(null)
const userInfo = ref('')

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetch('http://localhost:3001/aoc-user')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    userInfo.value = await response.text()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

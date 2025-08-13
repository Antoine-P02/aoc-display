<script setup>
import { ref, onMounted, computed } from 'vue'
import HeaderInfos from './components/HeaderInfos.vue'
import Tab from './components/Tab.vue'

const loading = ref(true)
const error = ref(null)
const member = ref({})
const days = Array.from({ length: 25 }, (_, i) => (i + 1))
const tab = ref('days')

const feed = computed(() => {
  if (!member.value.completion_day_level) return []
  const items = []
  for (const day in member.value.completion_day_level) {
    for (const part in member.value.completion_day_level[day]) {
      const info = member.value.completion_day_level[day][part]
      items.push({
        day,
        part,
        get_star_ts: info.get_star_ts,
        star_index: info.star_index
      })
    }
  }
  return items.sort((a, b) => b.get_star_ts - a.get_star_ts)
})

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const apiUrl = isLocalhost ? 'http://localhost:3001/aoc-user' : '/api/aoc-user'
    
    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    console.log("debug", data);
    // Only show the current user
    const id = data.owner_id
    member.value = data.members[id]
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <HeaderInfos 
    :member="member" 
    :loading="loading" 
    :error="error" 
    :tab="''"
  />
  <Tab
    :days="days"
    :tab="tab"
    :member="member"
  />
</template>

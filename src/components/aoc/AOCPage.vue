<script setup>
import HeaderInfos from './HeaderInfos.vue'
import Feed from './Feed.vue'
import Completion from './Completion.vue'

import { ref, onMounted, computed } from 'vue'
import ChatPage from '../chats/ChatPage.vue'

const base_url = import.meta.env.VITE_BASE_URL

const loading = ref(true)
const error = ref(null)
const member = ref({})
const days = Array.from({ length: 25 }, (_, i) => i + 1)
const mode = ref('progress')

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const apiUrl = `${base_url}/api/aoc-user`

    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    console.log('debug', data)
    // Only show the current user
    const id = data.owner_id
    member.value = data.members[id]
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const props = defineProps({
  member: Object,
  loading: Boolean,
  error: String,
  mode: String
})

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
</script>

<template>
  <div v-if="mode === 'feed'">
    <HeaderInfos :member="member" :loading="loading" :error="error" :mode="mode" @update:mode="mode = $event" />
    <Feed :feed="feed" />
  </div>
  <div v-else-if="mode === 'progress'">
    <HeaderInfos :member="member" :loading="loading" :error="error" :mode="mode" @update:mode="mode = $event" />
    <Completion :days="days" :mode="mode" :member="member" />
  </div>
  <div v-else>
    <ChatPage :member="member" @back-to-aoc="mode = 'progress'" />
  </div>
</template>

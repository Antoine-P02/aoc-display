<script setup>
import HeaderInfos from './HeaderInfos.vue'
import Feed from './Feed.vue'
import Completion from './Completion.vue'

import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LandingPage from '../chats/LandingPage.vue'

const route = useRoute()
const router = useRouter()

const base_url = import.meta.env.VITE_BASE_URL

const loading = ref(true)
const error = ref(null)
const member = ref({})
const days = Array.from({ length: 25 }, (_, i) => i + 1)
const mode = ref('aoc')

// Set mode based on current route
const setModeFromRoute = () => {
  if (route.path === '/feed') {
    mode.value = 'feed'
  } else if (route.path === '/chat') {
    mode.value = 'chat'
  } else {
    mode.value = 'aoc'
  }
}

watch(() => route.path, () => {
  setModeFromRoute()
}, { immediate: true })


const handleModeUpdate = (newMode) => {
  router.push(`/${newMode}`)
  return
  mode.value = newMode
  if (newMode === 'feed') {
    router.push('/feed')
  } else if (newMode === 'chat') {
    router.push('/chat')
  } else {
    router.push('/aoc')
  }
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const apiUrl = `${base_url}/api/aoc-user`

    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    // Only show the current user
    const id = data.owner_id
    member.value = data.members[id]
  } 
  catch (e) {
    error.value = e.message
  } 
  finally {
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
  <div v-if="mode === 'feed'" class="pb-10">
    <HeaderInfos :member="member" :loading="loading" :error="error" :mode="mode" @update:mode="handleModeUpdate" />
    <Feed :feed="feed" />
  </div>
  <div v-else-if="mode === 'aoc'" class="pb-10">
    <HeaderInfos :member="member" :loading="loading" :error="error" :mode="mode" @update:mode="handleModeUpdate" />
    <Completion :days="days" :mode="mode" :member="member" />
  </div>
  <div v-else>
    <LandingPage :member="member" @back-to-aoc="handleModeUpdate('aoc')" />
  </div>
</template>

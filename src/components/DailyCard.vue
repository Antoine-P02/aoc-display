<script setup>

import Star from './Star.vue'

defineProps({
  dayNumber: {
    type: Number,
    required: true
  },
  part1: {
    type: Object,
    default: null
  },
  part2: {
    type: Object,
    default: null
  }
})

function formatTs(ts, locale = 'en-GB') {
  const date = new Date(ts * 1000)

  const datePart = date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  const timePart = date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(':', 'h') // formats hh:mm:ss → hhmm:ss style

  return `${datePart} at ${timePart}`
}


</script>

<template>

    <div class="font-bold text-lg text-green-600 dark:text-green-400 mb-3">
      Day {{ dayNumber }}
    </div>

  <div class="space-y-2">
    <div class="flex items-center gap-2">
      <Star :isFilled="!!part1" />
      <span class="text-sm text-gray-600 dark:text-gray-400">
        Part 1
      </span>
      <span
        v-if="part1" 
        class="text-xs text-gray-500 dark:text-gray-500 ml-auto"
      >
        {{ formatTs(part1.get_star_ts) }}
      </span>
    </div>
    
    <div class="flex items-center gap-2">
      <Star :isFilled="!!part2" />
      <span class="text-sm text-gray-600 dark:text-gray-400">
        Part 2
      </span>
      <span
        v-if="part2" 
        class="text-xs text-gray-500 dark:text-gray-500 ml-auto"
      >
        {{ formatTs(part2.get_star_ts) }}
      </span>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  feed: {
    type: Array,
    required: true
  }
})

function formatTs(ts, locale = 'en-GB') {
  const date = new Date(ts * 1000)

  const datePart = date.toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })

  const timePart = date
    .toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    .replace(':', 'h')

  return `${datePart} at ${timePart}`
}

function getLinkToItem(item) {
  return `https://adventofcode.com/2024/day/${item.day}`
}

import { ref } from 'vue'
const hover = ref(Array(props.feed.length).fill(false))

</script>

<template>
  <div class="w-full justify-center mx-auto bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
    <div class="p-4 border-b border-gray-700">
      <h3 class="font-semibold text-white">Completion History</h3>
    </div>

    <div class="relative flex flex-col px-8 py-6">
      <!-- Vertical line -->
      <div class="absolute left-9.75 top-3 bottom-0 w-1 bg-amber-600"></div>

      <div
        v-for="(item, index) in props.feed"
        :key="item.day + '-' + item.part + '-' + item.get_star_ts"
        class="my-2 relative flex"
      >
        <!-- Circle “station” -->
        <div class="flex-shrink-0 w-4.5 h-4.5 rounded-full bg-green-400 mt-16 mr-4" />

        <!-- Original content box -->
        <div class="flex-1 grid grid-cols-3 gap-4 bg-gray-700 rounded-lg p-10 shadow">
          <span class="text-lg text-green-400 font-medium flex items-center">{{ formatTs(item.get_star_ts) }}</span>
          <div class="flex flex-col gap-2 text-gray-100 font-semibold text-md">
            <span class="flex items-center">
              Day {{ item.day }}
            </span>
            <span class="flex items-center">
              Part {{ item.part }} Completed
            </span>
          </div>
          <span class="text-md text-amber-400 font-mono flex items-center justify-end"
            @mouseenter="hover[index] = true"
            @mouseleave="hover[index] = false"
          >
            <a :href="getLinkToItem(item)" target="_blank" rel="noopener noreferrer" class="underline">View on AoC</a>
            <iframe v-if="hover[index]" :src="getLinkToItem(item)" class="w-200 h-100 absolute overflow-scroll rounded-lg z-10" title="AoC Link" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

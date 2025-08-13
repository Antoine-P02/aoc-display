<script setup>
defineProps({
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
</script>

<template>
  <div class="w-[75%] justify-center mx-auto bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
    <div class="p-4 border-b border-gray-700">
      <h3 class="font-semibold text-white">Completion History</h3>
    </div>

    <div class="flex flex-col px-8 py-6">
      <!-- <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600" style="z-index:0" /> -->
      <div v-for="item in feed" :key="item.day + '-' + item.part + '-' + item.get_star_ts" class="my-2">
        <div class="flex-1 grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-10 shadow">
          <span class="text-sm text-green-600 dark:text-green-400 font-medium flex items-center">{{ formatTs(item.get_star_ts) }}</span>
          <span class="text-gray-100 font-semibold flex items-center">Day {{ item.day }}, Part {{ item.part }} completed</span>
          <span class="text-sm text-gray-400 font-mono flex items-center justify-end">
            <a :href="getLinkToItem(item)" target="_blank" rel="noopener noreferrer" class="underline">View on AoC</a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

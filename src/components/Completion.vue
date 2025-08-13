<script setup>
import DailyCard from './DailyCard.vue'

defineProps({
  member: {
    type: Object,
    required: true
  },
  days: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      <div v-for="day in days" :key="day" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <DailyCard :dayNumber="day" :part1="member.completion_day_level?.[day]?.[1] || null" :part2="member.completion_day_level?.[day]?.[2] || null" />
      </div>
    </div>
  </div>
</template>

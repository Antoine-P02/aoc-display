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
  },
})
</script>

<template>
  <div class="mt-8">
    <div class="space-y-4">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
      >
        <div
          v-for="day in days"
          :key="day"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
        >
          <DailyCard
            :dayNumber="day"
            :part1="member.completion_day_level?.[day]?.[1] || null"
            :part2="member.completion_day_level?.[day]?.[2] || null"
          />
        </div>
      </div>
    </div>

    <!-- <div v-else-if="tab === 'feed'" class="space-y-3">
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            Completion History
          </h3>
        </div>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="item in feed"
            :key="item.day + '-' + item.part + '-' + item.get_star_ts"
            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="flex flex-col gap-2">
              <span
                class="text-sm text-green-600 dark:text-green-400 font-medium"
              >
                {{ formatTs(item.get_star_ts) }}
              </span>
              <span class="text-gray-900 dark:text-gray-100 flex-1">
                Day {{ item.day }}, Part {{ item.part }} completed
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400 font-mono">
                #{{ item.star_index }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

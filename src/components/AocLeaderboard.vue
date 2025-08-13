<template>

  <div class="mt-8">
    <div>
      <div class="bg-gray-800 dark:bg-gray-700 text-white rounded-xl p-6 shadow-lg">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
              <span class="text-xl font-bold">{{ member.name }}</span>
              <span class="text-base text-gray-300">#{{ member.id }}</span>
            </div>
            <div class="flex gap-3">
              <span class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-500 text-gray-900">
                ★ {{ member.stars }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button 
            :class="[
              'px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap',
              tab === 'days' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            ]" 
            @click="tab='days'"
          >
            Daily Progress
          </button>
          <button 
            :class="[
              'px-4 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap',
              tab === 'feed' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            ]" 
            @click="tab='feed'"
          >
            Completion Feed
          </button>
        </div>
        </div>

        <div v-if="tab==='days'" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            <div 
              v-for="day in days" 
              :key="day" 
              class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
            >
              <div class="font-bold text-lg text-green-600 dark:text-green-400 mb-3">Day {{ day }}</div>
              <div class="space-y-2">
                <div v-for="part in ['1', '2']" :key="part" class="flex items-center gap-2">
                  <span 
                    v-if="member.completion_day_level?.[day]?.[part]" 
                    class="text-yellow-500 text-lg"
                  >
                    ⭐
                  </span>
                  <span v-else class="text-gray-400 text-lg">☆</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">Part {{ part }}</span>
                  <span 
                    v-if="member.completion_day_level?.[day]?.[part]" 
                    class="text-xs text-gray-500 dark:text-gray-500 ml-auto"
                  >
                    {{ formatTs(member.completion_day_level[day][part].get_star_ts) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="tab==='feed'" class="space-y-3">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-gray-900 dark:text-white">Completion History</h3>
            </div>
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div 
                v-for="item in feed" 
                :key="item.day + '-' + item.part + '-' + item.get_star_ts" 
                class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div class="flex flex-col gap-2">
                  <span class="text-sm text-green-600 dark:text-green-400 font-medium">
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
        </div>
      </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const loading = ref(true);
const error = ref(null);
const member = ref({});
const days = Array.from({ length: 25 }, (_, i) => (i + 1).toString());
const tab = ref('days');

function formatTs(ts) {
  if (!ts) return '';
  const date = new Date(ts * 1000);
  return date.toLocaleString();
}

const feed = computed(() => {
  if (!member.value.completion_day_level) return [];
  const items = [];
  for (const day in member.value.completion_day_level) {
    for (const part in member.value.completion_day_level[day]) {
      const info = member.value.completion_day_level[day][part];
      items.push({
        day,
        part,
        get_star_ts: info.get_star_ts,
        star_index: info.star_index
      });
    }
  }
  // Descending order by completion time
  return items.sort((a, b) => b.get_star_ts - a.get_star_ts);
});

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch('http://localhost:3001/aoc-user');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    // Only show the current user
    const id = data.owner_id;
    member.value = data.members[id];
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* All styling is now handled by Tailwind CSS classes */
</style>
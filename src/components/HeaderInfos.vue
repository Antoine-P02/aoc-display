<script setup>
defineProps({
  member: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  tab: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="bg-gray-900 w-full h-full">
    <header class="flex flex-grid justify-center gap-10 p-4">
      <img
        src="/vite.svg"
        class="h-32 w-32 transition-all hover:drop-shadow-[0_0_2em_#646cffaa]"
        alt="Vite logo"
      />

      <div class="mt-20">
        <div
          class="bg-gray-800 dark:bg-gray-700 text-white rounded-xl p-6 shadow-lg"
        >
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <span class="text-xl font-bold">{{ member.name }}</span>
              <span class="text-base text-gray-300">#{{ member.id }}</span>
            </div>
            <div class="flex gap-3">
              <span
                class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-500 text-gray-900"
              >
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
            @click="tab = 'days'"
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
            @click="tab = 'feed'"
          >
            Completion Feed
          </button>
        </div>
      </div>

      <img
        src="/vue.svg"
        class="h-32 w-32 transition-all hover:drop-shadow-[0_0_2em_#42b883aa]"
        alt="Vue logo"
      />
    </header>
  </div>
</template>

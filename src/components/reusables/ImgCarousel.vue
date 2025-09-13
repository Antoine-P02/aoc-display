<script setup>
import { onMounted, ref } from 'vue'
import CancelButton from './CancelButton.vue'

const props = defineProps({
  startingIndex: {},
  images: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close'])
const currentIndex = ref(props.startingIndex -1)

onMounted(() => {
  window.addEventListener('keydown', bindings)
})


function bindings(event) {
  if (event.key === "Escape") {
    emit('close')
  }
  else if (event.key === "ArrowLeft") {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
  }
  else if (["ArrowRight", "Enter"].includes(event.key)) {
    if (currentIndex.value < props.images.length - 1) {
        currentIndex.value++;
    }
  }
}

</script>

<template>
    <div 
      @click="emit('close')"
      class="fixed inset-0 bg-black/90 flex justify-center items-center text-white gap-4 z-50">
        <span @click.stop v-if="currentIndex > 0"
            @click="currentIndex--"
            class="">
            <i class="fas fa-chevron-left text-4xl" />
        </span>
        <img :src="props.images[currentIndex]" @click.stop class="max-w-[75%] max-h-full rounded-md" />
        <CancelButton  size="10" offset="40" />
        <span @click.stop v-if="currentIndex < props.images.length - 1 " 
            @click="currentIndex++"
            class="">
            <i class="fas fa-chevron-right text-4xl" />
        </span>
    </div>
</template>
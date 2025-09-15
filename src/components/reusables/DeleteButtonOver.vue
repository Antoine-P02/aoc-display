<script setup>
const props = defineProps({
  onClick: {},
  top: {
    default: true
  },
  right: {
    default: true
  },
  cond: {
    default: true
  }
})
</script>

<template>
  <button @click="props.onClick" v-if="props.cond" class="absolute top-0 left-0 w-full h-full z-10 text-red opacity-0 group-hover:opacity-100 transition">
    <i class="fas fa-trash" />
  </button>
</template>

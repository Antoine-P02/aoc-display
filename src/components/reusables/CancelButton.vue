<script setup>
import { defineProps } from 'vue'

//const props = defineProps(['onClick', 'size'])

const props = defineProps({
  onClick: {},
  title: {},
  size: {
    default: 20
  },
  top: {
    default: true
  },
  right: {
    default: true
  },
  offset: {
    default: 4
  },
  rounding: {
    default: 20
  },
  cond: {
    default: true
  }
})
</script>

<template>
  <button v-if="props.cond" 
    :class="[`absolute ${props.top ? 'top' : 'bottom'}-${props.offset} ${props.right ? 'right' : 'left'}-${props.offset} bg-red hover:bg-red-hover flex items-center justify-center`]" 
    :style="`border-radius: ${props.rounding}%; width: ${props.size * 4}px; height: ${props.size * 4}px;`"
    @click="props.onClick" 
    :title="props.title"
  >
    <i class="fas fa-times text-white" :style="`font-size: ${props.size * 1.75}px`" />
  </button>
</template>

Still creates :

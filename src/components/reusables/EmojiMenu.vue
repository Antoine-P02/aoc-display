<script setup>
import EmojiPicker from 'vue3-emoji-picker'
import { ref } from 'vue'

const showEmojiPicker = ref(false)

defineProps({
    onSelectEmoji: Function
})


</script>

<template>
    <div 
        @click="showEmojiPicker = !showEmojiPicker"
        class="min-w-12 min-h-12 text-center text-xl font-bold flex justify-center items-center rounded bg-light-green"
    >
        <EmojiPicker
            @click.stop v-if="showEmojiPicker"
            class="absolute bottom-16 right-4"
            :native="true"
            @select="onSelectEmoji"
            :disable-skin-tones="true"
            :disabled-groups="['animals_nature', 'food_drink', 'activities', 'travel_places', 'objects', 'symbols', 'flags']"
        />
        <span class=" rounded-full text-xl">
            🖕
        </span>
    </div>
</template>
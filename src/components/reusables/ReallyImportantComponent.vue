<script setup>
import vid from '@/assets/reallyImportantVideo.mp4'
import { ref, onMounted } from 'vue'

const videoRef = ref(null)

const props = defineProps({
    switchReallyImportant: {}
})

const emit = defineEmits(['ReallyImportantFeatureEnded'])

</script>

<template>
    <div v-if="props.switchReallyImportant"
        class="absolute top-0 left-0 w-full h-full bg-black/90 z-10">
        <video
            ref="videoRef"
            :src="vid"
            autoplay
            class="w-full h-full object-contain"
            @ended="emit('ReallyImportantFeatureEnded')"
            @loadedmetadata="videoRef.volume = 0.8"
        >
            Your browser does not support the video tag.
        </video>
    </div>
</template>

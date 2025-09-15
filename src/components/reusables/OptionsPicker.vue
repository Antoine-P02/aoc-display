<script setup>
import { ref } from 'vue'
import PollMaker from './PollMaker.vue'

const developOptions = ref(false)
const pollMaker = ref(false)
defineProps({
    sendMessage: Function
});

function createPoll(){
    pollMaker.value = true
    developOptions.value = false
}

</script>

<template>
    <div 
        @click="developOptions = !developOptions"
        class="min-w-12 min-h-12 text-center relative flex justify-center items-center rounded bg-light-green cursor-pointer "
    >
        <div 
            v-if="developOptions"
            @click.stop
            class="w-[300%] rounded text-sm text-center h-auto p-2 bottom-12 m-2 bg-blue absolute"
        >
            <span @click="createPoll">
                Create a poll
            </span>
        </div>
        <span class=" rounded-full font-bold text-xl">
            +
        </span>
        <PollMaker v-if="pollMaker" @click.stop @closePollMaker="pollMaker = false" :sendMessage="sendMessage"/>
    </div>
</template>
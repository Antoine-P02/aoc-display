<script setup>
import { ref } from 'vue'
import AppHeader from '../reusables/AppHeader.vue'

const isLoggedIn = ref(true) // Default to true for demo purposes

</script>

<template>
    <div class="flex flex-col h-full w-full gap-4 ">
        <AppHeader :isLoggedIn="isLoggedIn" :currentUser="{ username: 'DemoUser', image: '' }" />

        <div class="flex-1 overflow-y-auto no-scrollbar bg-red">
            <div class="flex flex-col">
                <div v-for="i in 50" :key="i" class="p-1 m-4 max-w-1/2 rounded-md"
                    :class="i % 2 === 0 ? 'bg-green-200 self-end' : 'bg-blue-200 self-start'" style="width: 80%;">
                    Msg {{ i }}
                </div>
            </div>
        </div>

        <div class="flex-shrink-0 bg-gray-300 h-[20vh]">
            <div class="flex justify-between items-center px-2">
                <div>
                    Height: 20vh
                </div>


            </div>
        </div>
    </div>
</template>


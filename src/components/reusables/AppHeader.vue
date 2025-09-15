<script setup>
import { RouterLink } from 'vue-router'
import UserTab from '../user/UserTab.vue'
import { userStoreData } from '../user/User'
import PatchNotesPopup from './PatchNotesPopup.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showPatchNotes = ref(false)

function handleLogout() {
    userStoreData.user = null
    router.push('/login')
}
</script>

<template>
    <div class=" grid grid-cols-3 gap-4 mt-0 flex-shrink-0 h-fit m-6 mb-10">
        <div class="flex justify-center rounded-lg h-full w-full gap-x-4">
            <button @click="$router.push('/aoc')"
                class="px-4 py-2 bg-dark-green text-white rounded-l-md hover:bg-dark-green-hover transition-colors">
                <i class="fas fa-arrow-left" />
                Back to Home
            </button>
            <button @click="showPatchNotes = !showPatchNotes"
                class="px-4 py-2 bg-dark-blue text-white rounded-r-md hover:bg-dark-blue-hover transition-colors">
                <i class="fas fa-info-circle text-2xl" />
            </button>
        </div>

        <span
            class="flex items-center justify-center text-xl md:text-4xl lg:text-[3.5vw] font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            StarCode
        </span>

        <RouterLink to="/user" class="text-white">
            <UserTab @logout="handleLogout" />
        </RouterLink>
    </div>
    <!-- Patch Notes Popup -->
    <PatchNotesPopup :isVisible="showPatchNotes" @close="showPatchNotes = false" />
</template>

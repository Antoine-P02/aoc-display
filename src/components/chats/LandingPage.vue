<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AuthPage from './AuthPage.vue'
import UserTab from '../user/UserTab.vue'
import { userStoreData } from '../user/User'
import ChatPage from './ChatPage.vue'
import PatchNotesPopup from '../reusables/PatchNotesPopup.vue'

const props = defineProps({
    member: {
        type: Object,
        default: () => ({})
    }
})
const emit = defineEmits(['back-to-aoc'])
const isLoggedIn = ref(false)
const errorWarning = ref('')
const showPatchNotes = ref(false)

const authLoading = ref(true)
getAuthStatus()

async function getAuthStatus() {
    const token = sessionStorage.getItem('token')
    if (token) {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/isTokenValid?token=${token}`)
        if (response.ok) {
            const user = await response.json()
            console.log('Auth from token', user)
            userStoreData.user = user
            isLoggedIn.value = true
            authLoading.value = false
        }
        else {
            errorWarning.value = await response.text()
        }
    }
    authLoading.value = false
}

function openPatchNotes() {
    showPatchNotes.value = true
}

function closePatchNotes() {
    showPatchNotes.value = false
}
</script>

<template>
    <div class="grid grid-cols-3 gap-4 mt-0 h-[6vh] m-6 mb-10">
        <div class="flex justify-center rounded-lg h-full w-full gap-x-4">
            <button @click="$emit('back-to-aoc')"
                class="px-4 py-2 bg-dark-green text-white rounded-l-md hover:bg-dark-green-hover transition-colors">
                <i class="fas fa-arrow-left" />
                Back to Home
            </button>            <!-- @click="getLastMessages(NUMBER_OF_MESSAGES, 0)" -->
            <button v-if="isLoggedIn" @click="openPatchNotes" class="px-4 py-2 bg-dark-blue text-white rounded-r-md hover:bg-dark-blue-hover transition-colors">
                <i class="fas fa-info-circle text-2xl" />
            </button>
        </div>

        <div class="text-center text-white flex items-center justify-center">Future logo and name</div>

        <RouterLink to="/user" class="text-white">
            <UserTab v-if="isLoggedIn" @logout="isLoggedIn = false" />
        </RouterLink>
    </div>
    <div v-if="authLoading" class="loading-screen">
        <AuthPage @login-success="isLoggedIn = true" @register-success="isLoggedIn = true"
            :errorWarning="errorWarning" />
    </div>
    <div v-else>
        <ChatPage v-if="isLoggedIn && userStoreData.user != null" :currentUser="userStoreData.user" />
        <div v-else>
            <AuthPage @login-success="isLoggedIn = true" @register-success="isLoggedIn = true"
                :errorWarning="errorWarning" />
        </div>
    </div>

    <!-- Patch Notes Popup -->
    <PatchNotesPopup :isVisible="showPatchNotes" @close="closePatchNotes" />
</template>

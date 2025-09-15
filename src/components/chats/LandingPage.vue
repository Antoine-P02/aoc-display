<script setup>
import { nextTick, ref } from 'vue'
import AuthPage from './AuthPage.vue'
import { userStoreData } from '../user/User'
import AppHeader from '../reusables/AppHeader.vue'
import { useRouter } from 'vue-router'
import Loader from '../reusables/Loader.vue'

const router = useRouter()
const props = defineProps({
    member: {
        type: Object,
        default: () => ({})
    }
})

const errorWarning = ref('')
const loading = ref(true)
getAuthStatus()

async function connect() {
    router.push('/chat')
}

async function getAuthStatus() {
    const token = localStorage.getItem('token')
    if (token) {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/isTokenValid?token=${token}`)
        if (response.ok) {
            const user = await response.json()
            console.log('Auth from token', user)
            userStoreData.user = user
            loading.value = false
            connect()
        }
        else {
            errorWarning.value = await response.text()
        }
    }
    loading.value = false
}

</script>

<template>
    <AppHeader />
    <div v-if="loading" class="loading-screen">
        <Loader />
    </div>
    <div v-else>
        <AuthPage @login-success="connect" @register-success="connect" :errorWarning="errorWarning" />
        <!-- <ChatPage v-if="isLoggedIn && userStoreData.user != null" :currentUser="userStoreData.user" /> -->
        <!-- <LayoutDemo v-if="isLoggedIn && userStoreData.user != null" /> -->
    </div>

    
</template>

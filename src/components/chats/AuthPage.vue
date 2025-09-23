<script setup>
import { ref } from 'vue'
import { userStoreData } from '../user/User'
import ReallyImportantComponent from '../reusables/ReallyImportantComponent.vue'

const base_url = import.meta.env.VITE_BASE_URL

const props = defineProps({
  errorWarning: String
})

const emit = defineEmits(['login-success', 'register-success'])
const mode = ref('login') // 'login' or 'register'
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const warningText = ref(props.errorWarning)
const showPassword = ref(false)
const switchReallyImportant = ref(false)


function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  username.value = ''
  password.value = ''
  confirmPassword.value = ''
}

function submitForm() {
  if (mode.value === 'register' && password.value !== confirmPassword.value) {
    warningText.value = "Passwords do not match";
    return
  }
  if (!username.value){
    warningText.value = "Username is required";
    return
  }
  if (!password.value) {
    warningText.value = "Password is required";
    return
  }
  
  const payload = {
    username: username.value,
    password: password.value
  }

  if (mode.value === 'login') {
    loginUser(payload)
  } 
  else if (mode.value === 'register') {
    registerShit()
  } 
  else {
    console.error('Unknown mode:', mode.value)
  }
}

function loadUserData(user) {
  userStoreData.user = user
}

async function loginUser() {
  const response = await fetch(`${base_url}/api/loginUser?username=${username.value}&password=${password.value}`)
  if (response.ok) {
    const user = await response.json()
    loadUserData(user)
    localStorage.setItem('token', user.token)
    emit('login-success')
  }
  else {
    warningText.value = await response.text()
  }
}

async function registerShit() {
  const response = await fetch(`${base_url}/api/registerUser?username=${username.value}&password=${password.value}`)
  
  if (response.ok) {
    const user = await response.json()
    console.log('Auth from register', user)
    loadUserData(user)
    localStorage.setItem('token', user.token)
    emit('register-success')
  }
  else {
    warningText.value = await response.text()
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-md">

    <span class="text-2xl font-bold text-center mb-6">
      {{ mode === 'login' ? 'Login' : 'Register' }}
    </span>

    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Username -->
      <div>
        <label class="block mb-1 font-medium">Username</label>
        <input v-model="username" type="text" placeholder="Enter your Username" autocomplete="username"
          class="w-full border border-light-gray rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dark-blue" />
      </div>

      <!-- Password -->
      <div>
        <label class="block mb-1 font-medium">Password</label>
        <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Enter your password"
          autocomplete="current-password"
          class="w-full border border-light-gray rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dark-blue">
        <button @click="showPassword = !showPassword" type="button" class="absolute m-2 -ml-8  text-gray">
          <span>
            <i :class="`fas fa-eye${showPassword ? '-slash' : ''}`" />
          </span>
        </button>
        </input>
      </div>

      <!-- Only show for register -->
      <div v-if="mode === 'register'">
        <label class="block mb-1 font-medium">Password</label>
        <input v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" placeholder="Confirm your password"
          autocomplete="current-password"
          class="w-full border border-light-gray rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dark-blue">
        <button @click="showPassword = !showPassword" type="button" class="absolute m-2 -ml-8  text-gray">
          <span>
            <i :class="`fas fa-eye${showPassword ? '-slash' : ''}`" />
          </span>
        </button>
        </input>
      </div>

      <div class="text-center">
        <span class="text-red text-center">{{ warningText }}</span>
        <span 
          @click="switchReallyImportant = true"
          class="block text-center text-dark-blue font-medium hover:underline px-2">
          Forgot your password ?
        </span>
      </div>

      <button type="submit"
        class="w-full bg-dark-blue text-white py-2 rounded hover:bg-dark-blue-hover transition-colors">
        {{ mode === 'login' ? 'Login' : 'Register' }}
      </button>
    </form>

    <div class="text-center mt-4 text-gray-hover">
      <span v-if="mode === 'login'">Don't have an account?</span>
      <span v-else>Already have an account?</span>
      <button @click="toggleMode" class="text-dark-blue font-medium hover:underline px-2">
        {{ mode === 'login' ? 'Register' : 'Login' }}
      </button>
    </div>  </div>
  <ReallyImportantComponent :switchReallyImportant="switchReallyImportant" @ReallyImportantFeatureEnded="switchReallyImportant = false" />
</template>

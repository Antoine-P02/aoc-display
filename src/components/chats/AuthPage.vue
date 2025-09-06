<script setup>
import { ref } from 'vue'
import { userStoreData } from '../user/User'

const base_url = import.meta.env.VITE_BASE_URL

const mode = ref('login') // 'login' or 'register'
const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const emit = defineEmits(['login-success', 'register-success'])

const props = defineProps({
  errorWarning: String
})

const warningText = ref(props.errorWarning)
const showPassword = ref(false)

// Toggle between login and register
function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  username.value = ''
  password.value = ''
  confirmPassword.value = ''
}

// Submit handler
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

  console.log(mode.value, payload)

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
  console.log('Logging in with:', username.value, password.value)
  const response = await fetch(`${base_url}/api/loginUser?username=${username.value}&password=${password.value}`)
  if (response.ok) {
    const user = await response.json()
    console.log('Auth from login', user)
    loadUserData(user)
    sessionStorage.setItem('token', user.token)
    emit('login-success')
  }
  else {
    warningText.value = await response.text()
  }
}

async function registerShit() {
  console.log('Registering with:', username.value, password.value)
  const response = await fetch(`${base_url}/api/registerUser?username=${username.value}&password=${password.value}`)
  
  if (response.ok) {
    const user = await response.json()
    console.log('Auth from register', user)
    loadUserData(user)
    sessionStorage.setItem('token', user.token)
    emit('register-success')
  }
  else {
    warningText.value = await response.text()
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-md">

    <h2 class="text-2xl font-bold text-center mb-6">
      {{ mode === 'login' ? 'Login' : 'Register' }}
    </h2>

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
      <p class="text-red text-center">{{ warningText }}</p>
      <button type="submit" class="w-full bg-dark-blue text-white py-2 rounded hover:bg-dark-blue-hover transition-colors">
        {{ mode === 'login' ? 'Login' : 'Register' }}
      </button>
    </form>

    <p class="text-center mt-4 text-gray-hover">
      <span v-if="mode === 'login'">Don't have an account?</span>
      <span v-else>Already have an account?</span>
      <button @click="toggleMode" class="text-dark-blue font-medium hover:underline ml-1">
        {{ mode === 'login' ? 'Register' : 'Login' }}
      </button>
    </p>
  </div>
</template>

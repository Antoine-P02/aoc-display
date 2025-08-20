<script setup>
import { ref } from 'vue'
const base_url = import.meta.env.VITE_BASE_URL

const mode = ref('login') // 'login' or 'register'
const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const emit = defineEmits(['login-success', 'register-success'])

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
    alert("Passwords don't match!")
    return
  }

  const payload = {
    username: username.value,
    password: password.value
  }

  console.log(mode.value, payload)

  if (mode.value === 'login') {
    loginUser(payload)
  } else if (mode.value === 'register') {
    registerShit()
  } else {
    console.error('Unknown mode:', mode.value)
  }
}

async function loginUser() {
  console.log('Logging in with:', username.value, password.value)
  const response = await fetch(`${base_url}/api/loginUser?username=${username.value}&password=${password.value}`)
  console.log('Login response:', response)
  const text = await response.text()
  console.log('Login response text:', text)
  emit('login-success')
}

async function registerShit() {
  console.log('Registering with:', username.value, password.value)
  const response = await fetch(`${base_url}/api/registerUser?username=${username.value}&password=${password.value}`)
  console.log('Register response:', response)
  const text = await response.text()
  console.log('Register response text:', text)
  emit('register-success')
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
        <input v-model="username" type="text" placeholder="Enter your Username" required autocomplete="username" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <!-- Password -->
      <div>
        <label class="block mb-1 font-medium">Password</label>
        <input v-model="password" type="password" placeholder="Enter your password" required autocomplete="current-password" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <!-- Only show for register -->
      <div v-if="mode === 'register'">
        <label class="block mb-1 font-medium">Confirm Password</label>
        <input v-model="confirmPassword" type="password" placeholder="Confirm your password" required autocomplete="current-password" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
        {{ mode === 'login' ? 'Login' : 'Register' }}
      </button>
    </form>

    <p class="text-center mt-4 text-gray-600">
      <span v-if="mode === 'login'">Don't have an account?</span>
      <span v-else>Already have an account?</span>
      <button @click="toggleMode" class="text-blue-600 font-medium hover:underline ml-1">
        {{ mode === 'login' ? 'Register' : 'Login' }}
      </button>
    </p>
  </div>
</template>

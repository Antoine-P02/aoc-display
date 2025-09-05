<script setup>
import { ref, onMounted } from 'vue'
import QRCodeStyling from 'qr-code-styling'
import CancelButton from '../reusables/CancelButton.vue'

const username = ref('John Doe')
const location = ref('')
const description = ref('')
const profilePicture = ref(null)
const pictureUrl = ref('')
const qrCodeRef = ref(null)

onMounted(() => {
  const qrCode = new QRCodeStyling({
    width: 220,
    height: 220,
    data: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    dotsOptions: {
      color: '#1e293b',
      type: 'rounded'
    },
    backgroundOptions: {
      color: 'lightgrey'
    },
    cornersSquareOptions: {
      color: '#f59e42',
      type: 'extra-rounded'
    },
    cornersDotOptions: {
      color: '#1e293b',
      type: 'dot'
    }
  })
  qrCode.append(qrCodeRef.value)
})

function onPictureChange(e) {
  const file = e.target.files[0]
  if (file) {
    profilePicture.value = file
    pictureUrl.value = URL.createObjectURL(file)
  }
}

function saveProfile() {
  alert('Profile saved !\n(Sike, still havent done shit on this lmao)')
}

function removePicture() {
  profilePicture.value = null
  pictureUrl.value = ''
}

function goBack() {
  window.history.back()
}
</script>

<template>
  <div
    class="w-full h-screen bg-gradient-to-br from-light-yellow via-yellow-100 to-yellow flex flex-col items-center py-10">
    <!-- Top Bar -->
    <div class="w-full max-w-5xl flex items-center justify-between mb-8 px-6">
      <button @click="goBack"
        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow hover:bg-white-hover transition">
        <i class="fas fa-arrow-left text-darker-yellow" />

        Back
      </button>
      <span class="font-bold text-xl text-darker-yellow">Profile</span>
      <div></div>
    </div>
    <!-- Main Layout -->
    <div class="flex flex-col md:flex-row w-full max-w-5xl gap-12 bg-white/80 rounded-3xl shadow-2xl p-10">
      <!-- Left: Profile Picture & QR Code -->
      <div class="flex flex-col items-center gap-10 flex-1">
        <!-- Profile Picture -->
        <div class="flex flex-col items-center">
          <div class="relative group w-44 h-44">
            <img v-if="pictureUrl" :src="pictureUrl" alt="Profile Picture"
              class="w-44 h-44 rounded-full object-cover shadow-lg border-4 border-white transition" />
            <div v-else
              class="w-44 h-44 rounded-full bg-gradient-to-br from-light-gray to-light-yellow flex items-center justify-center text-gray text-2xl shadow-lg border-4 border-white">
              <i class="fas fa-user fa-shake fa-xl" />
            </div>
            <CancelButton :onClick="removePicture" :cond="pictureUrl" title="Remove Picture" offset="4" :size="8"
              :rounding="90" />
          </div>
          <label class="mt-4 cursor-pointer flex flex-col items-center gap-2">
            <span
              class="px-4 py-2 bg-yellow text-white rounded-lg shadow hover:bg-dark-yellow transition text-sm font-semibold">Import
              Image</span>
            <input type="file" accept="image/*" @change="onPictureChange" class="hidden" />
          </label>
        </div>
        <!-- QR Code Feature -->
        <div class="flex flex-col items-center">
          <div ref="qrCodeRef" class="border rounded-xl shadow-lg bg-[lightgray] p-2"></div>
        </div>
      </div>
      <!-- Right: User Info -->
      <div class="flex flex-col justify-center gap-8 flex-1">
        <div>
          <label class="font-bold mb-2 text-lg text-dark-yellow">Username</label>
          <input v-model="username"
            class="w-full p-3 rounded-xl border-2 border-light-yellow text-lg focus:outline-none focus:border-yellow transition" />
        </div>
        <div>
          <label class="font-bold mb-2 text-lg text-dark-yellow">Location</label>
          <input v-model="location"
            class="w-full p-3 rounded-xl border-2 border-light-yellow text-lg focus:outline-none focus:border-yellow transition"
            placeholder="Enter your location" />
        </div>
        <div>
          <label class="font-bold mb-2 text-lg text-dark-yellow">Description</label>
          <textarea v-model="description"
            class="w-full p-3 rounded-xl border-2 border-light-yellow text-lg focus:outline-none focus:border-yellow transition"
            rows="4" placeholder="Describe yourself"></textarea>
        </div>
        <button 
          @click="saveProfile"
          class="py-3 bg-yellow text-white rounded-lg shadow hover:bg-dark-yellow transition font-semibold"
        >
          Save Changes
        </button>

      </div>
    </div>
  </div>
</template>

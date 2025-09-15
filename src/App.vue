<script setup>
import { onMounted } from "vue";
import Fuzzy from "./components/fuzzy/Fuzzy.vue";
import { displayFinder } from './components/fuzzy/FuzzyStore.js'
  
function keyBinds(event) {
  if (event.ctrlKey && event.key.toLowerCase() === "p") {
    event.preventDefault();
    displayFinder.show = !displayFinder.show
  }
}

onMounted(() => {
  window.addEventListener("keydown", keyBinds);
});
</script>


<template>
  <div class="absolute w-full h-screen p-10">
    <router-view />
  </div>
  <Fuzzy />
</template>

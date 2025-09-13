<script setup>
import { watch, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router'
import { displayFinder } from './FuzzyStore.js'

const router = useRouter()
const pred = [
    { text: "Open AOC", redirect: "/aoc" },
    { text: "Open Feed", redirect: "/feed" },
    { text: "Open Chat", redirect: "/chat" },
    { text: "User User", redirect: "/user" },
    { text: "Game Breakout", redirect: "/game" },
];

const searchInput = ref(null);
const selected = ref(pred[0].text);

watch(() => displayFinder.show, (newVal) => {
    if (newVal) {
        nextTick(() => {
            searchInput.value.focus();
        });
    }
});

function quit() {
    displayFinder.show = false;
}

function action(item){
    if (item.redirect) {
        redirectToPage(item.redirect);
        quit();
    }
}

function bindings(event) {
    console.log("key pressed", event.key);
    if (event.key === "Escape") {
        quit();
    }
    else if (event.key === "ArrowDown") {
        event.preventDefault();
        const currentIndex = pred.findIndex(item => item.text === selected.value);
        const nextIndex = (currentIndex + 1) % pred.length;
        selected.value = pred[nextIndex].text;
    }
    else if (event.key === "ArrowUp") {
        event.preventDefault();
        const currentIndex = pred.findIndex(item => item.text === selected.value);
        const nextIndex = (currentIndex - 1 + pred.length) % pred.length;
        selected.value = pred[nextIndex].text;
    }
    else if (event.key === "Enter") {
        const selectedItem = pred.find(item => item.text === selected.value);
        action(selectedItem);
    }
}

function redirectToPage(tag){
    router.push(tag);
}



</script>

<template>
    <div v-if="displayFinder.show" @click="quit" class="absolute w-full h-full z-100 p-20">
        <div @click.stop class="w-full bg-dark-blue/70 border border-white rounded-lg overflow-hidden">
            <div class="opacity-100 bg-dark-blue">
                <input ref="searchInput" @keydown="bindings" type="text" autofocus
                    class="w-full p-6 text-white font-semibold text-xl bg-transparent border border-white outline-none"
                    placeholder="Type to search..." />

                <div
                    class="w-full max-h-96 overflow-y-auto outline-none"
                    @keydown="bindings"
                >
                    <div
                        v-for="item in pred"
                        :key="item.text"
                        :class="[
                            'text-white p-2 border-b block cursor-pointer bg-blue',
                            selected === item.text ? 'bg-dark-blue font-bold' : 'hover:bg-dark-blue'
                        ]"
                        @click="selected = item.text; action(item)"
                    >
                        {{ item.text }}
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

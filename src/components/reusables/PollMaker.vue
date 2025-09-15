<script setup>
import { ref } from 'vue';
import CancelButton from './CancelButton.vue'

const options = ref([{ text: '', votes: [] }, { text: '', votes: [] }]);
const pollTitle = ref('');

const props = defineProps({
    sendMessage: Function
});
const emit = defineEmits(['closePollMaker']);

function addOption() {
  options.value.push({ text: '', votes: [] });
}

function removeOption(index) {
  options.value.splice(index, 1);
}

function evalPoll(){
    if (pollTitle.value.trim() === '') return false;
    for (const option of options.value) {
        if (option.text.trim() === '') return false;
    }
    return true;
}

function submitNewPoll() {
    if (!evalPoll()) return;

    const pollData = {
        title: pollTitle.value,
        options: options.value
    };

    props.sendMessage('', pollData);
    emit('closePollMaker');
}

</script>

<template>
    <div class="fixed top-0 left-0 right-0 bottom-0 m-[10%] flex items-center justify-center">
        <div class="flex flex-col p-10 gap-y-2 w-full h-full rounded-3xl backdrop-blur-sm bg-blue/30">
            <div>
                <input 
                    v-model="pollTitle" 
                    type="text" 
                    placeholder="Poll Title"
                    class="text-center text-4xl w-[80%] rounded-lg bg-light-green focus:outline-none"
                />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="(option, index) in options" :key="index" class="relative mb-2 flex items-center">
                    <input 
                        v-model="option.text" 
                        type="text" 
                        :placeholder="'Option ' + (index + 1)"
                        class="flex-1 px-2 h-10 rounded-lg bg-light-yellow/90 focus:outline-none focus:ring-2 focus:ring-blue"
                    />
                    <CancelButton v-if="index >= 2" @click="removeOption(index)" size="8" />
                </div>
                
                <div
                    @click="addOption" 
                    class="w-10 h-10 text-center flex justify-center items-center rounded bg-light-green cursor-pointer "
                >
                    <span class="font-bold text-2xl">
                        +
                    </span>
                </div>
            </div>
            
            <button 
                @click="submitNewPoll" 
                class="mt-auto px-4 py-2 text-white rounded-lg"
                :class="evalPoll() ? 'bg-green hover:bg-green/80' : 'bg-red cursor-not-allowed'"
            >
                <span v-if="evalPoll()">
                    Publish Poll
                    <i class="fas fa-check" />
                </span>
                <span v-else>
                    Poll Incomplete
                    <i class="fas fa-times" />
                </span>
            </button>
        </div>
        <CancelButton @click="emit('closePollMaker')" size="12" class="absolute top-4 right-4"/>
    </div>
</template>

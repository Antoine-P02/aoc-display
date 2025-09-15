<script setup>
import { ref } from 'vue';

const base_url = import.meta.env.VITE_BASE_URL

const props = defineProps({
    pollData: {},
    textId: {},
    currentUsername: {}
});

console.log(props.pollData);
for (const option in props.pollData.options) {
    console.log(option.text, option.votes);
}

for (const option of props.pollData.options) {
    console.log(option);
}

const totalVotes = ref(getTotalVotes());
const currentVote = ref(null);

const colors = [ "bg-red", "bg-green", "bg-yellow", "bg-purple-600" ];

function vote(option) {
    if (option === currentVote.value) {
        return; // Prevent voting for the same option again
    }

    const index = props.pollData.options.indexOf(option);

    const hasAlreadyVoted = removeAllPreviousVotes(props.currentUsername);

        props.pollData.options[index].votes = props.pollData.options[index].votes.filter(v => v !== props.currentUsername);

        if (!hasAlreadyVoted) {
            totalVotes.value += 1;
        }
        currentVote.value = option;
        option.votes.push(props.currentUsername);
        console.log(props.pollData.options[0].votes);
        
        updatePoll();
}

function removeAllPreviousVotes(username) {
    let found = false;
    for (const option of props.pollData.options) {
        if (option.votes.includes(username)) {
            found = true;
            option.votes = option.votes.filter(v => v !== username);
        }
    }
    return found;
}

function getTotalVotes() {
    return props.pollData.options.reduce((sum, option) => sum + option.votes.length, 0) || 0;
}

async function updatePoll(){
    const response = await fetch(`${base_url}/api/updatePoll`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messageId: props.textId,
            votes : props.pollData.options
        })
    });

    if (!response.ok) {
        console.error('Failed to update poll');
        return;
    }
}

function getOptionRatio(option) {
    return (option.votes.length / totalVotes.value) || 0;
}

</script>

<template>
  <div class="bg-blue/10 p-4 mx-auto rounded-lg w-1/2 space-y-2">
    <span class="text-white" >
        {{ props.pollData.title }} Poll by
        <span class="text-yellow font-bold">
            {{ props.currentUsername }}
        </span>
        ({{ totalVotes }} votes)
    </span>
    <div
      v-for="(option, index) in props.pollData.options"
      :key="index"
      @click="vote(option)"
      class="relative w-full bg-blue/20 rounded h-6 cursor-pointer group hover:bg-blue/40"
    >
      <div
        class="h-full rounded group-hover:bg-blue"
        :class="colors[index]"
        :style="{ width: `${( (getOptionRatio(option) * 100) || 0) }%` }"
      />
      <span class="absolute left-2 top-0 text-white">
        {{ option.text }} - ({{ ( (getOptionRatio(option) * 100).toFixed(1) || 0) }}%)
      </span>
    </div>
  </div>
</template>

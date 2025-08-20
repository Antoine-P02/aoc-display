<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    message: {
        type: Object,
        required: true
    },
    isCurrentUser: {
        type: Boolean
    }
});


function formatDate(ts) {
    const date = new Date(ts);
    return date.toLocaleString('fr-FR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

</script>

<template>
    <div class="h-fit w-80 bg-blue-300 m-4 rounded-3xl p-4" :class="{
    'rounded-br-none ml-auto': isCurrentUser,
    'rounded-bl-none mr-auto': !isCurrentUser
  }">
    <span class="flex justify-end text-xs">
            {{ formatDate(message.timestamp) }}
        </span>
        <p>{{ message.value }}</p>

    </div>
</template>



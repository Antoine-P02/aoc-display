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
    <div class="h-fit w-80 m-4 rounded-3xl p-4" :class="{
    'rounded-br-none ml-auto bg-blue-400 ': isCurrentUser,
    'rounded-bl-none mr-auto bg-blue-200 ': !isCurrentUser
  }">
    <span class="flex justify-end text-xs">
            {{ formatDate(message.timestamp) }}
        </span>
        <p>{{ message.value }}</p>

    </div>
</template>



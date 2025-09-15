<script setup>
import { ref, onMounted } from 'vue';

const ballRef = ref(null);
const dx = ref(0);
const dy = ref(0);
const speed = 2;

function moveBall() {
    const ball = ballRef.value;
    if (!ball) return;

    const rect = ball.getBoundingClientRect();
    const x = rect.left + dx.value;
    const y = rect.top + dy.value;

    // Check boundaries and reverse direction if hitting edges
    if (x < 0 || x > window.innerWidth - rect.width) dx.value = -dx.value;
    if (y < 0 || y > window.innerHeight - rect.height) dy.value = -dy.value;

    // Update ball position
    ball.style.left = `${rect.left + dx.value}px`;
    ball.style.top = `${rect.top + dy.value}px`;

    requestAnimationFrame(moveBall);
};

onMounted(() => {
    // Initialize random direction
    dx.value = Math.random() * speed * 2 - speed;
    dy.value = Math.random() * speed * 2 - speed;
    
    // Start the animation
    requestAnimationFrame(moveBall);
});


</script>

<template>
    <div
        ref="ballRef"
        :style="{
            width: '30px',
            height: '30px',
            backgroundColor: 'blue',
            borderRadius: '50%',
            position: 'absolute',
            top: '100px',
            left: '100px'
        }"
    ></div>
</template>

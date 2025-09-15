<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Ball from './Ball.vue'

const offset = ref(600)
const containerRef = ref(null)

function getBricks(x, y) {
    return Array.from({ length: x }, (_, rowIndex) =>
        Array.from({ length: y }, (_, colIndex) => ({
            row: rowIndex,
            col: colIndex,
        }))
    )
}

const bricks = ref(getBricks(10, 10))

function onKeyDown(event) {
    if (!containerRef.value) return
    const containerWidth = containerRef.value.clientWidth
    const minW = 80
    //set max to 80% of container width
    const maxW = containerWidth + minW
    const step = 30

    switch (event.key) {
        case 'ArrowLeft':
            offset.value = Math.max(offset.value - step, minW)
            break
        case 'ArrowRight':
            offset.value = Math.min(offset.value + step, maxW)
            break

    }
}

onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
})


function Board() {
    const canvasRef = ref(null);
    const movingRectX = ref(0);
    const movingRectY = ref(0);

    onMounted(() => {
        draw();
    });



    function draw() {
        const canvas = canvasRef.value;
        if (!canvas) return;
        const cv = canvas.getContext("2d");
        if (!cv) return;
        cv.fillStyle = "grey";
        cv.fillRect(0, 0, canvas.width, canvas.height);

        cv.font = "20px arial";
        cv.fillStyle = "blue";
        cv.fillText("test", 50, 50);


        cv.beginPath()
        cv.arc(100, 100, 10, 0, 2 * Math.PI)
        cv.fillStyle = "white"
        cv.fill()
    }

    function animate() {
        const canvas = canvasRef.value;
        if (!canvas) return;

        movingRectX.value += speed;
        if (movingRectX.value > canvas.width) movingRectX.value = -100;

        draw();
        animationFrameId = requestAnimationFrame(animate);
    }
}
Board();

</script>

<template>
    <div class="w-full h-full items-center justify-center bg-green">
        <div class=" bg-yellow/50 flex flex-col items-center justify-center gap-1">
            <div v-for="(row, rowIndex) in bricks" :key="rowIndex" class="flex gap-1">
                <div v-for="brick in row" :key="brick.col" class="flex-1 px-4 py-2 rounded bg-light-blue" />
            </div>
        </div>
        <Ball />
        <canvas ref="canvasRef" class=" bg-red w-full h-full
        " />
        <div class="flex flex-col items-center justify-center">
            <div ref="containerRef" class="w-full m-2.5 bg-black">
                <div class=" px-16 p-2 rounded absolute top-1/2 -translate-y-1/2 bg-white" :style="{ left: offset + 'px' }" />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "FullPageOverlay",
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<template>
    <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
        <slot></slot>
    </div>
</template>

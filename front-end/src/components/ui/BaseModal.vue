<script setup>
import { onMounted, onUnmounted } from "vue"

const emit = defineEmits(["close"])

const close = () => emit("close")

const onEsc = (e) => {
    if (e.key === "Escape") close()
}

onMounted(() => {
    document.addEventListener("keydown", onEsc)
})

onUnmounted(() => {
    document.removeEventListener("keydown", onEsc)
})
</script>

<template>
    <teleport to="body">
        <!-- Backdrop -->
        <div class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" @click.self="close" />

        <!-- Modal -->
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl animate-scale-in relative overflow-hidden">
                <!-- Close button -->
                <button @click="close"
                    class="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition flex items-center justify-center">
                    ✕
                </button>

                <!-- Content -->
                <div class="p-8 max-h-[85vh] overflow-y-auto">
                    <slot />
                </div>
            </div>
        </div>
    </teleport>
</template>

<style scoped>
@import "tailwindcss";

@keyframes scale-in {
    from {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.animate-scale-in {
    animation: scale-in 0.25s ease-out;
}
</style>

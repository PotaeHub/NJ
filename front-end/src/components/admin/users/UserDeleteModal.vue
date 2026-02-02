<script setup>
import { Trash2, AlertTriangle, X } from 'lucide-vue-next'

defineProps({
    show: Boolean,
    user: Object
})

const emit = defineEmits(["close", "confirm"])
</script>

<template>
    <Transition name="purge-fade">
        <div v-if="show" class="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" @click="emit('close')"></div>

            <div
                class="relative w-full max-w-md bg-[#0d0202] border border-rose-950 rounded-[2.5rem] shadow-[0_0_100px_rgba(225,29,72,0.15)] overflow-hidden">

                <div class="h-1.5 w-full bg-gradient-to-r from-transparent via-rose-600 to-transparent"></div>

                <div class="p-10 flex flex-col items-center text-center">
                    <div class="relative mb-8">
                        <div class="absolute inset-0 bg-rose-600 blur-[30px] opacity-20 animate-pulse"></div>
                        <div
                            class="relative w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] flex items-center justify-center">
                            <Trash2 class="text-rose-500" :size="36" stroke-width="2.5" />
                        </div>
                        <div
                            class="absolute -top-2 -right-2 bg-rose-600 text-white p-1.5 rounded-lg border-2 border-[#0d0202]">
                            <AlertTriangle :size="14" stroke-width="3" />
                        </div>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-3xl font-black italic tracking-tighter uppercase text-rose-500">
                            Purge Record?
                        </h2>

                        <div class="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <p class="text-[11px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                                ID: <span class="text-white">#{{ user?.id || 'UNKNOWN'
                                }}</span><br />
                                CITIZEN: <span class="text-white">{{ user?.username }}</span>
                            </p>
                        </div>

                        <p
                            class="text-[10px] font-black uppercase tracking-[0.2em] text-rose-900/80 leading-relaxed italic">
                            CRITICAL: This operation will permanently erase the identity from the matrix. This process
                            cannot be reversed.
                        </p>
                    </div>
                </div>

                <div class="px-10 pb-10 flex flex-col gap-3">
                    <button @click="emit('confirm')"
                        class="group relative w-full py-5 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:bg-rose-500 active:scale-95 shadow-[0_15px_30px_-10px_rgba(225,29,72,0.5)]">
                        <span class="relative z-10 flex items-center justify-center gap-2">
                            Confirm Permanent Erasure
                        </span>
                        <div
                            class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform">
                        </div>
                    </button>

                    <button @click="emit('close')"
                        class="w-full py-5 bg-transparent text-zinc-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-colors">
                        Abort Protocol
                    </button>
                </div>

                <div class="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <div class="flex flex-col gap-1">
                        <div v-for="i in 3" :key="i" class="h-1 w-20 bg-rose-500 rotate-45 transform translate-y-10">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
@import "tailwindcss";

/* Sequential Reveal for Modal Content */
.purge-fade-enter-active,
.purge-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.purge-fade-enter-from,
.purge-fade-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(40px);
}

/* Red Pulse Glow Effect */
@keyframes pulse-soft {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.2;
    }

    50% {
        transform: scale(1.1);
        opacity: 0.3;
    }
}

.animate-pulse {
    animation: pulse-soft 2s infinite ease-in-out;
}
</style>
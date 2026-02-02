<template>
    <div class="group relative bg-[#161617] rounded-[2rem] border border-white/5 overflow-hidden transition-all duration-500 cursor-pointer hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-blue-500/30"
        @click="$emit('view', game)">

        <div class="relative aspect-[4/3] overflow-hidden bg-zinc-800">
            <img v-if="image" :src="BASE_URL + image.url"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

            <div v-else class="w-full h-full flex items-center justify-center text-zinc-600">
                <span class="text-4xl">🎮</span>
            </div>

            <div class="absolute inset-0 bg-gradient-to-t from-[#161617] via-transparent to-transparent opacity-60">
            </div>

            <div v-if="types.length" class="absolute top-4 left-4 flex gap-2 flex-wrap">
                <span v-for="type in types" :key="type"
                    class="px-3 py-1 bg-black/40 backdrop-blur-md text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/10 shadow-lg">
                    {{ type }}
                </span>
            </div>
        </div>

        <div class="p-6 relative">
            <div
                class="absolute -top-10 left-10 w-20 h-20 bg-blue-500/10 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>

            <h3
                class="font-black text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors truncate">
                {{ game.title }}
            </h3>

            <div class="mt-4 flex items-center justify-between">
                <div class="flex flex-col">
                    <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Base Game</span>
                    <p class="text-blue-500 font-black text-lg tracking-tighter italic">
                        ฿{{ game.price.toLocaleString() }}
                    </p>
                </div>

                <div
                    class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all group-hover:bg-blue-600 group-hover:border-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    game: {
        type: Object,
        required: true
    }
})

const BASE_URL = import.meta.env.VITE_BACKEND

/* ================= IMAGE ================= */
const image = computed(() => {
    if (!props.game?.gameMedias) return null
    return props.game.gameMedias.find(m => m.type === 'IMAGE') || null
})

/* ================= CATEGORY TYPES ================= */
const types = computed(() => {
    if (!props.game?.categories) return []
    return props.game.categories.map(c => c.type)
})
</script>

<style scoped>
/* เพิ่มความนุ่มนวลในการ Transition */
.group {
    backface-visibility: hidden;
    transform: translateZ(0);
}

h3 {
    text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
</style>
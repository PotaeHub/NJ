<template>
    <div class="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
        @click="$emit('view', game)">
        <!-- IMAGE -->
        <div class="relative h-48 bg-slate-100">
            <img v-if="image" :src="BASE_URL + image.url" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
                🎮 No Image
            </div>

            <!-- CATEGORY TYPE BADGE -->
            <div v-if="types.length" class="absolute top-2 left-2 flex gap-2 flex-wrap">
                <span v-for="type in types" :key="type" class="px-3 py-1 text-xs font-bold rounded-full
                           bg-indigo-600 text-white shadow">
                    {{ type }}
                </span>
            </div>
        </div>

        <div class="p-4">
            <h3 class="font-bold text-lg truncate">
                {{ game.title }}
            </h3>

            <p class="text-indigo-600 font-bold mt-2">
                {{ game.price.toLocaleString() }} ฿
            </p>
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

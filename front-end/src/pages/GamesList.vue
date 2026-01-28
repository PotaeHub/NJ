<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

import Navbarpublic from '@/components/Navbarpublic.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import GameCard from '@/components/home/GameCard.vue'

const router = useRouter()

const games = ref([])
const loading = ref(false)
const search = ref('')
const sort = ref('latest')

/* ---------------- FETCH GAMES ---------------- */
const fetchGames = async () => {
    loading.value = true
    try {
        const res = await api.get('/games', {
            params: {
                search: search.value,
                sort: sort.value
            }
        })
        games.value = res.data.data
    } finally {
        loading.value = false
    }
}
/* โหลดใหม่เมื่อ search / sort เปลี่ยน */
watch([search, sort], fetchGames, { immediate: true })

/* ---------------- VIEW GAME ---------------- */
const viewGame = (game) => {
    router.push(`/games/${game.id}`)
}
</script>

<template>
    <div class="min-h-screen bg-[#FDFDFD] text-slate-200 selection:bg-indigo-500/30">
        <Navbarpublic />

        <section class="max-w-7xl mx-auto px-6 py-16 space-y-14">

            <!-- HEADER -->
            <div class="space-y-3">
                <h1 class="text-5xl font-black text-black tracking-tighter">
                    🎮 เกมทั้งหมด
                </h1>
                <p class="text-slate-600 max-w-xl leading-relaxed">
                    เลือกซื้อเกมแท้ ราคาดี ปลอดภัย 100% แบบ Marketplace
                </p>
            </div>

            <!-- FILTER -->
            <div class="flex flex-wrap gap-4 items-center justify-between">
                <input v-model="search" placeholder="ค้นหาเกม..." class="bg-white/5 border border-black rounded-xl px-5 py-3 text-sm
                           text-slate-200 placeholder-slate-500
                           focus:outline-none focus:ring-2 focus:ring-indigo-500
                           transition w-full sm:w-72" />

                <select v-model="sort" class="bg-white/5 border border-black rounded-xl px-4 py-3 text-sm
                           text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                    <option value="latest">ล่าสุด</option>
                    <option value="price_asc">ราคาถูก → แพง</option>
                    <option value="price_desc">แพง → ถูก</option>
                </select>
            </div>

            <!-- LOADING -->
            <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div v-for="n in 8" :key="n" class="h-[380px] bg-black rounded-2xl animate-pulse" />
            </div>

            <!-- EMPTY -->
            <div v-else-if="games.length === 0" class="text-center py-32 bg-white/5 rounded-[3rem]
                       border border-dashed border-white/10">
                <div class="text-6xl mb-4 opacity-30">🎮</div>
                <h3 class="text-xl font-bold uppercase tracking-widest text-slate-400">
                    ไม่พบเกม
                </h3>
                <p class="text-slate-500 mt-2">
                    ลองเปลี่ยนคำค้นหาหรือเรียงลำดับใหม่
                </p>
            </div>

            <!-- GRID -->
            <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-8">
                <GameCard v-for="g in games" :key="g.id" :game="g" @view="viewGame" class="hover-effect" />
            </div>

        </section>

        <HomeFooter />
    </div>
</template>

<style scoped>
@import "tailwindcss";

/* Hover ให้เหมือน Home */
.hover-effect {
    transition:
        transform .35s ease,
        box-shadow .35s ease;
}

.hover-effect:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 30px 60px rgba(99, 102, 241, .25);
}
</style>

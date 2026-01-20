<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

import HomeHero from '@/components/home/HomeHero.vue'
import GameCard from '@/components/home/GameCard.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import Navbarpublic from '@/components/Navbarpublic.vue'

const games = ref([])
const loading = ref(false)
const router = useRouter()

const fetchGames = async () => {
    loading.value = true
    try {
        const res = await api.get('/games')
        games.value = res.data.data
    } catch (err) {
        console.error('โหลดเกมไม่สำเร็จ', err)
    } finally {
        loading.value = false
    }
}
const goAllGames = () => {
    router.push('/games')
}
onMounted(fetchGames)

const viewGame = (game) => {
    router.push(`/games/${game.id}`)
}
</script>
<template>
    <div class="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
        <Navbarpublic />
        <HomeHero />

        <section class="max-w-7xl mx-auto px-6 py-16 relative">
            <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full"></div>

            <div class="flex items-end justify-between mb-10">
                <div class="space-y-1">
                    <div class="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-[0.2em] text-xs">
                        <span class="w-8 h-[2px] bg-indigo-500"></span>
                        Marketplace
                    </div>
                    <h3 class="text-4xl font-black text-white tracking-tighter italic">
                        🔥 เกมยอดนิยมตอนนี้
                    </h3>
                </div>
                <RouterLink to="/games" class="relative z-10 hidden md:flex items-center gap-2 text-sm font-bold
         text-slate-400 hover:text-white transition-colors
         uppercase tracking-widest">
                    ดูทั้งหมด
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
                    </svg>
                </RouterLink>
            </div>

            <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <div v-for="n in 8" :key="n"
                    class="h-[400px] bg-white/5 rounded-[2rem] animate-pulse border border-white/5"></div>
            </div>

            <div v-else-if="games.length === 0"
                class="text-center py-32 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                <div class="text-6xl mb-4 opacity-20">🎮</div>
                <h3 class="text-xl font-bold text-slate-400 uppercase tracking-widest">ยังไม่มีเกมในคลังระบบ</h3>
                <p class="text-slate-600 mt-2">โปรดกลับมาตรวจสอบใหม่อีกครั้งในภายหลัง</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <GameCard v-for="g in games" :key="g.id" :game="g" @view="viewGame"
                    class="hover-effect transition-all duration-500" />
            </div>
        </section>


        <HomeFooter />
    </div>
</template>



<style scoped>
@import "tailwindcss";

.hover-effect:hover {
    transform: translateY(-10px);
}

/* Custom Scrollbar สำหรับสายเกมมิ่ง */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #020617;
}

::-webkit-scrollbar-thumb {
    background: #1e1b4b;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #312e81;
}
</style>
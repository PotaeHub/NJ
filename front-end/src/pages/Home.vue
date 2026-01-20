<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

import HomeHero from '@/components/home/HomeHero.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import Navbarpublic from '@/components/Navbarpublic.vue'

import * as Icons from 'lucide-vue-next'
import GameCard from '../components/Home/GameCard.vue'

/* ================= STATE ================= */
const games = ref([])
const categories = ref([])
const activeCategory = ref('ALL')
const loading = ref(false)

const router = useRouter()
const route = useRoute()

const fetchGames = async (category = 'ALL') => {
    loading.value = true
    try {
        const res = await api.get('/public/games', {
            params: category !== 'ALL' ? { category } : {}
        })
        games.value = res.data.data
    } catch (err) {
        console.error('❌ Fetch Error:', err)
    } finally {
        loading.value = false
    }
}

const fetchCategories = async () => {
    try {
        const res = await api.get('/public/categories')
        categories.value = res.data.data
    } catch (err) {
        console.error('❌ Categories Error:', err)
    }
}

const filterByCategory = (id) => {
    router.replace({
        query: id !== 'ALL' ? { category: id } : {}
    })
}

const viewGame = (game) => {
    router.push(`/games/${game.id}`)
}

onMounted(() => {
    const categoryFromUrl = route.query.category || 'ALL'
    activeCategory.value = categoryFromUrl
    fetchCategories()
})

watch(
    () => route.query.category,
    (newCategory) => {
        const cat = newCategory || 'ALL'
        activeCategory.value = cat
        fetchGames(cat)
    },
    { immediate: true }
)
</script>

<template>
    <div class="min-h-screen bg-[#FDFDFD] text-black selection:bg-black selection:text-white font-sans">
        <Navbarpublic />
        <HomeHero />

        <main class="max-w-screen-2xl mx-auto px-6 lg:px-12 py-24 relative">

            <div
                class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-zinc-100 pb-12">
                <div class="space-y-4">
                    <div class="flex items-center gap-3">
                        <div class="h-1 w-12 bg-black"></div>
                        <span class="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Digital
                            Collection</span>
                    </div>
                    <h3 class="text-6xl font-black text-black tracking-tighter uppercase leading-[0.8]">
                        The <br /> <span class="text-zinc-300">Archives.</span>
                    </h3>
                    <p class="text-zinc-400 text-sm font-medium tracking-wide max-w-xs uppercase">
                        Curated Selection of Premium Digital Assets & Interactive Media
                    </p>
                </div>

                <div class="flex gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
                    <button @click="filterByCategory('ALL')" class="category-btn"
                        :class="activeCategory === 'ALL' ? 'active' : ''">
                        ALL
                    </button>

                    <button v-for="cat in categories" :key="cat.id" @click="filterByCategory(cat.name)"
                        class="category-btn" :class="activeCategory === cat.name ? 'active' : ''">
                        {{ cat.name }}
                    </button>
                </div>
            </div>

            <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                <div v-for="n in 8" :key="n" class="space-y-4">
                    <div class="aspect-[3/4] bg-zinc-100 rounded-[2.5rem] animate-pulse"></div>
                    <div class="h-4 w-2/3 bg-zinc-100 rounded-full animate-pulse"></div>
                    <div class="h-3 w-1/2 bg-zinc-50 rounded-full animate-pulse"></div>
                </div>
            </div>

            <div v-else-if="games.length === 0"
                class="text-center py-48 bg-zinc-50 rounded-[4rem] border border-dashed border-zinc-200">
                <div class="text-4xl mb-6 grayscale opacity-20">📂</div>
                <h3 class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">
                    Vault Empty for this category
                </h3>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                <GameCard v-for="g in games" :key="g.id" :game="g" @view="viewGame"
                    class="transform transition-all duration-700 hover:-translate-y-4" />
            </div>
        </main>

        <HomeFooter />
    </div>
</template>

<style scoped>
    @import "tailwindcss";
.category-btn {
    @apply px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border border-zinc-100 whitespace-nowrap hover:bg-zinc-50 hover:border-zinc-300 text-zinc-400;
}

.category-btn.active {
    @apply bg-black text-white border-black shadow-2xl shadow-black/20 scale-105;
}

/* Hide Scrollbar */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* นิ่งและแพงด้วยการค่อยๆ ปรากฎ */
.grid {
    animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
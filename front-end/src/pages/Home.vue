<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

// Components
import HomeHero from '@/components/home/HomeHero.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import Navbarpublic from '@/components/Navbarpublic.vue'
import GameCard from '../components/Home/GameCard.vue'

/* ================= AUTH CHECK ================= */
const isLoggedIn = computed(() => !!localStorage.getItem('token'))

/* ================= STATE ================= */
const games = ref([])
const categories = ref([])
const activeCategory = ref('ALL')
const loading = ref(false)

const router = useRouter()
const route = useRoute()

/* ================= METHODS ================= */
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
    router.replace({ query: id !== 'ALL' ? { category: id } : {} })
}

const viewGame = (game) => {
    router.push(`/games/${game.id}`)
}

onMounted(() => {
    const categoryFromUrl = route.query.category || 'ALL'
    activeCategory.value = categoryFromUrl
    fetchCategories()
})

watch(() => route.query.category, (newCategory) => {
    const cat = newCategory || 'ALL'
    activeCategory.value = cat
    fetchGames(cat)
}, { immediate: true })
</script>

<template>
    <div
        class="min-h-screen bg-[#000000] text-black selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden relative">

        <div
            class="fixed -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full pointer-events-none">
        </div>
        <div
            class="fixed top-[20%] -right-[5%] w-[30%] h-[30%] bg-indigo-50/50 blur-[100px] rounded-full pointer-events-none">
        </div>

        <Navbarpublic />

        <transition name="hero-fade">
            <HomeHero v-if="!isLoggedIn" />
        </transition>

        <main :class="[
            'relative max-w-[1600px] mx-auto px-6 lg:px-16 transition-all duration-1000 ease-in-out',
            isLoggedIn ? 'pt-32 pb-24' : 'py-24'
        ]">

            <div :class="[
                'flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 transition-all duration-700',
                isLoggedIn ? 'pb-10 border-b border-zinc-200/30' : 'pb-16 border-b border-zinc-200/50'
            ]">
                <div class="relative group">
                    <div class="flex items-center gap-4 mb-6 translate-x-1">
                        <span class="h-[3px] w-14 bg-blue-600 rounded-full"></span>
                        <span class="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-400">
                            {{ isLoggedIn ? 'Digital Vault' : 'Next-Generation Store' }}
                        </span>
                    </div>

                    <h2 :class="[
                        'font-black tracking-tighter uppercase italic leading-[0.85] transition-all duration-700',
                        isLoggedIn ? 'text-6xl lg:text-7xl text-white' : 'text-8xl lg:text-[110px] text-black'
                    ]">
                        {{ isLoggedIn ? 'My Library' : 'Discover' }}<span class="text-blue-600">.</span>
                    </h2>

                    <span
                        class="absolute -top-16 -left-12 text-[160px] font-black opacity-[0.03] pointer-events-none select-none tracking-tighter uppercase">
                        {{ isLoggedIn ? 'Assets' : 'ชื่อเรื่อง' }}
                    </span>
                </div>

                <div class="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
                    <button @click="filterByCategory('ALL')" class="category-btn"
                        :class="activeCategory === 'ALL' ? 'active' : ''">
                        All Games
                    </button>
                    <button v-for="cat in categories" :key="cat.id" @click="filterByCategory(cat.name)"
                        class="category-btn" :class="activeCategory === cat.name ? 'active' : ''">
                        {{ cat.name }}
                    </button>
                </div>
            </div>

            <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                <div v-for="n in 8" :key="n" class="relative group animate-skeleton">
                    <div class="aspect-[3/4] bg-zinc-200/60 rounded-[2.5rem] mb-6 shadow-inner"></div>
                    <div class="h-6 w-3/4 bg-zinc-200/60 rounded-xl mb-3"></div>
                    <div class="h-4 w-1/2 bg-zinc-100/60 rounded-xl"></div>
                </div>
            </div>

            <div v-else-if="games.length === 0"
                class="flex flex-col items-center justify-center py-48 rounded-[4rem] bg-white/50 backdrop-blur-xl border border-white shadow-2xl shadow-zinc-200/50">
                <div
                    class="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-8 border border-zinc-100 shadow-inner group transition-transform hover:scale-110">
                    <span class="text-4xl filter grayscale opacity-30">🎮</span>
                </div>
                <h3 class="text-xs font-black text-zinc-400 uppercase tracking-[0.4em]">No titles found in this sector
                </h3>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20">
                <GameCard v-for="g in games" :key="g.id" :game="g" @view="viewGame" class="game-card-entry" />
            </div>
        </main>

        <HomeFooter v-if="!isLoggedIn" />
    </div>
</template>

<style scoped>
.font-sans {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Category Buttons - High-End Tactile Feel */
.category-btn {
    @apply px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 bg-white border border-zinc-100 text-zinc-400 hover:border-blue-600/30 hover:text-blue-600 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1;
}

.category-btn.active {
    @apply bg-black text-white border-black -translate-y-1.5;
}

/* Sequential Reveal Animation */
.game-card-entry {
    animation: reveal 0.8s cubic-bezier(0.23, 1, 0.32, 1) backwards;
}

@keyframes reveal {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Custom Utilities */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.animate-skeleton {
    animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

/* Hero Transition */
.hero-fade-enter-active,
.hero-fade-leave-active {
    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-fade-enter-from,
.hero-fade-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}
</style>

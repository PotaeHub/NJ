<template>
    <div class="min-h-screen bg-[#0a0a0b] text-white pb-32 selection:bg-blue-500/30 overflow-x-hidden">

        <div
            class="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none">
        </div>

        <div v-if="game" class="relative max-w-7xl mx-auto px-6 pt-12 animate-page-in">

            <div class="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-10">
                <RouterLink to="/" class="hover:text-blue-400 transition-colors">Store</RouterLink>
                <span class="text-zinc-800">/</span>
                <span class="text-zinc-300">{{ game.title }}</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">

                <div class="lg:col-span-2 space-y-6">

                    <div
                        class="relative aspect-video overflow-hidden rounded-[40px] bg-black border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] group">
                        <Transition name="media-fade" mode="out-in">
                            <video v-if="mainMedia?.type === 'VIDEO'" :key="mainMedia.id" :src="backend + mainMedia.url"
                                controls autoplay muted playsinline class="w-full h-full object-contain bg-black" />

                            <img v-else-if="mainMedia" :key="mainMedia.id" :src="backend + mainMedia.url"
                                class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        </Transition>

                        <div v-if="mainMedia?.type === 'VIDEO'"
                            class="absolute top-6 left-6 bg-blue-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full tracking-[0.2em] shadow-lg">
                            OFFICIAL TRAILER
                        </div>
                    </div>

                    <div class="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        <div v-for="media in game.gameMedias" :key="media.id" @click="mainMedia = media" :class="[
                            'relative min-w-[160px] aspect-video rounded-[20px] overflow-hidden cursor-pointer transition-all duration-500 border-2 shadow-lg',
                            mainMedia?.id === media.id
                                ? 'border-blue-500 scale-95 shadow-blue-500/20 opacity-100'
                                : 'border-white/5 opacity-40 hover:opacity-100 hover:-translate-y-1'
                        ]">

                            <video v-if="media.type === 'VIDEO'" :src="backend + media.url" muted loop
                                preload="metadata" playsinline class="w-full h-full object-cover"
                                @mouseenter="$event.target.play()" @mouseleave="$event.target.pause()" />

                            <img v-else :src="backend + media.url" class="w-full h-full object-cover" />

                            <div v-if="media.type === 'VIDEO'"
                                class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                <div
                                    class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30 text-xs">
                                    ▶
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-8">

                    <div
                        class="bg-white/[0.03] backdrop-blur-3xl rounded-[40px] p-10 border border-white/10 shadow-2xl relative overflow-hidden group">

                        <div
                            class="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[60px] group-hover:bg-blue-600/20 transition-all duration-700">
                        </div>

                        <h1 class="text-4xl font-black tracking-tighter leading-[0.9] mb-4 italic uppercase">
                            {{ game.title }}
                        </h1>

                        <div class="flex items-center gap-3 mb-10">
                            <div
                                class="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-500 flex items-center justify-center text-[10px] font-bold shadow-inner uppercase">
                                {{ game.seller.username.charAt(0) }}
                            </div>
                            <span class="text-xs font-black text-zinc-400 tracking-widest uppercase">{{
                                game.seller.username }}</span>
                        </div>

                        <div class="mb-10 space-y-1">
                            <p class="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500">Digital License
                            </p>
                            <div class="flex items-baseline gap-2">
                                <span class="text-6xl font-black tracking-tighter italic">฿{{
                                    game.price.toLocaleString() }}</span>
                                <span class="text-sm font-bold text-zinc-500">THB</span>
                            </div>
                        </div>

                        <button v-if="!owned" @click="buy"
                            class="group relative w-full bg-white text-black py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all hover:bg-blue-500 hover:text-white active:scale-95 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] hover:shadow-blue-500/40">
                            <span class="relative z-10 flex items-center justify-center gap-2">
                                เพิ่มลงในรถเข็น
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>

                        <div v-else
                            class="w-full bg-emerald-500/10 border border-emerald-500/30 py-6 rounded-2xl font-black text-emerald-400 text-center text-[10px] tracking-[0.2em] uppercase">
                            ✔ เป็นเจ้าของแล้วในคลังเกม
                        </div>
                    </div>

                    <div
                        class="bg-white/[0.02] rounded-[30px] p-8 border border-white/5 text-[11px] font-black tracking-widest uppercase space-y-5">
                        <div class="flex justify-between items-center">
                            <span class="text-zinc-600 italic">Release</span>
                            <span class="text-zinc-300">{{ new Date(game.createdAt).toLocaleDateString('th-TH')
                                }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-zinc-600 italic">Platform</span>
                            <span class="text-zinc-300 bg-white/5 px-2 py-1 rounded">PC Digital</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-20 relative">
                <div class="absolute top-0 left-0 w-24 h-1 bg-blue-600"></div>
                <div class="bg-white/[0.02] rounded-[40px] p-12 border border-white/5 mt-8">
                    <h2 class="text-2xl font-black tracking-tighter italic uppercase mb-8 flex items-center gap-4">
                        รายละเอียดเกม <span class="text-zinc-800 text-4xl leading-none">/</span>
                    </h2>
                    <p class="text-lg leading-[1.8] text-zinc-400 font-medium max-w-4xl whitespace-pre-line">
                        {{ game.description }}
                    </p>
                </div>
            </div>

            <div class="mt-20">
                <div class="flex items-center justify-between mb-12">
                    <h2 class="text-3xl font-black tracking-tighter italic uppercase">User Reviews</h2>
                    <div class="h-[1px] flex-grow mx-8 bg-white/5"></div>
                </div>

                <div class="grid md:grid-cols-2 gap-8">
                    <div v-for="review in game.reviews" :key="review.id"
                        class="p-8 rounded-[30px] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-colors group">
                        <div class="flex items-center gap-4 mb-6">
                            <div
                                class="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 transition-colors">
                                {{ review.user.username.charAt(0).toUpperCase() }}
                            </div>
                            <div>
                                <p class="font-black text-xs uppercase tracking-widest">{{ review.user.username }}</p>
                                <p class="text-[10px] text-zinc-600 uppercase font-black tracking-widest mt-0.5">
                                    Recommended</p>
                            </div>
                        </div>
                        <p class="text-zinc-400 italic font-medium leading-relaxed">
                            "{{ review.comment }}"
                        </p>
                    </div>

                    <div v-if="game.reviews.length === 0"
                        class="col-span-full text-center py-20 bg-white/[0.01] rounded-[40px] border border-dashed border-white/10">
                        <p class="text-zinc-600 font-black uppercase tracking-[0.5em] text-xs">ยังไม่มีรีวิวจากผู้ใช้งาน
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center h-[90vh] gap-8">
            <div class="relative w-20 h-20">
                <div class="absolute inset-0 border-[3px] border-white/5 rounded-full"></div>
                <div
                    class="absolute inset-0 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin">
                </div>
            </div>
            <p class="text-[10px] font-black tracking-[1em] uppercase text-blue-500/50 animate-pulse">Synchronizing Data
            </p>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

/* Page Fade-in Animation */
.animate-page-in {
    animation: fadeInSlide 1.2s cubic-bezier(0.2, 1, 0.3, 1) forwards;
}

@keyframes fadeInSlide {
    from {
        opacity: 0;
        transform: translateY(40px);
        filter: blur(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0);
    }
}

/* Media Player Transition */
.media-fade-enter-active,
.media-fade-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.media-fade-enter-from {
    opacity: 0;
    transform: scale(1.05);
}

.media-fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

/* Utility Styles */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

h1,
h2 {
    text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}
</style>

<script setup>
// Logic ทั้งหมดของคุณคงเดิม ไม่มีการแก้ไขแม้แต่ตัวเดียว
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const backend = import.meta.env.VITE_BACKEND

const game = ref(null)
const mainMedia = ref(null)
const owned = ref(false)

const rating = ref(5)
const reviewText = ref('')
const submitting = ref(false)

const hasReviewed = computed(() =>
    game.value?.reviews?.some(r => r.user.id === auth.user?.id)
)

const fetchGame = async () => {
    try {
        const res = await api.get(`/games/${route.params.id}`)
        console.log(res.data)
        game.value = res.data.data
        mainMedia.value = game.value.gameMedias?.[0] || null

        const myReview = game.value.reviews.find(r => r.user.id === auth.user?.id)
        if (myReview) {
            rating.value = myReview.rating
            reviewText.value = myReview.comment
        }
    } catch (e) { }
}

const checkOwned = async () => {
    if (!auth.token) return
    try {
        const res = await api.get('/orders/my')
        owned.value = res.data.data.some(order =>
            order.items.some(i => i.game.id === Number(route.params.id))
        )
    } catch (e) { }
}

const submitReview = async () => {
    if (!rating.value) return
    submitting.value = true
    try {
        await api.post('/reviews', {
            gameId: game.value.id,
            rating: rating.value,
            comment: reviewText.value
        })
        await fetchGame()
    } finally {
        submitting.value = false
    }
}

const buy = () => {
    if (!auth.token) return router.push('/login')
    cart.addToCart(game.value)
    router.push('/buyer/games')
}

onMounted(async () => {
    await fetchGame()
    await checkOwned()
})
</script>
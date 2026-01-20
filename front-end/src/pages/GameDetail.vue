<template>
    <div class="min-h-screen bg-[#09090b] text-zinc-300 pb-20 selection:bg-indigo-500/30">

        <div v-if="game" class="max-w-7xl mx-auto px-6 pt-10">

            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
                <RouterLink to="/" class="hover:text-white transition-colors">Store</RouterLink>
                <span>/</span>
                <span class="text-indigo-400">{{ game.title }}</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div class="lg:col-span-2 space-y-4">
                    <div
                        class="relative group aspect-video overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/5 shadow-2xl shadow-black">
                        <Transition name="fade" mode="out-in">
                            <video v-if="mainMedia?.type === 'VIDEO'" :key="mainMedia.url"
                                :src="backend + mainMedia.url" controls autoplay muted
                                class="w-full h-full object-contain bg-black" />
                            <img v-else-if="mainMedia" :key="mainMedia.url" :src="backend + mainMedia.url"
                                class="w-full h-full object-cover" />
                        </Transition>

                        <div v-if="mainMedia?.type === 'VIDEO'"
                            class="absolute top-4 left-4 bg-indigo-600 text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase">
                            Trailer
                        </div>
                    </div>

                    <div class="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        <div v-for="media in game.gameMedias" :key="media.id" @click="mainMedia = media" :class="[
                            'relative min-w-[120px] h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2',
                            mainMedia?.id === media.id ? 'border-indigo-500 scale-95 shadow-lg shadow-indigo-500/20' : 'border-transparent opacity-50 hover:opacity-100'
                        ]">
                            <img :src="backend + media.url" class="w-full h-full object-cover" />
                            <div v-if="media.type === 'VIDEO'"
                                class="absolute inset-0 flex items-center justify-center bg-black/40 text-white shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-6">
                    <div
                        class="bg-zinc-900/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
                        <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 blur-[80px]"></div>

                        <h1 class="text-4xl font-black text-white tracking-tighter leading-none mb-2">{{ game.title }}
                        </h1>
                        <div class="flex items-center gap-2 mb-6">
                            <div
                                class="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                                👤</div>
                            <p class="text-sm font-bold text-zinc-500">{{ game.seller.username }}</p>
                        </div>

                        <div class="space-y-1 mb-8">
                            <span class="text-xs font-black text-zinc-500 uppercase tracking-widest">Base Game
                                Price</span>
                            <p class="text-5xl font-black text-white tracking-tighter">
                                ฿{{ game.price.toLocaleString() }}
                            </p>
                        </div>

                        <button v-if="!owned" @click="buy"
                            class="w-full group relative bg-indigo-600 hover:bg-indigo-500 py-5 rounded-2xl font-black text-white text-lg transition-all active:scale-95 shadow-xl shadow-indigo-600/20 overflow-hidden">
                            <div
                                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700">
                            </div>
                            <span class="flex items-center justify-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor font-bold">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                เพิ่มลงตะกร้าสินค้า
                            </span>
                        </button>

                        <div v-else
                            class="w-full bg-emerald-500/10 border border-emerald-500/30 py-5 rounded-2xl font-black text-emerald-400 text-center flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor font-bold">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                            เป็นเจ้าของแล้ว
                        </div>
                    </div>

                    <div class="bg-zinc-900/30 rounded-3xl p-6 border border-white/5 space-y-4 text-xs font-bold">
                        <div class="flex justify-between border-b border-white/5 pb-2">
                            <span class="text-zinc-500 uppercase">Release Date</span>
                            <span class="text-zinc-300">Jan 20, 2026</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-zinc-500 uppercase">Developer</span>
                            <span class="text-zinc-300">NJ Gaming Studio</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 bg-zinc-900/30 rounded-[2rem] p-10 border border-white/5 shadow-inner">
                    <h2
                        class="text-xl font-black text-white mb-6 flex items-center gap-3 italic uppercase tracking-tighter">
                        <span class="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                        เกี่ยวกับเกมนี้
                    </h2>
                    <p class="text-zinc-400 leading-relaxed text-lg">{{ game.description }}</p>
                </div>
            </div>

            <div class="mt-12">
                <div class="bg-zinc-900/80 rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative">
                    <h2 class="text-2xl font-black text-white mb-8 tracking-tighter">USER REVIEWS</h2>

                    <div v-if="auth.token && owned"
                        class="mb-12 bg-zinc-800/50 p-8 rounded-3xl border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
                        <p class="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4">
                            {{ hasReviewed ? 'Edit Your Review' : 'Write a Review' }}
                        </p>

                        <div
                            class="flex gap-2 text-3xl mb-6 bg-black/20 w-fit px-4 py-2 rounded-2xl border border-white/5">
                            <button v-for="star in 5" :key="star" @click="rating = star"
                                :class="['transition-all duration-200 hover:scale-125 active:scale-90', star <= rating ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-zinc-700']">
                                ★
                            </button>
                        </div>

                        <textarea v-model="reviewText" rows="3"
                            class="w-full bg-black/40 border border-white/10 text-white rounded-2xl p-5 focus:ring-2 ring-indigo-500 outline-none transition-all placeholder:text-zinc-600 mb-4"
                            placeholder="คุณชอบเกมนี้ตรงไหน? บอกคนอื่นให้รู้ที..." />

                        <button @click="submitReview" :disabled="submitting"
                            class="bg-indigo-600 hover:bg-indigo-500 px-10 py-3 rounded-xl font-black text-white transition-all disabled:opacity-50">
                            {{ submitting ? 'Saving...' : 'บันทึกความเห็น' }}
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div v-if="game.reviews.length === 0"
                            class="col-span-full py-10 text-center text-zinc-600 font-bold uppercase tracking-widest">
                            ยังไม่มีใครรีวิวเกมนี้เลย.. เป็นคนแรกสิ!
                        </div>

                        <div v-for="review in game.reviews" :key="review.id"
                            class="bg-black/20 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <p class="text-white font-black">{{ review.user.username }}</p>
                                    <div class="flex gap-0.5 text-xs text-yellow-400 mt-1">
                                        <span v-for="i in 5" :key="i">{{ i <= review.rating ? '★' : '☆' }}</span>
                                    </div>
                                </div>
                                <div class="bg-indigo-500/10 px-3 py-1 rounded-lg">
                                    <span class="text-[10px] font-black text-indigo-400 italic">RECOMMENDED</span>
                                </div>
                            </div>
                            <p class="text-zinc-400 text-sm italic leading-relaxed">"{{ review.comment }}"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center h-[80vh] gap-4">
            <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-indigo-400 font-black animate-pulse uppercase tracking-[0.3em] text-xs">Loading Assets</p>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
    height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #18181b;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3f3f46;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6366f1;
}
</style>

<script setup>
// ... (Script คงเดิมจากที่คุณเขียนไว้ แค่เปลี่ยน UI) ...
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
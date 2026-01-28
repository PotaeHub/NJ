<template>
    <div class="min-h-screen bg-white text-zinc-900 pb-20 selection:bg-black/10">

        <div v-if="game" class="max-w-7xl mx-auto px-6 pt-10">

            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
                <RouterLink to="/" class="hover:text-black transition-colors">Store</RouterLink>
                <span>/</span>
                <span class="text-black">{{ game.title }}</span>
            </div>

            <!-- GRID -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <!-- LEFT : MEDIA -->
                <div class="lg:col-span-2 space-y-4">

                    <!-- Main Media -->
                    <div
                        class="relative aspect-video overflow-hidden rounded-3xl bg-zinc-100 border border-zinc-200 shadow-xl">
                        <Transition name="fade" mode="out-in">
                            <video v-if="mainMedia?.type === 'VIDEO'" :key="mainMedia.id" :src="backend + mainMedia.url"
                                controls autoplay muted playsinline class="w-full h-full object-contain bg-black" />
                            <img v-else-if="mainMedia" :key="mainMedia.id" :src="backend + mainMedia.url"
                                class="w-full h-full object-cover" />
                        </Transition>

                        <div v-if="mainMedia?.type === 'VIDEO'"
                            class="absolute top-4 left-4 bg-black text-white text-[10px] font-black px-2 py-1 rounded uppercase">
                            ตัวอย่าง
                        </div>
                    </div>

                    <!-- Thumbnails -->
                    <div class="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        <div v-for="media in game.gameMedias" :key="media.id" @click="mainMedia = media" :class="[
                            'relative min-w-[120px] h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2',
                            mainMedia?.id === media.id
                                ? 'border-black scale-95'
                                : 'border-transparent opacity-60 hover:opacity-100'
                        ]">
                            <!-- VIDEO -->
                            <video v-if="media.type === 'VIDEO'" :src="backend + media.url" muted loop
                                preload="metadata" playsinline class="w-full h-full object-cover"
                                @mouseenter="$event.target.play()" @mouseleave="$event.target.pause()" />

                            <!-- IMAGE -->
                            <img v-else :src="backend + media.url" class="w-full h-full object-cover" />

                            <!-- Play Icon -->
                            <div v-if="media.type === 'VIDEO'"
                                class="absolute inset-0 flex items-center justify-center bg-black/30 text-white pointer-events-none">
                                ▶
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT : INFO PANEL -->
                <div class="flex flex-col gap-6">

                    <!-- Buy Box -->
                    <div class="bg-white rounded-3xl p-8 border border-zinc-200 shadow-lg">

                        <h1 class="text-4xl font-black text-black tracking-tight mb-2">
                            {{ game.title }}
                        </h1>

                        <div class="flex items-center gap-2 mb-6">
                            <div
                                class="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] text-zinc-600">
                                👤
                            </div>
                            <p class="text-sm font-bold text-zinc-600">
                                {{ game.seller.username }}
                            </p>
                        </div>

                        <div class="space-y-1 mb-8">
                            <span class="text-xs font-black text-zinc-500 uppercase tracking-widest">
                                Base Game Price
                            </span>
                            <p class="text-5xl font-black text-black tracking-tight">
                                ฿{{ game.price.toLocaleString() }}
                            </p>
                        </div>

                        <button v-if="!owned" @click="buy"
                            class="w-full bg-black hover:bg-zinc-800 py-5 rounded-2xl font-black text-white text-lg transition-all active:scale-95">
                            เพิ่มลงตะกร้าสินค้า
                        </button>

                        <div v-else
                            class="w-full bg-zinc-100 border border-zinc-300 py-5 rounded-2xl font-black text-zinc-700 text-center">
                            ✔ เป็นเจ้าของแล้ว
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="bg-white rounded-3xl p-6 border border-zinc-200 space-y-4 text-xs font-bold">
                        <div class="flex justify-between border-b border-zinc-200 pb-2">
                            <span class="text-zinc-500 uppercase">วันที่วางจำหน่าย</span>
                            <span class="text-zinc-700">
                                {{ new Date(game.createdAt).toLocaleDateString('th-TH') }}
                            </span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-zinc-500 uppercase">นักพัฒนา</span>
                            <span class="text-zinc-700">{{ game.seller.username }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Description -->
            <div class="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 bg-white rounded-3xl p-10 border border-zinc-200">
                    <h2 class="text-xl font-black text-black mb-6 uppercase tracking-tight">
                        เกี่ยวกับเกมนี้
                    </h2>
                    <p class="text-zinc-700 leading-relaxed text-lg">
                        {{ game.description }}
                    </p>
                </div>
            </div>

            <!-- Reviews -->
            <div class="mt-12">
                <div class="bg-white rounded-3xl p-10 border border-zinc-200">
                    <h2 class="text-2xl font-black text-black mb-8 tracking-tight">
                        USER REVIEWS
                    </h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div v-for="review in game.reviews" :key="review.id"
                            class="bg-zinc-50 p-6 rounded-3xl border border-zinc-200">
                            <p class="font-black text-black">
                                {{ review.user.username }}
                            </p>
                            <p class="text-zinc-600 text-sm italic mt-2">
                                "{{ review.comment }}"
                            </p>
                        </div>

                        <div v-if="game.reviews.length === 0"
                            class="col-span-full py-10 text-center text-zinc-500 font-bold uppercase">
                            ยังไม่มีรีวิว
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading -->
        <div v-else class="flex flex-col items-center justify-center h-[80vh] gap-4">
            <div class="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <p class="text-black font-black uppercase tracking-widest text-xs">
                Loading Assets
            </p>
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

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #000;
    border-radius: 10px;
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
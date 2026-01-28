<script setup>
import { useAuthStore } from "@/store/auth"
import { useRouter } from "vue-router"
import { ref, onMounted, onUnmounted } from "vue"

const auth = useAuthStore()
const router = useRouter()
const isScrolled = ref(false)
const BASE_URL = import.meta.env.VITE_BACKEND || ""
// ตรวจสอบการ Scroll เพื่อเปลี่ยนสี Navbar ให้ใสหรือเข้ม
const handleScroll = () => {
    isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const logout = () => {
    auth.logout()
    router.push("/login")
}
</script>

<template>
    <nav :class="[
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6',
        isScrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-zinc-100 py-3 shadow-sm'
            : 'bg-transparent py-5'
    ]">
        <div class="max-w-7xl mx-auto flex justify-between items-center">

            <!-- Logo -->
            <router-link to="/" class="flex items-center gap-3 group">
                <div
                    class="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6">
                    <span class="text-white text-xl font-black italic">N</span>
                </div>
                <div class="leading-none">
                    <span class="text-xl font-black text-black tracking-tighter uppercase block">NJ SHOP</span>
                </div>
            </router-link>

            <!-- Navigation Links -->
            <div class="flex items-center gap-2 md:gap-6">

                <!-- Guest State -->
                <template v-if="!auth.user">
                    <router-link to="/login"
                        class="text-xs font-black text-zinc-500 hover:text-black uppercase tracking-widest transition-colors px-3">
                        ล็อกอิน
                    </router-link>
                    <router-link to="/register"
                        class="bg-black hover:bg-zinc-800 px-6 py-2.5 rounded-full text-xs font-black text-white uppercase tracking-widest transition-all shadow-lg shadow-black/10 active:scale-95">
                        สมัครสมาชิก
                    </router-link>
                </template>

                <!-- Buyer State -->
                <template v-else-if="auth.user.role === 'BUYER'">
                    <div class="hidden md:flex items-center gap-8 mr-4 border-r border-zinc-100 pr-8">
                        <router-link to="/" class="nav-link">หน้าแรก</router-link>
                        <router-link to="/buyer/games" class="nav-link">คลัง</router-link>
                        <router-link to="/buyer/orders" class="nav-link">รายการสั่งซื้อ</router-link>
                    </div>

                    <router-link to="/buyer/profile"
                        class="flex items-center gap-3 group bg-zinc-50 p-1.5 pr-4 rounded-full border border-zinc-200 hover:border-black transition-all">
                        <div
                            class="w-8 h-8 rounded-full overflow-hidden bg-black flex items-center justify-center text-[10px] font-black text-white shadow-inner">
                            <img v-if="auth.user?.avatar" :src="BASE_URL + auth.user.avatar"
                                class="w-full h-full object-cover" />
                            <span v-else>{{ auth.user?.username?.[0]?.toUpperCase() }}</span>
                        </div>
                        <span
                            class="text-xs font-black text-zinc-600 group-hover:text-black uppercase tracking-tight">{{
                                auth.user.username }}</span>
                    </router-link>
                </template>

                <!-- Seller State -->
                <template v-else-if="auth.user.role === 'SELLER'">
                    <router-link to="/seller"
                        class="nav-link-special border-dashed border-zinc-300 text-black hover:bg-black hover:text-white">
                        ศูนย์กลางผู้ขายห
                    </router-link>
                    <router-link to="/profile"
                        class="text-xs font-black text-black uppercase tracking-widest px-2 underline underline-offset-4">
                        {{ auth.user.username }}
                    </router-link>
                </template>

                <!-- Admin State -->
                <template v-else-if="auth.user.role === 'ADMIN'">
                    <div class="hidden lg:flex items-center gap-4 mr-2">
                        <router-link to="/admin/dashboard" class="nav-link">ควมคุม</router-link>
                    </div>
                    <router-link to="/admin/dashboard"
                        class="text-[10px] font-black text-white bg-black px-4 py-2 rounded-lg tracking-[0.2em] uppercase">
                        Admin: {{ auth.user.username }}
                    </router-link>
                </template>

                <!-- Logout Button -->
                <button v-if="auth.user" @click="logout"
                    class="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:bg-rose-50 hover:text-rose-500 transition-all border border-transparent hover:border-rose-100"
                    title="Logout">
                    <span class="text-lg">➜</span>
                </button>
            </div>
        </div>
    </nav>
    <div class="h-[80px]"></div>
</template>

<style scoped>
@import "tailwindcss";

.nav-link {
    @apply text-[11px] font-black text-zinc-400 hover:text-black uppercase tracking-[0.15em] transition-all relative py-2;
}

.nav-link::after {
    content: '';
    @apply absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300;
}

.nav-link:hover::after,
.router-link-active.nav-link::after {
    @apply w-full;
}

.router-link-active.nav-link {
    @apply text-black;
}

.nav-link-special {
    @apply px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95;
}
</style>
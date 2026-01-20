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
            ? 'bg-[#020617]/95 backdrop-blur-xl border-b border-white/10 shadow-lg py-3'
            : 'bg-[#020617]/85 backdrop-blur-xl border-b border-white/5 py-4'
    ]">
        <div class="max-w-7xl mx-auto flex justify-between items-center">

            <router-link to="/" class="flex items-center gap-3 group">
                <div
                    class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
                    <span class="text-white text-xl font-black">N</span>
                </div>
                <div class="leading-none">
                    <span class="text-xl font-black text-white tracking-tighter uppercase block">NJ GAMING</span>
                    <span class="text-[10px] font-bold text-indigo-400 tracking-[0.2em] uppercase">Storefront</span>
                </div>
            </router-link>

            <div class="flex items-center gap-2 md:gap-6">

                <template v-if="!auth.user">
                    <router-link to="/login"
                        class="text-sm font-bold text-slate-300 hover:text-white transition-colors">
                        Login
                    </router-link>
                    <router-link to="/register"
                        class="bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                        Get Started
                    </router-link>
                </template>

                <template v-else-if="auth.user.role === 'BUYER'">
                    <div class="hidden md:flex items-center gap-6 mr-4 border-r border-white/10 pr-6">
                        <router-link to="/" class="nav-link">หน้าแรก</router-link>
                        <router-link to="/buyer/games" class="nav-link">คลัง</router-link>
                        <router-link to="/buyer/orders" class="nav-link">รายการ</router-link>
                    </div>

                    <router-link to="/buyer/profile"
                        class="flex items-center gap-3 group bg-white/5 p-1.5 pr-4 rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all">
                        <div class="w-8 h-8 rounded-xl overflow-hidden
         bg-gradient-to-br from-indigo-500 to-purple-600
         flex items-center justify-center
         text-xs font-black text-white shadow-inner">

                            <!-- ถ้ามี avatar -->
                            <img v-if="auth.user?.avatar" :src="BASE_URL + auth.user.avatar"
                                class="w-full h-full object-cover" />

                            <!-- ถ้าไม่มี avatar -->
                            <span v-else>
                                {{ auth.user?.username?.[0]?.toUpperCase() }}
                            </span>
                        </div>

                        <span class="text-sm font-bold text-slate-200 group-hover:text-white">{{ auth.user.username
                            }}</span>
                    </router-link>
                </template>

                <template v-else-if="auth.user.role === 'SELLER'">
                    <router-link to="/seller"
                        class="nav-link-special text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
                        Seller Hub
                    </router-link>
                    <router-link to="/profile"
                        class="text-sm font-bold text-slate-300 hover:text-white underline underline-offset-8 decoration-indigo-500">
                        {{ auth.user.username }}
                    </router-link>
                </template>

                <template v-else-if="auth.user.role === 'ADMIN'">
                    <div class="hidden lg:flex items-center gap-4 mr-2">
                        <router-link to="/admin/dashboard" class="nav-link text-xs">Console</router-link>
                        <router-link to="/admin/users" class="nav-link text-xs">Users</router-link>
                    </div>
                    <router-link to="/profile"
                        class="text-sm font-black text-rose-400 bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-500/20">
                        ADMIN: {{ auth.user.username }}
                    </router-link>
                </template>

                <button v-if="auth.user" @click="logout"
                    class="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-rose-600/10 hover:text-rose-500 transition-all border border-white/5 hover:border-rose-500/20"
                    title="Logout">
                    ➜]
                </button>
            </div>
        </div>
    </nav>
    <div class="h-[72px]"></div>
</template>

<style scoped>
@import "tailwindcss";

.nav-link {
    @apply text-sm font-bold text-slate-400 hover:text-white transition-all relative py-2 px-1;
}

.nav-link::after {
    content: '';
    @apply absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-500 transition-all duration-300;
}

.nav-link:hover::after,
.router-link-active.nav-link::after {
    @apply w-full;
}

.router-link-active.nav-link {
    @apply text-white;
}

.nav-link-special {
    @apply px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-current/5;
}
</style>
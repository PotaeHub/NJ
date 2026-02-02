<script setup>
import { useAuthStore } from "@/store/auth"
import { useRouter } from "vue-router"
import { ref, onMounted, onUnmounted } from "vue"

const auth = useAuthStore()
const router = useRouter()
const isScrolled = ref(false)

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
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-500',
        isScrolled
            ? 'bg-[#0a0a0b]/80 backdrop-blur-xl py-4 border-b border-white/[0.08] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)]'
            : 'bg-transparent py-8'
    ]">
        <div class="max-w-[1600px] mx-auto px-6 lg:px-12 flex justify-between items-center">

            <router-link to="/" class="flex items-center gap-4 group">
                <div class="relative">
                    <div
                        class="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:rotate-[10deg] group-hover:bg-blue-600">
                        <span
                            class="text-black text-2xl font-black italic tracking-tighter transition-all group-hover:text-white">N</span>
                    </div>
                    <div v-if="isScrolled" class="absolute -inset-2 bg-blue-500/20 blur-xl rounded-full opacity-50">
                    </div>
                </div>
                <div class="flex flex-col leading-none">
                    <span class="text-xl font-black tracking-tighter uppercase italic text-white">NJ <span
                            class="text-blue-500">SHOP</span></span>
                    <span class="text-[7px] font-black text-zinc-500 tracking-[0.4em] uppercase mt-1">Digital Nexus
                        v2</span>
                </div>
            </router-link>

            <div class="flex items-center gap-2 lg:gap-8">

                <div class="hidden md:flex items-center gap-1">
                    <template v-if="!auth.user">
                        <router-link to="/" class="nav-item">Store</router-link>
                        <router-link to="/login" class="nav-item">Login</router-link>
                    </template>

                    <template v-else-if="auth.user.role === 'BUYER'">
                        <router-link to="/" class="nav-item">Market</router-link>
                        <router-link to="/buyer/orders" class="nav-item">Orders</router-link>
                        <router-link to="/buyer/library" class="nav-item">Library</router-link>
                    </template>

                    <template v-else>
                        <router-link :to="auth.user.role === 'ADMIN' ? '/admin/dashboard' : '/seller/dashboard'"
                            class="nav-item border border-white/5 bg-white/[0.02] rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                            Dashboard
                        </router-link>
                    </template>
                </div>

                <div class="flex items-center gap-4 pl-6 border-l border-white/10 ml-2">

                    <router-link v-if="!auth.user" to="/register" class="btn-signup">
                        Join Now
                    </router-link>

                    <div v-else
                        class="flex items-center gap-4 bg-white/[0.03] p-1 pr-4 rounded-[1.2rem] border border-white/5 group hover:border-blue-500/30 transition-all">
                        <div
                            class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-blue-500/20">
                            {{ auth.user.username?.charAt(0).toUpperCase() }}
                        </div>

                        <div class="flex flex-col">
                            <span
                                class="text-[9px] font-black text-white leading-tight uppercase tracking-widest truncate max-w-[80px]">
                                {{ auth.user.username }}
                            </span>
                            <span class="text-[7px] font-black text-blue-400 uppercase tracking-tighter opacity-70">
                                {{ auth.user.role }}
                            </span>
                        </div>

                        <button @click="logout"
                            class="ml-2 w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-rose-500 hover:text-white transition-all text-zinc-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </nav>

    <div :class="[isScrolled ? 'h-[76px]' : 'h-[110px]', 'transition-all duration-500 pointer-events-none']"></div>
</template>

<style scoped>
@import "tailwindcss";

/* 🌑 NAVIGATION ITEM */
.nav-item {
    @apply px-4 py-2 text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-[0.2em] transition-all relative flex items-center;
}

/* 🔹 Underline Effect */
.nav-item::after {
    content: '';
    @apply absolute bottom-0 left-4 right-4 h-[2px] bg-blue-500 scale-x-0 transition-transform duration-500 origin-right rounded-full shadow-[0_0_10px_#3b82f6];
}

.nav-item:hover::after {
    @apply scale-x-100 origin-left;
}

/* 🔥 SIGNUP BUTTON (Glassmorphism + Neon) */
.btn-signup {
    @apply bg-blue-600 text-white px-7 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37_99_235_0.4)] active:scale-95 transition-all;
}


/* ACTIVE STATE */
.router-link-active.nav-item {
    @apply text-white;
}

.router-link-active.nav-item::after {
    @apply scale-x-100;
}
</style>
<template>
  <div class="flex h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">

    <div class="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none">
    </div>

    <aside class="w-80 bg-[#0a0a0b]/80 backdrop-blur-2xl border-r border-white/5 flex flex-col relative z-50">
      <div class="p-10 flex items-center gap-4">
        <div
          class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform hover:rotate-12">
          <span class="text-black text-2xl font-black italic tracking-tighter">N</span>
        </div>
        <div class="flex flex-col leading-none">
          <span class="text-xl font-black italic uppercase tracking-tighter">NJ <span
              class="text-blue-500">ADMIN</span></span>
          <span class="text-[8px] font-black text-zinc-500 tracking-[0.4em] uppercase mt-1">Command Center</span>
        </div>
      </div>

      <nav class="flex-1 px-6 space-y-2 mt-4">
        <div class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] px-4 mb-6 italic">
          System Protocol
        </div>

        <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" custom v-slot="{ navigate, isActive }">
          <div @click="navigate"
            class="group flex items-center gap-4 px-5 py-4 rounded-2xl font-bold cursor-pointer transition-all duration-300 relative overflow-hidden"
            :class="isActive
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]'
              : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'">

            <div v-if="isActive"
              class="absolute left-0 w-1.5 h-6 bg-blue-500 rounded-r-full shadow-[0_0_15px_#3b82f6]" />

            <component :is="link.icon" class="w-5 h-5 transition-transform group-hover:scale-110" />
            <span class="text-xs uppercase tracking-widest italic">{{ link.name }}</span>

            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity">
            </div>
          </div>
        </RouterLink>
      </nav>

      <div class="p-6">
        <div
          class="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-md">
          <div class="flex items-center gap-4 mb-6">
            <div class="relative">
              <div
                class="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center p-0.5 shadow-lg shadow-blue-600/20">
                <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full rounded-[14px] object-cover" />
                <div v-else class="font-black text-white text-xl italic">{{ auth.user?.username?.charAt(0).toUpperCase()
                  }}</div>
              </div>
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#0a0a0b] rounded-full">
              </div>
            </div>
            <div class="overflow-hidden">
              <p class="text-xs font-black uppercase italic tracking-wider truncate">{{ auth.user?.username }}</p>
              <p class="text-[9px] font-bold text-blue-500 uppercase tracking-tighter">Root Administrator</p>
            </div>
          </div>

          <button @click="logout"
            class="w-full py-3 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 border border-white/5 hover:border-rose-500/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2">
            <LogOut class="w-3.5 h-3.5" />
            Terminate Session
          </button>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col overflow-hidden relative">
      <header
        class="h-24 bg-[#0a0a0b]/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-12 relative z-40">
        <div class="flex items-center gap-4">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
          <h2 class="font-black text-zinc-500 text-[10px] uppercase tracking-[0.5em] italic">
            Operational Status: <span class="text-zinc-200">System Nominal</span>
          </h2>
        </div>

        <div class="flex items-center gap-6">
          <div
            class="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-[10px] font-bold text-zinc-500 uppercase italic">
            Server Time: <span class="text-zinc-300">{{ new Date().toLocaleTimeString() }}</span>
          </div>
        </div>
      </header>

      <section class="flex-1 p-12 overflow-y-auto relative scroll-smooth">
        <div
          class="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/[0.03] blur-[150px] rounded-full pointer-events-none">
        </div>

        <RouterView v-slot="{ Component }">
          <Transition name="fade-slide" mode="out-in">
            <div class="h-full">
              <component :is="Component" />
            </div>
          </Transition>
        </RouterView>
      </section>
    </main>

  </div>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useAuthStore } from "@/store/auth"
import {
  LayoutDashboard,
  Gamepad2,
  Users,
  ShoppingBag,
  Tag,
  LogOut
} from "lucide-vue-next"
import { computed } from "vue"

const router = useRouter()
const auth = useAuthStore()

const BACKEND_URL = import.meta.env.VITE_BACKEND

const avatarUrl = computed(() => {
  if (!auth.user?.avatar) return null
  return `${BACKEND_URL}${auth.user.avatar}`
})

const navLinks = [
  { name: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Game Engine", to: "/admin/games", icon: Gamepad2 },
  { name: "User Base", to: "/admin/users", icon: Users },
  { name: "Order Logs", to: "/admin/orders", icon: ShoppingBag },
  { name: "Categories", to: "/admin/category", icon: Tag }
]

const logout = () => {
  auth.logout()
  router.push("/login")
}
</script>

<style scoped>
@import "tailwindcss";

/* Smooth Scrollbar */
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}

/* Page Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
  filter: blur(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
  filter: blur(10px);
}

/* Sidebar Active Link Style Overrides */
.router-link-active {
  pointer-events: none;
}
</style>
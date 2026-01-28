<template>
  <div class="flex h-screen bg-slate-50 text-slate-900">

    <!-- SIDEBAR -->
    <aside class="w-72 bg-white border-r flex flex-col">
      <div class="p-8 flex items-center gap-3">
        <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <span class="text-white text-xl font-black">N</span>
        </div>
        <span class="text-xl font-black">NJ Gaming</span>
      </div>

      <nav class="flex-1 px-4 space-y-1">
        <div class="text-[10px] font-black text-slate-400 uppercase px-4 mb-4">
          Main Menu
        </div>

        <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" custom v-slot="{ navigate, isActive }">
          <div @click="navigate"
            class="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold cursor-pointer transition relative" :class="isActive
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-slate-600 hover:bg-slate-100'">
            <div v-if="isActive" class="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full" />
            <component :is="link.icon" class="w-5 h-5" />
            {{ link.name }}
          </div>
        </RouterLink>
      </nav>

      <!-- USER -->
      <div class="p-4 border-t">
        <div class="bg-slate-900 rounded-3xl p-4 text-white">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full  flex items-center justify-center font-bold">
              <img v-if="avatarUrl" :src="avatarUrl" class="w-10 h-10 rounded-full object-cover" />
            </div>
            <div>
              <p class=" text-xs font-bold">{{ auth.user?.username }}</p>
              <p class="text-[10px] text-slate-400">Admin</p>
            </div>
          </div>

          <button @click="logout" class="w-full py-2 bg-white/10 hover:bg-rose-500 rounded-xl text-xs font-bold">
            Sign Out
          </button>
        </div>
      </div>
    </aside>

    <!-- CONTENT -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <header class="h-20 bg-white border-b flex items-center px-10">
        <h2 class="font-bold text-slate-500 text-xs uppercase tracking-widest">
          Admin Panel
        </h2>
      </header>

      <section class="flex-1 p-10 overflow-y-auto">
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
  ShoppingBag
} from "lucide-vue-next"
import { computed } from "vue"

const router = useRouter()
const auth = useAuthStore()

const BACKEND_URL = import.meta.env.VITE_BACKEND
console.log("USER:", auth.user)
console.log("AVATAR:", auth.user?.avatar)

const avatarUrl = computed(() => {
  if (!auth.user?.avatar) return null
  return `${BACKEND_URL}${auth.user.avatar}`
})
console.log("AVATAR URL:", avatarUrl.value)

const navLinks = [
  { name: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Games", to: "/admin/games", icon: Gamepad2 },
  { name: "Users", to: "/admin/users", icon: Users },
  { name: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { name: "Categories", to: "/admin/category", icon: ShoppingBag }
]

const logout = () => {
  auth.logout()
  router.push("/login")
}
</script>

<style>
@import "tailwindcss";

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

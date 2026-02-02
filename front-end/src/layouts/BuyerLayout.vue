<template>
    <div class="min-h-screen bg-[#0a0a0b] relative overflow-x-hidden selection:bg-blue-500/30">

        <div class="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
            <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full"></div>
            <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[100px] rounded-full">
            </div>
        </div>

        <Navbarpublic />

        <main class="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
            <router-view v-slot="{ Component }">
                <transition name="page-slide" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>

        <div
            class="fixed inset-0 opacity-[0.02] pointer-events-none z-[1] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
        </div>
    </div>
</template>

<script setup>
import Navbarpublic from '../components/Navbarpublic.vue';
</script>

<style scoped>
@import "tailwindcss";

.page-slide-enter-active,
.page-slide-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.page-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

/* ปรับแต่ง Scrollbar สำหรับทั้ง Layout */
:global(::-webkit-scrollbar) {
    width: 8px;
}

:global(::-webkit-scrollbar-track) {
    background: #0a0a0b;
}

:global(::-webkit-scrollbar-thumb) {
    background: #1f1f23;
    border-radius: 10px;
}

:global(::-webkit-scrollbar-thumb:hover) {
    background: #3b82f6;
    /* สีฟ้าเมื่อ Hover scrollbar */
}
</style>
<template>
    <div class="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden">

        <!-- GLOBAL BACKGROUND EFFECT -->
        <div class="fixed inset-0 -z-10">
            <div class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px]
                  bg-indigo-600/10 blur-[120px] rounded-full"></div>

            <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px]
                  bg-purple-600/10 blur-[120px] rounded-full"></div>

            <!-- Noise -->
            <div class="absolute inset-0 bg-noise opacity-[0.03]"></div>
        </div>

        <Navbarpublic />

        <main class="relative z-10">
            <RouterView />
        </main>

        <HomeFooter />
    </div>
</template>

<script setup>
import Navbarpublic from '@/components/Navbarpublic.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
</script>

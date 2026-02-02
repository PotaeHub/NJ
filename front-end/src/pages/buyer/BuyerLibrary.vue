<template>
    <div class="min-h-screen bg-[#0a0a0b] text-slate-100 px-6 md:px-10 py-16">

        <!-- HEADER -->
        <div class="max-w-7xl mx-auto mb-12 flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-black tracking-tight text-white flex items-center gap-4 uppercase italic">
                    <span class="bg-blue-600/20 p-3 rounded-xl shadow-[0_0_30px_rgba(37_99_235_0.4)]">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </span>
                    MY LIBRARY
                </h1>
                <p class="text-zinc-500 mt-2 text-sm font-bold uppercase tracking-wide">
                    รวมคอลเลกชันเกมทั้งหมดของคุณ
                </p>
            </div>

            <div
                class="text-xs font-black bg-white/[0.03] px-6 py-3 rounded-full border border-white/10 backdrop-blur-xl uppercase tracking-widest">
                {{ libraries.length }} Games
            </div>
        </div>

        <div class="max-w-7xl mx-auto">

            <!-- LOADING -->
            <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <div v-for="i in 4" :key="i"
                    class="bg-white/[0.04] rounded-3xl h-72 animate-pulse border border-white/10">
                </div>
            </div>

            <!-- EMPTY -->
            <div v-else-if="libraries.length === 0"
                class="text-center py-24 bg-white/[0.02] rounded-3xl border border-white/10 backdrop-blur-xl">
                <div class="text-6xl mb-6 opacity-60">🕹️</div>
                <h3 class="text-xl font-black text-white uppercase tracking-wide">
                    คลังเกมของคุณยังว่าง
                </h3>
                <p class="text-zinc-500 mt-3 mb-8">
                    ออกไปค้นหาเกมใหม่ ๆ ที่น่าสนใจกันเถอะ
                </p>
                <router-link to="/" class="inline-block px-10 py-4 bg-blue-600 rounded-2xl text-white font-black uppercase tracking-[0.3em]
                    hover:bg-blue-500 transition-all">
                    ไปที่ร้านค้า
                </router-link>
            </div>

            <!-- LIBRARY GRID -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                <div v-for="item in libraries" :key="item.id" class="group relative bg-white/[0.03] backdrop-blur-xl rounded-3xl overflow-hidden
                           transition-all duration-500
                           hover:-translate-y-2
                           hover:shadow-[0_25px_60px_-20px_rgba(37_99_235_0.45)]
                           border border-white/10 hover:border-blue-500/40">

                    <!-- IMAGE -->
                    <div class="relative aspect-[16/10] overflow-hidden">
                        <img v-if="item.game?.gameMedias?.length" :src="BASE_URL + item.game.gameMedias[0].url"
                            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                        <div v-else class="w-full h-full bg-[#161618] flex items-center justify-center">
                            <span class="text-zinc-500 text-sm uppercase tracking-widest">No Image</span>
                        </div>

                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                        </div>

                        <!-- PLAY BUTTON -->
                        <div
                            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button class="bg-blue-600 text-white p-4 rounded-full
                                       shadow-[0_0_40px_rgba(37_99_235_0.6)]
                                       transform scale-75 group-hover:scale-100
                                       transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- INFO -->
                    <div class="p-6">
                        <h2 class="font-black text-lg text-white uppercase italic tracking-tight
                                   group-hover:text-blue-400 transition-colors line-clamp-1">
                            {{ item.game?.title || "ไม่ทราบชื่อเกม" }}
                        </h2>

                        <div
                            class="flex items-center text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-2">
                            คลังส่วนตัว •
                            {{ new Date(item.order.createdAt).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            }) }}
                        </div>

                        <router-link :to="{ name: 'game-detail', params: { id: item.game.id } }" class="block w-full mt-5 py-3 rounded-xl
                                   bg-white/[0.04] hover:bg-blue-600
                                   text-sm font-black uppercase tracking-wide
                                   transition-all border border-white/10
                                   hover:border-blue-500/50 text-center
                                   hover:text-white">
                            รายละเอียดเกม
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "@/services/api"

const libraries = ref([])
const loading = ref(true)
const BASE_URL = import.meta.env.VITE_BACKEND || ""

onMounted(async () => {
    try {
        const res = await api.get("/buyer/library")
        libraries.value = res.data.data
    } catch (err) {
        console.error("โหลด library ไม่สำเร็จ", err)
        libraries.value = []
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
@import "tailwindcss";

.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

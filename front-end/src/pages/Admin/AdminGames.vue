<script setup>
import { ref, onMounted } from "vue"
import api from "@/services/api"
import GameFormModal from "@/components/admin/GameFormModal.vue"
import DeleteConfirmModal from "../../components/admin/users/DeleteConfirmModal.vue"
import { Plus, LayoutGrid, Trash2, Edit3, Image as ImageIcon } from 'lucide-vue-next'

const games = ref([])
const loading = ref(false)
const BACKEND_URL = import.meta.env.VITE_BACKEND

const showModal = ref(false)
const showDeletePopup = ref(false)
const selectedGame = ref(null)

const loadGames = async () => {
    loading.value = true
    try {
        const res = await api.get("/admin/games")
        games.value = res.data
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

const openCreate = () => {
    selectedGame.value = null
    showModal.value = true
}

const openEdit = (game) => {
    selectedGame.value = game
    showModal.value = true
}

const handleDeleteClick = (game) => {
    selectedGame.value = game
    showDeletePopup.value = true
}

const onConfirmDelete = async () => {
    if (!selectedGame.value) return
    try {
        await api.delete(`/admin/games/${selectedGame.value.id}`)
        showDeletePopup.value = false
        loadGames()
    } catch (err) {
        console.error(err)
        alert("Delete failed")
    }
}

onMounted(loadGames)
</script>

<template>
    <div class="min-h-screen bg-[#050505] text-white font-[Prompt] selection:bg-blue-500/30 p-6 lg:p-12 relative">

        <div class="fixed top-0 right-0 w-[500px] h-[500px] bg-white/3 blur-[120px] pointer-events-none"></div>

        <div class="max-w-7xl mx-auto space-y-10 relative z-10">
            <header
                class="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                <div class="space-y-4">
                    <div class="flex items-center gap-5">
                        <div
                            class="p-4 bg-blue-600 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] transform -rotate-3">
                            <LayoutGrid :size="32" stroke-width="2.5" class="text-white" />
                        </div>
                        <div>
                            <h1 class="text-5xl font-black tracking-tighter uppercase italic leading-none">
                                ASSET <span class="text-blue-500">ENGINE</span>
                            </h1>
                            <p class="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 italic">
                                ศูนย์ควบคุมและกระจายสินทรัพย์ดิจิทัล
                            </p>
                        </div>
                    </div>
                </div>

                <button @click="openCreate"
                    class="group flex items-center gap-4 bg-white text-black font-black px-10 py-5 rounded-[2rem] shadow-2xl transition-all active:scale-95 hover:bg-blue-500 hover:text-white tracking-[0.2em] text-[10px] uppercase">
                    <Plus class="h-4 w-4 transition-transform group-hover:rotate-90" stroke-width="4" />
                    Deploy New Game
                </button>
            </header>

            <div
                class="bg-[#0a0a0b]/60 backdrop-blur-2xl rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative">

                <Transition name="fade">
                    <div v-if="loading"
                        class="absolute inset-0 z-50 bg-[#050505]/80 backdrop-blur-md flex items-center justify-center">
                        <div class="flex flex-col items-center gap-6">
                            <div class="relative">
                                <div class="w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
                                <div
                                    class="w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin absolute top-0">
                                </div>
                            </div>
                            <span class="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 animate-pulse">
                                Accessing Database...
                            </span>
                        </div>
                    </div>
                </Transition>

                <div class="overflow-x-auto">
                    <table class="w-full text-left bg-white/5">
                        <thead>
                            <tr class="bg-white/5 border-b border-white/5">
                                <th class="px-10 py-8 text-[16px] font-black  text-zinc-500 italic">
                                    สื่อภาพ</th>
                                <th class="px-10 py-8 text-[16px] font-black  text-zinc-500 italic">
                                    ชื่อเกม</th>
                                <th class="px-10 py-8 text-[16px] font-black  text-zinc-500 italic text-center">
                                    ราคา</th>
                                <th class="px-10 py-8 text-[16px] font-black  text-zinc-500 italic text-center">
                                    ในสต็อก</th>
                                <th class="px-10 py-8 text-[16px] font-black  text-zinc-500 italic text-center">
                                    Status</th>
                                <th class="px-10 py-8 text-[16px] font-black  text-zinc-500 italic text-right">
                                    Terminal</th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-white/[0.03]">
                            <tr v-for="g in games" :key="g.id"
                                class="group hover:bg-white/[0.02] transition-all duration-500">

                                <td class="px-10 py-6">
                                    <div v-if="g.gameMedias?.length"
                                        class="flex -space-x-5 group-hover:space-x-2 transition-all duration-700">
                                        <div v-for="(img, idx) in g.gameMedias.filter(m => m.type === 'IMAGE').slice(0, 3)"
                                            :key="img.id" class="relative group/img">
                                            <img :src="BACKEND_URL + img.url"
                                                class="w-16 h-16 object-cover rounded-[1.25rem] border-2 border-[#0a0a0b] shadow-xl group-hover/img:scale-110 transition-transform" />
                                        </div>
                                    </div>
                                    <div v-else
                                        class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-600">
                                        <ImageIcon :size="24" />
                                    </div>
                                </td>

                                <td class="px-10 py-6">
                                    <div class="flex flex-col">
                                        <span
                                            class="text-lg font-black tracking-tighter text-white  italic group-hover:text-blue-400 transition-colors">
                                            {{ g.title }}
                                        </span>
                                        <span class="text-[9px] font-bold text-zinc-600 tracking-widest ">ID:
                                            {{ g.id }}</span>
                                    </div>
                                </td>

                                <td class="px-10 py-6 text-center">
                                    <div
                                        class="inline-block px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                        <span class="text-sm font-black text-blue-400">฿{{ g.price.toLocaleString()
                                        }}</span>
                                    </div>
                                </td>

                                <td class="px-10 py-6 text-center">
                                    <span class="text-sm font-black italic"
                                        :class="g.stock > 0 ? 'text-zinc-300' : 'text-rose-500'">
                                        {{ g.stock.toString().padStart(2, '0') }}
                                    </span>
                                </td>

                                <td class="px-10 py-6 text-center">
                                    <div class="flex justify-center">
                                        <span v-if="g.status === 'PUBLISHED'"
                                            class="px-4 py-1 bg-emerald-500/10 text-emerald-500 text-[14px] font-black rounded-full border border-emerald-500/20 tracking-widest">
                                            เปิดใช้งาน
                                        </span>
                                        <span v-else
                                            class="px-4 py-1 bg-zinc-500/10 text-zinc-500 text-[14px] font-black rounded-full border border-zinc-500/20 tracking-widest">
                                            ปิดใช้งาน
                                        </span>
                                    </div>
                                </td>

                                <td class="px-10 py-6 text-right">
                                    <div
                                        class="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-500">
                                        <button @click="openEdit(g)"
                                            class="p-3 bg-white/5 hover:bg-white hover:text-black rounded-xl border border-white/10 transition-all">
                                            <Edit3 :size="16" />
                                        </button>
                                        <button @click="handleDeleteClick(g)"
                                            class="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl border border-rose-500/20 transition-all">
                                            <Trash2 :size="16" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <DeleteConfirmModal :show="showDeletePopup" :itemName="selectedGame?.title" @close="showDeletePopup = false"
            @confirm="onConfirmDelete" />
        <GameFormModal :show="showModal" :game="selectedGame" @close="showModal = false" @success="loadGames" />
    </div>
</template>

<style scoped>
@import "tailwindcss";

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Custom Scrollbar for the table */
::-webkit-scrollbar {
    height: 4px;
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
}
</style>

<script setup>
import { ref, onMounted } from "vue"
import api from "@/services/api"
import GameFormModal from "@/components/admin/GameFormModal.vue"
import DeleteConfirmModal from "../../components/admin/users/DeleteConfirmModal.vue"

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
    <div class="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50/50">

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 class="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    <span class="p-2 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                        </svg>
                    </span>
                    Game Inventory
                </h1>
                <p class="text-slate-500 mt-1 ml-1">Manage your digital assets and pricing</p>
            </div>

            <button @click="openCreate"
                class="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
                </svg>
                Add New Game
            </button>
        </div>

        <div class="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden relative">

            <div v-if="loading"
                class="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                <div class="flex flex-col items-center gap-3">
                    <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin">
                    </div>
                    <span class="text-indigo-600 font-bold animate-pulse uppercase tracking-widest text-xs">Loading
                        Games...</span>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50/50 border-b border-slate-100">
                            <th class="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Media
                                Preview</th>
                            <th class="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Game
                                Information</th>
                            <th
                                class="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">
                                Price</th>
                            <th
                                class="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">
                                Stock</th>
                            <th
                                class="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">
                                Status</th>
                            <th class="px-6 py-5 text-right text-slate-400 uppercase text-[11px]">Actions</th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-50">
                        <tr v-for="g in games" :key="g.id" class="hover:bg-slate-50/50 transition-colors group">

                            <td class="px-6 py-5">
                                <div v-if="g.gameMedias?.length" class="flex -space-x-4">
                                    <div v-for="(img, idx) in g.gameMedias.filter(m => m.type === 'IMAGE').slice(0, 3)"
                                        :key="img.id" class="relative transition-transform group-hover:translate-x-1"
                                        :style="{ zIndex: 10 - idx }">
                                        <img :src="BACKEND_URL + img.url"
                                            class="w-14 h-14 object-cover rounded-2xl border-4 border-white shadow-sm ring-1 ring-slate-100" />
                                    </div>
                                    <div v-if="g.gameMedias.length > 3"
                                        class="w-14 h-14 rounded-2xl bg-slate-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm z-0">
                                        +{{ g.gameMedias.length - 3 }}
                                    </div>
                                </div>
                                <div v-else
                                    class="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </td>

                            <td class="px-6 py-5">
                                <div class="flex flex-col">
                                    <span
                                        class="text-base font-bold text-slate-700 leading-tight group-hover:text-indigo-600 transition-colors">{{
                                            g.title }}</span>
                                    <span class="text-xs text-slate-400 mt-1">Ref ID: #{{ g.id.toString().slice(-6)
                                        }}</span>
                                </div>
                            </td>

                            <td class="px-6 py-5 text-center">
                                <span
                                    class="inline-block px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl font-mono font-bold text-sm border border-indigo-100">
                                    ฿{{ g.price.toLocaleString() }}
                                </span>
                            </td>

                            <td class="px-6 py-5 text-center">
                                <div class="flex flex-col items-center">
                                    <span
                                        :class="g.stock <= 5 ? 'text-rose-500 font-black underline decoration-2' : 'text-slate-600 font-semibold'"
                                        class="text-sm">
                                        {{ g.stock }}
                                    </span>
                                    <span class="text-[9px] uppercase tracking-tighter text-slate-400">units</span>
                                </div>
                            </td>

                            <td class="px-6 py-5 text-center">
                                <span :class="{
                                    'bg-emerald-50 text-emerald-600 border-emerald-200': g.status === 'PUBLISHED',
                                    'bg-slate-50 text-slate-400 border-slate-200': g.status === 'DRAFT',
                                    'bg-rose-50 text-rose-500 border-rose-200': g.status === 'SOLD'
                                }"
                                    class="px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest">
                                    {{ g.status }}
                                </span>
                            </td>

                            <td class="px-6 py-5 text-right">
                                <div class="flex justify-end gap-2">
                                    <button @click="openEdit(g)"
                                        class="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                        title="Edit">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button @click="handleDeleteClick(g)"
                                        class="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                        title="Delete">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="games.length === 0 && !loading">
                            <td colspan="6" class="px-6 py-24 text-center">
                                <div class="flex flex-col items-center opacity-40">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-300" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                            stroke-width="1.5" />
                                    </svg>
                                    <p class="mt-4 font-bold text-slate-400 uppercase tracking-widest text-xs">No games
                                        found in your inventory</p>
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
</template>
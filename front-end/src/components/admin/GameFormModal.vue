<script setup>

import { ref, watch } from "vue"
import api from "@/services/api"
import { X, Plus, Image as ImageIcon, Film, Save, Trash2, Tag, Box, DollarSign } from 'lucide-vue-next'

const BASE_URL = import.meta.env.VITE_BACKEND

const props = defineProps({
    show: Boolean,
    game: Object
})

const emit = defineEmits(["close", "success"])

/* ================= BASIC DATA ================= */
const title = ref("")
const description = ref("")
const price = ref(0)
const stock = ref(0)
const status = ref("PUBLISHED")
const categories = ref([])
const selectedCategories = ref([])

/* ================= MEDIA STATE ================= */
const imageInput = ref(null)
const videoInput = ref(null)
const oldImages = ref([])
const oldVideos = ref([])
const newImageFiles = ref([])
const newVideoFiles = ref([])
const loading = ref(false)

/* ================= HELPERS ================= */
const getPreviewUrl = (file) => URL.createObjectURL(file)

/* ================= ACTIONS ================= */
const fetchCategories = async () => {
    try {
        const res = await api.get("/admin/category")
        categories.value = res.data.data
    } catch (err) { console.error("Fetch categories failed", err) }
}
fetchCategories()

watch(() => props.game, (g) => {
    if (!g) {
        // Reset form if creating new
        title.value = ""; description.value = ""; price.value = 0; stock.value = 0;
        status.value = "PUBLISHED"; oldImages.value = []; oldVideos.value = [];
        newImageFiles.value = []; newVideoFiles.value = []; selectedCategories.value = [];
        return
    }
    title.value = g.title
    description.value = g.description
    price.value = g.price
    stock.value = g.stock
    status.value = g.status
    oldImages.value = []
    oldVideos.value = []
    newImageFiles.value = []
    newVideoFiles.value = []
    g.gameMedias?.forEach(m => {
        if (m.type === "IMAGE") oldImages.value.push(m)
        if (m.type === "VIDEO") oldVideos.value.push(m)
    })
    selectedCategories.value = g.categories?.map(c => c.id) || []
}, { immediate: true })

const addImages = (files, e) => {
    Array.from(files).forEach(f => f.type.startsWith("image/") && newImageFiles.value.push(f))
    e.target.value = null
}

const addVideos = (files, e) => {
    Array.from(files).forEach(f => f.type.startsWith("video/") && newVideoFiles.value.push(f))
    e.target.value = null
}

const removeOldImage = i => oldImages.value.splice(i, 1)
const removeOldVideo = i => oldVideos.value.splice(i, 1)
const removeNewImage = i => newImageFiles.value.splice(i, 1)
const removeNewVideo = i => newVideoFiles.value.splice(i, 1)

const toggleCategory = (id) => {
    const i = selectedCategories.value.indexOf(id)
    i > -1 ? selectedCategories.value.splice(i, 1) : selectedCategories.value.push(id)
}

const submit = async () => {
    loading.value = true
    try {
        const fd = new FormData()
        fd.append("title", title.value)
        fd.append("description", description.value)
        fd.append("price", price.value)
        fd.append("stock", stock.value)
        fd.append("status", status.value)
        fd.append("categories", JSON.stringify(selectedCategories.value))
        const keepMediaIds = [...oldImages.value.map(m => m.id), ...oldVideos.value.map(m => m.id)]
        fd.append("keepMediaIds", JSON.stringify(keepMediaIds))
        newImageFiles.value.forEach(f => fd.append("images", f))
        newVideoFiles.value.forEach(f => fd.append("videos", f))

        if (props.game) await api.put(`/admin/games/${props.game.id}`, fd)
        else await api.post("/admin/games", fd)

        emit("success"); emit("close")
    } catch (err) {
        alert("Save failed")
    } finally { loading.value = false }
}
</script>

<template>
    <div v-if="show"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[60] p-4 overflow-hidden">
        <div
            class="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl flex flex-col max-h-[92vh] border border-white/20 animate-modal-in">

            <div
                class="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-[3rem]">
                <div class="flex items-center gap-5">
                    <div
                        class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <component :is="game ? Edit3 : Plus" :size="28" />
                    </div>
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 tracking-tight">{{ game ? "Edit Game Detail" :
                            "Add New Game" }}</h2>
                        <p class="text-slate-400 font-medium text-sm">Product & Multimedia Asset Management</p>
                    </div>
                </div>
                <button @click="emit('close')"
                    class="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-100 text-slate-400 transition-all hover:rotate-90">
                    <X :size="32" />
                </button>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar p-10 bg-slate-50/50">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    <div class="lg:col-span-7 space-y-8">
                        <div class="space-y-6 bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm">
                            <div class="flex items-center gap-3">
                                <Box class="text-indigo-600" :size="20" />
                                <h3 class="font-black text-slate-900 uppercase tracking-widest text-xs">General
                                    Information</h3>
                            </div>
                            <div class="space-y-5">
                                <div class="group">
                                    <label class="label-style">Game Title</label>
                                    <input v-model="title" class="input-new" placeholder="Enter game title..." />
                                </div>
                                <div>
                                    <label class="label-style">Description</label>
                                    <textarea v-model="description" rows="5" class="input-new resize-none"
                                        placeholder="Write something about the game..." />
                                </div>
                            </div>
                        </div>

                        <div class="space-y-6">
                            <div class="flex justify-between items-center px-2">
                                <div class="flex items-center gap-3">
                                    <ImageIcon class="text-indigo-600" :size="20" />
                                    <h3 class="font-black text-slate-900 uppercase tracking-widest text-xs">Image
                                        Gallery</h3>
                                </div>
                                <button @click="imageInput.click()"
                                    class="text-[10px] font-black uppercase text-indigo-600 hover:underline">+ Add
                                    Images</button>
                            </div>
                            <input ref="imageInput" type="file" multiple accept="image/*" hidden
                                @change="addImages($event.target.files, $event)" />

                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div v-for="(img, i) in oldImages" :key="'old-img-' + i" class="media-box group">
                                    <img :src="BASE_URL + img.url" class="media-content" />
                                    <div class="media-mask"><button @click="removeOldImage(i)" class="remove-icon">
                                            <Trash2 :size="18" />
                                        </button></div>
                                    <span class="media-label bg-slate-900">CLOUD</span>
                                </div>
                                <div v-for="(f, i) in newImageFiles" :key="'new-img-' + i"
                                    class="media-box group ring-2 ring-indigo-500 ring-offset-2">
                                    <img :src="getPreviewUrl(f)" class="media-content" />
                                    <div class="media-mask"><button @click="removeNewImage(i)" class="remove-icon">
                                            <Trash2 :size="18" />
                                        </button></div>
                                    <span class="media-label bg-indigo-600">NEW</span>
                                </div>
                                <button @click="imageInput.click()" class="media-add-btn">
                                    <Plus :size="24" /><span class="text-[10px] font-bold">IMAGE</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-5 space-y-8">
                        <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/50 space-y-8">

                            <div class="grid grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label class="label-style text-indigo-600">Price (THB)</label>
                                    <div class="relative">
                                        <input v-model.number="price" type="number"
                                            class="input-new pl-12 font-bold text-lg" />
                                        <DollarSign class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            :size="18" />
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <label class="label-style">Stock</label>
                                    <input v-model.number="stock" type="number" class="input-new font-bold text-lg" />
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div class="flex items-center gap-3">
                                    <Tag class="text-indigo-600" :size="18" />
                                    <label class="label-style">Categories</label>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="cat in categories" :key="cat.id" type="button"
                                        @click="toggleCategory(cat.id)"
                                        :class="['cat-badge', selectedCategories.includes(cat.id) ? 'cat-active' : 'cat-inactive']">
                                        {{ cat.name }}
                                    </button>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="label-style">Status</label>
                                <select v-model="status"
                                    class="input-new font-bold appearance-none bg-slate-50 cursor-pointer">
                                    <option value="PUBLISHED">🟢 PUBLISHED</option>
                                    <option value="DRAFT">⚪ DRAFT MODE</option>
                                    <option value="SOLD">🔴 SOLD OUT</option>
                                </select>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div class="flex items-center gap-3 px-2">
                                <Film class="text-indigo-600" :size="20" />
                                <h3 class="font-black text-slate-900 uppercase tracking-widest text-xs">Video Trailer
                                </h3>
                            </div>
                            <input ref="videoInput" type="file" multiple accept="video/*" hidden
                                @change="addVideos($event.target.files, $event)" />

                            <div class="grid grid-cols-1 gap-4">
                                <div v-for="(vid, i) in oldVideos" :key="'old-vid-' + i" class="video-box group">
                                    <video :src="BASE_URL + vid.url" class="media-content" muted loop
                                        @mouseover="e => e.target.play()" @mouseout="e => e.target.pause()" />
                                    <div class="media-mask"><button @click="removeOldVideo(i)" class="remove-icon">
                                            <Trash2 :size="20" />
                                        </button></div>
                                </div>
                                <button v-if="oldVideos.length + newVideoFiles.length < 3" @click="videoInput.click()"
                                    class="video-add-btn">
                                    <Plus :size="20" /> <span>Upload Trailer</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="px-10 py-8 border-t border-slate-100 flex justify-end items-center gap-6 bg-white rounded-b-[3rem]">
                <button @click="emit('close')"
                    class="text-sm font-black text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-[0.2em]">Discard</button>
                <button @click="submit" :disabled="loading" class="submit-btn group">
                    <Save v-if="!loading" :size="20" />
                    <span v-else
                        class="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span class="tracking-[0.1em] uppercase text-sm font-black">{{ loading ? "Processing..." :
                        "CommitData" }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

.input-new {
    @apply w-full px-6 py-4 bg-slate-50 border border-slate-200/60 rounded-[1.25rem] outline-none transition-all;
    @apply text-slate-900 font-semibold placeholder:text-slate-300;
    /* สีดำเข้มที่นี่ */
    @apply focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10;
}

.label-style {
    @apply block text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-2;
}

/* --- MEDIA CARDS --- */
.media-box {
    @apply relative aspect-square rounded-[1.5rem] overflow-hidden border border-slate-200 bg-white;
}

.media-content {
    @apply w-full h-full object-cover transition-transform duration-700 group-hover:scale-110;
}

.media-mask {
    @apply absolute inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center;
}

.remove-icon {
    @apply w-12 h-12 bg-rose-500 text-white rounded-2xl shadow-xl hover:bg-rose-600 active:scale-90 transition-all flex items-center justify-center;
}

.media-label {
    @apply absolute bottom-3 left-3 px-2 py-0.5 rounded-md text-[8px] font-black text-white tracking-widest;
}

.media-add-btn {
    @apply aspect-square border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all;
}

/* --- VIDEO --- */
.video-box {
    @apply relative aspect-video rounded-[1.5rem] overflow-hidden bg-black border border-slate-200;
}

.video-add-btn {
    @apply w-full py-6 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-400 font-bold text-xs hover:border-indigo-400 hover:text-indigo-600 transition-all;
}

/* --- BADGES --- */
.cat-badge {
    @apply px-4 py-2 rounded-xl text-[10px] font-black transition-all border-2 uppercase tracking-wider;
}

.cat-active {
    @apply bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100;
}

.cat-inactive {
    @apply bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-500;
}

/* --- ACTIONS --- */
.submit-btn {
    @apply min-w-[240px] bg-slate-900 hover:bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] font-black shadow-xl transition-all active:scale-95 disabled:bg-slate-200 flex items-center justify-center gap-4;
}

/* --- UTILS --- */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-slate-200 rounded-full;
}

@keyframes modal-in {
    from {
        transform: scale(0.95) translateY(20px);
        opacity: 0;
    }

    to {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

.animate-modal-in {
    animation: modal-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
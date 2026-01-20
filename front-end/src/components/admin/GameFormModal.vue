<script setup>
import { ref, watch } from "vue"
import api from "@/services/api"

const BASE_URL = import.meta.env.VITE_BACKEND

const props = defineProps({
    show: Boolean,
    game: Object
})

const emit = defineEmits(["close", "success"])

/* ================= BASIC ================= */
const title = ref("")
const description = ref("")
const price = ref(0)
const stock = ref(0)
const status = ref("PUBLISHED")
const categories = ref([])
const selectedCategories = ref([])

/* ================= MEDIA ================= */
const imageInput = ref(null)
const videoInput = ref(null)

const oldImages = ref([])
const oldVideos = ref([])

const newImageFiles = ref([])
const newVideoFiles = ref([])

const loading = ref(false)

/* ================= HELPERS ================= */
const getPreviewUrl = (file) => URL.createObjectURL(file)

/* ================= FETCH CATEGORY ================= */
const fetchCategories = async () => {
    const res = await api.get("/admin/category")
    categories.value = res.data.data
}
fetchCategories()

/* ================= WATCH EDIT ================= */
watch(
    () => props.game,
    (g) => {
        if (!g) return

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
    },
    { immediate: true }
)

/* ================= ADD MEDIA ================= */
const addImages = (files, e) => {
    Array.from(files).forEach(f => {
        if (f.type.startsWith("image/")) {
            newImageFiles.value.push(f)
        }
    })
    e.target.value = null
}

const addVideos = (files, e) => {
    Array.from(files).forEach(f => {
        if (f.type.startsWith("video/")) {
            newVideoFiles.value.push(f)
        }
    })
    e.target.value = null
}

/* ================= REMOVE ================= */
const removeOldImage = i => oldImages.value.splice(i, 1)
const removeOldVideo = i => oldVideos.value.splice(i, 1)
const removeNewImage = i => newImageFiles.value.splice(i, 1)
const removeNewVideo = i => newVideoFiles.value.splice(i, 1)

/* ================= CATEGORY ================= */
const toggleCategory = (id) => {
    const i = selectedCategories.value.indexOf(id)
    i > -1
        ? selectedCategories.value.splice(i, 1)
        : selectedCategories.value.push(id)
}

/* ================= SUBMIT ================= */
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

        const keepMediaIds = [
            ...oldImages.value.map(m => m.id),
            ...oldVideos.value.map(m => m.id),
        ]
        fd.append("keepMediaIds", JSON.stringify(keepMediaIds))

        newImageFiles.value.forEach(f => fd.append("images", f))
        newVideoFiles.value.forEach(f => fd.append("videos", f))

        /* ================= LOG ================= */
        console.group("🚀 SEND FORM DATA")
        for (const pair of fd.entries()) {
            console.log(pair[0], pair[1])
        }
        console.log("🖼 newImages:", newImageFiles.value.length)
        console.log("🎬 newVideos:", newVideoFiles.value.length)
        console.log("📦 keepMediaIds:", keepMediaIds)
        console.log("🏷 categories:", selectedCategories.value)
        console.groupEnd()
        /* ================= END LOG ================= */

        if (props.game) {
            await api.put(`/admin/games/${props.game.id}`, fd)
        } else {
            await api.post("/admin/games", fd)
        }

        emit("success")
        emit("close")
    } catch (err) {
        console.error("❌ SAVE FAILED", err)
        alert("Save failed")
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div v-if="show"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all">
        <div
            class="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[95vh] border border-white/20 animate-in fade-in zoom-in duration-300">

            <div
                class="px-10 py-7 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-20">
                <div>
                    <h2 class="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <span class="p-2 bg-indigo-50 rounded-xl text-xl">{{ game ? '✏️' : '➕' }}</span>
                        {{ game ? "Edit Game Details" : "Create New Entry" }}
                    </h2>
                    <p class="text-sm text-slate-400 font-medium ml-12">บริหารจัดการข้อมูลสินค้าและสื่อโปรโมชัน</p>
                </div>
                <button @click="emit('close')"
                    class="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-100 text-slate-400 transition-all hover:rotate-90">
                    <span class="text-4xl leading-none">&times;</span>
                </button>
            </div>

            <div class="p-10 space-y-12 overflow-y-auto custom-scrollbar bg-slate-50/30">

                <section class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div class="lg:col-span-7 space-y-6">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                            <h3 class="font-bold text-slate-800 uppercase tracking-widest text-xs">ข้อมูลทั่วไป
                            </h3>
                        </div>
                        <div class="space-y-5">
                            <div class="group">
                                <label class="label-new">ชื่อเกม</label>
                                <input v-model="title" class="input-new" placeholder="ระบุชื่อเกม..." />
                            </div>
                            <div>
                                <label class="label-new">คำอธิบาย</label>
                                <textarea v-model="description" rows="6" class="input-new resize-none"
                                    placeholder="รายละเอียดเนื้อหาเกม..." />
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-5 space-y-6">
                        <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/50 space-y-6">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                <h3 class="font-bold text-slate-800 uppercase tracking-widest text-xs">ราคาและ
                                    สินค้าคงคลัง</h3>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="label-new text-indigo-600">ราคา (THB)</label>
                                    <div class="relative">
                                        <input v-model.number="price" type="number"
                                            class="input-new pl-10 font-mono text-lg font-bold" />
                                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">฿</span>
                                    </div>
                                </div>
                                <div>
                                    <label class="label-new">คลัง</label>
                                    <input v-model.number="stock" type="number" class="input-new font-mono text-lg" />
                                </div>
                            </div>

                            <div>
                                <label class="label-new">หมวดหมู่</label>
                                <div class="flex flex-wrap gap-2 mt-2">
                                    <button v-for="cat in categories" :key="cat.id" type="button"
                                        @click="toggleCategory(cat.id)" :class="[
                                            'px-4 py-2 rounded-xl text-xs font-black transition-all border-2',
                                            selectedCategories.includes(cat.id)
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-500'
                                        ]">
                                        {{ cat.name }}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label class="label-new">Status</label>
                                <select v-model="status"
                                    class="input-new font-bold appearance-none cursor-pointer bg-slate-50">
                                    <option value="PUBLISHED">🟢 Published</option>
                                    <option value="DRAFT">⚪ Draft Mode</option>
                                    <option value="SOLD">🔴 Sold Out</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                <hr class="border-slate-100" />

                <section class="space-y-8">
                    <div class="space-y-5">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                <h3 class="font-bold text-slate-800 uppercase tracking-widest text-xs">Image Gallery
                                </h3>
                            </div>
                            <span
                                class="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-black">SUPPORT
                                JPG/PNG</span>
                        </div>

                        <input ref="imageInput" type="file" multiple accept="image/*" hidden
                            @change="addImages($event.target.files, $event)" />

                        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-5">
                            <div v-for="(img, i) in oldImages" :key="'old-img-' + i" class="media-card group">
                                <img :src="BASE_URL + img.url" class="media-img" />
                                <div class="media-overlay">
                                    <button @click="removeOldImage(i)" class="remove-btn">✕</button>
                                </div>
                                <div class="media-tag bg-slate-800">SERVER</div>
                            </div>
                            <div v-for="(f, i) in newImageFiles" :key="'new-img-' + i"
                                class="media-card group ring-2 ring-indigo-500 ring-offset-2">
                                <img :src="getPreviewUrl(f)" class="media-img" />
                                <div class="media-overlay">
                                    <button @click="removeNewImage(i)" class="remove-btn">✕</button>
                                </div>
                                <div class="media-tag bg-indigo-600">LOCAL</div>
                            </div>
                            <button @click="imageInput.click()" class="add-btn group">
                                <div class="add-btn-icon text-3xl">+</div>
                                <span class="text-[10px] font-black uppercase text-slate-400">Add Image</span>
                            </button>
                        </div>
                    </div>

                    <div class="space-y-5">
                        <div class="flex items-center gap-3">
                            <div class="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                            <h3 class="font-bold text-slate-800 uppercase tracking-widest text-xs">Video Trailer</h3>
                        </div>

                        <input ref="videoInput" type="file" multiple accept="video/*" hidden
                            @change="addVideos($event.target.files, $event)" />

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div v-for="(vid, i) in oldVideos" :key="'old-vid-' + i"
                                class="media-card group aspect-video h-auto">
                                <video :src="BASE_URL + vid.url" class="media-img" muted loop
                                    @mouseover="e => e.target.play()" @mouseout="e => e.target.pause()" />
                                <div class="media-overlay">
                                    <button @click="removeOldVideo(i)" class="remove-btn">✕</button>
                                </div>
                            </div>
                            <div v-for="(f, i) in newVideoFiles" :key="'new-vid-' + i"
                                class="media-card group aspect-video h-auto ring-2 ring-indigo-500 ring-offset-2">
                                <video :src="getPreviewUrl(f)" class="media-img" muted loop
                                    @mouseover="e => e.target.play()" @mouseout="e => e.target.pause()" />
                                <div class="media-overlay">
                                    <button @click="removeNewVideo(i)" class="remove-btn">✕</button>
                                </div>
                            </div>
                            <button v-if="oldVideos.length + newVideoFiles.length < 3" @click="videoInput.click()"
                                class="add-btn aspect-video h-auto group">
                                <div class="add-btn-icon text-2xl">🎬</div>
                                <span class="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Upload
                                    Trailer</span>
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <div
                class="px-10 py-7 border-t border-slate-100 flex justify-end items-center gap-6 bg-white sticky bottom-0 z-20">
                <button @click="emit('close')"
                    class="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
                    Discard
                </button>
                <button @click="submit" :disabled="loading"
                    class="min-w-[200px] bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-[1.25rem] font-black shadow-2xl shadow-indigo-200 transition-all active:scale-95 disabled:bg-slate-200 disabled:shadow-none flex items-center justify-center gap-3">
                    <span v-if="loading"
                        class="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span class="tracking-widest uppercase text-sm">{{ loading ? "Saving..." : "Save Product" }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

.input-new {
    @apply w-full px-6 py-4 bg-slate-50 border border-slate-200/60 rounded-2xl outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-300 font-medium;
}

.label-new {
    @apply block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1;
}

.media-card {
    @apply relative rounded-[1.8rem] overflow-hidden border border-slate-200 bg-white shadow-sm aspect-square transition-all duration-500;
}

.media-img {
    @apply w-full h-full object-cover transition-transform duration-700 group-hover:scale-110;
}

.media-overlay {
    @apply absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center;
}

.media-tag {
    @apply absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[8px] font-black text-white tracking-widest;
}

.remove-btn {
    @apply w-12 h-12 bg-red-500 text-white rounded-2xl shadow-xl transition-all active:scale-90 flex items-center justify-center text-xl font-bold;
}

.add-btn {
    @apply border-2 border-dashed border-slate-200 rounded-[1.8rem] flex flex-col items-center justify-center gap-3 bg-slate-50 hover:bg-white hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 active:scale-95;
}

.add-btn-icon {
    @apply w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-300 shadow-sm group-hover:text-indigo-500 group-hover:shadow-indigo-100 transition-all;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-slate-200 rounded-full;
}

@keyframes zoom-in {
    from {
        transform: scale(0.98);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.animate-in {
    animation: zoom-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
<script setup>
import { ref, watch } from "vue"
import api from "@/services/api"

const props = defineProps({
    show: Boolean,
    game: Object
})

const emit = defineEmits(["close", "success"])

const title = ref("")
const description = ref("")
const price = ref(0)
const stock = ref(0)
const status = ref("PUBLISHED")

const imageFile = ref(null)
const videoFile = ref(null)
const imagePreview = ref(null)
const videoPreview = ref(null)
const loading = ref(false)

// Drag and Drop States
const isDraggingImage = ref(false)
const isDraggingVideo = ref(false)

/* ================= MEDIA HANDLERS ================= */
const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
}

const handleVideoFile = (file) => {
    if (!file || !file.type.startsWith('video/')) return
    videoFile.value = file
    videoPreview.value = URL.createObjectURL(file)
}

/* ================= EDIT MODE ================= */
watch(() => props.game, (g) => {
    if (!g) {
        title.value = ""; description.value = ""; price.value = 0; stock.value = 0;
        status.value = "PUBLISHED"; imageFile.value = null; videoFile.value = null;
        imagePreview.value = null; videoPreview.value = null;
        return
    }
    title.value = g.title; description.value = g.description;
    price.value = g.price; stock.value = g.stock; status.value = g.status;
    const img = g.media?.find(m => m.type === "IMAGE")
    const vid = g.media?.find(m => m.type === "VIDEO")
    imagePreview.value = img?.url || null
    videoPreview.value = vid?.url || null
}, { immediate: true })

const submit = async () => {
    loading.value = true
    try {
        const fd = new FormData()
        fd.append("title", title.value)
        fd.append("description", description.value)
        fd.append("price", price.value)
        fd.append("stock", stock.value)
        fd.append("status", status.value)
        if (imageFile.value) fd.append("image", imageFile.value)
        if (videoFile.value) fd.append("video", videoFile.value)

        if (props.game) await api.put(`/admin/games/${props.game.id}`, fd)
        else await api.post("/admin/games", fd)

        emit("success"); emit("close")
    } catch (err) {
        alert("Save failed")
    } finally { loading.value = false }
}
</script>

<template>
    <div v-if="show" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
            class="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-scale flex flex-col max-h-[90vh]">

            <div class="px-8 py-5 border-b flex justify-between items-center bg-slate-50/50">
                <div>
                    <h2 class="text-2xl font-bold text-slate-800">{{ game ? "✏️ Edit Game" : "➕ Add New Game" }}</h2>
                    <p class="text-sm text-slate-500 text-pretty">กรอกข้อมูลรายละเอียดเกมและอัปโหลดสื่อโปรโมต</p>
                </div>
                <button @click="emit('close')"
                    class="text-slate-400 hover:text-slate-600 transition-colors text-2xl">&times;</button>
            </div>

            <div class="p-8 overflow-y-auto space-y-6">

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="md:col-span-2 space-y-4">
                        <div>
                            <label class="label">Game Title</label>
                            <input v-model="title" placeholder="ชื่อเกม..." class="input-modern" />
                        </div>
                        <div>
                            <label class="label">Description</label>
                            <textarea v-model="description" rows="4" placeholder="รายละเอียดเนื้อหาเกม..."
                                class="input-modern resize-none" />
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="label">Price (THB)</label>
                            <input v-model.number="price" type="number" class="input-modern font-mono" />
                        </div>
                        <div>
                            <label class="label">Stock Amount</label>
                            <input v-model.number="stock" type="number" class="input-modern font-mono" />
                        </div>
                        <div>
                            <label class="label">Status</label>
                            <select v-model="status" class="input-modern">
                                <option value="PUBLISHED">🟢 Published</option>
                                <option value="DRAFT">⚪ Draft</option>
                                <option value="SOLD">🔴 Out of Stock</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">

                    <div class="space-y-2">
                        <label class="label">Cover Image</label>
                        <div @dragover.prevent="isDraggingImage = true" @dragleave.prevent="isDraggingImage = false"
                            @drop.prevent="isDraggingImage = false; handleImageFile($event.dataTransfer.files[0])"
                            :class="[isDraggingImage ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50']"
                            class="relative border-2 border-dashed rounded-2xl h-48 flex flex-center transition-all overflow-hidden group">
                            <div v-if="!imagePreview" class="text-center p-4">
                                <svg class="w-10 h-10 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p class="text-xs text-slate-500">Drop image here or <span
                                        class="text-indigo-600 font-bold cursor-pointer">browse</span></p>
                                <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer"
                                    @change="handleImageFile($event.target.files[0])" />
                            </div>
                            <template v-else>
                                <img :src="imagePreview" class="w-full h-full object-cover" />
                                <div
                                    class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <button @click="imagePreview = null; imageFile = null"
                                        class="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform">Remove</button>
                                </div>
                            </template>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="label">Trailer Video</label>
                        <div @dragover.prevent="isDraggingVideo = true" @dragleave.prevent="isDraggingVideo = false"
                            @drop.prevent="isDraggingVideo = false; handleVideoFile($event.dataTransfer.files[0])"
                            :class="[isDraggingVideo ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50']"
                            class="relative border-2 border-dashed rounded-2xl h-48 flex flex-center transition-all overflow-hidden group">
                            <div v-if="!videoPreview" class="text-center p-4">
                                <svg class="w-10 h-10 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p class="text-xs text-slate-500">Drop video here or <span
                                        class="text-indigo-600 font-bold cursor-pointer">browse</span></p>
                                <input type="file" accept="video/*" class="absolute inset-0 opacity-0 cursor-pointer"
                                    @change="handleVideoFile($event.target.files[0])" />
                            </div>
                            <template v-else>
                                <video :src="videoPreview" class="w-full h-full object-cover" muted loop
                                    onmouseover="this.play()" onmouseout="this.pause()"></video>
                                <div
                                    class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <button @click="videoPreview = null; videoFile = null"
                                        class="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform">Remove</button>
                                </div>
                            </template>
                        </div>
                    </div>

                </div>
            </div>

            <div class="px-8 py-5 bg-slate-50 border-t flex justify-end gap-3">
                <button @click="emit('close')"
                    class="px-6 py-2.5 font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
                <button @click="submit" :disabled="loading"
                    class="px-10 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:bg-slate-300">
                    {{ loading ? "⌛ Uploading..." : "💾 Save Product" }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.label {
    @apply block text-sm font-bold text-slate-700 mb-1.5 ml-1;
}

.input-modern {
    @apply w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-slate-700;
}

@keyframes scale {
    from {
        transform: scale(0.95);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.animate-scale {
    animation: scale 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
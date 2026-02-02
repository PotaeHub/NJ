<script setup>
import { ref, watch, onBeforeUnmount } from "vue"
import { X, Edit3, User, Mail, Shield, UploadCloud, RefreshCw } from 'lucide-vue-next'

const props = defineProps({
    show: Boolean,
    user: Object
})

const emit = defineEmits(["close", "submit"])

const form = ref({
    username: "",
    email: "",
    role: "BUYER"
})

const fileInput = ref(null)
const avatarFile = ref(null)
const avatarPreview = ref(null)

const BASE_URL = import.meta.env.VITE_BACKEND?.replace(/\/$/, "")

/* ================= WATCH USER DATA ================= */
watch(
    () => props.user,
    (u) => {
        if (u) {
            form.value = {
                username: u.username,
                email: u.email,
                role: u.role
            }
            // แสดงรูปเดิมจาก Server หรือ null
            avatarPreview.value = u.avatar ? `${BASE_URL}${u.avatar}` : null
            avatarFile.value = null
        }
    },
    { immediate: true }
)

/* ================= FILE HANDLER ================= */
const handleFile = (file) => {
    if (!file || !file.type.startsWith("image")) return

    // ล้าง Memory Blob เดิมก่อนสร้างใหม่
    if (avatarPreview.value?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview.value)
    }

    avatarFile.value = file
    avatarPreview.value = URL.createObjectURL(file)
}

const onFileChange = (e) => handleFile(e.target.files[0])
const onDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
}

/* ================= SUBMIT ================= */
const submit = () => {
    const fd = new FormData()
    fd.append("username", form.value.username)
    fd.append("email", form.value.email)
    fd.append("role", form.value.role)

    if (avatarFile.value) {
        fd.append("avatar", avatarFile.value)
    }

    emit("submit", fd)
}

/* ================= CLEANUP ================= */
onBeforeUnmount(() => {
    if (avatarPreview.value?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview.value)
    }
})
</script>

<template>
    <Transition name="modal-scale">
        <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div class="absolute inset-0 bg-[#050505]/85 backdrop-blur-xl" @click="emit('close')"></div>

            <div
                class="relative w-full max-w-lg bg-[#0a0a0b] border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden">

                <div class="px-10 pt-10 pb-6 border-b border-white/5 flex justify-between items-start">
                    <div class="flex items-center gap-4">
                        <div class="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500">
                            <Edit3 :size="24" />
                        </div>
                        <div>
                            <h2 class="text-2xl font-black italic tracking-tighter uppercase text-white">Modify Identity
                            </h2>
                            <p class="text-[9px] font-bold text-zinc-500 tracking-[0.3em] uppercase italic">Editing: {{
                                user?.username }}</p>
                        </div>
                    </div>
                    <button @click="emit('close')"
                        class="p-2 hover:bg-white/5 rounded-full text-zinc-600 transition-colors">
                        <X :size="20" />
                    </button>
                </div>

                <div class="p-10 space-y-8">

                    <div class="flex flex-col items-center gap-4">
                        <div class="relative w-36 h-36 group cursor-pointer" @dragover.prevent @drop="onDrop"
                            @click="fileInput.click()">
                            <div
                                class="absolute -inset-2 bg-gradient-to-tr from-amber-500 to-blue-500 rounded-[2.2rem] opacity-20 blur group-hover:opacity-40 transition-opacity">
                            </div>

                            <div
                                class="relative h-full w-full bg-zinc-900 rounded-[2rem] border border-white/10 overflow-hidden flex items-center justify-center">
                                <img v-if="avatarPreview" :src="avatarPreview"
                                    class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div v-else class="flex flex-col items-center gap-2 text-zinc-700">
                                    <UploadCloud :size="30" />
                                    <span class="text-[8px] font-black uppercase tracking-widest">New Scan</span>
                                </div>

                                <div
                                    class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <RefreshCw class="text-white animate-spin-slow" :size="24" />
                                </div>
                            </div>
                            <input ref="fileInput" type="file" accept="image/*" hidden @change="onFileChange" />
                        </div>
                        <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Update
                            Identity Profile</span>
                    </div>

                    <div class="grid gap-4">
                        <div class="cyber-input-group">
                            <User class="icon" :size="18" />
                            <input v-model="form.username" placeholder="IDENTITY NAME" class="cyber-field" />
                        </div>

                        <div class="cyber-input-group">
                            <Mail class="icon" :size="18" />
                            <input v-model="form.email" type="email" placeholder="SECURE CHANNEL (EMAIL)"
                                class="cyber-field" />
                        </div>

                        <div class="cyber-input-group">
                            <Shield class="icon" :size="18" />
                            <select v-model="form.role" class="cyber-field appearance-none">
                                <option value="ADMIN">ADMINISTRATOR</option>
                                <option value="SELLER">SELLER UNIT</option>
                                <option value="BUYER">CITIZEN (BUYER)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="px-10 py-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
                    <button @click="emit('close')"
                        class="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
                        Cancel
                    </button>
                    <button @click="submit"
                        class="flex-[2] py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-amber-500 hover:text-white transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] active:scale-95">
                        Commit Changes
                    </button>
                </div>

            </div>
        </div>
    </Transition>
</template>

<style scoped>
@import "tailwindcss";

.cyber-input-group {
    @apply relative flex items-center;
}

.icon {
    @apply absolute left-6 text-zinc-600 transition-colors duration-300;
}

.cyber-input-group:focus-within .icon {
    @apply text-amber-500;
}

.cyber-field {
    @apply w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-[10px] font-black tracking-widest uppercase outline-none focus:border-amber-500/40 focus:bg-amber-500/5 transition-all text-white placeholder:text-zinc-700;
}

.animate-spin-slow {
    animation: spin 3s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Modal Transitions */
.modal-scale-enter-active,
.modal-scale-leave-active {
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.modal-scale-enter-from,
.modal-scale-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(30px);
}
</style>
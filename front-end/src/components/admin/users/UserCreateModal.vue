<script setup>
import { ref, watch, onBeforeUnmount } from "vue"
import { X, UploadCloud, UserPlus, Fingerprint, Mail, Lock, Shield } from 'lucide-vue-next'

const props = defineProps({
    show: Boolean
})

const emit = defineEmits(["close", "submit"])

const form = ref({
    username: "",
    email: "",
    password: "",
    role: "BUYER",
    avatar: null,
    avatarPreview: null
})

const fileInput = ref(null)

/* ================= FILE HANDLER ================= */
const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return
    if (form.value.avatarPreview) URL.revokeObjectURL(form.value.avatarPreview)

    form.value.avatar = file
    form.value.avatarPreview = URL.createObjectURL(file)
}

const onFileChange = (e) => handleFile(e.target.files?.[0])
const onDrop = (e) => handleFile(e.dataTransfer.files?.[0])

const removeAvatar = () => {
    if (form.value.avatarPreview) URL.revokeObjectURL(form.value.avatarPreview)
    form.value.avatar = null
    form.value.avatarPreview = null
    if (fileInput.value) fileInput.value.value = ""
}

/* ================= SUBMIT ================= */
const handleSubmit = () => {
    if (!form.value.username || !form.value.email || !form.value.password) {
        alert("CRITICAL: DATA INCOMPLETE")
        return
    }

    const fd = new FormData()
    fd.append("username", form.value.username)
    fd.append("email", form.value.email)
    fd.append("password", form.value.password)
    fd.append("role", form.value.role)
    if (form.value.avatar) fd.append("avatar", form.value.avatar)

    emit("submit", fd)
}

watch(() => props.show, (val) => {
    if (val) {
        form.value = { username: "", email: "", password: "", role: "BUYER", avatar: null, avatarPreview: null }
    }
})

onBeforeUnmount(() => {
    if (form.value.avatarPreview) URL.revokeObjectURL(form.value.avatarPreview)
})
</script>

<template>
    <Transition name="modal-fade">
        <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div class="absolute inset-0 bg-[#050505]/80 backdrop-blur-md" @click="$emit('close')"></div>

            <div
                class="relative w-full max-w-lg bg-[#0a0a0b] border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden">

                <div class="px-10 pt-10 pb-6 flex justify-between items-center border-b border-white/5">
                    <div class="flex items-center gap-4">
                        <div class="p-3 bg-blue-600/10 rounded-xl">
                            <UserPlus class="text-blue-500" :size="24" />
                        </div>
                        <div>
                            <h2 class="text-2xl font-black italic tracking-tighter uppercase">Enroll Identity</h2>
                            <p class="text-[9px] font-bold text-zinc-500 tracking-[0.3em] uppercase">Security Protocol
                                v4.0</p>
                        </div>
                    </div>
                    <button @click="$emit('close')"
                        class="p-2 hover:bg-white/5 rounded-full text-zinc-500 transition-colors">
                        <X :size="20" />
                    </button>
                </div>

                <div class="p-10 space-y-8">

                    <div class="flex justify-center">
                        <div class="relative group w-40 h-40 border-2 border-dashed border-zinc-800 rounded-[2rem] flex items-center justify-center transition-all hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer overflow-hidden"
                            @click="fileInput.click()" @dragover.prevent @drop.prevent="onDrop">
                            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

                            <div v-if="!form.avatarPreview"
                                class="flex flex-col items-center gap-2 text-zinc-600 group-hover:text-blue-400 transition-colors">
                                <UploadCloud :size="32" stroke-width="1.5" />
                                <span class="text-[9px] font-black uppercase tracking-widest italic">Identity
                                    Scan</span>
                            </div>

                            <template v-else>
                                <img :src="form.avatarPreview" class="w-full h-full object-cover rounded-[1.8rem]" />
                                <div
                                    class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button @click.stop="removeAvatar"
                                        class="p-3 bg-rose-500 text-white rounded-2xl shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                                        <X :size="20" stroke-width="3" />
                                    </button>
                                </div>
                            </template>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="input-group">
                            <Fingerprint class="input-icon" :size="18" />
                            <input v-model="form.username" placeholder="ASSIGN USERNAME" class="cyber-input" />
                        </div>

                        <div class="input-group">
                            <Mail class="input-icon" :size="18" />
                            <input v-model="form.email" type="email" placeholder="COMM CHANNEL (EMAIL)"
                                class="cyber-input" />
                        </div>

                        <div class="input-group">
                            <Lock class="input-icon" :size="18" />
                            <input v-model="form.password" type="password" placeholder="ENCRYPTION KEY (PASSWORD)"
                                class="cyber-input" />
                        </div>

                        <div class="input-group">
                            <Shield class="input-icon" :size="18" />
                            <select v-model="form.role" class="cyber-input appearance-none">
                                <option value="ADMIN">ADMINISTRATOR</option>
                                <option value="SELLER">SELLER UNIT</option>
                                <option value="BUYER">CITIZEN (BUYER)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="px-10 py-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
                    <button @click="$emit('close')"
                        class="flex-1 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                        Abort
                    </button>
                    <button @click="handleSubmit"
                        class="flex-[2] px-8 py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_-5px_rgba(37,99,235,0.4)] hover:bg-white hover:text-black transition-all">
                        Authorize Identity
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
@import "tailwindcss";

.input-group {
    @apply relative flex items-center;
}

.input-icon {
    @apply absolute left-6 text-zinc-600 transition-colors;
}

.input-group:focus-within .input-icon {
    @apply text-blue-500;
}

.cyber-input {
    @apply w-full text-black bg-black border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-[10px] font-black tracking-widest uppercase outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all placeholder:text-zinc-700;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from,
s .modal-fade-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
}

/* Custom Scrollbar for Select */
select option {
    @apply bg-[#0a0a0b] text-black;
}
</style>
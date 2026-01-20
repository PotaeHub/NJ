<script setup>
import { ref, watch, onBeforeUnmount } from "vue"

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

/* ================= WATCH USER ================= */
watch(
    () => props.user,
    (u) => {
        if (u) {
            form.value = {
                username: u.username,
                email: u.email,
                role: u.role
            }

            avatarPreview.value = u.avatar
                ? BASE_URL + u.avatar
                : null

            avatarFile.value = null
        }
    },
    { immediate: true }
)

/* ================= FILE HANDLER ================= */
const handleFile = (file) => {
    if (!file || !file.type.startsWith("image")) return

    if (avatarPreview.value?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview.value)
    }

    avatarFile.value = file
    avatarPreview.value = URL.createObjectURL(file)
}

const onFileChange = (e) => {
    handleFile(e.target.files[0])
}

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
    <div v-if="show" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="emit('close')">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale">

            <!-- HEADER -->
            <div class="px-6 py-4 border-b bg-slate-50">
                <h2 class="text-lg font-bold">Edit User</h2>
                <p class="text-xs text-slate-500">{{ user?.username }}</p>
            </div>

            <!-- BODY -->
            <div class="p-6 space-y-5">

                <!-- AVATAR -->
                <div>
                    <label class="block text-sm font-semibold mb-2">Avatar</label>

                    <div class="h-32 rounded-xl border-2 border-dashed border-slate-300
                        flex items-center justify-center cursor-pointer
                        hover:border-blue-500 transition" @dragover.prevent @drop="onDrop" @click="$refs.file.click()">
                        <input ref="file" type="file" accept="image/*" hidden @change="onFileChange" />

                        <img v-if="avatarPreview" :src="avatarPreview" class="h-full w-full object-cover rounded-xl" />

                        <span v-else class="text-slate-400 text-sm">
                            ลากรูปมาวาง หรือคลิกเพื่อเลือก
                        </span>
                    </div>
                </div>

                <!-- USERNAME -->
                <div>
                    <label class="block text-sm font-semibold mb-1">ชื่อ</label>
                    <input v-model="form.username"
                        class="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <!-- EMAIL -->
                <div>
                    <label class="block text-sm font-semibold mb-1">อีเมล</label>
                    <input v-model="form.email" type="email"
                        class="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <!-- ROLE -->
                <div>
                    <label class="block text-sm font-semibold mb-1">สิทธิ์</label>
                    <select v-model="form.role"
                        class="w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="ADMIN">ADMIN</option>
                        <option value="SELLER">SELLER</option>
                        <option value="BUYER">BUYER</option>
                    </select>
                </div>
            </div>

            <!-- FOOTER -->
            <div class="px-6 py-4 bg-slate-50 flex justify-end gap-3">
                <button @click="emit('close')" class="text-slate-500 font-bold">
                    ยกเลิก
                </button>
                <button @click="submit"
                    class="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                    บันทึก
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

@keyframes scale {
    from {
        transform: scale(.95);
        opacity: 0
    }

    to {
        transform: scale(1);
        opacity: 1
    }
}

.animate-scale {
    animation: scale .2s ease-out;
}
</style>

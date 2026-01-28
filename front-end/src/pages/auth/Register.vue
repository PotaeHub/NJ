<script setup>
import { ref } from 'vue'
import api from '../../services/api'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

const submit = async () => {
    loading.value = true
    try {
        await api.post('/register', {
            username: username.value,
            email: email.value,
            password: password.value
        })
        alert('ยินดีด้วย! บัญชีของคุณถูกสร้างเรียบร้อยแล้ว 🎮')
        router.push('/login')
    } catch (err) {
        alert(err.response?.data?.message || 'การลงทะเบียนขัดข้อง')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div
        class="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-black selection:text-white">

        <!-- Background Decorative (Subtle Grey) -->
        <div class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-zinc-100/80 blur-[120px] rounded-full">
        </div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-zinc-200/50 blur-[100px] rounded-full">
        </div>

        <div class="w-full max-w-[480px] relative">
            <!-- Main Card Container -->
            <div
                class="relative bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.15)]">

                <!-- Progress Bar Loading -->
                <div v-if="loading" class="absolute top-0 left-0 h-[2px] bg-black animate-[loading_2s_infinite]"></div>

                <div class="relative p-10 md:p-12">
                    <!-- Header Section -->
                    <div class="text-center mb-10">
                        <div class="inline-block px-4 py-1 rounded-full bg-zinc-50 border border-zinc-200 mb-6">
                            <span class=" text-zinc-500 uppercase ">ลงทะเบียนผู้ใช้</span>
                        </div>
                        <h2 class="text-4xl font-black text-black italic uppercase tracking-tighter">
                            สร้าง <span class="text-zinc-300 group-hover:text-black transition-colors">บัญชี</span>
                        </h2>
                        <div class="h-1 w-12 bg-black mx-auto mt-4 rounded-full"></div>
                    </div>

                    <!-- Input Fields -->
                    <div class="grid grid-cols-1 gap-6">

                        <!-- Username -->
                        <div class="space-y-1.5">
                            <label class="text-[15px] font-black text-zinc-400 uppercase ml-2">ชื่อผู้ใช้งาน</label>
                            <input v-model="username" type="text" placeholder="user-224"
                                class="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-black outline-none focus:border-black focus:bg-white transition-all placeholder:text-zinc-300 text-sm font-bold tracking-wide" />
                        </div>

                        <!-- Email -->
                        <div class="space-y-1.5">
                            <label class=" font-black text-zinc-400   ml-1">Email</label>
                            <input v-model="email" type="email" placeholder="COMMANDER@NEXUS.ID"
                                class="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-black outline-none focus:border-black focus:bg-white transition-all placeholder:text-zinc-300 text-sm font-bold tracking-wide" />
                        </div>

                        <!-- Password -->
                        <div class="space-y-1.5">
                            <label class=" font-black text-zinc-400 ml-1">Password</label>
                            <input v-model="password" type="password" placeholder="••••••••"
                                class="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-black outline-none focus:border-black focus:bg-white transition-all placeholder:text-zinc-300 text-sm font-bold tracking-wide" />
                        </div>

                        <!-- Terms -->
                        <p
                            class="text-[16px] text-zinc-400 font-bold text-center leading-relaxed px-4 uppercase tracking-tighter">
                            เมื่อดำเนินการต่อ <span class="text-black">คุณยอมรับข้อกำหนดในการให้บริการ</span> และ
                            <span class="text-black">นโยบายความเป็นส่วนตัว</span>.
                        </p>

                        <!-- Submit Button -->
                        <button @click="submit" :disabled="loading"
                            class="w-full bg-black hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] transition-all shadow-xl shadow-black/10 active:scale-[0.98] group mt-2">

                            <span v-if="loading" class="flex items-center justify-center gap-3 italic">
                                <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" fill="none"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Syncing...
                            </span>
                            <span v-else class="flex items-center justify-center gap-2 italic">
                                สมัครสมาชิก ➜
                            </span>
                        </button>

                        <!-- Login Link -->
                        <p class="text-center text-[11px] text-zinc-400 font-bold mt-4 uppercase tracking-widest">
                            มีบัญชีอยู๋แล้ว ? ไปที่
                            <router-link to="/login"
                                class="text-black hover:text-zinc-600 transition-colors ml-1 underline decoration-black/20 underline-offset-4 decoration-2">
                                ล็อกอิน
                            </router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
@import "tailwindcss";

@keyframes loading {
    0% {
        width: 0%;
        left: 0;
    }

    50% {
        width: 100%;
        left: 0;
    }

    100% {
        width: 0%;
        left: 100%;
    }
}

/* ปรับแต่ง Scrollbar และ Autofill ให้เข้ากับธีมขาวดำ */
input:-webkit-autofill {
    -webkit-text-fill-color: black;
    -webkit-box-shadow: 0 0 0px 1000px #F9FAFB inset;
    transition: background-color 5000s ease-in-out 0s;
}
</style>
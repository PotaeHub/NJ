<script setup>
import { ref } from 'vue'
import api from '../../services/api'
import { useAuthStore } from '../../store/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('') // 🚩 เก็บข้อความ Error
const auth = useAuthStore()
const router = useRouter()

const submit = async () => {
    loading.value = true
    errorMessage.value = '' // Reset error ก่อนเริ่มใหม่
    try {
        const res = await api.post('/login', {
            email: email.value,
            password: password.value
        })
        auth.setAuth(res.data)
        router.push('/')
    } catch (err) {
        console.error(err)
        // 🚩 ดึง Error Message จาก Backend
        errorMessage.value = 'การเข้าถึงถูกปฏิเสธ: ข้อมูลประจำตัวไม่ถูกต้อง'
    } finally {
        loading.value = false
    }
}
</script>
<template>
    <div
        class="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-black selection:text-white">

        <!-- Background Decorative Elements (Soft Grey) -->
        <div class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-zinc-100/50 blur-[120px] rounded-full"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-zinc-200/30 blur-[100px] rounded-full">
        </div>

        <div class="w-full max-w-[440px] relative group">
            <!-- Subtle Outer Border -->
            <div
                class="absolute -inset-1 bg-zinc-200 rounded-[2.5rem] opacity-20 group-hover:opacity-40 transition duration-500">
            </div>

            <!-- Main Card -->
            <div
                class="relative bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] overflow-hidden">

                <!-- Top Progress Bar (Black) -->
                <div v-if="loading" class="absolute top-0 left-0 h-[2px] bg-black animate-[loading_2s_infinite]"></div>

                <div class="p-10 md:p-12">
                    <!-- Logo Section -->
                    <div class="flex flex-col items-center mb-10">
                        <router-link to="/" class="relative group">
                            <div
                                class="w-20 h-20 bg-black rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-105">
                                <span class="text-white text-4xl font-black italic tracking-tighter">N</span>
                            </div>
                        </router-link>
                        <h2
                            class="mt-8 text-3xl font-black text-black italic uppercase tracking-tighter text-center leading-none">
                            ล็อก <span class="text-zinc-400">อิน</span>
                        </h2>
                        <div class="h-1 w-10 bg-black mt-3 rounded-full"></div>
                    </div>

                    <!-- Error Alert (Monochrome Style) -->
                    <Transition name="slide-down">
                        <div v-if="errorMessage"
                            class="mb-8 overflow-hidden rounded-2xl border border-black/5 bg-zinc-50 p-4 flex gap-3 items-center">
                            <div class="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                                <span class="text-white text-xs">!</span>
                            </div>
                            <p class="text-xs font-bold text-black tracking-tight">{{ errorMessage }}</p>
                        </div>
                    </Transition>

                    <!-- Form -->
                    <form @submit.prevent="submit" class="space-y-5">
                        <div class="space-y-1.5">
                            <label class="font-black text-zinc-400  ml-2">
                                Email</label>
                            <div class="relative">
                                <input v-model="email" type="email" placeholder="USER@NEXUS.ID"
                                    class="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-black outline-none focus:border-black focus:bg-white transition-all placeholder:text-zinc-300 text-sm font-bold tracking-wide" />
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label class=" font-black text-zinc-400  ml-2">Password</label>
                            <div class="relative">
                                <input v-model="password" type="password" placeholder="••••••••"
                                    class="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-black outline-none focus:border-black focus:bg-white transition-all placeholder:text-zinc-300 text-sm font-bold tracking-wide" />
                            </div>
                        </div>

                        <button :disabled="loading"
                            class="w-full mt-6 relative group/btn overflow-hidden rounded-2xl bg-black p-5 text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:bg-zinc-200 disabled:text-zinc-400 shadow-lg shadow-black/5">
                            <div
                                class="relative z-10 flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] italic">
                                <span v-if="!loading">ล็อกอิน</span>
                                <span v-else class="animate-pulse">Verifying...</span>
                                <span class="group-hover/btn:translate-x-1 transition-transform">➜</span>
                            </div>
                        </button>
                    </form>

                    <div class="mt-8 text-center">
                        <router-link to="/register"
                            class="text-[16px] font-black text-zinc-400  tracking-widest hover:text-black transition-colors">
                            ไม่มีบัญชีใช่ไหม? <span
                                class="text-black underline underline-offset-4 ml-1">สมัครสมาชิก</span>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Info -->
        <div class="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6 opacity-40">
            <span class="text-[9px] font-black text-black uppercase tracking-[0.3em]">System v2.0.26</span>
            <div class="w-1.5 h-1.5 bg-black rounded-full"></div>
            <span class="text-[9px] font-black text-black uppercase tracking-[0.3em]">Status: Encrypted</span>
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

.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-20px);
    max-height: 0;
}

/* รักษาสี Autofill ให้เป็นธีมขาวดำ */
input:-webkit-autofill {
    -webkit-text-fill-color: black;
    -webkit-box-shadow: 0 0 0px 1000px #F9FAFB inset;
}
</style>
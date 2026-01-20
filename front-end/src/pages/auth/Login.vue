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
    <div class="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">

        <div
            class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse">
        </div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full">
        </div>

        <div class="w-full max-w-md relative">
            <div
                class="absolute inset-0 bg-white/[0.02] backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl">
            </div>

            <div class="relative p-10 md:p-12">
                <div class="flex justify-center mb-8">
                    <router-link to="/"
                        class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)] group hover:rotate-12 transition-transform">
                        <span class="text-white text-3xl font-black italic">N</span>
                    </router-link>
                </div>

                <div class="text-center mb-10">
                    <h2 class="text-3xl font-black text-white italic uppercase tracking-tighter">
                        Welcome Back <br />
                        <span class="text-indigo-500">Commander</span>
                    </h2>
                    <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3 opacity-70">
                        จำเป็นต้องมีการเชื่อมต่อประสาทที่ปลอดภัย
                    </p>
                </div>

                <Transition name="fade">
                    <div v-if="errorMessage"
                        class="mb-6 flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl">
                        <span class="text-rose-500 animate-pulse">⚠️</span>
                        <div class="flex-1">
                            <p class="text-[10px] font-black text-rose-500 uppercase tracking-widest">System Error</p>
                            <p class="text-xs text-rose-200/80 font-medium">{{ errorMessage }}</p>
                        </div>
                        <button @click="errorMessage = ''"
                            class="text-rose-500/50 hover:text-rose-500 text-lg leading-none">&times;</button>
                    </div>
                </Transition>

                <div class="space-y-6">
                    <div class="space-y-2">
                        <label
                            class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">อีเมล</label>
                        <div class="relative group">
                            <input v-model="email" type="email" placeholder="name@example.com" :class="[
                                'w-full bg-black/40 border rounded-2xl px-6 py-4 text-white outline-none transition-all placeholder:text-slate-700 font-medium',
                                errorMessage ? 'border-rose-500/50 focus:ring-rose-500/10' : 'border-white/5 focus:border-indigo-500/50 focus:ring-indigo-500/5 focus:ring-4'
                            ]" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label
                            class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">รหัสผ่าน</label>
                        <div class="relative group">
                            <input v-model="password" type="password" placeholder="••••••••" :class="[
                                'w-full bg-black/40 border rounded-2xl px-6 py-4 text-white outline-none transition-all placeholder:text-slate-700 font-medium',
                                errorMessage ? 'border-rose-500/50 focus:ring-rose-500/10' : 'border-white/5 focus:border-indigo-500/50 focus:ring-indigo-500/5 focus:ring-4'
                            ]" />
                        </div>
                    </div>

                    <button @click="submit" :disabled="loading"
                        class="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:opacity-50 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] transition-all shadow-[0_0_25px_rgba(79,70,229,0.2)] active:scale-[0.98] relative overflow-hidden group mt-4">
                        <span v-if="loading" class="flex items-center justify-center gap-3 italic">Syncing...</span>
                        <span v-else class="flex items-center justify-center gap-2">Login ➜</span>
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700">
                        </div>
                    </button>

                    <p class="text-center text-[11px] text-slate-500 font-bold mt-8 uppercase tracking-widest">
                        ถ้ายังไม่มีบัญชี
                        <router-link to="/register"
                            class="text-indigo-400 hover:text-indigo-300 transition-colors ml-1 underline decoration-indigo-500/30 underline-offset-4">
                            สร้างบัญชี
                        </router-link>
                    </p>
                </div>
            </div>
        </div>

        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-30">
            <div class="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></div>
            <span class="text-[9px] font-black text-white uppercase tracking-[0.4em]">Encrypted Connection Active</span>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

* {
    font-family: 'Inter', sans-serif;
}

/* Animation สำหรับ Error Message */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
    -webkit-text-fill-color: white;
    -webkit-box-shadow: 0 0 0px 1000px #020617 inset;
    transition: background-color 5000s ease-in-out 0s;
}
</style>
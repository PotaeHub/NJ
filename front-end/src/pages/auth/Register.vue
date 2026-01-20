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
    <div class="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">

        <div
            class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse">
        </div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full">
        </div>

        <div class="w-full max-w-lg relative">
            <div
                class="absolute inset-0 bg-white/[0.02] backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl">
            </div>

            <div class="relative p-10 md:p-12">
                <div class="text-center mb-10">
                    <div
                        class="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <span class="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">
                            รับสมัครสมาชิก</span>
                    </div>
                    <h2 class="text-3xl font-black text-white italic uppercase tracking-tighter">
                        สร้าง <span class="text-emerald-400">บัญชั</span>
                    </h2>
                    <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-70">
                        เข้าร่วมเครือข่ายเกม NJ
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-5">

                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Player
                            Alias</label>
                        <input v-model="username" type="text" placeholder="GamerTag_01"
                            class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all placeholder:text-slate-700 font-medium" />
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Comms Link
                            (Email)</label>
                        <input v-model="email" type="email" placeholder="commander@base.com"
                            class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all placeholder:text-slate-700 font-medium" />
                    </div>

                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure
                            Protocol (Password)</label>
                        <input v-model="password" type="password" placeholder="••••••••"
                            class="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all placeholder:text-slate-700 font-medium" />
                    </div>

                    <p
                        class="text-[9px] text-slate-500 font-bold text-center leading-relaxed px-4 uppercase tracking-tighter">
                        เมื่อดำเนินการต่อ<span class="text-slate-300">คุณยอมรับข้อกำหนดในการให้บริการ</span> และ
                        <span class="text-slate-300">ระเบียบปฏิบัติด้านความเป็นส่วนตัว</span>.
                    </p>

                    <button @click="submit" :disabled="loading"
                        class="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] transition-all shadow-[0_0_25px_rgba(16,185,129,0.2)] active:scale-[0.98] relative overflow-hidden group mt-2">

                        <span v-if="loading" class="flex items-center justify-center gap-3">
                            <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
                                    fill="none"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Processing...
                        </span>
                        <span v-else>Register Profile</span>

                        <div
                            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700">
                        </div>
                    </button>

                    <p class="text-center text-[11px] text-slate-500 font-bold mt-4 uppercase tracking-widest">
                        ถ้ามีบัญชีแล้ว?
                        <router-link to="/login"
                            class="text-emerald-400 hover:text-emerald-300 transition-colors ml-1 underline decoration-emerald-500/30 underline-offset-4">
                            ล็อกอินที่นี้
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

* {
    font-family: 'Inter', sans-serif;
}

/* Autofill styling */
input:-webkit-autofill {
    -webkit-text-fill-color: white;
    -webkit-box-shadow: 0 0 0px 1000px #020617 inset;
    transition: background-color 5000s ease-in-out 0s;
}
</style>
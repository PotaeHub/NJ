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
        class="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-blue-500/30">

        <div
            class="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none">
        </div>
        <div
            class="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none">
        </div>

        <div class="w-full max-w-[480px] relative animate-in">
            <div
                class="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[3rem] blur-2xl opacity-50 transition duration-1000">
            </div>

            <div
                class="relative bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">

                <div v-if="loading"
                    class="absolute top-0 left-0 h-[3px] w-full bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-pulse">
                </div>

                <div class="relative p-10 md:p-14">
                    <div class="text-center mb-10">
                        <div
                            class="inline-block px-5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 mb-6 backdrop-blur-md">
                            <span
                                class="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] italic">ลงทะเบียนผู้ใช้</span>
                        </div>
                        <h2 class="text-4xl font-black text-white italic uppercase tracking-tighter">
                            สร้าง <span class="text-blue-500 drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">บัญชี</span>
                        </h2>
                        <div class="h-1 w-12 bg-blue-600 mx-auto mt-5 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                    </div>

                    <div class="grid grid-cols-1 gap-6">

                        <div class="space-y-2">
                            <label
                                class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2 italic">ชื่อผู้ใช้งาน</label>
                            <input v-model="username" type="text" placeholder="user-224"
                                class="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-zinc-700 text-sm font-bold tracking-widest" />
                        </div>

                        <div class="space-y-2">
                            <label
                                class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2 italic">Email</label>
                            <input v-model="email" type="email" placeholder="COMMANDER@NEXUS.ID"
                                class="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-zinc-700 text-sm font-bold tracking-widest" />
                        </div>

                        <div class="space-y-2">
                            <label
                                class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2 italic">Password</label>
                            <input v-model="password" type="password" placeholder="••••••••"
                                class="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-zinc-700 text-sm font-bold tracking-widest" />
                        </div>

                        <p
                            class="text-[11px] text-zinc-500 font-bold text-center leading-relaxed px-4 uppercase tracking-tighter italic">
                            เมื่อดำเนินการต่อ <span class="text-zinc-200">คุณยอมรับข้อกำหนดในการให้บริการ</span> และ
                            <span class="text-zinc-200">นโยบายความเป็นส่วนตัว</span>.
                        </p>

                        <button @click="submit" :disabled="loading"
                            class="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] transition-all shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] active:scale-[0.98] mt-2 overflow-hidden group">

                            <span v-if="loading" class="flex items-center justify-center gap-3 italic text-sm">
                                <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" fill="none"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Syncing...
                            </span>
                            <span v-else class="flex items-center justify-center gap-2 italic text-sm">
                                สมัครสมาชิก <span
                                    class="group-hover:translate-x-2 transition-transform duration-500 text-lg">➜</span>
                            </span>
                        </button>

                        <p
                            class="text-center text-[10px] text-zinc-500 font-black mt-4 uppercase tracking-[0.2em] italic">
                            มีบัญชีอยู๋แล้ว ? ไปที่
                            <router-link to="/login"
                                class="text-blue-500 hover:text-blue-400 transition-colors ml-1 underline underline-offset-4 decoration-blue-500/30 decoration-2">
                                ล็อกอิน
                            </router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8 opacity-20">
            <span class="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Nexus.ID Protocol</span>
            <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
            <span class="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Status: Secure
                Access</span>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

/* 🚀 Entrance Animation */
.animate-in {
    animation: registerReveal 1.2s cubic-bezier(0.2, 1, 0.3, 1) forwards;
}

@keyframes registerReveal {
    from {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
        filter: blur(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
    }
}

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

/* Custom Autofill Styles for Dark Mode */
input:-webkit-autofill {
    -webkit-text-fill-color: white;
    -webkit-box-shadow: 0 0 0px 1000px #161618 inset;
    transition: background-color 5000s ease-in-out 0s;
}
</style>
<script setup>
import { ref } from 'vue'
import api from '../../services/api'
import { useAuthStore } from '../../store/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const auth = useAuthStore()
const router = useRouter()

const submit = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
        const res = await api.post('/login', {
            email: email.value,
            password: password.value
        })
        auth.setAuth(res.data)
        router.push('/')
    } catch (err) {
        console.error(err)
        errorMessage.value = 'ACCESS DENIED: INVALID CREDENTIALS'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div
        class="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-blue-500/30">

        <div
            class="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none">
        </div>
        <div
            class="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none">
        </div>

        <div class="w-full max-w-[460px] relative group animate-in">
            <div
                class="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000">
            </div>

            <div
                class="relative bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">

                <div v-if="loading"
                    class="absolute top-0 left-0 h-[3px] w-full bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-pulse">
                </div>

                <div class="p-10 md:p-14">
                    <div class="flex flex-col items-center mb-12">
                        <router-link to="/" class="relative group">
                            <div
                                class="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                <span class="text-white text-4xl font-black italic tracking-tighter">N</span>
                            </div>
                        </router-link>

                        <h2
                            class="mt-8 text-4xl font-black text-white italic uppercase tracking-tighter text-center leading-none">
                            <span class="text-blue-500">LOGIN</span>
                        </h2>
                        <p class="text-[9px] font-black text-zinc-500 uppercase tracking-[0.5em] mt-4 italic">Security
                            Level: Authorized Only</p>
                    </div>

                    <Transition name="slide-down">
                        <div v-if="errorMessage"
                            class="mb-8 overflow-hidden rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 flex gap-4 items-center">
                            <div
                                class="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                                <span class="text-white text-xs font-black">!</span>
                            </div>
                            <p class="text-[10px] font-black text-rose-400 tracking-widest uppercase">{{ errorMessage }}
                            </p>
                        </div>
                    </Transition>

                    <form @submit.prevent="submit" class="space-y-6">
                        <div class="space-y-2">
                            <label
                                class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2 italic">Email</label>
                            <div class="relative">
                                <input v-model="email" type="email" placeholder="USER@NEXUS.ID"
                                    class="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-zinc-700 text-sm font-bold tracking-widest" />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label
                                class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2 italic">Password</label>
                            <div class="relative">
                                <input v-model="password" type="password" placeholder="••••••••"
                                    class="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-zinc-700 text-sm font-bold tracking-widest" />
                            </div>
                        </div>

                        <button :disabled="loading"
                            class="w-full mt-8 relative group/btn overflow-hidden rounded-2xl bg-blue-600 p-5 text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)]">
                            <div
                                class="relative z-10 flex items-center justify-center gap-3 font-black uppercase tracking-[0.3em] italic text-[12px]">
                                <span v-if="!loading">LOGIN</span>
                                <span v-else class="animate-pulse">Authenticating...</span>
                                <span
                                    class="group-hover/btn:translate-x-2 transition-transform duration-500 text-lg">→</span>
                            </div>
                        </button>
                    </form>

                    <div class="mt-10 text-center">
                        <router-link to="/register"
                            class="text-[11px] font-black text-zinc-500 tracking-[0.2em] hover:text-white transition-colors uppercase italic group">
                        ยังไม่มีบัญชีนี้ใช่หรือไม่? <span
                                class="text-blue-500 border-b border-blue-500/0 group-hover:border-blue-500 transition-all ml-1">
                                สร้าง
                                Account</span>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <div class="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8 opacity-20">
            <span class="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Nexus.OS v2.0.26</span>
            <div class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
            <span class="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Encryption: Active</span>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

/* 🛸 Entrance Animation */
.animate-in {
    animation: loginReveal 1.2s cubic-bezier(0.2, 1, 0.3, 1) forwards;
}

@keyframes loginReveal {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
        filter: blur(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
    }
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-20px);
    max-height: 0;
}

/* Custom Autofill Styles for Dark Mode */
input:-webkit-autofill {
    -webkit-text-fill-color: white;
    -webkit-box-shadow: 0 0 0px 1000px #161618 inset;
    transition: background-color 5000s ease-in-out 0s;
}
</style>
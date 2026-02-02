<script setup>
import { useAuthStore } from '@/store/auth';
const auth = useAuthStore()

const stats = [
    { label: 'ACTIVE COLLECTORS', value: '50K+' },
    { label: 'ASSETS TRADED', value: '120K+' },
    { label: 'USER RATING', value: '9.9/10' },
]
</script>

<template>
    <section class="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0a0a0b]">

        <div class="absolute inset-0 z-0 opacity-[0.05]"
            style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 50px 50px;"></div>

        <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-blue-600/10 blur-[140px] rounded-full"></div>
        <div class="absolute bottom-[-10%] right-[0%] w-[40%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

        <div class="max-w-[1600px] mx-auto px-6 lg:px-16 grid lg:grid-cols-2 gap-20 items-center relative z-10 py-32">

            <div class="text-left space-y-12 animate-slide-in">
                <div
                    class="inline-flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl">
                    <span class="relative flex h-2 w-2">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span class="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em] italic">The Premium
                        Nexus</span>
                </div>

                <div class="space-y-4">
                    <h1
                        class="text-7xl md:text-[110px] font-black text-white leading-[0.8] tracking-[ -0.05em] uppercase italic">
                        NEXT LEVEL <br />
                        <span class="text-blue-600 drop-shadow-[0_0_30px_rgba(37,99,235,0.4)]">COLLECTION.</span>
                    </h1>
                </div>

                <p class="text-xl text-zinc-500 max-w-lg leading-relaxed font-bold uppercase tracking-tighter">
                    สัมผัสประสบการณ์การครอบครองเกมระดับพรีเมียม <br />
                    <span class="text-zinc-200 border-b-2 border-blue-600/50">ปลอดภัย. รวดเร็ว. ไร้รอยต่อ.</span>
                </p>

                <div class="flex flex-wrap gap-6 pt-6">
                    <RouterLink v-if="!auth.user" to="/register"
                        class="px-12 py-6 bg-blue-600 text-white font-black rounded-[20px] transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.5)] hover:bg-blue-500 hover:-translate-y-1 active:scale-95 uppercase text-[12px] tracking-[0.3em]">
                        Join the Nexus
                    </RouterLink>

                    <RouterLink to="/games"
                        class="px-12 py-6 bg-white/[0.03] text-white font-black rounded-[20px] border border-white/10 backdrop-blur-xl transition-all hover:bg-white/10 hover:-translate-y-1 active:scale-95 uppercase text-[12px] tracking-[0.3em]">
                        Browse Games
                    </RouterLink>
                </div>

                <div class="pt-16 flex items-center gap-16 border-t border-white/5">
                    <div v-for="stat in stats" :key="stat.label">
                        <p class="text-4xl font-black text-white tracking-tighter italic leading-none mb-2">{{
                            stat.value }}</p>
                        <p class="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] italic">{{ stat.label
                        }}</p>
                    </div>
                </div>
            </div>

            <div class="relative hidden lg:block animate-fade-in-right">
                <div class="relative z-10 animate-float">
                    <div
                        class="relative p-3 bg-gradient-to-br from-white/10 to-transparent rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/10 backdrop-blur-sm">
                        <img src="https://i.pinimg.com/1200x/87/04/c7/8704c75eb516e923c3668f871ebcdd6c.jpg"
                            alt="Gaming Culture"
                            class="w-full h-full rounded-[3.5rem] grayscale-[0.4] hover:grayscale-0 transition-all duration-1000 object-cover aspect-[4/3] brightness-90 hover:brightness-110" />
                    </div>

                    <div
                        class="absolute -top-8 -right-8 bg-blue-600 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.4)] animate-bounce-slow border-4 border-[#0a0a0b]">
                        <p class="text-[10px] text-blue-100 uppercase tracking-[0.3em] mb-2 font-black text-center">
                            AUTHENTIC</p>
                        <p class="text-3xl font-black text-white italic leading-none text-center">100%</p>
                    </div>

                    <div
                        class="absolute -bottom-10 -left-10 bg-[#161618] p-8 rounded-[2.5rem] shadow-3xl border border-white/10 flex items-center gap-5 animate-float-delayed backdrop-blur-2xl">
                        <div class="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-500" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Security
                                Status</p>
                            <p class="text-sm font-black text-white uppercase italic">Active Encryption</p>
                        </div>
                    </div>
                </div>

                <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] border border-white/5 rounded-full -z-10 animate-pulse">
                </div>
                <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[135%] h-[135%] border border-white/[0.02] rounded-full -z-10">
                </div>
            </div>

        </div>
    </section>
</template>

<style scoped>
@import "tailwindcss";

/* 🎥 Custom Animations */
@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-30px) rotate(1deg);
    }
}

@keyframes float-delayed {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-20px);
    }
}

@keyframes bounce-slow {

    0%,
    100% {
        transform: translateY(0) scale(1);
    }

    50% {
        transform: translateY(-15px) scale(1.05);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-50px);
        filter: blur(10px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
        filter: blur(0);
    }
}

.animate-slide-in {
    animation: slideIn 1.2s cubic-bezier(0.2, 1, 0.3, 1) forwards;
}

.animate-float {
    animation: float 10s ease-in-out infinite;
}

.animate-float-delayed {
    animation: float-delayed 8s ease-in-out infinite 1s;
}

.animate-bounce-slow {
    animation: bounce-slow 6s ease-in-out infinite;
}

.animate-fade-in-right {
    animation: slideIn 1.5s cubic-bezier(0.2, 1, 0.3, 1) forwards;
}

/* Typography Polish */
h1 {
    text-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}
</style>
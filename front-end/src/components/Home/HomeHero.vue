<script setup>
import { useAuthStore } from '@/store/auth';
const auth = useAuthStore()

const stats = [
    { label: 'นักสะสมที่ใช้งานอยู่', value: '50K+' },
    { label: 'สินทรัพย์ที่มีการซื้อขาย', value: '120K+' },
    { label: 'คะแนนรีวิวระดับสูง', value: '9.9/10' },
]

</script>

<template>
    <section class="relative min-h-[85vh] flex items-center overflow-hidden bg-[#FDFDFD]">
        <div class="absolute inset-0 z-0 opacity-[0.03]"
            style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 40px 40px;"></div>

        <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-zinc-100 blur-[120px] rounded-full opacity-50">
        </div>

        <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10 py-24">

            <div class="text-left space-y-10">
                <div
                    class="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white border border-zinc-100 shadow-sm">
                    <span class="relative flex h-2 w-2">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-20"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                    </span>
                    <span class="text-[10px] font-black text-black uppercase tracking-[0.3em]">The Premium Nexus</span>
                </div>

                <h1 class="text-7xl md:text-8xl font-black text-black leading-[0.9] tracking-tighter uppercase">

                    ยกระดับ <br />
                    <span class="text-zinc-300">คลังของคุณ</span>
                </h1>

                <p class="text-lg text-zinc-400 max-w-md leading-relaxed font-medium uppercase tracking-tight">
                    สัมผัสประสบการณ์การครอบครองเกมระดับพรีเมียม <br />
                    <span class="text-black font-bold">ปลอดภัย. รวดเร็ว. ไร้รอยต่อ.</span>
                </p>

                <div class="flex flex-wrap gap-5 pt-4">
                    <RouterLink v-if="!auth.user" to="/register"
                        class="px-10 py-5 bg-black text-white font-black rounded-2xl transition-all shadow-2xl shadow-black/20 hover:bg-zinc-800 active:scale-95 uppercase text-[11px] tracking-widest">
                        เข้าร่วม
                    </RouterLink>

                    <RouterLink to="/games"
                        class="px-10 py-5 bg-white text-black font-black rounded-2xl border border-zinc-200 transition-all hover:border-black active:scale-95 uppercase text-[11px] tracking-widest">
                        ดูคลังเกม
                    </RouterLink>
                </div>

                <div class="pt-12 flex items-center gap-12 border-t border-black">
                    <div v-for="stat in stats" :key="stat.label">
                        <p class="text-3xl font-black text-black tracking-tighter">{{ stat.value }}</p>
                        <p class="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em] mt-1">{{ stat.label }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="relative hidden lg:block">
                <div class="relative z-10 animate-float">
                    <div
                        class="relative p-4 bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-zinc-50">
                        <img src="https://i.pinimg.com/1200x/87/04/c7/8704c75eb516e923c3668f871ebcdd6c.jpg"
                            alt="Gaming Culture" class="w-full h-full rounded-[2.8rem] grayscale hover:grayscale-0
               transition-all duration-1000 object-cover aspect-[1199/803]" />
                    </div>


                    <div
                        class="absolute -top-10 -right-10 bg-black p-8 rounded-[2.5rem] shadow-2xl animate-bounce-slow border-4 border-white">
                        <p class="text-[10px]  text-zinc-100 uppercase tracking-widest mb-1 text-center">
                            ได้รับการรับรอง</p>
                        <p class="text-2xl font-black text-white italic leading-none text-center">100%</p>
                    </div>

                    <div
                        class="absolute -bottom-6 -left-10 bg-white p-6 rounded-[2rem] shadow-xl border border-zinc-100 flex items-center gap-4 animate-float-delayed">
                        <div class="bg-zinc-50 p-3 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">
                                การป้องกัน</p>
                            <p class="text-sm font-black text-black">ป้องกันแบบแอคทีฟ</p>
                        </div>
                    </div>
                </div>

                <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-zinc-100 rounded-full -z-10">
                </div>
                <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] border border-zinc-50 rounded-full -z-10">
                </div>
            </div>

        </div>
    </section>
</template>

<style scoped>
@import "tailwindcss";

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-25px) rotate(1deg);
    }
}

@keyframes float-delayed {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-15px);
    }
}

@keyframes bounce-slow {

    0%,
    100% {
        transform: translateY(0) scale(1);
    }

    50% {
        transform: translateY(-10px) scale(1.05);
    }
}

.animate-float {
    animation: float 8s ease-in-out infinite;
}

.animate-float-delayed {
    animation: float-delayed 6s ease-in-out infinite 1s;
}

.animate-bounce-slow {
    animation: bounce-slow 5s ease-in-out infinite;
}
</style>
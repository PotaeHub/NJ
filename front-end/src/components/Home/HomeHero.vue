<script setup>
const stats = [
    { label: 'Active Users', value: '50K+' },
    { label: 'Games Sold', value: '120K+' },
    { label: 'Trust Score', value: '9.9/10' },
]
import { useAuthStore } from '@/store/auth';
const auth = useAuthStore()
</script><template>
    <section class="relative min-h-[70vh] flex items-center overflow-hidden bg-[#020617]">
        <div class="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div class="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full"></div>

        <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 py-20">

            <div class="text-left space-y-8">
                <div
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <span class="relative flex h-3 w-3">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </span>
                    <span class="text-xs font-bold text-indigo-300 uppercase tracking-[0.2em]">Next-Gen Gaming
                        Market</span>
                </div>

                <h1 class="text-6xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                    ซื้อ–ขายเกม <br />
                    <span
                        class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                        ง่ายระดับโปร
                    </span>
                </h1>

                <p class="text-lg text-slate-400 max-w-lg leading-relaxed font-medium">
                    สัมผัสประสบการณ์ใหม่ในการซื้อขายเกมแท้ ปลอดภัย 100%
                    ระบบอัตโนมัติ จ่ายเงินง่าย รับเกมได้ทันที พร้อมดูแลตลอด 24 ชั่วโมง
                </p>

                <div class="flex flex-wrap gap-4">
                    <RouterLink v-if="!auth.user" to="/register"
                        class="group relative px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/25 active:scale-95 overflow-hidden">
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700">
                        </div>
                        เริ่มต้นใช้งานฟรี
                    </RouterLink>

                    <RouterLink to="/games"
                        class="px-10 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 backdrop-blur-md transition-all active:scale-95">
                        สำรวจร้านค้า
                    </RouterLink>
                </div>

                <div class="pt-8 flex items-center gap-8 border-t border-white/5">
                    <div v-for="stat in stats" :key="stat.label">
                        <p class="text-2xl font-black text-white">{{ stat.value }}</p>
                        <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">{{ stat.label }}</p>
                    </div>
                </div>
            </div>

            <div class="relative hidden lg:block">
                <div class="relative z-10 animate-float">
                    <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800"
                        class="rounded-[3rem] shadow-2xl border border-white/10 rotate-3 hover:rotate-0 transition-transform duration-500"
                        alt="Gaming Image" />

                    <div
                        class="absolute -top-6 -left-6 bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 shadow-2xl animate-bounce-slow">
                        <div class="bg-emerald-500 p-2 rounded-xl mb-2 w-fit">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor font-bold">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p class="text-white font-black text-sm">Verified Game</p>
                        <p class="text-[10px] text-slate-400">Security Check Passed</p>
                    </div>

                    <div
                        class="absolute -bottom-8 -right-8 bg-indigo-600 p-6 rounded-[2rem] shadow-2xl shadow-indigo-600/40 border border-indigo-400/50">
                        <p class="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Flash Sale</p>
                        <p class="text-2xl font-black text-white">-80% OFF</p>
                    </div>
                </div>

                <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full">
                </div>
                <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/5 rounded-full">
                </div>
            </div>

        </div>
    </section>
</template>


<style scoped>

/* -------- Gradient Animation -------- */
@keyframes gradient-x {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 5s ease infinite;
}

/* -------- Float Animation -------- */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* -------- Slow Bounce -------- */
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 4s ease-in-out infinite;
}

/* -------- Typography -------- */
h1 {
  font-family: 'Inter', sans-serif;
}
</style>

<template>
    <footer class="bg-[#020617] text-slate-400 pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
        <div
            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50%] h-[100px] bg-indigo-600/10 blur-[100px] rounded-full">
        </div>

        <div class="max-w-7xl mx-auto px-6 relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                <div class="space-y-6">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span class="text-white text-xl font-black">N</span>
                        </div>
                        <span class="text-xl font-black tracking-tight text-white uppercase">NJ Gaming</span>
                    </div>
                    <p class="text-sm leading-relaxed">
                        แหล่งรวมเกมแท้ราคาถูกที่สุด ระบบจัดส่งอัตโนมัติ 24 ชั่วโมง
                        ปลอดภัย มั่นใจได้ทุกการสั่งซื้อ พร้อมการสนับสนุนที่ดีเยี่ยม
                    </p>
                    <div class="flex gap-4">
                        <a v-for="icon in socials" :key="icon.name" href="#"
                            class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300">
                            <component :is="icon.svg" class="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 class="text-white font-black uppercase tracking-widest text-sm mb-6">Explore</h4>
                    <ul class="space-y-4 text-sm font-medium">
                        <li>
                            <RouterLink to="/games" class="hover:text-indigo-400 transition-colors">หน้าร้านค้าทั้งหมด
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/games?category=action" class="hover:text-indigo-400 transition-colors">
                                เกมแอ็คชั่น</RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/games?category=sale" class="hover:text-indigo-400 transition-colors">
                                เกมลดราคาพิเศษ</RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/register" class="hover:text-indigo-400 transition-colors">สมัครสมาชิกใหม่
                            </RouterLink>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white font-black uppercase tracking-widest text-sm mb-6">Support</h4>
                    <ul class="space-y-4 text-sm font-medium">
                        <li><a href="#" class="hover:text-indigo-400 transition-colors">แจ้งปัญหาการใช้งาน</a></li>
                        <li><a href="#" class="hover:text-indigo-400 transition-colors">นโยบายการคืนเงิน</a></li>
                        <li><a href="#" class="hover:text-indigo-400 transition-colors">เงื่อนไขการให้บริการ</a></li>
                        <li><a href="#" class="hover:text-indigo-400 transition-colors">ติดต่อเราผ่าน Line</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white font-black uppercase tracking-widest text-sm mb-6">Payment Methods</h4>
                    <p class="text-xs mb-4 italic text-slate-500">เรารองรับช่องทางการชำระเงินที่หลากหลาย</p>
                    <div class="grid grid-cols-3 gap-3">
                        <div v-for="n in 6" :key="n"
                            class="h-10 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                            <span class="text-[8px] font-bold">PAYMENT</span>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] font-medium">
                <p>© 2026 NJ Gaming. All rights reserved.</p>
                <div class="flex gap-8">
                    <span class="flex items-center gap-2">
                        <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Server Status: Operational
                    </span>
                    <span class="text-slate-600">v1.4.2</span>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
// Mock Social Icons (หรือใช้ Lucide / FontAwesome)
const socials = [
    {
        name: 'Facebook',
        svg: { template: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>' }
    },
    {
        name: 'Discord',
        svg: { template: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>' }
    }
]
</script>

<style scoped>
@import "tailwindcss";

footer a {
    display: inline-block;
    position: relative;
}

footer ul a::after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: #6366f1;
    transition: width 0.3s ease;
}

footer ul a:hover::after {
    width: 100%;
}
</style>
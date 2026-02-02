<script setup>
import { User, Shield, ShieldCheck, UserMinus, UserCheck, Edit3, Trash2 } from 'lucide-vue-next'

const props = defineProps({
    users: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(["edit", "delete", "toggle-ban"])

const BASE_URL = import.meta.env.VITE_BACKEND || ""

const getRoleClass = (role) => {
    switch (role) {
        case "ADMIN":
            return "bg-purple-500/10 text-purple-400 border-purple-500/20"
        case "SELLER":
            return "bg-blue-500/10 text-blue-400 border-blue-500/20"
        default:
            return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
    }
}
</script>

<template>
    <div class="w-full overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="user-table-header">
                        <th class="px-8 py-6 italic">Identity Profile</th>
                        <th class="px-6 py-6 text-center italic">Access Level</th>
                        <th class="px-6 py-6 text-center italic">Protocol Status</th>
                        <th class="px-8 py-6 text-right italic">System Override</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-white/[0.03]">
                    <tr v-for="u in users" :key="u.id" class="group transition-all duration-300 hover:bg-white/[0.02]">

                        <td class="px-8 py-5 whitespace-nowrap">
                            <div class="flex items-center gap-4">
                                <div class="relative">
                                    <div v-if="!u.banned"
                                        class="absolute -inset-1 bg-blue-500/20 blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    </div>
                                    <div
                                        class="h-12 w-12 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center relative z-10 shadow-inner">
                                        <img v-if="u.avatar" :src="`${BASE_URL}${u.avatar}`" :alt="u.username"
                                            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            @error="$event.target.src = 'https://ui-avatars.com/api/?name=' + u.username + '&background=0D0D0D&color=fff'" />
                                        <User v-else class="w-5 h-5 text-zinc-600" />
                                    </div>
                                </div>

                                <div class="flex flex-col">
                                    <span
                                        class="font-black text-white tracking-wider text-sm uppercase group-hover:text-blue-400 transition-colors">
                                        {{ u.username }}
                                    </span>
                                    <span class="text-[10px] text-zinc-500 font-bold tracking-tight uppercase">
                                        {{ u.email }}
                                    </span>
                                </div>
                            </div>
                        </td>

                        <td class="px-6 py-5 text-center">
                            <div class="flex justify-center">
                                <span :class="getRoleClass(u.role)"
                                    class="flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black border uppercase tracking-[0.15em] shadow-sm">
                                    <ShieldCheck v-if="u.role === 'ADMIN'" :size="10" />
                                    <Shield v-else :size="10" />
                                    {{ u.role }}
                                </span>
                            </div>
                        </td>

                        <td class="px-6 py-5 text-center">
                            <span v-if="u.banned" class="status-badge-banned">
                                REJECTED
                            </span>
                            <span v-else class="status-badge-active">
                                AUTHORIZED
                            </span>
                        </td>

                        <td class="px-8 py-5">
                            <div
                                class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">

                                <button @click="$emit('edit', u)"
                                    class="p-2.5 bg-white/5 text-zinc-400 hover:bg-white hover:text-black rounded-xl transition-all shadow-lg"
                                    title="Modify Data">
                                    <Edit3 :size="16" stroke-width="2.5" />
                                </button>

                                <button @click="$emit('toggle-ban', u)" :disabled="u.role === 'ADMIN'" :class="u.role === 'ADMIN'
                                    ? 'opacity-10 cursor-not-allowed bg-transparent'
                                    : u.banned
                                        ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                                        : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white'
                                    " class="p-2.5 rounded-xl transition-all shadow-lg"
                                    :title="u.banned ? 'Restore Access' : 'Restrict Access'">
                                    <UserCheck v-if="u.banned" :size="16" stroke-width="2.5" />
                                    <UserMinus v-else :size="16" stroke-width="2.5" />
                                </button>

                                <button @click="$emit('delete', u)"
                                    class="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-lg"
                                    title="Purge Record">
                                    <Trash2 :size="16" stroke-width="2.5" />
                                </button>

                            </div>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

.user-table-header {
    @apply bg-white/[0.02] text-zinc-500 font-black uppercase tracking-[0.3em] text-[9px];
}

.status-badge-active {
    @apply inline-flex items-center px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(59_130_246_0.1)];
}

.status-badge-banned {
    @apply inline-flex items-center px-4 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[9px] font-black tracking-widest uppercase;
}
</style>
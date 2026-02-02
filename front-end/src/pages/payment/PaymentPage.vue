<template>
    <div class="min-h-screen bg-[#0a0a0b] px-6 py-16 flex items-center justify-center">

        <div
            class="w-full max-w-md bg-white/[0_03] backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">

            <!-- HEADER -->
            <div class="bg-blue-600/90 p-6 text-center relative">
                <div class="absolute inset-0 bg-blue-600 blur-2xl opacity-40"></div>
                <div class="relative z-10">
                    <h1 class="text-xl font-black text-white uppercase tracking-wide">
                        ชำระเงิน
                    </h1>
                    <p class="text-blue-100 text-sm mt-1">
                        กรุณาสแกน QR Code เพื่อชำระเงิน
                    </p>
                </div>
            </div>

            <!-- LOADING -->
            <div v-if="loading" class="p-20 text-center">
                <div
                    class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent">
                </div>
                <p class="mt-4 text-zinc-400 font-bold uppercase tracking-wide text-xs">
                    กำลังสร้าง QR Code...
                </p>
            </div>

            <!-- PAYMENT -->
            <div v-else-if="payment" class="p-8">

                <!-- AMOUNT -->
                <div class="text-center mb-8">
                    <p class="text-xs font-black text-zinc-500 uppercase tracking-[0.4em] mb-2">
                        Amount
                    </p>
                    <p class="text-4xl font-black text-white tracking-tight">
                        ฿{{ payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
                    </p>
                </div>

                <!-- QR -->
                <div class="text-center mb-8">
                    <div class="inline-block bg-white rounded-2xl p-5 shadow-[0_20px_50px_-20px_rgba(37_99_235_0.6)]">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png"
                            class="h-6 mx-auto mb-4" />

                        <img v-if="payment.qrCode" :src="payment.qrCode" class="w-64 h-64 mx-auto rounded-xl" />

                        <p v-else class="text-sm text-red-500 mt-4">
                            กรุณาติดต่อเจ้าหน้าที่
                        </p>
                    </div>
                </div>

                <!-- REF -->
                <div class="bg-white/[0_05] border border-white/10 rounded-xl px-4 py-3 text-center mb-10">
                    <p class="text-[10px] text-zinc-400 uppercase tracking-widest">
                        Reference
                    </p>
                    <p class="font-mono text-sm text-white mt-1">
                        {{ payment.ref }}
                    </p>
                </div>

                <!-- UPLOAD SLIP -->
                <div>
                    <h3 class="text-sm font-black text-white uppercase tracking-wide mb-4">
                        อัปโหลดสลิป
                    </h3>

                    <label class="cursor-pointer block">
                        <div v-if="!preview" class="border-2 border-dashed border-white/20 rounded-2xl p-10 text-center text-zinc-400
                                   hover:border-blue-500/50 transition-all">
                            คลิกเพื่อเลือกรูปสลิป
                        </div>

                        <div v-else>
                            <img :src="preview" class="w-full h-48 object-cover rounded-2xl border border-white/10" />
                        </div>

                        <input type="file" class="hidden" accept="image/*" @change="onFileChange" />
                    </label>

                    <!-- CONFIRM BUTTON -->
                    <button class="w-full mt-8 py-4 rounded-2xl font-black uppercase tracking-[0.3em] transition-all"
                        :class="file
                            ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_20px_50px_-20px_rgba(37_99_235_0.6)] text-white'
                            : 'bg-white/10 text-zinc-500 cursor-not-allowed'" :disabled="uploading || !file"
                        @click="uploadSlip">

                        <span v-if="uploading">
                            กำลังตรวจสอบ...
                        </span>
                        <span v-else>
                            ยืนยันการชำระเงิน
                        </span>
                    </button>

                    <!-- CANCEL -->
                    <button
                        class="w-full mt-4 text-xs text-zinc-500 hover:text-white uppercase tracking-widest transition"
                        @click="router.back()">
                        ยกเลิก
                    </button>
                </div>
            </div>

            <!-- ERROR -->
            <div v-else class="p-12 text-center text-red-500 font-bold">
                ไม่พบข้อมูลการชำระเงิน
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import api from "@/services/api"

const route = useRoute()
const router = useRouter()

const payment = ref(null)
const loading = ref(true)
const file = ref(null)
const preview = ref(null)
const uploading = ref(false)

/* ======================
   CREATE PAYMENT
====================== */
const createPayment = async () => {
    try {
        const orderId = route.params.orderId
        const res = await api.post("/payments/create", { orderId })

        if (!res.data.success) {
            throw new Error("create payment failed")
        }

        payment.value = res.data.data
    } catch (err) {
        console.error(err)
        alert("ไม่สามารถสร้างรายการชำระเงินได้")
        router.push("/buyer/orders")
    } finally {
        loading.value = false
    }
}

/* ======================
   FILE CHANGE
====================== */
const onFileChange = (e) => {
    const f = e.target.files[0]
    if (!f) return

    file.value = f
    preview.value = URL.createObjectURL(f)
}

/* ======================
   UPLOAD SLIP
====================== */
const uploadSlip = async () => {
    try {
        uploading.value = true

        const formData = new FormData()
        formData.append("paymentId", payment.value.id)
        formData.append("slip", file.value)

        const res = await api.post("/payments/upload-slip", formData)

        alert(res.data.autoApproved ? "ชำระเงินสำเร็จ 🎉" : "รอแอดมินตรวจสอบ")
        router.push("/buyer/library")
    } catch (err) {
        console.error(err)
        alert(err.response?.data?.message || "อัปโหลดสลิปล้มเหลว")
    } finally {
        uploading.value = false
    }
}

onMounted(createPayment)
</script>

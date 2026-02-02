import generatePayload from "promptpay-qr"
import QRCode from "qrcode"
import prisma from "../config/client.js"
import { getImageHash } from "../utils/getImageHash.js"
import { isFullMatch } from "../utils/isFullMatch.js"
import { readSlipText } from "../utils/ocr.js"

/* =========================
   CREATE PAYMENT
========================== */
export const createPayment = async (req, res) => {
    try {
        const userId = req.user.id
        const { orderId } = req.body

        if (!orderId) {
            return res.status(400).json({ message: "orderId required" })
        }

        const order = await prisma.order.findFirst({
            where: {
                id: Number(orderId),
                buyerId: userId,
                status: "PENDING"
            }
        })

        if (!order) {
            return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" })
        }

        // 🔁 กัน payment ซ้ำ (ยกเว้น REJECTED)
        const existing = await prisma.payment.findFirst({
            where: {
                orderId: order.id,
                status: { notIn: ["REJECTED"] }
            }
        })

        if (existing) {
            return res.json({ success: true, data: existing })
        }

        const payment = await prisma.payment.create({
            data: {
                orderId: order.id,
                amount: order.totalPrice,
                ref: `ORDER_${order.id}`,
                status: "PENDING"
            }
        })

        const payload = generatePayload(process.env.PROMPTPAY_ID, {
            amount: payment.amount
        })

        const qrCode = await new Promise((resolve, reject) => {
            QRCode.toDataURL(payload, (err, url) => {
                if (err) return reject(err)
                resolve(url)
            })
        })


        res.json({
            success: true,
            data: {
                id: payment.id,
                amount: payment.amount,
                ref: payment.ref,
                qrCode
            }
        })
    } catch (err) {
        console.error("CREATE PAYMENT ERROR:", err)
        res.status(500).json({ message: "สร้าง Payment ไม่สำเร็จ" })
    }
}

/* =========================
   UPLOAD SLIP
========================== */
export const uploadPaymentSlip = async (req, res) => {
    try {
        const userId = req.user.id
        const { paymentId } = req.body
        const file = req.file

        if (!file) {
            return res.status(400).json({ message: "กรุณาอัปโหลดสลิป" })
        }

        const payment = await prisma.payment.findFirst({
            where: {
                id: Number(paymentId),
                status: { in: ["PENDING", "WAITING_APPROVAL"] },
                order: { buyerId: userId }
            },
            include: {
                order: { include: { items: true } }
            }
        })

        if (!payment) {
            return res.status(404).json({ message: "ไม่พบ payment" })
        }

        // 🔒 กันสลิปซ้ำ
        const imageHash = await getImageHash(file.path)
        const duplicated = await prisma.payment.findFirst({
            where: {
                slipHash: imageHash,
                NOT: { id: payment.id }
            }
        })

        if (duplicated) {
            return res.status(400).json({ message: "สลิปนี้ถูกใช้ไปแล้ว" })
        }

        const ocrText = await readSlipText(file.path)

        const matchResult = isFullMatch({
            ocrText,
            ref: payment.ref,
            amount: payment.amount
        })

        if (matchResult.score === 0) {
            return res.status(400).json({ message: "ข้อมูลไม่ตรง" })
        }

        const isAuto = matchResult.score === 100

        // 🔥 TRANSACTION
        await prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    slipUrl: file.path,
                    slipHash: imageHash,
                    ocrText,
                    matchScore: matchResult.score,
                    status: isAuto ? "SUCCESS" : "WAITING_APPROVAL",
                    autoApproved: isAuto,
                    approvedAt: isAuto ? new Date() : null,
                    paidAt: new Date()
                }
            })

            if (isAuto) {
                await tx.order.update({
                    where: { id: payment.orderId },
                    data: { status: "PAID" }
                })

                const libraries = payment.order.items.map(item => ({
                    userId,
                    gameId: item.gameId,
                    orderId: payment.orderId
                }))

                await tx.library.createMany({
                    data: libraries,
                    skipDuplicates: true
                })
            }
        })

        res.json({ success: true, autoApproved: isAuto })
    } catch (err) {
        console.error("UPLOAD SLIP ERROR:", err)
        res.status(500).json({ message: "อัปโหลดสลิปล้มเหลว" })
    }
}

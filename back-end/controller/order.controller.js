import prisma from "../config/client.js"

/* =========================
   CREATE ORDER
========================== */
export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id
        const { items } = req.body

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Items required"
            })
        }

        /* =========================
           Validate quantity
        ========================== */
        for (const item of items) {
            if (!item.gameId || item.quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "ข้อมูลสินค้าไม่ถูกต้อง"
                })
            }
        }

        /* =========================
           🔒 กันซื้อซ้ำ (รวดเดียว)
        ========================== */
        const ownedGames = await prisma.library.findMany({
            where: {
                userId,
                gameId: { in: items.map(i => i.gameId) }
            },
            select: { gameId: true }
        })

        if (ownedGames.length > 0) {
            return res.status(400).json({
                success: false,
                message: "มีเกมที่คุณเคยซื้อแล้ว"
            })
        }

        /* =========================
           ดึงเกมจาก DB (เชื่อถือได้)
        ========================== */
        const games = await prisma.game.findMany({
            where: {
                id: { in: items.map(i => i.gameId) },
                status: "PUBLISHED"
            }
        })

        if (games.length !== items.length) {
            return res.status(400).json({
                success: false,
                message: "มีเกมบางรายการไม่สามารถซื้อได้"
            })
        }

        /* =========================
           คำนวณราคา
        ========================== */
        let totalPrice = 0

        const orderItems = items.map(item => {
            const game = games.find(g => g.id === item.gameId)
            const price = game.price * item.quantity
            totalPrice += price

            return {
                gameId: game.id,
                price: game.price,
                quantity: item.quantity
            }
        })

        /* =========================
           Transaction (สำคัญมาก)
        ========================== */
        const order = await prisma.$transaction(async tx => {
            return tx.order.create({
                data: {
                    buyerId: userId,
                    totalPrice,
                    status: "PENDING",
                    items: {
                        create: orderItems
                    }
                },
                include: {
                    items: {
                        include: {
                            game: {
                                select: {
                                    id: true,
                                    title: true,
                                    price: true
                                }
                            }
                        }
                    }
                }
            })
        })

        res.status(201).json({
            success: true,
            data: order
        })
    } catch (err) {
        console.error("CREATE ORDER ERROR:", err)
        res.status(500).json({
            success: false,
            message: "สร้างคำสั่งซื้อไม่สำเร็จ"
        })
    }
}

/* =========================
   MY ORDERS
========================== */
export const myOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                buyerId: req.user.id
            },
            include: {
                items: {
                    include: {
                        game: {
                            include: {
                                gameMedias: true
                            }
                        }
                    }
                },
                payments: {
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        res.json({
            success: true,
            data: orders
        })
    } catch (err) {
        console.error("MY ORDERS ERROR:", err)
        res.status(500).json({
            success: false,
            message: "โหลดคำสั่งซื้อไม่สำเร็จ"
        })
    }
}

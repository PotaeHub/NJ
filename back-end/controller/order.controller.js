import prisma from "../config/client.js";

export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id
        const { items } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Items required' })
        }

        // 🔴 เช็กซื้อซ้ำ
        for (const item of items) {
            const owned = await hasPurchasedGame(userId, item.gameId)
            if (owned) {
                return res.status(400).json({
                    success: false,
                    message: 'คุณซื้อเกมนี้ไปแล้ว'
                })
            }
        }

        const totalPrice = items.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0
        )

        const order = await prisma.order.create({
            data: {
                buyerId: userId,
                totalPrice,
                status: 'PAID',
                items: {
                    create: items
                }
            }
        })
        res.status(201).json({ success: true, data: order })
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false })
    }
}

const hasPurchasedGame = async (userId, gameId) => {
    const item = await prisma.orderItem.findFirst({
        where: {
            gameId,
            order: {
                buyerId: userId,
                status: {
                    in: ['PAID', 'COMPLETED']
                }
            }
        }
    })

    return !!item
}
export const myOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { buyerId: req.user.id },
            include: {
                items: {
                    include: {
                        game: {
                            include: {
                                gameMedias: true
                            }
                        }
                    }
                }
            }
        })

        res.json({ data: orders })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'โหลดคำสั่งซื้อไม่สำเร็จ' })
    }
}


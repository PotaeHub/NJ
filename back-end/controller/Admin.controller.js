import prisma from "../config/client.js";
import { deleteFile } from "../utils/file.js";
import bcrypt from "bcryptjs";
// ➕ CREATE
export const createGame = async (req, res) => {
    try {
        const { title, description, price, stock, status } = req.body

        const image = req.files?.image?.[0]
        const video = req.files?.video?.[0]

        const game = await prisma.game.create({
            data: {
                title,
                description,
                price: Number(price),
                stock: Number(stock),
                status,
                sellerId: req.user.id,

                gameMedias: {
                    create: [
                        ...(image ? [{
                            type: "IMAGE",
                            url: `/uploads/games/images/${image.filename}`
                        }] : []),
                        ...(video ? [{
                            type: "VIDEO",
                            url: `/uploads/games/videos/${video.filename}`
                        }] : [])
                    ]
                }
            },
            include: { gameMedias: true }
        })

        res.status(201).json(game)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}


// 📋 READ
export const getAllGames = async (req, res) => {
    try {
        const games = await prisma.game.findMany({
            include: {
                gameMedias: true
            },
            orderBy: { createdAt: "desc" }
        })
        res.json(games)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
// ✏️ UPDATE
export const updateGame = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, price, stock, status } = req.body

        const image = req.files?.image?.[0]
        const video = req.files?.video?.[0]

        const game = await prisma.game.update({
            where: { id: Number(id) },
            data: {
                title,
                description,
                price: price ? Number(price) : undefined,
                stock: stock ? Number(stock) : undefined,
                status,

                ...(image || video ? {
                    gameMedias: {
                        deleteMany: {}, // ลบ media เก่าทั้งหมด
                        create: [
                            ...(image ? [{
                                type: "IMAGE",
                                url: `/uploads/games/images/${image.filename}`
                            }] : []),
                            ...(video ? [{
                                type: "VIDEO",
                                url: `/uploads/games/videos/${video.filename}`
                            }] : [])
                        ]
                    }
                } : {})
            },
            include: { gameMedias: true }
        })

        res.json(game)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}


// 🗑️ DELETE
export const deleteGame = async (req, res) => {
    try {
        const { id } = req.params

        const medias = await prisma.gameMedia.findMany({
            where: { gameId: Number(id) }
        })

        for (const m of medias) {
            deleteFile(m.url)
        }

        await prisma.gameMedia.deleteMany({
            where: { gameId: Number(id) }
        })

        await prisma.game.delete({
            where: { id: Number(id) }
        })

        res.json({ message: "Game deleted" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}


// Dashboard 
export const getAdminDashboard = async (req, res) => {
    try {
        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)

        const [
            // ===== SUMMARY =====
            totalUsers,
            totalGames,
            totalOrders,
            ordersToday,
            revenueCompleted,

            // ===== ANALYTICS =====
            dailySales,
            monthlySales,
            cumulativeRevenue,
            orderStatus,
            topGames,
            topSellers,
            newUsers
        ] = await Promise.all([

            // ---------- SUMMARY ----------
            prisma.user.count(),
            prisma.game.count(),
            prisma.order.count(),
            prisma.order.count({
                where: { createdAt: { gte: startOfToday } }
            }),
            prisma.order.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { totalPrice: true }
            }),

            // ---------- DAILY SALES ----------
            prisma.$queryRaw`
        SELECT DATE(createdAt) date, SUM(totalPrice) total
        FROM \`Order\`
        WHERE status='COMPLETED'
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,

            // ---------- MONTHLY SALES ----------
            prisma.$queryRaw`
        SELECT MONTH(createdAt) month, SUM(totalPrice) total
        FROM \`Order\`
        WHERE status='COMPLETED'
        GROUP BY MONTH(createdAt)
        ORDER BY month ASC
      `,

            // ---------- CUMULATIVE REVENUE ----------
            prisma.$queryRaw`
        SELECT DATE(createdAt) date,
        SUM(SUM(totalPrice)) OVER (ORDER BY DATE(createdAt)) total
        FROM \`Order\`
        WHERE status='COMPLETED'
        GROUP BY DATE(createdAt)
        ORDER BY date ASC
      `,

            // ---------- ORDER STATUS ----------
            prisma.order.groupBy({
                by: ['status'],
                _count: { _all: true }
            }),

            // ---------- TOP GAMES ----------
            prisma.$queryRaw`
        SELECT g.title game, SUM(oi.quantity) total
        FROM OrderItem oi
        JOIN Game g ON oi.gameId = g.id
        GROUP BY g.id
        ORDER BY total DESC
        LIMIT 5
      `,

            // ---------- TOP SELLERS ----------
            prisma.$queryRaw`
        SELECT u.username seller, SUM(o.totalPrice) total
        FROM \`Order\` o
        JOIN User u ON o.buyerId = u.id
        WHERE o.status='COMPLETED'
        GROUP BY u.id
        ORDER BY total DESC
        LIMIT 5
      `,

            // ---------- NEW USERS ----------
            prisma.$queryRaw`
        SELECT MONTH(createdAt) month, COUNT(*) total
        FROM User
        GROUP BY MONTH(createdAt)
        ORDER BY month ASC
      `
        ])

        res.json({
            summary: {
                users: Number(totalUsers),
                games: Number(totalGames),
                orders: Number(totalOrders),
                ordersToday: Number(ordersToday),
                revenue: Number(revenueCompleted._sum.totalPrice || 0)
            },

            analytics: {
                dailySales: dailySales.map(r => ({
                    date: r.date,
                    total: Number(r.total)
                })),
                monthlySales: monthlySales.map(r => ({
                    month: Number(r.month),
                    total: Number(r.total)
                })),
                cumulativeRevenue: cumulativeRevenue.map(r => ({
                    date: r.date,
                    total: Number(r.total)
                })),
                orderStatus: orderStatus.map(r => ({
                    status: r.status,
                    count: Number(r._count._all)
                })),
                topGames: topGames.map(r => ({
                    game: r.game,
                    total: Number(r.total)
                })),
                topSellers: topSellers.map(r => ({
                    seller: r.seller,
                    total: Number(r.total)
                })),
                newUsers: newUsers.map(r => ({
                    month: Number(r.month),
                    total: Number(r.total)
                }))
            }
        })

    } catch (err) {
        console.error('Admin dashboard error:', err)
        res.status(500).json({ message: 'Failed to load dashboard' })
    }
}
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                banned: true,
                avatar: true,
                createdAt: true
            }
        })
        res.json(users)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message })
    }
}
export const updateRole = async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.body

        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { role }
        })

        res.json(user)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message })
    }
}
// Ban
export const toggleBanUser = async (req, res) => {
    try {
        const targetId = Number(req.params.id)
        const adminId = req.user.id

        if (!targetId) {
            return res.status(400).json({ message: "Invalid user id" })
        }

        // ❌ ห้าม ban ตัวเอง
        if (targetId === adminId) {
            return res.status(400).json({
                message: "You cannot ban yourself"
            })
        }

        const user = await prisma.user.findUnique({
            where: { id: targetId }
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const updated = await prisma.user.update({
            where: { id: targetId },
            data: { banned: !user.banned },
            select: {
                id: true,
                username: true,
                banned: true
            }
        })

        res.json(updated)
    } catch (error) {
        console.error("BAN USER ERROR:", error)
        res.status(500).json({ message: "Server error" })
    }
}
// Order
export const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                buyer: {
                    select: { username: true }
                },
                items: {
                    include: { game: true }
                }
            }
        })

        res.json(orders)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message })
    }
}
export const confirmPayment = async (req, res) => {
    try {
        const { id } = req.params

        const order = await prisma.order.update({
            where: { id: Number(id) },
            data: { status: "PAID" }
        })

        res.json(order)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message })
    }
}
export const orderMy = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { buyerId: req.user.id },
            include: { items: true }
        })
        res.json(orders)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message })
    }
}
// User 
export const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body

        /* ================= VALIDATION ================= */
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            })
        }

        /* ================= CHECK DUPLICATE ================= */
        const exists = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }]
            }
        })

        if (exists) {
            return res.status(409).json({
                message: "Username or email already exists"
            })
        }

        /* ================= HASH PASSWORD ================= */
        const hashed = await bcrypt.hash(password, 10)

        /* ================= AVATAR ================= */
        const avatar = req.file
            ? `/uploads/avatar/${req.file.filename}`
            : null

        /* ================= CREATE ================= */
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashed,
                role: role || "BUYER",
                avatar
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                banned: true,
                avatar: true
            }
        })

        res.status(201).json(user)

    } catch (err) {
        console.error("Create user error:", err)
        res.status(500).json({
            message: "Failed to create user"
        })
    }
}
export const updateUser = async (req, res) => {
    try {
        const userId = Number(req.params.id)

        if (!userId) {
            return res.status(400).json({ message: "User id is required" })
        }

        const { username, email, role } = req.body

        /* ================= FIND USER ================= */
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" })
        }

        /* ================= AVATAR ================= */
        let avatar = existingUser.avatar
        if (req.file) {
            avatar = `/uploads/avatar/${req.file.filename}`
        }

        /* ================= UPDATE ================= */
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                username,
                email,
                role,
                avatar
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                avatar: true,
                banned: true
            }
        })

        res.json(user)

    } catch (err) {
        console.error("Update user error:", err)
        res.status(500).json({ message: "Update user failed" })
    }
}
export const deleteUser = async (req, res) => {
    const targetId = Number(req.params.id)
    const adminId = req.user.id   // มาจาก auth middleware

    if (targetId === adminId) {
        return res.status(400).json({
            message: "You cannot delete your own admin account"
        })
    }

    await prisma.user.delete({
        where: { id: targetId }
    })

    res.json({ message: "User deleted" })
}
// Order

export const adminGetOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                buyer: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                },
                items: {
                    include: {
                        game: {
                            select: {
                                id: true,
                                title: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const result = orders.map(order => ({
            ...order,
            totalPrice: Number(order.totalPrice)
        }))

        res.status(200).json(result)

    } catch (error) {
        console.error("adminGetOrders error:", error)
        res.status(500).json({ message: "Failed to load orders" })
    }
}


export const adminGetOrderById = async (req, res) => {
    const id = Number(req.params.id)

    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                buyer: {
                    select: { username: true }
                },
                items: {
                    include: {
                        game: { select: { title: true } }
                    }
                }
            }
        })

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        res.json(order)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to load order" })
    }
}


export const adminUpdateStatus = async (req, res) => {
    const id = Number(req.params.id)
    const { status } = req.body

    const allow = ["PENDING", "PAID", "COMPLETED", "CANCELLED"]
    if (!allow.includes(status)) {
        return res.status(400).json({ message: "Invalid status" })
    }

    try {
        const order = await prisma.order.update({
            where: { id },
            data: { status }
        })

        res.json(order)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Update status failed" })
    }
}


export const adminCompleteOrder = async (req, res) => {
    const id = Number(req.params.id)

    try {
        await prisma.$transaction(async (tx) => {

            const order = await tx.order.findUnique({
                where: { id },
                include: { items: true }
            })

            if (!order) throw new Error("Order not found")
            if (order.status !== "PAID") {
                throw new Error("Order is not PAID")
            }

            // ลด stock เกม
            for (const item of order.items) {
                await tx.game.update({
                    where: { id: item.gameId },
                    data: {
                        stock: { decrement: item.quantity }
                    }
                })
            }

            // เปลี่ยนสถานะ
            await tx.order.update({
                where: { id },
                data: { status: "COMPLETED" }
            })
        })

        res.json({ message: "Order completed" })
    } catch (err) {
        console.error(err)
        res.status(400).json({
            message: err.message || "Complete order failed"
        })
    }
}

export const adminCancelOrder = async (req, res) => {
    const id = Number(req.params.id)

    try {
        const order = await prisma.order.update({
            where: { id },
            data: { status: "CANCELLED" }
        })

        res.json(order)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Cancel order failed" })
    }
}





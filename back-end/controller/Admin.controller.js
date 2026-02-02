import prisma from "../config/client.js";
import { deleteFile } from "../utils/file.js";
import bcrypt from "bcryptjs";
import path from "path"
import fs from 'fs'
export const createGame = async (req, res) => {
    try {
        let {
            title,
            description,
            price,
            stock,
            status,
            categories
        } = req.body

        if (typeof categories === "string") {
            categories = JSON.parse(categories)
        }

        const images = req.files?.images || []
        const videos = req.files?.videos || []

        console.log("🆕 CREATE GAME")
        console.log("categories:", categories)
        console.log("images:", images.length)
        console.log("videos:", videos.length)

        const game = await prisma.game.create({
            data: {
                title,
                description,
                price: Number(price),
                stock: Number(stock),
                status,
                sellerId: req.user.id,

                categories: categories?.length
                    ? {
                        connect: categories.map(id => ({
                            id: Number(id)
                        }))
                    }
                    : undefined,

                gameMedias: {
                    create: [
                        ...images.map(f => ({
                            type: "IMAGE",
                            url: `/uploads/games/images/${f.filename}`
                        })),
                        ...videos.map(f => ({
                            type: "VIDEO",
                            url: `/uploads/games/videos/${f.filename}`
                        }))
                    ]
                }
            },
            include: {
                gameMedias: true,
                categories: true
            }
        })

        res.status(201).json(game)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}
export const getAllGames = async (req, res) => {
    try {
        const { category } = req.query

        const games = await prisma.game.findMany({
            where: category
                ? {
                    categories: {
                        some: {
                            type: category   // ACTION / RPG / SPORT
                        }
                    }
                }
                : {},
            include: {
                gameMedias: true,
                categories: true
            },
            orderBy: { createdAt: "desc" }
        })

        res.json(games)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
export const updateGame = async (req, res) => {
    try {
        const { id } = req.params
        let {
            title,
            description,
            price,
            stock,
            status,
            categories,
            keepMediaIds
        } = req.body

        if (categories) categories = JSON.parse(categories)
        if (keepMediaIds) keepMediaIds = JSON.parse(keepMediaIds)

        const images = req.files?.images || []
        const videos = req.files?.videos || []

        console.log("✏️ UPDATE GAME:", id)
        console.log("categories:", categories)
        console.log("keepMediaIds:", keepMediaIds)
        console.log("new images:", images.length)
        console.log("new videos:", videos.length)

        /* ================= DELETE MEDIA ================= */
        if (Array.isArray(keepMediaIds)) {
            await prisma.gameMedia.deleteMany({
                where: {
                    gameId: Number(id),
                    id: { notIn: keepMediaIds }
                }
            })
        }

        /* ================= UPDATE GAME ================= */
        const game = await prisma.game.update({
            where: { id: Number(id) },
            data: {
                title,
                description,
                price: Number(price),
                stock: Number(stock),
                status,

                categories: categories
                    ? {
                        set: categories.map(id => ({
                            id: Number(id)
                        }))
                    }
                    : undefined,

                gameMedias: {
                    create: [
                        ...images.map(f => ({
                            type: "IMAGE",
                            url: `/uploads/games/images/${f.filename}`
                        })),
                        ...videos.map(f => ({
                            type: "VIDEO",
                            url: `/uploads/games/videos/${f.filename}`
                        }))
                    ]
                }
            },
            include: {
                gameMedias: true,
                categories: true
            }
        })

        res.json(game)
    } catch (err) {
        console.error("❌ UPDATE ERROR", err)
        res.status(500).json({ message: err.message })
    }
}

const deleteFileSafe = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    } catch (err) {
        console.warn('Delete file failed:', filePath)
    }
}

export const deleteGame = async (req, res) => {
    const gameId = Number(req.params.id)

    try {
        await prisma.$transaction(async (tx) => {

            /* =========================
               1. Load medias
            ========================= */
            const medias = await tx.gameMedia.findMany({
                where: { gameId }
            })

            /* =========================
               2. Delete media files
            ========================= */
            for (const media of medias) {
                const fullPath = path.join(process.cwd(), media.url)
                deleteFileSafe(fullPath)
            }

            /* =========================
               3. Delete relations
            ========================= */

            // ตัวอย่างตารางลูก (ลบเท่าที่มีใน schema จริง)
            await tx.gameMedia.deleteMany({ where: { gameId } })
            await tx.orderItem?.deleteMany?.({ where: { gameId } })
            await tx.review?.deleteMany?.({ where: { gameId } })
            await tx.gameCategory?.deleteMany?.({ where: { gameId } })
            await tx.gameTag?.deleteMany?.({ where: { gameId } })

            /* =========================
               4. Delete game
            ========================= */
            await tx.game.delete({
                where: { id: gameId }
            })
        })

        res.json({
            success: true,
            message: 'Game and all related data deleted'
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: err.message
        })
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
                                title: true,
                                price: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
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
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
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

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        res.json({
            ...order,
            totalPrice: Number(order.totalPrice)
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to load order" })
    }
}
export const adminUpdateStatus = async (req, res) => {
    const id = Number(req.params.id)
    const { status } = req.body

    const allowStatus = ["PENDING", "PAID", "COMPLETED", "CANCELLED"]
    if (!allowStatus.includes(status)) {
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
    const orderId = Number(req.params.id)

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: true // ✅ ใช้ items ถูกแล้ว
            }
        })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบคำสั่งซื้อ"
            })
        }

        if (order.status !== "PAID") {
            return res.status(400).json({
                success: false,
                message: "ออเดอร์ยังไม่อยู่ในสถานะ PAID"
            })
        }

        await prisma.$transaction(async (tx) => {
            // 1️⃣ เปลี่ยนสถานะ order
            await tx.order.update({
                where: { id: orderId },
                data: {
                    status: "COMPLETED"
                }
            })

            // 2️⃣ เพิ่มเกมเข้า Library
            for (const item of order.items) {
                await tx.library.upsert({
                    where: {
                        userId_gameId: {
                            userId: order.buyerId, // ✅ สำคัญมาก
                            gameId: item.gameId
                        }
                    },
                    update: {},
                    create: {
                        userId: order.buyerId,  // ✅ ใส่ตรง ๆ
                        gameId: item.gameId,
                        orderId: order.id
                    }
                })
            }
        })

        res.json({
            success: true,
            message: "Order COMPLETED และเพิ่มเกมเข้า Library แล้ว"
        })
    } catch (err) {
        console.error("adminCompleteOrder error:", err)
        res.status(500).json({
            success: false,
            message: "Complete order failed"
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
// Category
export const adminCreateCategory = async (req, res) => {
    try {
        const { name } = req.body

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "name and type are required"
            })
        }

        const existsCategory = await prisma.category.findUnique({
            where: { name }
        })

        if (existsCategory) {
            return res.status(400).json({
                success: false,
                message: "ชื่อหมวดหมู่มีอยู่แล้ว"
            })
        }

        const category = await prisma.category.create({
            data: { name }
        })

        res.status(201).json({
            success: true,
            message: "Created category successfully",
            data: category
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}


export const adminGetAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: "desc" }
        })

        res.status(200).json({
            success: true,
            data: categories
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export const adminGetCategoryById = async (req, res) => {
    try {
        const { id } = req.params

        const category = await prisma.category.findUnique({
            where: { id: Number(id) }
        })

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        res.status(200).json({
            success: true,
            data: category
        })
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export const adminUpdateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { name, icon, type } = req.body

        const category = await prisma.category.update({
            where: { id: Number(id) },
            data: {
                ...(name && { name }),
                ...(icon !== undefined && { icon }),
                ...(type && { type })
            }
        })

        res.status(200).json({
            success: true,
            message: "Updated category successfully",
            data: category
        })
    } catch (error) {
        console.error(error)

        if (error.code === "P2002") {
            return res.status(400).json({
                success: false,
                message: "Category name already exists"
            })
        }

        res.status(500).json({
            success: false,
            message: "Update failed"
        })
    }
}

export const adminDeleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        const categoryId = Number(id)

        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        })

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        // ✅ ตัด relation กับ game ก่อน
        await prisma.category.update({
            where: { id: categoryId },
            data: {
                games: {
                    set: [] // clear many-to-many
                }
            }
        })

        await prisma.category.delete({
            where: { id: categoryId }
        })

        res.status(200).json({
            success: true,
            message: "Deleted category successfully"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}
// Payment
export const adminApprovePayment = async (req, res) => {
    try {
        const { paymentId } = req.body

        const payment = await prisma.payment.findFirst({
            where: {
                id: Number(paymentId),
                status: "WAITING_APPROVAL"
            },
            include: {
                order: { include: { items: true } }
            }
        })

        if (!payment) {
            return res.status(404).json({ message: "ไม่พบ Payment ที่รอตรวจสอบ" })
        }

        await prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    status: "SUCCESS",
                    paidAt: new Date(),
                    approvedByAdmin: true
                }
            })

            await tx.order.update({
                where: { id: payment.orderId },
                data: { status: "PAID" }
            })

            for (const item of payment.order.items) {
                await tx.library.create({
                    data: {
                        userId: payment.order.buyerId,
                        gameId: item.gameId,
                        orderId: payment.orderId
                    }
                })
            }
        })

        res.json({ message: "Admin อนุมัติสำเร็จ" })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Admin approve ล้มเหลว" })
    }
}




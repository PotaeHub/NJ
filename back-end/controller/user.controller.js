import prisma from "../config/client.js";


export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id
        const { username } = req.body

        const data = { username }

        if (req.file) {
            data.avatar = `/uploads/avatar/${req.file.filename}`
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                avatar: true
            }
        })

        res.json(user)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
export const getMyLibrary = async (req, res) => {
    try {
        const userId = req.user.id

        const libraries = await prisma.library.findMany({
            where: {
                userId
            },
            include: {
                game: {
                    include: {
                        gameMedias: true,
                        seller: {
                            select: {
                                id: true,
                                username: true
                            }
                        }
                    }
                },
                order: {
                    select: {
                        id: true,
                        createdAt: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        res.json({
            success: true,
            data: libraries
        })
    } catch (err) {
        console.error("getMyLibrary error:", err)
        res.status(500).json({
            success: false,
            message: "โหลดคลังเกมไม่สำเร็จ"
        })
    }
}
export const checkOwnership = async (req, res) => {
    const userId = req.user.id
    const gameId = Number(req.params.gameId)

    const owned = await prisma.library.findFirst({
        where: {
            userId,
            gameId
        }
    })

    if (!owned) {
        return res.status(403).json({
            message: "คุณยังไม่ได้เป็นเจ้าของเกมนี้"
        })
    }

    res.json({ owned: true })
}
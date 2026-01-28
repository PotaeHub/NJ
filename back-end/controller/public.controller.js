import prisma from "../config/client.js"
export const getAllGames = async (req, res) => {
    try {
        const { category } = req.query
        console.log("🔥 category =", category)

        const games = await prisma.game.findMany({
            where: {
                status: "PUBLISHED",
                stock: { gt: 0 },
                ...(category
                    ? {
                        categories: {
                            some: {
                                name: category
                            }
                        }
                    }
                    : {})
            },
            include: {
                gameMedias: true,
                categories: true
            }
        })

        res.json({ data: games })
    } catch (err) {
        console.error("❌ Prisma error:", err)
        res.status(500).json({ message: err.message })
    }
}


export const getPublicCategories = async (req, res) => {
    const categories = await prisma.category.findMany({
        orderBy: { id: "asc" }
    })

    res.json({
        data: categories
    })
}

import prisma from "../config/client.js";

export const getGames = async (req, res) => {
    const { search = '', sort = 'latest' } = req.query

    let orderBy = { createdAt: 'desc' }
    if (sort === 'price_asc') orderBy = { price: 'asc' }
    if (sort === 'price_desc') orderBy = { price: 'desc' }

    const games = await prisma.game.findMany({
        where: search
            ? {
                OR: [
                    { title: { contains: search } },
                    { description: { contains: search } }
                ]
            }
            : {},
        include: {
            gameMedias: true,
            seller: {
                select: { id: true, username: true }
            }
        },
        orderBy
    })

    res.json({ data: games })
}
export const getGameById = async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Game id is required'
            })
        }

        const game = await prisma.game.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                seller: true,
                gameMedias: true,
                reviews: {
                    include: {
                        user: {
                            select: { id: true, username: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })


        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found'
            })
        }

        res.json({
            success: true,
            data: game
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false })
    }
}

export const createGame = async (req, res) => {
    try {
        const { title, description, price, stock } = req.body

        if (!title || !price || stock == null) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            })
        }

        const game = await prisma.game.create({
            data: {
                title,
                description,
                price: Number(price),
                stock: Number(stock),
                sellerId: req.user.id,
                status: 'DRAFT'
            }
        })

        res.status(201).json({
            success: true,
            data: game
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false
        })
    }
}
export const checkOwnership = async (req, res) => {
    const userId = req.user.id
    const gameId = Number(req.params.id)

    const owned = await prisma.orderItem.findFirst({
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

    res.json({
        owned: !!owned
    })
}

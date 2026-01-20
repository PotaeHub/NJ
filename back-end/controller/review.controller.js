import prisma from "../config/client.js";

export const createReview = async (req, res) => {
    const { gameId, comment, rating } = req.body
    const userId = req.user.id

    // เช็คว่าเคยซื้อเกมไหม
    const owned = await prisma.orderItem.findFirst({
        where: {
            gameId,
            order: {
                buyerId: userId
            }
        }
    })

    if (!owned) {
        return res.status(403).json({ message: 'You must own this game to review' })
    }

    // เช็ครีวิวซ้ำ
    const exists = await prisma.review.findUnique({
        where: {
            userId_gameId: {
                userId,
                gameId
            }
        }
    })

    if (exists) {
        return res.status(400).json({ message: 'You already reviewed this game' })
    }
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
            message: 'Rating must be between 1 and 5'
        })
    }
    const review = await prisma.review.create({
        data: {
            userId,
            gameId,
            comment,
            rating
        }
    })

    res.json({ success: true, data: review })
}

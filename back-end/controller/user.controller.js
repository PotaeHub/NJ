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

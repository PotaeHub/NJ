import prisma from '../config/client.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const createToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )
}

export const register = async (req, res) => {
    try {
        console.log('BODY:', req.body)
        const { username, email, password } = req.body

        const exist = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        })
        if (exist) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hash
            }
        })

        res.status(201).json({ message: 'Register success' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = createToken(user)

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                avatar: user.avatar
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

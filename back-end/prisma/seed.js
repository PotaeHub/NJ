import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    const password = await bcrypt.hash('123456', 10)

    // ===== USERS =====
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@test.com',
            password,
            role: 'ADMIN'
        }
    })

    const seller = await prisma.user.upsert({
        where: { username: 'seller1' },
        update: {},
        create: {
            username: 'seller1',
            email: 'seller@test.com',
            password,
            role: 'SELLER'
        }
    })

    // ===== CATEGORIES =====
    const action = await prisma.category.upsert({
        where: { name: 'Action' },
        update: {},
        create: {
            name: 'Action',
            type: 'ACTION',
            icon: 'Swords'
        }
    })

    const rpg = await prisma.category.upsert({
        where: { name: 'RPG' },
        update: {},
        create: {
            name: 'RPG',
            type: 'RPG',
            icon: 'Shield'
        }
    })

    // ===== GAME =====
    await prisma.game.upsert({
        where: { id: 1 }, // ใช้ id หรือ unique field
        update: {},
        create: {
            title: 'Cyber Ninja',
            description: 'Fast-paced cyber action game',
            price: 499,
            stock: 10,
            sellerId: seller.id,
            categories: {
                connect: [{ id: action.id }]
            }
        }
    })

    console.log('✅ Seed completed')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())

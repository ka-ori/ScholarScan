import prisma from '../src/config/database.js'
import bcrypt from 'bcryptjs'

const seed = async () => {
  try {
    const hashedPassword = await bcrypt.hash('demo123', 10)

    const demoUsers = [
      {
        email: 'demo@scholarscan.com',
        password: hashedPassword,
        name: 'Demo User'
      },
      {
        email: 'student@scholarscan.com',
        password: hashedPassword,
        name: 'Student Account'
      },
      {
        email: 'researcher@scholarscan.com',
        password: hashedPassword,
        name: 'Researcher Account'
      }
    ]

    for (const user of demoUsers) {
      const existing = await prisma.user.findUnique({
        where: { email: user.email }
      })

      if (!existing) {
        await prisma.user.create({
          data: user
        })
        console.log(`Created user: ${user.email}`)
      } else {
        console.log(`User already exists: ${user.email}`)
      }
    }

    console.log('Database seeding completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seed()

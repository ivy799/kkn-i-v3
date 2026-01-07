import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL!

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter })
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({ adapter })
  }
  prisma = global.__prisma
}

export { prisma as getPrisma }
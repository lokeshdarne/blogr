import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
    pool: Pool | undefined
}

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set')
    }

    // Use a connection pool for better serverless compatibility with Supabase
    const pool = globalForPrisma.pool ?? new Pool({ connectionString })
    if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool

    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
}

// Lazy-initialize Prisma client to avoid build-time errors
export const prisma = new Proxy({} as PrismaClient, {
    get(target, prop) {
        const client = globalForPrisma.prisma ?? createPrismaClient()
        if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client
        return Reflect.get(client, prop, client)
    }
})

export default prisma

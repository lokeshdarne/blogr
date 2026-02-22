import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set')
    }
    const adapter = new PrismaPg({ connectionString })
    return new PrismaClient({ adapter })
}

// Lazy-initialize Prisma client to avoid build-time errors
// This ensures the client is only created when actually used at runtime
export const prisma = new Proxy({} as PrismaClient, {
    get(target, prop) {
        const client = globalForPrisma.prisma ?? createPrismaClient()
        if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client
        return Reflect.get(client, prop, client)
    }
})

export default prisma

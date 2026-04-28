"use server"
import { db } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const getInterviewers = async () => {
    const user = await currentUser()
    if (!user) return []
    try {
        const interviewers = await db.user.findMany({
            where: {
                role: "INTERVIEWER",
                id: { not: user.id }
            },
            select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
                title: true,
                company: true,
                categories: true,
                bio: true,
                yearsExp: true,
                creditRate: true,
                availabilities: {
                    where: { status: "AVAILABLE" },
                    select: { startTime: true, endTime: true, id: true },
                    take: 1
                }
            },
            orderBy: { createdAt: "desc" }
        })
        return interviewers
    } catch (error) {
        console.log(error)
        return []
    }
}

export const getInterviewerById = async (id: string) => {
    const user = await currentUser()
    if (!user) return null
    try {
        const interviewer = await db.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
                title: true,
                company: true,
                categories: true,
                bio: true,
                yearsExp: true,
                creditRate: true,
                availabilities: {
                    where: { status: "AVAILABLE" },
                    select: { startTime: true, endTime: true, id: true },
                    orderBy: { startTime: "asc" }
                }
            }
        })
        return interviewer
    } catch (error) {
        console.log(error)
        return null
    }
}

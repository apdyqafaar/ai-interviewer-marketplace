import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "../prisma"
import { User, Payouts } from "../types"

const PLAN_CREDITS = {
    pro: 15,
    starter: 5,
    free: 1
}
const getCurrentPlan = async () => {
    const { has } = await auth()
    if (has({ plan: "pro" })) return "pro"
    if (has({ plan: "starter" })) return "starter"
    return "free"
}

const shouldAllocateCredits = (user: User, plan: string): boolean => {
    if (user.currentPlan !== plan) {
        return true
    }

    const lastAllocation = user.CreditsLastAllocatedAt
    if (!lastAllocation) return true

    const now = new Date()
    const last = new Date(lastAllocation)

    const diffInMs = now.getTime() - last.getTime()
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

    return diffInDays >= 30

}

export const checkUser = async (): Promise<User | null> => {
    const user = await currentUser()
    if (!user) return null

    try {
        const currentPlan = await getCurrentPlan()
        const credits = PLAN_CREDITS[currentPlan]

        const loggedUser = await db.user.findUnique({ where: { clerkUserId: user?.id } })

        if (loggedUser) {
            if (loggedUser.role === "INTERVIEWER") return loggedUser

            if (shouldAllocateCredits(loggedUser, currentPlan)) {
                return await db.user.update({
                    where: { id: loggedUser.id },
                    data: {
                        credits: credits,
                        currentPlan: currentPlan,
                        CreditsLastAllocatedAt: new Date()
                    }
                })
            }

            return loggedUser
        }


        const name = `${user.firstName} ${user.lastName}`

        return await db.user.create({
            data: {
                clerkUserId: user.id,
                email: user.emailAddresses[0].emailAddress,
                name: name,
                credits: credits,
                currentPlan: currentPlan,
                CreditsLastAllocatedAt: new Date()
            }
        })
    } catch (error) {
        console.log("CheckUser Error", error)
        return null
    }
}
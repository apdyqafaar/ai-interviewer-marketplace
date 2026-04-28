"use server"

import { db } from "@/lib/prisma"
import { OnboardingData } from "@/lib/types"
import { currentUser } from "@clerk/nextjs/server"

export const saveOnboardingData = async (data: OnboardingData) => {
    const user = await currentUser()
    if (!user) {
        return { error: "Unauthorized" }
    }

    const { role, yearExp, title, company, categories, bio } = data

    if(!role || !["INTERVIEWER", "INTERVIEWEE"].includes(role)){
        return { error: "Invalid role" }
    }

    if (role === "INTERVIEWER" && (!yearExp || !title || !company || categories.length <= 0 || !bio)) {
        return { error: "All fields are required" }
    }

    try {

        await db.user.update({
            where: {
                clerkUserId: user.id
            },
            data: {
                role,
                ...(role === "INTERVIEWER" && {
                    yearsExp: parseInt(yearExp, 10),
                    title,
                    company,
                    categories,
                    bio
                })
            }
        })
        return { success: true }
    } catch (error) {
        console.error("Error saving onboarding data:", error)
        return { error: "Failed to save onboarding data" }
    }
}
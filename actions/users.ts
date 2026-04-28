"use server"


import { db } from "@/lib/prisma"
import {  currentUser } from "@clerk/nextjs/server"

export const getCurrentUser = async () => {
    const user=await currentUser()
    if (!user) return null
    const dbUser = await db.user.findUnique({
        where: { clerkUserId: user.id },
        select:{
            id:true,
            name:true,
            email:true,
            imageUrl:true,
            role:true,
            credits:true,
            creditBalance:true,
            creditRate:true,
            yearsExp:true,
            bio:true,
            title:true,
            company:true,
           
        }
    })
    return dbUser
}

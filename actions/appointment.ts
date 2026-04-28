"use server"

import { db } from "@/lib/prisma"
import { Booking } from "@/lib/types"
import { currentUser } from "@clerk/nextjs/server"

/** Fetch all users with the INTERVIEWEE role */
export const getInterviewees = async () => {
    const user = await currentUser()
    if (!user) return []

    try {
        const dbUser=await db.user.findUnique({where:{clerkUserId:user.id}})
        if(!dbUser) return []
       return await db.booking.findMany({
            where: {intervieweeId:dbUser.id },
            
            include:{

                interviewer:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        imageUrl:true,
                        credits:true,
                        categories:true,
                        title:true,
                        company:true,      
                       
                    }
                },
                feedback:true
                
            },
            orderBy: { startTime: "desc" },
        })
     
    } catch (error) {
        console.error("getInterviewees error:", error)
        return []
    }
}

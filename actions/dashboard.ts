"use server"

import { db } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"

export const saveAvailability = async ({
  startTime,
  endTime,
}: {
  startTime: Date
  endTime: Date
}): Promise< {success:boolean,error?:string}>=> {
  try {
    if(!startTime || !endTime) return {success:false, error:"Start time and end time are required"}
    if(new Date(startTime).getTime()>=new Date(endTime).getTime()) return {success:false, error:"Start time must be less than end time"}
    const user = await currentUser()
    
    if (!user) {
      return {success:false, error:"Unauthorized"}
    }

    const dbUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    })

    if (!dbUser) {
      return {success:false, error:"User not found in database"}
    }

    if (dbUser.role !== "INTERVIEWER") {
      return {success:false, error:"Only interviewers can save availability"}
    }

    const existingAvailability = await db.availability.findFirst({
      where: { interviewerId: dbUser.id },
    })

    if(existingAvailability){
      const availability = await db.availability.update({
        where: { id:existingAvailability.id },
        data: {
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          status: "AVAILABLE",
        },
      })
    }else{
      const availability = await db.availability.create({
        data: {
          id:nanoid(),
          interviewerId: dbUser.id,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          status: "AVAILABLE",
        },
      })
    }


    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error saving availability:", error)
    return { success: false, error: "Failed to save availability" }
  }
}


export const getAvailability = async () => {
  try {
    const user = await currentUser()
    if (!user) return {success:false, error:"Unauthorized"}

    const dbUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    })

    if (!dbUser) return {success:false, error:"User not found in database"}

    const availability = await db.availability.findFirst({
      where: { interviewerId: dbUser.id },
    })

    return {success:true, data:availability}
  } catch (error) {
    console.error("Error fetching availability:", error)
    return {success:false, error:"Failed to fetch availability"}
  }
}

export const getInterviewerAppointments = async () => {
  try {
    const user = await currentUser()
    if (!user) return {success:false, error:"Unauthorized"}

    const dbUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    })

    if (!dbUser) return {success:false, error:"User not found in database"}

    const appointments = await db.booking.findMany({
      where: { interviewerId: dbUser.id },
      include: {
        interviewee: {
          select: {
            id: true,
            email: true,
            name: true,
            imageUrl: true,
            title: true,
            company: true,
            categories: true,
          }
        },
        feedback: true
      },
      orderBy: { startTime: "desc" },
    })

    return {success:true, data:appointments}
  } catch (error) {
    console.error("Error fetching interviewer appointments:", error)
    return {success:false, error:"Failed to fetch interviewer appointments"}
  }
}


export const getInterviewerStatus=async()=>{
try {
    const user = await currentUser()
    if (!user) return {success:false, error:"Unauthorized"}

    const dbUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
      select:{
        creditBalance:true,
        creditRate:true,
        bookingAsInterviewer:{
          where:{
            status:"COMPLETED"
          },
          select:{
            creditsCharged:true
          }
        }
      }
    })

    if (!dbUser) return {success:false, error:"User not found in database"}

   const totalEarned=dbUser.bookingAsInterviewer.reduce((acc,booking)=>acc+booking.creditsCharged,0)

    return {success:true, data:{
      totalEarned,
      creditBalance:dbUser.creditBalance,
      creditRate:dbUser.creditRate,
      completedSession:dbUser.bookingAsInterviewer.length
    }}
  } catch (error) {
    console.error("Error fetching availability:", error)
    return {success:false, error:"Failed to fetch availability"}
  }
}
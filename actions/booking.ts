"use server"

import { db } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { StreamClient } from "@stream-io/node-sdk";
import  {nanoid}  from "nanoid";
import { revalidatePath } from "next/cache"
import { createRateLimiter, checkRateLimit } from "@/lib/arcet";
import { request } from "@arcjet/next";
import { configs } from "@/lib";

const aj=createRateLimiter({
    refillrate:100,
    interval:"1h",
    capacity:10
})

/** Fetch the slot + interviewer info needed to render the booking confirmation page */
export const getInterviewerProfile = async (interviewerId: string) => {
    const user = await currentUser()
    if (!user) return null

    try {
        const interviewer=await db.user.findUnique({
     where:{id:interviewerId, role:"INTERVIEWER"},
         select:{
            id:true,
            name:true,
            imageUrl:true,
            title:true,
            company:true,
            categories:true,
            creditRate:true,
            yearsExp:true,
            credits:true,
            creditBalance:true,
            bio:true,
            availabilities:{
                where:{status:"AVAILABLE"},
                select:{
                    id:true,
                    startTime:true,
                    endTime:true,
                    status:true,
                    }
            },
            bookingAsInterviewer:{
                where:{status:"SCHEDULED"},
                select:{startTime:true, endTime:true}
            }
         }
        })

        return interviewer ?? null
    } catch (error) {
        console.error("getBookingPageData error:", error)
        return null
    }
}

/** Create a booking, deduct credits, mark slot as BOOKED */
export const bookSlot = async ({interviewerId, startTime, endTime}: {interviewerId: string, startTime: Date, endTime: Date}) => {  
    try {

    const user = await currentUser()
    if (!user) return { error: "Unauthorized" }

    // arcjet rate limit
    const req = await request();
    const rateLimitError = await checkRateLimit(aj, req, user.id);
    if (rateLimitError) return { error: rateLimitError };

    const [dbUser, interviewer] = await Promise.all([
        db.user.findUnique({
            where: { clerkUserId: user.id },
        }),
        db.user.findUnique({
            where: { id: interviewerId, role: "INTERVIEWER" },
        }),
    ])

    if(!dbUser || dbUser.role !== "INTERVIEWEE") return { error: "Only Interviewee can book a slot" }
    if(!interviewer || interviewer.role !== "INTERVIEWER") return { error: "Interviewer not found" }

    const credits=interviewer.creditRate ?? 1
    if(dbUser.credits < credits) return { error: "Insufficient credits, Please buy more credits" }

    // check slot isn't booked
    const existingBooking = await db.booking.findFirst({
        where: {
            interviewerId,
            OR: [
                { startTime: { gte: startTime, lt: endTime } },
                { endTime: { gt: startTime, lte: endTime } },
                { startTime: { lte: startTime }, endTime: { gte: endTime } },
            ],
        },
    })
    

    if(existingBooking) return { error: "Slot is already booked" }

    // create stream call

  let streamCall
  const streamCallId=nanoid()
  try {
   const streamClient= new StreamClient(configs.stream_config.key, configs.stream_config.secret,{timeout:10000})
   await streamClient.upsertUsers([
    {
      id:dbUser.id,
      name:dbUser.name||"Unknown",
      image:dbUser.imageUrl ||undefined,
      role:"user"
    },
    {
      id:interviewer.id,
      name:interviewer.name||"Unknown",
      image:interviewer.imageUrl ||undefined,
      role:"user"
    }
   
   ])

   const call= streamClient.video.call("default",streamCallId)
    await call.getOrCreate({
        data:{
            created_by_id:dbUser.clerkUserId,
            members:[
                 {user_id:dbUser.id, role:"user"},
                 {user_id:interviewer.id,role:"user"}
            ],
            settings_override:{
                recording:{mode:"available", quality:"1080p"},
                screensharing:{enabled:true},
                transcription:{mode:"auto-on"}
            }
        } 
    })
  } catch (error) {
    console.error("Stream call creation failed", error)
    return { error: "Failed to create booking. Please try again." }
  }
 

    const booking=await db.$transaction(async(txt)=>{
        const newBooking=await txt.booking.create({
            data:{
                intervieweeId:dbUser.id,
                interviewerId,
                startTime:new Date(startTime),
                endTime:new Date(endTime),
                status:"SCHEDULED",
                creditsCharged:credits,
                streamCallId:streamCallId
            }
        })


        // credit transaction
        await txt.creditTransaction.create({
            data:{
                userId:dbUser.id,
                amount:-credits,
                type:"BOOKING_DEDUCTION",
                bookingId:newBooking.id
            }
        })

        await txt.user.update({
            where:{id:dbUser.id, role:"INTERVIEWEE"},
            data:{credits:{decrement:credits}}
        })

        await txt.user.update({
            where:{id:interviewer.id, role:"INTERVIEWER"},
            data:{creditBalance:{increment:credits}}
        })

          return newBooking
    })



      revalidatePath("/dashboard")

      return{success:true, bookingId:booking.id, streamCallId}
    } catch (error) {
        console.error("createBooking error:", error)
        return { error: "Failed to create booking. Please try again." }
    }
}

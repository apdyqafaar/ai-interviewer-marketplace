import { configs } from "@/lib"
import { db } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { StreamClient } from "@stream-io/node-sdk"

export const getCallData=async(callId:string)=>{
    try {
        const user=await currentUser()
        if(!user){
            return {error:"Unauthorized"}
        }
        const dbUser=await db.user.findUnique({
            where:{
                clerkUserId:user.id
            }
        })
        if(!dbUser){
            return {error:"User not found"}
        }
        const call=await db.booking.findUnique({
            where:{
                streamCallId:callId
            },
            include:{
                interviewer:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        imageUrl:true,
                        categories:true,
                        clerkUserId:true,
                        role:true
                    }
                },
                interviewee:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        imageUrl:true,
                        clerkUserId:true,
                        role:true
                    }
                }
            }
        })
        if(!call){
            return {error:"Call not found"}
        }
        // if(call.interviewee.clerkUserId!==user.id || call.interviewer.clerkUserId!==user.id){
        //     return {error:"Unauthorized"}
        // }

        const streamClient= new StreamClient(configs.stream_config.key, configs.stream_config.secret,{timeout:10000})

        const token= streamClient.generateUserToken({
            user_id:user.id,
            validity_in_seconds:60 * 60
        })

        return {
            token,
            interviewer:call.interviewer,
            currentUserDetails:{
                id:user.id,
                name:user.firstName + " " + user.lastName,
                imageUrl:user.imageUrl,
                role:dbUser.role
            },
            booking:{
                id:call.id,
                startTime:call.startTime,
                endTime:call.endTime,
                status:call.status,
                interviewer:call.interviewer,
                interviewee:call.interviewee
            }
        }
    } catch (error) {
        console.log(error)
        return {error:"Internal server error"}
    }
}
import arcjet, { tokenBucket } from "@arcjet/next"
export const createRateLimiter=({refillrate, interval, capacity}:{
    refillrate:number,
    interval:string,
    capacity:number
})=>{
    return arcjet({
        key:process.env.ARCJET_KEY!,
        characteristics:["userId"],
        rules:[
            tokenBucket({
                mode:"LIVE",
                refillRate:refillrate,
                interval:interval,
                capacity:capacity,
                
            })
        ]
    })
}


export async function checkRateLimit(aj:any,rq:any,userId:string){
    const desision=await aj.protect(rq,{userId,requested:1})
    if(desision.isDenied()){
       return desision.reason.isRateLimit()?"Rate limit exceeded":"Access denied"
    }
    return null }
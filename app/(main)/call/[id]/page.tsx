

import { getCallData } from "@/actions/call"
import { notFound, redirect } from "next/navigation"
import { toast } from "sonner"
import CallRoom from "../_components/call-room"
import { Suspense } from "react"
import Loading from "../_components/Loading"

const CallPage = async ({params}: {params: {id: string}}) => {
    const {id}=await params
    const {token,interviewer,currentUserDetails,booking, error}=await getCallData(id)
    const isInterviewer=currentUserDetails?.role==="INTERVIEWER"
    console.log(isInterviewer)

    console.log("booking",booking)
    console.log("interviewer",interviewer)
    console.log("currentUserDetails",currentUserDetails)
    if(error==="Unauthorized"){
        console.log("Unauthorized")
        return redirect("/")
    }
     if(error==="Call not found"){
            console.log("Call not found")
        return redirect("/")
    }
     if(error==="Call not found"){
            console.log("Call not found")
        return notFound()
    }
    if(error){
            console.log("Something went wrong")
        return redirect("/dashboard")
    }
  return (
   <Suspense fallback={<Loading/>} >
     <CallRoom isInterviewer={isInterviewer} booking={booking ||undefined} callId={id} token={token as string} currentUserDetails={currentUserDetails||undefined} interviewer={interviewer}/>
   </Suspense>
  )
}

export default CallPage
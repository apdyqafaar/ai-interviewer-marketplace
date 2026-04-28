"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { StreamCall, StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { configs } from "@/lib";
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { toast } from "sonner";
import CallUi from "./CallUi";
import { Booking, BookingForVideoCall } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface CallRoomProps {
  callId: string;
  token: string;
  currentUserDetails: {
    id: string;
    name: string;
    imageUrl: string;
  } | undefined;
  interviewer: any;
  booking:BookingForVideoCall|undefined
  isInterviewer:boolean
}

export default function CallRoom({
  callId,
  token,
  currentUserDetails,
  interviewer,
  booking,
  isInterviewer
}: CallRoomProps) {
  const [call,setCall] = useState<any>(null);
  const [VideoClient,setVideoClient] = useState<StreamVideoClient|null>(null);
  const joinRef=useRef(false)
  const clientRef=useRef(null)
  

  const router = useRouter();

  // our logic
  useEffect(()=>{
if(joinRef.current) return;
joinRef.current=true;

   const client=new StreamVideoClient({
    apiKey:configs.stream_config.key,
    user:{
      id:currentUserDetails?.id!,
      name:currentUserDetails?.name!,
      image:currentUserDetails?.imageUrl!
    },
    token,
    
   })

   const callInstance=client.call('default',callId)
   callInstance.join({create:false}).then(()=>{
    clientRef.current=client as any
    setVideoClient(client)
    setCall(callInstance)
   })
   .catch((err)=>{
    console.error("Error joining call:", err.message||err)
    toast.error("Failed to join call")
   })



   return()=>{
    callInstance.leave().catch(()=> {})
    client.disconnectUser().catch((err)=>{
      console.log("Error disconnecting user",err)
    })
    clientRef.current=null
    joinRef.current=false
   }
  },[callId,currentUserDetails?.name,currentUserDetails?.imageUrl,token])
  
  const handleLeave=useCallback(()=>{handleEndCall()},[router, interviewer])

  const handleEndCall = () => {
    router.push(isInterviewer?"/dashboard":"/appointments");
  };


  if(!VideoClient || !call){
    return <div className="flex justify-center items-center min-h-screen w-screen">
      <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
      <h2 className="text-base ml-2 bg-gradient-to-r from-muted-foreground to-orange-500 bg-clip-text text-transparent font-bold">Connecting to call...</h2>
    </div>
  }
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background w-full  gap-4 flex-col lg:flex-row ">
      {/* Main Video Area */}
      <StreamVideo client={VideoClient!}>
<StreamCall call={call}>
  <CallUi isInterviewer={isInterviewer} onLeave={handleLeave} callId={callId} interviewer={interviewer} currentUserDetails={currentUserDetails} token={token} booking={booking||undefined}/>
</StreamCall>
      </StreamVideo>
    </div>
  );
}

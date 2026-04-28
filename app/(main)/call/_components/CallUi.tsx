"use client"
import { configs } from '@/lib'
import { BookingForVideoCall } from '@/lib/types'
import { CallControls, CallingState, SpeakerLayout, StreamTheme, useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Channel, Chat, MessageComposer, MessageList, useCreateChatClient, Window } from "stream-chat-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MessageSquare,
  PhoneOff,
  Settings,
  MoreVertical,
  Users,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import 'stream-chat-react/dist/css/index.css';
import AiQuestionsPannel from './AiQuestionsPannel'
import { useTheme } from 'next-themes'

interface CallUiProps {
  onLeave: () => void,
  callId: string,
  interviewer: any,
  currentUserDetails: any,
  token: string,
  booking: BookingForVideoCall | undefined,
  isInterviewer: boolean
}

const CallUi = ({ onLeave, callId, interviewer, currentUserDetails, token, booking, isInterviewer }: CallUiProps) => {
  // console.log("isInterviewer",isInterviewer)
  const { useCallCallingState } = useCallStateHooks();
  const call = useCall()
  const callingState = useCallCallingState();
  const theme=useTheme()

  const [ChatChannel, setChatChannel] = useState<any>(null)
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const chatClient = useCreateChatClient({
    apiKey: configs.stream_config.key,
    tokenOrProvider: token,
    userData: {
      id: currentUserDetails?.id!,
      name: currentUserDetails?.name!,
      image: currentUserDetails?.imageUrl!
    }
  })

  useEffect(() => {
    if (!chatClient || !callId || !booking) return;
    const channel = chatClient.channel("messaging", callId, {
      members: [
        booking?.interviewee?.id,
        booking?.interviewer?.id,
      ]
    });
    channel.watch()
      .catch((error) => {
        console.log("Error watching channel", error)
        toast.error("Failed to watch channel")
      })
    setChatChannel(channel)
    return () => {
      channel.stopWatching().catch((error) => {
        console.log("Error to stop watching channel", error)
      })
    }
  }, [chatClient, callId, currentUserDetails, booking])

  // handle leave fun
  const handleLeave = useCallback(async () => {
    try {
      if (call) {
        const isRecording = call.state.recording
        if (isRecording) {
          await call.stopRecording().catch((error) => {
            toast.error("Error stopping recording")
            console.log("Error stopping recording", error)
          })
        }
      }
    } finally {
      onLeave()
    }
  }, [call, onLeave])
  if (callingState === CallingState.LEFT) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted/30 dark:bg-muted/10 border border-border flex items-center justify-center relative overflow-hidden ring-1 ring-border/50 shadow-sm">
        <p className='text-md text-muted-foreground font-medium text-center animate-pulse'>Leaving call...</p>
      </div>
    )
  }

  console.log("check", chatClient, ChatChannel)
  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0  ">
      <div className="flex-1 rounded-2xl bg-muted/30 dark:bg-muted/10 border border-border flex items-center justify-center relative overflow-hidden ring-1 ring-border/50 shadow-sm hidden ">
        {/* Participant/Interviewer Feed PlaceHolders */}
        <div className="absolute inset-x-4 top-4 md:inset-x-8 md:top-8 flex justify-between items-start z-10 w-full px-4 md:px-8 box-border left-0 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <Badge
              variant="secondary"
              className="bg-background/80 hover:bg-background/80 text-foreground border-0 backdrop-blur-md px-3 py-1.5 text-sm shadow-sm font-medium"
            >
              {interviewer?.name || "AI Interviewer"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            <Badge
              variant="destructive"
              className="animate-pulse   hover:bg-red-600/10 border-0 shadow-sm px-3 py-1.5 text-sm"
            >
              Live
            </Badge>
            <Badge
              variant="secondary"
              className="bg-background/80 hover:bg-background/80 border-0 backdrop-blur-md px-3 py-1.5 text-sm shadow-sm font-medium"
            >
              00:00
            </Badge>
          </div>
        </div>

        {/* Main Feed Content */}
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <Avatar className="h-32 w-32 md:h-48 md:w-48 border-4 border-background shadow-xl relative z-10">
              <AvatarImage
                src={interviewer?.image || interviewer?.imageUrl}
                alt={interviewer?.name}
                className="object-cover"
              />
              <AvatarFallback className="text-5xl md:text-7xl bg-primary/10 text-primary font-medium">
                {interviewer?.name?.[0] || "A"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center z-10 mt-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              {interviewer?.name || "AI Interviewer"}
            </h2>
            <p className="text-muted-foreground mt-2 font-medium flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              Connecting to audio & video...
            </p>
          </div>
        </div>

        {/* Self View (Picture-in-Picture) */}
        <Card className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-32 h-44 md:w-56 md:h-40 bg-background/90 backdrop-blur-md overflow-hidden border-2 border-border/50 flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 group">
          <div className="absolute top-2 left-2 z-20">
            <Badge
              variant="secondary"
              className="text-[10px] md:text-xs py-0.5 px-2 bg-black/60 text-white border-0 backdrop-blur shadow-sm"
            >
              You
            </Badge>
          </div>
          {isVideoOff ? (
            <Avatar className="h-14 w-14 md:h-16 md:w-16">
              <AvatarImage
                src={
                  currentUserDetails?.imageUrl || currentUserDetails?.imageUrl
                }
                className="object-cover"
              />
              <AvatarFallback className="bg-muted text-muted-foreground text-xl md:text-2xl font-medium">
                {currentUserDetails?.name?.[0] ||
                  currentUserDetails?.name?.[0] ||
                  "U"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-full h-full bg-slate-900/40 dark:bg-slate-800/80 flex items-center justify-center relative">
              <Avatar className="h-14 w-14 md:h-16 md:w-16">
                <AvatarImage
                  src={
                    currentUserDetails?.imageUrl || currentUserDetails?.imageUrl
                  }
                  className="object-cover"
                />
                <AvatarFallback className="text-xl md:text-2xl font-medium">
                  {currentUserDetails?.name?.[0] ||
                    currentUserDetails?.name?.[0] ||
                    "U"}
                </AvatarFallback>
              </Avatar>
              {/* Simulation of camera frame */}
              <div className="absolute inset-0 border border-primary/20 group-hover:border-primary/40 transition-colors pointer-events-none rounded-[inherit]"></div>
            </div>
          )}
          {isMuted && (
            <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1.5 z-20 shadow-sm animate-in fade-in slide-in-from-top-1">
              <MicOff className="h-3 w-3 md:h-4 md:w-4 text-white" />
            </div>
          )}
        </Card>
      </div>

      {/* Control Bar */}
      <div className="h-20 md:h-24 rounded-2xl bg-card border border-border flex items-center justify-center gap-2 md:gap-4 px-4 md:px-6 shadow-sm relative z-10 w-full overflow-x-auto hidden ">
        <div className="flex items-center gap-2 md:gap-4 mx-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="icon"
                className={`h-12 w-12 md:h-14 md:w-14 rounded-full transition-all duration-300 ${!isMuted && "hover:bg-amber-400/70 hover:text-primary-foreground hover:scale-105"}`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <MicOff className="h-5 w-5 md:h-6 md:w-6" />
                ) : (
                  <Mic className="h-5 w-5 md:h-6 md:w-6" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isMuted ? "Unmute" : "Mute"}</p>
            </TooltipContent>
          </Tooltip>


          <Tooltip>
            <TooltipTrigger asChild>

              <Button
                variant={isVideoOff ? "destructive" : "secondary"}
                size="icon"
                className={`cursor-pointer h-12 w-12 md:h-14 md:w-14 rounded-full transition-all duration-300 ${!isVideoOff && "hover:bg-amber-400/70 hover:text-primary-foreground hover:scale-105"}`}
                onClick={() => setIsVideoOff(!isVideoOff)}
              >
                {isVideoOff ? (
                  <VideoOff className="h-5 w-5 md:h-6 md:w-6" />
                ) : (
                  <Video className="h-5 w-5 md:h-6 md:w-6" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isVideoOff ? "Unmute" : "Mute"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="cursor-pointer h-12 w-12 md:h-14 md:w-14 rounded-full hidden sm:flex hover:bg-amber-400/70 hover:text-primary-foreground hover:scale-105 transition-all duration-300"
              >
                <MonitorUp className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share Screen</p>
            </TooltipContent>
          </Tooltip>



          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="cursor-pointer h-12 w-12 md:h-14 md:w-14 rounded-full hidden sm:flex hover:bg-amber-400/70 hover:text-primary-foreground hover:scale-105 transition-all duration-300"
              >
                <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chat</p>
            </TooltipContent>
          </Tooltip>



          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="cursor-pointer h-12 w-12 md:h-14 md:w-14 rounded-full hidden lg:flex hover:bg-amber-400/70 hover:text-primary-foreground hover:scale-105 transition-all duration-300"
              >
                <Users className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Participants</p>
            </TooltipContent>
          </Tooltip>


          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="cursor-pointer h-12 w-12 md:h-14 md:w-14 rounded-full hidden lg:flex hover:bg-amber-400/70 hover:text-primary-foreground hover:scale-105 transition-all duration-300"
              >
                <Settings className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>


          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer h-12 w-12 md:h-14 md:w-14 rounded-full lg:hidden"
              >
                <MoreVertical className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>More</p>
            </TooltipContent>
          </Tooltip>




          <div className="w-px h-8 md:h-10 bg-border mx-1 md:mx-3 hidden sm:block"></div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                className=" h-12 md:h-14 px-6 md:px-8 rounded-full font-medium shadow-lg hover:shadow-destructive/25 hover:bg-red-600/15 cursor-pointer transition-all text-sm md:text-base ml-2 md:ml-0"
                onClick={onLeave}
              >
                <PhoneOff className="h-5 w-5 md:h-6 md:w-6 md:mr-2" />
                <span className="hidden md:inline">End Call</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>End Call</p>
            </TooltipContent>
          </Tooltip>


        </div>
      </div>

      <div className="w-full flex flex-warp gap-10  border-y border-border mt-10  h-screen bg-amber-">
        <div className='flex-1 px-4'>

          <StreamTheme>
            <SpeakerLayout participantsBarPosition={"bottom"} />
            <CallControls onLeave={handleLeave} />
          </StreamTheme>
        </div>
        <div className='border-l border-border hidden md:block w-1/4  px-4 mt-1 h-full'>
          <Tabs defaultValue="chat" className="w-full h-full ">
            <TabsList className="w-full gap-4" variant={"line"}>
              <TabsTrigger value="chat" className="flex-1 cursor-pointer">
                <MessageSquare className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                Chat
              </TabsTrigger>
              {
                isInterviewer && <TabsTrigger value="questions" className="flex-1 cursor-pointer">
                  <Sparkles className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                  AI Questions
                </TabsTrigger>
              }
            </TabsList>
            <TabsContent value="chat" className="h-full">
              {
                chatClient && ChatChannel ? (
                  <div className='w-full h-full '>
                    <Chat theme={theme?.resolvedTheme==="dark"?'str-chat__theme-dark':"str-chat__theme-light"} client={chatClient} >
                      <Channel channel={ChatChannel}>
                        <Window  >
                          <MessageList />
                          <MessageComposer />
                        </Window>
                      </Channel>
                    </Chat>
                  </div>
                ) : <div className="flex items-center justify-center py-12 gap-2" >
                  <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                  <p className="text-sm text-muted-foreground">Connecting to chat...</p>
                </div>
              }
            </TabsContent>
            <TabsContent value="questions">
              <AiQuestionsPannel/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default CallUi
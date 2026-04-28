"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, Sparkles, Tv, Video } from 'lucide-react'
import { formatDuration } from '@/lib/helpers'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { RATING_CONFIG } from '@/lib'
import { BookingStatus, FeedbackRating, InterviewCategory } from '@/lib/types'
import FeedbackModel from '../../appointments/_components/FeedbackModel'

interface AppointmentCardProps {
    booking: {
    interviewee: {
        id: string;
        email: string;
        name: string | null;
        imageUrl: string | null;
        title: string | null;
        company: string | null;
        categories: InterviewCategory[];
    };
    feedback: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingId: string;
        summary: string;
        technical: string;
        communication: string;
        problemSolving: string;
        recommendation: string;
        strengths: string[];
        improvements: string[];
        overallRating: FeedbackRating;
        sessionRating: number | null;
        sessionComment: string | null;
    } | null;
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    interviewerId: string;
    startTime: Date;
    endTime: Date;
    status: BookingStatus;
    intervieweeId: string;
    creditsCharged: number;
    streamCallId: string | null;
    recordingUrl: string | null;
},
    isPast:boolean,
    mode:"interviewee"|"interviewer"
}
const AppointmentCard = ({booking,isPast,mode}:AppointmentCardProps) => {
    const [feedbackOpened,setFeedbackOpened]=useState(false)

    const {
        interviewee,
        feedback,
        startTime,
        endTime,
        status,
        creditsCharged,
        streamCallId,
        recordingUrl,
        id,
        interviewerId,
        intervieweeId,
    }=booking

    const isUpcoming=status==="SCHEDULED"&&new Date(startTime)>new Date()
    const is_past=status==="COMPLETED"||new Date(endTime)<new Date()
    const isLive=status==="SCHEDULED"&&new Date(startTime)<=new Date()&&new Date(endTime)>=new Date()
  return (
    // card
    <Card className='group relative overflow-hidden '>
<CardHeader>
    <div className='flex items-start gap-2 justify-between'>
        <div className='flex items-center gap-3'>
            <Avatar className='w-16 h-16 rounded-md border border-amber-600/30'>
                <AvatarImage className='rounded-md ' src={interviewee.imageUrl||undefined} />
                <AvatarFallback className='rounded-md bg-amber-400/10 text-amber-400 border-none text-xl'>{interviewee.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <h3 className="text-base font-semibold">{interviewee.name}</h3>
                <p className="text-muted-foreground text-xs">{interviewee.title} <span> . </span> {interviewee.company}</p>
              <div className="flex items-center gap-2 overflow-x-auto flex-wrap mt-1">
                  {
                    interviewee.categories.length>0&&(
                        interviewee.categories.map(c=>(
                            <Badge className='text-xs border-amber-400/30 text-amber-400'variant={"outline"} key={c}>{c}</Badge>
                        ))
                    )
                }
              </div>
            </div>


        </div>

        <div className="flex flex-col  items-end gap-1">
            <Badge className={`text-xs ${isLive?"text-green-500 border-green-500/80":"text-amber-400 bg-amber-400/10 border-amber-400/30"}`} variant={"outline"}>
                {
                    status.toLowerCase()
                }
            </Badge>
             <Badge  variant={"outline"}>
                -{
                   creditsCharged
                }
                <span> </span>
                credits
            </Badge>
        </div>
    </div>
</CardHeader>
<CardContent>
    <Separator className='my-3'/>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
        <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground flex items-center gap-2"><Calendar className='w-4 h-4'/> Date</p>
            <p className="text-sm font-semibold">{new Date(startTime).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground flex items-center gap-2"><Clock className='w-4 h-4'/> Time</p>
            <p className="text-sm font-semibold">{new Date(startTime).toLocaleTimeString()}</p>
        </div>
        <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground flex items-center gap-2"><Clock className='w-4 h-4'/> Duration</p>
            <p className="text-sm font-semibold">{formatDuration(startTime, endTime)}</p>
        </div>
    </div>

    {/* ai feedback */}
    {
         feedback?.summary && (
            <div className="my-4">
                <Separator className='my-3'/>
                <h3 className="text-base font-medium text-foreground">AI Feedback</h3>
                <p className="text-muted-foreground text-sm">{feedback.summary}</p>
            </div>
        )
    }

    {
        feedback&&(
            <div className='flex items-center gap-2 flex-wrap'>
            <Button disabled={feedbackOpened} onClick={()=>setFeedbackOpened(true)} className='rounded-sm py-4  border border-amber-400/40 hover:bg-amber-400/70 bg-amber-400/80 ' size={"sm"}>
                <Sparkles className='w-4 h-4 mr-2'/>Full Feedback
            </Button>
            <Badge className={`py-4 rounded-sm text-md ${RATING_CONFIG[feedback.overallRating].className}`}>
                {
                    RATING_CONFIG[feedback.overallRating].emoji
                } {feedback.overallRating} Performance
            </Badge>


            {/*  feedback model */}
            <FeedbackModel feedback={feedback} feedbackOpened={feedbackOpened} setFeedbackOpened={setFeedbackOpened} intervieweeName={interviewee.name||undefined}/>
            </div>
        )
    }

    
    {
        ((streamCallId||recordingUrl||feedback) && (
            <div className="mt-4 flex items-center gap-4">
               {
                !is_past && streamCallId && isUpcoming && (
                    <Button className='rounded-sm py-4  border border-amber-400/40 hover:bg-amber-400/70 bg-amber-400/80 '>
                        <Link href={`/call/${streamCallId}`}>Join Call</Link> <Video className='w-4 h-4 ml-2' />
                    </Button>
                )
               }

               {
                recordingUrl && (
                    <Button className='rounded-sm py-4   ' variant={"outline"}>
                        <a href={recordingUrl} target='_blank'>Watch Recording</a> <Tv className='w-4 h-4 ml-2' />
                    </Button>
                )
               }
            </div>
        ))
    }


</CardContent>
    </Card>
  )
}

export default AppointmentCard
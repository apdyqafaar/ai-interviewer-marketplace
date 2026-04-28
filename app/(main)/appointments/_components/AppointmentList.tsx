import { PageHeader } from '@/components/resubales'
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookingStatus, FeedbackRating, InterviewCategory } from '@/lib/types';
import { ArrowRight, CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import AppointmentCard from './appointmentCard';
// interface
export interface BookingProps {
    interviewer: {
        title: string | null;
        id: string;
        email: string;
        name: string | null;
        imageUrl?: string | null;
        credits: number;
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
     id: string;
    intervieweeId: string;
    interviewerId: string;
    startTime: Date;
    endTime: Date;
    status: BookingStatus;
    creditsCharged: number;
    streamCallId: string | null;
    recordingUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface AppointmentListProps {
    interviewees: BookingProps[]
    scheduled:BookingProps[],
    past:BookingProps[]
}
const AppointmentList = ({interviewees,scheduled,past}:AppointmentListProps) => {
  // console.log("interviewees",interviewees)
  return (
    <div className='bg-background min-h-screen pt-9'>
      <PageHeader smallTitle='My Appointments' title='Appointments' description='Manage your appointments' />
      <div className='max-w-6xl mx-auto px-8 p-y10 flex flex-col space-y-5'>
        {
          // if it is 0 show  noo session yet and brows expert interviewers and celender
          interviewees.length===0&& (
            <div className='flex flex-col items-center justify-center gap-3 py-20 bg-card rounded-lg'>
             <div className='flex items-center justify-center w-12 h-12 rounded-xl border border-amber-500/80 bg-amber-500/10 '>
              <CalendarIcon className='w-6 h-6 text-amber-500' />
             </div>
              <h2 className='text-2xl font-bold'>No sessions yet</h2>
              <p className='text-muted-foreground'>Book your first session with an expert interviewer</p>
              <Button  className='rounded-sm py-4  border border-amber-500/80 hover:bg-amber-500/80 bg-amber-500 '>
                <Link href="/explore">Browse expert interviewers</Link> <ArrowRight className='w-4 h-4 ml-2' />
              </Button>
            </div>
          )
        }

        {/* upcoming */}
        {
          scheduled.length>0&&(
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <p className="text-muted-foreground">Upcoming ({scheduled.length})</p>
                <Separator className='flex-1'/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {
                  scheduled?.map((booking,i)=>(<AppointmentCard key={booking.interviewer.id+i} booking={booking} isPast={false} mode="interviewee" />))
                }
              </div>
            </div>
          )
        }

         {/* past */}
        {
          past.length>0&&(
            <div className="flex flex-col gap-5 mb-10">
              <div className="flex items-center gap-4">
                <p className="text-muted-foreground">Past ({past.length})</p>
                <Separator className='flex-1'/>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {
                  past?.map((booking,i)=>(<AppointmentCard key={booking.interviewer.id+i} booking={booking} isPast={true} mode="interviewee" />))
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default AppointmentList
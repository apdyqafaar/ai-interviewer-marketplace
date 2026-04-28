import { GrayTitle } from "@/components/resubales"
import { BookingStatus, FeedbackRating, InterviewCategory } from "@/lib/types";
import { Calendar1 } from "lucide-react"
import React from "react"
import AppointmentCard from "./appointmentCard";

export interface AppointmentProps{
  initialAppointments?:({
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
})[] 
}

export const AppointmentsTab = ({initialAppointments}:AppointmentProps) => {
  console.log(initialAppointments)
  return (
    <div>
      {/* Appointments Component */}
      <div className="p-4 sm:p-7 bg-card border border-border rounded-lg">

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-6">
            <div className="space-y-1">
              <span className="mb-4 p-3 rounded-xl border border-amber-400/30 bg-amber-400/10 inline-flex items-center justify-center">
                <Calendar1 className="w-4 h-4 text-amber-400" />
              </span>
              <h2 className="text-xl sm:text-2xl font-serif">
                <GrayTitle>Appointments</GrayTitle>
              </h2>
              <p className="text-sm text-muted-foreground">List of your upcoming appointments</p>
            </div>
          </div>


      </div>

      
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {initialAppointments?.map((appointment)=>(
              <AppointmentCard key={appointment.id} booking={appointment} isPast={false} mode="interviewer"/>
            ))}
          </div>
    </div>
  )
}

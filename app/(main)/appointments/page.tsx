"use server"

import { getInterviewees } from "@/actions/appointment";
import { Suspense } from "react";
import AppointmentList from "./_components/AppointmentList";

const MyAppointments = async() => {
    const interviewees = await getInterviewees();
    const now=new Date();

    // console.log("interviewees",interviewees)

    const scheduled=interviewees?.filter((interviewee)=>interviewee.status==="SCHEDULED");
    const past=interviewees?.filter((interviewee)=>interviewee.status==="COMPLETED");
    // console.log("past", past)
  return (
    // suspanse
    <Suspense fallback={<div className="min-h-screen w-full text-center">Loading...</div>}>
        <AppointmentList interviewees={interviewees||[]} scheduled={scheduled||[]} past={past||[]} />
    </Suspense>
  )
}

export default MyAppointments
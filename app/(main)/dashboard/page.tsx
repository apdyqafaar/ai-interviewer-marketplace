"use server"

import { getCurrentUser } from "@/actions/users"
import {
  getAvailability,
  getInterviewerAppointments,
  getInterviewerStatus,
} from "@/actions/dashboard"
import { PageHeader } from "@/components/resubales"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AvailabilityTab } from "./_components/availability-tab"
import { WalletTab } from "./_components/wallet-tab"
import { AppointmentsTab } from "./_components/appointments-tab"
import { Calendar1, Clock, Wallet } from "lucide-react"

const page = async() => {
  const dbUser=await getCurrentUser()

  const [availability,appointments,stats]=await Promise.all([
    getAvailability(),
    getInterviewerAppointments(),
    getInterviewerStatus(),
  ])
//  console.log(appointments.data[0])
// const i=appointments.data[0]
  return (
   <div className="px-4 sm:px-6 lg:px-8  min-h-screen">
  <PageHeader smallTitle="Interviewer dashboard" title={dbUser?.name?.split(" ")?.[0]??"Interviewer"} description={dbUser?.title && dbUser?.company?`${dbUser.title} at ${dbUser.company}`:dbUser?.title??""}
    right={
    // credits
    <div className="flex items-center gap-2">
      <span className="bg-amber-500/20 px-3 py-2 rounded-full text-amber-400 font-semibold">
        {dbUser?.creditBalance}
      </span>
      <span className="text-sm text-muted-foreground">Credits</span>
    </div>
    }
  />
<div className="max-w-7xl mx-auto">
  
  <Tabs defaultValue="availability" className="w-full mt-6">
    <TabsList className="mb-4 w-full py-5 rounded-sm">
      <TabsTrigger value="availability" className="py-4 text-sm"><Clock/>Availability</TabsTrigger>
      <TabsTrigger value="wallet" className="py-4 text-sm"><Wallet/>Wallet</TabsTrigger>
      <TabsTrigger value="appointments" className="py-4 text-sm"><Calendar1/>Appointments</TabsTrigger>
    </TabsList>
    <TabsContent value="availability">
      <AvailabilityTab isActive={availability.data?.status==="AVAILABLE"} initialStartTime={availability?.data?.startTime} initialEndTime={availability?.data?.endTime}/>
    </TabsContent>
    <TabsContent value="wallet">
      <WalletTab
        creditBalance={stats.data?.creditBalance ?? 0}
        totalEarned={stats.data?.totalEarned ?? 0}
        creditRate={stats.data?.creditRate ?? 0}
        completedSessions={stats.data?.completedSession ?? 0}
      />
    </TabsContent>
    <TabsContent value="appointments">
      <AppointmentsTab initialAppointments={appointments.data}/>
    </TabsContent>
  </Tabs>
</div>

   </div>
  )
}

export default page
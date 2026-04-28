"use server"

import { getInterviewerProfile } from "@/actions/booking"
import { getCurrentUser } from "@/actions/users"
import { StarsBackgroundDemo } from "@/components/demo-components-backgrounds-stars"
import { GrayTitle, SectionLabel } from "@/components/resubales"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EXPECT_ITEMS } from "@/lib"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import SlotPicker from "../_components/slotPicker"

const InterviewerPage = async({params}:{
  params:{
    id:string
  }
}) => {
  const {id}=await params
  const interviewer=await getInterviewerProfile(id)
  const user=await getCurrentUser()
  if(!interviewer){
    return (
      <main className="min-h-screen">
        <p>Interviewer not found</p>
      </main>
    )
  }
  return (
    <main className="min-h-screen">
        <section className="relative border-b border-border overflow-hidden">
            <StarsBackgroundDemo/>
            <div className="max-w-6xl mx-auto px-8 pt-20 pb-14 flex flex-col gap-2 relative z-10">
                <Link href={"/explore"} className="text-muted-foreground">
                    <Button
                        size="lg"
                        variant={"link"}
                        className="text-muted-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Explore
                    </Button>
                </Link>

                {/* avatar and info */}
                <div className="flex items-center gap-8 ">
                    <Avatar className="w-24 h-24 rounded-2xl border-0 border-none">
                        <AvatarImage src={interviewer?.imageUrl || ""} className="hi-full w-full rounded-2xl border-0 border-none"/>
                        <AvatarFallback className=" w-full  hi-full rounded-2xl text-2xl border-0 border-none font-medium text-amber-500">{interviewer?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-3xl font-bold font-serif leading-1.5 tracking-tight"><GrayTitle>{interviewer?.name}</GrayTitle></h1>
                        {
                            interviewer.title &&interviewer.company&&(
                                <p className="text-muted-foreground text-base font-light">
                                    {interviewer.title} <span className="text-muted">.</span>
                                     {interviewer.company}
                                </p>
                            )
                        }

                        {/* years of exp */}
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                            {
                                interviewer.yearsExp && (
                                    <Badge variant={"outline"} className="px-3 py-3">
                                        <p className="text-sm font-medium">{interviewer.yearsExp} years of experience</p>
                                    </Badge>
                                )
                            }
                            <Badge variant={"outline"} className="px-3 py-3 border-amber-500/80 bg-amber-500/10 text-amber-500">
                                {interviewer.credits?? 1} credits
                            </Badge>
                            {
                                interviewer.availabilities.length>0 && (
                                    <Badge variant={"outline"} className="px-3 py-3 border-green-500/80 bg-green-500/10 text-green-500">
                                        <p className="text-sm font-medium">{interviewer.availabilities.length} availabilities</p>
                                    </Badge>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* the body or data */}
        <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-10 py-12 px-8 mx-auto ">
            {/* left side */}
            <div className="lg:col-span-3 flex flex-col gap-6 order-6 lg:order-1">
                {interviewer.bio && (<Card className="p-5">
                    <CardHeader>
                        <CardTitle>
                         <SectionLabel>   About {interviewer.name}</SectionLabel>
                        </CardTitle>

                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">{interviewer.bio}</p>
                    </CardContent>
                </Card>)}

                {
                    interviewer.categories.length>0 && (
                        <Card className="p-5">
                            <CardHeader>
                                <CardTitle>
                                    <SectionLabel>Categories</SectionLabel>
                                </CardTitle>
                                <CardDescription>
                                    <p className="text-muted-foreground text-sm">{interviewer.name} is an expert in the following categories</p> 
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {interviewer.categories.map((category) => (
                                        <Badge key={category} variant={"outline"} className="px-3 py-3">
                                            <p className="text-sm font-medium">{category}</p>
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )
                }

                {/* what to expect */}
                <Card className="p-5">
                    <CardHeader>
                        <CardTitle>
                            <SectionLabel>What to expect</SectionLabel>
                        </CardTitle>
                        <CardDescription>
                            <p className="text-muted-foreground text-sm">Every session in mocktail comes with the following features</p>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 flex-wrap">
                            {EXPECT_ITEMS.map(([icon,title,desc]) => (
                                <div key={icon} className="flex items-center gap-4">
                                    {/* icon */}
                                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                        <p className="text-lg font-medium">{icon}</p>
                                    </div>
                                   <div className="flex flex-col">
                                     <p className="text-sm font-medium">{title}</p>
                                    <p className="text-sm font-medium text-muted-foreground">{desc}</p>
                                   </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* right side */}
            <div className="lg:col-span-2 order-1 lg:sticky top-500 ">
                <SlotPicker interviewer={interviewer} user={user||null} interviewerCreditsRate={interviewer.creditRate??1}/>
            </div>
        </div>
    </main>
  )
}

export default InterviewerPage
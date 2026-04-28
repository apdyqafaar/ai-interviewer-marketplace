"use client"
import { Booking, Interviewer, UserRole } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useMemo, useRef, useState } from 'react';
import { formatDateFull, formatDateTab, formatTime, generateDates, generateSlots } from '@/lib/helpers';
import useFetch from '@/hooks/use-fetch';
import { bookSlot } from '@/actions/booking';
import { useRouter } from 'next/navigation';
import { CreditButton } from '@/components/credit-button';
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { InfoIcon } from 'lucide-react';
import { toast } from 'sonner';
interface SlotPickerProps{
    interviewer:Interviewer
    user:{
    id: string;
    email: string;
    name: string | null;
    imageUrl: string | null;
    role: UserRole;
    credits: number;
    bio: string | null;
    yearsExp: number | null;
    creditRate: number;
    creditBalance: number;
    }|null,
    interviewerCreditsRate:number
}
const SLOT_DURATION_MINUTES=45
const DAYS_AHEAD=7
const SlotPicker = ({interviewer,user,interviewerCreditsRate}:SlotPickerProps) => {
    // states
    const[selectedDate,setSelectedDate]=useState<Date>(new Date())
    const[selectedSlot,setSelectedSlot]=useState<any>(null)
    const[upgradeOpen,setUpgradeOpen]=useState(false)
    const[error,setError]=useState<string | null>(null)
    const summeryRef=useRef<HTMLDivElement>(null)

    // smooth scroll
    useEffect(()=>{
        if(selectedSlot && summeryRef.current){
            summeryRef.current.scrollIntoView({behavior:"smooth", block:'start'})
        }
    },[selectedSlot])

    const router=useRouter()
    const dates=useMemo(()=>generateDates(DAYS_AHEAD),[])


    const {fn:handleBookSlot,loading:bookingLoading,error:bookingError,data:bookingData}=useFetch<{error?:string|null,success?:boolean,bookingId?:string, streamCallId?:string}>(bookSlot)

    useEffect(()=>{
        console.log("bookingData", bookingData)
        if(bookingData?.error){
            setError(bookingData.error)
            toast.error(bookingData.error)
            return
        }
        
        if(bookingData?.success){
            toast.success("Slot booked successfully")

            // wait for 2 seconds
            setTimeout(()=>{
                router.push(`/appointments`)
            },2000)
        }
    },[bookingData])

    const availability=interviewer.availabilities?.[0]
    const canAfford=user && user.credits>=user.credits

    const slot=useMemo(()=>{
        if(!availability)return null

        return generateSlots(
            selectedDate,
            availability.startTime,
            availability.endTime,
            interviewer.bookingAsInterviewer ?? [],
            SLOT_DURATION_MINUTES,
        )
    }, [selectedDate, availability, interviewer.bookingAsInterviewer])

    const handleSlotSelect=(slot:any)=>{
        console.log(slot)
        if(slot.isBooked)return
        if(!slot){
            setError("Please select a slot")
            return
        }
       if(!canAfford){
        setUpgradeOpen(true)
        return
       }
       setSelectedSlot((prev : any)=>prev?.startTime.getTime()===slot.startTime.getTime()?null:slot)
    }

    
 
    const handleConfirm=async()=>{
        if(!selectedSlot)return
        const res=await handleBookSlot({
            interviewerId:interviewer.id,
            startTime:selectedSlot.startTime,
            endTime:selectedSlot.endTime,
        })
        // if(res?.success){
        //     router.push(`/interview/${res.data.id}`)
        // }
    }

    if(!availability){
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No availability</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>No availability</p>
                </CardContent>
            </Card>
        )
    }
  return (
    <>
    <CreditButton className='hidden' open={upgradeOpen} onOpenChange={setUpgradeOpen} credits={user?.credits??0} isInterviewer={false} />
       <div className=' min-h-full w-full'>
        <Card className='p-4'>
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <CardTitle className='text-foreground  text-xl font-light '>Book a session</CardTitle>
                <CardDescription>
                    <p className='text-sm text-muted-foreground'>Select a slot and book a session and end</p>
                </CardDescription>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <span className='text-base font-light text-muted-foreground'>Cost:</span>
                        <p className='text-2xl font-bold text-amber-500 leading-2 flex '>{interviewerCreditsRate}  <span className=' ml-2 -mt-0.5  text-sm font-medium text-muted-foreground'>cr</span></p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
               <div className="flex my-4 gap-2 overflow-y-auto scrollbar-hide px-1 -mx-1 pb-0.5">
                {
                    dates.length>0&&(
                        dates.map(d=>{
                            const label=formatDateTab(d)
                            const isActive=d.toDateString()===selectedDate.toDateString()
                            return (
                                <Button
                                key={d.toISOString()}
                                variant={isActive?"default":"outline"}
                                onClick={()=>{
                                    setSelectedDate(d)
                                    setSelectedSlot(null)
                                }}
                                className={`rounded-lg px-4 py-2 transition-all mb-2  ${isActive?"bg-amber-500/10 text-amber-500 border-amber-500/80":" text-muted-foreground hover:text-foreground border-border"}`}
                                >
                                  <span className='text-xs font-medium hover:text-amber-500'>
                                    {label.top}
                                  </span>
                                  <span className='text-sm font-medium'>
                                    {label.bottom}
                                  </span>
                                </Button>
                            )
                        })
                    )
                }
               </div>

               <Separator/>
               {
                slot?.length==0 ? (
                    <div className='flex items-center justify-center'>
                        <p className='text-muted-foreground'>No availability</p>
                    </div>
                ):(
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
                        {slot?.map((s)=>{
                             const label=formatDateTab(s.startTime)
                            const isActive=selectedSlot?.startTime.getTime()===s.startTime.getTime()
                            return (
                                <Button
                                key={s.startTime.toISOString()}
                                disabled={s.isBooked}
                                variant={isActive?"default":"outline"}
                                onClick={()=>{
                                   handleSlotSelect(s)
                                }}
                                className={`rounded-lg px-4 py-2 transition-all mb-2  ${isActive?"bg-amber-500/10 text-amber-500 border-amber-500/80":" text-muted-foreground hover:text-foreground border-border"}`}
                                >
                                 
                                  {
                                    s.isBooked ? (
                                     
                                            <p className="text-sm font-medium">Booked</p>
                                    
                                    ):(
                                        <>
                                        {formatTime(s.startTime)} 
                                       
                                        </>
                                    )
                                  }
                                </Button>
                            )
                        })}
                    </div>
                )
               }

               {
                selectedSlot && (
                    <div ref={summeryRef} className='flex flex-col gap-3 mt-4 '>
                        <p className='text-muted-foreground text-xs'>You are booking</p>
                        <div className="flex-flex-col gap-2">
                            <Label>Date</Label>
                            <span className='text-sm text-muted-foreground'>{formatDateFull(selectedSlot.startTime)}</span>
                        </div>
                        <div className="flex-flex-col gap-2">
                            <Label>Time</Label>
                            <span className='text-sm text-muted-foreground'>{formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</span>
                        </div>

                         <div className="flex-flex-col gap-2">
                            <Label>Duration</Label>
                            <span className='text-sm text-muted-foreground'>{SLOT_DURATION_MINUTES} minutes</span>
                        </div>
                        <Separator/>
                       
                            {/* <span className='text-base shrink-0'>🎥</span> */}
                            {/* <p className='text-sm text-muted-foreground'>Video call room will be created in <span className='text-foreground font-medium'>Stream</span> after booking and you will be redirected immediately after confirming</p> */}
                            <Alert>
  <InfoIcon />
  <AlertTitle>🎥</AlertTitle>
  <AlertDescription>
   Video call room will be created in <span className='text-foreground font-medium'>Stream</span> after booking and you will be redirected immediately after confirmin
  </AlertDescription>
  {/* <AlertAction>
    <Button variant="outline">Enable</Button>
  </AlertAction> */}
</Alert>
                      
                              {/* error message */}
                              {error && (
                                <div className='flex items-center gap-2 border border-red-500 rounded-lg p-3'>
                                    <span className='text-red-500'>❌</span>
                                    <p className='text-sm text-red-500'>{error}</p>
                                </div>
                              )}
                      {/* two buttons for booking and cancel */}
                      <div className='flex items-center gap-2'>
                        <Button
                        onClick={handleConfirm}
                        disabled={bookingLoading}
                        className='flex-1 rounded-sm cursor-pointer'
                        >
                            {bookingLoading?"Booking...":"Book Slot"}
                        </Button>
                        <Button
                        className='rounded-sm cursor-pointer'
                        onClick={()=>{
                            setSelectedSlot(null)
                            setError(null)
                        }}
                        disabled={bookingLoading}
                        >
                            Cancel
                        </Button>
                      </div>
                    </div>
                )
               }
            </CardContent>
        </Card>
    </div> 
   </>
 
  )
}

export default SlotPicker
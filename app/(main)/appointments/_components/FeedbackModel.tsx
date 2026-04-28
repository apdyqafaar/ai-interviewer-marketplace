"use client"

import { Feedback } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StarsBackgroundDemo } from "@/components/demo-components-backgrounds-stars"
import { RATING_CONFIG } from "@/lib"
import { GrayTitle } from "@/components/resubales"
import { AlertCircle, Brain, Check, CheckCircle, MessageSquare, SparkleIcon, TrendingUp,  } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AlertDescription,  Alert } from "@/components/ui/alert"

interface FeedbackModelProps {
    feedback:Feedback,
    feedbackOpened:boolean,
    setFeedbackOpened:React.Dispatch<React.SetStateAction<boolean>>,
    intervieweeName:string|undefined
}
const FeedbackModel = ({feedback,feedbackOpened,setFeedbackOpened,intervieweeName}:FeedbackModelProps) => {
    const rating=RATING_CONFIG[feedback.overallRating]
  return (
   <Dialog open={feedbackOpened} onOpenChange={setFeedbackOpened}>

         <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
           
                <StarsBackgroundDemo/>
            
        <DialogHeader className="relative ">
            
            <DialogTitle  className='text-2xl font-serif'>
                <GrayTitle>
                    AI Feedback Report
                </GrayTitle>
            </DialogTitle>
            <DialogDescription >
                Performance analysis for {intervieweeName}
            </DialogDescription>
            <div className="flex flex-col gap-5">
                <div className={`rounded-lg border ${rating.className} bg-linear-to-br ${rating.bg} to-transparent p-6 flex items-center justify-between`}>
                 <div className="flex flex-col">
                       <p className="text-xs text-muted-foreground uppercase tracking-wider opacity-70">Over all Rating</p>
                    <p className="text-3xl  font-serif">{rating.label}</p>
                 </div>
                    <span className="text-2xl">{rating.emoji}</span>
                </div>

                {/* summery */}
                <div className="rounded-lg border border-border  p-6 bg-background">
                   <div className="flex items-center gap-2 mb-3">
                    <SparkleIcon className="h-4 w-4"/>
                     <h3 className="text-lg font-serif text-accent-foreground ">Summary</h3>
                   </div>
                    <p className="text-muted-foreground">{feedback.summary}</p>
                </div>

                {/* Recommendation */}
                <div className="rounded-lg border border-border  p-6 bg-background">
                   <div className="flex items-center gap-2 mb-3">
                    {/* <SparkleIcon className="h-4 w-4"/> */}
                     <h3 className="text-lg font-serif text-accent-foreground ">Recommendation</h3>
                   </div>
                    <p className="text-muted-foreground">{feedback.recommendation}</p>
                </div>
                
                {/* secsions */}
                <div className="grid gap-3">
                    {
                       ( [
                            {
                                icon:<Brain className="h-4 w-4 text-amber-500"/> ,
                                title:"Technical Skills",
                                value:feedback.technical,
                                
                            },
                            {
                                icon:<MessageSquare className="h-4 w-4 text-amber-500"/>,
                                 title:"Communication",
                                value:feedback.communication,
                            },
                            {
                               icon:<TrendingUp className="h-4 w-4 text-amber-500"/>,
                                 title:"Problem Solving",
                                value:feedback.problemSolving,
                            },
                           
                        ] as any).map((item:any,i:number)=>(
                            <div key={i} className="rounded-lg border border-border  p-6 bg-background">
                                <div className="flex items-center gap-2 mb-3">
                                    {item.icon}
                                    <h3 className="text-lg font-serif text-accent-foreground ">{item.title}</h3>
                                </div>
                                <p className="text-muted-foreground">{item.value}</p>
                            </div>
                        ))
                    }
                </div>

                {/* strengths */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-background rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-500"/>
                        <h3 className="text-lg font-serif text-accent-foreground ">Strengths</h3>
                    </div>
                    <div className="space-y-2">
                        {
                            feedback.strengths.map((strength,i)=>(
                                <Alert key={i} className="border-border">
  <Check className="h-3 w-3 mt-0.5 text-green-500"/>
  <AlertDescription className="text-muted-foreground ">
    {strength}
  </AlertDescription>
</Alert>
                            ))
                        }
                    </div>
                  </div>
                  
                   {/* areas of improvement */}
             
                  <div className="bg-background rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-red-500/80"/>
                        <h3 className="text-lg font-serif text-accent-foreground ">Areas of Improvement</h3>
                    </div>
                    <ul className="space-y-2">
                        {
                            feedback?.improvements.map((strength,i)=>(
                             
                                                              <Alert className="border-border" key={i}>
        <AlertCircle className="h-4 w-4 text-red-500/80"/>
  <AlertDescription className="text-muted-foreground ">
    {strength}
  </AlertDescription>
</Alert>
           
                            ))
                        }
                    </ul>
                  </div>
         
                </div>

                  
            </div>
        </DialogHeader>
    </DialogContent>
   
   </Dialog>
  )
}

export default FeedbackModel
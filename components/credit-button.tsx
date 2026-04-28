"use client";

import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PricingTable } from "@clerk/nextjs";
import { cn } from "@/lib";

interface CreditButtonProps {
  credits: number;
  isInterviewer: boolean;
  open?:boolean
  onOpenChange?:(open:boolean)=>void
  className?:string
}

export function CreditButton({ credits, isInterviewer,open,onOpenChange,className }: CreditButtonProps) {
  return (

    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("text-amber-500 border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 rounded-full hover:text-amber-400 transition-colors shadow-[0_0_15px_rgba(251,191,36,0.1)]",className)}
        >
          <Coins className="mr-2 h-4 w-4" />
          {credits} {isInterviewer ? "Earned" : "Credits"}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[70vw] max-h-[90vh] overflow-y-auto border-white/10 bg-background/95 backdrop-blur-3xl">
        <DialogHeader className="mb-6 space-y-3">
          <DialogTitle className="font-serif text-3xl text-foreground">
            <span className="text-amber-500 leading-snug">Upgrade</span> your plan
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base">
            Get more credits to book additional mock interviews. Each credit grants you one exclusive session with an expert.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center w-full px-4">
          <PricingTable checkoutProps={{
            appearance: {
              elements: {
                drawerRood: {
                  zIndex: 2000
                }
              }
            }
          }} />
        </div>
      </DialogContent>
    </Dialog>

  );
}

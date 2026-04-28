import React from "react"
import { StarsBackgroundDemo } from "./demo-components-backgrounds-stars"

export const GrayTitle=({children}:{children:React.ReactNode})=>(
    <span className="bg-linear-to-b from-stone-100 via-stone-300 to-stone-500 bg-clip-text text-transparent">
        {children}
    </span>
)

export const GoldTitle=({children}:{children:React.ReactNode})=>(
    <span className="bg-linear-to-b from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
        {children}
    </span>
)

export const SectionLabel=({children}:{children:React.ReactNode})=>(
    <p className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-[0.14em] uppercase">
        <span className="w-4 h-px bg-amber-400"/>
      {children}
    </p>
   
)
export const SectionHeading=({gold,gray}:{gold:string,gray:string})=>(
    <h1 className="text-5xl md:text-6xl font-semibold font-serif text-white"><GrayTitle>{gray}</GrayTitle></h1>
)

export const PageHeader=({smallTitle,title,description, right}:{smallTitle:string,title:string,description:string,right?:React.ReactNode})=>(
    <div className="relative text-start border-b border-border pb-10 mb-10 px-5 md:px-20 space-y-4 pt-4 flex flex-wrap justify-between items-center">
        <StarsBackgroundDemo/>
        <div className="flex-1 relative">
        <SectionLabel>{smallTitle}</SectionLabel>
        <h1 className="text-5xl md:text-6xl font-semibold font-serif text-white"><GrayTitle>{title}</GrayTitle></h1>
        <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>
        </div>
        {right && <div className="relative w-full md:w-auto flex justify-end mt-4 md:mt-0">{right}</div>}
    </div>
)
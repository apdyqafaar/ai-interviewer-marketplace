"use client"
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const INTERVIEWER_ONLY=["/appointments"]
const INTERVIEWEE_ONLY=["/dashboard"]

const RoleRedirect = ({role}: {role: "INTERVIEWER" | "INTERVIEWEE" | "UNASSIGNED" | null}) => {
     const pathname=usePathname()
     const router=useRouter()

     useEffect(() => {
        if(role==="UNASSIGNED" && pathname !=="/onboarding"){
            router.push("/onboarding")
        }

        // if all ready onboarded
        if(role === "INTERVIEWER" && pathname.startsWith("/onboarding")) router.push("/dashboard")
        if(role === "INTERVIEWEE" && pathname.startsWith("/onboarding")) router.push("/explore")


        // if user tries to access restricted pages
        if(role === "INTERVIEWER" && INTERVIEWER_ONLY.some((p)=>pathname.startsWith(p))) router.push("/dashboard")
        if(role === "INTERVIEWEE" && INTERVIEWEE_ONLY.some((p)=>pathname.startsWith(p))) router.push("/explore")
     }, [role, pathname, router])
    return null
}

export default RoleRedirect
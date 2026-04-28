import { api } from "../api/client";
import { OnboardingData } from "../types";

export const onboardService={
   onboard:async(data:OnboardingData)=>{
       return api.post("/onboarding",{data})    
   }
}
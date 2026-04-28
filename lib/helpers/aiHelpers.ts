
import OpenAI from "openai";
// import { currentUser } from "@clerk/nextjs/server"
import { configs } from "@/lib";


export const generateFeedback=async(prompt:string)=>{
    // const user=await currentUser()
    // if(!user){
    //     return{error:"Unauthorized"}
    // }
    
    try {
      
        const client = new OpenAI({
            apiKey:configs.openai_config.OPEN_AI_API_KEY
        });
        const response = await client.responses.create({
        model: "gpt-5-mini",
        input: prompt
        
        })

        return response.output_text??""
    } catch (error) {
        console.log(error)
        return "Error generating feedback"
    }
}


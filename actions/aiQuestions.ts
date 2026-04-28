"use server"
import OpenAI from "openai";
import { currentUser } from "@clerk/nextjs/server"
import { configs } from "@/lib";

// for generate questions
const CATEGORY_PROMPTS={
FRONTEND:"React,Next.js,Tailwindcss,JavaScript,TypeScript,html,css" ,
BACKEND:"Node.js,Express.js,MongoDB,SQL,Python" ,
MOBILE:"React Native,Flutter" ,
AI_AND_ML:"Python,TensorFlow,PyTorch,Machine Learning" ,
DATA_SCIENCE:"Python,Pandas,NumPy,Data Analysis,Machine Learning" ,
DEVOPS:"Docker,Kubernetes,CI/CD,AWS,Azure",
HR:"Behavioural questions,teamwork,communication,problem solving,work ethic,leadership,conflict resolution,adaptability,motivation,career goals",
FULLSTACK:"HTML,CSS,JavaScript,React,Node.js,Express.js,MongoDB,SQL,Python,Docker,Kubernetes,CI/CD,AWS,Azure"
}

export const generateQuestions=async(category:string,difficulty:string)=>{
    const user=await currentUser()
    if(!user){
        return{error:"Unauthorized"}
    }
    if(!category || !CATEGORY_PROMPTS[category as keyof typeof CATEGORY_PROMPTS]){
        return{error:"Invalid category"}
    }
    try {
      
        const client = new OpenAI({
            apiKey:configs.openai_config.OPEN_AI_API_KEY
        });
        const response = await client.responses.create({
        model: "gpt-5-mini",
        input: `You are a expert technical interviewer. generate 6 interview questions on ${difficulty}.  fro a ${category} role covering ${CATEGORY_PROMPTS[category as keyof typeof CATEGORY_PROMPTS]},
        
        Fore each question provide concise but complete answer (2-4 sentences) that an interviewer can use to evaluate the candidate's response.
 
        response Only valid JSON array, format
        "questions":[
            {
                "question":"question",
                "answer":"answer"
            },{
                "question":"question",
                "answer":"answer"
            }
        ]
        
        `
        })

        return JSON.parse(response.output_text as unknown as string) as unknown as {question:string,answer:string}[]
        
    } catch (error) {
        console.log(error)
        return "Error generating questions"
    }
}


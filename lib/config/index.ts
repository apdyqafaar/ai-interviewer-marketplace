
import "dotenv/config"
export const configs={
    clerk_config:{
      publick_key:process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!||"",
      secret_key:process.env.CLERK_SECRET_KEY!||"",
   },

   stream_config:{
    key:process.env.NEXT_PUBLIC_GETSTREAM_KEY||"",
    secret:process.env.NEXT_PUBLIC_GETSTREAM_SECRET||""
   },
   arcjet_config:{
    key:process.env.ARCJET_KEY!||"",
   },
   db_config:{
    DATABASE_URL:process.env.DATABASE_URL!||"",
    DIRECT_URL:process.env.DIRECT_URL!||""
   },
   openai_config:{
    OPEN_AI_API_KEY:process.env.OPEN_AI_API_KEY!||"",
   }
}
import { useState } from "react"
import { toast } from "sonner"

    const useFetch=<T>(cb:(...args:any[])=>any)=>{
        const [data, setData]=useState<T|undefined>(undefined)
        const [loading, setLoading]=useState(false)
        const [error , setError]=useState<any|null>(null)

        const fn=async(...arg:any[]):Promise<T|undefined>=>{
           setLoading(true)
           setError(null)

           try {
             const result=await cb(...arg)
             setData(result)
             return data
           } catch (error) {
            setError(error)
             toast.error("Something went wrong while saving your details")
           }finally{
            setLoading(false)
           }
        }
        return {data,loading,error,fn}
    }

    export default useFetch



import { QueryClient } from "@tanstack/react-query"

export const makeQuery=()=>{
    return new QueryClient({
        defaultOptions:{
            queries:{
                staleTime:60*1000,
                retry:1,
                refetchOnWindowFocus:process.env.NODE_ENV==="production",
            },
            mutations:{
                retry:0
            }
        }
    })
}

let browserQueryClient:QueryClient | undefined

export const getQueryClient=()=>{
    if(typeof window==="undefined"){
        return makeQuery()
    }
    if(!browserQueryClient){
        browserQueryClient=makeQuery()
    }
    return browserQueryClient
}
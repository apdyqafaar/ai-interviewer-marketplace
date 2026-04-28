import axios ,{AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
// interface
export interface ApiResponse<T=unknown>{
    success:boolean,
    message:string,
    data?:T,
    error?:string
}

export class ApiError extends Error{
  constructor(message:string, public status:number, public data?:unknown){
    super(message)
    this.name="ApiError"
  }
}

const axiosInstance=axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL||"/api",
    withCredentials:false,
    headers:{
        "Content-Type":"application/json"
    }
})


export const api={
    get:<T=unknown>(endpoint:string, config?:AxiosRequestConfig)=>axiosInstance.get<ApiResponse<T>>(endpoint, config).then((res)=>res.data.data as T),
    post:<T=unknown>(endpoint:string, body?:unknown, config?:AxiosRequestConfig)=>axiosInstance.post<ApiResponse<T>>(endpoint,body, config).then((res)=>res.data.data as T),
    put:<T=unknown>(endpoint:string, body?:unknown, config?:AxiosRequestConfig)=>axiosInstance.put<ApiResponse<T>>(endpoint, body, config).then((res)=>res.data.data as T),
    delete:<T=unknown>(endpoint:string,config?:AxiosRequestConfig)=>axiosInstance.delete<ApiResponse<T>>(endpoint,  config).then((res)=>res.data.data as T),
}
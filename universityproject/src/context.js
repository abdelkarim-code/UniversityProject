import { createContext, useContext } from "react"

 export const AlertContext=createContext()
 export const base_url="https://127.0.0.1:8000"
export const useAlert=()=>useContext(AlertContext)
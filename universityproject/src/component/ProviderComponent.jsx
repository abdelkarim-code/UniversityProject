import React,{ useState} from 'react'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { AlertContext } from '../context';

export const AlertProvider=({children})=>{
    const [open,setopen]=useState({state:false,message:"",color:"success"})
    return (
     <AlertContext.Provider value={{open,setopen}}>

     {children}
        <Snackbar open={open.state} autoHideDuration={6000} onClose={()=>setopen({...open,state:false,message:""})}>
  <Alert
    onClose={()=>setopen({...open,state:false,message:""})}
    severity={open.color}
    variant="filled"
    sx={{ width: '100%' }}
  >
    {open.message}
  </Alert>
</Snackbar>
     </AlertContext.Provider>



    )
}





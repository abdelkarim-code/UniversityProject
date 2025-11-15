import { useMediaQuery } from 'react-responsive'
import LoginMobile from './LoginMobile'
import LoginDesktop from './LoginDesktop'
import { useDispatch, useSelector } from 'react-redux';
import { UserLogin } from '../redux/Slices/AuthSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../context';
import "../../styles/login.css"
import { Box } from '@mui/material';
function Login() {
    const isMobile = useMediaQuery({ query: '(max-width: 728px)' });
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const alert=useAlert()
    const {isloading,status,path}=useSelector(state=>state.auth)
 const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const Data = Object.fromEntries(formData.entries());
    dispatch(UserLogin(Data))
  };
  
useEffect(()=>{
    
if(status==200){
    navigate(path)
}else if(status==401){
 alert.setopen({state:true,message:"Incorrect crediential detected",color:"error"})
}

},[status])
return (
         <Box class="liu-background ">


        {isMobile?
      

    <LoginMobile handleSubmit={handleSubmit} isloading={isloading}/>
  
  
    :
 <LoginDesktop handleSubmit={handleSubmit} isloading={isloading}/>
    
  }
  </Box>
)
 

 
}

export default Login
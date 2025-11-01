import { useMediaQuery } from 'react-responsive'
import LoginMobile from './LoginMobile'
import LoginDesktop from './LoginDesktop'
import { useDispatch, useSelector } from 'react-redux';
import { UserLogin } from '../redux/Slices/AuthSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../context';

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
    console.log(status)
if(status==200){
    navigate(path)
}else if(status==401){
 alert.setopen({state:true,message:"Incorrect crediential detected",color:"error"})
}
},[status])
 

  if(isMobile){
      return (
    <LoginMobile handleSubmit={handleSubmit} isloading={isloading}/>
  )
  }else{
    return (
 <LoginDesktop handleSubmit={handleSubmit} isloading={isloading}/>
    )
  }
 
}

export default Login
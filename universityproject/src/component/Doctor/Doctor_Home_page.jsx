import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Doctor_Home_page() {
const navigate=useNavigate()
useEffect(() => {
const handlePopState = (e) => {
    e.preventDefault();
    
    navigate("/Liu/Login")
    
};
window.addEventListener("popstate", handlePopState);
return () => {
    window.removeEventListener("popstate", handlePopState);
};
}, []);
  return (
    <div>Doctor_Home_page</div>
  )
}

export default Doctor_Home_page
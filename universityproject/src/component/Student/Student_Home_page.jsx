import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function Student_Home_page() {
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
    <div>Student_Home_page</div>
  )
}

export default Student_Home_page
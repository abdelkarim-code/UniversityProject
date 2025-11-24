require("dotenv").config()
const express=require("express")
const authRoute=express.Router()
const knex=require("../db")
const token=require("jsonwebtoken")
const { fa } = require("@faker-js/faker")

//token configuration
tokenConfig={
         httpOnly: true,
         secure: false, 
         path:"/",          
         sameSite: 'Lax',    
         maxAge: 1000 * 60 * 60 * 24 * 7,
         domain:"localhost"
    }
//token generation
function GenerateToken(res,tokengenerated,role){
  const key_name=role?"student_token":"doctor_token"
res.clearCookie(key_name, { path: '/' });
res.cookie(key_name, tokengenerated,tokenConfig);
          
}

//end points
authRoute.post("/",async(req,res)=>{
  if(Object.keys(req.body).length>0){
    if(isNaN(req.body?.user_identifier)){
        const user_found=await knex("doctors").where("employee_code",req.body?.user_identifier).first()
       if(user_found){
       
         const final_check=await knex("users").where("user_id",user_found?.user_id).andWhere("password_hash",req.body.password).first()
         if(final_check){
            const tokengenerated=token.sign(user_found,process.env.SECRET_KEY,{expiresIn:"30m"})
            GenerateToken(res,tokengenerated,false)
            return res.status(200).json({success:true,user_role:final_check.role,user_id:final_check?.user_id})
         }else{
            return res.status(401).json({success:false})
         }
       }else{
            return res.status(401).json({success:false})
         }
      
    }else{
       const user_found=await knex("students").where("student_code",req.body?.user_identifier).first()
       if(user_found){
        
         const final_check=await knex("users").where("user_id",user_found?.user_id).andWhere("password_hash",req.body.password).first()
         if(final_check){
             const tokengenerated=token.sign(user_found,process.env.SECRET_KEY,{expiresIn:"30min"})
             GenerateToken(res,tokengenerated,true)
            return res.status(200).json({success:true,user_role:final_check.role,user_id:final_check?.user_id})
         }else{
            return res.status(401).json({success:false})
         }
       }else{
            return res.status(401).json({success:false})
         }
    }
  }else{
    return res.status(400).json({message:"no body data deteted"})
  }
    
    
})
authRoute.get("/checkToken/:s_or_d",(req,res)=>{
 
  try{
     let {s_or_d} =req.params
    s_or_d= s_or_d=="true"
    
    const access_token=s_or_d?req.cookies.student_token:req.cookies.doctor_token 
    
    if(!access_token) return res.status(401).json({valid:false}) 
    const user_decoded=token.verify(access_token,process.env.SECRET_KEY)
    
    return res.status(200).json({valid:true,user_info:user_decoded})
  }catch(err){
    return res.status(401).json({valid:false})
  }

 
})
authRoute.get("/Logout/:s_or_d",(req,res)=>{
  let{s_or_d} =req.params
  s_or_d= s_or_d=="true"
 const key_name=s_or_d?"student_token":"doctor_token"
res.clearCookie(key_name, { path: '/' });
return res.status(200).json()
 
})
module.exports=authRoute
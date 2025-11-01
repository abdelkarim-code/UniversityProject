require("dotenv").config()
const express=require("express")
const authRoute=express.Router()
const knex=require("../db")
const token=require("jsonwebtoken")
//end points
authRoute.post("/",async(req,res)=>{
  if(Object.keys(req.body).length>0){
    if(isNaN(req.body?.user_identifier)){
        const user_found=await knex("doctors").where("employee_code",req.body?.user_identifier).first()
       if(user_found){
       
         const final_check=await knex("users").where("user_id",user_found?.user_id).andWhere("password_hash",req.body.password).first()
         if(final_check){
            const tokengenerated=token.sign(user_found,process.env.SECRET_KEY,{expiresIn:"1d"})
            res.cookie('session_token', tokengenerated, {
                            httpOnly: true,
                            secure: true,        
                            sameSite: 'None',    
                            maxAge: 1000 * 60 * 60 * 24 * 7
                            });
            return res.status(200).json({success:true,user_role:final_check.role})
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
            const tokengenerated=token.sign(user_found,process.env.SECRET_KEY,{expiresIn:"1d"})
            res.cookie('session_token', tokengenerated, {
                            httpOnly: true,
                            secure: true,        
                            sameSite: 'None',    
                            maxAge: 1000 * 60 * 60 * 24 * 7
                            });
            return res.status(200).json({success:true,user_role:final_check.role})
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
module.exports=authRoute
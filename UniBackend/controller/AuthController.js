require("dotenv").config()
const express=require("express")
const authRoute=express.Router()
const knex=require("../db")
const token=require("jsonwebtoken")
const { fa } = require("@faker-js/faker")
tokenConfig={
         httpOnly: true,
         secure: false, 
         path:"/",          
         sameSite: 'None',    
         maxAge: 1000 * 60 * 60 * 24 * 7,
         domain:"localhost"
    }
//end points
authRoute.post("/",async(req,res)=>{
  if(Object.keys(req.body).length>0){
    if(isNaN(req.body?.user_identifier)){
        const user_found=await knex("doctors").where("employee_code",req.body?.user_identifier).first()
       if(user_found){
       
         const final_check=await knex("users").where("user_id",user_found?.user_id).andWhere("password_hash",req.body.password).first()
         if(final_check){
            const tokengenerated=token.sign(user_found,process.env.SECRET_KEY,{expiresIn:"1h"})
            const refresh_token=token.sign(user_found,process.env.SECRET_KEY,{expiresIn:"1d"})
            res.clearCookie('access_token', { path: '/' });
            res.clearCookie('refresh_token', { path: '/' });
            res.cookie('access_token', tokengenerated,tokenConfig);
          res.cookie('refresh_token', refresh_token, tokenConfig);
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
             const tokengenerated=token.sign(user_found,process.env.SECRET_KEY,{expiresIn:"1h"})
            const refresh_token=token.sign(user_found,process.env.SECRET_KEY,{expiresIn:"1d"})
             res.clearCookie('access_token', { path: '/' });
            res.clearCookie('refresh_token', { path: '/' });
            res.cookie('access_token', tokengenerated, tokenConfig);
          res.cookie('refresh_token', refresh_token, tokenConfig);
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
module.exports=authRoute
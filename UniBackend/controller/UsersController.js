const express=require("express")
const userRoute=express.Router()
const knex=require("../db")
const {faker}=require("@faker-js/faker")
const omit=require("lodash/omit")
//end points
userRoute.post("/",async(req,res)=>{
   
    const {first_name,last_name}=req.body
    
    let password_hash=""
     let email=""
    if(Object.keys(req.body).length>0){
      
   try{
       switch(req.body.role){
            case 2:
                //doctor
                
             email=`${first_name}.${last_name}@liu.edu.lb`
            password_hash=faker.string.alpha(8);
              const user=await knex("users").where("first_name",first_name).andWhere("last_name",last_name).first()
        if(!user)
            {
                
                const [newUser]=await knex("users").insert({...req.body,email,password_hash})
            return res.status(201).json({data:newUser,success:true})
            }  else{
                return res.status(409).json({success:false})
            } 
            case 3:
                //student
               
                let student_code=`${req.body.department_id}${new Date().getFullYear()%100}${faker.string.numeric(4)}`
                 
            email=`${student_code}@students.liu.edu.lb`
            password_hash=faker.string.alpha(8);
            const {gender,address,phone,role}=req.body
             const [newUser]=await knex("users").insert({first_name,last_name,gender,address,phone,role,email,password_hash})
            return res.status(201).json({data:newUser,success:true,student_code})
          
            default:
                return  res.send("end point work currently only for doctor")
        }
    }catch(err){
      return res.status(500).json(err)
    }
}else{
    return res.status(500).json({err:"no body parameter founded"})
}
    
    
})
userRoute.get("/:id",async(req,res)=>{
    const {id}=req.params
    try{
     const userByID=await knex("users").where({user_id:id}).first()
     if(userByID){
        return res.status(200).json(omit(userByID,["password_hash"]))
     }else{
        return res.status(404).json({err:"not found"})
     }
    }catch(err){
      return res.status(500).json(err)
    }
})
userRoute.get("/system/getstudentInfo/:id",async(req,res)=>{
    const {id}=req.params
    try{
     const userByID=await knex("users").where("users.user_id",id)
     .join("students","users.user_id","=","students.user_id")
     .join("departments","departments.department_id","=","students.department_id")
     .join("programs","programs.program_id","=","students.program_id")
     .select("users.*","students.*","programs.*","departments.*",{program_name:"programs.name"})
     .first()
     if(userByID){
        return res.status(200).json(omit(userByID,["password_hash"]))
     }else{
        return res.status(404).json({err:"not found"})
     }
    }catch(err){
      return res.status(500).json(err)
    }
})
userRoute.get("/",async(req,res)=>{
   
    try{
     const users=await knex("users").select("*")
     
        return res.status(200).json(users)
    
    }catch(err){
      return res.status(500).json(err)
    }
})
userRoute.put("/:id",async(req,res)=>{
    const {id}=req.params
    res.send(id)
    // try{
    //   const users=await knex("users").select("*").where({name:req.body.name}).whereNot({faculty_id:id})
    //   console.log(users)
    //   if(users.length==0){
    //   const affectedRow=await knex("users").where({faculty_id:id}).update(req.body)
    //  if(affectedRow>0){
    //    return res.status(204).json()
    //  }
    //   }else{
    //     return res.status(409).json()
    //   }
    // }catch(err){
    //   return res.status(500).json(err)
    // }
})
userRoute.delete("/:id",async(req,res)=>{
    const {id}=req.params
    try{
     const affectedRow=await knex("users").where({user_id:id}).delete()
     if(affectedRow>0){
       return res.status(200).json({success:true})
     }else{
        return res.status(404).json({success:false})
     }
    
   
    
    
    }catch(err){
      return res.status(500).json(err)
    }
})
module.exports=userRoute
const express=require("express")
const doctorRoute=express.Router()
const knex=require("../db")

//end points
doctorRoute.post("/:userid/users/:department_id/departments",async(req,res)=>{
   if(Object.keys(req.body).length>0){
    const {first_name,last_name,specialization}=req.body
    const employee_code=`${first_name}.${last_name}`
     try{
          const [newDoctor]=await knex("doctors").insert({specialization,employee_code:employee_code,user_id:req.params.userid,department_id:req.params.department_id})
          return res.status(201).json({data:newDoctor,success:true})
          
  
}catch(err){
      return res.status(500).json(err)
    }
}else{
    return res.status(500).json({err:"no body parameter founded"})
}
})
//# course_id, department_id, code, name, description, credit_hours, level, semester, program_id

doctorRoute.get("/:department_id/departments",async(req,res)=>{
   const {department_id}=req.params
    try{
     const doctors=await knex("doctors")
     .join("users","doctors.user_id","=","users.user_id")
     .select("doctors.*","users.first_name","users.last_name").where("department_id",department_id)
    return res.status(200).json(doctors)
    }catch(err){
      return res.status(500).json(err)
    }
})
doctorRoute.put("/:doctorid",async(req,res)=>{
    // const {doctorid}=req.params
    // const {name}=req.body
    // try{
    //     const doctorMatch=await knex("doctors").where("name",name).whereNot("doctor_id",Number(doctorid)).first()
    //             if(!doctorMatch){
    //             const affectedRow=await knex("doctors").where({doctor_id:doctorid}).update(req.body)
    //             if(affectedRow>0){
    //             return res.status(204).json()
    //             }else{
    //                 return res.status(404).json()
    //             }
    //            }else{
    //             return res.status(409).json()
    //            }
     
    // }catch(err){
    //   return res.status(500).json(err)
    // }
})
doctorRoute.delete("/:doctor_id",async(req,res)=>{
    const {doctor_id}=req.params
     
    try{
       const affectedRow=await knex("doctors").where({doctor_id:doctor_id}).delete()
     if(affectedRow>0){
       return res.status(200).json({success:true})
     }else{
        return res.status(404).json({success:false})
     }
    
    
    }catch(err){
      return res.status(500).json(err)
    }
})
module.exports=doctorRoute
const express=require("express")
const deRoute=express.Router()
const knex=require("../db")
//end points
deRoute.post("/:departmentid/departments",async(req,res)=>{
   
  if(Object.keys(req.body).length>0){
     const {name}=req.body
    
     try{
     const programMatch=await knex("programs").where("name",name).first()
    if(!programMatch)
    {
     const [newProgram]=await knex("programs").insert({...req.body,department_id:req.params.departmentid})
       return res.status(201).json({data:newProgram,success:true})
    }  else{
         return res.status(409).json({success:false})
    }  
   
    }catch(err){
      return res.status(500).json(err)
    }
}else{
    return res.status(500).json({err:"no body parameter founded"})
}
})
deRoute.get("/:departmentid/departments",async(req,res)=>{
    const {departmentid}=req.params
    try{
     const programByDepartment=await knex("programs").where("department_id",departmentid).select("*")
     if(programByDepartment){
        return res.status(200).json(programByDepartment)
     }else{
        return res.status(404).json({err:"not found"})
     }
    }catch(err){
      return res.status(500).json(err)
    }
})
deRoute.put("/:programid",async(req,res)=>{
    const {programid}=req.params
    const {name}=req.body
    try{
        const ProgramMatch=await knex("programs").where("name",name).whereNot("program_id",Number(programid)).first()
                if(!ProgramMatch){
                const affectedRow=await knex("programs").where({program_id:programid}).update(req.body)
                if(affectedRow>0){
                return res.status(204).json()
                }else{
                    return res.status(404).json()
                }
               }else{
                return res.status(409).json()
               }
     
    }catch(err){
      return res.status(500).json(err)
    }
})
deRoute.delete("/:program_id",async(req,res)=>{
    const {program_id}=req.params
     
    try{
       const affectedRow=await knex("programs").where({program_id:program_id}).delete()
     if(affectedRow>0){
       return res.status(200).json({success:true})
     }else{
        return res.status(404).json({success:false})
     }
    
    
    }catch(err){
      return res.status(500).json(err)
    }
})
module.exports=deRoute
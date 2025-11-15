const express=require("express")
const deRoute=express.Router()
const knex=require("../db")
//end points
deRoute.post("/:facultyId/faculties",async(req,res)=>{
    //name,code,description
  if(Object.keys(req.body).length>0){
     const {name,code}=req.body
    
     try{
     const departemntMatch=await knex("departments").where("name",name).orWhere("code",code).first()
     console.log(departemntMatch)
    if(!departemntMatch)
    {
     const [newDepartement]=await knex("departments").insert({...req.body,faculty_id:req.params.facultyId})
       return res.status(201).json({data:newDepartement,success:true})
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
deRoute.get("/",async(req,res)=>{
   
    try{
     const departments=await knex("departments").select("*")
     
        return res.status(200).json(departments)
    
    }catch(err){
      return res.status(500).json(err)
    }
})
deRoute.get("/:facultyId/faculties",async(req,res)=>{
    const {facultyId}=req.params
    try{
     const departemntbyFaculity=await knex("departments").where("faculty_id",facultyId).select("*")
     if(departemntbyFaculity){
        return res.status(200).json(departemntbyFaculity)
     }else{
        return res.status(404).json({err:"not found"})
     }
    }catch(err){
      return res.status(500).json(err)
    }
})
deRoute.put("/:departmentid",async(req,res)=>{
    const {departmentid}=req.params
    const {name,code}=req.body
    try{
        const departemntMatch=await knex("departments").where("name",name).orWhere("code",code).whereNot("department_id",Number(departmentid)).first()
                if(!departemntMatch){
                const affectedRow=await knex("departments").where({department_id:departmentid}).update(req.body)
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
deRoute.delete("/:departmentid",async(req,res)=>{
    const {departmentid}=req.params
     
    try{
       const affectedRow=await knex("departments").where({department_id:departmentid}).delete()
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
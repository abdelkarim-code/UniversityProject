const express=require("express")
const faRoute=express.Router()
const knex=require("../db")
//end points
faRoute.post("/",async(req,res)=>{
    if(Object.keys(req.body).length>0){

    
     try{
     const faculties=await knex("faculties").select("*").where({name:req.body.name})
    if(faculties.length==0)
    {
     const [newFaculity]=await knex("faculties").insert(req.body)
       return res.status(201).json({data:newFaculity,success:true})
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
faRoute.get("/:id",async(req,res)=>{
    const {id}=req.params
    try{
     const facultyById=await knex("faculties").where({faculty_id:id}).first()
     if(facultyById){
        return res.status(200).json(facultyById)
     }else{
        return res.status(404).json({err:"not found"})
     }
    }catch(err){
      return res.status(500).json(err)
    }
})
faRoute.get("/",async(req,res)=>{
   
    try{
     const faculties=await knex("faculties").select("*")
     
        return res.status(200).json(faculties)
    
    }catch(err){
      return res.status(500).json(err)
    }
})
faRoute.put("/:id",async(req,res)=>{
    const {id}=req.params
    console.log(id||"no id",req.body?.name||"no name")
    try{
      const faculties=await knex("faculties").select("*").where({name:req.body.name}).whereNot({faculty_id:id})
      console.log(faculties)
      if(faculties.length==0){
      const affectedRow=await knex("faculties").where({faculty_id:id}).update(req.body)
     if(affectedRow>0){
       return res.status(204).json()
     }
      }else{
        return res.status(409).json()
      }
    }catch(err){
      return res.status(500).json(err)
    }
})
faRoute.delete("/:id",async(req,res)=>{
    const {id}=req.params
    try{
     const affectedRow=await knex("faculties").where({faculty_id:id}).delete()
     if(affectedRow>0){
       return res.status(200).json({success:true})
     }else{
        return res.status(200).json({success:false})
     }
    
   
    
    
    }catch(err){
      return res.status(500).json(err)
    }
})
module.exports=faRoute
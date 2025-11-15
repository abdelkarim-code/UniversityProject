const express=require("express")
const faRoute=express.Router()
const knex=require("../db")
const { fa } = require("@faker-js/faker")

//end points
faRoute.post("/:departmentid/departments",async(req,res)=>{
    const coursedb=knex("courses")
    //code name ,decription
    if(Object.keys(req.body).length>0){
        const {code ,name }=req.body
       
     try{
        console.log(typeof coursedb)
     const courseMatch=await knex("courses").where("name",name).orWhere("code",code).first()
    if(!courseMatch)
    {
     const [newCourse]=await knex("courses").insert({...req.body,department_id:req.params.departmentid})
       return res.status(201).json({data:newCourse,success:true})
    }  else{
         return res.status(409).json({success:false})
    }  
   
    }catch(err){
        console.log(err)
      return res.status(500).json(err.message)
    }
}else{
    return res.status(500).json({err:"no body parameter founded"})
}
    
    
})
faRoute.get("/:courseid",async(req,res)=>{
    const coursedb=knex("courses")
    const {courseid}=req.params
    try{
     const CourseById=await coursedb.where({course_id:courseid}).first()
     if(CourseById){
        return res.status(200).json(CourseById)
     }else{
        return res.status(404).json({err:"not found"})
     }
    }catch(err){
      return res.status(500).json(err)
    }
})
faRoute.get("/:departmentid/departments",async(req,res)=>{
    const coursedb=knex("courses")
   
    const {departmentid}=req.params
    try{
     const coursesByDepartment=await coursedb.where("department_id",departmentid).select("*")
     if(coursesByDepartment){
        return res.status(200).json(coursesByDepartment)
     }else{
        return res.status(404).json({err:"not found"})
     }
    }catch(err){
      return res.status(500).json(err)
    }
})
faRoute.get("/:program_id/programs",async(req,res)=>{
    const coursedb=knex("courses")
   
    const {program_id}=req.params
    try{
     const coursesByPrograms=await coursedb.where("program_id",program_id).select("*",
       knex.raw('CASE WHEN semester = 1 THEN "Fall" ELSE "Spring" END as semester')
     )
     if(coursesByPrograms){
        return res.status(200).json(coursesByPrograms)
     }else{
        return res.status(404).json({err:"not found"})
     }
    }catch(err){
      return res.status(500).json(err)
    }
})
faRoute.put("/:courseid",async(req,res)=>{
    
    const {courseid}=req.params
    const {code ,name}=req.body
    try{
     const courseMatch=await knex("courses").whereNot("course_id",Number(courseid)).andWhere(function(){this.where("name",name).orWhere("code",code)}).first()
     console.log(courseMatch,courseid)
      if(!courseMatch){
       
      const affectedRow=await knex("courses").where({course_id:Number(courseid)}).update(req.body)
      
     if(affectedRow>0){
       return res.status(204).json()
     }else{
      return res.status(404).json()
     }
      }else{
        return res.status(409).json()
      }
    }catch(err){
      console.log(err)
      return res.status(500).json(err)
    }
})
faRoute.delete("/:courseid",async(req,res)=>{
    const coursedb=knex("courses")
    const {courseid}=req.params
    try{
     const affectedRow=await coursedb.where({course_id:courseid}).delete()
     if(affectedRow>0){
       return res.status(200).json({success:true})
     }else{
        return res.status(404).json({success:false})
     }
    }catch(err){
      return res.status(500).json(err)
    }
})

faRoute.post("/AssignCoursetoDoctor",async(req,res)=>{
    if(Object.keys(req.body).length>0){  
     try{
      
    
     const [newCourseAssign]=await knex("course_assignments").insert(req.body)
       return res.status(201).json({data:newCourseAssign,success:true})
    
   
    }catch(err){
        console.log(err)
      return res.status(500).json(err.message)
    }
}else{
    return res.status(500).json({err:"no body parameter founded"})
}
})
faRoute.post("/AssignPrerequisitesToCourses",async(req,res)=>{
    if(Object.keys(req.body).length>0){  
     try{
      
    await knex.transaction(async trx=>{
      await trx("prerequisite_courses").insert(req.body.prerequisites_courses)
    })
    return res.status(201).json({success:true})
    
    }catch(err){
        console.log(err)
      return res.status(500).json(err.message)
    }
}else{
    return res.status(500).json({err:"no body parameter founded"})
}
})
faRoute.get("/getPrerequisites/:course_id",async(req,res)=>{
    
   //# course_id, prerequisite_course_id

    const {course_id}=req.params
    try{
     const PrerequisitesByCourse=await knex("courses")
     .join("prerequisite_courses","courses.course_id","=","prerequisite_courses.course_id")
     .join("courses as pre","pre.course_id","=","prerequisite_courses.prerequisite_course_id")
     .select("prerequisite_courses.prerequisite_course_id as pre_id","pre.name as pre_name")
     .where("courses.course_id",course_id)
     if(PrerequisitesByCourse){
        return res.status(200).json(PrerequisitesByCourse)
     }else{
        return res.status(404).json({err:"not found"})
     }
    }catch(err){
      return res.status(500).json(err)
    }
})

faRoute.delete("/deletePrerequest/:courseid/:precourseid",async(req,res)=>{
    const {courseid:course_id,precourseid:prerequisite_course_id}=req.params
try{
     const affectedRow=await knex("prerequisite_courses").where({course_id,prerequisite_course_id}).delete()
     if(affectedRow>0){
       return res.status(200).json({success:true})
     }else{
        return res.status(404).json({success:false})
     }
    }catch(err){
      return res.status(500).json(err)
    }
})

module.exports=faRoute
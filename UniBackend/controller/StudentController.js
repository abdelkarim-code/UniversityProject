const express=require("express")
const studentRoute=express.Router()
const knex=require("../db")
const {faker}=require("@faker-js/faker")


studentRoute.post("/:user_id/users/:department_id/departments/:program_id/programs",async(req,res)=>{
   if(Object.keys(req.body).length>0){
    const {user_id,department_id,program_id}=req.params
     const {student_code}=req.body
  try{
         const studentmatch=await knex("students").where("student_code",student_code).first()
         if(!studentmatch){
           const [newstudent]=await knex("students").insert({user_id,student_code,department_id,program_id})
            return res.status(201).json({data:newstudent,success:true})
         }else{
            let student_code_new=``
            let studentmatch_again=''
            do{
            student_code_new=`${department_id}${new Date().getFullYear()%100}${faker.string.numeric(4)}`
             studentmatch_again=await knex("students").where("student_code",student_code).first()
            }while(studentmatch_again)
            email=`${student_code_new}@students.liu.edu.lb`
            const edituser=await knex("users").where("user_id",user_id).update({email:email})
            if(edituser>0){
               const [newstudent]=await knex("students").insert({user_id,student_code_new,department_id,program_id})
            return res.status(201).json({data:newstudent,success:true})  
            }
            
         }
 
}catch(err){
      return res.status(500).json(err)
    }
}else{
    return res.status(500).json({err:"no body parameter founded"})
}
})
studentRoute.get("/",async(req,res)=>{
   
    try{
     const students=await knex("students").select("*")
    return res.status(200).json(students)
    }catch(err){
      return res.status(500).json(err)
    }
})
studentRoute.put("/:studentid",async(req,res)=>{
    // const {studentid}=req.params
    // const {name}=req.body
    // try{
    //     const studentMatch=await knex("students").where("name",name).whereNot("student_id",Number(studentid)).first()
    //             if(!studentMatch){
    //             const affectedRow=await knex("students").where({student_id:studentid}).update(req.body)
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
studentRoute.delete("/:student_id",async(req,res)=>{
    const {student_id}=req.params
     
    try{
       const affectedRow=await knex("students").where({student_id:student_id}).delete()
     if(affectedRow>0){
       return res.status(200).json({success:true})
     }else{
        return res.status(404).json({success:false})
     }
    
    
    }catch(err){
      return res.status(500).json(err)
    }
})
studentRoute.get("/availableCourses",async(req,res)=>{
   // department_id, , semester, program_id ,level
  

   if(Object.keys(req.body).length>0){
   try{
       const {department_id,  semester, program_id ,level,student_id}=req.body
    if(semester=="Fall"||semester=="Spring"){
      
    }
     const availableCourses=await knex("courses").where(b=>{
       b.where("department_id",department_id)
       .andWhere("semester",semester)
       .andWhere("program_id",program_id)
       .andWhere("level",level)
     }).whereNotIn("course_id",function(){
       this.select("course_id").from("course_registrations")
       .where("student_id",student_id)
       .andWhere("semester",semester)
     })
     return res.status(200).json(availableCourses)  
 
}catch(err){
      return res.status(500).json(err)
    }
}else{
    return res.status(500).json({err:"no body parameter founded"})
}
})
module.exports=studentRoute
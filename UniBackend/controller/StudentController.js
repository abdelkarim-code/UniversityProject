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
studentRoute.get("/:year", async (req, res) => {
  const { year } = req.params; // e.g., /students/2025

  try {
    const students = await knex("students as s")
      .join("users as u", "s.user_id", "u.user_id")
      .join("departments as d", "s.department_id", "d.department_id") 
      .join("programs as p", "s.program_id", "p.program_id") 
      .select(
        "s.student_id",
        "s.student_code",
        "p.name as program_name",
        "s.gpa",
        "s.current_year",
        "u.first_name",
        "u.last_name",
        "u.email",
        "u.phone",
        "u.address",
        "u.gender",
        "u.date_created",
        "d.name as department_name" 
      )
      .whereRaw("YEAR(u.date_created) = ?", [year])
      .orderBy("u.date_created", "desc");

    return res.status(200).json(students);
  } catch (err) {
    return res.status(500).json(err);
  }
});
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
studentRoute.get("/getSections/:course_id/:semester_id/:campus",async(req,res)=>{
   
   

   if(req.params&&Object.keys(req.params).length>0){
      const {course_id,semester_id,campus}=req.params
   try{
      const sections=await knex("course_assignments").where("course_assignments.course_id",course_id)
      .andWhere("course_assignments.semester",semester_id)
      .whereIn("course_assignments.room_id",function(){
         this.select("id").from("rooms").where("campus",campus)
      }).join("rooms","course_assignments.room_id","=","rooms.id")
      .join("doctors","course_assignments.doctor_id","=","doctors.doctor_id")
      .select("doctors.employee_code","course_assignments.schedule_time",
         "rooms.room_number","course_assignments.section","course_assignments.assignment_id")
     
   return res.status(200).json(sections)
    
 
 }catch(err){
      return res.status(500).json(err)
    }
}else{
    return res.status(400).json({err:"no parameter founded"})
}
})




studentRoute.post("/availableCourses",async(req,res)=>{


  if(req.body&&Object.keys(req.body).length>0){
   
   try{
       const {department_id, semester_id, program_id ,level,student_id}=req.body
    
        const availableCourses=await knex("course_assignments")
         .groupBy("course_assignments.course_id")
        .join("courses","course_assignments.course_id","=","courses.course_id")
        .join("rooms","course_assignments.room_id","=","rooms.id")
        .join("departments","courses.department_id","=","departments.department_id")
        .join("faculties","departments.faculty_id","=","faculties.faculty_id")
        .where("course_assignments.semester",semester_id)
        .whereIn("course_assignments.course_id",function(){
               this.select("course_id").from("courses")
               .where("department_id",department_id)
               .andWhere("program_id",program_id)
               .andWhere("level",level)
       }).whereNotIn("course_assignments.course_id",function(){
            this.select("course_id").from("course_registrations")
            .where("student_id",student_id)
            .andWhere("semester",semester_id)
            
      }).select(
         
         "courses.*",
          {department_name:"departments.name"},
         {department_code:"departments.code"},
         {department_des:"departments.description"},
         {faculty_name:"faculties.name"},
          knex.raw("ANY_VALUE(rooms.campus) as campus")
      )
     return res.status(200).json(availableCourses)  
   
    
 
}catch(err){
      return res.status(500).json(err)
    }
}else{
    return res.status(500).json({err:"no body parameter founded"})
}
})
studentRoute.post("/registerCourse/:studentid",async(req,res)=>{
   //#  student_id, course_id, , assignment_id, semester

   if(Object.keys(req.body).length>0){
    const {studentid}=req.params
  try{
      const [register]=await knex("course_registrations").insert({...req.body,student_id:studentid})  
       return res.status(201).json({success:true,id:register})
 
}catch(err){
      return res.status(500).json(err)
    }
}else{
    return res.status(500).json({err:"no body parameter founded"})
}
})
studentRoute.get("/getRegisteredCourses/:studentid/:semesterid",async(req,res)=>{
   //#  student_id, course_id, , assignment_id, semester

   if(Object.keys(req.params).length>0){
    const {studentid,semesterid}=req.params
  try{
      const register=await knex("course_registrations").where("course_registrations.student_id",studentid)
      .andWhere("course_registrations.semester",semesterid)
      .join("courses","course_registrations.course_id","=","courses.course_id")
      .join("course_assignments as relation","course_registrations.assignment_id","=","relation.assignment_id")
      .join("doctors","relation.doctor_id","=","doctors.doctor_id")
      .join("rooms","relation.room_id","=","rooms.id")
      .select("course_registrations.*","courses.name as course_name","doctors.employee_code as doctor_name"
      ,"relation.*","rooms.room_number","courses.code as course_code","courses.credit_hours as credit") 
       return res.status(201).json(register)
 
}catch(err){
      return res.status(500).json(err)
    }
}else{
    return res.status(500).json({err:"no  parameter founded"})
}
})

module.exports=studentRoute
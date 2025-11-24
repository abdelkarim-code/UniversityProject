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

faRoute.post("/AssignCoursetoDoctor/:campus",async(req,res)=>{
    if(Object.keys(req.body).length>0){ 
      const {campus}=req.params 
      const {room_id,schedule_time,semester,course_id,doctor_id,section}=req.body
     try{
      
      knex.transaction(async trx=>{
           const RoomBusy=await trx("course_assignments").where("room_id",room_id)
           .andWhere("schedule_time",schedule_time).andWhere("semester",semester)
           .whereIn("room_id",function(){
            this.select("id").from("rooms").where("campus",campus)
           }).join("rooms","course_assignments.room_id","=","rooms.id").first()
           if(RoomBusy){
            return res.status(409).json({message:`Room ${RoomBusy?.room_number} busy. Change room or schedule.`})
           }
          const SectionUniqueness=await trx("course_assignments").where("course_assignments.semester",semester)
          .andWhere("course_assignments.course_id",course_id).andWhere("course_assignments.section",section)
          .join("courses","course_assignments.course_id","=","courses.course_id").select("courses.name","course_assignments.section").first()
          if(SectionUniqueness){
             return res.status(409).json({message:`Section ${SectionUniqueness?.section} for course ${SectionUniqueness?.name} is taken.`})
          }
          const DoctorAvailability=await trx("course_assignments").where("course_assignments.semester",semester).andWhere("course_assignments.schedule_time",schedule_time)
          .andWhere("course_assignments.doctor_id",doctor_id)
          .join("doctors","course_assignments.doctor_id","=","doctors.doctor_id").select("doctors.employee_code","course_assignments.schedule_time")
          .first()
          if(DoctorAvailability){
            const dr_name=DoctorAvailability?.employee_code.split(".")[0]+" "+DoctorAvailability?.employee_code.split(".")[1]
             return res.status(409).json({message:`Doctor ${dr_name}  is already assigned at ${DoctorAvailability?.schedule_time}` })
          }
       // add logic scheduling
        const [newCourseAssign]=await trx("course_assignments").insert(req.body)
       return res.status(201).json({data:newCourseAssign,success:true})
      })
     
    
   
    }catch(err){
        console.log(err)
      return res.status(500).json(err.message)
    }
}else{
    return res.status(400).json({err:"no body parameter founded"})
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
faRoute.get("/:departmentid/departments/getCoursesTypes",async(req,res)=>{
    const coursedb=knex("courses")
   
    const {departmentid}=req.params
    try{
     const coursesByDepartment=await coursedb.groupBy("course_category").where("department_id",departmentid)
     .select("course_category as type")
     if(coursesByDepartment){
        return res.status(200).json(coursesByDepartment)
     }else{
        return res.status(404).json({err:"not found"})
     }
    }catch(err){
      return res.status(500).json(err)
    }
})
// Get assignments by semester and department
faRoute.get("/getAssignDoctorCoursesByDept/:departmentid/:semesterid", async (req, res) => {
  const { departmentid, semesterid } = req.params;

  if (!departmentid || !semesterid) {
    return res.status(400).json({ err: "Department ID and Semester ID are required" });
  }

  try {
    const assignments = await knex("course_assignments")
      .where("course_assignments.semester", semesterid)
      .join("courses", "course_assignments.course_id", "=", "courses.course_id")
      .join("doctors", "course_assignments.doctor_id", "=", "doctors.doctor_id")
      .join("rooms", "course_assignments.room_id", "=", "rooms.id")
      .where("courses.department_id", departmentid)  
      .select(
        "course_assignments.*",
        "courses.name as course_name",
        "courses.code as course_code",
        "courses.credit_hours as credit",
        "rooms.room_number",
        "doctors.employee_code as doctor_name"
      );

    return res.status(200).json(assignments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err });
  }
});
faRoute.delete("/deleteAssign/:assignid",async(req,res)=>{
    const {assignid:assignment_id}=req.params
try{
     const affectedRow=await knex("course_assignments").where({assignment_id}).delete()
     if(affectedRow>0){
       return res.status(200).json({success:true})
     }else{
        return res.status(404).json({success:false})
     }
    }catch(err){
      return res.status(500).json(err)
    }
})
faRoute.get("/assignment/:assignmentId/registrations", async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const result = await knex("course_registrations as rr")
      .join("students as s", "rr.student_id", "s.student_id")
      .join("users as u", "s.user_id", "u.user_id")
      .join("departments as d","s.department_id","=","d.department_id")
      .select(
       "rr.*",
       "s.*",
       "u.first_name",
       "u.last_name",
       "d.name as department_name",
       "d.code as department_code"
      )
      .where("rr.assignment_id", assignmentId);

   

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports=faRoute
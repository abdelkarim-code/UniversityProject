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
doctorRoute.get("/getAssignDoctorCourses/:doctorid/:semesterid",async(req,res)=>{
   //#  student_id, course_id, , assignment_id, semester

   if(Object.keys(req.params).length>0){
    const {doctorid,semesterid}=req.params
  try{
      const register=await knex("course_assignments").where("course_assignments.doctor_id",doctorid)
      .andWhere("course_assignments.semester",semesterid)
      .join("courses","course_assignments.course_id","=","courses.course_id")
      .join("rooms","course_assignments.room_id","=","rooms.id")
      .select("course_assignments.*","courses.name as course_name"
      ,"rooms.room_number","courses.code as course_code","courses.credit_hours as credit") 
       return res.status(201).json(register)
 
}catch(err){
      return res.status(500).json(err)
    }
}else{
    return res.status(500).json({err:"no  parameter founded"})
}
})
doctorRoute.get("/:year", async (req, res) => {
  const { year } = req.params; // e.g., /doctors/2025

  try {
    const doctors = await knex("doctors as d")
      .join("users as u", "d.user_id", "u.user_id")
      .join("departments as dep", "d.department_id", "dep.department_id")
      .select(
        "d.doctor_id",
        "d.employee_code",
        "d.specialization",
        "d.Active",
        "u.first_name",
        "u.last_name",
        "u.email",
        "u.phone",
        "u.address",
        "u.gender",
        "u.date_created",
        "dep.name as department_name"
      )
      .whereRaw("YEAR(u.date_created) = ?", [year])
      .orderBy("u.date_created", "desc");

    return res.status(200).json(doctors);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports=doctorRoute
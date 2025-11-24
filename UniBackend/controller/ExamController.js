const express=require("express")
const faRoute=express.Router()
const knex=require("../db")

const moment=require("moment")
//end points
faRoute.post("/:courseid/courses/:semesterid/semester", async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "No body parameter found" });
  }

  const { courseid, semesterid } = req.params;
  const { exam_type, date } = req.body;

  try {
    const exams = await knex("exams")
      .where("course_id", courseid)
      .andWhere("semester_id", semesterid)
      .andWhere("date", date)
      .first();
      const examsTaken = await knex("exams")
      .where("course_id", courseid)
      .andWhere("semester_id", semesterid)
      .andWhere("exam_type", exam_type)
      .first();

    if (examsTaken) {
      return res.status(409).json({
        success: false,
        message: `You have already scheduled a ${exam_type} for this course on ${moment(examsTaken?.date).format("DD/MM/YYYY")}.`
      });
    }

    if (!exams) {
      const [examId] = await knex("exams").insert(req.body);
      return res.status(201).json({
        data: { exam_id: examId },
        success: true,
        message: "Exam scheduled successfully."
      });
    } else {
      // Different type already scheduled on same day
      return res.status(409).json({
        success: false,
        message: `Another exam (${exams.exam_type}) is already scheduled for this course on ${date}. You cannot schedule multiple exams for the same course on the same day.`
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err });
  }
});

faRoute.get("/:id",async(req,res)=>{
    const {id}=req.params
    try{
     const examById=await knex("exams").where({exam_id:id}).first()
     if(examById){
        return res.status(200).json(examById)
     }else{
        return res.status(404).json({err:"not found"})
     }
    }catch(err){
      return res.status(500).json(err)
    }
})
faRoute.get("/:semesterid/semester",async(req,res)=>{
   const {semesterid}=req.params
    try{
     const exams=await knex("exams").where("exams.semester_id",semesterid)
     .join("courses","exams.course_id","courses.course_id")
     .select("exams.*","courses.name as course_name","courses.code as course_code")
     
        return res.status(200).json(exams)
    
    }catch(err){
      return res.status(500).json(err)
    }
})
faRoute.put("/:id",async(req,res)=>{
    const {id}=req.params
    const {course_id,semester_id,date,exam_type}=req.body
    try{
      const exams=await knex("exams").where("course_id",course_id)
     .andWhere("exam_type",exam_type).andWhere("semester_id",semester_id).andWhere("date",date).whereNot({exam_id:id}).first()
      
      if(!exams){
      const affectedRow=await knex("exams").where({exam_id:id}).update(req.body)
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
     const affectedRow=await knex("exams").where({exam_id:id}).delete()
     if(affectedRow>0){
       return res.status(200).json({success:true})
     }else{
        return res.status(200).json({success:false})
     }
    
   
    
    
    }catch(err){
      return res.status(500).json(err)
    }
})
faRoute.put("/:id/publish",async(req,res)=>{
    const {id}=req.params
    
    try{
    const affectedRow=await knex("exams").where({exam_id:id}).update("publish_exam",true)
     if(affectedRow>0){
        return res.status(204).json()
     }else{
        return res.status(404).json()
     }

      
    }catch(err){
      return res.status(500).json(err)
    }
})
faRoute.get("/:semesterid/semester/published",async(req,res)=>{
   const {semesterid}=req.params
    try{
     const exams=await knex("exams").where("exams.semester_id",semesterid).where("publish_exam",true)
     .join("courses","exams.course_id","courses.course_id")
     .select("exams.*","courses.name as course_name","courses.code as course_code")
     
        return res.status(200).json(exams)
    
    }catch(err){
      return res.status(500).json(err)
    }
})
module.exports=faRoute
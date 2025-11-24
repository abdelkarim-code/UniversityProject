const express=require("express")
const deRoute=express.Router()
const knex=require("../db")
//end points
deRoute.post("/",async(req,res)=>{
    //# semester_id, name, academic_year, start_date, end_date, status

  if(Object.keys(req.body).length>0){
     const {name,academic_year}=req.body
    
     try{
      const ActiveSemester=await knex("semester").where("status","upcoming").orWhere("status","active").select("*")
     const semesterMatch=await knex("semester").where("name",name).andWhere("academic_year",academic_year).first()
    
    if(!semesterMatch&&ActiveSemester.length==0)
    {
     const [newSemester]=await knex("semester").insert(req.body)
       return res.status(201).json({data:newSemester,success:true})
    }  else{
         return res.status(409).json({success:false,message:"Cannot add semester: duplicate or existing active/upcoming semester."})
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
     const semester=await knex("semester").select("*")
     
        return res.status(200).json(semester)
    
    }catch(err){
      return res.status(500).json(err)
    }
})
deRoute.get("/currentSemester",async(req,res)=>{
  
    try{
     const semester=await knex("semester").whereNot("status","closed").first()
     
        return res.status(200).json(semester)
    
    }catch(err){
      return res.status(500).json(err)
    }
})

deRoute.put("/:semesterid",async(req,res)=>{
    const {semesterid}=req.params
    const {name,academic_year}=req.body
    try{
         const semesterMatch=await knex("semester").where("name",name).andWhere("academic_year",academic_year).whereNot("semester_id",semesterid).first()
                if(!semesterMatch){
                const affectedRow=await knex("semester").where({semester_id:semesterid}).update(req.body)
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
deRoute.delete("/:semesterid",async(req,res)=>{
    const {semesterid}=req.params
     
    try{
       const affectedRow=await knex("semester").where({semester_id:semesterid}).delete()
     if(affectedRow>0){
       return res.status(200).json({success:true})
     }else{
        return res.status(404).json({success:false})
     }
    
    
    }catch(err){
      return res.status(500).json(err)
    }
})

deRoute.put("/:id/activate", async (req, res) => {
  const { id } = req.params;

  try {
    // Update the semester status to 'active'
    const updated = await knex("semester")
      .where({ semester_id: id })
      .update({ status: "active" });

    if (updated > 0) {
      return res.status(200).json({ success: true, message: "Semester is now active" });
    } else {
      return res.status(404).json({ success: false, message: "Semester not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});
module.exports=deRoute
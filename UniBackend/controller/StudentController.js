const express=require("express")
const studentRoute=express.Router()
const knex=require("../db")
const {faker, de}=require("@faker-js/faker")
const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() });
const xlsx = require('xlsx');
//student shema for validation in excel file upload
const cities = [
  "Beirut",
  "Tripoli",
  "Sidon",
  "Tyre",
  "Zahle",
  "Byblos",
  "Baalbek",
  "Jounieh",
];
const Joi = require('joi');
const studentSchema = Joi.object({
  first_name: Joi.string().pattern(/^[A-Za-z]+$/).required(),
  last_name: Joi.string().pattern(/^[A-Za-z]+$/).required(),
  phone: Joi.string().pattern(/^[0-9]{6,15}$/).required(),
  address: Joi.string().valid(...cities).required(), // spread the array
  gender: Joi.string().valid("Male", "Female").required(),
  department_code: Joi.string().required(),
  program_name: Joi.string().required()
});
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
//test endpoint to get all students
studentRoute.get("/",async(req,res)=>{
   

     const students=await knex("students").select("*")
     return res.status(200).json(students)
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
studentRoute.post("/uploadStudents",upload.single("file"),async(req,res)=>{
  try{
  
     if(!req.file) return res.status(400).json({err:"No file uploaded"}) 
    
    const fileBuffer = req.file.buffer //file content in buffer
    //read buffer using xlsx
    const workbook=xlsx.read(fileBuffer)
  let students = workbook.SheetNames
     .map(sheetName => xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" }))
     .flat();

      //check if excel is empty
   if (students.length===0) return res.status(400).json({err:"Excel file is empty"})
  //ensure all keys are in lowercase and trimmed
    students = students.map(student =>
  Object.fromEntries(
    Object.entries(student).map(([k, v]) => [k.toLowerCase().trim(), v.toString()])
  )
);
    //validare Required Keys 
        let requiredKeys = ["first_name", "last_name", "phone", "address", "gender", "department_code", "program_name"];
    for (const sheetName of workbook.SheetNames) {
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
      if(sheetData.length === 0) continue
      if(!requiredKeys.every(key=>key in sheetData[0])){
        return res.status(400).json({err:`Missing required keys in sheet ${sheetName}`})
      }
    }
    const departments=new Set()
    const programs=new Set()
    
    for(let student of students){ 
      departments.add(student.department_code?.toLowerCase().trim())
      programs.add(student.program_name?.toLowerCase().trim())
    }
    
    //validate data using Joi
     const { error } = Joi.array().items(studentSchema).validate(students, { abortEarly: false });

      if (error) {
        const errors = error.details.map(d => ({
                row: d.path[0] + 2,       // Excel row number (index + 1)
                field: d.path[1],          // field name
                message: d.message         // human-readable message
              }));
        return res.status(422).json({ err: errors});
      }
    //check departments and programs from excel if not exist in db to trace errors early
    const existingDepartments=await knex("departments").whereIn(knex.raw("LOWER(TRIM(code))"),Array.from(departments))
    const existingPrograms=await knex("programs").whereIn(knex.raw("LOWER(TRIM(name))"),Array.from(programs))
     if (existingDepartments.length !== departments.size)
          return res.status(400).json({
                err: "Some departments from the Excel file do not exist in the database. Please check your department names."
          });

          if (existingPrograms.length !== programs.size)
         return res.status(400).json({
                err: "Some programs from the Excel file are missing in the database. Please verify the program names."
          });
    //create maps for quick lookup
    const departmentMap=new Map()
    existingDepartments.forEach(dept=>{
      if(dept.code){
        departmentMap.set(dept.code,dept.department_id)
      }
    })
      const programMap=new Map()
    existingPrograms.forEach(prg=>{
      if(prg.name){
        programMap.set(prg.name,prg.program_id)
      }
    })
  
    //check each program is under the correct department in each student record
    for(let student of students){
      const dept_id=existingPrograms.find(pr=>pr?.name==student.program_name)?.department_id
      const student_dept_id=departmentMap.get(student?.department_code.toUpperCase())
      
      if(dept_id!=student_dept_id){
        return res.status(400).json({err:`Program ${student.program_name} is not under Department ${student.department_code.toUpperCase()}`})
      }

    }
    
    //all validation passed proceed to insert
    await knex.transaction(async(trx)=>{

       let chunksize=20
      for(let i=0;i<students.length;i+=chunksize){ 

        const chunk=students.slice(i,i+chunksize)
         //ensure student_code uniqueness
        let student_codes=chunk.map(({department_code}) =>`${departmentMap.get(department_code.toUpperCase())}${new Date().getFullYear()%100}${faker.string.numeric(4)}`)
        let uniqueCodes=new Set(student_codes)
        let existingCodes=await trx("students").whereIn("student_code",Array.from(uniqueCodes))
        while(existingCodes.length>0||uniqueCodes.size<chunk.length){
          //regenerate codes until unique
          student_codes=chunk.map(({department_code}) =>`${departmentMap.get(department_code.toUpperCase())}${new Date().getFullYear()%100}${faker.string.numeric(4)}`)
          uniqueCodes=new Set(student_codes)
          existingCodes=await trx("students").whereIn("student_code",Array.from(uniqueCodes))
        }
        uniqueCodes=Array.from(uniqueCodes)


        
        //all unique now proceed to create users and students
        const inserted_student=chunk.map((student,i)=>{
         let email=`${uniqueCodes[i]}@students.liu.edu.lb`
            let password_hash=faker.string.alpha(8);
          
            return {first_name:student?.first_name,
                    last_name:student?.last_name,
                    email,password_hash,
                    phone:student?.phone,
                    address:student?.address,
                    gender:student?.gender,
                    role:3
                    
            }
        })
        const lowerProgramMap=new Map()
         programMap.forEach((value,key)=>{
          lowerProgramMap.set(key.toLowerCase().trim(),value)
         })
        
        const [insertedUsers]=await trx("users").insert(inserted_student)
        const users_ids=inserted_student.map((_,index)=>insertedUsers+index)
       
        const studentsToInsert=chunk.map((student,i)=>{
          
         
          return {
            user_id:users_ids[i],
            student_code:uniqueCodes[i],
            department_id:departmentMap.get(student?.department_code.toUpperCase()),
            program_id:lowerProgramMap.get(student?.program_name.toLowerCase().trim())
          }
        }) 
        
        if(studentsToInsert.length>0)
        await trx("students").insert(studentsToInsert)

      }
    }).then(()=>{
        return res.status(200).json({
         message: `Excel file processed successfully. ${students.length} students added to the database.`
      });
    }).catch((err)=>{
      console.log(err.message)
         return res.status(500).json({err:err.message||"Transaction failed"})
    })
     

      }catch(err){
        console.log(err.message)
        return res.status(500).json({err:err.message||"File processing failed"})
      }


})

module.exports=studentRoute
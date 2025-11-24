const express=require("express")
const roomRoute=express.Router()
const knex=require("../db")
roomRoute.post("/",async (req,res)=>{
 let chunks=[]
try{
     const {campus,blocks}=req.body
     for(let block of blocks){
       
        for(let floor of block.floors){
            const checkroom=await knex("rooms").where({block:block.block,floor:floor.floor,campus:campus}).first()
           
            if(checkroom){
                return res.status(409).json({message:"duplicated rooms deteted",duplicated:checkroom})
            }
        }
     }
     
  await knex.transaction(async trx=>{
    
    //loop for each block
    for(let i=0;i<blocks.length;i++){
      
       //loop for each floor in  each block
      for(let j=0;j<blocks[i].floors.length;j++){
        let startroom=blocks[i].floors[j].startRoom
        let endroom=blocks[i].floors[j].endRoom
          //loop to generate rooms_number for each floor
          for(let k=startroom;k<=endroom;k++){
           chunks.push({
            room_number:`${k}-${blocks[i].block}`,
            block:blocks[i].block,
            floor:blocks[i].floors[j].floor,
            campus:campus
           })
           
          }
         
          //add chunks room_numbers to db 
          await trx("rooms").insert(chunks)
          chunks=[]

      }
    }
   
  })
  return res.status(201).json({success:true})

 }catch(err){
  return res.status(500).json({error:err,success:false})
 }

})
roomRoute.get("/",async(req,res)=>{
  try{
   const rooms=await knex("rooms").select("*").offset(5).limit(5)
   return res.status(200).json(rooms)
  }catch(err){
    return res.status(500).json({err:err.message})
  }
 
})
roomRoute.get("/getCampuses",async(req,res)=>{
  try{
   const rooms=await knex("rooms").select("campus").groupBy("campus")
  return res.status(200).json(rooms)
  }catch(err){
    return res.status(500).json({err:err.message})
  }
 
})
roomRoute.get("/getBlocks/:campus", async (req, res) => {
  try {
    const { campus } = req.params;

    const blocks = await knex("rooms")
      .select(
        "block",
        // Count distinct floors in this block (subquery)
        knex("rooms")
          .countDistinct("floor")
          .whereRaw("rooms.block = r.block")
          .andWhere("campus", campus)
          .as("floor_count"),

        // Count total rooms in the block (subquery)
        knex("rooms")
          .count("*")
          .whereRaw("rooms.block = r.block")
          .andWhere("campus", campus)
          .as("total_rooms")
      )
      .from({ r: "rooms" }) // alias main table
      .where("campus", campus)
      .groupBy("block");

    return res.status(200).json(blocks);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});
roomRoute.get("/getRooms/:block/:campus",async(req,res)=>{
  
  try{
    const{block,campus}=req.params

   const rooms=await knex("rooms").select("*").where("block",block).andWhere("campus",campus)
  return res.status(200).json(rooms)
  }catch(err){
    return res.status(500).json({err:err.message})
  }
 
})
module.exports=roomRoute
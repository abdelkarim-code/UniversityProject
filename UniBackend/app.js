const express=require("express")
const app=express()
const PORT=8000
const https=require("https")
const fs=require("fs")
const cors=require("cors")
const options={
    key:fs.readFileSync("key.pem"),
    cert:fs.readFileSync("cert.pem")
}
//middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://127.0.0.1:8000"],
  credentials: true,
}))
app.use(express.json())
app.use(require("./controller/rootRout"))

//run server
https.createServer(options,app).listen(PORT,()=>{
    console.log(`https server work at port ${PORT}`)
})




const express=require("express")
const app=express()
const PORT=8000
const cookiesParser=require("cookie-parser")
const https=require("https")
const fs=require("fs")
const cors=require("cors")
const options = {
  key: fs.readFileSync('127.0.0.1+1-key.pem'),
  cert: fs.readFileSync('127.0.0.1+1.pem'),
};
//middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))
app.use(cookiesParser())
app.use(express.json())
app.use(require("./controller/rootRout"))

//run server
// https.createServer(options,app).listen(PORT,()=>{
//     console.log(`https server work at port ${PORT}`)
// })
app.listen(PORT,()=>{
  console.log(`http server work at port ${PORT}`)
})



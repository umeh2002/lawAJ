import express, { Application } from "express"
import env from "dotenv"
import { mainApp } from "./mainApp"

env.config()

const app:Application= express()

const port:number =parseInt(process.env.PORT!) 

mainApp(app)
const server =app.listen(port,()=>{
    console.log("")
    console.log("server is listening on port", port)
})

process.on("unhandledRejection",(reason:any)=>{
    console.log("server is having an unhandled rejection")
    console.log(reason)
})

process.on("uncaughtException",(error:any)=>{
    console.log("server is not responding with an uncaught exception")
    console.log(error)

    server.close(()=>{
        process.exit(1)
    })
})
import express, { Request, Response, Application,NextFunction } from "express";
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { errorHandler } from "./errors/errorHandler";
import { HTTP, mainError } from "./errors/mainError";
import auth from "./router/AuthRouter"
import router from "./router/AuthRouter";

export const mainApp =(app:Application)=>{
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
app.use(helmet())
app.use(express.static("public"))
app.use(express.static(`${__dirname}/css`))
app.set("view engine","ejs")

app.get("/",(req,res)=>{
    try {
        return res.status(HTTP.OK).json({
            message:"welcome to law api"
        })
    } catch (error:any) {
        return res.status(HTTP.BAD).json({
            message:"error",
            data:error.message
        })
    }
})

app.all("*", (req : Request, res : Response, next : NextFunction)=>{
    next(
        new mainError({
            name : "Router Error",
            message : "this router path is not correct",
            status : HTTP.BAD,
            success : false,
        })
    )
})

app.use(errorHandler)


app.use("/api", auth)
}
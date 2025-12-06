import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()
const app = express()

const PORT = process.env.PORT || 3001

app.get("/", (req:Request,res:Response) =>{
    res.status(200).json({
        msg:"Server is running"
    })
})

app.listen(PORT, () =>{
    console.log(`Server is listening on port ${PORT}`)
})
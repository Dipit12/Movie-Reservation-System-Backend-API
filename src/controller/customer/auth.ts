import {Request,Response} from 'express'
import {prisma} from "../../../prisma/db"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config()

export const aboutMe = async (req:Request,res:Response) =>{
    try{
        const userId = req.user?.user_id;
        
        if(!userId){
            return res.status(401).json({
                msg:"Unauthorized: No user found in request"
            });
        }
        
        const user = await prisma.user.findUnique({
            where:{
                user_id:userId
            }
        })
        
        if(!user){
            return res.status(404).json({
                msg:"User does not exist"
            });
        }
        
        return res.status(200).json({
            msg:"User data is as follows",
            name: user.name,
            user_id: userId,
            email: user.email,
            role: user.role,
            mobile_num: user.mobile_num
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg:"Internal server error",
            error: err
        })
    }
}

export const customerRegister = async (req:Request,res:Response) =>{
    // create refresh token
    const {name,email,password,mobile_num} = req.body;
    if(!email || !password || !name || !mobile_num){
        return res.status(401).json({
            msg:"Please enter all the credentials"
        })
    }
    try{
        const hash = await Bun.password.hash(password)
        const newUser = await prisma.user.create({
            data:{
                name:name,
                email:email,
                password_hash:hash,
                mobile_num:mobile_num,
                role:"CUSTOMER"
            }
        })
        if(!newUser){
            return res.status(500).json({
                msg:"Error creating the new user"
            })
        }
        const payload = {
            user_id:newUser.user_id,
            email:email,
            role:newUser.role
        }
        
        const secret = process.env.JWT_SECRET
        if(!secret){
            return res.status(500).json({
                msg:"JWT secret not configured"
            })
        }
        const token = jwt.sign(payload,secret, {
            expiresIn:"15m"
        })
        return res.status(200).json({
            msg:"User registered successfully",
            token
        })
        
        
    }catch(err){
        console.log(err)
        return res.status(500).json({
            msg:err
        })
    }
}

export const customerLogin = async(req:Request,res:Response) =>{
    // create access token
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(401).json({
            msg:"Please enter all the credentials"
        })
    }
    // verify the user 
    try{
        const user = await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        
        if(!user){
            return res.status(401).json({
                msg:"Please enter correct credentials"
            })
        }
        
        const user_password = user.password_hash
        const isMatch = await Bun.password.verify(password,user_password)
        
        if(!isMatch){
            return res.status(401).json({
                msg:"Please enter correct credentials"
            })
        }
        
        const payload = {
            user_id:user.user_id,
            email:email,
            role:user.role
        }
        
        const secret = process.env.JWT_SECRET
        if(!secret){
            return res.status(500).json({
                msg:"JWT secret not configured"
            })
        }
        
        const token = jwt.sign(payload,secret, {
            expiresIn:"15m"
        })
        
        return res.status(200).json({
            msg:"User verified successfully",
            token
        })
       
    }catch(err){
        console.log(err)
        return res.status(500).json({
            msg:err
        })
    }
}
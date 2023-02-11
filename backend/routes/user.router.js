const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
require('dotenv').config()
const cookieParser = require('cookie-parser');


const Redis=require('ioredis');
const redis=new Redis({
    port:12565,
    host:'redis-12565.c301.ap-south-1-1.ec2.cloud.redislabs.com',
    password:"rgE5ofgZDJnKcl81YQAxPrei0b8nphdQ",
})


const UserRouter = express.Router()
const { authanticate } = require('../middlewares/athanticate')
const { UserModel } = require('../models/user.model')
const { OtpModel } = require('../models/otp.model')
const {CashModel}=require('../models/cash.modle')

UserRouter.use(cookieParser())

UserRouter.get('/', (req, res) => {
    res.status(201).send({ "msg": "Hello from router" })
})

//signup
UserRouter.post('/signup', async (req, res) => {
    const { email, password,first_name,last_name } = req.body;
   // console.log(email, password ,role)
    bcrypt.hash(password, 6, async function (err, hash) {
        if (err) {
            console.log('ERR: Error from bcrypt')
            res.status(500).send({ 'msg': "Something went wrong" })
        }
        else {
            try {
                let user = new UserModel({ email, password: hash ,first_name,last_name});
                await user.save();
                let otp = Math.floor(Math.random()*10000);
                console.log(otp)
                let new_otp =  new OtpModel({otp})
                await new_otp.save()
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: process.env.email,
                        pass: process.env.password,
                        clientId: process.env.clientId,
                        clientSecret: process.env.clientSecret,
                        refreshToken: process.env.refreshToken
                    }
                });

                const mailConfigurations = {
                    from: 'ankeshkewat966@gmail.com',
                    to:email,
                    subject: `Your verification code is ${otp}`,
                    text: 'Sending Email For verification'
                };

                transporter.sendMail(mailConfigurations, async function (error, info) {
                    if (error) {
                       console.log('ERR: Error from nodemailer')

                        console.log(error)
                        res.status(500).send({"msg":"Something went wrong"})
                    } else {
                       
                        console.log('Email Sent Successfully');
                        res.status(201).send({ "msg": `Otp Sent Successfully`,"email":email})
                    
                    }
                    //console.log(info);
                })
            }
            catch (err) {
                console.log(err);
                res.status(401).send({ "msg": "Something went wrong" })
            }
        }
    })
})

UserRouter.post('/verify',async (req,res)=>{
    let {otp}=req.body;
    console.log(otp)
    try{
         if(!otp){
            return res.status(401).send({"msg":"Please enter otp"})
         }
         let data2=await OtpModel.findOne({otp});
         if(data2&&data2.otp){
           try{
            const {email}=req.body;
            console.log(email)
            let data= await UserModel.findOne({email});
            console.log(data)
            let new_cash=new CashModel({user_id:data._id,cash:0});
            await new_cash.save()
            const token = jwt.sign({ id: data._id,first_name:data.first_name}, process.env.secret, { expiresIn: '5 days' })
            redis.set('token',token)
            console.log(token)
            await OtpModel.findByIdAndDelete(data2._id)
            res.status(201).send({"msg":"Account Created Successfully","token":token,"name":data.first_name})
           }catch(er){
            console.log(er);
            res.status(500).send({"msg":"Something went wrong"})
           }
         }else{
            res.status(401).send({"msg":"Wrong OTP"})
         }

    }
    catch(err){
        console.log(err);
        res.status(401).send({"msg":"Some error"})
    }
})

//login
UserRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user && user.email) {
        try {
            bcrypt.compare(password, user.password, async function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).send({ 'msg': "Something went wrong" })
                }
                else if (result) {
                    const token = jwt.sign({ id: user._id,first_name:user.first_name}, process.env.secret, { expiresIn: '5 days' })
                    // res.cookie('token', token, { httpOnly: true })
                    redis.set('token',token)
                    res.status(201).send({"msg":"Login succesfull","token":token,"name":user.first_name})
                }
                else {
                    res.send({ 'msg': "incorrect password" })
                }
            })
        }
        catch (err) {
            // internal failure
            console.log(err)
            res.status(500).send({ "msg": "Somethng went wrong" })
        }
    }
    else {
        res.status(401).send({ "msg": "Invailid credentials" })
    }
})

//logout
UserRouter.get('/logout', async (req, res) => {
    // const token = req.headers?.authorization?.split(' ')[1] || req.cookies.token
    const token = req.headers.token
   redis.set('blacklist',token)
    res.send({ "msg": "Logout succesfully" })
})
module.exports = { UserRouter,redis }
const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
require('dotenv').config()
const cookieParser = require('cookie-parser');


const Redis = require('ioredis');
const redis = new Redis({
    port: 12565,
    host: 'redis-12565.c301.ap-south-1-1.ec2.cloud.redislabs.com',
    password: "rgE5ofgZDJnKcl81YQAxPrei0b8nphdQ",
})


const UserRouter = express.Router()
const { authanticate } = require('../middlewares/athanticate')
const { UserModel } = require('../models/user.model')
const { OtpModel } = require('../models/otp.model')
const { CashModel } = require('../models/cash.modle')

UserRouter.use(cookieParser())

UserRouter.get('/', (req, res) => {
    res.status(201).send({ "msg": "This is the base api for budget tracking website" })
})

//signup
UserRouter.post('/signup', async (req, res) => {
    const { email, password, first_name, last_name } = req.body;
    // console.log(email, password ,role)
    bcrypt.hash(password, 6, async function (err, hash) {
        if (err) {
            console.log('ERR: Error from bcrypt')
            res.status(500).send({ 'msg': "Something went wrong" })
        }
        else {
            try {
                // let user = new UserModel({ email, password: hash ,first_name,last_name});
                // await user.save();
                const user = { email, first_name, last_name, password: hash }
                const data = JSON.stringify(user)
                await redis.set('user', data)
                let otp = Math.ceil(Math.random() * 10000);
                console.log(otp)
                await redis.set('otp', otp)
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
                    to: email,
                    subject: 'Sending Email For verification in Budget tracking website',
                    text: `Your verification code is ${otp}`
                };

                transporter.sendMail(mailConfigurations, async function (error, info) {
                    if (error) {
                        console.log('ERR: Error from nodemailer')

                        console.log(error)
                        res.status(500).send({ "msg": "Something went wrong" })
                    } else {

                        console.log('Email Sent Successfully');
                        res.status(201).send({ "msg": `Otp Sent Successfully`, "email": email })

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

UserRouter.post('/verify', async (req, res) => {
    let { otp } = req.body;
    console.log(otp)
    try {
        if (!otp) {
            return res.status(401).send({ "msg": "Please enter otp" })
        }
        try {
            redis.get('otp', async (err, success) => {
                if (err) {
                    res.status(401).send({ 'msg': "Something went wrong" })
                } else if(otp==success) {
                    const dataFromRedis = await redis.get('user')
                    const user = JSON.parse(dataFromRedis)
                    const payload = new UserModel(user)
                    await payload.save()
                    const email = user.email
                    const data = await UserModel.findOne({ email })
                    let new_cash = new CashModel({ user_id: data._id, cash: 0 });
                    await new_cash.save()
                    const token = jwt.sign({ id: data._id, first_name: data.first_name }, process.env.secret, { expiresIn: '5 days' })
                    console.log(token)
                    await redis.del('otp')
                    await redis.del('user')
                    await redis.set('token',token)
                    res.status(201).send({ "msg": "Account Created Successfully", "token": token, "name": data.first_name })
                }else{
                    console.log(success)
                    res.status(401).send({ 'msg': "Wrong otp" })

                }
            })
        } catch (er) {
            console.log(er);
            res.status(500).send({ "msg": "Something went wrong" })
        }
    }
    catch (err) {
        console.log(err);
        res.status(401).send({ "msg": "Some error" })
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
                    const token = jwt.sign({ id: user._id, first_name: user.first_name }, process.env.secret, { expiresIn: '5 days' })
                    // res.cookie('token', token, { httpOnly: true })
                    redis.set('token', token)
                    res.status(201).send({ "msg": "Login succesfull", "token": token, "name": user.first_name })
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
    redis.set('blacklist', token)
    res.send({ "msg": "Logout succesfully" })
})


UserRouter.post('/forget',async(req,res)=>{
    try{
        const {email}=req.body;
        const data=await UserModel.findOne({email})
        if(!data) return res.status(401).send({'msg':"Account not  found"})
        else{
                const token=jwt.sign({email},process.env.secret,{expiresIn:"120"})
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
                    to: email,
                    subject: 'Password reset link',
                    text: `https://wondrous-biscuit-d5ba9b.netlify.app/forget?token=${token}`
                };

                transporter.sendMail(mailConfigurations, async function (error, info) {
                    if (error) {
                        console.log('ERR: Error from nodemailer')

                        console.log(error)
                        res.status(500).send({ "msg": "Something went wrong" })
                    } else {

                        console.log('Email Sent Successfully');
                        res.status(201).send({ "msg": `A verification link is sent to your email address` })

                    }
                })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "msg": "Somethng went wrong" })

    }
})

UserRouter.patch('/reset',async(req,res)=>{
    try{
        const {password,c_password,token}=req.body;
        if(password!=c_password) return res.status(401).send({'msg':"Password did not match"});
        else{
            const {email}=jwt.decode(token)
            bcrypt.hash(password,6,async(err,success)=>{
                if (err) {
                    console.log(err);
                    res.status(500).send({ 'msg': "Something went wrong" })
                }else{
                    await UserModel.findOneAndUpdate({email},{$set:{password:success}})
                    res.status(200).json({"msg":"Password updated"})
                }
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send({ "msg": "Somethng went wrong" })

    }
})



module.exports = { UserRouter, redis }
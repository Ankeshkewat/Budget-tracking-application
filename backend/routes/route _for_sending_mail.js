 const express=require('express')
 const MailRouter=express.Router();
 require('dotenv').config()

 const nodemailer=require('nodemailer')

 MailRouter.post('/mail',async(req,res)=>{
    const {name,email,message}=req.body;
    try{
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
            from:email,
            to: 'ankeshkewat966@gmail.com',
            subject: email+"    "+ name,
            text: message
        };

        transporter.sendMail(mailConfigurations, async function (error, info) {
            if (error) {
                console.log(error)
                res.status(500).send({ "msg": "Something went wrong" })
            } else {
                console.log('Email Sent Successfully');
                res.status(201).send({ "msg": `Email Sent Successfully`})

            }
            //console.log(info);
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({"msg":"Some error occur in sending massage"})
    }
 })

 module.exports={MailRouter}
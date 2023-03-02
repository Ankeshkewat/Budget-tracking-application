
const jwt = require('jsonwebtoken')
require('dotenv').config()

const Redis = require('ioredis');
const { send } = require('process');
const redis = new Redis({
   port: 12565,
   host: 'redis-12565.c301.ap-south-1-1.ec2.cloud.redislabs.com',
   password: "rgE5ofgZDJnKcl81YQAxPrei0b8nphdQ",
})

const {UserModel}=require('../models/user.model')

const validate=async(req,res,next)=>{
  let {first_name,last_name, email,password} =req.body;
  if(!first_name||!last_name||!email||!password){
    res.status(401).send({'msg':"Please fill all details"})
  }else if(password.length<8){
    res.status(401).send({'msg':'Please choose strong password'})
  }
  else{
       let data=await UserModel.findOne({email});
       if(data) return res.status(409).send({'msg':"User already exists"});
       next()
  }
}




module.exports = {validate}

const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const ShoppingRouter=express.Router();
const {ShoppingModel}=require('../models/shopping.model');
const { json } = require('express');

//post
ShoppingRouter.post('/shopping',async(req,res)=>{
    try{
        let token=req.body.token;
        const {id}=jwt.decode(token);
        const payload=req.body;
        let data=await new ShoppingModel({user_id:id,list_name:payload})
        await data.save();
        res.status(200).send({"msg":"List created succesfully"})
    }
    catch(err){
        console.log(err);
        res.status(500).send({"msg":"Something went wrong"})
    }
})

//get
ShoppingRouter.get('/shopping',async(req,res)=>{
    try{
        let token=req.body.token;
        const {id}=jwt.decode(token);
        const data=await ShoppingModel.find({user_id:id});
        res.status(200).send({"msg":data})
    }
    catch(err){
        console.log(err);
        res.status(500).send({"msg":"Something went wrong"})
        
    }
})

module.exports={ShoppingRouter}
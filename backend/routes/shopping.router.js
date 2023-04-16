
const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const ShoppingRouter=express.Router();
const {ShoppingModel}=require('../models/shopping.model');
const {CashModel}=require('../models/cash.modle')
const {CashHistoryModel}=require('../models/cash_history')

const { json } = require('express');

//post
ShoppingRouter.post('/shopping',async(req,res)=>{
    try{
        let token=req.headers.token
        let list=req.headers.list;
        const {id}=jwt.decode(token);
        const payload=req.body;
        payload.forEach((el)=>{
            el.user_id=id
        })
        let data=await new ShoppingModel({list_name:payload})
        await data.save();

        const data2=await ShoppingModel.aggregate([
            {$unwind:"$list_name"},
            {$match:{"list_name.user_id":id}},
            {$group:{_id:"$list_name.title",total:{$sum:"$list_name.total"}}}
        ])
        let total;
        data2.forEach((el)=>{
            if(el._id==list){
                total=el.total;
            }
        })
        // console.log(list)
        // console.log(total)
        let data3=await CashModel.findOne({user_id:id})
        let money=data3.cash
        await CashModel.updateOne({user_id:id},{$set:{"cash":money-(+total)}})

        const Cash_history=new CashHistoryModel({cash:-total,user_id:id})
        await Cash_history.save()

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
        let token=req.headers.token;
        const {id}=jwt.decode(token);
        const data=await ShoppingModel.aggregate([
            {$unwind:"$list_name"},
            {$match:{"list_name.user_id":id}},
            {$group:{_id:"$list_name.title",total:{$sum:"$list_name.total"},count:{$sum:1}}}
        ])
        //const data=await ShoppingModel.find({user_id:id});
        res.status(200).send({"msg":data})
    }
    catch(err){
        console.log(err);
        res.status(500).send({"msg":"Something went wrong"})
        
    }
})
//get cat
ShoppingRouter.get('/shopping/cat',async(req,res)=>{
    try{
        let token=req.headers.token;
        const {id}=jwt.decode(token);
        const data=await ShoppingModel.aggregate([
            {$unwind:"$list_name"},
            {$match:{"list_name.user_id":id}},
            {$group:{_id:"$list_name.cat",total:{$sum:"$list_name.total"}}}
        ])
        //const data=await ShoppingModel.find({user_id:id});
        res.status(200).send({"msg":data})
    }
    catch(err){
        console.log(err);
        res.status(500).send({"msg":"Something went wrong"})
        
    }
})

//update cash
ShoppingRouter.patch('/update',async(req,res)=>{
    try{
        let {cash}=req.body;
        let token=req.headers.token;
        const {id}=jwt.decode(token);
        let data=await CashModel.findOne({user_id:id})
        let money=data.cash
        await CashModel.updateOne({user_id:id},{$set:{"cash":money+(+cash)}})
        const Cash_history=new CashHistoryModel({cash:cash,user_id:id})
        await Cash_history.save()
        res.status(200).send({"msg":"Cash updated"})
    }
    catch(err){
        console.log(err)
        res.status(500).send({"msg":"Something went wrong"})
    }
})
//get cash
ShoppingRouter.get('/get/cash',async(req,res)=>{
    try{
        let token=req.headers.token;
        const {id}=jwt.decode(token);
        let data=await CashModel.findOne({user_id:id})
        res.status(200).send({"msg":data})
    }
    catch(err){
        console.log(err)
        res.status(500).send({"msg":"Something went wrong"})
    }
})

// ShoppingRouter.post('/cash/history',async(req,res)=>{
//      const {}=req.body
// })


module.exports={ShoppingRouter}
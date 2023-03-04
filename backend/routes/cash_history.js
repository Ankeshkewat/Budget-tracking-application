const express=require('express');
const jwt=require('jsonwebtoken')

const Cash_historyRouter=express.Router()

const {CashHistoryModel}=require('../models/cash_history')

Cash_historyRouter.get('/get/cash/record',async(req,res)=>{
    try{
        const token=req.headers.token
        const {id}=jwt.decode(token);

        const data=await CashHistoryModel.aggregate([
         {$match:{user_id:id}},
         {$sort:{date:-1}}
        ])
        res.status(200).send({"msg":data})
    }
    catch(err){
        console.log(err)
        res.status(500).send({"msg":"Something wrong"})
    }
})


module.exports={Cash_historyRouter}
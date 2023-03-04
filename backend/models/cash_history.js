const mongoose=require('mongoose');

const Schema=mongoose.Schema({
    user_id:String,
    cash:Number,
    date:{type:String,default:new Date()}
})

const CashHistoryModel=mongoose.model('cash_history',Schema);

module.exports={CashHistoryModel}
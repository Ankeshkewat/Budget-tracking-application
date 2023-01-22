const mongoose=require('mongoose');

const CashModel=mongoose.model('cash',mongoose.Schema({
   user_id:String,
   cash:Number
}))

module.exports={CashModel}
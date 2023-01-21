const mongoose=require('mongoose');

const ShoppingModel=mongoose.model('shopping',mongoose.Schema({
   user_id:String,
   list_name: Array

}))

module.exports={ShoppingModel}
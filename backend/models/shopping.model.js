const mongoose=require('mongoose');

const ShoppingModel=mongoose.model('shopping',mongoose.Schema({

   list_name: Array

}))

module.exports={ShoppingModel}
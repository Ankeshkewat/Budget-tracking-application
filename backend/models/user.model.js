const mongoose=require('mongoose');

const UserModel=mongoose.model('user',mongoose.Schema({
    email:String,
    password:String,
    first_name:String,
    last_name:String

}))

module.exports={UserModel}
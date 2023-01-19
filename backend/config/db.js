const mongoose=require('mongoose');

const connection=mongoose.connect('mongodb+srv://ankesh:ankeshkewat@cluster0.bdtrrli.mongodb.net/Budget?retryWrites=true&w=majority')

module.exports={connection}
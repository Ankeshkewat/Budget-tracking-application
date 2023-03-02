const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const cors = require('cors')
const nodemailer = require('nodemailer')
const { passport } = require('./config/google-Oauth')
const app = express();
app.use(express.json())
app.use(cors({
    origin: '*'
}))

const { connection } = require('./config/db')
const { UserRouter } = require('./routes/user.router')
const {ShoppingRouter}=require('./routes/shopping.router')
const {MailRouter}=require('./routes/route _for_sending_mail')

const {validate}=require('./middlewares/athanticate')


app.get('/', UserRouter)
app.post('/signup',validate, UserRouter)
app.post('/login', UserRouter)
app.post('/verify', UserRouter)
app.post('/shopping',ShoppingRouter)
app.get('/shopping',ShoppingRouter)
app.get('/shopping/cat',ShoppingRouter)
app.patch('/update',ShoppingRouter)
app.get('/get/cash',ShoppingRouter)
app.post('/mail',MailRouter)

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login',session:false}),
  function(req, res) {
    const token = jwt.sign({ id: req.user._id, first_name: req.user.first_name }, process.env.secret, { expiresIn: '5 days' })
   res.cookie('token',token,{
    httpOnly:true
   })
    res.status(201).send({'msg':'Login succesfull','token':token})
});

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log(`listening in port ${process.env.port}`)
    }
    catch (err) {
        console.log(err)
    }
})
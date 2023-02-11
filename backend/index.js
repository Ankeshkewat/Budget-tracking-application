const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const cors = require('cors')
const nodemailer = require('nodemailer')
const { passport } = require('./config/google-Outh')
const app = express();
app.use(express.json())
app.use(cors({
    origin: '*'
}))

const { connection } = require('./config/db')
const { UserRouter } = require('./routes/user.router')
const {ShoppingRouter}=require('./routes/shopping.router')

const {authanticate,authanticate_login}=require('./middlewares/athanticate')


app.get('/', UserRouter)
app.post('/signup', UserRouter)
app.post('/login',authanticate_login, UserRouter)
app.post('/verify', UserRouter)
app.get('/logout',authanticate, UserRouter)
app.post('/shopping',authanticate,ShoppingRouter)
app.get('/shopping',authanticate,ShoppingRouter)
app.get('/shopping/cat',authanticate,ShoppingRouter)
app.patch('/update',authanticate,ShoppingRouter)
app.get('/get/cash',authanticate,ShoppingRouter)

app.get('/oauth/google', (req, res) => {
    res.send("sending email")
})

const client_ID = '87e053df6289c096000c'
const client_secret = 'b255abe7d69b7586d9adbe343614c6744b5aae8c'

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.get('/login/github', (req, res) => {
    // res.sendFile(__dirname+'/frontend'+'/SignUp.html')
    // res.sendFile(__dirname / +"frontend/index.html")
    res.redirect('http://127.0.0.1:5500/frontend/index.html')

})

app.get('/auth/github', async (req, res) => {
    const { code } = req.query
    console.log(code)
    const accessToken = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            client_id: client_ID,
            client_secret: client_secret,
            code
        })
    })
    let data = await accessToken.json();
    console.log(data);
    const userDetails = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${data.access_token}`
        }
    })
    const data2 = await userDetails.json();
    console.log(data2)
    // res.sendFile(__dirname + "/frontend/index.html")
    res.redirect('http://127.0.0.1:5500/frontend/index.html')
    // res.send({ "data": data2 })

})

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    function (req, res) {
        // Successful authentication, redirect home.
        console.log(req._json)
        // res.send({ "msg": "login successful" })
        res.redirect('http://127.0.0.1:5500/frontend/index.html')
        // res.sendFile('/')
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
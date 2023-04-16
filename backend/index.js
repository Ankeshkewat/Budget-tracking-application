const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const cors = require('cors')
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')

const os=require('os');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();

app.use(express.json())
app.use(cors({
    origin: '*'
}))

const { connection } = require('./config/db')
const { passport } = require('./config/google-Oauth')


const { UserRouter } = require('./routes/user.router')
const { ShoppingRouter } = require('./routes/shopping.router')
const { MailRouter } = require('./routes/route _for_sending_mail')
const {Cash_historyRouter}=require('./routes/cash_history')

const { CashModel } = require('./models/cash.modle')
const { UserModel } = require('./models/user.model')

const { validate } = require('./middlewares/athanticate')
const {authanticate}=require('./middlewares/athanticate')


app.get('/', UserRouter)
app.post('/signup', validate, UserRouter)
app.post('/login', UserRouter)
app.post('/verify', UserRouter)
app.post('/forget',UserRouter)
app.patch('/reset',UserRouter)

app.post('/shopping',authanticate, ShoppingRouter)
app.get('/shopping',authanticate, ShoppingRouter)
app.get('/shopping/cat',authanticate, ShoppingRouter)
app.patch('/update',authanticate, ShoppingRouter)
app.get('/get/cash',authanticate, ShoppingRouter)
app.post('/mail', MailRouter)//this endpoint is for my personal use nothing related to this project
app.get('/get/cash/record',authanticate,Cash_historyRouter)

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    function (req, res) {
        const token = jwt.sign({ id: req.user._id, first_name: req.user.first_name }, process.env.secret, { expiresIn: '5 days' })
        res.redirect(`https://wondrous-biscuit-d5ba9b.netlify.app/signup?token=${token}&name=${req.user.first_name}`)
    });




app.get('/login/github', (req, res) => {
    res.sendFile('https://wondrous-biscuit-d5ba9b.netlify.app/signup.html')
})

app.get('/auth/github', async (req, res) => {

    const { code } = req.query
    const accessToken = await fetch('https://github.com/login/oauth/access_token', {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            Accept: 'application/json'
        },
        body: JSON.stringify({
            client_id: process.env.github_client_id,
            client_secret: process.env.github_client_secret,
            code
        })
    }).then((msg) => msg.json())

    const userDetals = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${accessToken.access_token}`,
        }
    }).then((msg) => msg.json()).catch((err) => res.send({ 'msg': err }))


    const email = userDetals.login
    const isAlreadyExist = await UserModel.findOne({ email })

    if (isAlreadyExist) {
        const token = jwt.sign({ id: isAlreadyExist._id, first_name: isAlreadyExist.first_name }, process.env.secret, { expiresIn: '5 days' })
        return res.redirect(`https://wondrous-biscuit-d5ba9b.netlify.app/signup?token=${token}&name=${isAlreadyExist.first_name}`)
    }
    let name = userDetals.name
    name = name.split(' ');
    const first_name = name[0];
    const last_name = name[1];
    const password = uuidv4()
    const new_user = { email, first_name, last_name, password }

    const user = new UserModel(new_user)
    await user.save()
    console.log(user._id)
    let new_cash = new CashModel({ user_id: user._id, cash: 0 });
    await new_cash.save()
    const token = jwt.sign({ id: user._id, first_name: user.first_name }, process.env.secret, { expiresIn: '5 days' })
    return res.redirect(`https://wondrous-biscuit-d5ba9b.netlify.app/signup?token=${token}&name=${user.first_name}`)
    
})

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log(`listening in port ${process.env.port}`)
    }
    catch (err) {
        console.log(err)
    }
})
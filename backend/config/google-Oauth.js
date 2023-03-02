require('dotenv').config()
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')
const { v4: uuidv4 } = require('uuid');


const {UserModel}=require('../models/user.model')
const {CashModel}=require('../models/cash.modle')

passport.use(new GoogleStrategy({
    clientID: process.env.clientId,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:1600/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, cb) {
        const email = profile._json.email
        const isAlreadyExist = await UserModel.findOne({ email })
        console.log(profile)

        if (isAlreadyExist) {
            return cb(null, isAlreadyExist)
        }
        const first_name = profile._json.given_name
        const last_name = profile._json.family_name
        const password = uuidv4()

        const user = new UserModel({ first_name,last_name, email, password })
        await user.save()
        let new_cash = new CashModel({ user_id: user._id, cash: 0 });
        await new_cash.save()
        return cb(null, user);

    }
));

module.exports = { passport }
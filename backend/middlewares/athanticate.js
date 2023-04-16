
const jwt = require('jsonwebtoken')
require('dotenv').config()

const Redis = require('ioredis');
const { send } = require('process');
const redis = new Redis({
  port: 12565,
  host: 'redis-12565.c301.ap-south-1-1.ec2.cloud.redislabs.com',
  password: "rgE5ofgZDJnKcl81YQAxPrei0b8nphdQ",
})

const { UserModel } = require('../models/user.model');
const { compareSync } = require('bcrypt');

const validate = async (req, res, next) => {
  let { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password) {
    res.status(401).send({ 'msg': "Please fill all details" })
  } else if (password.length < 8) {
    res.status(401).send({ 'msg': 'Please choose strong password' })
  }
  else {
    let data = await UserModel.findOne({ email });
    if (data) return res.status(409).send({ 'msg': "User already exists" });
    next()
  }
}

const authanticate = async(req, res, next) => {
  try {
    const token = req.headers.token
    jwt.verify(token, process.env.secret, (err, decode) => {
      if (err) {
        console.log(err);
        res.status(401).send({ "msg": "Token expired please login again" })
      }else{
        next()
      }
    })
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ "msg": "Something went wrong" })
  }
}


module.exports = { validate ,authanticate}
const User = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config')

const tokenForUser = (user) => {
  const timestamp = new Date().getTime()
  return jwt.encode({sub: user.login, iat: timestamp}, config.secret)
}

exports.signin = (req, res, next) => res.send({ token: tokenForUser(req.user) })

exports.signup = (req, res, next) => {
  const login = req.body.login
  const password = req.body.password

  if (!login || !password) {
  	return res.status(422).send({error: "You must provide login and password"})
  }

  User.findOne({where: {login}}).then(existingUser => {
  	if (existingUser) {
  	  return res.status(422).send({error: 'Login is in use'})
  	}

  	User.create({login,password})
      .then(user => res.json({token: tokenForUser(user)}))
      .catch(e => next(err))
    })	
}
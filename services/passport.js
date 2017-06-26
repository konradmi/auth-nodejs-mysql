const passport = require('passport')
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')

const localOptions = {usernameField: 'login' }

const localLogin = new LocalStrategy(localOptions, (login, password, done) => {
  User.findOne({where: {login}}).then(user => {
    if (!user) return done(null, false)

    user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err)
      if (!isMatch) return done(null, false)
      return done(null, user)
    })
  }).catch(e => done(err))
})

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
}

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub)
    .then(user => user ? done(null, user) : done(null, false))
    .catch(e => done(err, false))
})

passport.use(jwtLogin)
passport.use(localLogin)
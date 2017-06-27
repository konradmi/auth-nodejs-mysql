const Authentication = require('./controllers/authentication')
const passportStrategies = require('./services/passport')
const passport = require('passport')

passport.use(passportStrategies.jwt)
passport.use(passportStrategies.local)

const requireAuth = passport.authenticate('jwt', { session : false })
const requireSignin = passport.authenticate('local', { session : false })

module.exports = (app) => {
  
  app.get('/', requireAuth, (req, res) => res.send({hi: 'there'}))
  app.post('/signup', Authentication.signup)
  app.post('/signin', requireSignin, Authentication.signin)
  app.get('/health', (req, res) => res.send('I\'m aliveeee !'))

  app.post('/sms', (req, res) => {
    const run = smsParser(req.body.message)
    console.log('id: ', run.id)
    console.log('time: ', run.time)
    res.status(200).send({events: []})
  })
}
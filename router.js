const Authentication = require('./controllers/authentication')
const passportService = require('./services/passport')
const smsParser = require('./services/smsParser')
const passport = require('passport')

const requireAuth = passport.authenticate('jwt', { session : false })
const requireSignin = passport.authenticate('local', { session : false })

module.exports = (app) => {
  app.get('/', requireAuth, (req, res) => {
  	res.send({hi: 'there'})
  })
  
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
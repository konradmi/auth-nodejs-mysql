const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const router = require('./router')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))

router(app)

app.listen(process.env.PORT || 4000, () => console.log('Listening....'))

import path from 'path'
// const express = require('express')
import express from 'express'
// const dotenv = require('dotenv')
import * as dotenv from 'dotenv'
// const morgan = require('morgan')
import morgan from 'morgan'
// const exphbs = require('express-handlebars')
import {create} from 'express-handlebars'
import passport from 'passport'
import session from 'express-session'
// const connectDB = require('./config/db')
import connectDB from './config/db.js'

// Router
import AuthRoutes from './routes/index.js'

// Load config
dotenv.config({path: './config/config.env'})

// Passport config
// require('./config/passport')(passport)

connectDB()

const app = express()

// Logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars
// app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
// app.set('view engine', '.hbs')
const hbs = create({defaultLayout: 'main', extname: 'hbs'})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
// app.set('views', './views')

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  }))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('public'))

// Routes
// app.use('/', require('./routes/index'))
app.use(AuthRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
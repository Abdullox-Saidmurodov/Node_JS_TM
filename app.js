import path from 'path'
// const express = require('express')
import express from 'express'
import mongoose from 'mongoose'
// const dotenv = require('dotenv')
import * as dotenv from 'dotenv'
// const morgan = require('morgan')
import morgan from 'morgan'
// const exphbs = require('express-handlebars')
import {create} from 'express-handlebars'
import methodOverride from 'method-override'
import passport from 'passport'
import session from 'express-session'
import MongoStore from 'connect-mongo'
// const connectDB = require('./config/db')
import connectDB from './config/db.js'

// Router
import IndexRoutes from './routes/index.js'
import AuthRoutes from './routes/auth.js'
import StoriesRoutes from './routes/stories.js'

// Load config
dotenv.config({path: './config/config.env'})

// // Passport config
// require('./config/passport')(passport)
import passportConfig from './config/passport.js'
passportConfig(passport)

connectDB()

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// Logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars Helpers
import fDate from './helpers/hbs.js'
const {formatDate, stripTags, truncate, editIcon, select} = fDate

// Handlebars
// app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
// app.set('view engine', '.hbs')
const hbs = create({
                      helpers: {
                        formatDate,
                        stripTags,
                        truncate,
                        editIcon,
                        select,
                      }, 
                      defaultLayout: 'main', 
                      extname: 'hbs'
                    })
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
// app.set('views', './views')

// console.log(mongoose.connection)
// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    // store: new MongoStore({ mongoseConnection: mongoose.connection }),
    // store: MongoStore.create({
    //   clientPromise: mongoose.connection, // Promise sifatida MongoClient obyektini bering
    // }),
    store: MongoStore.create({
      mongoUrl: mongoose.connection._connectionString, // Mongoose ulanish manzili
    }),
  }))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use(function(req, res, next) {
  res.locals.user = req.user || null
  next()
})

// Static folder
// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('public'))

// Routes
// app.use('/', require('./routes/index'))
app.use('/', IndexRoutes)
app.use('/auth', AuthRoutes)
app.use('/stories', StoriesRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
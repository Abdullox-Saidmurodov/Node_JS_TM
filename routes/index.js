// const express = require('express')
// const router = express.Router()

// import express from 'express'
// const router = express.Router()

// import {Router} from 'express'
import express from 'express'
import auth  from '../middleware/auth.js'
const { ensureAuth, ensureGuest } = auth
import Story from '../models/Story.js'

// const router = Router()
const router = express.Router()

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    // res.send('Login')
    res.render('Login', {
        layout: 'login',
    })
})

// @desc    Login/Landing page
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    // res.send('Dashboard')
    // console.log(req.user)
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (err) {
        console.error(err)
        res.error('error/500')
    }
})

// module.exports = router
export default router
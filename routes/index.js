// const express = require('express')
// const router = express.Router()

// import express from 'express'
// const router = express.Router()

import {Router} from 'express'

const router = Router()

// @desc    Login/Landing page
// @route   GET /
router.get('/', (req, res) => {
    // res.send('Login')
    res.render('Login', {
        layout: 'login',
    })
})

// @desc    Login/Landing page
// @route   GET /dashboard
router.get('/dashboard', (req, res) => {
    // res.send('Dashboard')
    res.render('dashboard')
})

// module.exports = router
export default router
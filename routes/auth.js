import {Router} from 'express'
// import express from 'express'
import passport from 'passport'

const router = Router()
// const router = express.Router()

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/dashboard')
})

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
    // req.logout()
    // res.redirect('/')
    req.logout(function(err) {
        if (err) {
            console.error(err);
            return next(err); // Xatoni boshqarish
        }
        res.redirect('/'); // Muvaffaqiyatli chiqish
    })
})

export default router
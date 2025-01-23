import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import {Strategy} from 'passport-google-oauth20'
import mongoose from 'mongoose'
import User from '../models/User.js'


// // Load config
// dotenv.config({path: './config/config.env'})


export default function(passport) {
    passport.use(new GoogleStrategy.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
        }
        // console.log(newUser)

        try {
            let user = await User.findOne({ googleId: profile.id })
            // console.log(user)

            if(user) {
                // console.log(user + "++++++")
                done(null, user)
            } else {
                // console.log(user + "------")
                user = await User.create(newUser)
                done(null, user)
            }
        } catch (err) {
            console.error(err)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        // User.findById(id, (err, user) => done(err, user))
        try {
            const user = await User.findById(id); // findById endi Promise qaytaradi
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    })
}
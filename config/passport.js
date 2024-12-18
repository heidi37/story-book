// Create Our Google "Strategy" - authenticates users using a Google account and OAuth 2.0 tokens.

const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

//passport being passed in from app.js
module.exports = function (passport) {
  //create Google Strategy
  passport.use(
    new GoogleStrategy(
      // the client ID and secret obtained when creating an application are supplied as options when creating the Strategy
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      // verify callback, receives the access token and optional refresh token, as well as profile which contains the authenticated user's Google profile
      //done is the callback to run when we are done retrieving the user profile  the user
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value
        }
        try{
          let user = await User.findOne({ googleId: profile.id })

          if(user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch(err) {
          console.error(err)
        }

      }
    )
  )
  // after the login request, if authentication succeeds, a session will be established and maintained via a cookie set in the users browser
  // subsequent requests will not contain credentials but the cookie that identifies the session
  // in order to support login sessions, Passport will serialize and deserialize user instances to and from the session
  //only the user ID is serialized to the sessio
  passport.serializeUser((user, done) => done(null, user.id))

  passport.deserializeUser((id, done) => {
    //Find the user by Id and pass it to the `done` callback
    // OLD WAY - User.findById(id, (err, user) => done(err, user))
    User.findById(id)
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}

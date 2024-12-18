const express = require('express')
const passport = require('passport')
const router = express.Router()

// @desc    Auth with Google
// @route   GET /auth/google
// to authenticate we are using our Google Strategy that we created in our passport.js file
// get the scope of whatever is included in the profile
router.get('/google', passport.authenticate('google', { scope: ['profile']}))

// @desc  Google auth callback
// @route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/'}), (req, res) => {
  //if successful redirect to dashboard
  res.redirect('/dashboard')
})

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err) //passes the error to Express error handler
    }
    res.redirect('/')
  })
})

module.exports = router

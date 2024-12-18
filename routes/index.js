const express = require("express")
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const Story = require("../models/Story")

// @desc  Login/Landing page
// @route GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("Login", {
    layout: "login",
  })
})

// @desc  Dashboard page
// @route GET /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    // in order to pass in data to a Handlebars template you need to call .lean(), returns plain jS objects not Mongoose documents
    const stories = await Story.find({ user: req.user.id }).lean()
    res.render("dashboard", {
      name: req.user.firstName,
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router

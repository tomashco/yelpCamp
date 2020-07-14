const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const middleware = require('../middleware')

// INDEX
router.get('/', (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds })
    }
  })
})

// NEW
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new')
})

// CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
  const { name } = req.body
  const { price } = req.body
  const { image } = req.body
  const desc = req.body.description
  const author = {
    id: req.user._id,
    username: req.user.username,
  }
  const newCampground = { name, price, image, description: desc, author }
  // campgrounds.push(newCampground);
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/campgrounds')
    }
  })
})

// SHOW
router.get('/:id', (req, res) => {
  // find the campground with provided id
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err)
      } else {
        // render show template with that campground
        res.render('campgrounds/show', { campground: foundCampground })
      }
    })
})

// EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render('campgrounds/edit', { campground: foundCampground })
  })
})

// UPDATE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updatedCampground) => {
      if (err) {
        res.redirect('/campgrounds')
      } else {
        res.redirect(`/campgrounds/${req.params.id}`)
      }
    },
  )
})

// DESTROY
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      res.redirect('/campgrounds')
    } else {
      campground.remove()
      res.redirect('/campgrounds')
    }
  })
})

module.exports = router

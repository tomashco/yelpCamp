const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const MethodOverride = require('method-override')
// const Campground = require('./models/campground')
// const Comment = require('./models/comment')
const User = require('./models/user')
// const seedDB = require('./seeds')

const CommentRoutes = require('./routes/comments')
const campgroundRoutes = require('./routes/campgrounds')
const indexRoutes = require('./routes/index')

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

const url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp'
mongoose.connect(url)

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(`${__dirname}/public`))
app.use(MethodOverride('_method'))
app.use(flash())

// seedDB();

// PASSPORT Configuration
app.use(
  require('express-session')({
    secret: 'Pappy batuppy blipsy gipsy geeeez',
    resave: false,
    saveUninitialized: false,
  }),
)
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Gives CurrentUser information in all the templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next()
})

// Requiring routes
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', CommentRoutes)
app.use('/', indexRoutes)


/*
RESTFUL ROUTES:
name            url             verb            desc
=================================================================
INDEX           /dogs           GET             Display a list of all dog
NEW             /dogs/new       GET             Display form to make a new dog
CREATE          /dogs           POST            Add new dog to DB
SHOW            /dogs/:id       GET             Show info about one dog
*/

const port = process.env.PORT || 3000
app.listen(port, function () {
  console.log('Server Has Started!')
})

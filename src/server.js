const express = require('express');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const session = require('express-session')
const flash = require('connect-flash');

// Initialization
const app = express()

// Settings
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Middelware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended:false }))
app.use(session({
    secret: 'mysecrectsession',
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    app.locals.signupMessage = req.flash('signupMessage')
    app.locals.loginMessage = req.flash('loginMessage')
    next()
})

// Routes
const router = require('./routes/index.routes')
router(app)

module.exports = app
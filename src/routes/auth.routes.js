const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/gallery',
    failureRedirect: '/signup',
    passReqToCallback: true
}))

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login'
    })
})

router.post('/login', passport.authenticate('local-login',{
    successRedirect: '/gallery',
    failureRedirect: '/login',
    passReqToCallback: true
}))

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if(err) return next(err)
        res.redirect('/')
    })
})

module.exports = router
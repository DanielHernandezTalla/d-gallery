const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user')

passport.serializeUser((user, done) =>{
    done(null, user.id)
})

passport.deserializeUser(async (id, done) =>{
    const user = await User.findById(id)
    done(null, user)
})

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passportField: 'password',
    passReqToCallback: true,
}, async(req, email, password, done) =>{

    const user = await User.findOne({email: email})

    if(user){
        done(null, false, req.flash('signupMessage', 'The email is ready taken'))
    }else{

        const newUser = new User()
        newUser.name = req.body.name
        newUser.email = email
        newUser.password = newUser.encryptPassword(password)

        await newUser.save()
        done(null, newUser)
    }
}))

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passportField: 'password',
    passReqToCallback: true,
}, async (req, email, password, done)=>{
    const user = await User.findOne({ email: email})

    if(!user)
        return done(null, false, req.flash('loginMessage', 'No user found'))

    if(!user.comprarePassword(password)){
        return done(null, false, req.flash('loginMessage', 'Incorrect Password'))
    }

    done(null, user)
}))
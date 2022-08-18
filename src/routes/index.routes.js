'use strict'
const auth = require('./auth.routes')
const gallery = require('./gallery.routes')

function router(server) {
    server.get('/', (req, res) => {
        res.redirect('login')
    })

    server.use('/', auth)
    
    //- Add authentication
    server.use(isAuthenticated)

    server.use('/gallery', gallery)

    server.get('/profile', (req, res, next)=>{
        res.render('profile')
    })
}

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated())
    return next()
    res.redirect('login')
}

module.exports = router
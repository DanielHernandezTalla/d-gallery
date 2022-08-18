require('dotenv').config()
require('./database')
require('./passport/local-auth')

const app = require('./server')

// Start server
app.listen(app.get('port'), ()=>{
    console.log('listening localhost:'+ app.get('port'))
})


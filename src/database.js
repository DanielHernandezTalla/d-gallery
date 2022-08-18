const mongoose = require('mongoose')

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`

mongoose.connect(MONGODB_URI, {})
    .then(db => console.log("Database is connected"))
    .catch(err => console.error(err))
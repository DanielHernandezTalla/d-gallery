const mongoose = require('mongoose')
const {Schema} = mongoose

const imageSchema = new Schema({
    user_id: String,
    public_id: String,
    url: String,
    folder: String,
    name: String,
    format: String,
    size: Number,
    width: Number,
    height: Number,
})

module.exports = mongoose.model('images', imageSchema)
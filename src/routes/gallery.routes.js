const express = require('express')
const multer = require('multer')
const fs = require('fs-extra')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const Image = require('../models/image')

const router = express.Router()

const cloudinary = require('cloudinary')

// Settings
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/upload'),
    filename: (req, file, cb) =>{
        
        const name = file.originalname.substring(0, file.originalname.lastIndexOf('.'))

        cb(null, name + '_' + uuidv4() + path.extname(file.originalname).toLocaleLowerCase())
    }
})

// Middleware
const upload = multer({
    storage,
    dest:path.join(__dirname, 'public/upload'),
    limits: {
        fileSize: 100000
    }, 
    fileFilter: (req, file, cb)=>{
        const filetypes = /jpeg|jpg|git|png/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname))

        if(mimetype && extname)
            return cb(null, true)
        cb('Error: File is not image')
    }
})

const uploadSingleImage = upload.single('file')

// Routes
router.get('/', async function (req, res) {
    
    // const images = await Image.find()
    const images = await Image.find({ user_id: req.session.passport.user})

    // console.log(images)

    res.render('gallery', {
        title: "Galery",
        images})
})

router.get('/api', async function (req, res) {
    
    // const images = await Image.find()
    const images = await Image.find({ user_id: req.session.passport.user})

    res.json({
        success: images
    })
    // res.render('gallery', {images})
})

router.get('/search', async (req, res, next) => {
    
    // console.log("Searching...")
    // console.log(req.query)
    
    const images = await Image.find({$or: [
        {"name" : {$regex : req.query.search}}, 
        {"format" : {$regex : req.query.search}}
    ], user_id: req.session.passport.user})
    
    res.json({
        success: images
    })

})

router.post('/', async function (req, res) {
    
    console.log("gallery")

    // Sabe image on local with multer
    uploadSingleImage(req, res, async function(err){

        if (err)
            if(err.message)
                res.json({error: err.message})
            else
                res.json({error: err})

        try{
            // Sabe image on cloudinary
            const result = await cloudinary.v2.uploader.upload(req.file.path)
    
            // Save image on database
            const newImage = new Image({
                user_id: req.session.passport.user,
                public_id: result.public_id,
                url: result.url,
                folder: result.folder,
                name: result.original_filename,
                format: result.format,
                size: result.bytes,
                width: result.width,
                height: result.height
            })
            
            await newImage.save()

        }catch(e){
            console.log(e)
            res.json({error: "You are not authorized"})

        }finally{
            await fs.unlink(req.file.path)
        }

        res.json({success: 'ok'})
    })
})

router.delete('/:image_id', async function(req, res){
    console.log("Delete===================")
    const {image_id} = req.params
    console.log(image_id)
    const image = await Image.findByIdAndDelete(image_id)
    console.log(image)
    const result = await cloudinary.v2.uploader.destroy(image.public_id)
    
    console.log(result)
    console.log("Delete===================")
    
    res.json({
        success: 'ok'
    })
})

module.exports = router
const multer = require('multer')
const GridFsStorage  = require('multer-gridfs-storage').GridFsStorage
const mongoose = require('mongoose')
const conn = require('../db/mongoose')



const storage =  GridFsStorage({
    db:conn,
    file:(req,file)=>{
        const match = ["image/png" , "image/jpeg"]

        if(match.indexOf(file.mimetype) ===-1){
            const filename =`${Date.now()}-product-${file.originalname}`
            return filename
        }

        return{
            bucketName : "photos",
            filename: `${Date.now()}-product-${file.originalname}`
        }
    }
})

module.exports = multer({storage})
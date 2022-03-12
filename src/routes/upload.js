const upload = require('../middleware/upload')
const express = require('express')
const mongoose = require('mongoose')
const Grid = require('gridfs-stream') 
const router = new express()


let gfs
let gridfsBucket


const conn = mongoose.createConnection(process.env.MONGOOSE_CONNECTION_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

conn.once("open", function(){
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'photos'
    })

    gfs = Grid(conn, mongoose.mongo)
    gfs.collection("photos")
  
})



router.post("/file/upload", upload.single("file"), (req,res)=>{

    if(req.file === undefined) return res.send("Plz upload file")

    const url = `${req.file.filename}`

    return res.send(url)
})


router.get("/image/:filename", async(req, res)=>{
    try{
        const file = await gfs.files.findOne({filename:req.params.filename})
        var readstream = gridfsBucket.openDownloadStream(file._id);
        readstream.pipe(res);
    }catch(e){
        res.send("cannot get"+e.message)
    }
})


router.delete("/file/:filename", async(req,res)=>{
    try{
        await gfs.files.deleteOne({filename:req.params.filename})
        res.send("success")
    }catch{
        res.send('errro')
    }
})

module.exports = router
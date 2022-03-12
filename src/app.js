const express = require('express')
require("./db/mongoose")
const userProfile = require("./routes/userProfileRoutes")
const products = require('./routes/productRoutes')
const orders = require('./routes/orderRoutes')
// const Grid = require('gridfs-stream') 
// const mongoose = require('mongoose')
const auth = require('./routes/authRoutes')
const upload = require('./routes/upload')
const { connect } = require('http2')

const app = express()

// let gfs
// let gridfsBucket


// const conn = mongoose.createConnection(process.env.MONGOOSE_CONNECTION_URL,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })

// conn.once("open", function(){
//     gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
//         bucketName: 'photos'
//     })

//     gfs = Grid(conn, mongoose.mongo)
//     gfs.collection("photos")
  
// })

app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin','*')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})

app.use(express.json())
app.use(userProfile)
app.use(products)
app.use(orders)
app.use(auth)
app.use(upload)


// app.get("/image/:filename", async(req, res)=>{
//     try{
//         const file = await gfs.files.findOne({filename:req.params.filename})
//         var readstream = gridfsBucket.openDownloadStream(file._id);
//         readstream.pipe(res);
//     }catch(e){
//         res.send("cannot get"+e.message)
//     }
// })


// app.delete("/file/:filename", async(req,res)=>{
//     try{
//         await gfs.files.deleteOne({filename:req.params.filename})
//         res.send("success")
//     }catch{
//         res.send('errro')
//     }
// })


module.exports = app
const { response } = require('express')
const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const { findById } = require('../model/products')
const Products = require('../model/products')
const UserProfile = require('../model/userProfile')
const upload = require('../middleware/upload')
const dotenv = require('dotenv')
dotenv.config()

const routes = new express()


//Upload Product Image 
// const upload = multer({
//     limits:{
//         fileSize: 1000000
//     },
//     fileFilter(req,file, cb){
//         if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
//             return cb (new Error("Please upload a image"))
//         }
//         cb(undefined, true)

//     }
// })

//Add product
routes.post('/product', async(req, res)=>{
    const product = new Products(req.body)
    console.log("enterd here")
    try{
        await product.save()
        res.send(product)
    }catch(e){
        const error ={
            statusCode:400,
            message: e.message
        }
        console.log(e)
        res.status(400).send(error)
    }
})

//Upload Product image
routes.post('/product/image/:pid', upload.single('file'), async(req,res)=>{
    // const buffer = await sharp(req.file.buffer).toBuffer()
    console.log("sdfdsfssdf")
    const image = process.env.url+`${req.file.filename}`

    console.log(image)
    req.params.pid
    try{
        await Products.findByIdAndUpdate({_id:req.params.pid}, {productImage: image},{new:false, runValidators:true})
        res.send(await Products.findById(req.params.pid))

    }catch(e){
        const error ={
            statusCode:400,
            message: e.message
        }
        console.log(e)
        // throw new Error(e)
        res.staus(400).send(error)
    }

})


routes.get('/product/image/:oid', async(req,res)=>{
    try{
        const user =await Products.findById(req.params.oid)
        
        res.send(user.image)
    }catch(e){
        const error = {
            statusCode:400,
            message: e.message
        }
        res.status(400).send(error)
    }
})

//Get One product at a time
routes.get('/product/:pid', async(req, res)=>{
    

    try{
        const product =await Products.findById(req.params.pid)
        if(!product){
            res.send("No product")
           
            
        }
        res.send(product.toObject())

    }catch(e){
        const error = {
            statusCode:400,
            message: e.message
        }
        res.status(400).send(error)
    }

})


//Get All Products
routes.get('/products', async(req, res)=>{
    let products = await Products.find()
    try{
        if(!products){
            throw new Error("No products")
        }
        res.send(products)
    }catch(e){
        const error = {
            statusCode:400,
            message: e.message
        }
        res.status(400).send(error)
    }
})

//Get Queried Products for wishlist and cartlist
routes.get('/products/wishlist',auth,async(req,res)=>{
    try{
        if(!req.auth.isProfiled){
            throw new Error('Please complete yur profile')
        }
        const user =await UserProfile.findOne({authID:req.auth._id})
        let wishlist = []
       
        user.wishListItems.forEach(element => {
            wishlist.push(element.wishListItem)
        });

        const productlist = await Products.find({_id:{$in:wishlist}})
        
        res.send(productlist)

    }catch(e){
        const error ={
            statusCode:400,
            message: e.message
        }
        res.send(error).status(400)
    }
})

routes.get('/products/cartlist',auth,async(req,res)=>{
    try{

        if(!req.auth.isProfiled){
            throw new Error('Please complete yur profile')
        }
        const user =await UserProfile.findOne({authID:req.auth._id})
        let cartlist = new Array()

        for(let item of user.cartItems){
            let product = await Products.findById(item.cartItem)
            if(!product){return res.send('product not found')}

            if(product.qty< item.qty){
                product.qty = item.qty
                product.status = false
                cartlist.push(product)
                
            }else{
                product.qty = item.qty
                product.status = true
                cartlist.push(product)
                
            }

        }
    
        
        res.send(cartlist)

    }catch(e){
        const error ={
            statusCode:400,
            message: e.message
        }
        res.send(error).status(400)
    }
})


//Update product
routes.patch('/product/:id', async(req, res)=>{
    try{
        // console.log("jere")
        await Products.findByIdAndUpdate({_id: req.params.id}, req.body, {new:false, runValidators:true})
        const product = await Products.findById(req.params.id)
        res.send(product)
    }catch(e){
        const error = {
            statusCode:400,
            message: e.message
        }
        res.status(400).send(error)
    }
})

//Delete Product
routes.delete('/product/:id', async(req, res)=>{
    const product = await Products.findById(req.params.id)
    try{
        if(!product){
            throw new Error("product NOt found")
        }
        const p = await product.remove()
        res.send(p)
    }catch(e){
        const error = {
            statusCode:400,
            message: e.message
        }
        res.status(400).send(error)
    }


})

module.exports = routes
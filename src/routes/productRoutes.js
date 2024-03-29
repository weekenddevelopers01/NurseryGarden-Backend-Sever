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
    
    try{
        await product.save()
        res.send(product)
    }catch(e){
        const error ={
            statusCode:400,
            message: e.message
        }
        res.send(error).status(400)
    }
})

//Upload Product image
routes.post('/product/image/:pid', upload.single('file'), async(req,res)=>{
    // const buffer = await sharp(req.file.buffer).toBuffer()
    
    const image = `${process.env.url}/image/${req.file.filename}`

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
        res.send(error).status(400)
    }

})


routes.get('/product/image/:pid', async(req,res)=>{
    try{
        const user =await Products.findById(req.params.pid)
        
        res.send(user.image)
    }catch(e){
        res.send(e).status(400)
    }
})

//Get One product at a time
routes.get('/product/:pid', async(req, res)=>{
    

    try{
        const product =await Products.findById(req.params.pid)
        if(!product){
            res.send("No product")
            // throw new Error("No Product searching for")
            
        }
        res.send(product.toObject())

    }catch(e){
        res.send(e);
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
        res.send(e)
    }
})

//Get Queried Products for wishlist and cartlist
routes.get('/products/wishlist',auth,async(req,res)=>{
    try{
        if(!req.auth.isProfiled){
            res.send('Please complete yur profile')
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
            res.send('Please complete yur profile')
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
       
        // user.cartItems.forEach(element => {
        //     cartlist.push(element.cartItem)
        // });

        // const productlist = await Products.find({_id:{$in:cartlist}})
        
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
        await Products.findByIdAndUpdate({_id: req.params.id}, req.body, {new:false, runValidators:true})
        const product = await Products.findById(req.params.id)
        res.send(product)
    }catch(e){
        res.send(e)
    }
})

//Delete Product
routes.delete('/product/:id', async(req, res)=>{
    const product = await Products.findById(req.params.id)
    try{
        if(!product){
            throw new Error("product NOt found")
        }
        await product.remove()
        res.send("product removed")
    }catch(e){
        res.send(e)
    }


})

module.exports = routes
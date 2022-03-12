const express = require('express')
const mongoose = require('mongoose')
const orders = require('../model/orders')
const products = require('../model/products')
const userProfile = require('../model/userProfile')
const auth = require('../middleware/auth')
const UserProfile = require('../model/userProfile')


const routes = new express()

//Place new order
routes.post('/user/order', auth, async (req, res) => {
    if(!req.auth.isProfiled){ res.send('Plz complete Your profile')}
    try {
        let grandTotal = 0;
        let qty = 0;
        let productlist = new Array()
        let isOutOfStock = false

        const user = await userProfile.findOne({authID:req.auth._id})
        const userAddress = user.addressList.filter((address)=>{ return address._id.toString() === req.body.addressID })
        // const userAddress = await userProfile.findOne({"addressList._id" : req.body.addressID}, {"addressList.$" :1})
        
        for (let element of req.body.orderItems) {
            const product = await products.findById(element.productID)
            if(!product){return res.send('product not found')}

            if (product.qty < element.qty) {
                isOutOfStock = true;

            } else {
                product.qty = product.qty - element.qty
                qty = qty + element.qty
                element.productName = product.productName
                ///nooooooooote
                element.productImage = product.productImage
                element.price = product.productPrice
                let subTotal = element.qty * element.price
                element.subTotal = subTotal;
                grandTotal = grandTotal + subTotal
                productlist.push(product)
            }

        }

        if(isOutOfStock){
            res.send({error: "One of items out of stock"})
        }else{
            
            
            for(const prod of productlist){
                await products.updateOne({_id:prod._id}, {qty:prod.qty})
                await userProfile.updateOne({authID: req.auth._id}, {$pull:{cartItems:{cartItem:prod._id}}})
            }
            req.body.totalQty = qty
            req.body.grandTotal = grandTotal
            // req.billingAddress= userAddress.addressList
            console.log(req.body)
            const order = new orders({
                ...req.body,
                ownerID: user._id,
                billingAddress: userAddress[0]
            })
            
            await order.save()
            res.send(order)
        }

    } catch (e) {
        res.send(e)
    }
})

//change status of order
routes.patch('/user/order/:id', async (req, res)=>{
    

    try{
        console.log(req.body.status)
        const order = await orders.findOneAndUpdate({ownerID: req.params.id}, {status: req.body.status})
        res.send(order)

    }catch(e){
        res.send(e)
    }
})



routes.get('/user/order',auth, async(req, res)=>{

    try{

    const user = await UserProfile.findOne({authID: req.auth._id})
    const productList = await orders.find({ownerID: user._id})
        if(!productList){
            return res.send("no orders")
        }
        res.send(productList)
    }catch(e){
        res.send(e)
    }

})

//get all order for admin
routes.get('/order', async(req, res)=>{
    const orderList = await orders.find();

    try{
        if(!orderList){ return res.send('No orders found')}
        
        res.send(orderList)
    }catch(e){
        res.send(e)
    }
})







module.exports = routes
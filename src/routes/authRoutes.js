const express = require('express')
const auth = require('../middleware/auth')
const userAuth = require('../model/userAuth')

const routes = new express()

routes.post('/user/auth', async(req, res)=>{
    console.log(req.body)
    const auth = new userAuth(req.body)

    try{
        await auth.save()
        const token = await auth.generateAuthToken()
        res.send({auth, token})
    }catch(e){
        const error ={
            StatusCode:409, message: "User alread exists...!"
        }
        res.status(409).send(error)
    }
})


routes.post('/user', async(req, res)=>{
        try{
        const auth = await userAuth.findByCredentials(req.body.email, req.body.password)
        if(!auth){
           throw new Error("No User found for this")  
        }
        const token = await auth.generateAuthToken()
        res.send({auth, token})
    }catch(e){
        const error ={
            StatusCode:404, message:e.message
        }
        res.status(404).send(error)        
    }
})

routes.get('/user/detail',auth, async(req, res)=>{
    try{
        res.send(req.user);
    }catch(e){
        res.send(e.message)
    }
})

//LOGOUT
routes.post("/user/logout", auth, async(req,res)=>{
    try{

        await userAuth.findOneAndUpdate({_id:req.auth._id}, {$pull:{tokens:{token:req.header('Authorization').replace('Bearer ', '')}}})
        res.send(req.auth)
    }catch(e){
        console.log(e.message)
        const error ={
            StatusCode:404, message:e.message
        }
        res.status(400).send(error)
    }
})


module.exports = routes



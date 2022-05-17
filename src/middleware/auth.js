const jwt = require('jsonwebtoken')
const userAuth = require('../model/userAuth')


const auth = async (req, res, next)=>{

    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.AUTH_WEB_TOKEN)
        const user = await userAuth.findOne({_id:decoded._id ,'tokens.token':token})
        if(!user){
            throw new Error('Authorization Error')
        }
        req.token = token
        req.auth =user
        next()
    }catch(e){
        console.log(e)
        const error ={
            StatusCode:400, message:e.message
        }
        res.status(400).send(error)
    }

}

module.exports = auth
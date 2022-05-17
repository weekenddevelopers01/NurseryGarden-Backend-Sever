const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const TABLE_NAME = 'userAuth'

const userAuthSchema = mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid Email Format")
                }
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: 8,
            validate(value){
                if(value.toLowerCase().includes('password')){
                    throw new Error('Invalid Password pattern being used')
                }
            }
        },
        isProfiled: {
            type: Boolean,
            required: true,
            default: false
        },
        tokens:[{
            token:{
                type: String,
                required: true
            }
        }]
    } 
)

userAuthSchema.methods.generateAuthToken = async function(){
    const userAuth = this
    const token = jwt.sign({_id: userAuth._id.toString()}, process.env.AUTH_WEB_TOKEN)
    await userAuth.updateOne({$push:{tokens:{token:token}}})
    // console.log(userAuth)
    return token
}

userAuthSchema.methods.toJSON = function(){
    const auth = this
    console.log('dfdfdfdf')
    const authObject = auth.toObject()
    delete authObject.password
    delete authObject.tokens
    
    return authObject
}

userAuthSchema.statics.findByCredentials = async function(email, password){
    const auth = await userAuth.findOne({email})
    if(!auth){
       return null
    }
    const isMatch = await bcrypt.compare(password, auth.password)
    if(!isMatch){
        throw new Error("Password not matching")
    }
    return auth
    

}

userAuthSchema.pre('save', async function(next){
    const auth = this

    if(auth.isModified('password')){
        auth.password = await bcrypt.hash(auth.password, 8)
    }
    next()
})



const userAuth = mongoose.model(TABLE_NAME, userAuthSchema)
module.exports = userAuth
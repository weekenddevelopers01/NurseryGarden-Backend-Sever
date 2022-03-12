const mongoose = require('mongoose')
const validator = require('validator')
const Orders = require('../model/orders')


const TABLE_NAME = "userProfile"

const cartItems = mongoose.Schema({
    cartItem :{
        type: String,
        default:null
    },
    qty:{
        type: Number,
        default: 1
    }
},{_id:false})

const wishListItems = mongoose.Schema({
    wishListItem:{
        type: String,
        defalut:null
    }
}, {_id:false})

const userProfileSchema = new mongoose.Schema(
    {
        f_name:{
            type : String,
            required: true,
            trim: true
        },
        l_name:{
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid Email address")
                }
            }
        },
        isVerified: {
            type: Boolean,
            default:false
        },
        authID:{
            type: mongoose.Schema.Types.ObjectId,
            unique:true,
            required:true,
            ref: 'userAuth'
        },
        phone:{
            type:String,
            trim: true,
            required:true,
            validate(value){
                if(!validator.isMobilePhone(value)){
                    throw new Error("Invalid Mobile number")
                }
            }
        },
        doc: {
            type: Date
        },

        cartItems :[cartItems],
        // cartItems: [{
        //     _id: false,
        //     cartItem:{
                
        //         type: mongoose.Schema.Types.ObjectId
        //     }
        // }],
        wishListItems:[wishListItems],
        addressList:[{

            name:{
                type: String,
                trim: true
            },
            address:{
                type: String,
                trim: true
            },
            city:{
                type: String,
                trim: true
            },
            state:{
                type: String,
                trim: true
            },
            zipcode:{
                type: String,
                trim: true
            },
            phone:{
                type: String,
                validate(value){
                    if(!validator.isMobilePhone(value)){
                        throw new Error("Invalid Mobile Number")
                    }
                }
            }
        }]
    },
    
    {
        timestamps : true
    }
)


userProfileSchema.virtual('order',{
    ref: 'orders',
    localField: '_id',
    foreignField: 'ownerID'
})

userProfileSchema.pre('remove',async function(next){
    const user = this
    await Orders.deleteMany({ownerID: user._id})
    next()
})



const UserProfile = mongoose.model(TABLE_NAME, userProfileSchema)
module.exports = UserProfile
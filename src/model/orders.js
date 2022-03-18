const mongoose = require('mongoose')
const UserProfile = require('../model/userProfile')
// const orderItem = require('../model/orderItems')
const products = require('../model/products')
const validator = require('validator')
const STATUS = ["Order placed", "Order Accepted", "Order Packed", "Order Dispacted", "Order Cancelled", "Order Delivered"]

const TABLE_NAME = "orders"


const orderItem = new mongoose.Schema(
    {
        // orderID:{
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        //     ref: orders
        // },
        productID:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: products
        },
        productName:{
            type: String,
            required: true,
            trim: true
        },
        productImage:{
            type: String,
            required: true,
            time:true
        },
        qty:{
            type: Number,
            required: true
        },
        price:{
            type: Number,
            required: true,
            validate(value){
                if(value<0){
                    throw new Error("Invalid Product price")
                }
            }
        },
        subTotal:{
            type: Number,
            required: true,
            validate(value){
                if(value<0){
                    throw new Error("Invalid Price")
                }
            }
        }
    }
)

const address = new mongoose.Schema(
  {
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
  }  
)

const ordersSchema = new mongoose.Schema(
    {
        invoiceNo:{
            type: String,
            required: true,
            trim: true,
            default: Date.now()
        },
        ownerID:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'userProfile'
        },
        date:{
            type: Date,
            required: true,
            default: Date.now()
        },
        grandTotal:{
            type: Number,
            required: true,
            validate(value){
                if(value<0){
                    throw new Error("Invalid amount Encountered")
                }
            }
        },
        totalQty:{
            type: Number,
            required: true,
        },
        status:{
            type: String,
            required: true,
            emum: STATUS
        },
        orderItems : [orderItem],
        billingAddress : address
        
    }
)

const   orders = mongoose.model(TABLE_NAME, ordersSchema)
module.exports = orders
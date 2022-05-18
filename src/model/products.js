const mongoose = require('mongoose')

const TABLE_NAME = "products"

const productsSchema = mongoose.Schema(
    {
        productName:{
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        productCode:{
            type: String,
            trim: true,
            required: true
        },
        productPrice:{
            type: Number,
            trim: true,
            required: true
        },
        height:{
            type: Number,
            trim: true,
            required: true
        },
        weight:{
            type: Number,
            trim: true,
            required: true
        },
        life:{
            type: String,
            trim: true,
            required: true
        },
        rating:{
            type: Number,
            trim: true,
            required: true,
            default: 0
        },
        status:{
            type: Boolean,
            required: true,
            default: false
        },
        description:{
            type: String,
            required: true,
        },
        qty:{
            type: Number,
            required: true
        },
        isIndoor:{
            type:Boolean,
            required: true,
            default: false
        },
        isOutdoor:{
            type:Boolean,
            required: true,
            default: false 
        },
        isVege:{
            type:Boolean,
            required: true,
            default: false 
        },
        productImage:{
            data: String,
        }
    }
)

const products = mongoose.model(TABLE_NAME, productsSchema)
module.exports = products
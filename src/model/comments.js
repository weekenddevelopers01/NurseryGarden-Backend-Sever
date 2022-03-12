const mongoose = require('mongoose')
const UserProfile = require('./userProfile')

const TABLE_NAME = "comments"

const commentsSchema = mongoose.Schema(
    {
        ownerID:{
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: UserProfile
        },
        comments:{
            type: String,
            require: true,
            trim: true
        }
    }
)

const comments = mongoose.model(TABLE_NAME, commentsSchema)
module.exports = comments
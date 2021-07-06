const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    title:{type:String, required:true},
    author:{type:String, required:true},
    body:{type:String, required:true},
    createdAt: {type: Date,  default: new Date()},
    image:{ data: Buffer, contentType: String }

})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
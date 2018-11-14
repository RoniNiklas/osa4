const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    iidee: Number,
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
})

blogSchema.statics.format = (blog) => {
    return {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
        iidee: blog.iidee,
        user: blog.user,
    }
}

const Blog = mongoose.model("Blog", blogSchema)

module.exports = Blog

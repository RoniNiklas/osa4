const blogRouter = require("express").Router()
const jwt = require("jsonwebtoken")
const Blog = require("../models/blog")
const User = require("../models/user")


const getTokenFrom = (request) => {
    const authorization = request.get("authorization")
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        return authorization.substring(7)
    }
    return null
}
blogRouter.get("/", async (request, response) => {
    try {
        console.log(request.token)
        const blogs = await Blog
            .find({})
            .populate("user", { username: 1, name: 1 })

        response.json(blogs.map(Blog.format))
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: "something went wrong..." })
    }
})

blogRouter.get("/:id", async (request, response) => {
    try {
        const blog = await Blog.findOne({ iidee: request.params.id })
        if (blog) {
            response.json(Blog.format(blog))
        } else {
            response.status(404).end()
        }
    } catch (error) {
        console.log(error)
        response.status(400).send({ error: "malformatted id" })
    }
})


blogRouter.post("/", async (request, response) => {
    const body = request.body
    console.log(request.token)
    try {
        const token = getTokenFrom(request)
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: "token missing or invalid" })
        }

        if (body.author === undefined) {
            return response.status(400).json({ error: "author missing" })
        }
        if (body.url === undefined) {
            return response.status(400).json({ error: "url missing" })
        }
        if (body.title === undefined) {
            return response.status(400).json({ error: "title missing" })
        }

        const user = await User.findById(decodedToken.id)
        console.log(body.userId)
        console.log(typeof body.userId)
        console.log(user)

        const blogs = await Blog.find({})
        if (blogs.length > 0) {
            const biggestId = await blogs.map(n => n.iidee).sort((a, b) => a - b).reverse()[0]
            const blog = new Blog({
                title: request.body.title,
                author: request.body.author,
                url: request.body.url,
                likes: request.body.likes || 0,
                iidee: biggestId + 1,
                user: user._id,
            })
            const savedBlog = await blog.save()
            user.blogs = user.blogs.concat(savedBlog._id)
            await user.save()
            response.status(200).json(Blog.format(blog))
        } else {
            const blog = new Blog({
                title: request.body.title,
                author: request.body.author,
                url: request.body.url,
                likes: request.body.likes || 0,
                iidee: 1,
                user: user._id,
            })
            const savedBlog = await blog.save()
            user.blogs = user.blogs.concat(savedBlog._id)
            await user.save()
            response.status(200).json(Blog.format(blog))
        }
    } catch (exception) {
        if (exception.name === "JsonWebTokenError") {
            response.status(401).json({ error: exception.message })
        } else {
            console.log(exception)
            response.status(500).json({ error: "something went wrong..." })
        }
    }
})

blogRouter.delete("/:id", async (request, response) => {
    try {
        const token = getTokenFrom(request)
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: "token missing or invalid" })
        }
        const user = await User.findById(decodedToken.id)
        const blog = await Blog.findOne({ iidee: request.params.id })
        console.log(user._id)
        console.log(typeof user._id)
        console.log(blog.user)
        console.log(typeof blog.user)
        if (blog.user.toString() === user._id.toString()) {
            await Blog.findOneAndRemove({ iidee: request.params.id })
            response.status(204).end()
        } else {
            response.status(401).send({ error: "no authorization"})
        }
    } catch (error) {
        console.log(error)
        response.status(400).send({ error: "messed up" })
    }
})

blogRouter.delete("/", async (request, response) => {
    await Blog.remove().exec()
    response.status(204).end()
})

blogRouter.put("/:id", async (request, response) => {
    try {
        const blog = await Blog.findOne({ iidee: request.params.id })
        blog.likes = request.body.likes
        await blog.save()
        response.status(200).end()
    } catch (error) {
        console.log(error)
        response.status(500).end()
    }
})

module.exports = blogRouter

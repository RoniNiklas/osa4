const supertest = require("supertest")
const { app, server } = require("../index")
const Blog = require("../models/blog")
const User = require("../models/user")
const {
    initialBlogs, format, blogsInDb, usersInDb,
} = require("./test_helper")

const api = supertest(app)

describe.only("when there is initially one user at db", async () => {
    beforeAll(async () => {
        await User.remove({})
        const user = new User({ username: "root", password: "sekret" })
        await user.save()
    })

    test("POST /api/users succeeds with a fresh username", async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: "mluukkai",
            name: "Matti Luukkainen",
            password: "salainen",
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(200)
            .expect("Content-Type", /application\/json/)

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)
        const usernames = usersAfterOperation.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
    test("POST /api/users fails with proper statuscode and message if username already taken", async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: "root",
            name: "Superuser",
            password: "salainen",
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(result.body).toEqual({ error: "username must be unique" })

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })
    test("POST /api/users fails with proper statuscode and message if password is too short", async () => {
        const usersBeforeOperation = await usersInDb()

        const newUser = {
            username: "apina",
            name: "apina",
            password: "xy",
        }

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)

        expect(result.body).toEqual({ error: "password must be more than 3 characters long" })

        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })
})

beforeEach(async () => {
    await Blog.remove({})

    // const blogObjects = initialBlogs.map(blog => new Blog(blog))
    // const promiseArray = blogObjects.map(blog => api.post("/api/blogs").send(blog))
    for (let i = 0; i < initialBlogs.length; i++) {
        await api.post("/api/blogs").send(initialBlogs[i])
    }
    // await Promise.all(promiseArray)
})

test("posting a valid blog increases list size and blog is found by title", async () => {
    const newBlog = {
        title: "Uusi postaus",
        author: "Minä",
        url: "http://google.fi",
        likes: 31,
    }

    const blogsBefore = await blogsInDb()

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const blogsAfter = await blogsInDb()

    expect(blogsAfter.length).toBe(blogsBefore.length + 1)
    expect(blogsAfter.map(blog => blog.title)).toContainEqual(newBlog.title)
})
test("blog without title/url/author is not added", async () => {
    const newBlog = {
    }

    const blogsBefore = await blogsInDb()

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(400)

    const blogsAfter = await blogsInDb()

    expect(blogsAfter).toEqual(blogsBefore)
})
test("blog without likes is given 0 likes", async () => {
    const newBlog = {
        title: "Ei tykätty postaus",
        author: "Minä",
        url: "http://google.fi",
    }

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(200)

    const blogsAfter = await blogsInDb()

    const wantedBlog = blogsAfter.find(blog => blog.title === "Ei tykätty postaus")
    expect(wantedBlog.likes).toBe(0)
})

test("all blogs are returned (by length)", async () => {
    const blogsAfter = await blogsInDb()
    expect(blogsAfter.length).toEqual(initialBlogs.length)
})

test("a specific blog is within the returned notes", async () => {
    const blogsAfter = await blogsInDb()

    const titles = blogsAfter.map(r => r.title)

    expect(titles).toContain("First class tests")
})

test("can modify posts, checked by post likes", async () => {
    let blogsId1 = await api
        .get("/api/blogs/1")
    blogsId1 = blogsId1.body
    blogsId1.likes = 999
    await api
        .put("/api/blogs/1")
        .send(blogsId1)
        .expect(200)

    const blogId1After = await api
        .get("/api/blogs/1")
    expect(blogId1After.body.likes).toBe(999)
})

test("can delete by title, checked by list length", async () => {
    const blogsBefore = await blogsInDb()
    await api
        .delete("/api/blogs/1")
        .expect(204)
    const blogsAfter = await blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length - 1)
})

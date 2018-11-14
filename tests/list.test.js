const listHelper = require("../utils/list_helper")

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0,
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0,
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0,
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0,
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0,
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0,
    },
]
describe.skip("list helpers", () => {
    test("dummy is called", () => {
        const result = listHelper.dummy(blogs)
        expect(result).toBe(1)
    })

    describe("total likes", () => {
        const listWithOneBlog = [
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0,
            },
        ]

        test("when list has only one blog equals the likes of that", () => {
            const result = listHelper.totalLikes(listWithOneBlog)
            expect(result).toBe(5)
        })
    })
    test("when a list has many blogs, it returns the correct number of likes", () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })
    test("when a list is empty, returns 0", () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })

    describe("favorite blog", () => {
        test("when a list has many blogs, returns the one with most likes (number of likes)", () => {
            const result = listHelper.favoriteBlog(blogs)
            expect(result.likes).toBe(12)
        })
        test("when a list has many blogs, returns the one with most likes (toEqual)", () => {
            const result = listHelper.favoriteBlog(blogs)
            expect(result).toEqual(
                {
                    _id: "5a422b3a1b54a676234d17f9",
                    title: "Canonical string reduction",
                    author: "Edsger W. Dijkstra",
                    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                    likes: 12,
                    __v: 0,
                },
            )
        })
        test("when a list is empty, returns nothing", () => {
            const result = listHelper.favoriteBlog([])
            expect(result).toBe()
        })
    })
    describe("most prolific blogger", () => {
        test("when a list contains many blogs, returns the author with the most blogs (name)", () => {
            const result = listHelper.mostBlogs(blogs)
            expect(result.author).toBe("Robert C. Martin")
        })
        test("when a list contains many blogs, returns the author with the most blogs (name + amount)", () => {
            const result = listHelper.mostBlogs(blogs)
            expect(result).toEqual(
                {
                    author: "Robert C. Martin",
                    blogs: 3,
                },
            )
        })
        test("when a list is empty, returns a blank author with no blogs", () => {
            const result = listHelper.mostLikes([])
            expect(result).toEqual({
                author: "",
                likes: 0,
            })
        })
    })
    describe("most liked blogger", () => {
        test("when a list contains many blogs, returns the author with most likes (name)", () => {
            const result = listHelper.mostLikes(blogs)
            expect(result.author).toBe("Edsger W. Dijkstra")
        })
        test("when a list contains many blogs, returns the author with most likes (name + likes)", () => {
            const result = listHelper.mostLikes(blogs)
            expect(result).toEqual({
                author: "Edsger W. Dijkstra",
                likes: 17,
            })
        })
        test("when a list is empty, returns a blank author with no likes", () => {
            const result = listHelper.mostLikes([])
            expect(result).toEqual({
                author: "",
                likes: 0,
            })
        })
    })
})

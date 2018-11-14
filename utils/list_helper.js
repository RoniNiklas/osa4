const dummy = () => 1

const totalLikes = (blogs) => {
    const endTotal = blogs.map(blog => blog.likes).reduce((a, b) => a + b, 0)
    return endTotal
}

const favoriteBlog = (blogs) => {
    const mostLiked = blogs.sort((a, b) => b.likes - a.likes)[0]
    return mostLiked
}

const mostBlogs = (blogs) => {
    const nimilista = {}
    blogs.forEach((blog) => {
        if (nimilista[blog.author]) {
            nimilista[blog.author] += 1
        } else {
            nimilista[blog.author] = 1
        }
    })
    let enitenBlogeja = 0
    let mostProlific = ""
    Object.keys(nimilista).forEach((author) => {
        const authorinMaara = nimilista[author]
        if (authorinMaara > enitenBlogeja) {
            enitenBlogeja = authorinMaara
            mostProlific = author
        }
    })
    return {
        author: mostProlific,
        blogs: enitenBlogeja,
    }
}
const mostLikes = (blogs) => {
    const nimilista = {}
    blogs.forEach((blog) => {
        if (nimilista[blog.author]) {
            nimilista[blog.author] += blog.likes
        } else {
            nimilista[blog.author] = blog.likes
        }
    })
    let numberOfLikes = 0
    let mostLiked = ""
    Object.keys(nimilista).forEach((author) => {
        const authorinMaara = nimilista[author]
        if (authorinMaara > numberOfLikes) {
            numberOfLikes = authorinMaara
            mostLiked = author
        }
    })
    return {
        author: mostLiked,
        likes: numberOfLikes,
    }
}
module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
}

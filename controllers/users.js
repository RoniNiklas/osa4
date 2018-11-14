const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")

usersRouter.post("/", async (request, response) => {
  try {
    const body = request.body

    const existingUser = await User.find({ username: body.username })
    if (existingUser.length > 0) {
      return response.status(400).json({ error: "username must be unique" })
    }
    if (body.password.length < 3) {
      return response.status(400).json({ error: "password must be more than 3 characters long" })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })
    if (body.adult === "True") {
      user.adult = true
    } else {
      user.adult = false
    }

const savedUser = await user.save()

response.status(200).json(User.format(savedUser))
  } catch (exception) {
  console.log(exception)
  response.status(500).json({ error: "something went wrong..." })
}
})

usersRouter.get("/", async (request, response) => {
  const users = await User
    .find({})
    .populate("blogs")
  response.status(200).json(users.map(User.format))
})

module.exports = usersRouter

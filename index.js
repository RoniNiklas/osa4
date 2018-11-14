const express = require("express")
const http = require("http")
const bodyParser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")
const blogRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const config = require("./utils/config")
const middleware = require("./utils/middleware")


const app = express()

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}
mongoose
    .connect(config.mongoUrl)
    .then(() => {
        console.log("connected to database", config.mongoUrl)
    })
    .catch((err) => {
        console.log(err)
    })

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.tokenExtractor)
app.use("/api/login", loginRouter)
app.use("/api/blogs", blogRouter)
app.use("/api/users", usersRouter)
app.use(middleware.error)
// app.use(middleware.logger)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on("close", () => {
  mongoose.connection.close()
})

module.exports = {
  app, server,
}

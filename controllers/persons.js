const personRouter = require("express").Router()
const Person = require("../models/person")

const formatPerson = person => ({
        name: person.name,
        date: person.date,
        id: person.id,
        number: person.number,
    })

personRouter.get("/", (req, res) => {
    Person
        .find({})
        .then((people) => {
            res.json(people.map(formatPerson))
        })
        .catch((error) => {
            console.log(error)
        })
})

personRouter.get("/:id", (request, response) => {
    Person
        .findOne({ id: request.params.id })
        .then((person) => {
            if (person) {
                response.json(formatPerson(person))
            } else {
                response.status(404).end()
            }
        }).catch((error) => {
            console.log(error)
            response.status(400).send({ error: "malformatted id" })
        })
})


personRouter.delete("/:id", async (request, response) => {
    try {
        await Person.findOneAndRemove({ id: request.params.id })
        response.status(204).end()
    } catch (error) {
        console.log(error)
        response.status(400).send({ error: "messed up" })
    }
})

personRouter.post("/", (request, response) => {
    if (request.body.name === "") {
        return response.status(400).json({ error: "name missing" })
    }
    if (request.body.number === "") {
        return response.status(400).json({ error: "number missing" })
    }
    Person
        .find({})
        .then((people) => {
            if (people.some(n => n.name === request.body.name)) {
                return response.status(400).json({ error: "name must be unique" })
            }
            if (people.length > 0) {
                const biggestId = people.map(n => n.id).sort((a, b) => a - b).reverse()[0]
                const person = new Person({
                    name: request.body.name,
                    number: request.body.number,
                    id: biggestId + 1,
                    date: new Date(),
                })
                person
                    .save()
                    .then((person) => {
                        response.json(formatPerson(person))
                    })
            } else {
                const person = new Person({
                    name: request.body.name,
                    number: request.body.number,
                    id: 1,
                    date: new Date(),
                })
                person
                    .save()
                    .then((person) => {
                        response.json(formatPerson(person))
                    })
            }
        })
        .catch((error) => {
            console.log(error)
        })
})

personRouter.put("/:id", (request, response) => {
    Person
        .findOne({ id: request.params.id })
        .then((person) => {
            person.number = request.body.number
            person.date = new Date()
            person.save()
                .then((person) => {
                    response.json(formatPerson(person))
                })
        })
        .catch((error) => {
            console.log(error)
        })
})

personRouter.get("/info", (req, res) => {
    Person
        .find({})
        .then((people) => {
            res.json(`puhelinluettelossa ${people.length} henkilön tiedot`)
        })
        .catch((error) => {
            console.log(error)
        })
})

module.exports = personRouter

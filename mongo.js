const mongoose = require('mongoose')
const url = 'mongodb://admin:adminpassword1@ds247290.mlab.com:47290/roniniklas'
mongoose.connect(url)

const Person = mongoose.model('Person', {
    id: Number,
    name: String,
    date: Date,
    number: String
})

const newId = () => {
    let suurinId = 0
    Person
    .find({})
    .forEach(person => {
        if (person.id > uusiId){
            suurinId = person.id
        }
    })
    return (suurinId+1)

}

if (process.argv.length > 2) {
    const nimi = process.argv[2]
    const numero = process.argv[3]

    const person = new Person({
        id: newId(),
        name: nimi,
        date: new Date(),
        number: numero,
    })

    person
        .save()
        .then(response => {
            console.log('lisätään henkilön ' + name + " numero " + number + " luetteloon ")
            mongoose.connection.close()
        })

} else {
        Person
        .find({})
        .then(result => {
            console.log("puhelinluettelo:")
            result.forEach(person => {
                console.log(person.name + " " + person.number)
            })
            mongoose.connection.close()
        })
}

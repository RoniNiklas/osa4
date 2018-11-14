const mongoose = require("mongoose")

const Person = mongoose.model("Person", {
  name: String,
  number: String,
  id: Number,
  date: Date,
  /*
  setDate(date) {
    this.date = date
  },
  setNumber(number) {
    this.number = number
  },
  */
})


module.exports = Person

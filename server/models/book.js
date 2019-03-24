const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
    isbn: {type: String, required: true, unique: true, trim: true},
    title: {type: String, required: true, trim: true},
    author: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    published_year: {type: Number, min: 1945, max: 2019, required: true},
    publisher:{ type: String, required: true, trim: true},
    updated_date: { type: Date, default: Date.now}
})
const Book = mongoose.model('Book', bookSchema)
module.exports = Book

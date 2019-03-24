const GraphQL = require('graphql')
const GraphQLSchema = GraphQL.GraphQLSchema
const GraphQLObjectType = GraphQL.GraphQLObjectType
const GraphQLList = GraphQL.GraphQLList
const GraphQLNonNull = GraphQL.GraphQLNonNull
const GraphQLID = GraphQL.GraphQLID
const GraphQLString = GraphQL.GraphQLString
const GraphQLInt = GraphQL.GraphQLInt
const GraphQLDate = require('graphql-date')
const BookModel = require('../models/book')

const bookType = new GraphQLObjectType({
    name: 'book',
    fields: {
            _id: {
                type: GraphQLString
            },
            isbn: {
                type: GraphQLString
            },
            title: {
                type: GraphQLString
            },
            author: {
                type: GraphQLString
            },
            description: {
                type: GraphQLString
            },
            published_year: {
                type: GraphQLInt
            },
            publisher: {
                type: GraphQLString
            },
            updated_date: {
                type: GraphQLDate
            }
        }
    
})

const bookQuery = new GraphQLObjectType({
    name: 'Query',
    fields: {
        books: {
            type: new GraphQLList(bookType),
            resolve: () => {
                const books =  BookModel.find()
                    .exec()
                if (!books) throw new Error('no book found')
                return books
            }
        },
        book: {
            type: bookType,
            args:{
                id:{
                    name: '_id',
                    type: GraphQLString
                }
            },
            resolve: (root, bookObj) => {
                const findBook = BookModel.findOne({_id: bookObj.id})
                if (!findBook) throw new Error('no book found')
                return findBook
            }
        }
    }
})

const bookMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addBook: {
            type: bookType,
            args: {
                isbn: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                title: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                author: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                description: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                published_year: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
                publisher: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (root, bookObj) => {
                const newBook = BookModel.create(bookObj)
                if (!newBook) throw new Error('Error on create book')
                return newBook
            }
        },
        updateBook : {
            type: bookType,
            args: {
                id: {
                    name: '_id',
                    type: new GraphQLNonNull(GraphQLString)
                },
                isbn: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                title: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                author: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                description: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                published_year: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
                publisher: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (root, bookObj) => {
                const updateBook = BookModel.findOneAndUpdate({_id: bookObj.id}, {$set: bookObj}, {})
                if (!updateBook) throw new Error('Error update book')
                return updateBook
            }
        },
        removeBook: {
            type: bookType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: (root, bookObj) => {
                const removeBook = BookModel.findOneAndRemove({_id: bookObj.id})
                if (!removeBook) return new Error('Delete book error')
                return removeBook
            }
        }
    }
})
module.exports = new GraphQLSchema({query: bookQuery, mutation: bookMutation})

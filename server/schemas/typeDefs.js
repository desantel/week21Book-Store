const { gql } = require('apollo-server-express');

const typedDefs = gql`
    type User {
        _id: ID!
        email: String!
        password: String!
        bookCount: Number
        SavedBooks: [Book]
    }

    type Book {
        bookId: String
        authors: [String]
        description: String!
        image: String
        link: String
        title: String!
    }

    input savedBook {
        description: String
        title: String
        bookId: String
        image: String
        link: String
        authors: [String]
    }

    type Query {
        me: user
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(book: savedBook!): User
        removeBook(bookId: ID!): User
    }

    type Auth {
        token: ID!
        user: User
    }

`;

module.exports = typeDefs;
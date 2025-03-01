const typeDefs = `
    type User {
        _id: ID
        username: String
        email: String
        password: String
        savedBooks: [Book]!
        bookCount: Int
    }

    type Book {
        _id: ID
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }
    
    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
    }

    input AddUserInput {
        username: String!
        email: String!
        password: String!
    }

    input SaveBookInput {
        bookId: String!
        authors: [String]
        description: String!
        title: String!
        image: String
        link: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(email: String!, password: String!, username: String!): Auth
        saveBook(bookInput: SaveBookInput!): User
        removeBook(bookId: String!): User
    }
`;

export default typeDefs;
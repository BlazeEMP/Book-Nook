// TODO COMPLETE double check file
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
        thoughtText: String
        thoughtAuthor: String
        createdAt: String
        comments: [Comment]!
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

    input AddBookInput {
        bookId: String!
        authors: [String]
        description: String!
        title: String!
        image: String
        link: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(input: AddUserInput!): Auth
        saveBook(input: AddBookInput!): User
        removeBook(bookId: ID!): User
    }
`;

export default typeDefs;
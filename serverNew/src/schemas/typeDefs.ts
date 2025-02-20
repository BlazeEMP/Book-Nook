const typeDefs = `
    type User {
        _id: ID
        username: String
        email: String
        password: String
        savedBooks: [Book]!
        bookCount: Int
    }

    input AddUserInput {
        username: String!
        email: String!
        password: String!
    }

    type Book {
        _id: ID
        thoughtText: String
        thoughtAuthor: String
        createdAt: String
        comments: [Comment]!
    }

    input AddBookInput {
        bookId: String!
        authors: [String]
        description: String!
        title: String!
        image: String
        link: String
    }
    
    type Auth {
        token: ID!
        user: User
    }

    type Query {
        users: [User]
        user(username: String!): User
        thoughts: [Thought]!
        thought(thoughtId: ID!): Thought
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(input: AddUserInput!): Auth
        saveBook(input: AddBookInput!): User
        removeBook(bookId: ID!): User
    }
`;

export default typeDefs;
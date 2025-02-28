import { User } from '../models/index.js';
import type { IUser } from '../models/User.js';
import { signToken } from '../services/auth.js';
import { GraphQLError } from 'graphql';

// Define types for the arguments
interface AddUserArgs {
    username: string;
    email: string;
    password: string;
}

interface LoginUserArgs {
    email: string;
    password: string;
}

interface SaveBookInput {
    bookId: string;
    authors: string[];
    description: string;
    title: string;
    image?: string;
    link?: string;
}

interface RemoveBookArgs {
    bookId: string;
}

const resolvers = {
    Query: {
        // Query to get the authenticated user's information
        // The 'me' query relies on the context to check if the user is authenticated
        me: async (_parent: any, _args: any, context: any) => {
            // If the user is authenticated, find and return the user's information along with their thoughts
            if (context.user) return User.findOne({ _id: context.user._id });

            // If the user is not authenticated, throw an GraphQLError
            throw new GraphQLError('Could not authenticate user.');
        },
    },

    Mutation: {
        addUser: async (_parent: any, { username, email, password }: AddUserArgs) => {
            // Create a new user with the provided username, email, and password
            const user = await User.create({ username, email, password });


            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);

            // Return the token and the user
            return { token, user };
        },

        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            // Find a user with the provided email
            const user = await User.findOne({ email });

            // If no user is found, throw an GraphQLError
            if (!user) throw new GraphQLError('Could not authenticate user.');

            // Check if the provided password is correct
            const correctPw = await user.isCorrectPassword(password);

            // If the password is incorrect, throw an GraphQLError
            if (!correctPw) throw new GraphQLError('Could not authenticate user.');

            // Sign a token with the user's information
            const token = signToken(user.username, user.email, user._id);

            // Return the token and the user
            return { token, user };
        },
        // the use of {bookInput}:{bookInput: SaveBookArgs} is a destructuring of the input object, and type assertion simultaneously.
        saveBook: async (_parent: any, { bookInput }: { bookInput: SaveBookInput }, context: { user?: IUser }) => {
            if (context.user) {
                const userSaveBook = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookInput } },
                    { new: true, runValidators: true } // run the validators on creation
                );

                return userSaveBook;
            }
            throw new GraphQLError('Could not authenticate user.');
        },

        removeBook: async (_parent: any, bookId: String, context: { user?: IUser }) => {
            if (context.user) {
                const userRemoveBook = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: bookId } },
                    { new: true }
                );

                return userRemoveBook;
            }
            throw new GraphQLError('Could not authenticate user.');
        },
    },
};

export default resolvers;
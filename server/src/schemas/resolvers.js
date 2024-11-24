import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User';
import { signToken } from '../services/auth';
export const resolvers = {
    Query: {
        me: async (_, args, context) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in!');
            }
            // Explicitly type the query result
            const user = await User.findOne({
                $or: [{ _id: context.user._id }, { username: args.username }],
            }).populate('savedBooks');
            if (!user) {
                throw new AuthenticationError('User not found!');
            }
            return user;
        },
    },
    Mutation: {
        login: async (_, { email, password }) => {
            // Explicitly type the query result
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const validPassword = await user.isCorrectPassword(password);
            if (!validPassword) {
                throw new AuthenticationError('Incorrect credentials');
            }
            // Now TypeScript knows user.username, user.email, and user._id are strings
            const token = signToken(user.username, user.email, String(user._id));
            return { token, user };
        },
        addUser: async (_, { username, email, password }) => {
            // Explicitly type the creation result
            const user = await User.create({ username, email, password });
            if (!user) {
                throw new Error('Failed to create user');
            }
            // TypeScript knows user.username, user.email, and user._id are strings
            const token = signToken(user.username, user.email, String(user._id));
            return { token, user };
        },
        saveBook: async (_, { input }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in!');
            }
            // Explicitly type the query result
            const updatedUser = await User.findByIdAndUpdate(context.user._id, { $addToSet: { savedBooks: input } }, { new: true, runValidators: true }).populate('savedBooks');
            if (!updatedUser) {
                throw new Error('Failed to save book');
            }
            return updatedUser;
        },
        removeBook: async (_, { bookId }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in!');
            }
            // Explicitly type the query result
            const updatedUser = await User.findByIdAndUpdate(context.user._id, { $pull: { savedBooks: { bookId } } }, { new: true }).populate('savedBooks');
            if (!updatedUser) {
                throw new Error("Couldn't find user with this id!");
            }
            return updatedUser;
        },
    },
};

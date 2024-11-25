import { AuthenticationError } from 'apollo-server-express';
import  User from '../models/User';
import { signToken } from '../services/auth';
import type { UserDocument } from '../models/User';

interface Context {
  user?: { _id: string };
}

interface LoginArgs {
  email: string;
  password: string;
}

interface AddUserArgs {
  username: string;
  email: string;
  password: string;
}

interface SaveBookArgs {
  input: {
    bookId: string;
    authors?: string[];
    description?: string;
    title: string;
    image?: string;
    link?: string;
  };
}

interface RemoveBookArgs {
  bookId: string;
}

export const resolvers = {
  Query: {
    me: async (_: any, args: any, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in!');
      }

      // Explicitly type the query result
      const user: UserDocument | null = await User.findOne({
        $or: [{ _id: context.user._id }, { username: args.username }],
      }).populate('savedBooks');

      if (!user) {
        throw new AuthenticationError('User not found!');
      }

      return user;
    },
  },

  Mutation: {
    login: async (_: any, { email, password }: LoginArgs) => {
      // Explicitly type the query result
      const user: UserDocument | null = await User.findOne({ email });

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

    addUser: async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
    
      if (!user) {
        throw new Error('Failed to create user');
      }
    
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    saveBook: async (_: any, { input }: SaveBookArgs, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in!');
      }

      // Explicitly type the query result
      const updatedUser: UserDocument | null = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: input } },
        { new: true, runValidators: true }
      ).populate('savedBooks');

      if (!updatedUser) {
        throw new Error('Failed to save book');
      }

      return updatedUser;
    },

    removeBook: async (_: any, { bookId }: RemoveBookArgs, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in!');
      }

      // Explicitly type the query result
      const updatedUser: UserDocument | null = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      ).populate('savedBooks');

      if (!updatedUser) {
        throw new Error("Couldn't find user with this id!");
      }

      return updatedUser;
    },
  },
};
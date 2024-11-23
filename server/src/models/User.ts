import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';
import bookSchema, { BookDocument } from './Book.js';
import type { CallbackError } from 'mongoose';

export interface UserDocument extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: BookDocument[];
  isCorrectPassword(password: string): Promise<boolean>;
  bookCount: number;
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // Set savedBooks to be an array of data adhering to the bookSchema
    savedBooks: {
      type: [bookSchema],
      default: [],
    },
  },
  {
    toJSON: {
      virtuals: true, // Include virtuals in JSON output
    },
  }
);

// Hash user password before saving
userSchema.pre('save', async function (next) {
  try {
    if (this.isNew || this.isModified('password')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
  } catch (err) {
    if (err instanceof Error) {
      next(err as CallbackError); // Safely cast after confirming it's an Error
    } else {
      next(new Error('Unknown error occurred during pre-save')); // Handle unknown cases
    }
  }
});

// Custom method to validate password
userSchema.methods.isCorrectPassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// Virtual property for book count
userSchema.virtual('bookCount').get(function (this: UserDocument) {
  return this.savedBooks.length;
});

// Add indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

const User = model<UserDocument>('User', userSchema);

export default User;
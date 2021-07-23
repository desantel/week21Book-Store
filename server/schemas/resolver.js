const { AuthenticationError } = require('apollo-server-express');
const { Book, User } = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({_id: context.user._id}).populate('savedBooks');
                return userData;
            } else {
                throw new AuthenticationError('Please login')
            }
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return {token, user}
        },

        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });

            if(!user) {
                throw new AuthenticationError('Please try again');
            }
            
            const correctPW = await User.isCorrectPassword(password);

            if (!correctPW) {
                throw new AuthenticationError('Please try again');
            }

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, { book }, context) => {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user.id },
                    { $addToSet: { savedBooks: book } },
                    { new: true }
                );
            }

            throw new AuthenticationError('Please login first');
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user.id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
            }

            throw new AuthentificationError('Please login first');
        }
    }
};

module.exports = resolvers;
const { AuthenticationError } = require('apollo-server-express');
const { User, Outfits, Clothes } = require('../models')
const { signToken } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');


const resolvers = {
    Query: {
      // Query resolvers here 
      user: async (parent, args, context) => {
        if (context.user) {
          const user = await User.findById(context.user._id);
          return user;
        }
        throw new AuthenticationError('Not logged in');
      },

      outfit: async (parent, { _id }) => {
        return await Outfits.findById(_id);
      },
      outfits: async () => {
        return await Outfits.find();
      },
      clothes: async (parent, { _id }) => {
        return await Clothes.findById(_id);
      }
    },
    Mutation: {
      // Mutation resolvers here 
      addUser: async (parent, args, context) => {
        const user = await User.create(args);
        const token = signToken(user);
  
        return { token, user };
      },
      addOutfit: async (parent, args, context) => {
        if (context.user) {
        const outfit = Outfits.create(args);
        
        await User.findByIdAndUpdate(context.user._id, { $push: {outfits: outfit} })


        return outfit;
      }
    },
    addClothes: async (parent, args, context) => {
        if (context.user) {
        const clothes = Clothes.create(args);
        
        await User.findByIdAndUpdate(context.user._id, { $push: {clothes: clothes} })


        return outfit;
      }
    },
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const token = signToken(user);
  
        return { token, user };
      }
    },
  };
  


module.exports = resolvers;
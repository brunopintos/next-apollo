import User from "./models/user";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import { UserInputError } from "apollo-server-micro";

const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    }
  }),
  Query: {
    getUsers: (_, __, context) => {
      return User.findAll();
    },
    getUser: (_, { email }, context) => {
      return User.findOne({ where: { email: email } });
    }
  },
  Mutation: {
    login: (_, { email, password }, context) => {
      return User.findOne({
        where: { email: email }
      }).then(user => {
        if (user && user.dataValues) {
          if (user.dataValues.password !== password) {
            throw new UserInputError("Incorrect password.");
          }
        } else {
          throw new UserInputError("The email address is not registered.");
        }
      });
    },
    signupUser: (_, { email, password }, context) => {
      return User.create({
        email: email,
        password: password
      });
    }
  }
};

export default resolvers;

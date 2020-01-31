import User from "./models/user";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import { UserInputError } from "apollo-server-micro";
import { Op } from "sequelize";

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
    login: (_, { usernameOrEmail, password }, context) => {
      return User.findOne({
        where: {
          [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        }
      }).then(user => {
        if (user && user.dataValues) {
          if (user.dataValues.password !== password) {
            throw new UserInputError("Incorrect password.");
          }
        } else {
          throw new UserInputError(
            "The username or email address is not registered."
          );
        }
        return user;
      });
    },
    signupUser: (_, { username, email, password }, context) => {
      return User.create({
        username: username,
        email: email,
        password: password
      }).catch(err => {
        if (err.errors[0].message.includes("username")) {
          return User.findOne({
            where: { email: email }
          }).then(user => {
            if (user && user.dataValues) {
              throw new UserInputError(
                "Both username and email addres are already in use."
              );
            } else {
              throw new UserInputError("Username is already in use.");
            }
          });
        } else {
          throw new UserInputError("Email address is already in use.");
        }
      });
    }
  }
};

export default resolvers;

import User from "./models/user";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

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
      let user;
      user = User.findOne({
        where: { email: email, password: password }
      }).catch(() => {
        user = null;
      });
      return user;
    },
    signupUser: (_, { email, password }, context) => {
      let user;
      user = User.create({
        email: email,
        password: password
      }).catch(() => {
        user = null;
      });
      return user; //useMutation usar error.
    }
  }
};

export default resolvers;

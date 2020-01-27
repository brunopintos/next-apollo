import User from "./models/user";

const resolvers = {
  Query: {
    getUsers: (_, __, context) => {
      return User.findAll();
    },
    getUser: (_, { email }, context) => {
      return User.findOne({ where: { email: email } });
    },
    login: (_, { email, password }, context) => {
      return User.findOne({ where: { email: email, password: password } });
    }
  },
  Mutation: {
    createUser: (_, { email, password }, context) => {
      return User.create({
        email: email,
        password: password
      });
    }
  }
};

export default resolvers;

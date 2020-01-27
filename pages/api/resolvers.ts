import User from "./models/user";

const resolvers = {
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
      return User.findOne({ where: { email: email, password: password } });
    },
    createUser: (_, { email, password }, context) => {
      User.max("id").then(max => {
        return User.create({
          id: max + 1,
          email: email,
          password: password
        });
      });
    }
  }
};

export default resolvers;

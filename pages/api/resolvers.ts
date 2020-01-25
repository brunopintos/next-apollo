import User from "./models/user";

const resolvers = {
  Query: {
    getUsers: (_, __, context) => {
      return User.findAll();
    },
    getUser: (_, { id }, context) => {
      return User.findByPk(id);
    },
    login: (_, { email, password }, context) => {
      return User.findOne({ where: { email: email, password: password } });
    }
  },
  Mutation: {
    createUser: (_, { id, email, password }, context) => {
      return User.create({
        id: id,
        email: email,
        password: password
      });
    }
  }
};

export default resolvers;

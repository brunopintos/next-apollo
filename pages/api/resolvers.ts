import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import { UserInputError } from "apollo-server-micro";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
    getUsers: (_, __, { dataBase }) => {
      return dataBase.User.findAll();
    },
    getUser: (_, { email }, { dataBase }) => {
      return dataBase.User.findOne({ where: { email: email } });
    },
    getArticles: (_, __, { dataBase }) => {
      return dataBase.Article.findAll();
    }
  },
  Mutation: {
    login: (_, { usernameOrEmail, password }, { dataBase }) => {
      return dataBase.User.findOne({
        where: {
          [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        }
      }).then(user => {
        if (user && user.dataValues) {
          if (!bcrypt.compareSync(password, user.dataValues.password)) {
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
    signupUser: (_, { username, email, password }, { dataBase }) => {
      return dataBase.User.create({
        username: username,
        email: email,
        role: "ADMIN",
        password: bcrypt.hashSync(password, 3)
      }).catch(err => {
        if (err.errors[0].message.includes("username")) {
          return dataBase.User.findOne({
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
    },
    createArticle: async (
      _,
      { input: { title, icon, parentId, authorId } },
      { dataBase }
    ) => {
      const article = await dataBase.Article.create({
        title: title,
        icon: icon || "-",
        content: "",
        parentId: parentId || null,
        authorId: authorId,
        isFavourite: false
      }).catch(err => {
        if (err.errors[0].message.includes("title")) {
          throw new UserInputError("Article title is already in use.");
        } else {
          throw new UserInputError("Icon too long");
        }
      });
      return article;
    }
  },
  Article: {
    tags: article => article.getTags(),
    parent: article => article.getParent(),
    author: article => article.getAuthor()
  },
  Tag: {
    articles: tag => tag.getArticles()
  }
};

export default resolvers;

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
    me: (_, __, { dataBase, userId }) => {
      return dataBase.User.findByPk(userId);
    },
    getUsers: (_, __, { dataBase }) => {
      return dataBase.User.findAll();
    },
    getUser: (_, { email }, { dataBase }) => {
      return dataBase.User.findOne({ where: { email: email } });
    },
    getArticles: (_, __, { dataBase }) => {
      return dataBase.Article.findAll();
    },
    getArticle: (_, { id }, { dataBase }) => {
      return dataBase.Article.findByPk(id);
    },
    getSubArticles: (_, { id }, { dataBase }) => {
      return dataBase.Article.findAll({ where: { parentId: id } });
    },
    getRootArticles: (_, __, { dataBase }) => {
      return dataBase.Article.findAll({ where: { parentId: null } });
    },
    getFirstArticle: (_, __, { dataBase }) => {
      return dataBase.Article.findAll().then(articles => {
        return articles[0];
      });
    }
  },
  Mutation: {
    login: (_, { usernameOrEmail, password }, { dataBase, res }) => {
      return dataBase.User.findOne({
        where: {
          [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        }
      }).then(user => {
        if (!user || !user.dataValues) {
          throw new UserInputError(
            "The username or email address is not registered."
          );
        }
        if (!bcrypt.compareSync(password, user.dataValues.password)) {
          throw new UserInputError("Incorrect password.");
        }
        const token = jwt.sign(user.toJSON(), "supersecret", {
          expiresIn: "1d"
        });
        res.setHeader("Set-Cookie", [`token=${token}`]);
        return { token: token };
      });
    },
    signupUser: (_, { username, email, password }, { dataBase, res }) => {
      return dataBase.User.create({
        username: username,
        email: email,
        role: "ADMIN",
        password: bcrypt.hashSync(password, 3)
      })
        .then(user => {
          const token = jwt.sign(user.toJSON(), "supersecret", {
            expiresIn: "1d"
          });
          res.setHeader("Set-Cookie", [`token=${token}`]);
          return { token: token };
        })
        .catch(err => {
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
    createArticle: (
      _,
      { input: { title, icon, content, parentId } },
      { dataBase, userId }
    ) => {
      return dataBase.User.findByPk(userId)
        .then(user => {
          if (!user || !user.dataValues) {
            throw new UserInputError("Authentication Error.");
          }
          return dataBase.Article.create({
            title: title,
            icon: icon || "📒",
            content: content || "Here is some content for your Article",
            parentId: parentId || null,
            authorId: userId,
            isFavourite: false
          })
            .then(article => {
              return article;
            })
            .catch(err => {
              if (err.errors[0].message.includes("title")) {
                console.log(err.errors[0].message);
                throw new UserInputError("Article title is already in use.");
              } else {
                throw new UserInputError("Icon too long");
              }
            });
        })
        .catch(() => {
          throw new UserInputError("Authentication Error.");
        });
    }
  },
  Article: {
    tags: article => article.getTags(),
    parent: article => article.getParent(),
    author: article => article.getAuthor(),
    articles: article => article.getArticles()
  },
  Tag: {
    articles: tag => tag.getArticles()
  },
  User: {
    articles: user => user.getArticles()
  }
};

export default resolvers;

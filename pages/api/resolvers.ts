import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import { UserInputError, decorateWithLogger } from "apollo-server-micro";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import moment from "moment";

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
    },
    getArticleWithParents: async (_, { id }, { dataBase }) => {
      const article = await dataBase.Article.findByPk(id);
      const articleWithParents = [article];
      let parent = await dataBase.Article.findByPk(article.parentId);
      while (parent) {
        articleWithParents.push(parent);
        const newParentId = parent.parentId;
        parent = newParentId
          ? await dataBase.Article.findByPk(newParentId)
          : null;
      }
      return articleWithParents.reverse();
    },
    getModifications: (_, __, { dataBase }) => {
      return dataBase.Modification.findAll();
    },
    getArticleModifications: (_, { id }, { dataBase }) => {
      return dataBase.Modification.findAll({
        where: {
          articleId: id
        },
        order: [["updatedAt", "DESC"]]
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
          expiresIn: "7d" //TODO: enviar una request de un token nuevo el 6to dia
        });
        res.setHeader("Set-Cookie", [`token=${token}`]);
        return { token: token };
      });
    },
    logout: async (_, __, { res }) => {
      try {
        res.deleteHeader("Set-Cookie");
      } catch {
        return false;
      }
      return true;
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
            expiresIn: "7d" //TODO: enviar una request de un token nuevo el 6to dia
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
            authorId: userId
          })
            .then(article => {
              return article;
            })
            .catch(err => {
              if (err.errors[0].message.includes("title")) {
                throw new UserInputError("Article title is already in use.");
              } else {
                throw new UserInputError("Icon too long");
              }
            });
        })
        .catch(() => {
          throw new UserInputError("Authentication Error.");
        });
    },
    updateArticle: async (
      _,
      { input: { newContent, articleId } },
      { dataBase, userId }
    ) => {
      const user = await dataBase.User.findByPk(userId);
      if (!user || !user.dataValues) {
        throw new UserInputError("Authentication Error.");
      }
      const article = await dataBase.Article.findByPk(articleId);
      if (!article || !article.dataValues) {
        throw new UserInputError("Article not found Error.");
      }
      const updateReturn = await dataBase.Article.update(
        { content: newContent || "" },
        {
          returning: true,
          where: {
            id: articleId
          }
        }
      );
      const articleToReturn = updateReturn[1][0];
      const lastModification = await dataBase.Modification.findOne({
        where: { authorId: userId, articleId: articleId },
        order: [["updatedAt", "DESC"]]
      });
      if (
        lastModification?.dataValues?.updatedAt &&
        moment(lastModification.dataValues.updatedAt).isSame(moment(), "minute")
      ) {
        await dataBase.Modification.update(
          {
            newContent: newContent
          },
          {
            where: {
              id: lastModification.dataValues.id
            }
          }
        );
      } else {
        const nuevaModification = await dataBase.Modification.create({
          newContent: newContent,
          articleId: articleId,
          authorId: userId
        });
      }
      return articleToReturn;
    },
    moveArticle: (_, { input: { subArticleId, parentId } }, { dataBase }) => {
      if (subArticleId !== parentId) {
        return dataBase.Article.update(
          { parentId: parentId },
          {
            returning: true,
            where: {
              id: subArticleId
            }
          }
        )
          .then(updateReturn => {
            return updateReturn?.[1]?.[0];
          })
          .catch(() => {
            throw new UserInputError("Update could not be done.");
          });
      } else {
        throw new UserInputError("An article can not be his parent.");
      }
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
  },
  Modification: {
    article: modification => modification.getArticle(),
    author: modification => modification.getAuthor()
  }
};

export default resolvers;

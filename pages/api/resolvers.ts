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
      return dataBase.Users.findByPk(userId);
    },
    getUsers: (_, __, { dataBase }) => {
      return dataBase.Users.findAll({ order: [["username"]] });
    },
    getUser: (_, { email }, { dataBase }) => {
      return dataBase.Users.findOne({ where: { email: email } });
    },
    getArticles: (_, __, { dataBase }) => {
      return dataBase.Articles.findAll({ order: [["title"]] });
    },
    getArticle: (_, { id }, { dataBase }) => {
      return dataBase.Articles.findByPk(id);
    },
    getSubArticles: (_, { id }, { dataBase }) => {
      return dataBase.Articles.findAll({
        where: { parentId: id },
        order: [["title"]]
      });
    },
    getRootArticles: (_, __, { dataBase }) => {
      return dataBase.Articles.findAll({
        where: { parentId: null },
        order: [["title"]]
      });
    },
    getFirstArticle: (_, __, { dataBase }) => {
      return dataBase.Articles.findAll({ order: [["title"]] }).then(
        articles => {
          return articles[0];
        }
      );
    },
    getArticleWithParents: async (_, { id }, { dataBase }) => {
      const article = await dataBase.Articles.findByPk(id);
      const articleWithParents = [article];
      let parent = await dataBase.Articles.findByPk(article.parentId);
      while (parent) {
        articleWithParents.push(parent);
        const newParentId = parent.parentId;
        parent = newParentId
          ? await dataBase.Articles.findByPk(newParentId)
          : null;
      }
      return articleWithParents.reverse();
    },
    getModifications: (_, __, { dataBase }) => {
      return dataBase.Modifications.findAll({ order: [["updatedAt", "DESC"]] });
    },
    getArticleModifications: (_, { id }, { dataBase }) => {
      return dataBase.Modifications.findAll({
        where: {
          articleId: id
        },
        order: [["updatedAt", "DESC"]]
      });
    },
    getUserFavorites: (_, __, { dataBase, userId }) => {
      return dataBase.Favorites.findAll({ where: { userId: userId } }).then(
        favorites => {
          return dataBase.Articles.findAll({
            where: {
              id: { [Op.in]: favorites.map(favorite => favorite.articleId) }
            }
          });
        }
      );
    },
    isArticleFavorite: (_, { id }, { dataBase, userId }) => {
      return dataBase.Favorites.findOne({
        where: { articleId: id, userId: userId }
      })
        .then(favorite => {
          return !!favorite;
        })
        .catch(() => false);
    }
  },
  Mutation: {
    login: (_, { usernameOrEmail, password }, { dataBase, res }) => {
      return dataBase.Users.findOne({
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
          expiresIn: "7d"
        });
        res.setHeader("Set-Cookie", [`token=${token}`]);
        return { token: token };
      });
    },
    signupUser: (_, { username, email, password }, { dataBase, res }) => {
      return dataBase.Users.create({
        username: username,
        email: email,
        role: "ADMIN",
        password: bcrypt.hashSync(password, 3)
      })
        .then(user => {
          const token = jwt.sign(user.toJSON(), "supersecret", {
            expiresIn: "7d"
          });
          res.setHeader("Set-Cookie", [`token=${token}`]);
          if (user?.dataValues?.id === 1) {
            return dataBase.Articles.create({
              title: "Get Started",
              icon: "📒",
              content: `<p><span style="background-color: unset; text-align: inherit; font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont;">👋 Welcome to Lithium KB! This is an introduction page for all new members of the platform.</span><br></p><p><br></p><p><strong>Give these things a try:</strong></p><ol><li>﻿﻿<span style="text-decoration: line-through;">Create an account<br></span></li><li>Create a new article:</li><ol><li>With the "New article" button on the bottom left corner of the screen.</li><li>With the "+" button in each article on the left, to create an article inside another.</li><li>With the search bar typing the name of your article and selecting the "Add article" option.</li></ol><li>Search for an article with the search bar.</li><li>Navigate through articles with breadcrumbs.</li><li>Favorite a specific article.</li><li>Modify the content of an article and watch the modifications list.</li><li>Move an article inside another by drag n drop.</li></ol>`,
              parentId: null,
              authorId: 1
            }).then(() => {
              return { token: token };
            });
          } else {
            return { token: token };
          }
        })
        .catch(err => {
          if (err.errors[0].message.includes("username")) {
            return dataBase.Users.findOne({
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
      return dataBase.Users.findByPk(userId)
        .then(user => {
          if (!user || !user.dataValues) {
            throw new UserInputError("Authentication Error.");
          }
          return dataBase.Articles.create({
            title: title,
            icon: icon || "📒",
            content: content || "<p>Here is some content for your Article</p>",
            parentId: parentId || null,
            authorId: userId
          })
            .then(article => {
              return article;
            })
            .catch(err => {
              throw new UserInputError("Icon too long");
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
      const user = await dataBase.Users.findByPk(userId);
      if (!user || !user.dataValues) {
        throw new UserInputError("Authentication Error.");
      }
      const article = await dataBase.Articles.findByPk(articleId);
      if (!article || !article.dataValues) {
        throw new UserInputError("Article not found Error.");
      }
      const updateReturn = await dataBase.Articles.update(
        { content: newContent || "<p></p>" },
        {
          returning: true,
          where: {
            id: articleId
          }
        }
      );
      const articleToReturn = updateReturn[1][0];
      const lastModification = await dataBase.Modifications.findOne({
        where: { authorId: userId, articleId: articleId },
        order: [["updatedAt", "DESC"]]
      });
      if (
        lastModification?.dataValues?.updatedAt &&
        moment(lastModification.dataValues.updatedAt).isSame(moment(), "minute")
      ) {
        await dataBase.Modifications.update(
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
        const nuevaModification = await dataBase.Modifications.create({
          newContent: newContent,
          articleId: articleId,
          authorId: userId
        });
      }
      return articleToReturn;
    },
    moveArticle: async (
      _,
      { input: { subArticleId, parentId } },
      { dataBase }
    ) => {
      const article = await dataBase.Articles.findByPk(parentId);
      const articleWithParents = [article];
      let parent = await dataBase.Articles.findByPk(article.parentId);
      while (parent) {
        articleWithParents.push(parent);
        const newParentId = parent.parentId;
        parent = newParentId
          ? await dataBase.Articles.findByPk(newParentId)
          : null;
      }
      if (subArticleId === parentId) {
        throw new UserInputError("Article can not be moved to itself.");
      } else if (
        articleWithParents.filter(parent => parent.id == subArticleId)
          .length === 0
      ) {
        return dataBase.Articles.update(
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
        throw new UserInputError("Article can not be moved to its child.");
      }
    },
    favoriteArticle: (_, { id }, { dataBase, userId }) => {
      return dataBase.Articles.findByPk(id).then(article => {
        return dataBase.Favorites.findAll({
          where: { articleId: id, userId: userId }
        })
          .then(favorites => {
            return !favorites || favorites.length === 0
              ? dataBase.Favorites.create({
                  articleId: id,
                  userId: userId
                }).then(() => {
                  return article;
                })
              : article;
          })
          .catch(() => {
            return dataBase.Favorites.create({
              articleId: id,
              userId: userId
            }).then(favorite => {
              return article;
            });
          });
      });
    },
    unfavoriteArticle: (_, { id }, { dataBase, userId }) => {
      return dataBase.Articles.findByPk(id)
        .then(() => {
          return dataBase.Favorites.findOne({
            where: { articleId: id, userId: userId }
          })
            .then(favorite => {
              return favorite
                ? favorite.destroy().then(() => {
                    return true;
                  })
                : true;
            })
            .catch(() => {
              return true;
            });
        })
        .catch(() => {
          throw new UserInputError("Article to be favorited does not exists.");
        });
    }
  },
  Article: {
    tags: article => article.getTags(),
    parent: article => article.getParent(),
    author: article => article.getAuthor(),
    articles: article => article.getArticles(),
    favorites: article => article.getFavorites()
  },
  Tag: {
    articles: tag => tag.getArticles()
  },
  User: {
    articles: user => user.getArticles(),
    favorites: user => user.getFavorites()
  },
  Modification: {
    article: modification => modification.getArticle(),
    author: modification => modification.getAuthor()
  }
};

export default resolvers;

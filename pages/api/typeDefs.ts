import { gql } from "apollo-server-micro";

const typeDefs = gql`
  scalar Date

  type Query {
    me: User!
    getUsers: [User]!
    getUser(email: String!): User!
    getArticles: [Article]!
    getArticle(id: ID!): Article!
    getSubArticles(id: ID!): [Article]!
    getRootArticles: [Article]!
    getFirstArticle: Article
    getArticleWithParents(id: ID!): [Article]!
    getModifications: [Modification]!
    getArticleModifications(id: ID!): [Modification]!
    getUserFavorites: [Article]!
    isArticleFavorite(id: ID!): Boolean!
  }

  type Mutation {
    signupUser(
      username: String!
      email: String!
      password: String!
    ): AuthPayLoad!
    login(usernameOrEmail: String!, password: String!): AuthPayLoad!
    createArticle(input: InputCreateArticle!): Article!
    updateArticle(input: InputUpdateArticle!): Article!
    moveArticle(input: InputMoveArticle!): Article!
    favoriteArticle(id: ID!): Article!
    unfavoriteArticle(id: ID!): Boolean!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: Role!
    articles: [Article]!
    favorites: [Article]!
    createdAt: Date
    updatedAt: Date
  }

  type Article {
    id: ID!
    title: String!
    icon: String!
    content: String!
    tags: [Tag!]!
    parent: Article
    articles: [Article]!
    favorites: [User]!
    author: User!
    createdAt: Date
    updatedAt: Date
  }

  type Modification {
    id: ID!
    newContent: String!
    previousContent: String!
    article: Article!
    author: User!
    createdAt: Date
    updatedAt: Date
  }

  type Tag {
    id: ID!
    name: String!
    articles: [Article!]!
    createdAt: Date
    updatedAt: Date
  }

  type AuthPayLoad {
    token: String!
  }

  input InputCreateArticle {
    title: String!
    icon: String
    content: String
    parentId: ID
  }

  input InputUpdateArticle {
    newContent: String!
    articleId: ID!
  }

  input InputMoveArticle {
    subArticleId: ID!
    parentId: ID!
  }

  enum Role {
    USER
    ADMIN
  }
`;

export default typeDefs;

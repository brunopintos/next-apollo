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
    getModifications: [Modification]!
    getArticleModifications(id: ID!): [Modification]!
  }

  type Mutation {
    signupUser(
      username: String!
      email: String!
      password: String!
    ): AuthPayLoad!
    login(usernameOrEmail: String!, password: String!): AuthPayLoad!
    logout: Boolean!
    createArticle(input: InputCreateArticle!): Article!
    updateArticle(input: InputUpdateArticle!): Article!
    moveArticle(input: InputMoveArticle!): Article!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: Role!
    articles: [Article]!
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
    author: User!
    createdAt: Date
    updatedAt: Date
  }

  type Modification {
    id: ID!
    newContent: String!
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

import { gql } from "apollo-server-micro";

const typeDefs = gql`
  scalar Date

  type Query {
    getUsers: [User]!
    getUser(email: String!): User
    getArticles: [Article]!
  }

  type Mutation {
    signupUser(username: String!, email: String!, password: String!): User!
    login(usernameOrEmail: String!, password: String!): User
    createArticle(input: InputCreateArticle!): Article!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: Role!
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
    author: User!
    isFavourite: Boolean!
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

  input InputCreateArticle {
    title: String!
    icon: String
    parentId: ID
    authorId: ID!
  }

  enum Role {
    USER
    ADMIN
  }
`;

export default typeDefs;

import { gql } from "apollo-server-micro";

const typeDefs = gql`
  scalar Date

  type Query {
    getUsers: [User]!
    getUser(email: String!): User
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
    password: String!
    createdAt: Date
    updatedAt: Date
  }

  type Article {
    id: ID!
    title: String!
    icon: String!
    content: Content!
    tags: [Tag]
    parent: Article!
    owner: User!
    isFavourite: Boolean!
    createdAt: Date
    updatedAt: Date
  }

  type Content {
    id: ID!
    data: [String]!
    createdAt: Date
    updatedAt: Date
  }

  type Tag {
    id: ID!
    name: String!
    createdAt: Date
    updatedAt: Date
  }

  input InputCreateArticle {
    title: String!
    icon: String
    parent: Article
    owner: User!
  }
`;

export default typeDefs;

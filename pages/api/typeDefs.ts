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
  }

  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    createdAt: Date
    updatedAt: Date
  }
`;

export default typeDefs;

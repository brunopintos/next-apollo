import { gql } from "apollo-server-micro";

const typeDefs = gql`
  scalar Date

  type Query {
    getUsers: [User]!
    getUser(email: String!): User
  }

  type Mutation {
    login(email: String!, password: String!): User
    signupUser(email: String!, password: String!): User
  }

  type User {
    id: ID!
    email: String!
    password: String!
    createdAt: Date
    updatedAt: Date
  }
`;

export default typeDefs;

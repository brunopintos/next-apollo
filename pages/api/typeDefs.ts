import { gql } from "apollo-server-micro";

const typeDefs = gql`
  type Query {
    getUsers: [User]!
    getUser(id: ID!): User
    login(email: String!, password: String!): User
  }
  type Mutation {
    createUser(id: ID!, email: String!, password: String!): User
  }
  type User {
    id: ID!
    email: String!
    password: String!
  }
`;

export default typeDefs;

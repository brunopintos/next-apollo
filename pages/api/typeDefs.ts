import { gql } from "apollo-server-micro";

const typeDefs = gql`
  type Query {
    getUsers: [User]!
    getUser(email: String!): User
  }
  type Mutation {
    login(email: String!, password: String!): User
    createUser(email: String!, password: String!): User
  }
  type User {
    id: ID!
    email: String!
    password: String!
  }
`;

export default typeDefs;

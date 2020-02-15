import { ApolloServer } from "apollo-server-micro";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import dataBase from "./models/index";
import jwt from "jsonwebtoken";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: async ({ req, res }: any) => {
    const token = req?.cookies?.token || "";
    const user = token ? await jwt.verify(token, "supersecret") : undefined;
    return { dataBase, req, res, userId: user ? user.id : -1 };
  }
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default apolloServer.createHandler({ path: "/api/graphql" });

import { ApolloServer, gql } from "apollo-server";
import { Query } from "./resolvers/Query"
import { typeDefs } from "./schema"
import { Mutation } from "./resolvers/Mutation";
import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

export interface Context {
    prisma : PrismaClient
}

const server = new ApolloServer({
typeDefs, resolvers : {
    Query, Mutation
},
context : { prisma }
})
server.listen().then(({ url }) => {
console.log(`Server ready on ${url}`);
})
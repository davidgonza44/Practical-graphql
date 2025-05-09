import { ApolloServer, gql } from "apollo-server";
import { Query } from "./resolvers/Query"
import { typeDefs } from "./schema"
import { Mutation } from "./resolvers/Mutation";
import { PrismaClient } from './generated/prisma';
import { getUser } from "./utils/getUser";

const prisma = new PrismaClient();

export interface Context {
    prisma : PrismaClient,
    userInfo: {userId : number} | null
}

const server = new ApolloServer({
typeDefs, resolvers : {
    Query, Mutation
},
context : async({req} : any) : Promise<Context> => {
    const userInfo = await getUser(req.headers.authorization)
    return { prisma, userInfo }
}
})
server.listen().then(({ url }) => {
console.log(`Server ready on ${url}`);
})
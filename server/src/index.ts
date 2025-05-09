import { ApolloServer, gql } from "apollo-server";
import { Query } from "./resolvers/Query"
import { typeDefs } from "./schema"


const server = new ApolloServer({
typeDefs, resolvers : {
    Query
}
})
server.listen().then(({ url }) => {
console.log(`Server ready on ${url}`);
})
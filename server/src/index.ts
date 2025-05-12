import { ApolloServer, gql } from "apollo-server";
import { Query } from "./resolvers/Query"
import { typeDefs } from "./schema"
import { Mutation } from "./resolvers/Mutation";
import { PrismaClient } from './generated/prisma';
import { getUser } from "./utils/getUser";
import { Post } from "./resolvers/Post";
import { Profile } from "./resolvers/Profile";
import { User } from "./resolvers/Usert";


const allowedOrigins = [
    "http://localhost:5173",          // Tu cliente frontend (si tienes uno)
    "https://studio.apollographql.com"  // Apollo Studio
    // "http://localhost:5555"        // Si quisieras permitir Prisma Studio, aunque no es el problema actual
];

const prisma = new PrismaClient();

export interface Context {
    prisma : PrismaClient,
    userInfo: {userId : number} | null
}

const server = new ApolloServer({
typeDefs, resolvers : {
    Query, Mutation, Post, Profile, User
},
context : async({req} : any) : Promise<Context> => {
    const userInfo = await getUser(req.headers.authorization)
    return { prisma, userInfo }
},
    cors: {
        origin: (origin, callback) => {
            // `origin` será undefined para solicitudes del mismo origen o algunas herramientas como curl
            // Permitir solicitudes sin 'origin' (como Postman, curl, o si el servidor y el cliente están en el mismo host y puerto, aunque aquí es cross-origin)
            // O si el origen está en nuestra lista de permitidos.
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.error(`CORS Error: Origin ${origin} not allowed.`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,               // ¡MUY IMPORTANTE para permitir credentials: "include"!
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    },
})

server.listen(4000).then(({ url }) => {
console.log(`Server ready on ${url}`);
})
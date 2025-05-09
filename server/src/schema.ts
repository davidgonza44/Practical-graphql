import { gql } from "apollo-server"


export const typeDefs = gql`
    type Query {
        hello : String!
    }

    type Mutation{
        postCreate(title: String!, Content : String!) : PostPayload
    }

    type UserError {
        message : String
    }
`
import { gql } from "apollo-server"


export const typeDefs = gql`
    type Query {
        posts : [Post!]!
        me : User
        profile(userId : ID!) : Profile
    }

    type Mutation{
        postCreate(input : PostInput!) : PostPayload
        postUpdate(postId : ID!, post : PostInput!) : PostPayload!
        postDelete(postId : ID!) : PostPayload!
        postPublish(postId : ID!) : PostPayload!
        postUnpublish(postId : ID!) : PostPayload!
        signup( credentials : CredentialsInput, name : String!, bio : String!) : AuthPayload!
        signin(credentials : CredentialsInput) : AuthPayload!
    }

    type UserError {
        message : String
    }

    type PostPayload {
        userErrors : [UserError!]!
        post : Post
    }

    type AuthPayload {
        userErrors : [UserError!]!
        token : String
    }

    input CredentialsInput {
        email : String!
        password : String!
    }

    input PostInput{
        title : String!
        content : String!
    }

    type Post{
        id : ID!,
        title : String!,
        content : String!,
        createdAt: String!,
        published : Boolean!
        user : User!
    }

    type User {
        id : ID!
        name : String!,
        email: String!,
        profile : Profile!,
        posts : [Post!]!
    }

    type Profile{
        id : ID!,
        bio : String!,
        user : User!
        isMyProfile : Boolean!
    }
`
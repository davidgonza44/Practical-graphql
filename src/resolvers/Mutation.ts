import { Context } from "../index";
import validator from 'validator';
import { Post, Prisma } from "../generated/prisma"
import bcrypt from 'bcryptjs'
import JWT from "jsonwebtoken";
import { JWT_SIGNATURE } from '../keys';


interface PostArgs {
    title ?: string,
    content ?: string
}

interface PostPayloadType {
    userErrors : { message : string }[],
    post : Post | Prisma.Prisma__PostClient<Post> |  null
}

interface UpdatePostArgs{
    postId : string,
    post : PostArgs
}

interface SignupArgs{
    credentials : {
        email : string;
        password : string;
    }
    name : string;
    bio : string;
}

interface SigninArgs {
    credentials: {
        email : string,
        password : string
    }
}


interface UserPayload {
    userErrors : { message : string }[];
    token : string | null
}

export const Mutation = {
    signin :async(_ : any, { credentials } : SigninArgs , { prisma } : Context) : Promise<UserPayload> => {
        const { email, password } = credentials
        const user = await prisma.user.findUnique({where : {email}})
        if (!user) return {
            userErrors : [{ message : "Invalid credentials"}],
            token : null
        }
        const isMatch = bcrypt.compare(password, user.password)
        if (!isMatch) return {userErrors : [{message : "Invalid credentials"}], token : null}
        const token = await JWT.sign({ userId : user.id}, JWT_SIGNATURE, {expiresIn : 3600})
        return { userErrors : [], token }

    },
    signup : async (_ : any, { credentials , name, bio } : SignupArgs, { prisma } : Context) : Promise<UserPayload>=> {
        const { email, password } = credentials;
        const isEmail = validator.isEmail(email)
        if (!isEmail) return { userErrors : [{ message : "Invalid email"}], token : null}
        const isValidPassword = validator.isLength(password, { min : 5})
        if (!isValidPassword) return { userErrors : [{ message : "Invalid password"}], token : null}
        if (!name || !bio) return {userErrors : [{ message : "Bio or name invalid"}], token : null}
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data : {
                email, name, password : hashedPassword
            }
        })
        await prisma.profile.create({data : { bio , userId : user.id }})
        const token = await JWT.sign({ userId : user.id}, JWT_SIGNATURE, {expiresIn : 3600})
        return { userErrors : [], token }},

        postCreate: async(_ : any, { input } : { input : PostArgs}, {prisma, userInfo} : Context) :
        Promise<PostPayloadType>  => {
            const { title, content } = input
            if (!userInfo) return {
                userErrors : [{
                    message: "Forbidden Access (unathenticated)"
                }],
                post : null
            }
            if (!title || !content){
                return {
                    userErrors : [{
                        message : "Title and content are required",
                    }], post : null
                }
            }
            const post = prisma.post.create(
                {
                    data : {
                        title,
                        content,
                        authorId : userInfo.userId
                    }
                }
            )
            return { userErrors : [], post}
        },

        postUpdate : async(_: any, {post, postId} : { postId : string , post : PostArgs}, { prisma } : Context) : Promise<PostPayloadType>=> {
            const { title, content } = post
            if (!title && !content){
                return {
                    userErrors : [{
                        message : "At least one field required"
                    }],
                    post : null
                }
            }

            const existingPost = await prisma.post.findUnique({
                where : {
                    id : Number(postId)
                }
            })

            if (!existingPost){
                return {
                    userErrors : [{
                        message : "Post does not exist",
                    }],
                    post : null
                }
            }

            let payloadToUpdate = { title, content}
            if (!title) delete payloadToUpdate.title
            if (!content) delete payloadToUpdate.content

            return {
                userErrors : [],
                post: prisma.post.update({
                    data : {...payloadToUpdate},
                    where : { id : Number(postId)}
                })
            }
        },

        postDelete : async(_ : any, { postId } : { postId : string }, { prisma } : Context) : Promise<PostPayloadType> => {
            const post = await prisma.post.findUnique({ where : { id : Number(postId)}})
            if (!post){
                return {
                    userErrors : [{
                        message : "Post does not exist"
                    }],
                    post : null
                }
            }

            await prisma.post.delete({
                where : {
                    id : Number(postId)
                }
            });
            return { userErrors : [], post}
        }

    }



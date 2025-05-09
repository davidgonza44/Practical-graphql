import { Context } from "../index";
import { Post, Prisma } from "../generated/prisma"


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
    email : string;
    name : string;
    password : string;
    bio : string;
}

interface UserPayload {
    userErrors : { message : string }[];
    user : null
}

export const Mutation = {
    // signup : async (_ : any, { email , name, password } : SignupArgs, { prisma } : Context) : Promise<UserPayload>=> {
    //     const isEmail = validator.isEmail(email)
    //     return prisma.user.create({
    //         data : {
    //             email, name, password
    //         }
    //     })
    // },

    postCreate: async(_ : any, { title , content } : PostArgs, {prisma} : Context) :
    Promise<PostPayloadType>  => {
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
                    authorId : 1
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
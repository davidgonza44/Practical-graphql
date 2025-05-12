import { Context } from "../index";

interface PostParentType {
    authorId : number
}

export const Post = {
    user: (parent: PostParentType, _args: any, { prisma }: Context) => {
    // parent es el post, y debe tener authorId
        return prisma.user.findUnique({ where: { id: parent.authorId } });
    }
};
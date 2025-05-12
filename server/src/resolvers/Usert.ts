import { Context } from "..";


interface UserParentType {
    id : number
}
export const User = {
    posts: (parent: UserParentType, __: any, { prisma, userInfo }: Context) => {
        const same = parent.id === userInfo?.userId
        if (!same){
            return prisma.post.findMany({
                where : {
                    published : true,
                    authorId : parent.id
                }, orderBy : {
                    createdAt : 'desc'
                }
            })
        }

        return prisma.post.findMany({
            where : {
                authorId : parent.id
            }, orderBy : {
                createdAt : 'desc'
            }
        })


    },
}
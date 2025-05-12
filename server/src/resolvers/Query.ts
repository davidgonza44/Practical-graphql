import {Context } from "../index"

export const Query = {
    posts: (_: any, __ : any, { prisma } : Context) => {
        return prisma.post.findMany({
            where : { published : true},
            orderBy : [{createdAt : "desc"}]
            }
        )
    },

    me : (_ : any , __ : any, { userInfo, prisma } : Context ) => {
        if (!userInfo) return null
        return prisma.user.findUnique({
            where : {
                id : userInfo.userId
            }
        })
    },

    profile : async(_ : any, {userId} : {userId : string}, { userInfo, prisma } : Context) => {
        const isMyProfile = userInfo ? Number(userId) === Number(userInfo.userId) : false
        const profile = await prisma.profile.findUnique({
            where : {
                userId : Number(userId)
            }
        })
        return {...profile, isMyProfile}
    }
}
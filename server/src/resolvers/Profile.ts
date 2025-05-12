import { Context } from "..";

interface ProfileParentType{
    id : string,
    userId : number,
    bio : string,
}

export const Profile  = {
    user : (parent : ProfileParentType, __ : any, { userInfo, prisma } : Context) => {
        return prisma.user.findUnique({
            where : {
                id : parent.userId
            }
        })
    }
}
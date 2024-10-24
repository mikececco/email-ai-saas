import { createTRPCRouter, privateProcedure } from "../trpc";

export const accountRouter = createTRPCRouter({ //to group different routes together
    getAccounts: privateProcedure.query(async({ctx}) => {
        return await ctx.db.account.findMany({
            where: {
                userId: ctx.auth.userId
            },
            select: {
                id: true, emailAddress: true, name: true
            }
        })
    })
})
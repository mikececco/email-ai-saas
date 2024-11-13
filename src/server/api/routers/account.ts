import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { db } from "~/server/db";
import { Prisma } from "@prisma/client";

export const authoriseAccountAccess = async (accountId: string, userId: string) => {
    const account = await db.account.findFirst(
        {
            where: {
                id: accountId,
                userId
            },
            select: {
                id: true, emailAddress: true, name: true, accessToken: true //extract those fields from the retrieved account
            }
        }
    )
    if (!account) throw new Error('Account not found')
    
    return account
}

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
    }),
    getEmailSuggestions: privateProcedure.input(z.object({
        accountId: z.string(),
        query: z.string(),
    })).query(async ({ ctx, input }) => {
        const account = await authoriseAccountAccess(input.accountId, ctx.auth.userId)
        return await ctx.db.emailAddress.findMany({
            where: {
                accountId: input.accountId,
                OR: [
                    {
                        address: {
                            contains: input.query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        name: {
                            contains: input.query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            select: {
                address: true,
                name: true,
            },
            take: 10,
        })
    }),
    getNumThreads: privateProcedure.input(z.object({
        accountId: z.string(),
        tab: z.string()
    })).query(async({
        ctx, input
    }) => {
        const account = await authoriseAccountAccess(input.accountId, ctx.auth.userId)

        let filter: Prisma.ThreadWhereInput = {}

        if (input.tab === 'inbox') {
            filter.inboxStatus = true
        } else if (input.tab === 'draft') {
            filter.draftStatus = true
        } else if (input.tab === 'sent') {
            filter.sentStatus = true
        }

        return await ctx.db.thread.count({
            where: {
                accountId: account.id,
                ...filter
            }
        })
    }),
    getThreads: privateProcedure.input(z.object({
        accountId: z.string(),
        tab: z.string(),
        done: z.boolean().optional()
    })).query(async({
        ctx, //userId and db
        input
    }) => {
        const account = await authoriseAccountAccess(input.accountId, ctx.auth.userId)

        let filter: Prisma.ThreadWhereInput = {}

        if (input.tab === 'inbox') {
            filter.inboxStatus = true
        } else if (input.tab === 'draft') {
            filter.draftStatus = true
        } else if (input.tab === 'sent') {
            filter.sentStatus = true
        }

        filter.done = {
            equals: input.done
        }

        return await ctx.db.thread.findMany({
            where: filter,
            include: {
                emails:  {//join 
                    orderBy: {
                        sentAt: 'asc'
                    },
                    select: {
                        from: true,
                        body: true,
                        bodySnippet: true,
                        emailLabel: true,
                        subject: true,
                        sysLabels: true,
                        id: true,
                        sentAt: true
                    }
                }, 
            },
            take: 15,
            orderBy: {
                lastMessageDate: 'desc'
            }
        })
    }),
})
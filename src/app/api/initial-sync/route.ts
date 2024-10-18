import { NextRequest, NextResponse } from "next/server";
import { Account } from "~/lib/account";
import { db } from "~/server/db";

export const POST = async (req: NextRequest) => {
    const {accountId, userId} = await req.json()

    if (!accountId || !userId) {
        return NextResponse.json({message: 'Missing accountId or userId'}, {status: 400})
    }

    const dbAccount = await db.account.findUnique({
        where: {
            id: accountId,
            userId
        }
    })

    if (!dbAccount) return NextResponse.json({message: 'Account not found'}, {status: 404})

    const account = new Account(dbAccount.accessToken)
    //perform initial sync
    const emails = await performInitialSync
}
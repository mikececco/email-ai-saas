import { NextRequest, NextResponse } from "next/server";
import { Account } from "~/lib/account";
import { syncEmailsToDatabase } from "~/lib/sync-to-db";
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

    console.log('INITIAL TOKEENENEN',dbAccount.accessToken);
        

    const account = new Account(dbAccount.accessToken)
    //perform initial sync
    const response = await account.performInitialSync()

    if (!response) {
        return NextResponse.json({error: 'Failed to sync'}, {status: 500})
    }

    const {emails, deltaToken} = response

    console.log(emails);
    

    // await db.account.update({
    //     where:{
    //         id: accountId
    //     },
    //     data: {
    //         nextDeltaToken: deltaToken
    //     }
    // })

    await syncEmailsToDatabase(emails, accountId)

    return NextResponse.json({success: true}, {status: 200})
}
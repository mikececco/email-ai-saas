import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForAccessToken, getAccountDetails } from "~/lib/aurinko";
import { db } from "~/server/db";

export const GET = async (req: NextRequest) => {
    const {userId} = await auth()

    if (!userId) return NextResponse.json({message: 'Unauthroized'}, {status: 401})

    const params = req.nextUrl.searchParams

    const status = params.get('status')
    if (status != 'success') return NextResponse.json({message: 'Failed to link account'}, {status: 400})
    
    const code = params.get('code')
    if (!code) return NextResponse.json({message: 'No code'}, {status: 400})

    const token = await exchangeCodeForAccessToken(code)

    if (!token) return NextResponse.json({message: 'Failed to exchange code with token'}, {status: 400})

    
    const accountDetails = await getAccountDetails(token.accessToken)    

    await db.account.upsert({
        where: {
            id: token.accountId.toString()
        },
        update: {
            accessToken: token.accessToken
        },
        create: {
            id: token.accountId.toString(),
            userId,
            emailAddress: accountDetails.email,
            name: accountDetails.name,
            accessToken: token.accessToken
        }
    }) //update if exists or insert if not

    

    return NextResponse.json({ message: 'Hello' }, { status: 200 });
    
}
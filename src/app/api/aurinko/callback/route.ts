import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForAccessToken, getAccountDetails } from "~/lib/aurinko";
import { db } from "~/server/db";
import {waitUntil} from '@vercel/functions'
import axios from "axios";

export const GET = async (req: NextRequest) => {
    const {userId} = await auth()

    if (!userId) return NextResponse.json({message: 'Unauthroized'}, {status: 401})

    const params = req.nextUrl.searchParams

    const status = params.get('status')
    if (status != 'success') return NextResponse.json({message: 'Failed to link account'}, {status: 400})
    
    const code = params.get('code')
    if (!code) return NextResponse.json({message: 'No code'}, {status: 400})

    const token = await exchangeCodeForAccessToken(code as string)

    if (!token) return NextResponse.json({message: 'Failed to exchange code with token'}, {status: 400})

    
    const accountDetails = await getAccountDetails(token.accessToken)    

    await db.account.upsert({
        where: { id: token.accountId.toString() },
        create: {
            id: token.accountId.toString(),
            userId,
            accessToken: token.accessToken,
            emailAddress: accountDetails.email,
            name: accountDetails.name
        },
        update: {
            accessToken: token.accessToken,
        }
    }) //update if exists or insert if not

    // trigger initial sync
    console.log('Trigger sync');
    waitUntil(

        axios.post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, { accountId: token.accountId.toString(), userId }).then((res) => {
            console.log(res.data)
        }).catch((err) => {
            console.log(err.response.data)
        })
    )


    return NextResponse.redirect(new URL('/mail', req.url));
    
}
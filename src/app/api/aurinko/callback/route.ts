import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForAccessToken } from "~/lib/aurinko";

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

    
        console.log(userId);

    return NextResponse.json({ message: 'Hello' }, { status: 200 });
    
}
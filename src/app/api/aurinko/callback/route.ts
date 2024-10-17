import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const {userId} = await auth()

    if (!userId) return NextResponse.json({message: 'Unauthroized'}, {status: 401})

    const params = req.nextUrl.searchParams

    const status = params.get('status')
    if (status != 'success') return NextResponse.json({message: 'Failed to link account'}, {status: 400})
    
    const code = params.get('code')
    if (code != 'success') return NextResponse.json({message: 'Failed to link account'}, {status: 400})
    
        console.log(userId);

    return NextResponse.json({ message: 'Hello' }, { status: 200 });
    
}
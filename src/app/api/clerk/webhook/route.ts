import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { data } = await req.json();

    console.log('Webhook received', data);

    return new Response('Done', { status: 200 });
}
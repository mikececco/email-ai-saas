import { NextRequest } from "next/server";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
    const { data } = await req.json();

    const email = data.email_addresses[0].email_address;

    const firstName = data.first_name;
    const lastName = data.last_name;
    const imageUrl = data.image_url;
    const id = data.id;

    await db.user.create({
        data: {
            email,
            firstName,
            lastName,
            imageUrl,
            id,
        },
    });


    console.log('Webhook received', data);

    return new Response('Done', { status: 200 });
}